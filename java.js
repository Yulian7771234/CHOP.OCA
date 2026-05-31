// Плавный скролл для ссылок
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#order-page') return;
        const target = document.querySelector(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== МОДАЛЬНОЕ ОКНО ЗАКАЗА (без поля "Тип услуги", отправка на Formspree) =====
const orderPageDiv = document.createElement('div');
orderPageDiv.id = 'orderPage';
orderPageDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0a00;z-index:1000;overflow-y:auto;padding:40px 20px;backdrop-filter:blur(12px);display:none;';
orderPageDiv.innerHTML = `
    <div style="max-width:650px;margin:0 auto;background:#000000cc;border:2px solid #FFC107;border-radius:48px;padding:32px 28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="color:#FFC107;font-size:2rem;"> Оставить заявку</h2>
            <button id="closeOrderPage" style="background:none;border:none;font-size:2rem;color:#FFC107;cursor:pointer;">&times;</button>
        </div>
        <!-- Атрибут action ЗАМЕНИТЕ НА СВОЙ ЭНДПОЙНТ ПОСЛЕ РЕГИСТРАЦИИ НА FORMSPREE -->
        <form action="https://formspree.io/f/meedbqzy" method="POST" id="requestForm">
            <div style="margin-bottom:20px;">
                <label style="color:#FFD966;display:block;margin-bottom:6px;">Ваше имя *</label>
                <input type="text" name="name" id="userName" required style="width:100%;padding:12px;border-radius:40px;border:none;background:#2c2c1a;color:#FFD966;">
            </div>
            <div style="margin-bottom:20px;">
                <label style="color:#FFD966;display:block;margin-bottom:6px;">Контактный телефон *</label>
                <input type="tel" name="phone" id="userPhone" required style="width:100%;padding:12px;border-radius:40px;background:#2c2c1a;color:#FFD966;border:none;">
            </div>
            <div style="margin-bottom:20px;">
                <label style="color:#FFD966;display:block;margin-bottom:6px;">Email</label>
                <input type="email" name="email" id="userEmail" style="width:100%;padding:12px;border-radius:40px;background:#2c2c1a;color:#FFD966;border:none;">
            </div>
            <div style="margin-bottom:24px;">
                <label style="color:#FFD966;display:block;margin-bottom:6px;">Детали запроса</label>
                <textarea name="message" id="message" rows="3" style="width:100%;padding:12px;border-radius:24px;background:#2c2c1a;color:#FFD966;border:none;" placeholder="Опишите объект, требуемые услуги..."></textarea>
            </div>
            <button type="submit" style="background:#FFC107;border:none;padding:14px 24px;border-radius:40px;font-weight:bold;font-size:1rem;width:100%;cursor:pointer;"> Отправить запрос</button>
            <p style="color:#FFD966aa;font-size:0.8rem;margin-top:15px;">Нажимая «Отправить», вы соглашаетесь с обработкой данных.</p>
        </form>
    </div>
`;
document.body.appendChild(orderPageDiv);

function openOrderPage() {
    orderPageDiv.style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeOrderPage() {
    orderPageDiv.style.display = 'none';
    document.body.style.overflow = '';
}

const orderFloatBtn = document.getElementById('orderFloatBtn');
const orderNavBtn = document.getElementById('orderNavBtn');
if (orderFloatBtn) orderFloatBtn.addEventListener('click', openOrderPage);
if (orderNavBtn) orderNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrderPage();
});

const closeBtn = document.getElementById('closeOrderPage');
if (closeBtn) closeBtn.addEventListener('click', closeOrderPage);
orderPageDiv.addEventListener('click', (e) => {
    if (e.target === orderPageDiv) closeOrderPage();
});

// Отправка на Formspree (без alert, после отправки закрываем модалку и показываем уведомление)
const requestForm = document.getElementById('requestForm');
if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
        // Не вызываем e.preventDefault() – форма отправится нормально.
        // Чтобы модалка закрылась после отправки, добавим небольшую задержку.
        setTimeout(() => {
            closeOrderPage();
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
        }, 100);
    });
}

// ===== СЛАЙДЕР ===== (без изменений, оставляем как есть)
(function initSlider() {
    const images = [
        "img/авто.jpg",
        "img/gruppa.jpg",
        "img/монитор.avif"
    ];
    const container = document.getElementById('companySlider');
    if (!container) return;
    const sliderHTML = `
        <div class="slider-horizontal">
            <div class="slider-track" id="sliderTrack">
                ${images.map(src => `<div class="slide" style="background-image: url('${src}');"></div>`).join('')}
            </div>
            <button class="slider-btn-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="slider-btn-next"><i class="fas fa-chevron-right"></i></button>
            <div class="slider-dots" id="sliderDots"></div>
        </div>
    `;
    container.innerHTML = sliderHTML;
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slider-horizontal .slide');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dotsContainer = document.getElementById('sliderDots');
    if (!slides.length) return;
    let currentIndex = 0;
    let autoInterval;
    const totalSlides = slides.length;
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    function goToSlide(index) {
        if (index === currentIndex) return;
        currentIndex = index;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dots .dot');
        dots.forEach((dot, i) => {
            if (i === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
    function nextSlide() {
        let next = currentIndex + 1;
        if (next >= totalSlides) next = 0;
        goToSlide(next);
    }
    function prevSlide() {
        let prev = currentIndex - 1;
        if (prev < 0) prev = totalSlides - 1;
        goToSlide(prev);
    }
    function startAutoSlide() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(nextSlide, 5000);
    }
    function stopAutoSlide() {
        if (autoInterval) clearInterval(autoInterval);
    }
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    const sliderContainer = document.querySelector('.slider-horizontal');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    createDots();
    goToSlide(0);
    startAutoSlide();
})();

// ===== СТРЕЛКА ПРОКРУТКИ (полупрозрачная, удержание) =====
const scrollBtn = document.getElementById('scrollDownBtn');
if (scrollBtn) {
    let scrollInterval = null;
    function startScroll() {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50) {
                stopScroll();
                return;
            }
            window.scrollBy(0, 30);
        }, 16);
    }
    function stopScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }
    scrollBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startScroll();
    });
    window.addEventListener('mouseup', stopScroll);
    scrollBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startScroll();
    });
    window.addEventListener('touchend', stopScroll);
    scrollBtn.addEventListener('mouseleave', stopScroll);
}
