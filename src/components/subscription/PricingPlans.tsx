import React from 'react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { Check, X } from 'lucide-react';

export default function PricingPlans() {
  const { plans, currentSubscription, updateSubscription } = useSubscriptionStore();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your team
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-sm divide-y divide-gray-200 ${
                currentSubscription?.planId === plan.id
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    £{plan.isEnterprise ? 'Custom' : plan.price}
                  </span>
                  {!plan.isEnterprise && (
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Up to {plan.isEnterprise ? 'unlimited' : plan.maxUsers} users
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pt-6 pb-8">
                {plan.isEnterprise ? (
                  <a
                    href="mailto:sales@example.com"
                    className="block w-full btn btn-primary text-center"
                  >
                    Contact Sales
                  </a>
                ) : (
                  <button
                    onClick={() => updateSubscription(plan.id)}
                    className={`w-full btn ${
                      currentSubscription?.planId === plan.id
                        ? 'btn-secondary'
                        : 'btn-primary'
                    }`}
                    disabled={currentSubscription?.planId === plan.id}
                  >
                    {currentSubscription?.planId === plan.id
                      ? 'Current Plan'
                      : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}