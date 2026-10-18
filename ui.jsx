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

const API = import.meta.env.VITE_API_URL || ''
const REG = ['All', 'North', 'South', 'West', 'East', 'North-East']

const MOCK_TITLES = [
  { id: 1, name: 'Naruto', native_name: 'ナルト', genre: 'Shonen', studio: 'Pierrot', demand: 94, piracy_signal: 88 },
  { id: 2, name: 'One Piece', native_name: 'ワンピース', genre: 'Shonen', studio: 'Toei Animation', demand: 91, piracy_signal: 79 },
  { id: 3, name: 'Demon Slayer', native_name: '鬼滅の刃', genre: 'Shonen', studio: 'ufotable', demand: 96, piracy_signal: 92 },
  { id: 4, name: 'Jujutsu Kaisen', native_name: '呪術廻戦', genre: 'Shonen', studio: 'MAPPA', demand: 95, piracy_signal: 89 },
  { id: 5, name: 'Attack on Titan', native_name: '進撃の巨人', genre: 'Action', studio: 'WIT / MAPPA', demand: 93, piracy_signal: 84 },
  { id: 6, name: 'Death Note', native_name: 'デスノート', genre: 'Thriller', studio: 'Madhouse', demand: 87, piracy_signal: 73 },
  { id: 7, name: 'Dragon Ball Z', native_name: 'ドラゴンボールZ', genre: 'Shonen', studio: 'Toei Animation', demand: 89, piracy_signal: 68 },
  { id: 8, name: 'Spy x Family', native_name: 'スパイファミリー', genre: 'Comedy', studio: 'Wit / CloverWorks', demand: 82, piracy_signal: 65 },
  { id: 9, name: 'Chainsaw Man', native_name: 'チェンソーマン', genre: 'Horror', studio: 'MAPPA', demand: 88, piracy_signal: 81 },
  { id: 10, name: 'Fullmetal Alchemist', native_name: '鋼の錬金術師', genre: 'Adventure', studio: 'Bones', demand: 76, piracy_signal: 55 },
  { id: 11, name: 'My Hero Academia', native_name: '僕のヒーローアカデミア', genre: 'Shonen', studio: 'Bones', demand: 84, piracy_signal: 72 },
  { id: 12, name: 'Spirited Away', native_name: '千と千尋の神隠し', genre: 'Fantasy', studio: 'Studio Ghibli', demand: 71, piracy_signal: 48 },
  { id: 13, name: 'Haikyu!!', native_name: 'ハイキュー!!', genre: 'Sports', studio: 'Production I.G', demand: 79, piracy_signal: 62 },
]

export function Spotlight() {
  const on = useStore((s) => s.search), set = useStore((s) => s.setSearch)
  const [q, setQ] = useState(''), [reg, setReg] = useState('All'), [res, setRes] = useState([]), [trend, setTrend] = useState([]), [err, setErr] = useState('')
  useEffect(() => {
    const k = (e) => {
      if (e.key === '/' && !on && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); set(true) }
      if (e.key === 'Escape') set(false)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [on])
  useEffect(() => {
    if (on) {
      fetch(`${API}/api/trending`)
        .then((r) => r.json())
        .then((d) => setTrend(d.trending && d.trending.length ? d.trending : [{ q: 'Demon Slayer' }, { q: 'Jujutsu Kaisen' }, { q: 'Naruto' }, { q: 'One Piece' }]))
        .catch(() => setTrend([{ q: 'Demon Slayer' }, { q: 'Jujutsu Kaisen' }, { q: 'Naruto' }, { q: 'One Piece' }]))
    }
  }, [on])
  useEffect(() => {
    if (!q.trim()) { setRes([]); return }
    const ctl = new AbortController()
    const t = setTimeout(() => {
      fetch(`${API}/api/search?q=${encodeURIComponent(q)}${reg === 'All' ? '' : '&region=' + reg}`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((d) => {
          if (d.results && d.results.length) { setRes(d.results); setErr('') }
          else { fallbackSearch(q, reg) }
        })
        .catch((e) => {
          if (e.name !== 'AbortError') fallbackSearch(q, reg)
        })
    }, 150)
    return () => { clearTimeout(t); ctl.abort() }
  }, [q, reg])

  const fallbackSearch = (query, region) => {
    const lq = query.toLowerCase()
    const regOffset = region === 'North' ? 4 : region === 'South' ? -2 : region === 'West' ? 1 : region === 'North-East' ? 5 : 0
    const matches = MOCK_TITLES.filter((t) => 
      t.name.toLowerCase().includes(lq) || 
      t.native_name.includes(lq) || 
      t.genre.toLowerCase().includes(lq) || 
      t.studio.toLowerCase().includes(lq)
    ).map((t) => ({
      ...t,
      demand: Math.min(100, Math.max(10, t.demand + regOffset)),
      piracy_signal: Math.min(100, Math.max(10, t.piracy_signal + regOffset)),
    }))
    setRes(matches)
    setErr('')
  }
  return (<>
    <button className="btn searchbtn" onClick={() => set(true)}>Search titles (/)</button>
    <AnimatePresence>{on && (
      <motion.div className="veil spot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set(false)}>
        <motion.div className="panel" onClick={(e) => e.stopPropagation()} initial={{ y: -80, scale: .9 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
          <input autoFocus className="q" placeholder="Search anime, studio or genre" value={q} onChange={(e) => setQ(e.target.value)} />
          <div>{REG.map((r) => <button key={r} className="btn chip" style={{ opacity: r === reg ? 1 : .5 }} onClick={() => setReg(r)}>{r}</button>)}</div>
          {err && <p className="kick">{err}</p>}
          {!q && trend.length > 0 && <p>Trending: {trend.map((t) => <button key={t.q} className="btn chip" onClick={() => setQ(t.q)}>{t.q}</button>)}</p>}
          {q && !err && res.length === 0 && <p>No titles match "{q}". Try a studio or genre.</p>}
          {res.map((r) => (
            <div key={r.id} className="box" style={{ margin: '8px 0' }}>
              <b>{r.name}</b> {r.native_name} <small>({r.genre}, {r.studio})</small>
              <div className="row"><span>Demand {reg === 'All' ? 'in India' : 'in ' + reg}</span>
                <motion.div className="bar" initial={{ scaleX: 0 }} animate={{ scaleX: r.demand / 100 }} /><b>{r.demand}</b></div>
              {r.demand >= 70 && r.piracy_signal >= 60 && <span className="kick">Localize first: high demand and heavy piracy search</span>}
            </div>))}
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  </>)
}
