// ===== 1. ПЛАВНЫЙ СКРОЛЛ И БУРГЕР-МЕНЮ =====
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.startsWith('tel:') || targetId.startsWith('mailto:')) return; // Игнорируем кнопки звонка

        e.preventDefault();
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

// ===== 2. СЛАЙДЕР =====
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

// ===== 3. СТРЕЛКА ПРОКРУТКИ =====
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

// ===== 4. COOKIE-БАННЕР + ЗАГРУЗКА МЕТРИКИ =====
function loadYandexMetrika() {
    if (document.querySelector('script[src*="mc.yandex.ru/metrika/tag.js"]')) return;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=109627437';
    script.async = true;
    document.head.appendChild(script);
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
    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/109627437" style="position:absolute; left:-9999px;" alt="" /></div>';
    document.body.appendChild(noscript);
}

function initCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookieConsentBanner';
    banner.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:10px;">
            <p style="margin:0;font-size:14px;">Мы используем cookie для улучшения работы сайта. Продолжая, вы даете согласие на обработку данных. Подробнее — <a href="privacy.html" target="_blank">в Политике конфиденциальности</a>.</p>
            <div style="display:flex;gap:15px;">
                <button id="cookieAcceptBtn">Принять всё</button>
                <button id="cookieRejectBtn">Отклонить всё</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        banner.style.display = 'none';
        loadYandexMetrika();
    } else if (consent === 'rejected') {
        banner.style.display = 'none';
    } else {
        banner.style.display = 'flex';
    }
    document.getElementById('cookieAcceptBtn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.style.display = 'none';
        loadYandexMetrika();
    });
    document.getElementById('cookieRejectBtn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.style.display = 'none';
    });
}
initCookieBanner();
