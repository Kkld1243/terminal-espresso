// Terminal Espresso House — interactions
document.documentElement.classList.add('js');

// 1) Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// 2) Space gallery (영화관 느낌) — 크로스페이드 + 카운터 + 스와이프
const gStage = document.getElementById('gStage');
if (gStage) {
  const gSlides = [...gStage.querySelectorAll('.g-slide')];
  const gName = document.getElementById('gName');
  const gCur = document.getElementById('gCur');
  const gTotal = document.getElementById('gTotal');
  const pad = (n) => String(n).padStart(2, '0');
  let gIdx = 0;
  gTotal.textContent = pad(gSlides.length);
  const gShow = (i) => {
    const n = gSlides.length;
    gIdx = ((i % n) + n) % n;
    gSlides.forEach((s, k) => s.classList.toggle('on', k === gIdx));
    gName.textContent = gSlides[gIdx].dataset.name;
    gCur.textContent = pad(gIdx + 1);
  };
  document.getElementById('gPrev')?.addEventListener('click', () => gShow(gIdx - 1));
  document.getElementById('gNext')?.addEventListener('click', () => gShow(gIdx + 1));
  let gx = null;
  gStage.addEventListener('touchstart', (e) => { gx = e.touches[0].clientX; }, { passive: true });
  gStage.addEventListener('touchend', (e) => {
    if (gx == null) return;
    const dx = e.changedTouches[0].clientX - gx;
    if (Math.abs(dx) > 40) gShow(gIdx + (dx < 0 ? 1 : -1));
    gx = null;
  });
  gShow(0);
}

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
  '.sb-card,.statement .container,.award-banner,.gallery,.news-card,.feature-text'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--d', `${(i % 4) * 0.07}s`);
  io.observe(el);
});

// Safety net: ensure everything is visible even if the observer never fires
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
}, 1600);
