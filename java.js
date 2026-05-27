// Плавный скролл для якорных ссылок
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#order-page') return; // для кнопки заказа есть отдельный обработчик
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Создание страницы заказа (модальное окно)
const orderPageDiv = document.createElement('div');
orderPageDiv.id = 'orderPage';
orderPageDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0a0a00;
    z-index: 1000;
    overflow-y: auto;
    padding: 40px 20px;
    backdrop-filter: blur(12px);
    display: none;
    transition: 0.3s;
`;
orderPageDiv.innerHTML = `
    <div style="max-width: 650px; margin: 0 auto; background: #000000cc; border: 2px solid #FFC107; border-radius: 48px; padding: 32px 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="color: #FFC107; font-size: 2rem;"><i class="fas fa-bug"></i> Оставить заявку</h2>
            <button id="closeOrderPage" style="background: none; border: none; font-size: 2rem; color: #FFC107; cursor: pointer;">&times;</button>
        </div>
        <form id="requestForm">
            <div style="margin-bottom: 20px;">
                <label style="color:#FFD966; display:block; margin-bottom:6px;">Ваше имя *</label>
                <input type="text" id="userName" required style="width:100%; padding:12px; border-radius: 40px; border: none; background:#2c2c1a; color:#FFD966; font-size:1rem;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="color:#FFD966; display:block; margin-bottom:6px;">Контактный телефон *</label>
                <input type="tel" id="userPhone" required style="width:100%; padding:12px; border-radius: 40px; background:#2c2c1a; color:#FFD966; border:none;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="color:#FFD966; display:block; margin-bottom:6px;">Email (опционально)</label>
                <input type="email" id="userEmail" style="width:100%; padding:12px; border-radius: 40px; background:#2c2c1a; color:#FFD966; border:none;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="color:#FFD966; display:block; margin-bottom:6px;">Тип услуги / сотрудничество</label>
                <select id="serviceType" style="width:100%; padding:12px; border-radius: 40px; background:#2c2c1a; color:#FFD966; border:none;">
                    <option>Охрана объекта (стационарный пост)</option>
                    <option>Консультация</option>
                    <option>Сотрудничество / партнерство</option>
                </select>
            </div>
            <div style="margin-bottom: 24px;">
                <label style="color:#FFD966; display:block; margin-bottom:6px;">Детали запроса</label>
                <textarea id="message" rows="3" style="width:100%; padding:12px; border-radius: 24px; background:#2c2c1a; color:#FFD966; border:none;" placeholder="Опишите объект, требуемые услуги или предложение о сотрудничестве..."></textarea>
            </div>
            <button type="submit" style="background:#FFC107; border:none; padding:14px 24px; border-radius: 40px; font-weight: bold; font-size:1rem; width:100%; cursor:pointer;">📩 Отправить запрос</button>
            <p style="color:#FFD966aa; font-size:0.8rem; margin-top: 15px;">Нажимая «Отправить», вы соглашаетесь с обработкой данных. Менеджер свяжется с вами в течение часа.</p>
        </form>
    </div>
`;
document.body.appendChild(orderPageDiv);

// Функции открытия/закрытия
function openOrderPage() {
    orderPageDiv.style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeOrderPage() {
    orderPageDiv.style.display = 'none';
    document.body.style.overflow = '';
}

// Обработчики кнопок заказа
const orderFloatBtn = document.getElementById('orderFloatBtn');
const orderNavBtn = document.getElementById('orderNavBtn');
if (orderFloatBtn) orderFloatBtn.addEventListener('click', openOrderPage);
if (orderNavBtn) orderNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrderPage();
});

// Кнопка закрытия
const closeBtn = document.getElementById('closeOrderPage');
if (closeBtn) closeBtn.addEventListener('click', closeOrderPage);

// Закрытие при клике на фон
orderPageDiv.addEventListener('click', (e) => {
    if (e.target === orderPageDiv) closeOrderPage();
});

// Обработка отправки формы
const form = document.getElementById('requestForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    if (!name || !phone) {
        alert("Пожалуйста, заполните имя и телефон.");
        return;
    }
    alert(`Спасибо, ${name}! Ваша заявка принята. Наш специалист свяжется с вами по номеру ${phone} в ближайшее время.`);
    form.reset();
    closeOrderPage();
});
