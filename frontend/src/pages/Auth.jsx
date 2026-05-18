import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/user/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', response.data.user.name);
      localStorage.setItem('uiDensity', response.data.user.uiDensity || 'Balanced');
      if (response.data.user.avatar) {
        localStorage.setItem('avatar', response.data.user.avatar);
      }
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute -top-40 left-[-10%] h-72 w-72 rounded-full bg-[#7d8dff]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-25%] right-[-5%] h-80 w-80 rounded-full bg-[#3ac4ff]/20 blur-[140px]" />

      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Secure access
          </p>
          <h2 className="font-display text-3xl font-semibold text-white">
            Log in or create your space
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Sync your tasks, or continue free without an
            account.
          </p>
        </header>

        <section className="grid gap-6 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <button className="rounded-full bg-white px-5 py-2 text-[#14182d]">
              Log in
            </button>
            <Link
              to="/signup"
              className="rounded-full border border-white/15 px-5 py-2 text-white/70 transition hover:text-white"
            >
              Sign up
            </Link>
          </div>

          <form className="grid gap-4 text-sm" onSubmit={handleLogin}>
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Email
              <input
                type="email"
                placeholder="taskmanager12@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0c1226] px-4 py-3 text-sm text-white outline-none focus:border-[#7d8dff]"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              Password
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0c1226] px-4 py-3 text-sm text-white outline-none focus:border-[#7d8dff]"
              />
            </label>
            <button type="submit" className="rounded-full bg-[#7078ff] px-5 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_-15px_rgba(112,120,255,0.9)] transition hover:-translate-y-0.5">
              Continue
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-white/50">
            Continue free without logging in. Your data will stay on this device.
          </div>
          <Link
            to="/dashboard"
            onClick={() => {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('username', 'Guest');
            }}
            className="rounded-full border border-white/15 px-5 py-2 text-center text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Continue free
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Auth
