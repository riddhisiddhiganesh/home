// JavaScript for Riddhi Siddhi Ganesh Foundation Website
// Navbar mobile toggle
const navToggle = document.getElementById('nav-toggle');
const navMenuMobile = document.getElementById('nav-menu-mobile');
navToggle.addEventListener('click', () => {
  navMenuMobile.classList.toggle('hidden');
});

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('a[data-scroll]');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute('href').substring(1));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 64,
        behavior: 'smooth'
      });
      navMenuMobile.classList.add('hidden');
    }
  });
});

// Gallery carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('hidden', i !== idx);
    dots[i].classList.toggle('bg-orange-500', i === idx);
    dots[i].classList.toggle('bg-gray-300', i !== idx);
  });
  currentSlide = idx;
}

prevBtn.addEventListener('click', () => {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
});
nextBtn.addEventListener('click', () => {
  showSlide((currentSlide + 1) % slides.length);
});
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => showSlide(i));
});
showSlide(0);

// Achievements carousel JS
// Similar to gallery, but for Achievements section
let achCurrentSlide = 0;
const achSlides = document.querySelectorAll('.ach-carousel-slide');
const achDots = document.querySelectorAll('.ach-carousel-dot');
const achPrevBtn = document.getElementById('ach-carousel-prev');
const achNextBtn = document.getElementById('ach-carousel-next');

function showAchSlide(idx) {
  achSlides.forEach((slide, i) => {
    slide.classList.toggle('hidden', i !== idx);
    achDots[i].classList.toggle('bg-orange-500', i === idx);
    achDots[i].classList.toggle('bg-gray-300', i !== idx);
  });
  achCurrentSlide = idx;
}
if (achPrevBtn && achNextBtn && achSlides.length) {
  achPrevBtn.addEventListener('click', () => {
    showAchSlide((achCurrentSlide - 1 + achSlides.length) % achSlides.length);
  });
  achNextBtn.addEventListener('click', () => {
    showAchSlide((achCurrentSlide + 1) % achSlides.length);
  });
  achDots.forEach((dot, i) => {
    dot.addEventListener('click', () => showAchSlide(i));
  });
  showAchSlide(0);
}

// Rellax.js parallax init
window.onload = function() {
  if (window.Rellax) {
    new Rellax('.rellax');
  }
  if (window.AOS) {
    AOS.init();
  }
};

// Responsive carousel for Gallery (already present)
// Responsive carousel for Achievements (already present)
// Ensure both carousels re-initialize on window resize for full responsiveness
window.addEventListener('resize', () => {
  // Gallery
  if (typeof showSlide === 'function') showSlide(currentSlide || 0);
  // Achievements
  if (typeof showAchSlide === 'function') showAchSlide(achCurrentSlide || 0);
});

// Animated Counters for Achievements
function animateCounter(id, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const range = end - start;
  const increment = end > 1000 ? Math.ceil(range / (duration / 10)) : 1;
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    el.textContent = end >= 100000 ? current.toLocaleString() : current;
  }, 10);
}

document.addEventListener('DOMContentLoaded', () => {
  // Animate counters when Achievements section is in view
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight && rect.bottom > 0
    );
  }
  let countersStarted = false;
  function startCountersIfVisible() {
    const achSection = document.getElementById('achievements');
    if (!countersStarted && isInViewport(achSection)) {
      animateCounter('counter-visitors', 200000, 2000); // 2 Lakh+
      animateCounter('counter-years', 30, 20000); // 30 years
      countersStarted = true;
    }
  }
  window.addEventListener('scroll', startCountersIfVisible);
  startCountersIfVisible();
});

// Lightbox Gallery for Gallery and Achievements images
(function() {
  // Helper to get all images in a carousel
  function getCarouselImages(type) {
    if (type === 'gallery') {
      return Array.from(document.querySelectorAll('.carousel-slide img'));
    } else if (type === 'achievements') {
      return Array.from(document.querySelectorAll('.ach-carousel-slide img'));
    }
    return [];
  }

  // Create lightbox modal if not present
  function createLightbox() {
    if (document.getElementById('lightbox-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 hidden';
    modal.innerHTML = `
      <button id="lightbox-close" class="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none">&times;</button>
      <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold px-2 py-1 bg-black bg-opacity-40 rounded-full focus:outline-none">&#8592;</button>
      <img id="lightbox-img" class="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white" src="" alt="Gallery Image" />
      <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold px-2 py-1 bg-black bg-opacity-40 rounded-full focus:outline-none">&#8594;</button>
    `;
    document.body.appendChild(modal);
  }

  // State for lightbox
  let currentType = null;
  let currentIdx = 0;
  let images = [];

  function openLightbox(type, idx) {
    createLightbox();
    images = getCarouselImages(type);
    currentType = type;
    currentIdx = idx;
    updateLightbox();
    document.getElementById('lightbox-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function updateLightbox() {
    if (!images.length) return;
    const img = document.getElementById('lightbox-img');
    img.src = images[currentIdx].src;
    img.alt = images[currentIdx].alt || '';
  }

  function nextImg() {
    if (!images.length) return;
    currentIdx = (currentIdx + 1) % images.length;
    updateLightbox();
  }
  function prevImg() {
    if (!images.length) return;
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    updateLightbox();
  }

  // Attach click listeners to images
  function attachLightboxListeners() {
    getCarouselImages('gallery').forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox('gallery', i));
    });
    getCarouselImages('achievements').forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox('achievements', i));
    });
  }

  // Attach modal controls
  document.addEventListener('click', function(e) {
    if (e.target.id === 'lightbox-close') closeLightbox();
    if (e.target.id === 'lightbox-next') nextImg();
    if (e.target.id === 'lightbox-prev') prevImg();
    // Click outside image closes
    if (e.target.id === 'lightbox-modal' && e.target === document.getElementById('lightbox-modal')) closeLightbox();
  });
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImg();
    if (e.key === 'ArrowLeft') prevImg();
  });

  // Re-attach listeners on DOMContentLoaded and after carousel changes
  document.addEventListener('DOMContentLoaded', attachLightboxListeners);
  window.addEventListener('resize', attachLightboxListeners);
  // Also after carousel navigation (in case slides are re-rendered)
  if (typeof showSlide === 'function') {
    const origShowSlide = showSlide;
    window.showSlide = function(idx) {
      origShowSlide(idx);
      attachLightboxListeners();
    };
  }
  if (typeof showAchSlide === 'function') {
    const origShowAchSlide = showAchSlide;
    window.showAchSlide = function(idx) {
      origShowAchSlide(idx);
      attachLightboxListeners();
    };
  }
})();

// tsParticles: Floating diyas/flowers/particles in hero background
window.addEventListener('DOMContentLoaded', function() {
  if (window.tsParticles && document.getElementById('tsparticles')) {
    tsParticles.load('tsparticles', {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      particles: {
        number: { value: 18, density: { enable: true, area: 800 } },
        color: { value: ['#ffb300', '#ff4081', '#fff176', '#ffd54f', '#fffde7'] },
        shape: {
          type: ['image', 'circle'],
          image: [
            { src: 'https://cdn.jsdelivr.net/gh/icons8/flat-color-icons/svg/candle.svg', width: 32, height: 32 }, // diya
            { src: 'https://cdn.jsdelivr.net/gh/icons8/flat-color-icons/svg/flower.svg', width: 32, height: 32 }, // flower
          ]
        },
        opacity: { value: 0.7, random: true },
        size: { value: 24, random: { enable: true, minimumValue: 16 } },
        move: {
          enable: true,
          speed: 0.7,
          direction: 'top',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      detectRetina: true,
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
    });
  }
});

// Hide loader overlay when page is fully loaded
window.addEventListener('load', function() {
  const loader = document.getElementById('loader-overlay');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 700);
  }
});

// === SWIPE SUPPORT FOR CAROUSELS ===
function addSwipeSupport(container, prevFn, nextFn) {
  let startX = 0;
  let endX = 0;
  let threshold = 40; // Minimum px swipe
  if (!container) return;
  container.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) startX = e.touches[0].clientX;
  });
  container.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) endX = e.touches[0].clientX;
  });
  container.addEventListener('touchend', function() {
    if (startX && endX) {
      let diff = endX - startX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) prevFn(); // Swipe right
        else nextFn(); // Swipe left
      }
    }
    startX = 0; endX = 0;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Gallery swipe
  const galleryContainer = document.querySelector('#gallery .max-w-4xl');
  if (galleryContainer && prevBtn && nextBtn) {
    addSwipeSupport(galleryContainer, () => prevBtn.click(), () => nextBtn.click());
  }
  // Achievements swipe
  const achContainer = document.querySelector('#achievements .max-w-4xl');
  if (achContainer && achPrevBtn && achNextBtn) {
    addSwipeSupport(achContainer, () => achPrevBtn.click(), () => achNextBtn.click());
  }
});
