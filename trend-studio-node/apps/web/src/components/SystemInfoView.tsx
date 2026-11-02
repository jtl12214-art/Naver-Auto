import React from 'react';
import {
  Server,
  Globe,
  Chrome,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
  FolderLock
} from 'lucide-react';
import { BrowserStatusResponse, HealthCheckResponse } from '@trend-studio/shared';

interface SystemInfoViewProps {
  healthData?: HealthCheckResponse;
  isHealthLoading: boolean;
  isHealthError: boolean;
  healthError: any;
  isHealthFetching: boolean;
  refetchHealth: () => void;
  browserStatusData?: BrowserStatusResponse;
  refetchBrowserStatus: () => void;
  isBrowserFetching?: boolean;
}

export const SystemInfoView: React.FC<SystemInfoViewProps> = ({
  healthData,
  isHealthLoading,
  isHealthError,
  healthError,
  isHealthFetching,
  refetchHealth,
  browserStatusData,
  refetchBrowserStatus,
  isBrowserFetching,
}) => {
  const browserStatus = browserStatusData?.status || 'DISCONNECTED';

  const handleRefreshAll = () => {
    refetchHealth();
    refetchBrowserStatus();
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">시스템 아키텍처 & 개발자 진단</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Node.js Express 백엔드, Vite 프론트엔드, Playwright Chrome 브라우저 연동 실시간 상태
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isHealthFetching || isBrowserFetching}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${(isHealthFetching || isBrowserFetching) ? 'animate-spin text-brand-600' : ''}`} />
          <span>전체 상태 새로고침</span>
        </button>
      </div>

      {/* Core Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Frontend Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
          <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Backend API</h4>
                <p className="text-xs text-slate-400">Node.js + Express</p>
              </div>
            </div>
            {isHealthLoading ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                확인 중...
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
          <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brand-600 flex items-center justify-center">
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
            ) : browserStatus === 'LAUNCHING' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                실행 중
              </span>
            ) : browserStatus === 'ERROR' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                오류
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                대기 중
              </span>
            )}
          </div>
          <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
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

      {/* Real-time API Response JSON Viewers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-sm">실시간 백엔드 및 브라우저 원본 API 응답</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">GET /api/health & GET /api/browser/status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1 border-b border-slate-800">
              <span>// API Health 응답 (/api/health)</span>
              <span className="text-[10px] text-emerald-400">HTTP 200</span>
            </div>
            <pre className="leading-relaxed">{JSON.stringify(healthData || { status: 'loading' }, null, 2)}</pre>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1 border-b border-slate-800">
              <span>// Browser Status 응답 (/api/browser/status)</span>
              <span className="text-[10px] text-emerald-400">HTTP 200</span>
            </div>
            <pre className="leading-relaxed">{JSON.stringify(browserStatusData || { status: 'DISCONNECTED' }, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Phase Roadmap Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">개발 단계별 진행 현황 (Phase Roadmap)</h3>
        <div className="space-y-3">
          {/* Phase 0 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-slate-800">Phase 0: 개발 환경 점검</h5>
                <p className="text-[11px] text-slate-500">Node v24.22.0, npm 11.19.1, Chrome 경로 확인 완료</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">완료</span>
          </div>

          {/* Phase 1 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-slate-800">Phase 1: Node.js 서버 및 React 연결</h5>
                <p className="text-[11px] text-slate-500">npm workspace 모노레포 구축, localhost:5173 ↔ 127.0.0.1:3001 연동</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">완료 (사용자 승인)</span>
          </div>

          {/* Phase 2 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-brand-200">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">Phase 2: Chrome 브라우저 실행 기능 & 대시보드 UI</h5>
                <p className="text-[11px] text-slate-600">Playwright 독립 프로필 Chrome 실행, 연결 모달, SaaS 대시보드 UI</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-100 text-brand-800">
              구현 완료 (1단계 UI 개편)
            </span>
          </div>

          {/* Phase 3 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 opacity-70">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">3</div>
              <div>
                <h5 className="text-xs font-bold text-slate-600">Phase 3: 네이버 로그인 상태 확인</h5>
                <p className="text-[11px] text-slate-400">사용자 수동 로그인 후 인증 페이지 상태 감지</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-500">다음 단계 예정</span>
          </div>

          {/* Phase 4 ~ 7 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 opacity-50">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">4-7</div>
              <div>
                <h5 className="text-xs font-bold text-slate-600">Phase 4~7: UI 대시보드, SQLite DB, 네이버 데이터 관리</h5>
                <p className="text-[11px] text-slate-400">단계별 순차 진행</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-400">대기</span>
          </div>
        </div>
      </div>
    </div>
  );
};
