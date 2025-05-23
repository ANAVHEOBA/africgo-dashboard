'use client';

import { useEffect, useState, useCallback } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders(filters);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      console.log(`Order ${orderId} status updated. Email sent: ${result.emailSent}`);
      fetchOrders(); // Refresh orders after status update
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Orders</h3>
        <div className="flex space-x-2">
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED_DELIVERY">Failed Delivery</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.trackingNumber}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'READY_FOR_PICKUP'
                        ? 'bg-orange-100 text-orange-800'
                        : order.status === 'PICKED_UP'
                        ? 'bg-indigo-100 text-indigo-800'
                        : order.status === 'IN_TRANSIT'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(order.price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.estimatedDeliveryDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'CONFIRMED')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'READY_FOR_PICKUP')}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'READY_FOR_PICKUP' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'PICKED_UP')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {order.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'IN_TRANSIT')}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Mark In Transit
                      </button>
                    )}
                    {order.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'DELIVERED')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button 
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= pagination.pages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span>{' '}
              to{' '}
              <span className="font-medium">{Math.min(filters.page * filters.limit, pagination.total)}</span>{' '}
              of{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.pages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 