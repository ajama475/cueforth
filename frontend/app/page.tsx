import Link from "next/link";
import type { Metadata } from "next";

const pillars = [
  {
    title: "Extract Signal",
    description: "Start with PanicButton to turn a syllabus into reviewable deadlines, dates, and time cues.",
  },
  {
    title: "Review With Proof",
    description: "Keep students in control with evidence-backed extraction instead of opaque calendar guesses.",
  },
  {
    title: "Move Forward",
    description: "Export the events that matter and build toward a broader semester planning workflow.",
  },
];

const steps = [
  "Upload a syllabus or course document.",
  "PanicButton surfaces likely deadlines and timing signals.",
  "Review, correct, and export what matters.",
];

export const metadata: Metadata = {
  title: "Cueforth",
  description: "Cueforth helps students turn course chaos into a plan. Start with PanicButton to extract reviewable deadlines from a syllabus.",
};

export default function Home() {
  return (
    <main
      className="min-h-screen bg-zinc-950 text-zinc-100"
      style={{ minHeight: "100vh", background: "#0a0f1c", color: "#f3f4f6" }}
    >
      <section className="px-6 pb-12 pt-8" style={{ padding: "32px 24px 48px" }}>
        <div className="mx-auto max-w-6xl" style={{ margin: "0 auto", maxWidth: 1152 }}>
          <div
            className="rounded-[28px] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(10,15,28,1))] p-8 shadow-2xl shadow-black/30"
            style={{
              border: "1px solid #1f2937",
              borderRadius: 28,
              background:
                "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 40%), linear-gradient(180deg, rgba(15,23,42,0.96), rgba(10,15,28,1))",
              padding: 32,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="mb-10 flex items-center justify-between gap-4 text-sm text-zinc-400"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 40 }}
            >
              <div
                className="rounded-full border border-zinc-700 px-4 py-2 uppercase tracking-[0.22em]"
                style={{
                  border: "1px solid #374151",
                  borderRadius: 9999,
                  padding: "8px 14px",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Cueforth
              </div>
              <div style={{ color: "#94a3b8" }}>PanicButton by Cueforth</div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]" style={{ display: "grid", gap: 48 }}>
              <div>
                <p
                  className="mb-4 text-sm uppercase tracking-[0.24em] text-blue-300"
                  style={{ marginBottom: 16, color: "#93c5fd", fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase" }}
                >
                  Find what matters next
                </p>
                <h1
                  className="max-w-3xl text-5xl font-semibold leading-tight text-zinc-50 sm:text-6xl"
                  style={{ maxWidth: 820, color: "#f8fafc", fontSize: 62, fontWeight: 600, lineHeight: 1.05 }}
                >
                  Turn course chaos into a plan.
                </h1>
                <p
                  className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
                  style={{ marginTop: 24, maxWidth: 760, color: "#cbd5e1", fontSize: 20, lineHeight: 1.7 }}
                >
                  Cueforth is a student planning platform for turning scattered course information into clear next actions.
                  Start with PanicButton to extract reviewable deadlines from a syllabus in minutes.
                </p>

                <div
                  className="mt-8 flex flex-wrap gap-4"
                  style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32 }}
                >
                  <Link
                    href="/panic"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-400"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      background: "#3b82f6",
                      color: "#ffffff",
                      padding: "12px 22px",
                      fontSize: 16,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Try PanicButton
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 text-base font-semibold text-zinc-100 transition-colors hover:bg-zinc-800"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      border: "1px solid #374151",
                      color: "#e5e7eb",
                      padding: "12px 22px",
                      fontSize: 16,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    See How It Works
                  </a>
                </div>
              </div>

              <div
                className="rounded-3xl border border-zinc-800 bg-black/20 p-6"
                style={{ border: "1px solid #1f2937", borderRadius: 24, background: "rgba(0,0,0,0.2)", padding: 24 }}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em] text-zinc-500"
                  style={{ color: "#94a3b8", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  Why it works
                </p>
                <div className="mt-6 space-y-5" style={{ marginTop: 24, display: "grid", gap: 20 }}>
                  <div>
                    <div className="text-lg font-semibold text-zinc-100" style={{ color: "#f3f4f6", fontSize: 18, fontWeight: 600 }}>
                      Review before you trust
                    </div>
                    <div className="mt-2 text-sm leading-7 text-zinc-400" style={{ marginTop: 8, color: "#9ca3af", fontSize: 14, lineHeight: 1.8 }}>
                      Cueforth is built around verification, not blind automation. Every extracted deadline should be explainable.
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-zinc-100" style={{ color: "#f3f4f6", fontSize: 18, fontWeight: 600 }}>
                      Calm product, urgent use case
                    </div>
                    <div className="mt-2 text-sm leading-7 text-zinc-400" style={{ marginTop: 8, color: "#9ca3af", fontSize: 14, lineHeight: 1.8 }}>
                      PanicButton is designed for the exact moment students need clarity most, without adding more clutter.
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-zinc-100" style={{ color: "#f3f4f6", fontSize: 18, fontWeight: 600 }}>
                      Built to expand
                    </div>
                    <div className="mt-2 text-sm leading-7 text-zinc-400" style={{ marginTop: 8, color: "#9ca3af", fontSize: 14, lineHeight: 1.8 }}>
                      The platform starts with syllabus extraction, then grows into reminders, workload visibility, and course planning.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-10" style={{ padding: "40px 24px" }}>
        <div className="mx-auto max-w-6xl" style={{ margin: "0 auto", maxWidth: 1152 }}>
          <div className="mb-8" style={{ marginBottom: 32 }}>
            <p
              className="text-sm uppercase tracking-[0.2em] text-blue-300"
              style={{ color: "#93c5fd", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              How Cueforth Works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50" style={{ marginTop: 12, color: "#f8fafc", fontSize: 34, fontWeight: 600 }}>
              Start with PanicButton. Build from there.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3" style={{ display: "grid", gap: 20 }}>
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
                style={{ border: "1px solid #1f2937", borderRadius: 20, background: "rgba(24,24,27,0.5)", padding: 24 }}
              >
                <div className="text-lg font-semibold text-zinc-100" style={{ color: "#f3f4f6", fontSize: 18, fontWeight: 600 }}>
                  {pillar.title}
                </div>
                <div className="mt-3 text-sm leading-7 text-zinc-400" style={{ marginTop: 12, color: "#9ca3af", fontSize: 14, lineHeight: 1.8 }}>
                  {pillar.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10" style={{ padding: "40px 24px" }}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]" style={{ margin: "0 auto", maxWidth: 1152, display: "grid", gap: 32 }}>
          <div>
            <p
              className="text-sm uppercase tracking-[0.2em] text-blue-300"
              style={{ color: "#93c5fd", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Three Steps
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50" style={{ marginTop: 12, color: "#f8fafc", fontSize: 34, fontWeight: 600 }}>
              The workflow is simple on purpose.
            </h2>
          </div>

          <div className="grid gap-4" style={{ display: "grid", gap: 16 }}>
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                style={{ border: "1px solid #1f2937", borderRadius: 20, background: "rgba(24,24,27,0.4)", padding: 20 }}
              >
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-sm font-semibold text-blue-200"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    marginBottom: 12,
                    borderRadius: 9999,
                    border: "1px solid rgba(96,165,250,0.3)",
                    background: "rgba(59,130,246,0.1)",
                    color: "#bfdbfe",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </div>
                <div className="text-base leading-7 text-zinc-300" style={{ color: "#d1d5db", fontSize: 16, lineHeight: 1.8 }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-12 pt-6" style={{ padding: "24px 24px 48px" }}>
        <div
          className="mx-auto max-w-6xl rounded-[28px] border border-zinc-800 bg-zinc-900/50 p-8"
          style={{ margin: "0 auto", maxWidth: 1152, border: "1px solid #1f2937", borderRadius: 28, background: "rgba(24,24,27,0.5)", padding: 32 }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" style={{ display: "flex", gap: 24 }}>
            <div>
              <div
                className="text-sm uppercase tracking-[0.2em] text-zinc-500"
                style={{ color: "#94a3b8", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                Cueforth PanicButton
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-50" style={{ marginTop: 12, color: "#f8fafc", fontSize: 34, fontWeight: 600 }}>
                Open the workflow and turn one syllabus into a working plan.
              </h2>
            </div>

            <div>
              <Link
                href="/panic"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-400"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  background: "#3b82f6",
                  color: "#ffffff",
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open PanicButton
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
