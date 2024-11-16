import { FeatureFlag } from '../types';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function useFeature(feature: FeatureFlag) {
  const hasFeature = useSubscriptionStore(state => state.hasFeature(feature));
  return hasFeature;
}