import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Briefcase, Copy, EyeOff, Eye, Github, Award, Users, Handshake, Scale, RotateCcw, Sparkles, MapPin, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  CATEGORIES, seedCandidates, seedFellowships, seedKpis, matchPct, bestCandidate,
  type Candidate, type Fellowship, type Reference, type Kpis,
} from "./data";

const KEY = "skillbridge-demo-v1";
type Tab = "discover" | "fellowships" | "passport" | "impact";
const quotes = [
  "Delivered production-quality work ahead of schedule and communicated with clarity. I would hire them without hesitation.",
  "Showed exceptional problem-solving and quickly adapted to our local stack and business context.",
  "A thoughtful, reliable professional whose output matched our senior team's standards.",
];

export function SkillBridgeApp() {
  const [tab, setTab] = useState<Tab>("discover");
  const [blind, setBlind] = useState(true);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [fellowships, setFellowships] = useState<Fellowship[]>(seedFellowships);
  const [refs, setRefs] = useState<Reference[]>([]);
  const [kpis, setKpis] = useState<Kpis>(seedKpis);
  const [loaded, setLoaded] = useState(false);
  const [portfolio, setPortfolio] = useState<Candidate | null>(null);
  const [matching, setMatching] = useState<Candidate | null>(null);
  const [cert, setCert] = useState<string | null>(null);
  const cands = seedCandidates;

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d) { setFellowships(d.fellowships); setRefs(d.refs); setKpis(d.kpis); setCert(d.refs[0]?.code ?? null); }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify({ fellowships, refs, kpis })); }, [loaded, fellowships, refs, kpis]);

  const label = (c: Candidate) => (blind ? `Talent #${c.talentNo}` : c.name);
  const byId = (id?: string) => cands.find((c) => c.id === id);
  const shown = useMemo(() => cands.filter((c) => filter === "All" || c.categories.includes(filter)), [cands, filter]);

  function startSprint(fid: string, cid: string, fromDiscovery: boolean) {
    setFellowships((fs) => fs.map((f) => (f.id === fid ? { ...f, status: "active", candidateId: cid } : f)));
    setKpis((k) => ({ ...k, matched: k.matched + (fromDiscovery ? 1 : 0), active: k.active + 1 }));
    const f = fellowships.find((x) => x.id === fid)!;
    toast.success(`${label(byId(cid)!)} matched to "${f.title}"`, { description: "Sprint is now active — track it in Skill Passport." });
  }
  function complete(f: Fellowship) {
    const code = `SB-KE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const ref: Reference = { code, candidateId: f.candidateId!, fellowshipId: f.id, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), quote: quotes[refs.length % quotes.length]! };
    setRefs((r) => [ref, ...r]);
    setFellowships((fs) => fs.map((x) => (x.id === f.id ? { ...x, status: "completed" } : x)));
    setKpis((k) => ({ ...k, active: k.active - 1, references: k.references + 1 }));
    setCert(code);
    toast.success("Verified Local Reference issued", { description: code });
  }
  function reset() {
    setFellowships(seedFellowships); setRefs([]); setKpis(seedKpis); setCert(null); setBlind(true);
    toast("Demo reset");
  }

  const tabs: { id: Tab; name: string }[] = [
    { id: "discover", name: "Blind Talent Discovery" },
    { id: "fellowships", name: "Micro-Fellowships" },
    { id: "passport", name: "Skill Passport" },
    { id: "impact", name: "SDG Impact" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground"><Handshake className="h-5 w-5" /></div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">SkillBridge</h1>
                <p className="text-sm text-primary-foreground/70">Closing the Local Experience &amp; Referral Gap</p>
              </div>
            </div>
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/20 px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10"><RotateCcw className="h-3.5 w-3.5" />Reset demo</button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Kpi icon={<Scale className="h-4 w-4" />} label="Verified Talent Matched" value={kpis.matched} sdg="SDG 10" />
            <Kpi icon={<Briefcase className="h-4 w-4" />} label="Paid Micro-Fellowships Active" value={kpis.active} sdg="SDG 8" />
            <Kpi icon={<Award className="h-4 w-4" />} label="Local References Issued" value={kpis.references} sdg="SDG 17" />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-background text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>{t.name}</button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === "discover" && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-4 shadow-card">
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={blind} onCheckedChange={setBlind} className="data-[state=checked]:bg-success" />
                <span className="flex items-center gap-2 font-bold">{blind ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}Blind Mode: {blind ? "ON (Names & Status Hidden)" : "OFF (Identities Revealed)"}</span>
              </label>
              <p className="text-sm text-muted-foreground">Evaluate purely on verified skills.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40"}`}>{c}</button>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((c) => (
                <article key={c.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold">{label(c)}</h3>
                      <p className="text-sm text-muted-foreground">{c.role}</p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-foreground ring-1 ring-accent">{c.score}% Match</span>
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{blind ? "Location & status hidden" : `${c.location} · ${c.status}`}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-1 text-xs font-semibold text-foreground"><BadgeCheck className="h-3.5 w-3.5 text-success" />{s}</span>)}
                  </div>
                  <div className="mt-auto flex gap-2 pt-5">
                    <button onClick={() => setPortfolio(c)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted"><Github className="h-4 w-4" />Portfolio</button>
                    <button onClick={() => setMatching(c)} className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Match to Fellowship</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "fellowships" && (
          <section className="grid gap-4 md:grid-cols-2">
            {fellowships.map((f) => {
              const assigned = byId(f.candidateId);
              const best = bestCandidate(cands, f);
              const pct = matchPct(assigned ?? best, f);
              return (
                <article key={f.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.company}</p>
                      <h3 className="mt-1 text-lg font-extrabold leading-snug">{f.title}</h3>
                    </div>
                    {f.status === "open" && <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold ring-1 ring-accent">{pct}% Skill Match</span>}
                    {f.status === "active" && <span className="shrink-0 rounded-full bg-success px-2.5 py-1 text-xs font-bold text-success-foreground">Active Sprint</span>}
                    {f.status === "completed" && <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">Completed</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{f.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{f.duration}</span>
                    <span className="font-bold text-foreground">Stipend: {f.stipend}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{f.skills.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">{s}</span>)}</div>
                  <p className="mt-4 text-sm"><span className="font-bold">Mentor:</span> {f.mentor} — <span className="text-muted-foreground">{f.mentorRole}</span></p>
                  <div className="mt-auto pt-5">
                    {f.status === "open" ? (
                      <button onClick={() => startSprint(f.id, best.id, false)} className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">One-Click Match / Start Sprint <span className="opacity-70">· best fit {label(best)}</span></button>
                    ) : (
                      <p className="rounded-lg bg-success-soft px-3 py-2.5 text-sm font-semibold">Fellow: {assigned && label(assigned)}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {tab === "passport" && (
          <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold">Active sprints</h2>
              {fellowships.filter((f) => f.status === "active").length === 0 && <p className="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">No active sprints. Start one from Talent Discovery or Micro-Fellowships.</p>}
              {fellowships.filter((f) => f.status === "active").map((f) => (
                <div key={f.id} className="rounded-xl border bg-card p-4 shadow-card">
                  <p className="font-bold">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{label(byId(f.candidateId)!)} · {f.company}</p>
                  <button onClick={() => complete(f)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-success-foreground hover:bg-success/90"><Sparkles className="h-4 w-4" />Simulate Sprint Completion</button>
                </div>
              ))}
              {refs.length > 0 && <h2 className="pt-4 text-lg font-extrabold">Issued references</h2>}
              {refs.map((r) => (
                <button key={r.code} onClick={() => setCert(r.code)} className={`block w-full rounded-xl border bg-card p-3 text-left text-sm ${cert === r.code ? "ring-2 ring-success" : ""}`}>
                  <span className="font-mono font-bold">{r.code}</span> · {label(byId(r.candidateId)!)}
                </button>
              ))}
            </div>
            <Certificate r={refs.find((r) => r.code === cert)} cand={byId(refs.find((r) => r.code === cert)?.candidateId)} f={fellowships.find((f) => f.id === refs.find((r) => r.code === cert)?.fellowshipId)} name={(c) => c.name} />
          </section>
        )}

        {tab === "impact" && (
          <section>
            <h2 className="text-2xl font-extrabold">How SkillBridge advances the Global Goals</h2>
            <p className="mt-1 text-muted-foreground">Kenya hosts 800,000+ refugees; most skilled professionals are locked out by the “no local experience” barrier.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Sdg n={8} title="Decent Work & Economic Growth" icon={<Briefcase className="h-5 w-5" />} text="Paid 2-week returnships turn skills into income and a first Kenyan employer." bars={[["Fellows earning a stipend", 78], ["Hired within 90 days", 61]]} stat={`${kpis.active} active paid fellowships`} />
              <Sdg n={10} title="Reduced Inequalities" icon={<Scale className="h-5 w-5" />} text="Blind, skills-first discovery removes bias on name, nationality and refugee status." bars={[["Interview rate uplift vs. CV", 64], ["Women in matched talent", 47]]} stat={`${kpis.matched} talent matched`} />
              <Sdg n={17} title="Partnerships for the Goals" icon={<Users className="h-5 w-5" />} text="Companies, tech hubs, UNHCR partners and global employers co-issue trusted references." bars={[["Partner companies onboarded", 72], ["References accepted by employers", 89]]} stat={`${kpis.references} local references issued`} />
            </div>
          </section>
        )}
      </main>

      <Dialog open={!!portfolio} onOpenChange={(o) => !o && setPortfolio(null)}>
        <DialogContent>
          {portfolio && (<>
            <DialogHeader>
              <DialogTitle>{label(portfolio)} — Portfolio</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5"><Github className="h-4 w-4" />{blind ? "Link hidden in Blind Mode" : portfolio.github}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {portfolio.projects.map((p) => (
                <div key={p.name} className="rounded-lg border bg-muted p-3">
                  <p className="font-bold">{p.name}</p><p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
              <p className="flex items-center gap-1.5 text-sm font-semibold"><BadgeCheck className="h-4 w-4 text-success" />Skill assessment score: {portfolio.score}%</p>
            </div>
          </>)}
        </DialogContent>
      </Dialog>

      <Dialog open={!!matching} onOpenChange={(o) => !o && setMatching(null)}>
        <DialogContent>
          {matching && (<>
            <DialogHeader>
              <DialogTitle>Match {label(matching)} to a sprint</DialogTitle>
              <DialogDescription>Choose a local company micro-fellowship.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {fellowships.filter((f) => f.status === "open").length === 0 && <p className="text-sm text-muted-foreground">All fellowships are filled. Reset the demo to try again.</p>}
              {fellowships.filter((f) => f.status === "open").map((f) => (
                <button key={f.id} onClick={() => { startSprint(f.id, matching.id, true); setMatching(null); }} className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left hover:border-success hover:bg-success-soft">
                  <span><span className="block text-sm font-bold">{f.title}</span><span className="text-xs text-muted-foreground">{f.company} · {f.stipend}</span></span>
                  <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold ring-1 ring-accent">{matchPct(matching, f)}%</span>
                </button>
              ))}
            </div>
          </>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Kpi({ icon, label, value, sdg }: { icon: React.ReactNode; label: string; value: number; sdg: string }) {
  return (
    <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-primary-foreground/70"><span className="flex items-center gap-1.5">{icon}{label}</span><span className="rounded bg-success px-1.5 py-0.5 text-success-foreground">{sdg}</span></div>
      <p key={value} className="mt-2 text-3xl font-extrabold tabular-nums animate-in zoom-in-95 fade-in duration-500">{value}</p>
    </div>
  );
}

function Sdg({ n, title, icon, text, bars, stat }: { n: number; title: string; icon: React.ReactNode; text: string; bars: [string, number][]; stat: string }) {
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground">{icon}</div><div><p className="text-xs font-bold text-success">SDG {n}</p><h3 className="font-extrabold leading-tight">{title}</h3></div></div>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      <div className="mt-4 space-y-3">{bars.map(([l, v]) => (<div key={l}><div className="mb-1 flex justify-between text-xs font-semibold"><span>{l}</span><span>{v}%</span></div><Progress value={v} className="h-2 [&>div]:bg-success" /></div>))}</div>
      <p className="mt-auto pt-4 text-sm font-bold">{stat}</p>
    </div>
  );
}

function Certificate({ r, cand, f, name }: { r?: Reference | undefined; cand?: Candidate | undefined; f?: Fellowship | undefined; name: (c: Candidate) => string }) {
  if (!r || !cand || !f) return (
    <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed bg-card p-8 text-center text-muted-foreground"><div><Award className="mx-auto h-10 w-10" /><p className="mt-2 font-semibold">Complete a sprint to generate a Verified Local Reference.</p></div></div>
  );
  const link = `https://skillbridge.ke/verify/${r.code}`;
  return (
    <div className="rounded-2xl border-4 border-double border-success bg-card p-8 shadow-card">
      <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.2em] text-success">SkillBridge · Kenya</p><BadgeCheck className="h-8 w-8 text-success" /></div>
      <h2 className="mt-4 font-display text-3xl">Verified Local Reference</h2>
      <p className="mt-4 text-sm text-muted-foreground">This certifies that</p>
      <p className="text-2xl font-extrabold">{name(cand)} <span className="text-base font-semibold text-muted-foreground">(Talent #{cand.talentNo})</span></p>
      <p className="mt-2 text-sm">successfully completed <b>{f.title}</b> with <b>{f.company}</b>.</p>
      <blockquote className="mt-5 border-l-4 border-accent bg-accent-soft p-4 text-sm italic">“{r.quote}”<footer className="mt-2 not-italic font-semibold">— {f.mentor}, {f.mentorRole}</footer></blockquote>
      <div className="mt-5 flex flex-wrap gap-1.5">{f.skills.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-1 text-xs font-semibold"><BadgeCheck className="h-3.5 w-3.5 text-success" />{s}</span>)}</div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t pt-4">
        <div className="text-sm"><p className="text-muted-foreground">Issued {r.date}</p><p className="font-mono font-bold">{r.code}</p></div>
        <button onClick={() => { navigator.clipboard?.writeText(link).catch(() => {}); toast.success("Verification link copied", { description: link }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Copy className="h-4 w-4" />Copy Verification Link</button>
      </div>
    </div>
  );
}
