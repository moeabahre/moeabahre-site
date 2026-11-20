import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initLens } from './lens';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const rtl = document.documentElement.dir === 'rtl';
if (calm) document.documentElement.classList.add('reduced');

/* ---------- contour lines behind the hero ---------- */
(() => {
  const s = $<SVGSVGElement>('#contours');
  if (!s) return;
  const W = 1600, H = 1000;
  s.setAttribute('viewBox', `0 0 ${W} ${H}`);
  s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  let d = '';
  for (let k = 0; k < 16; k++) {
    const r = 50 + k * 54;
    d += `<rect x="${W / 2 - r * 1.5}" y="${H * 0.6 - r}" width="${r * 3}" height="${r * 2}" rx="${r * 0.9}"/>`;
  }
  s.innerHTML = d;
})();

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!calm) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const el = id.length > 1 ? $(id) : null;
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView();
  }));

/* ---------- top bar hides on the way down ---------- */
const top = $('#topbar');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  top?.classList.toggle('away', y > 200 && y > lastY);
  lastY = y;
}, { passive: true });

/* ---------- cursor + magnetic pills ---------- */
const cur = $('#cur');
if (cur && fine && !calm) {
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
  addEventListener('pointermove', (e) => { cur.classList.add('on'); xTo(e.clientX); yTo(e.clientY); });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  $$('a, button, [data-cur]').forEach((el) => {
    el.addEventListener('pointerenter', () => cur.classList.add('big'));
    el.addEventListener('pointerleave', () => cur.classList.remove('big'));
  });
  const port = $('#port');
  port?.addEventListener('pointerenter', () => cur.classList.add('hide'));
  port?.addEventListener('pointerleave', () => cur.classList.remove('hide'));

  $$('.pill').forEach((p) => {
    const mx = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    const my = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    p.addEventListener('pointermove', (e) => {
      const r = p.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.25);
      my((e.clientY - r.top - r.height / 2) * 0.35);
    });
    p.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

/* ---------- copy email ---------- */
const copy = $<HTMLButtonElement>('#copy');
copy?.addEventListener('click', async () => {
  const label = copy.querySelector('span')!;
  const was = label.textContent;
  try {
    await navigator.clipboard.writeText(copy.dataset.email!);
    label.textContent = copy.dataset.copied + ' ✓';
    setTimeout(() => (label.textContent = was), 1800);
  } catch {
    const r = document.createRange();
    r.selectNodeContents($('#mail')!);
    const sel = getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);
  }
});

/* ---------- project peek follows the pointer ---------- */
const peek = $('#peek');
if (peek && fine) {
  const card = $('.card', peek)!, T = $('#peekT')!, S = $('#peekS')!;
  gsap.set(peek, { xPercent: rtl ? -112 : 12, yPercent: -50, scale: 0.6, autoAlpha: 0 });
  const px = gsap.quickTo(peek, 'x', { duration: 0.6, ease: 'power3' });
  const py = gsap.quickTo(peek, 'y', { duration: 0.6, ease: 'power3' });
  const pr = gsap.quickTo(peek, 'rotation', { duration: 0.8, ease: 'power3' });
  let lx = 0;
  addEventListener('pointermove', (e) => {
    px(e.clientX); py(e.clientY);
    pr(gsap.utils.clamp(-8, 8, (e.clientX - lx) * 0.4));
    lx = e.clientX;
  });
  $$<HTMLAnchorElement>('[data-row] a').forEach((a) => {
    a.addEventListener('pointerenter', () => {
      card.style.setProperty('--pc', a.dataset.bg!);
      card.style.setProperty('--pt', a.dataset.fg!);
      T.textContent = a.dataset.name!;
      T.className = /[؀-ۿ]/.test(a.dataset.name!) ? 'ar' : '';
      S.textContent = a.dataset.tag!;
      gsap.to(peek, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      gsap.fromTo(T, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    });
    a.addEventListener('pointerleave', () =>
      gsap.to(peek, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: 'power2.in', overwrite: 'auto' }));
  });
}

/* ---------- the lens over the portrait ---------- */
initLens({ calm, fine });

/* ---------- motion ---------- */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('#bigmark .bl', { yPercent: 105, duration: 1.4, stagger: 0.08 }, 0)
    .from('#port', { yPercent: 12, opacity: 0, duration: 1.6 }, 0.15)
    .from('[data-hero]', { y: 24, opacity: 0, duration: 1, stagger: 0.06 }, 0.5)
    .from('#topbar > *', { y: -30, opacity: 0, duration: 1, stagger: 0.05 }, 0.4);
}

function scrollMotion() {
  const hero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('#bigmark', { yPercent: -40, ease: 'none', scrollTrigger: hero });
  gsap.to('#port', { yPercent: 14, scale: 0.94, ease: 'none', scrollTrigger: { ...hero } });

  gsap.from('#mono .ln > span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '#mono', start: 'top 80%' } });

  // marquee; scrolling up reverses it, scrolling fast speeds it up
  const tr = $('#marq');
  if (tr) {
    const loop = gsap.to(tr, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      onUpdate: (st) => gsap.to(loop, { timeScale: st.direction * (1 + Math.min(Math.abs(st.getVelocity()) / 400, 4)), duration: 0.3, overwrite: true }),
    });
  }

  $$('[data-rise]').forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

  gsap.from('[data-row] a', { yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.idx', start: 'top 85%' } });

  // the about paragraph fills in word by word as you read it
  gsap.to('#abBig .w', { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '#abBig', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  gsap.from('[data-pop]', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.05, scrollTrigger: { trigger: '.svc', start: 'top 92%' } });

  gsap.from('#ctt .ch', { yPercent: 100, opacity: 0, rotate: rtl ? 0 : 8, duration: 1.2, ease: 'expo.out', stagger: 0.035, scrollTrigger: { trigger: '#ctt', start: 'top 88%' } });
}

function store(k: string, v?: string) {
  try {
    if (v === undefined) return sessionStorage.getItem(k);
    sessionStorage.setItem(k, v);
  } catch { /* storage blocked */ }
  return null;
}

function preload(done: () => void) {
  const pre = $('#pre'), cnt = $('#cnt');
  if (!pre) { done(); return; }
  if (store('seen')) { pre.style.display = 'none'; done(); return; }
  store('seen', '1');
  lenis?.stop();
  const n = { v: 0 };
  const img = $<HTMLImageElement>('#photo');
  const ready = img && !img.complete ? new Promise((r) => img.addEventListener('load', r, { once: true })) : Promise.resolve();
  const tl = gsap.timeline();
  tl.from('#pre .bl', { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.07 })
    .to(n, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { cnt!.textContent = String(Math.round(n.v)); } }, 0);
  Promise.all([ready, new Promise((r) => tl.eventCallback('onComplete', r))]).then(() => {
    gsap.to(pre, { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: () => { pre.style.display = 'none'; lenis?.start(); } });
    gsap.delayedCall(0.35, done);
  });
}

if (calm) {
  $$('#abBig .w').forEach((w) => (w.style.opacity = '1'));
  const pre = $('#pre');
  if (pre) pre.style.display = 'none';
} else {
  preload(intro);
  scrollMotion();
  addEventListener('load', () => ScrollTrigger.refresh());
}
