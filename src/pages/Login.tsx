import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, ArrowRight, Github, Chrome } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1d] relative overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1000px] flex glass-panel !rounded-[48px] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)] relative z-10"
      >
        {/* Left Side: Illustration / Info */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mb-8">
              <LogIn className="text-white" size={32} />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-6">
              WELCOME BACK <br /> TO <span className="text-blue-500">NEXUS.</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
              Reconnect with your digital campus and continue your academic journey within the most advanced communication hub.
            </p>
          </div>

          <div className="relative z-10 mt-20">
             <div className="glass-card p-6 border-white/10 max-w-xs animate-float">
                <div className="flex items-center space-x-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                   </div>
                   <p className="text-white font-black text-xs uppercase tracking-widest">System Status: Optimal</p>
                </div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">All nodes synchronized and ready for transmission.</p>
             </div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-white/5 rounded-full" />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-10 md:p-16 bg-[#0a0f1d]/60 backdrop-blur-xl">
          <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
            <div className="text-center lg:text-left mb-10">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Login to Nexus Buddy!</h1>
              <p className="text-slate-500 text-sm font-medium">Please enter your credentials to authenticate.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-[11px] mb-6 font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Digital Core</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="email"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/[0.06] transition-all text-sm font-medium text-white placeholder:text-slate-600"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-colors">Lost Code?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="password"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/[0.06] transition-all text-sm font-medium text-white placeholder:text-slate-600"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 text-xs uppercase tracking-widest mt-4 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-600 bg-[#0a0f1d] px-4 mx-auto w-fit">Or synchronize with</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <button className="flex items-center justify-center space-x-2 glass-card !rounded-xl py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest">
                <Chrome size={16} />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 glass-card !rounded-xl py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest">
                <Github size={16} />
                <span>GitHub</span>
              </button>
            </div>

            <p className="text-center text-[11px] font-black uppercase tracking-widest text-slate-500">
              Already have an account? <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
