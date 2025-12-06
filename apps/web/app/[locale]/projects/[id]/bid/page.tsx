'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function BidPage() {
  const t = useTranslations('Bid');
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState('');
  const [project, setProject] = useState(null);
  const { id: projectId } = useParams();

  useEffect(() => {
    // Fetch project details here
    async function fetchProject() {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    }
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${projectId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposal, amount }),
      });

      if (response.ok) {
        // Handle successful bid submission
        console.log('Bid submitted successfully');
      } else {
        // Handle bid submission error
        console.error('Bid submission failed');
      }
    } catch (error) {
      console.error('An error occurred during bid submission:', error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-bold">{project.title}</h2>
        <p>{project.description}</p>
        <p className="font-bold">{project.budget} EGP</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="proposal">{t('proposal')}</label>
          <textarea
            id="proposal"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="amount">{t('amount')}</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
