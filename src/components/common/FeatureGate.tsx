import React from 'react';
import { FeatureFlag } from '../../types';
import { useFeature } from '../../hooks/useFeature';
import { Lock } from 'lucide-react';

interface FeatureGateProps {
  feature: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const hasAccess = useFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-gray-900">Premium Feature</h3>
      <p className="mt-1 text-sm text-gray-500">
        Upgrade your subscription to access this feature.
      </p>
      <a
        href="/subscription"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        View Plans
      </a>
    </div>
  );
}