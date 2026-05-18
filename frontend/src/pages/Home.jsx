import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import demoHero from '../assets/logo.png'

const highlights = [
  {
    title: 'Priority Intelligence',
    desc: 'Context-aware ranking that filters noise and surfaces high impact work.',
    icon: '🎯',
    size: 'lg'
  },
  {
    title: 'Dynamic Deadlines',
    desc: 'Auto-scheduling that adjusts in real time as progress and energy shift.',
    icon: '⚡',
    size: 'md'
  },
  {
    title: 'Cognitive Insights',
    desc: 'Deep analytics on your focus flow to predict burnout and peak hours.',
    icon: '📈',
    size: 'md'
  },
  {
    title: 'Modular Architecture',
    desc: 'Extensible infrastructure designed for enterprise-grade workflow scaling.',
    icon: '🧱',
    size: 'lg'
  },
]

const integrationTiles = [
  { name: 'Gemini AI', desc: 'AI prioritization engine' },
  { name: 'MongoDB', desc: 'Real-time task storage' },
  { name: 'React', desc: 'Dynamic UI rendering' },
  { name: 'Flask', desc: 'Performant API core' },
  { name: 'REST API', desc: 'Seamless connectivity' },
  { name: 'Analytics', desc: 'Data-driven insights' },
  { name: 'JWT Auth', desc: 'Secure user access' },
  { name: 'Real-Time Sync', desc: 'Instant state updates' },
]

const container = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-white selection:bg-[#7d8dff]/30">
      {/* Cinematic Mesh Gradients */}
      <div className="pointer-events-none absolute -top-40 -left-[10%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-[#7d8dff]/10 to-transparent blur-[120px] opacity-50" />
      <div className="pointer-events-none absolute top-[10%] -right-[15%] h-[800px] w-[800px] rounded-full bg-gradient-to-bl from-[#c084fc]/10 to-transparent blur-[140px] opacity-40" />
      <div className="pointer-events-none absolute bottom-0 left-[20%] h-[600px] w-[600px] rounded-full bg-[#7d8dff]/05 blur-[100px]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-40 px-8 pb-32 pt-12 relative z-10">
        <header className="flex flex-wrap items-center justify-between gap-10">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
              FlowMind- your AI task manager
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#intelligence" className="transition hover:text-white">
              Intelligence
            </a>
            <a href="#network" className="transition hover:text-white">
              Network
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-xs font-semibold text-white/70 hover:text-white"
            >

            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-[#7078ff] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_-15px_rgba(112,120,255,0.9)] transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            <motion.h1
              variants={item}
              className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl max-w-3xl"
            >
              Intelligent Flow for
              <span className="block text-gradient">Modern Minds</span>
            </motion.h1>
            <motion.p variants={item} className="max-w-xl text-xl leading-relaxed text-slate-400 mt-6">
              Reduce decision fatigue with Gemini-powered task analysis. Our
              cognitive architecture mirrors your thought patterns, organizing
              complexity into effortless momentum.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-6 mt-12">
              <Link
                to="/signup"
                className="group relative px-10 py-4 rounded-2xl bg-white text-black font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">Begin Exploration</span>
              </Link>
              <Link
                to="/demo"
                className="px-10 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
              >
                View Demo
              </Link>
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Engineered for Focus
              </p>
              <p>
                We do not just list tasks. We understand intent, urgency, and the
                limits of human cognition.
              </p>
            </motion.div>
          </motion.div>

          <div className="relative group">
            <motion.div
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#0a0d14] shadow-[0_50px_100px_-30px_rgba(0,0,0,1)]"
            >
              <img
                src={demoHero}
                alt="FlowMind demo dashboard"
                className="h-full w-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05070a] via-transparent to-transparent opacity-80" />

              {/* Atmospheric Glow on image */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#7d8dff]/10 blur-[100px] pointer-events-none" />

              {/* Floating Neural Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-20, 20, -20],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                    className="absolute w-1 h-1 bg-[#7d8dff] rounded-full blur-[2px]"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`
                    }}
                  />
                ))}
              </div>

              <div className="absolute bottom-8 right-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl px-6 py-5 text-xs text-white shadow-2xl transition-transform group-hover:-translate-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-[#3ac4ff] rounded-full animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    AI ANALYZING
                  </p>
                </div>
                <p className="max-w-[240px] text-white/80 leading-relaxed font-medium">
                  Optimizing cognitive overlaps in your “Launch Strategy” sprint.
                </p>
              </div>
            </motion.div>

            {/* Visual Glow behind image */}
            <div className="absolute -inset-4 bg-[#7d8dff]/10 blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </section>

        <section id="features" className="grid gap-8">
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Engineered for Focus
            </p>
            <h2 className="font-display text-3xl font-semibold text-white">
              AI features built for productivity.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
            {highlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative rounded-[2.5rem] border border-white/5 bg-[#ffffff]/[0.02] p-10 backdrop-blur-3xl transition-all hover:bg-white/[0.05] hover:border-white/10 shadow-2xl"
              >
                <div className="text-3xl mb-8 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{highlight.title}</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                  {highlight.desc}
                </p>
                <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full bg-[#7d8dff] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="intelligence" className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-5">
            <h3 className="font-display text-3xl font-semibold text-white">
              AI-Powered Productivity Architecture
            </h3>
            <p className="text-lg text-white/60 leading-relaxed">
              FlowMind combines AI-powered prioritization, smart scheduling, and
              productivity analytics into one seamless workflow system.
            </p>
            <ul className="grid gap-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7d8dff]" />
                AI-driven task prioritization
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7d8dff]" />
                Smart scheduling and analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7d8dff]" />
                Real-time dashboard synchronization
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7d8dff]" />
                Secure authentication system
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7d8dff]" />
                REST API backend architecture
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {integrationTiles.map((tile) => (
              <motion.div
                key={tile.name}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative flex aspect-square flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:border-[#7d8dff]/30 shadow-2xl overflow-hidden"
              >
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-[0.2em] z-10">
                  {tile.name}
                </span>
                <p className="mt-3 text-[9px] font-extrabold text-[#c084fc] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-3 group-hover:translate-y-0 z-10">
                  {tile.desc}
                </p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#7d8dff]/05 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        <footer id="network" className="grid gap-8 border-t border-white/10 pt-10 text-sm text-white/60">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="font-display text-lg text-white">FlowMind </p>
              <p className="mt-2 max-w-sm text-xs text-white/50">
                AI-powered task management built using React, Flask, MongoDB, and Gemini AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="grid gap-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Platform
                </p>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">API</a>
              </div>
              <div className="grid gap-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Resources
                </p>
                <a href="#">Changelog</a>
                <a href="#">Community</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            FlowMind Architecture v1.0
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
