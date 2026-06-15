// Terminal Espresso House — interactions
document.documentElement.classList.add('js');

// 1) Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// 2) Space slider arrows
const track = document.getElementById('ssTrack');
const step = () => {
  const slide = track?.querySelector('.ss-slide');
  return slide ? slide.getBoundingClientRect().width + 22 : 360;
};
document.getElementById('ssNext')?.addEventListener('click', () =>
  track.scrollBy({ left: step(), behavior: 'smooth' })
);
document.getElementById('ssPrev')?.addEventListener('click', () =>
  track.scrollBy({ left: -step(), behavior: 'smooth' })
);

// 2b) Feature (수상·선정) slider — 좌우 화살표 + 4초 자동 전환
const featTrack = document.getElementById('featTrack');
if (featTrack) {
  const featSlides = featTrack.querySelectorAll('.feat-slide');
  const featW = () => featTrack.getBoundingClientRect().width;
  const featCur = () => Math.round(featTrack.scrollLeft / featW());
  const featGo = (idx) => {
    const n = featSlides.length;
    const t = ((idx % n) + n) % n;            // wrap-around (마지막 → 처음)
    featTrack.scrollTo({ left: t * featW(), behavior: 'smooth' });
  };
  let featTimer;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const featStart = () => { if (!reduce) featTimer = setInterval(() => featGo(featCur() + 1), 4000); };
  const featStop = () => clearInterval(featTimer);
  const featReset = () => { featStop(); featStart(); };
  document.getElementById('featNext')?.addEventListener('click', () => { featGo(featCur() + 1); featReset(); });
  document.getElementById('featPrev')?.addEventListener('click', () => { featGo(featCur() - 1); featReset(); });
  featTrack.addEventListener('mouseenter', featStop);
  featTrack.addEventListener('mouseleave', featStart);
  featTrack.addEventListener('touchstart', featStop, { passive: true });
  featStart();
}

// 3) Reveal-on-scroll (gated by .js in CSS so no-JS still shows everything)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll(
  '.sb-card,.statement .container,.award-banner,.ss-slide,.news-card,.feature-text'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--d', `${(i % 4) * 0.07}s`);
  io.observe(el);
});

// Safety net: ensure everything is visible even if the observer never fires
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
}, 1600);
