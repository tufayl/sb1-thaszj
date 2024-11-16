import React from 'react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Building2
} from 'lucide-react';
import PricingPlans from './PricingPlans';
import SubscriptionStatus from './SubscriptionStatus';

export default function AdminDashboard() {
  const { 
    getCurrentPlan, 
    currentSubscription
  } = useSubscriptionStore();
  const { users } = useAuthStore();
  
  const currentPlan = getCurrentPlan();
  const activeUsers = users.filter(user => user.isActive).length;

  if (!currentPlan || !currentSubscription) return null;

  const nextBillingDate = new Date(currentSubscription.nextBillingDate);
  const daysUntilRenewal = Math.ceil(
    (nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const userUtilization = (activeUsers / currentPlan.maxUsers) * 100;
  const isNearLimit = userUtilization >= 80;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
              <p className="text-sm text-gray-500">
                of {currentPlan.maxUsers} available
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Current Plan</p>
              <p className="text-2xl font-bold">{currentPlan.name}</p>
              <p className="text-sm text-gray-500">
                £{currentPlan.price}/month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Next Billing</p>
              <p className="text-2xl font-bold">
                {daysUntilRenewal} days
              </p>
              <p className="text-sm text-gray-500">
                {nextBillingDate.toLocaleDateString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">User Utilization</p>
              <p className="text-2xl font-bold">
                {userUtilization.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                of total capacity
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              isNearLimit ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                isNearLimit ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Warning */}
      {isNearLimit && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">
                Approaching User Limit
              </p>
              <p className="text-sm text-yellow-700">
                You are using {activeUsers} out of {currentPlan.maxUsers} available user licenses. 
                Consider upgrading your plan to accommodate more users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User License Usage */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">User License Usage</h2>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                {activeUsers} Active Users
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.round(userUtilization)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
            <div
              style={{ width: `${userUtilization}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                isNearLimit ? 'bg-red-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {currentPlan.maxUsers - activeUsers} licenses remaining
        </p>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-gray-500">{currentPlan.name}</p>
              </div>
            </div>
            <p className="font-medium">£{currentPlan.price}/month</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Next Billing Date</p>
                <p className="text-sm text-gray-500">
                  {nextBillingDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="btn btn-secondary">View Invoice History</button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <PricingPlans />
      </div>
    </div>
  );
}