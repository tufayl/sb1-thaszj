import React from 'react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { AlertTriangle } from 'lucide-react';

export default function SubscriptionStatus() {
  const { getCurrentPlan, getActiveUserCount } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const activeUsers = getActiveUserCount();

  if (!currentPlan) return null;

  const isNearLimit = activeUsers >= currentPlan.maxUsers * 0.8;
  const isAtLimit = activeUsers >= currentPlan.maxUsers;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Current Plan: {currentPlan.name}</h3>
          <p className="text-sm text-gray-500">
            {activeUsers} of {currentPlan.maxUsers} users active
          </p>
        </div>

        {isNearLimit && (
          <div className={`flex items-center gap-2 ${
            isAtLimit ? 'text-red-600' : 'text-yellow-600'
          }`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {isAtLimit 
                ? 'User limit reached' 
                : 'Approaching user limit'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}