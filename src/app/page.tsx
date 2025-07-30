'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AppLayout from '@/components/AppLayout';
import TeamDashboard from '@/components/TeamDashboard';
import LoginPage from '@/components/LoginPage';
import ManagerPage from '@/components/ManagerPage';
import AdminPage from '@/components/AdminPage';
import { SkeletonAppLayout } from '@/components/skeletons/SkeletonLayout';

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('team');

  // Show loading state
  if (status === 'loading') {
    return <SkeletonAppLayout />;
  }

  // Show login page if not authenticated
  if (!session) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamDashboard />;
      case 'manager':
        return <ManagerPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <TeamDashboard />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      session={session}
    >
      {renderContent()}
    </AppLayout>
  );
}
