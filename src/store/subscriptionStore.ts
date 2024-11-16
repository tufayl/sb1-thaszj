import { create } from 'zustand';
import { SubscriptionPlan, Subscription, FeatureFlag } from '../types';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'tier-1',
    name: 'Basic',
    maxUsers: 1,
    price: 20,
    billingPeriod: 'monthly',
    features: [
      'Single user access',
      'Basic project management',
      'Client management',
      'Document storage'
    ],
    enabledFeatures: []
  },
  {
    id: 'tier-2',
    name: 'Team',
    maxUsers: 3,
    price: 50,
    billingPeriod: 'monthly',
    features: [
      'Up to 3 users',
      'Advanced project management',
      'Task assignments',
      'Basic timeline view',
      'Enhanced reporting'
    ],
    enabledFeatures: ['gantt_chart']
  },
  {
    id: 'tier-3',
    name: 'Professional',
    maxUsers: 5,
    price: 80,
    billingPeriod: 'monthly',
    features: [
      'Up to 5 users',
      'Resource management',
      'Advanced analytics',
      'Priority support',
      'Custom workflows',
      'Document versioning'
    ],
    enabledFeatures: [
      'gantt_chart',
      'resource_management',
      'document_versioning'
    ]
  },
  {
    id: 'tier-4',
    name: 'Business',
    maxUsers: 10,
    price: 150,
    billingPeriod: 'monthly',
    features: [
      'Up to 10 users',
      'Enterprise-grade security',
      'API access',
      'Dedicated support',
      'Advanced integrations',
      'Custom branding',
      'Client portal'
    ],
    enabledFeatures: [
      'gantt_chart',
      'resource_management',
      'document_versioning',
      'client_portal',
      'financial_module',
      'advanced_reporting'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    maxUsers: Infinity,
    price: 0,
    billingPeriod: 'monthly',
    isEnterprise: true,
    features: [
      'Unlimited users',
      'Custom development',
      'On-premise deployment option',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom integrations',
      'BIM integration'
    ],
    enabledFeatures: [
      'gantt_chart',
      'resource_management',
      'document_versioning',
      'client_portal',
      'financial_module',
      'advanced_reporting',
      'bim_integration',
      'bulk_operations'
    ]
  }
];

interface SubscriptionStore {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  getCurrentPlan: () => SubscriptionPlan | null;
  canAddUser: (activeUserCount: number) => boolean;
  updateSubscription: (planId: string) => void;
  cancelSubscription: () => void;
  hasFeature: (feature: FeatureFlag) => boolean;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plans: SUBSCRIPTION_PLANS,
  currentSubscription: {
    id: 'sub-1',
    planId: 'tier-1',
    startDate: new Date().toISOString(),
    lastBillingDate: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },

  getCurrentPlan: () => {
    const { currentSubscription, plans } = get();
    if (!currentSubscription) return null;
    return plans.find(plan => plan.id === currentSubscription.planId) || null;
  },

  canAddUser: (activeUserCount: number) => {
    const { getCurrentPlan } = get();
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return false;
    return activeUserCount < currentPlan.maxUsers;
  },

  hasFeature: (feature: FeatureFlag) => {
    const { getCurrentPlan } = get();
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return false;
    return currentPlan.enabledFeatures.includes(feature);
  },

  updateSubscription: (planId: string) => {
    set(state => ({
      currentSubscription: {
        id: crypto.randomUUID(),
        planId,
        startDate: new Date().toISOString(),
        lastBillingDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    }));
  },

  cancelSubscription: () => {
    set(state => ({
      currentSubscription: state.currentSubscription
        ? { ...state.currentSubscription, status: 'cancelled' }
        : null
    }));
  }
}));