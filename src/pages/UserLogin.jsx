import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, ShieldAlert, Globe } from 'lucide-react';

export default function UserLogin() {
  const { loginUser, signupUser, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Toggle between 'login' and 'register'
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration additional states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (currentUser) {
      navigate(redirect);
    }
  }, [currentUser, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginUser(email, password);
      } else {
        // Validation
        if (!name || !email || !password || !phone || !company || !country) {
          throw new Error("Please fill in all required fields (*)");
        }
        await signupUser({
          name,
          email,
          password,
          phone,
          company,
          country,
          state,
          address,
          pincode
        });
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    "Australia", "Austria", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "Denmark", "Egypt", 
    "France", "Germany", "India", "Indonesia", "Ireland", "Italy", "Japan", "Kuwait", "Malaysia", 
    "Mexico", "Netherlands", "New Zealand", "Oman", "Philippines", "Poland", "Qatar", "Saudi Arabia", 
    "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", 
    "United Arab Emirates", "United Kingdom", "United States", "Vietnam", "Other"
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg font-sans">
      <div className="max-w-md w-full space-y-8 bg-white border border-neutral-border p-8 rounded-xlarge shadow-premium">
        
        {/* Title Block */}
        <div className="text-center space-y-2">
          <span className="w-12 h-12 bg-primary/5 text-primary rounded-large font-bold flex items-center justify-center text-lg mx-auto shadow-sm">
            VS
          </span>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">
            {mode === 'login' ? 'Importers Login Desk' : 'Register B2B Account'}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {mode === 'login' 
              ? 'Access your trade profile and place orders' 
              : 'Create a buyer account to place purchase orders'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-large text-xs font-semibold flex items-center space-x-2 animate-shake">
            <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          
          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global Foods LLC"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (with country code) *</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Geographics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Country *</label>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border rounded bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select country...</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    placeholder="e.g. California"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Office / Port Delivery Address</label>
                <textarea
                  rows="2"
                  placeholder="Full shipping address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded focus:outline-none"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="e.g. 90210"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Business Email Address *</label>
            <input
              type="email"
              required
              placeholder="buyer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Secure Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center space-x-2 bg-primary hover:bg-secondary text-white font-bold text-xs py-3 rounded-large shadow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {mode === 'login' ? (
              <>
                <LogIn size={14} className="text-accent" />
                <span>{loading ? 'Logging in...' : 'Sign In to Trade Desk'}</span>
              </>
            ) : (
              <>
                <UserPlus size={14} className="text-accent" />
                <span>{loading ? 'Creating account...' : 'Create B2B Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center border-t pt-4 border-gray-100">
          {mode === 'login' ? (
            <p className="text-xs text-gray-500 font-semibold">
              New importer?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className="text-secondary hover:text-secondary-dark font-bold underline cursor-pointer"
              >
                Create B2B Account
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-500 font-semibold">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-secondary hover:text-secondary-dark font-bold underline cursor-pointer"
              >
                Sign In here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
