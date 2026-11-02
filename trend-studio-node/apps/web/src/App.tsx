import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HealthCheckResponse, BrowserStatusResponse, ApiResponse } from '@trend-studio/shared';
import { NaverConnectModal } from './components/NaverConnectModal.js';
import { Sidebar, NavTab } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { DashboardView } from './components/DashboardView.js';
import { TrendGuideView } from './components/TrendGuideView.js';
import { SavedGuideView } from './components/SavedGuideView.js';
import { SystemInfoView } from './components/SystemInfoView.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Query Backend Health via Vite Proxy (/api/health)
  const {
    data: healthData,
    isLoading: isHealthLoading,
    isError: isHealthError,
    error: healthError,
    refetch: refetchHealth,
    isFetching: isHealthFetching,
  } = useQuery<HealthCheckResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
      return res.json();
    },
    refetchInterval: 5000,
  });

  // Query Browser Status (/api/browser/status)
  const {
    data: browserStatusData,
    refetch: refetchBrowserStatus,
    isFetching: isBrowserStatusFetching,
  } = useQuery<BrowserStatusResponse>({
    queryKey: ['browserStatus'],
    queryFn: async () => {
      const res = await fetch('/api/browser/status');
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const json: ApiResponse<BrowserStatusResponse> = await res.json();
      return json.data!;
    },
    refetchInterval: 3000,
  });

  const browserStatus = browserStatusData?.status || 'DISCONNECTED';
  const isBackendHealthy = !isHealthLoading && !isHealthError && healthData?.status === 'ok';

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-content-primary antialiased font-sans">
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isBackendHealthy={isBackendHealthy}
        isBackendLoading={isHealthLoading}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header
          activeTab={activeTab}
          browserStatus={browserStatus}
          uiVerified={browserStatusData?.uiVerified}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          {activeTab === 'dashboard' && (
            <DashboardView
              browserStatus={browserStatus}
              browserData={browserStatusData}
              healthData={healthData}
              isHealthLoading={isHealthLoading}
              isHealthError={isHealthError}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'trends' && (
            <TrendGuideView
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'saved' && (
            <SavedGuideView
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'system' && (
            <SystemInfoView
              healthData={healthData}
              isHealthLoading={isHealthLoading}
              isHealthError={isHealthError}
              healthError={healthError}
              isHealthFetching={isHealthFetching}
              refetchHealth={refetchHealth}
              browserStatusData={browserStatusData}
              refetchBrowserStatus={refetchBrowserStatus}
              isBrowserFetching={isBrowserStatusFetching}
            />
          )}
        </main>
      </div>

      {/* 3. Naver Connect Modal (Props contract perfectly preserved) */}
      <NaverConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
