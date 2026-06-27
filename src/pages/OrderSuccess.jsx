import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Anchor, Ship, ArrowRight, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { orders } = useApp();

  const order = orders.find(o => o.id === orderId);

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Card Header */}
        <div className="bg-white border border-neutral-border p-8 rounded-xlarge shadow-premium text-center space-y-5">
          <div className="p-4 bg-green-50 text-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={40} className="stroke-[2]" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-secondary tracking-widest bg-secondary/10 px-4.5 py-1.5 rounded-full inline-block">
              Purchase Order Received
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-primary font-sans">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              We have successfully received your B2B purchase order request. A confirmation email and proforma invoice has been sent to your address.
            </p>
          </div>

          {/* Quick order attributes */}
          <div className="bg-neutral-lightBg border rounded-large p-4 grid grid-cols-2 gap-4 text-xs text-left max-w-md mx-auto">
            <div>
              <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Order Reference ID</span>
              <span className="font-extrabold text-primary text-sm tracking-wide">#{orderId}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Order Status</span>
              <span className="font-bold text-secondary flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping"></span>
                <span className="capitalize">{order?.status || 'pending'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Receipt */}
        {order && (
          <div className="bg-white border border-neutral-border rounded-xlarge shadow-premium overflow-hidden">
            <div className="bg-primary text-white p-6 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base">Order Receipt & Details</h3>
                <p className="text-[10px] text-gray-300">Placed on {(() => {
                  const d = new Date(order.created_at);
                  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                })()} at {new Date(order.created_at).toLocaleTimeString()}</p>
              </div>
              <ClipboardList className="text-accent w-6 h-6" />
            </div>

            <div className="p-6 space-y-6">
              {/* Shipping Address Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-gray-100 pb-5">
                <div className="space-y-2">
                  <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider">Client & Company</h4>
                  <div className="text-gray-600 font-medium space-y-0.5">
                    <p className="font-bold text-primary">{order.customer_name}</p>
                    <p>{order.company_name}</p>
                    <p>Phone: {order.phone}</p>
                    <p>Email: {order.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider">Delivery Destination</h4>
                  <div className="text-gray-600 font-medium space-y-0.5">
                    <p className="font-bold text-primary flex items-center"><Anchor size={12} className="mr-1 text-primary-light" /> {order.delivery_port}</p>
                    <p>{order.address}</p>
                    <p>{order.state}, {order.country} - {order.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Items List Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider">Consignment Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                      <div>
                        <div className="font-bold text-primary">{item.product_name}</div>
                        <div className="text-[10px] text-gray-400">Quantity: {item.quantity.toLocaleString()} units</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary block">₹{(item.price_inr * item.quantity).toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">${(item.price_usd * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary totals */}
              <div className="bg-neutral-lightBg border p-4 rounded-large flex justify-between items-center">
                <span className="text-xs font-bold text-primary">Consignment Total Value</span>
                <div className="text-right space-y-0.5">
                  <span className="font-extrabold text-accent text-base block">₹{order.total_inr.toLocaleString()}</span>
                  <span className="text-xs font-bold text-gray-400 block">${order.total_usd.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B2B Cargo Tracking Progress Bar */}
        <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-6">
          <h3 className="font-sans font-bold text-primary text-sm flex items-center space-x-1.5 border-b border-gray-100 pb-3">
            <Ship size={16} className="text-secondary" />
            <span>FOB Cargo Logistics Pipeline</span>
          </h3>

          <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-bold relative">
            {/* Active connecting line */}
            <div className="absolute top-3.5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-1"></div>
            <div className="absolute top-3.5 left-[10%] w-[20%] h-0.5 bg-secondary -z-1"></div>

            <div className="space-y-2 text-secondary">
              <span className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center mx-auto text-xs border-2 border-white shadow font-bold">✓</span>
              <span className="block">Confirm</span>
            </div>
            <div className="space-y-2 text-primary">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-xs border-2 border-white shadow font-bold">2</span>
              <span className="block">Audit</span>
            </div>
            <div className="space-y-2 text-gray-600">
              <span className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center mx-auto text-xs font-bold">3</span>
              <span className="block">Packing</span>
            </div>
            <div className="space-y-2 text-gray-600">
              <span className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center mx-auto text-xs font-bold">4</span>
              <span className="block">Loading</span>
            </div>
            <div className="space-y-2 text-gray-600">
              <span className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center mx-auto text-xs font-bold">5</span>
              <span className="block">Shipped</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/products"
            className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-large shadow flex items-center space-x-2 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3 px-6 rounded-large transition-all"
          >
            Go to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
