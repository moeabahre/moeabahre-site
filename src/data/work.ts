export interface Work {
  slug: string;
  name: { en: string; ar: string };
  tag: { en: string; ar: string };
  desc: { en: string; ar: string };
  nda?: boolean;
  bg: string;
  fg: string;
  href?: string;
}

// Covers are typographic until real project images are added to /public/work/<slug>/.
export const work: Work[] = [
  { slug: 'nabd-360', name: { en: 'Nabd 360', ar: 'نبض ٣٦٠' }, tag: { en: 'Product · Dashboard', ar: 'منتج · لوحة قيادة' }, desc: { en: 'Real-time executive dashboard', ar: 'لوحة قيادة تنفيذية لحظية' }, nda: true, bg: '#0A1240', fg: '#D9DEFF' },
  { slug: 'design-system', name: { en: 'Design System', ar: 'نظام التصميم' }, tag: { en: 'Product · System', ar: 'منتج · نظام' }, desc: { en: 'Arabic-first, web and app', ar: 'عربي أولاً، ويب وتطبيق' }, nda: true, bg: '#111110', fg: '#FFFFFF' },
  { slug: 'platca', name: { en: 'Platca', ar: 'بلاتكا' }, tag: { en: 'UI/UX · Health', ar: 'تجربة وواجهات · صحة' }, desc: { en: 'Medical services platform', ar: 'منصة خدمات طبية' }, bg: '#CFF3E6', fg: '#0B4D3F', href: 'https://www.behance.net/gallery/199900453/Platca-UIUX-Design' },
  { slug: 'eoca', name: { en: 'EOCA', ar: 'EOCA' }, tag: { en: 'Brand identity', ar: 'هوية بصرية' }, desc: { en: 'Logo and identity system', ar: 'شعار ونظام هوية' }, bg: '#F0E6D2', fg: '#1C2A44', href: 'https://www.behance.net/gallery/199897169/EOCA-Logo-Brand-Identity' },
  { slug: 'dream', name: { en: 'Dream', ar: 'دريم' }, tag: { en: 'Brand · Events', ar: 'هوية · فعاليات' }, desc: { en: 'Exhibitions and conferences', ar: 'معارض ومؤتمرات' }, bg: '#2B0F3F', fg: '#FFD1F2' },
  { slug: 'engineering-offices', name: { en: 'Engineering Offices', ar: 'المكاتب الهندسية' }, tag: { en: 'Brand · Institution', ar: 'هوية · مؤسسة' }, desc: { en: 'Authority identity', ar: 'هوية هيئة' }, bg: '#0F3D3A', fg: '#D8F2EC' },
  { slug: 'chicken-in', name: { en: 'Chicken In', ar: 'تشيكن إن' }, tag: { en: 'Brand · F&B', ar: 'هوية · مطاعم' }, desc: { en: 'Restaurant branding', ar: 'هوية مطعم' }, bg: '#FFC629', fg: '#2A1300', href: 'https://www.behance.net/gallery/108931655/Chicken-In-Restaurant-Branding' },
  { slug: 'section', name: { en: 'Section', ar: 'سيكشن' }, tag: { en: 'UI/UX · Commerce', ar: 'تجربة وواجهات · متجر' }, desc: { en: 'WordPress store', ar: 'متجر ووردبريس' }, bg: '#E6EAFF', fg: '#2332FF' },
  { slug: 'battlefield', name: { en: 'Battlefield', ar: 'باتلفيلد' }, tag: { en: 'Communication', ar: 'تصميم اتصال' }, desc: { en: 'Campaign design', ar: 'تصميم حملة' }, bg: '#111110', fg: '#FF6A3D', href: 'https://www.behance.net/gallery/129658849/Communication-Design-Battlefield' },
];

export const path = [
  { now: true, en: ['Product design lead', 'Government platforms, dashboards, design systems', 'Dubai · now'], ar: ['قائد تصميم المنتجات', 'منصات حكومية، لوحات قيادة، أنظمة تصميم', 'دبي · حالياً'] },
  { en: ['Founder, moeabahre studio', 'Brand and product studio, design academy', 'Amman'], ar: ['مؤسس، moeabahre studio', 'استوديو براند ومنتجات وأكاديمية تصميم', 'عمّان'] },
  { en: ['Art Director, MStudio', 'Creative agency', 'Amman'], ar: ['مدير فني، MStudio', 'وكالة إبداعية', 'عمّان'] },
  { en: ['Senior Designer, Tanween', 'Brand and communication', 'Amman'], ar: ['مصمم أول، تنوين', 'براند وتصميم اتصال', 'عمّان'] },
  { en: ['Senior Designer, Publicis', 'Advertising network', 'Ramallah'], ar: ['مصمم أول، Publicis', 'شبكة إعلانية', 'رام الله'] },
];

export const services = {
  en: ['Product strategy', 'UX & UI', 'Design systems', 'Brand identity', 'Websites', 'Team training'],
  ar: ['استراتيجية المنتج', 'تجربة وواجهات', 'أنظمة التصميم', 'الهوية البصرية', 'المواقع', 'تدريب الفرق'],
};
