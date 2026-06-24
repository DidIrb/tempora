import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',color:'#111',backgroundColor:'#fff'}}>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2rem',borderBottom:'1px solid #eee'}}>
        <span style={{fontWeight:800,fontSize:'1.1rem',letterSpacing:'-0.02em'}}>Tempora</span>
        <div style={{display:'flex',gap:'1.5rem'}}>
          <Link href="/home" style={{color:'#444',textDecoration:'none',fontSize:'0.9rem',fontWeight:500}}>Docs</Link>
          <Link href="/templates" style={{color:'#444',textDecoration:'none',fontSize:'0.9rem',fontWeight:500}}>Templates</Link>
          <a href="https://github.com/your-org/tempora" target="_blank" rel="noreferrer" style={{color:'#444',textDecoration:'none',fontSize:'0.9rem',fontWeight:500}}>GitHub</a>
        </div>
      </nav>

      <section style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'5rem 2rem 4rem',maxWidth:'680px',margin:'0 auto'}}>
        <div style={{fontSize:'0.75rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#666',border:'1px solid #ddd',borderRadius:'100px',padding:'0.25rem 0.75rem',marginBottom:'1.5rem'}}>Open Source CLI</div>
        <h1 style={{fontSize:'3.25rem',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.1,margin:'0 0 1rem'}}>
          Scaffold any project.<br/>
          <span style={{color:'#555'}}>In one command.</span>
        </h1>
        <p style={{fontSize:'1.1rem',color:'#555',lineHeight:1.6,margin:'0 0 1.5rem',maxWidth:'520px'}}>
          Tempora is a fast, language-agnostic CLI that bootstraps your project from a curated vault of community templates — no setup, no guesswork.
        </p>
        <div style={{backgroundColor:'#f5f5f5',borderRadius:'6px',padding:'0.6rem 1rem',marginBottom:'0.5rem',width:'100%',maxWidth:'400px',textAlign:'left'}}>
          <code style={{fontFamily:'monospace',fontSize:'0.9rem',color:'#111'}}>npm install -g @tempora/cli</code>
        </div>
        <div style={{backgroundColor:'#f5f5f5',borderRadius:'6px',padding:'0.6rem 1rem',marginBottom:'1.5rem',width:'100%',maxWidth:'400px',textAlign:'left'}}>
          <code style={{fontFamily:'monospace',fontSize:'0.9rem',color:'#111'}}>tempora init</code>
        </div>
        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',justifyContent:'center'}}>
          <Link href="/getting-started" style={{backgroundColor:'#111',color:'#fff',padding:'0.65rem 1.5rem',borderRadius:'6px',fontWeight:600,fontSize:'0.95rem',textDecoration:'none'}}>Get Started →</Link>
          <Link href="/templates" style={{border:'1px solid #ddd',color:'#333',padding:'0.65rem 1.5rem',borderRadius:'6px',fontWeight:600,fontSize:'0.95rem',textDecoration:'none'}}>Browse Templates</Link>
        </div>
      </section>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 2rem',borderTop:'1px solid #eee'}}>
        <h2 style={{fontSize:'1.75rem',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'2rem',textAlign:'center'}}>Why Tempora?</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'1.25rem'}}>
          {[
            {icon:'⚡',title:'Instant',desc:'Registry is bundled with the CLI. No API calls, no waiting — pick and scaffold in seconds.'},
            {icon:'🌐',title:'Language agnostic',desc:'TypeScript, Python, Go and more. One tool, every stack.'},
            {icon:'🎯',title:'Focused',desc:'One-shot scaffolding. Pick a template, get a project, done.'},
            {icon:'📦',title:'Tiny download',desc:'Only the template folder you pick is cloned via git sparse checkout.'},
            {icon:'🛡️',title:'Safe by default',desc:'Never overwrites files without asking. Non-empty directories trigger a confirmation.'},
            {icon:'📖',title:'Self-documenting',desc:'Docs are auto-synced from template READMEs on every build.'},
          ].map(f => (
            <div key={f.title} style={{border:'1px solid #eee',borderRadius:'8px',padding:'1.25rem'}}>
              <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{f.icon}</div>
              <h3 style={{fontSize:'0.95rem',fontWeight:700,margin:'0 0 0.4rem'}}>{f.title}</h3>
              <p style={{fontSize:'0.875rem',color:'#555',lineHeight:1.55,margin:0}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 2rem',borderTop:'1px solid #eee'}}>
        <h2 style={{fontSize:'1.75rem',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'2rem',textAlign:'center'}}>How it works</h2>
        <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
          {[
            {n:1,title:'Install the CLI',desc:'Install Tempora globally via npm. Requires Node.js 18+ and git.',code:'npm install -g @tempora/cli'},
            {n:2,title:'Pick a template',desc:'Run tempora init for guided mode or go direct if you know the template id.',code:'tempora init next-tailwind my-app'},
            {n:3,title:'Start building',desc:'Tempora prints exactly what to run next based on the template.',code:'cd my-app && pnpm install && pnpm dev'},
          ].map(s => (
            <div key={s.title} style={{display:'flex',gap:'1.25rem',alignItems:'flex-start'}}>
              <div style={{minWidth:'2rem',height:'2rem',backgroundColor:'#111',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>{s.n}</div>
              <div>
                <h3 style={{fontSize:'1rem',fontWeight:700,margin:'0 0 0.25rem'}}>{s.title}</h3>
                <p style={{fontSize:'0.9rem',color:'#555',margin:'0 0 0.5rem',lineHeight:1.5}}>{s.desc}</p>
                <div style={{backgroundColor:'#f5f5f5',borderRadius:'6px',padding:'0.6rem 1rem'}}>
                  <code style={{fontFamily:'monospace',fontSize:'0.85rem',color:'#111'}}>{s.code}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop:'1px solid #eee',padding:'1.5rem 2rem',textAlign:'center'}}>
        <p style={{fontSize:'0.85rem',color:'#888',margin:0}}>
          MIT © {new Date().getFullYear()} Tempora · <a href="https://github.com/your-org/tempora" target="_blank" rel="noreferrer" style={{color:'#888',textDecoration:'none'}}>GitHub</a>
        </p>
      </footer>

    </div>
  )
}
