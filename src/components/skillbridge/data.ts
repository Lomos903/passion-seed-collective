export type Category = "React & Frontend" | "Python & Backend" | "Data & SQL" | "UI/UX Design" | "Digital Marketing";
export const CATEGORIES: ("All" | Category)[] = ["All", "React & Frontend", "Python & Backend", "Data & SQL", "UI/UX Design", "Digital Marketing"];

export interface Candidate {
  id: string; talentNo: number; name: string; role: string; location: string; status: string;
  categories: Category[]; skills: string[]; score: number; github: string; projects: { name: string; desc: string }[];
}
export interface Fellowship {
  id: string; title: string; company: string; location: string; stipend: string; skills: string[]; mentor: string; mentorRole: string;
  duration: string; status: "open" | "active" | "completed"; candidateId?: string;
}
export interface Reference { code: string; candidateId: string; fellowshipId: string; date: string; quote: string }
export interface Kpis { matched: number; active: number; references: number }

export const seedCandidates: Candidate[] = [
  { id: "c1", talentNo: 401, name: "Amina Hassan", role: "Full-Stack React & Python Developer", location: "Kakuma / Nairobi", status: "Refugee (Somalia)", categories: ["React & Frontend", "Python & Backend"], skills: ["React", "TypeScript", "Python", "FastAPI", "REST APIs"], score: 95, github: "github.com/amina-dev", projects: [{ name: "KakumaMarket", desc: "Offline-first marketplace PWA for camp traders (React + IndexedDB)." }, { name: "SMS-Health API", desc: "FastAPI service routing clinic reminders over SMS." }] },
  { id: "c2", talentNo: 402, name: "Jean-Paul Uwimana", role: "Data Analyst", location: "Nairobi", status: "Refugee (DRC)", categories: ["Data & SQL", "Python & Backend"], skills: ["SQL", "Python", "Pandas", "Power BI", "M-Pesa Data"], score: 92, github: "github.com/jp-uwimana", projects: [{ name: "Mobile Money Trends", desc: "Analysis of 2M M-Pesa-style transactions with cohort dashboards." }, { name: "Rainfall vs Yield", desc: "Regression model on Rift Valley farm data." }] },
  { id: "c3", talentNo: 403, name: "Fatuma Abdi", role: "UI/UX Product Designer", location: "Dadaab", status: "Refugee (Somalia)", categories: ["UI/UX Design"], skills: ["Figma", "User Research", "Design Systems", "Mobile UI", "Prototyping"], score: 94, github: "behance.net/fatuma-abdi", projects: [{ name: "Hawala Wallet", desc: "Low-literacy remittance app with icon-first navigation." }, { name: "Clinic Queue", desc: "Redesign cutting patient wait-time confusion by 40%." }] },
  { id: "c4", talentNo: 404, name: "Ahmed Mohamud", role: "Frontend Engineer", location: "Nairobi", status: "Refugee (Ethiopia)", categories: ["React & Frontend"], skills: ["React", "Next.js", "Tailwind", "Accessibility", "Mobile UI"], score: 89, github: "github.com/ahmed-m", projects: [{ name: "Matatu Routes", desc: "Accessible transit map for Nairobi matatu routes." }] },
  { id: "c5", talentNo: 405, name: "Grace Nyibol", role: "Backend & Cloud Engineer", location: "Kakuma", status: "Refugee (South Sudan)", categories: ["Python & Backend", "Data & SQL"], skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Docker"], score: 91, github: "github.com/grace-nyibol", projects: [{ name: "SchoolRoll", desc: "Django attendance system used by 3 camp schools." }] },
  { id: "c6", talentNo: 406, name: "Omar Al-Rashid", role: "Digital Marketing Strategist", location: "Nairobi / Remote", status: "Refugee (Syria)", categories: ["Digital Marketing"], skills: ["SEO", "Meta Ads", "Content Strategy", "Analytics", "Copywriting"], score: 87, github: "omar-marketing.site", projects: [{ name: "Jua Kali Growth", desc: "Grew an artisan shop's online sales 3x via Instagram." }] },
];

export const seedFellowships: Fellowship[] = [
  { id: "f1", title: "2-Week M-Pesa Analytics Dashboard Sprint", company: "Nairobi Fintech", location: "Nairobi", stipend: "KES 25,000", skills: ["SQL", "Python", "Power BI", "M-Pesa Data"], mentor: "Wanjiru Kamau", mentorRole: "Head of Data, Nairobi Fintech", duration: "2 weeks", status: "open" },
  { id: "f2", title: "1-Month Senior Frontend Mentorship", company: "Savannah Tech Hub", location: "Nairobi / Hybrid", stipend: "Mentorship", skills: ["React", "TypeScript", "Next.js", "Accessibility"], mentor: "Brian Otieno", mentorRole: "Principal Engineer, Savannah Tech Hub", duration: "1 month", status: "open" },
  { id: "f3", title: "E-Commerce Mobile UI Audit Returnship", company: "Mombasa Retail Partner", location: "Mombasa / Remote", stipend: "KES 20,000", skills: ["Figma", "Mobile UI", "User Research", "Prototyping"], mentor: "Zawadi Mwangi", mentorRole: "Product Design Lead", duration: "2 weeks", status: "open" },
  { id: "f4", title: "Python API Integration Micro-Fellowship", company: "Global Remote Partner", location: "Remote", stipend: "$200", skills: ["Python", "REST APIs", "FastAPI", "Docker"], mentor: "Daniel Kiprop", mentorRole: "Engineering Manager", duration: "2 weeks", status: "open" },
];

export const seedKpis: Kpis = { matched: 128, active: 46, references: 84 };

export function matchPct(c: Candidate, f: Fellowship) {
  const hit = f.skills.filter((s) => c.skills.includes(s)).length;
  return Math.round(55 + (hit / f.skills.length) * 40 + (c.score - 85) * 0.4);
}
export function bestCandidate(cands: Candidate[], f: Fellowship) {
  return [...cands].sort((a, b) => matchPct(b, f) - matchPct(a, f))[0]!;
}
