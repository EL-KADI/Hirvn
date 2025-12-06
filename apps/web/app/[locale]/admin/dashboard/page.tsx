'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [settings, setSettings] = useState({ paymentLock: false });
  const t = useTranslations('AdminDashboard');

  useEffect(() => {
    async function fetchData() {
      const revenueResponse = await fetch('/api/admin/revenue');
      if (revenueResponse.ok) {
        const data = await revenueResponse.json();
        setTotalRevenue(data.totalRevenue);
      }

      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const data = await settingsResponse.json();
        setSettings(data);
      }
    }
    fetchData();
  }, []);

  const handleTogglePaymentLock = async () => {
    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
    });
    if (response.ok) {
      const data = await response.json();
      setSettings(data);
    }
  };

  let revenueColor = 'text-green-500';
  if (totalRevenue < 10000) {
    revenueColor = 'text-yellow-500';
  }
  if (totalRevenue < 5000) {
    revenueColor = 'text-red-500';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">{t('totalRevenue')}</h2>
        <p className={`text-3xl font-bold ${revenueColor}`}>{totalRevenue} EGP</p>
      </div>
      <div className="p-4 border rounded mt-4">
        <h2 className="text-xl font-bold">{t('paymentLock')}</h2>
        <button
          onClick={handleTogglePaymentLock}
          className={`p-2 text-white rounded mt-2 ${
            settings.paymentLock ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {settings.paymentLock ? t('unlockPayments') : t('lockPayments')}
        </button>
      </div>
    </div>
  );
}
