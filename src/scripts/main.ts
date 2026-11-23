import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* the Figma frame is 1440 wide; one design pixel = viewport width / 1440 (without the scrollbar) */
const desk = matchMedia('(min-width: 901px)');
function setUnit() {
  if (desk.matches) {
    const u = Math.min(root.clientWidth / 1440, 1.2);
    root.style.setProperty('--u', `${u}px`);
    root.style.setProperty('--gut', `${Math.max(0, (root.clientWidth - 1440 * u) / 2)}px`);
  } else {
    root.style.removeProperty('--u');
    root.style.removeProperty('--gut');
  }
}
/* the oversized words must span exactly the width they have in Figma, whatever font ends up loading */
function fit() {
  $$('[data-fit]').forEach((el) => {
    el.style.fontSize = '';
    if (!desk.matches && el.dataset.fitDesk !== undefined) return;
    const target = el.clientWidth;
    const span = el.firstElementChild as HTMLElement | null;
    const w = span ? span.getBoundingClientRect().width : 0;
    if (w && target) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * (target / w)}px`;
  });
}
function layout() { setUnit(); fit(); }
layout();
addEventListener('resize', layout);
document.fonts?.ready.then(fit);

/* smooth scroll */
let lenis: Lenis | null = null;
if (!calm) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* header: hides going down, comes back going up, active link follows the section in view */
const hdr = $('#hdr')!;
const menuBtn = $<HTMLButtonElement>('#menuBtn')!;
function closeMenu() {
  hdr.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = menuBtn.dataset.open!;
}
menuBtn.addEventListener('click', () => {
  const open = !hdr.classList.contains('open');
  hdr.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? menuBtn.dataset.close! : menuBtn.dataset.open!;
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  hdr.classList.toggle('stuck', y > 40);
  hdr.classList.toggle('away', y > 300 && y > lastY && !hdr.classList.contains('open'));
  lastY = y;
}, { passive: true });

const links = $$<HTMLAnchorElement>('.hdr-link');
const sections = links
  .map((a) => a.getAttribute('href')!)
  .filter((h) => h.startsWith('#'))
  .map((h) => $(h))
  .filter(Boolean) as HTMLElement[];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${en.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spy.observe(s));

$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const el = id.length > 1 ? $(id) : null;
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(el, { duration: 1.3 });
    else el.scrollIntoView();
  }));

/* motion */
const isHome = !!$('.hero');
if (!calm && !isHome) gsap.from('#hdr', { y: -30, opacity: 0, duration: 1.1, ease: 'expo.out' });
if (!calm && isHome) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('#hdr', { y: -30, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-port', { y: 60, opacity: 0, duration: 1.6 }, 0.1)
    .from('.hero-big', { yPercent: 40, opacity: 0, duration: 1.6 }, 0.25)
    .from('.hero-name', { yPercent: 30, opacity: 0, duration: 1.4 }, 0.4)
    .from('.hero-role, .hero-pitch', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.55);

  // depth on scroll: portrait and type drift at different speeds
  const hero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-port', { yPercent: 10, ease: 'none', scrollTrigger: hero });
  gsap.to('.hero-big', { yPercent: -35, ease: 'none', scrollTrigger: { ...hero } });
  gsap.to('.hero-name', { yPercent: -60, ease: 'none', scrollTrigger: { ...hero } });

  gsap.from('.tl li', { opacity: 0, y: 12, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.evo', start: 'top 80%' } });
  gsap.from('.star', { rotate: -45, scale: 0.8, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.evo', start: 'top 85%' } });
  gsap.to('.star', { rotate: 45, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
}

if (!calm) {
  $$('[data-rv]').forEach((el) =>
    gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  gsap.from('[data-line]', { yPercent: 100, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.cta h2', start: 'top 85%' } });

  gsap.from('.ftr-big', { yPercent: 60, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 85%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
}
