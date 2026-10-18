import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useStore } from './store'

export const Eye = () => (
  <svg viewBox="-100 -100 200 200">
    <circle r="96" fill="#b3000f" stroke="#fff" strokeWidth="3" />
    <circle r="90" fill="none" stroke="#000" strokeWidth="2" />
    <g fill="#000">{[0, 120, 240].map((a) => (
      <path key={a} transform={`rotate(${a})`} d="M0 -30 C30 -62 66 -52 82 -20 C54 -44 28 -42 12 -26 Z" />
    ))}</g>
    <circle r="30" fill="#000" /><circle r="8" fill="#b3000f" />
  </svg>
)

export function Sharingan() {
  const x = useMotionValue(innerWidth / 2), y = useMotionValue(innerHeight / 2)
  const sx = useSpring(x, { stiffness: 40, damping: 18 }), sy = useSpring(y, { stiffness: 40, damping: 18 })
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY) }
    addEventListener('pointermove', m); return () => removeEventListener('pointermove', m)
  }, [])
  return (
    <motion.div className="sharingan" style={{ x: sx, y: sy }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}><Eye /></motion.div>
    </motion.div>
  )
}

export function Cursor() {
  const ref = useRef(), fire = useRef(false)
  fire.current = useStore((s) => s.flame)
  useEffect(() => {
    const c = ref.current, g = c.getContext('2d'); let P = [], m = { x: -99, y: -99 }, raf
    const rs = () => { c.width = innerWidth; c.height = innerHeight }; rs()
    const mv = (e) => { m = { x: e.clientX, y: e.clientY } }
    addEventListener('resize', rs); addEventListener('pointermove', mv)
    const loop = () => {
      g.clearRect(0, 0, c.width, c.height)
      const f = fire.current
      for (let i = 0; i < (f ? 4 : 1); i++) P.push({ x: m.x + (Math.random() - .5) * 10, y: m.y, vx: (Math.random() - .5) * 1.2, vy: -(Math.random() * 2 + .5) * (f ? 2 : .4), l: 1, s: f ? 9 + Math.random() * 9 : 3 })
      P = P.filter((p) => p.l > 0)
      for (const p of P) {
        p.x += p.vx; p.y += p.vy; p.l -= .03
        g.globalAlpha = Math.max(p.l, 0); g.fillStyle = f ? '#000' : '#fff'
        g.shadowColor = '#ff1020'; g.shadowBlur = f ? 18 : 6
        g.beginPath(); g.arc(p.x, p.y, p.s * Math.max(p.l, 0), 0, 7); g.fill()
      }
      g.globalAlpha = 1; g.shadowBlur = 0; g.fillStyle = '#ff1020'
      g.beginPath(); g.arc(m.x, m.y, 4, 0, 7); g.fill()
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('pointermove', mv) }
  }, [])
  return <canvas ref={ref} className="cursor" />
}

export function Boot() {
  const done = useStore((s) => s.setBooted), [ph, setPh] = useState(0)
  useEffect(() => {
    const a = setTimeout(() => setPh(1), 3200), b = setTimeout(done, 4500)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  const tiles = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
    c: i % 8, r: (i / 8) | 0, x: (Math.random() - .5) * 900, y: Math.random() * 900 + 200, rot: (Math.random() - .5) * 200,
  })), [])
  return (
    <div className={'boot' + (ph ? ' out' : '')}>
      <motion.div className="eye" initial={{ scaleY: .03 }} animate={ph ? { scale: 4, opacity: 0 } : { scaleY: [.03, .03, 1] }}
        transition={ph ? { duration: .6 } : { duration: 2.4, times: [0, .45, 1], ease: 'easeOut' }}><Eye /></motion.div>
      {!ph && <p>tsukuyomi: 72 hours in one second...</p>}
      {ph === 1 && tiles.map((t, i) => (
        <motion.div key={i} className="tile" style={{ left: t.c * 12.5 + '%', top: t.r * 16.67 + '%', width: '12.5%', height: '16.67%' }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }} animate={{ x: t.x, y: t.y, rotate: t.rot, opacity: 0 }} transition={{ duration: 1.1, ease: 'easeIn' }} />
      ))}
    </div>
  )
}

export function Hud() {
  return (<>
    <div className="hud"><h1 className="dist">Kizuna 絆</h1>
      <p>JETRO-PS-02: turning Indian anime fandom into sustainable revenue. Four genjutsu, four stages of the funnel.</p></div>
    <div className="hint">click an object / drag the kunai and throw it at the edge / touch the black flame / esc closes</div>
  </>)
}

function Audience() {
  const d = [['Tier-1 metros (DEL, MUM, BLR)', 78], ['South (HYD, CHE, KOC)', 61], ['Tier-2 (Pune, Jaipur, Chandigarh)', 54], ['Kolkata + North-East', 47], ['Tier-3 mobile-first', 33]]
  return (<>
    <p>An ML dashboard scores every title by region, language and price sensitivity. Piracy search volume ("watch online", "free download") becomes an unmet-demand signal. Bars below are an illustrative demand index; the model replaces them.</p>
    {d.map(([k, v], i) => (<div className="row" key={k}><span>{k}</span>
      <motion.div className="bar" initial={{ scaleX: 0 }} animate={{ scaleX: v / 100 }} transition={{ delay: .3 + i * .1, type: 'spring', bounce: .5 }} /><b>{v}</b></div>))}
    <h3 className="dist">MECE breakdown</h3>
    <div className="grid">
      <div className="box"><b>Where</b><br />Metro / Tier-2 / Tier-3, by state and language belt</div>
      <div className="box"><b>Who</b><br />14-17, 18-24, 25-30; student vs earning</div>
      <div className="box"><b>How</b><br />Piracy, YouTube, Crunchyroll, Netflix, Prime, manga apps</div>
      <div className="box"><b>What</b><br />Shonen, isekai, slice of life, seinen; anime, manga, games, music</div>
    </div>
    <p>Pipeline: AniList, YouTube, Reddit and Google Trends in, Demand Score per title and region out, Prophet forecast on top, India map for studios.</p>
  </>)
}

function Burn({ children }) {
  const ref = useRef()
  const paint = () => {
    const c = ref.current, g = c.getContext('2d'); c.width = c.offsetWidth; c.height = c.offsetHeight
    g.fillStyle = '#120103'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = '#7a0812'
    for (let i = -c.height; i < c.width; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + c.height, c.height); g.stroke() }
    for (let i = 0; i < c.width + c.height; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i - c.height, c.height); g.stroke() }
    g.fillStyle = '#ff2a3a'; g.font = 'bold 18px monospace'; g.textAlign = 'center'; g.fillText('digital schiffli fabric: drag to burn it away', c.width / 2, c.height / 2)
  }
  useEffect(paint, [])
  const burn = (e) => {
    const c = ref.current, r = c.getBoundingClientRect(), g = c.getContext('2d'), x = e.clientX - r.left, y = e.clientY - r.top
    g.globalCompositeOperation = 'destination-out'
    const gr = g.createRadialGradient(x, y, 2, x, y, 46); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, 46, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'
  }
  return (<><div className="burn">{children}<canvas ref={ref} onPointerMove={burn} /></div><button className="btn" onClick={paint}>Re-weave the fabric</button></>)
}

function Merch() {
  return (<>
    <p>License Japanese IP to Indian streetwear labels as quiet, wearable drops instead of loud logo merch. The numbers below are working assumptions.</p>
    <Burn><div className="grid">
      <div className="box"><b>Business model</b><br />Licensing royalty of 8-12% plus a minimum guarantee, paid by the Indian label to the rights-holder.</div>
      <div className="box"><b>Product</b><br />Oversized boxy tees, 240-280 GSM, drop-shoulder fit. Laser-cut schiffli patches with subtle motifs: a crow silhouette, cloud-stitch trim.</div>
      <div className="box"><b>Pricing and drops</b><br />₹1,799-3,499. Numbered runs of 300-500 units, each with a QR that proves it is genuine.</div>
      <div className="box"><b>Channels</b><br />Label D2C stores, college pop-ups, convention booths, selected fashion marketplaces.</div>
      <div className="box"><b>Why it fits India</b><br />Subtle motifs work for campus and office wear, and sell to fans and non-fans alike.</div>
    </div></Burn>
  </>)
}

function Gacha() {
  const [r, setR] = useState('Pick a drop to pull'), [n, setN] = useState(0)
  const pull = (p) => { const x = Math.random(); setN(n + 1); setR(`${p}: ` + (n % 10 === 9 || x > .93 ? (x > .99 ? 'Legendary, tee voucher' : 'Rare, mini figure code') : x > .7 ? 'Rare, chapter unlock' : 'Common, wallpaper pack')) }
  return (<>
    <p>A UPI micro-transaction gachapon engine priced for Indian wallets. Tap the kunai-priced drops to simulate a pull.</p>
    <table><tbody>
      <tr><th>Drop</th><th>Contents</th><th>Disclosed odds</th></tr>
      <tr><td>₹15</td><td>Sticker or wallpaper pack, 1-chapter unlock</td><td>Common 70%, Rare 30%</td></tr>
      <tr><td>₹30</td><td>Chapter bundle, avatar frames, club perks</td><td>Rare 23%, Epic 6%</td></tr>
      <tr><td>₹50</td><td>Verified collectible keychain or merch voucher</td><td>Epic 6%, Legendary 1%</td></tr>
    </tbody></table>
    <div>{['₹15', '₹30', '₹50'].map((p) => <button key={p} className="btn" onClick={() => pull(p)}>Pull {p}</button>)}</div>
    <div className="box"><b>{r}</b></div>
    <p>Flow: UPI intent, Razorpay confirmation, instant reveal, studio revenue ledger. A guaranteed Rare every 10th pull builds trust. Every pull returns a real item and odds are public; check this against Indian consumer and gaming rules before launch.</p>
  </>)
}

function Loyalty() {
  return (<>
    <p>Viral fans become loyal fans when they compete together. Overnight fandom case competitions run on campuses, with live strategy simulations judged by studios and creators.</p>
    <table><tbody>
      <tr><td>8 pm</td><td>Brief drops: a Japanese IP needs an India launch plan</td></tr>
      <tr><td>11 pm</td><td>Live simulation: teams react to a surprise market shock, and viewers vote with micro-passes</td></tr>
      <tr><td>2 am</td><td>Twist round: a counterfeit wave hits, and teams pivot</td></tr>
      <tr><td>6 am</td><td>Pitch to studio judges, winners ranked, clubs earn XP</td></tr>
    </tbody></table>
    <h3 className="dist">Loyalty ladder</h3>
    <div className="grid">
      {[['Genin', 'First pull, club join'], ['Chunin', 'Early drop access'], ['Jonin', 'Creator collabs, free event entry'], ['Kage', 'Studio meet-ups, co-design a drop']].map(([k, v]) => <div className="box" key={k}><b>{k}</b><br />{v}</div>)}
    </div>
    <p>Metrics to track: 30-day return rate, repeat purchases per fan, clubs per campus, advocates who bring in new fans.</p>
  </>)
}

const PANELS = {
  crow: ['Stage 1 / Audience discovery', 'The crows see everything', <Audience />],
  cloud: ['Stage 2 / Localization and merch', 'Wear the cloud', <Merch />],
  kunai: ['Stage 3 / Monetization', 'Throw ₹15 at the screen', <Gacha />],
  flame: ['Stage 4 / Community retention', 'The flame that will not go out', <Loyalty />],
}

export function Modal() {
  const a = useStore((s) => s.active), close = useStore((s) => s.close)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && close()
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
  const M = a && PANELS[a]
  return (
    <AnimatePresence>{a && (
      <motion.div className="veil" key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
        <motion.div className="panel" onClick={(e) => e.stopPropagation()}
          initial={{ scale: .2, rotate: -8, y: 200 }} animate={{ scale: 1, rotate: 0, y: 0 }} exit={{ scale: .2, rotate: 8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
          <button className="x" onClick={close}>x</button>
          <small className="kick">{M[0]}</small><h2 className="dist">{M[1]}</h2>{M[2]}
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  )
}

import CATALOG from './catalog.json'

const API = import.meta.env.VITE_API_URL || ''
const REG = ['All Regions', 'North', 'South', 'West', 'East', 'North-East']
const TOP_STUDIOS = ['All Studios', 'MAPPA', 'Toei Animation', 'Wit Studio', 'ufotable', 'Bones', 'Pierrot', 'Madhouse']

export function Spotlight() {
  const on = useStore((s) => s.search), set = useStore((s) => s.setSearch)
  const [q, setQ] = useState(''), [reg, setReg] = useState('All Regions'), [studio, setStudio] = useState('All Studios'), [res, setRes] = useState([])

  useEffect(() => {
    const k = (e) => {
      if (e.key === '/' && !on && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); set(true) }
      if (e.key === 'Escape') set(false)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [on])

  useEffect(() => {
    const lq = q.trim().toLowerCase()
    const regOffset = reg === 'North' ? 4 : reg === 'South' ? -2 : reg === 'West' ? 1 : reg === 'North-East' ? 5 : 0

    let filtered = CATALOG
    if (studio !== 'All Studios') {
      filtered = filtered.filter((t) => t.studio.toLowerCase().includes(studio.toLowerCase()))
    }
    if (lq) {
      filtered = filtered.filter((t) => 
        t.name.toLowerCase().includes(lq) || 
        t.native_name.includes(lq) || 
        t.genre.toLowerCase().includes(lq) || 
        t.studio.toLowerCase().includes(lq) ||
        t.recommendation.toLowerCase().includes(lq)
      )
    }

    const processed = filtered.slice(0, 15).map((t) => ({
      ...t,
      demand: Math.min(99, Math.max(25, t.demand + regOffset)),
      piracy_signal: Math.min(98, Math.max(20, t.piracy_signal + regOffset)),
    }))

    setRes(processed)
  }, [q, reg, studio, on])

  return (<>
    <button className="btn searchbtn" onClick={() => set(true)}>Studio Catalog & Demand Radar (/)</button>
    <AnimatePresence>{on && (
      <motion.div className="veil spot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set(false)}>
        <motion.div className="panel" onClick={(e) => e.stopPropagation()} initial={{ y: -80, scale: .9 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <small className="kick" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>B2B Intelligence Radar</small>
              <h2 className="dist" style={{ margin: '4px 0 0' }}>Japanese IP & India Monetization Index</h2>
            </div>
            <button className="x" onClick={() => set(false)}>x</button>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 12, opacity: .8 }}>
            Powered by 24,000+ title MyAnimeList catalog mapped against regional Indian streaming, piracy and youth demographics.
          </p>

          <input autoFocus className="q" placeholder="Search 350+ anime, studio (e.g. MAPPA, Wit, Toei), or genre..." value={q} onChange={(e) => setQ(e.target.value)} />

          <div style={{ margin: '6px 0 10px' }}>
            <span style={{ fontSize: 11, opacity: .7, marginRight: 8 }}>Region:</span>
            {REG.map((r) => <button key={r} className="btn chip" style={{ opacity: r === reg ? 1 : .45, background: r === reg ? '#ff2a3a' : '#1a0003' }} onClick={() => setReg(r)}>{r}</button>)}
          </div>

          <div style={{ margin: '0 0 12px' }}>
            <span style={{ fontSize: 11, opacity: .7, marginRight: 8 }}>Studio:</span>
            {TOP_STUDIOS.map((s) => <button key={s} className="btn chip" style={{ opacity: s === studio ? 1 : .45, background: s === studio ? '#b3000f' : '#1a0003' }} onClick={() => setStudio(s)}>{s}</button>)}
          </div>

          {!q && studio === 'All Studios' && (
            <p style={{ fontSize: 12, opacity: .75, margin: '8px 0' }}>
              🔥 Trending High in India: {['Demon Slayer', 'Jujutsu Kaisen', 'Attack on Titan', 'Naruto', 'One Piece', 'Chainsaw Man'].map((t) => (
                <button key={t} className="btn chip" style={{ background: '#330006' }} onClick={() => setQ(t)}>{t}</button>
              ))}
            </p>
          )}

          {res.length === 0 && <p className="kick" style={{ padding: 12 }}>No titles found matching your search. Try another studio or title.</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {res.map((r) => (
              <div key={r.id} className="box" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#0a0002' }}>
                {r.image && (
                  <img src={r.image} alt={r.name} style={{ width: 56, height: 78, objectFit: 'cover', border: '1px solid #ff2a3a', borderRadius: 2, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                    <b style={{ fontSize: 15, color: '#fff' }}>{r.name}</b>
                    {r.native_name && <span className="dist" style={{ color: '#ff2a3a', fontSize: 13 }}>{r.native_name}</span>}
                  </div>
                  <div style={{ fontSize: 11, opacity: .75, margin: '2px 0 6px' }}>
                    <span style={{ color: '#ff5560' }}>{r.studio}</span> • {r.genre} • ★ {r.score} ({(r.members / 1000).toFixed(0)}k global fans)
                  </div>

                  <div className="row" style={{ margin: '4px 0' }}>
                    <span style={{ fontSize: 11 }}>Indian Demand ({reg}):</span>
                    <motion.div className="bar" initial={{ scaleX: 0 }} animate={{ scaleX: r.demand / 100 }} />
                    <b style={{ color: '#ff2a3a' }}>{r.demand}</b>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="kick" style={{ fontSize: 11, border: '1px solid #ff2a3a', padding: '2px 6px', background: 'rgba(255,42,58,0.1)' }}>
                      📍 {r.recommendation}
                    </span>
                    <span style={{ fontSize: 10, opacity: .65 }}>
                      Piracy Signal: {r.piracy_signal}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  </>)
}
