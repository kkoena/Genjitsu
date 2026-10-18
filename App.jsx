import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store'
import {
  AntiCounterfeitView,
  DubUnlockView,
  ExecutivePitchView,
  Eye,
  FunnelView,
  RevenueSimulatorView,
  StudioRadarView
} from './ui'

const TABS = [
  { id: 'pitch', label: '📊 Executive Briefing', badge: '30s Deck' },
  { id: 'funnel', label: '⛩️ 4-Stage Funnel', badge: 'Strategy' },
  { id: 'simulator', label: '💰 Revenue Simulator', badge: 'Unit Economics' },
  { id: 'dub', label: '🎙️ Dub Unlock', badge: 'UPI Crowdfund' },
  { id: 'counterfeit', label: '🛡️ Anti-Counterfeit', badge: 'HMAC-SHA256' },
  { id: 'radar', label: '🔍 B2B Studio Radar', badge: '350+ Titles' },
]

export default function App() {
  const currentTab = useStore((s) => s.currentTab)
  const setTab = useStore((s) => s.setCurrentTab)

  return (
    <div className="app-shell">
      <div className="ambient-glow" />

      {/* Top Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Eye />
            <h1 className="dist brand-title">Kizuna 絆</h1>
            <span className="brand-tag">JETRO-PS-02</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, opacity: .75, display: 'none', sm: 'inline' }}>
              Creative Economy & Media Monetization in India
            </span>
            <span className="kick" style={{ fontSize: 10, background: 'rgba(255,42,58,0.1)', padding: '4px 8px', border: '1px solid #ff2a3a', borderRadius: 2 }}>
              ● Live Prototype
            </span>
          </div>
        </div>
      </header>

      {/* KPI Ticker Bar */}
      <section className="kpi-ticker">
        <div className="kpi-inner">
          <div className="kpi-item">
            <div className="kpi-val"><span className="hot">30M–40M</span> Viewers</div>
            <div className="kpi-lbl">Active Indian Anime Audience (25–28% CAGR)</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-val"><span className="hot">&lt;2%</span> Captured</div>
            <div className="kpi-lbl">Economic Surplus Captured by Studios</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-val"><span className="hot">14B+</span> / Month</div>
            <div className="kpi-lbl">Instant UPI Transactions (Sachet Ready)</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-val"><span className="hot">70–80%</span> Bootleg</div>
            <div className="kpi-lbl">Counterfeit Character Merch in Unorganized Retail</div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${currentTab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            <span style={{ fontSize: 10, opacity: .7, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 2 }}>
              {t.badge}
            </span>
          </button>
        ))}
      </nav>

      {/* Main View Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === 'pitch' && <ExecutivePitchView />}
            {currentTab === 'funnel' && <FunnelView />}
            {currentTab === 'simulator' && <RevenueSimulatorView />}
            {currentTab === 'dub' && <DubUnlockView />}
            {currentTab === 'counterfeit' && <AntiCounterfeitView />}
            {currentTab === 'radar' && <StudioRadarView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="footer">
        <div>
          <b>Kizuna 絆</b> — Developed for <b>JETRO (Japan External Trade Organization)</b> • Problem Statement JETRO-PS-02
        </div>
        <div style={{ marginTop: 6, opacity: .75 }}>
          Converting Japanese Pop Culture & Content Fandom into Sustainable Revenue in India • Compliance with Indian Public Gambling Act, RBI FEMA, & Copyright Act Sec 51
        </div>
      </footer>
    </div>
  )
}
