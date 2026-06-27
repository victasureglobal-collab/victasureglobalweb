import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Briefcase, MapPin, Globe, CreditCard, Edit3, Save, X, ClipboardList, CheckCircle2, ChevronRight, PackageCheck, AlertCircle, Eye } from 'lucide-react';

export default function Profile() {
  const { currentUser, orders, updateUserProfile } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/profile');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Filter orders by this client
  const myOrders = orders.filter(o => o.user_id === currentUser.id || o.email === currentUser.email);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!name || !phone || !company || !country) {
        throw new Error("Please fill in all required fields.");
      }
      await updateUserProfile({
        name,
        phone,
        company,
        country,
        state,
        address,
        pincode
      });
      setSuccess("Account details updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-gray-200">
          <div>
            <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-1">
              B2B Client Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-sans">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-gray-500">
              Manage your corporate details, monitor consignments and inspect shipping statuses.
            </p>
          </div>
          
          <Link 
            to="/products" 
            className="flex items-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-5 rounded-large shadow transition-all"
          >
            <span>Order New Cargo</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-large text-xs font-semibold flex items-center space-x-2 animate-shake">
            <AlertCircle size={16} className="text-red-500" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-large text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-6 relative overflow-hidden">
              {/* Premium styling stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
              
              <div className="flex justify-between items-center pt-2">
                <h2 className="font-sans font-bold text-sm text-primary uppercase tracking-wider flex items-center space-x-2">
                  <User size={16} className="text-accent" />
                  <span>Profile Details</span>
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-xs text-accent hover:text-accent-dark font-bold hover:underline"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Country *</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">State / Prov</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Shipping Port Address</label>
                    <textarea
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded focus:outline-none mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded focus:outline-none mt-1"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-grow flex items-center justify-center space-x-1 bg-primary hover:bg-secondary text-white text-xs font-bold py-2 rounded shadow transition-colors cursor-pointer"
                    >
                      <Save size={14} />
                      <span>{loading ? 'Saving...' : 'Save Details'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs text-gray-600">
                  <div className="flex items-start space-x-3">
                    <Briefcase size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[10px] uppercase text-gray-400">Corporate Entity</span>
                      <span className="font-semibold text-primary">{currentUser.company}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[10px] uppercase text-gray-400">Business Email</span>
                      <span className="font-semibold text-primary">{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[10px] uppercase text-gray-400">Contact Hotlines</span>
                      <span className="font-semibold text-primary">{currentUser.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[10px] uppercase text-gray-400">Geographic Focus</span>
                      <span className="font-semibold text-primary">
                        {currentUser.country} {currentUser.state ? `, ${currentUser.state}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 border-t pt-4">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[10px] uppercase text-gray-400">Default Discharge Port Address</span>
                      <p className="font-semibold text-primary leading-relaxed">
                        {currentUser.address || 'No shipping address saved.'}
                      </p>
                      {currentUser.pincode && (
                        <span className="block mt-1 font-semibold text-gray-400">ZIP: {currentUser.pincode}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Consignment Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-6">
              
              <div className="flex items-center space-x-2 border-b pb-3 border-gray-100">
                <ClipboardList size={18} className="text-secondary" />
                <h2 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">
                  Consignment & Orders Ledger ({myOrders.length})
                </h2>
              </div>

              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="border border-neutral-border rounded-large p-4 sm:p-5 hover:border-gray-300 transition-colors bg-gray-50/50 space-y-4">
                      
                      {/* Order Title Block */}
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Consignment ID</span>
                          <h4 className="font-bold text-primary text-xs font-mono">{order.id}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Placed On</span>
                          <span className="block text-xs font-semibold text-gray-700">{formatDate(order.created_at || order.id)}</span>
                        </div>
                      </div>

                      {/* Line Items summary */}
                      <div className="border-t border-b border-gray-100 py-3 space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-gray-700">
                              {item.product_name} <span className="text-gray-400">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-gray-500 font-mono">
                              ${((item.price_usd || 5) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Status Row */}
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center space-x-1 bg-white border px-3 py-1 rounded-large shadow-sm">
                          <CreditCard size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-primary font-mono">
                            Total: ${order.total_usd?.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">FCL Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed rounded-large border-gray-200 bg-gray-50/50 space-y-3">
                  <PackageCheck size={36} className="mx-auto text-gray-300 stroke-[1.5]" />
                  <h3 className="font-bold text-sm text-primary">No Consignments Placed</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    You have not placed any trade purchase orders yet. Add items to your cart to check out.
                  </p>
                  <Link to="/products" className="inline-block bg-primary hover:bg-secondary text-white text-xs font-bold py-2 px-6 rounded-large transition-colors">
                    Browse Trade Products
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
