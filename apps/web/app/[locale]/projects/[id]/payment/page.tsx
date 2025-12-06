'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function PaymentPage() {
  const t = useTranslations('Payment');
  const [proof, setProof] = useState(null);
  const { id: projectId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof) return;

    const formData = new FormData();
    formData.append('proofOfPayment', proof);

    try {
      const response = await fetch(`/api/projects/${projectId}/payment`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle successful payment submission
        console.log('Payment proof submitted successfully');
      } else {
        // Handle payment submission error
        console.error('Payment proof submission failed');
      }
    } catch (error) {
      console.error('An error occurred during payment proof submission:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProof(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="proof">{t('proofOfPayment')}</label>
          <input
            id="proof"
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {t('submit')}
        </button>
      </form>
    </div>
  );
}
