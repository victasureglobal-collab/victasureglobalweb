import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAdmin, resetAdminPassword, isAdminAuthenticated } = useApp();
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
      if (isForgot) {
        await resetAdminPassword(email);
        setResetSent(true);
      } else {
        const success = await loginAdmin(email, password);
        if (success) {
          navigate('/admin');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-neutral-lightBg">
      <div className="bg-white rounded-xlarge shadow-premium border border-neutral-border w-full max-w-md overflow-hidden font-sans">
        
        {/* Navy border highlight */}
        <div className="h-2 bg-primary"></div>

        <div className="p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <span className="p-3 bg-primary/10 text-primary rounded-full inline-flex">
              <Shield size={28} />
            </span>
            <h1 className="text-xl font-bold text-primary">
              {isForgot ? "Reset Admin Password" : "Admin Portal Login"}
            </h1>
            <p className="text-xs text-gray-400">
              {isForgot 
                ? "Enter your registered email to receive a password reset link." 
                : "Authorized personnel only. Please sign in to manage site content."}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-500 text-red-700 p-3 rounded-large flex items-start space-x-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs font-semibold">{errorMsg}</span>
            </div>
          )}

          {resetSent ? (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 border border-green-400 text-green-700 p-4 rounded-large flex flex-col items-center space-y-2">
                <CheckCircle size={24} className="text-green-600 animate-bounce" />
                <span className="text-xs font-bold">Reset Link Sent Successfully!</span>
                <p className="text-[10px] text-green-600 font-medium">Please check your email inbox and spam folder for instructions.</p>
              </div>
              <button 
                onClick={() => { setIsForgot(false); setResetSent(false); setErrorMsg(""); }}
                className="inline-flex items-center space-x-1 text-xs text-primary font-bold hover:underline"
              >
                <ArrowLeft size={12} />
                <span>Back to Sign In</span>
              </button>
            </div>
          ) : (
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
              {!isForgot && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setErrorMsg(""); }}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold text-xs py-3 rounded-large transition-colors shadow disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Processing..." : (isForgot ? "Send Reset Instructions" : "Sign In to Console")}
                </button>

                {isForgot && (
                  <button
                    type="button"
                    onClick={() => { setIsForgot(false); setErrorMsg(""); }}
                    className="w-full text-center text-xs text-gray-400 hover:text-slate-600 font-semibold"
                  >
                    Cancel and Go Back
                  </button>
                )}
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
