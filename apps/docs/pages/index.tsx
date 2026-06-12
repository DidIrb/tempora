import type { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Tempora — Scaffold projects from curated templates</title>
        <meta name="description" content="Tempora is a CLI tool that lets you instantly scaffold any project from a growing vault of curated templates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.main}>

        {/* Nav */}
        <nav style={styles.nav}>
          <span style={styles.navLogo}>Tempora</span>
          <div style={styles.navLinks}>
            <Link href="/getting-started" style={styles.navLink}>Docs</Link>
            <Link href="/templates" style={styles.navLink}>Templates</Link>
            <a href="https://github.com/your-org/tempora" target="_blank" rel="noreferrer" style={styles.navLink}>GitHub</a>
          </div>
        </nav>

        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.badge}>Open Source CLI</div>
          <h1 style={styles.title}>
            Scaffold any project.<br />
            <span style={styles.titleAccent}>In one command.</span>
          </h1>
          <p style={styles.subtitle}>
            Tempora is a fast, language-agnostic CLI that bootstraps your project
            from a curated vault of community templates — no setup, no guesswork.
          </p>
          <div style={styles.codeBlock}>
            <code style={styles.code}>npm install -g @tempora/cli</code>
          </div>
          <div style={styles.codeBlock}>
            <code style={styles.code}>tempora init</code>
          </div>
          <div style={styles.actions}>
            <Link href="/getting-started" style={styles.btnPrimary}>Get Started →</Link>
            <Link href="/templates" style={styles.btnSecondary}>Browse Templates</Link>
          </div>
        </section>

        {/* Features */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Tempora?</h2>
          <div style={styles.grid}>
            {features.map(f => (
              <div key={f.title} style={styles.card}>
                <div style={styles.cardIcon}>{f.icon}</div>
                <h3 style={styles.cardTitle}>{f.title}</h3>
                <p style={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>How it works</h2>
          <div style={styles.steps}>
            {steps.map((s, i) => (
              <div key={s.title} style={styles.step}>
                <div style={styles.stepNum}>{i + 1}</div>
                <div>
                  <h3 style={styles.stepTitle}>{s.title}</h3>
                  <p style={styles.stepDesc}>{s.desc}</p>
                  {s.code && (
                    <div style={styles.codeBlock}>
                      <code style={styles.code}>{s.code}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            MIT © {new Date().getFullYear()} Tempora ·{' '}
            <a href="https://github.com/your-org/tempora" target="_blank" rel="noreferrer" style={styles.footerLink}>GitHub</a>
          </p>
        </footer>

      </main>
    </>
  )
}

Home.getLayout = (page: ReactElement) => page

const features = [
  {
    icon: '⚡',
    title: 'Instant',
    desc: 'Registry is bundled with the CLI. No API calls, no waiting — pick a template and scaffold in seconds.',
  },
  {
    icon: '🌐',
    title: 'Language agnostic',
    desc: 'TypeScript, Python, Go and more. One tool, every stack.',
  },
  {
    icon: '🎯',
    title: 'Focused',
    desc: 'One-shot scaffolding only. Pick a template, get a project, done. No ongoing project management.',
  },
  {
    icon: '📦',
    title: 'Tiny download',
    desc: 'Only the template folder you pick is cloned. Not the entire repository.',
  },
  {
    icon: '🛡️',
    title: 'Safe by default',
    desc: 'Tempora never overwrites files without asking. Non-empty directories trigger a confirmation prompt.',
  },
  {
    icon: '📖',
    title: 'Self-documenting',
    desc: 'Every template ships a README. The docs site is auto-synced from template READMEs on every build.',
  },
]

const steps = [
  {
    title: 'Install the CLI',
    desc: 'Install Tempora globally via npm. Requires Node.js 18+ and git.',
    code: 'npm install -g @tempora/cli',
  },
  {
    title: 'Pick a template',
    desc: 'Run tempora init for guided mode — pick a language, category, then template. Or go direct.',
    code: 'tempora init nextjs-tailwind my-app',
  },
  {
    title: 'Start building',
    desc: 'Tempora prints exactly what to run next. Follow the steps and your project is ready.',
    code: 'cd my-app && pnpm install && pnpm dev',
  },
]

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#111',
    backgroundColor: '#fff',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #eee',
  },
  navLogo: {
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  navLink: {
    color: '#444',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '5rem 2rem 4rem',
    maxWidth: '680px',
    margin: '0 auto',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '100px',
    padding: '0.25rem 0.75rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '3.25rem',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    margin: '0 0 1rem',
  },
  titleAccent: {
    color: '#555',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
    lineHeight: 1.6,
    margin: '0 0 1.5rem',
    maxWidth: '520px',
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    padding: '0.6rem 1rem',
    marginBottom: '0.5rem',
    width: '100%',
    maxWidth: '400px',
  },
  code: {
    fontFamily: '"Fira Code", "Cascadia Code", monospace',
    fontSize: '0.9rem',
    color: '#111',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#111',
    color: '#fff',
    padding: '0.65rem 1.5rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
  },
  btnSecondary: {
    border: '1px solid #ddd',
    color: '#333',
    padding: '0.65rem 1.5rem',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
  },
  section: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '3rem 2rem',
    borderTop: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  cardIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    margin: '0 0 0.4rem',
  },
  cardDesc: {
    fontSize: '0.875rem',
    color: '#555',
    lineHeight: 1.55,
    margin: 0,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  step: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
  },
  stepNum: {
    minWidth: '2rem',
    height: '2rem',
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: '0 0 0.25rem',
  },
  stepDesc: {
    fontSize: '0.9rem',
    color: '#555',
    margin: '0 0 0.5rem',
    lineHeight: 1.5,
  },
  footer: {
    borderTop: '1px solid #eee',
    padding: '1.5rem 2rem',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
  },
  footerLink: {
    color: '#888',
    textDecoration: 'none',
  },
}
