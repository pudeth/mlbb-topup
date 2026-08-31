import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/topup" className="btn btn-primary">
          New Top-Up
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't made any top-up orders. Start your first order now!
          </p>
          <Link to="/topup" className="btn btn-primary">
            Make Your First Top-Up
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold mr-3">Order #{order.orderId}</span>
                    <span className={`badge ${
                      order.topupStatus === 'Completed' ? 'badge-success' :
                      order.topupStatus === 'Failed' || order.paymentStatus === 'Failed' ? 'badge-danger' :
                      order.topupStatus === 'Processing' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {order.topupStatus}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Player ID:</span>
                      <span className="ml-2 font-semibold">{order.playerID}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Server:</span>
                      <span className="ml-2 font-semibold">{order.serverID}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Package:</span>
                      <span className="ml-2 font-semibold">{order.diamondAmount} Diamonds</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-semibold text-mlbb-gold">${order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 flex gap-2">
                  <Link
                    to={`/order-status/${order.orderId}`}
                    className="btn btn-outline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
