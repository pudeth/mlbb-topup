import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Use checkPayment to actively verify and auto-deliver if paid
      const [orderResponse, statusResponse] = await Promise.all([
        ordersAPI.checkPayment(orderId),
        ordersAPI.getStatus(orderId),
      ]);
      setOrder(orderResponse.data?.order || orderResponse.data);
      setStatus(statusResponse.data);
      setLoading(false);
    } catch (err) {
      try {
        const [fallbackOrder, fallbackStatus] = await Promise.all([
          ordersAPI.getById(orderId),
          ordersAPI.getStatus(orderId),
        ]);
        setOrder(fallbackOrder.data);
        setStatus(fallbackStatus.data);
        setLoading(false);
      } catch (fallbackErr) {
        setError(fallbackErr.response?.data?.message || 'Failed to load order details');
        setLoading(false);
      }
    }
  };

  const isCompleted = order?.topupStatus === 'Completed';
  const isPaid = order?.paymentStatus === 'Paid';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <LoadingSpinner text="Tracking order status..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="card border border-rose-500/30 text-center space-y-4">
          <div className="text-4xl text-rose-400">⚠️</div>
          <h2 className="text-xl font-bold text-white">Order Not Found</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <Link to="/topup" className="btn btn-gold inline-flex">
            Go to Top Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* Title */}
      <div className="text-center mb-8">
        <span className="badge badge-info text-xs mb-2">⚡ Live Order Tracker</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Order #{order?.orderId}
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time status updates via Moonton Direct Top-Up API</p>
      </div>

      {/* Main Status Cyber Card */}
      <div className="card border-2 border-slate-800 bg-slate-950/90 shadow-2xl p-6 sm:p-8 mb-6">
        
        {/* Progress Tracker Steps */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-black text-xs bg-emerald-500 text-slate-950 shadow-md">
              ✓
            </div>
            <div className="text-xs font-bold text-white">Order Placed</div>
            <div className="text-[10px] text-emerald-400 font-mono">Verified</div>
          </div>

          <div className="text-center space-y-2">
            <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-black text-xs ${isPaid ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'}`}>
              {isPaid ? '✓' : '2'}
            </div>
            <div className="text-xs font-bold text-white">KHQR Payment</div>
            <div className={`text-[10px] font-mono ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
              {order?.paymentStatus || 'Pending'}
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center font-black text-xs ${isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-850 text-slate-500 border border-slate-700'}`}>
              {isCompleted ? '✓' : '3'}
            </div>
            <div className="text-xs font-bold text-white">Diamond Delivery</div>
            <div className={`text-[10px] font-mono ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
              {order?.topupStatus || 'Processing'}
            </div>
          </div>
        </div>

        {/* Status Message Banner */}
        <div className={`p-4 rounded-2xl border text-center ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'}`}>
          <div className="text-base font-extrabold mb-0.5">
            {isCompleted ? '🎉 Diamonds Delivered Successfully!' : status?.message || 'Processing your top-up order...'}
          </div>
          <p className="text-xs opacity-80">
            {isCompleted 
              ? 'Please open your Mobile Legends in-game mailbox to collect your diamonds.'
              : 'Our automated system will dispatch your diamonds right after payment confirmation.'}
          </p>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="card border border-slate-800 space-y-4 mb-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Order Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Player ID</span>
            <strong className="text-white font-mono text-sm">{order?.playerID}</strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Zone / Server</span>
            <strong className="text-white font-mono text-sm">{order?.serverID}</strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Diamond Package</span>
            <strong className="text-amber-400 text-sm">{order?.diamondAmount} 💎</strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Total Paid</span>
            <strong className="text-cyan-400 text-sm font-mono">${order?.amount?.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/topup" className="btn btn-gold flex-1 text-center py-3.5 font-bold shadow-glow-gold">
          ⚡ Make Another Top-Up
        </Link>
        <Link to="/support" className="btn btn-secondary flex-1 text-center py-3.5 font-semibold">
          🎧 Contact Support
        </Link>
      </div>
    </div>
  );
};

export default OrderStatus;
