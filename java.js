// Мобильное меню
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Данные по тендерам (имитация актуальных закупок)
const tenderData = [
    {
        title: "Охрана школы №42 (пост 24/7)",
        customer: "МБОУ СОШ №42, г. Иваново",
        nmck: "4 574 191 ₽",
        details: "Приказ №45, 2 охранника в смену, ГБР на подхвате. Окончание заявок: 20.06.2026"
    },
    {
        title: "Охрана складского комплекса «Логистик-парк»",
        customer: "ООО «СеверСклад»",
        nmck: "9 210 000 ₽",
        details: "Требуется мобильная группа (ГБР). Конкурс с квалификационными баллами."
    },
    {
        title: "ТРЦ «Гранд» — ночное патрулирование",
        customer: "ООО «ТРЦ Менеджмент»",
        nmck: "3 875 500 ₽",
        details: "Антидемпинг, обеспечение контракта 5% (банковская гарантия)."
    },
    {
        title: "Промзона «Западная» — КПП и периметр",
        customer: "АО «ПромТех»",
        nmck: "7 250 000 ₽",
        details: "Стационарный пост + ГБР, опыт от 1 года аналогичных объектов."
    }
];

function renderTenders() {
    const container = document.getElementById('tenderList');
    if (!container) return;
    container.innerHTML = '';
    tenderData.forEach(tender => {
        const item = document.createElement('div');
        item.className = 'tender-item';
        item.innerHTML = `
            <div class="tender-info">
                <h4><i class="fas fa-shield-alt" style="margin-right: 8px; color:#0b3b5f;"></i> ${tender.title}</h4>
                <p>${tender.customer} · ${tender.details}</p>
            </div>
            <div class="tender-price">${tender.nmck}</div>
        `;
        container.appendChild(item);
    });
}

// Функция имитации обновления
function refreshTenders() {
    const btn = document.getElementById('refreshTenders');
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Обновление...';
    setTimeout(() => {
        renderTenders();
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить предложения';
    }, 800);
}

// Демонстрационное напоминание о сроках документов
function showLegalReminder() {
    if (localStorage.getItem('legalTipShown') === 'true') return;
    setTimeout(() => {
        const tipDiv = document.createElement('div');
        tipDiv.style.position = 'fixed';
        tipDiv.style.bottom = '20px';
        tipDiv.style.right = '20px';
        tipDiv.style.backgroundColor = '#0b3b5f';
        tipDiv.style.color = 'white';
        tipDiv.style.padding = '12px 20px';
        tipDiv.style.borderRadius = '40px';
        tipDiv.style.fontSize = '0.85rem';
        tipDiv.style.zIndex = '999';
        tipDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        tipDiv.style.cursor = 'pointer';
        tipDiv.innerHTML = '📋 Напоминание: проверьте сроки лицензии и ЭЦП! <i class="fas fa-times-circle" style="margin-left: 12px;"></i>';
        document.body.appendChild(tipDiv);
        tipDiv.onclick = () => tipDiv.remove();
        localStorage.setItem('legalTipShown', 'true');
        setTimeout(() => {
            if (tipDiv && tipDiv.remove) tipDiv.remove();
        }, 8000);
    }, 1500);
}

// Инициализация
renderTenders();
showLegalReminder();

const refreshBtn = document.getElementById('refreshTenders');
if (refreshBtn) refreshBtn.addEventListener('click', refreshTenders);

// Закрытие мобильного меню при клике на ссылку
const allLinks = document.querySelectorAll('.nav-links a');
allLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Добавление дополнительной информации в блок тендеров
const tenderBlock = document.querySelector('.tender-block');
if (tenderBlock) {
    const infoDiv = document.createElement('div');
    infoDiv.style.marginTop = '16px';
    infoDiv.style.fontSize = '0.9rem';
    infoDiv.style.display = 'flex';
    infoDiv.style.gap = '15px';
    infoDiv.style.flexWrap = 'wrap';
    infoDiv.style.justifyContent = 'center';
    infoDiv.innerHTML = `
        <span><i class="fas fa-check-circle" style="color:#0b3b5f;"></i> Работаем по 44-ФЗ</span>
        <span><i class="fas fa-check-circle" style="color:#0b3b5f;"></i> Обеспечение: банковская гарантия</span>
        <span><i class="fas fa-check-circle" style="color:#0b3b5f;"></i> Антидемпинг — под контролем</span>
    `;
    tenderBlock.appendChild(infoDiv);
}