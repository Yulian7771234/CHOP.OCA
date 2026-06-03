// ===== 1. ПЛАВНЫЙ СКРОЛЛ И БУРГЕР-МЕНЮ =====
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#order-page') return;
        const target = document.querySelector(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) navLinks.classList.remove('active');
    });
});

const burger = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !burger.contains(event.target)) navLinks.classList.remove('active');
    });
}

// ===== 2. МОДАЛЬНОЕ ОКНО ЗАКАЗА (Яндекс.Форма) =====
const orderPageDiv = document.createElement('div');
orderPageDiv.id = 'orderPage';
orderPageDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:1000;overflow-y:auto;padding:40px 20px;display:none;';
orderPageDiv.innerHTML = `
    
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border:2px solid #ffffff;border-radius:48px;padding:32px 28px;box-shadow:0 20px 35px rgba(0,0,0,0.3);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <h2 style="color:#000000;font-size:2rem;font-weight:700;margin:0;">Оставить заявку</h2>
        <button id="closeOrderPage" style="background:none;border:none;font-size:2rem;color:#000;cursor:pointer;">&times;</button>
    </div>
    <iframe src="https://forms.yandex.ru/u/6a20b88e49af4771382c7582?iframe=1" frameborder="0" name="ya-form-6a20b88e49af4771382c7582" style="width:100%; height:600px; border:none; background:#fff;"></iframe>
</div>
`;
document.body.appendChild(orderPageDiv);

function openOrderPage() { orderPageDiv.style.display = 'block'; document.body.style.overflow = 'hidden'; }
function closeOrderPage() { orderPageDiv.style.display = 'none'; document.body.style.overflow = ''; }
document.getElementById('orderFloatBtn')?.addEventListener('click', openOrderPage);
document.getElementById('orderNavBtn')?.addEventListener('click', (e) => { e.preventDefault(); openOrderPage(); });
document.getElementById('closeOrderPage')?.addEventListener('click', closeOrderPage);
orderPageDiv.addEventListener('click', (e) => { if (e.target === orderPageDiv) closeOrderPage(); });

// ===== 3. СЛАЙДЕР =====
(function initSlider() {
    const images = ["img/auto.jpg", "img/gruppa.jpg", "img/monitor.avif"];
    const container = document.getElementById('companySlider');
    if (!container) return;
    const sliderHTML = `<div class="slider-horizontal"><div class="slider-track" id="sliderTrack">${images.map(src => `<div class="slide" style="background-image: url('${src}');"></div>`).join('')}</div><button class="slider-btn-prev"><i class="fas fa-chevron-left"></i></button><button class="slider-btn-next"><i class="fas fa-chevron-right"></i></button><div class="slider-dots" id="sliderDots"></div></div>`;
    container.innerHTML = sliderHTML;
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slider-horizontal .slide');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dotsContainer = document.getElementById('sliderDots');
    if (!slides.length) return;
    let currentIndex = 0, autoInterval;
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
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dots .dot');
        dots.forEach((dot, i) => { dot.classList.toggle('active', i === currentIndex); });
    }
    function nextSlide() { goToSlide((currentIndex + 1) % totalSlides); }
    function prevSlide() { goToSlide((currentIndex - 1 + totalSlides) % totalSlides); }
    function startAutoSlide() { if (autoInterval) clearInterval(autoInterval); autoInterval = setInterval(nextSlide, 5000); }
    function stopAutoSlide() { if (autoInterval) clearInterval(autoInterval); }
    prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });
    nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });
    const slider = document.querySelector('.slider-horizontal');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    createDots();
    goToSlide(0);
    startAutoSlide();
})();

// ===== 4. СТРЕЛКА ПРОКРУТКИ =====
const scrollBtn = document.getElementById('scrollDownBtn');
if (scrollBtn) {
    let scrollInterval = null;
    const startScroll = () => {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50) { stopScroll(); return; }
            window.scrollBy(0, 30);
        }, 16);
    };
    const stopScroll = () => { if (scrollInterval) { clearInterval(scrollInterval); scrollInterval = null; } };
    scrollBtn.addEventListener('mousedown', (e) => { e.preventDefault(); startScroll(); });
    window.addEventListener('mouseup', stopScroll);
    scrollBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startScroll(); });
    window.addEventListener('touchend', stopScroll);
    scrollBtn.addEventListener('mouseleave', stopScroll);
}

// ===== 5. COOKIE-БАННЕР + ЗАГРУЗКА ЯНДЕКС.МЕТРИКИ ПОСЛЕ СОГЛАСИЯ =====
function loadYandexMetrika() {
    if (document.querySelector('script[src*="mc.yandex.ru/metrika/tag.js"]')) return;
    // Динамически загружаем скрипт Метрики
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=109627437';
    script.async = true;
    document.head.appendChild(script);

    // Инициализируем счётчик после загрузки скрипта
    script.onload = () => {
        window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
        window.ym.l = new Date().getTime();
        ym(109627437, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true
        });
    };

    // Добавляем noscript-картинку
    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/109627437" style="position:absolute; left:-9999px;" alt="" /></div>';
    document.body.appendChild(noscript);
}

function initCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookieConsentBanner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;background:#222;color:#fff;padding:15px;text-align:center;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,0.2);';
    banner.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:10px;">
            <p style="margin:0;font-size:14px;">Мы используем cookie для улучшения работы сайта. Продолжая, вы даете согласие на обработку данных. Подробнее — <a href="privacy.html" target="_blank" style="color:#FFC107;">в Политике</a>.</p>
            <div style="display:flex;gap:15px;">
                <button id="cookieAcceptBtn" style="background:#FFC107;color:#000;border:none;padding:8px 25px;border-radius:30px;cursor:pointer;font-weight:bold;min-width:140px;">Принять всё</button>
                <button id="cookieRejectBtn" style="background:transparent;color:#FFC107;border:1px solid #FFC107;padding:8px 25px;border-radius:30px;cursor:pointer;min-width:140px;">Отклонить всё</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        banner.style.display = 'none';
        loadYandexMetrika(); // Если согласие уже было, загружаем Метрику
    } else if (consent === 'rejected') {
        banner.style.display = 'none';
        // Метрику не загружаем
    } else {
        banner.style.display = 'flex';
    }

    document.getElementById('cookieAcceptBtn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.style.display = 'none';
        loadYandexMetrika(); // Загружаем Метрику после принятия
    });
    document.getElementById('cookieRejectBtn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.style.display = 'none';
        // Метрику не загружаем
    });
}
initCookieBanner();