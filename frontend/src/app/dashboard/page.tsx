"use client";

import RouteGuard from '@/components/auth/RouteGuard';
import Layout from '@/components/layout/Layout';

export default function Dashboard() {

  return (
    <RouteGuard>
      <Layout>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-neutral-400">eCommerce</p>
        </div>

        <div className="bg-[#0b0c0d] border border-neutral-800 rounded-md h-[60vh]">
          {/* área de conteúdo */}
        </div>
      </Layout>
    </RouteGuard>
  );
}
