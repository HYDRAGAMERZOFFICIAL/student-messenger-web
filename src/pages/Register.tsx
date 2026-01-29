import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/chat');
    } catch (err) {
      setError('Registration failed. Username or email might be taken.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "glass-input w-full pl-12";
  const labelClasses = "text-xs font-black uppercase tracking-widest text-slate-500 ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f172a] to-[#0f172a]">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-4 opacity-5">
            <UserPlus size={120} />
          </div>

          <div className="relative">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-8 mx-auto"
            >
              <UserPlus className="text-white" size={32} />
            </motion.div>

            <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tight">Join Us</h1>
            <p className="text-slate-400 text-center mb-10 font-medium">Start your academic social experience</p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 text-center font-bold"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className={labelClasses}>Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="John Doe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    className={inputClasses}
                    placeholder="name@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="password"
                    className={inputClasses}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 py-2">
                <ShieldCheck className="text-blue-500 mt-0.5 shrink-0" size={16} />
                <p className="text-[10px] text-slate-500 font-medium">
                  By joining, you agree to our Student Community Guidelines and Data Protection Policy.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-black transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
