import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAdmin, isAdminAuthenticated } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setLoading(true);
      const success = await loginAdmin(email, password);
      if (success) {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-neutral-lightBg">
      <div className="bg-white rounded-xlarge shadow-premium border border-neutral-border w-full max-w-md overflow-hidden">
        
        {/* Navy border highlight */}
        <div className="h-2 bg-primary"></div>

        <div className="p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <span className="p-3 bg-primary/10 text-primary rounded-full inline-flex">
              <Shield size={28} />
            </span>
            <h1 className="text-xl font-bold text-primary font-sans">Admin Portal Login</h1>
            <p className="text-xs text-gray-400">
              Authorized personnel only. Please sign in to manage site content.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-500 text-red-700 p-3 rounded-large flex items-start space-x-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="admin@victasure.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-large border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-large border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Mock Info Alert */}
            <div className="bg-accent/10 border border-accent/30 rounded-large p-3 text-[10px] text-accent-dark leading-relaxed">
              <strong>Mock Mode Credentials:</strong><br />
              Username: <code className="bg-white px-1 py-0.5 rounded">admin@victasure.com</code><br />
              Password: <code className="bg-white px-1 py-0.5 rounded">admin123</code>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-bold text-xs py-3 rounded-large transition-colors shadow disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Console"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
