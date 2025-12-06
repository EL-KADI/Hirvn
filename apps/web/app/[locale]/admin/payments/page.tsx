'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const t = useTranslations('AdminPayments');

  useEffect(() => {
    async function fetchPayments() {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    }
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (paymentId, status) => {
    const response = await fetch(`/api/admin/payments/${paymentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setPayments(payments.filter((p) => p.id !== paymentId));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="p-4 border rounded">
            <h2 className="text-xl font-bold">{payment.project.title}</h2>
            <p className="text-gray-500">{payment.client.name}</p>
            <p>Amount: {payment.amount} EGP</p>
            <a href={payment.proofOfPayment} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Proof
            </a>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleUpdateStatus(payment.id, 'APPROVED')}
                className="p-2 bg-green-500 text-white rounded"
              >
                {t('approve')}
              </button>
              <button
                onClick={() => handleUpdateStatus(payment.id, 'REJECTED')}
                className="p-2 bg-red-500 text-white rounded"
              >
                {t('reject')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
