'use client';
import { VolatileAvatarInterface } from '@/components/VolatileAvatarInterface';
import { AdminPanel } from '@/components/AdminPanel';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main>
      <VolatileAvatarInterface />

      <div className="bg-zinc-950 p-8 border-t border-zinc-900">
        <AdminPanel />
      </div>
    </main>
  );
}
