import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Server,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Bookmark,
  FileText,
  ChevronRight,
  Chrome,
  ExternalLink
} from 'lucide-react';
import { HealthCheckResponse, BrowserStatusResponse, ApiResponse } from '@trend-studio/shared';
import { NaverConnectModal } from './components/NaverConnectModal.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trends' | 'saved' | 'settings'>('dashboard');
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

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-content-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-surface-200 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-sm shadow-brand-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">NAVER Trend</h1>
            <p className="text-xs text-brand-600 font-medium mt-1">Studio MVP</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-content-secondary hover:bg-surface-100 hover:text-content-primary'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-600" />
            <span>대시보드</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'trends'
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-content-secondary hover:bg-surface-100 hover:text-content-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>트렌드 분석</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-slate-600 font-medium">Phase 4</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-content-secondary hover:bg-surface-100 hover:text-content-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>키워드 보관함</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-slate-600 font-medium">Phase 5</span>
          </button>

          <div className="pt-2 pb-1 px-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">추후 확장</span>
          </div>

          <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-400 cursor-not-allowed">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-slate-300" />
              <span>게시물 분석</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">추후 개발</span>
          </div>

          <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-400 cursor-not-allowed">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-slate-300" />
              <span>AI 글쓰기</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">추후 개발</span>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-surface-200 bg-surface-50 text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">NAVER Trend Studio</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-brand-100 text-brand-700 rounded font-bold">Phase 2</span>
          </div>
          <p className="text-[11px] text-slate-400">Node.js Monorepo Architecture</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">시스템 연결 대시보드</h2>
            <p className="text-xs text-slate-500">Node.js 백엔드 & 독립 Chrome 브라우저 실시간 연동</p>
          </div>

          {/* Status Indicators in Header */}
          <div className="flex items-center space-x-3">
            {/* Chrome Status Badge */}
            {browserStatus === 'BROWSER_OPEN' ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Chrome: <b>실행 확인됨 (독립 창 열림)</b></span>
              </div>
            ) : browserStatus === 'LAUNCHING' ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                <span>Chrome: <b>실행 중...</b></span>
              </div>
            ) : browserStatus === 'ERROR' ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Chrome: <b>실행 오류</b></span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Chrome: <b>대기 중 (DISCONNECTED)</b></span>
              </div>
            )}

            {/* Naver Auth Status Badge (Phase 3 준비) */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>네이버 로그인: <b>확인 필요</b></span>
            </div>

            {/* Naver Connect Button */}
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>네이버 연결하기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Phase 2 Feature Banner */}
          <div className="p-5 bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 rounded-card flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/20">
                <Chrome className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <h3 className="font-bold text-slate-900 text-base">Phase 2: 독립 Chrome 브라우저 실행 모듈 준비 완료</h3>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Playwright for Node.js 기반의 독립 Chrome 인스턴스 관리자가 탑재되었습니다.
                  개인 Chrome 프로필과 완전히 분리된 전용 프로필(<code className="bg-white/80 px-1.5 py-0.5 rounded border border-brand-200 font-mono text-slate-800">%LOCALAPPDATA%\TrendStudio\ChromeProfile</code>)로 안전하게 실행됩니다.
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <span>네이버 크리에이터 어드바이저 연결 모달 열기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-slate-400">
                    현재 상태: <b className="text-slate-700">{browserStatus}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Frontend Card */}
            <div className="bg-white p-5 rounded-card border border-surface-200 shadow-xs hover:border-brand-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Frontend App</h4>
                    <p className="text-xs text-slate-400">Vite + React + TS</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  정상 가동
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-surface-50 p-2.5 rounded-lg border border-surface-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">접속 주소:</span>
                  <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-mono">
                    http://localhost:5173
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vite Proxy:</span>
                  <span className="font-mono text-slate-700">/api → :3001</span>
                </div>
              </div>
            </div>

            {/* Backend API Card */}
            <div className="bg-white p-5 rounded-card border border-surface-200 shadow-xs hover:border-brand-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Backend API</h4>
                    <p className="text-xs text-slate-400">Node.js + Express</p>
                  </div>
                </div>
                {isHealthLoading ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    연결 확인 중...
                  </span>
                ) : isHealthError ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    연결 실패
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    연결됨 (HTTP 200)
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-surface-50 p-2.5 rounded-lg border border-surface-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">API 엔드포인트:</span>
                  <span className="font-mono text-slate-700">http://127.0.0.1:3001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">가동 시간 (Uptime):</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {healthData ? `${healthData.uptime}초` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chrome Playwright Card */}
            <div className="bg-white p-5 rounded-card border border-surface-200 shadow-xs hover:border-brand-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-brand-600 flex items-center justify-center">
                    <Chrome className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Chrome 자동화</h4>
                    <p className="text-xs text-slate-400">Playwright Node.js</p>
                  </div>
                </div>
                {browserStatus === 'BROWSER_OPEN' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    열림 (OPEN)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    대기 중
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-surface-50 p-2.5 rounded-lg border border-surface-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">실행 채널:</span>
                  <span className="font-mono font-medium text-slate-700">Google Chrome</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">현재 상태:</span>
                  <span className="font-mono font-bold text-slate-800">{browserStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Health Response Viewer */}
          <div className="bg-white rounded-card border border-surface-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">실시간 백엔드 및 브라우저 API 상태</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    refetchHealth();
                    refetchBrowserStatus();
                  }}
                  disabled={isHealthFetching}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-surface-200 text-xs font-medium text-slate-600 hover:bg-surface-100 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isHealthFetching ? 'animate-spin text-brand-600' : ''}`} />
                  <span>새로고침</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-slate-200 font-mono text-xs overflow-x-auto">
                <span className="text-slate-400 block mb-1">// API Health 응답 (/api/health)</span>
                <pre>{JSON.stringify(healthData, null, 2)}</pre>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-slate-200 font-mono text-xs overflow-x-auto">
                <span className="text-slate-400 block mb-1">// Browser Status 응답 (/api/browser/status)</span>
                <pre>{JSON.stringify(browserStatusData, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Phase Roadmap Card */}
          <div className="bg-white rounded-card border border-surface-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">개발 단계별 진행 현황 (Phase Roadmap)</h3>
            <div className="space-y-3">
              {/* Phase 0 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Phase 0: 개발 환경 점검</h5>
                    <p className="text-[11px] text-slate-500">Node v24.22.0, npm 11.19.1, Chrome 경로 확인 완료</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">완료</span>
              </div>

              {/* Phase 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Phase 1: Node.js 서버 및 React 연결</h5>
                    <p className="text-[11px] text-slate-500">npm workspace 모노레포 구축, localhost:5173 ↔ 127.0.0.1:3001 연동</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">완료 (사용자 승인)</span>
              </div>

              {/* Phase 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/70 border border-brand-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Phase 2: Chrome 브라우저 실행 기능</h5>
                    <p className="text-[11px] text-slate-600">Playwright 독립 프로필 Chrome 실행, 연결 모달, 상태 관리</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-100 text-brand-800">
                  구현 완료 (사용자 GUI 확인 대기)
                </span>
              </div>

              {/* Phase 3 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200 opacity-70">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">3</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-600">Phase 3: 네이버 로그인 상태 확인</h5>
                    <p className="text-[11px] text-slate-400">사용자 수동 로그인 후 인증 페이지 상태 감지</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-200 text-slate-500">다음 단계 예정</span>
              </div>

              {/* Phase 4 ~ 7 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200 opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">4-7</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-600">Phase 4~7: UI 대시보드, SQLite DB, 네이버 데이터 관리</h5>
                    <p className="text-[11px] text-slate-400">단계별 순차 진행</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-200 text-slate-400">대기</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Naver Connect Modal */}
      <NaverConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
