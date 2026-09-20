import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDonations, verifyDonation as verifyDonationApi, deleteDonation } from '../services/api';

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, unopened: 0 });

  const calculateStats = useCallback((donationsData) => {
    const total = donationsData.length;
    const verified = donationsData.filter(d => d.verified).length;
    const pending = total - verified;
    const unopened = donationsData.filter(d => d.unopened).length;
    setStats({ total, verified, pending, unopened });
  }, []);

  const fetchDonations = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await getDonations();
      const donationsData = response.data.data || response.data || [];
      setDonations(Array.isArray(donationsData) ? donationsData : []);
      calculateStats(Array.isArray(donationsData) ? donationsData : []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to load donations. Please try refreshing.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const verifyDonation = async (id) => {
    try {
      await verifyDonationApi(id);
      fetchDonations(true);
    } catch (err) {
      console.error('Error verifying donation:', err);
    }
  };

  const handleDeleteClick = (donation) => {
    setSelectedDonation(donation);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDonation(selectedDonation._id);
      setShowDeleteModal(false);
      fetchDonations(true);
    } catch (err) {
      console.error('Error deleting donation:', err);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 text-sm">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Tablet Donation Dashboard</h2>
          <p className="text-gray-600">Track and manage all tablet donations in one place</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={() => fetchDonations(true)}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            title="Refresh donations"
          >
            <svg
              className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {/* Admin Toggle */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdmin
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isAdmin ? 'Exit Admin Mode' : 'Admin Mode'}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => fetchDonations(true)}
              className="mt-1 text-sm text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Unopened */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Unopened</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unopened}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Donations
            {refreshing && (
              <span className="ml-2 inline-flex items-center">
                <svg className="animate-spin w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
            )}
          </h3>
          <Link
            to="/donate"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Donation
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No donations yet</h3>
            <p className="text-sm text-gray-500 mb-6">Be the first to make a tablet donation and help someone in need.</p>
            <Link
              to="/donate"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Make a Donation
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {donations.map((donation) => (
              <li
                key={donation._id}
                className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {donation.donorName ? donation.donorName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{donation.donorName}</p>
                      <p className="text-xs text-gray-500 truncate">{donation.email}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        <span className="font-medium">{donation.tabletName}</span>
                        {donation.expiryDate && (
                          <span className="text-gray-400"> · Expires {new Date(donation.expiryDate).toLocaleDateString()}</span>
                        )}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                        {/* Date badge */}
                        <span className="inline-flex items-center text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                          <svg className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {/* Unopened badge */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          donation.unopened ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {donation.unopened ? '✓ Unopened' : 'Opened'}
                        </span>
                        {/* Verified badge */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          donation.verified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {donation.verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!donation.verified && (
                        <button
                          onClick={() => verifyDonation(donation._id)}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(donation)}
                        className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Delete Donation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the donation from{' '}
              <span className="font-medium text-gray-900">{selectedDonation?.donorName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
