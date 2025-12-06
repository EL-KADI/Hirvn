'use client';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Index');

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg">Your freelance marketplace for Egypt.</p>
    </div>
  );
}
