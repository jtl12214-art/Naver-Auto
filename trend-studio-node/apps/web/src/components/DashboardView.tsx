import React, { useState } from 'react';
import {
  TrendingUp,
  Bookmark,
  Chrome,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Server,
  Globe,
  Terminal,
  Activity,
  Layers,
  HelpCircle,
  FolderLock
} from 'lucide-react';
import { BrowserStatus, BrowserStatusResponse, HealthCheckResponse } from '@trend-studio/shared';
import { NavTab } from './Sidebar.js';

interface DashboardViewProps {
  browserStatus: BrowserStatus;
  browserData?: BrowserStatusResponse;
  healthData?: HealthCheckResponse;
  isHealthLoading: boolean;
  isHealthError: boolean;
  onOpenConnectModal: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  browserStatus,
  browserData,
  healthData,
  isHealthLoading,
  isHealthError,
  onOpenConnectModal,
  onNavigateTab,
}) => {
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const isBrowserOpen = browserStatus === 'BROWSER_OPEN';
  const isLaunching = browserStatus === 'LAUNCHING';
  const isError = browserStatus === 'ERROR';

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Hero / Intro Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-7 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100 mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>NAVER Trend Studio v1.0</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl leading-snug">
            네이버 검색 트렌드 & 키워드 분석
          </h2>
          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            개인 브라우저와 완전히 분리된 안전한 전용 Chrome 인스턴스를 통해 네이버 크리에이터 어드바이저의 트렌드 지표를 수집하고 고효율 블로그 키워드를 발굴합니다.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenConnectModal}
              type="button"
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-emerald-600" />
              <span>{isBrowserOpen ? '네이버 연결 관리 / 창 확인' : '네이버 연결하기'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('trends')}
              type="button"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>트렌드 분석 안내</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </section>

      {/* 2. Top Status & Action Grid (1440px friendly) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Connection Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Chrome className="w-5 h-5" />
              </div>
              {isBrowserOpen && browserData?.uiVerified ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                  독립 창 확인 완료
                </span>
              ) : isBrowserOpen && !browserData?.uiVerified ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1.5" />
                  실행됨 · 화면 확인 필요
                </span>
              ) : isLaunching ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 mr-1 animate-spin text-amber-600" />
                  실행 요청 중
                </span>
              ) : isError ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  실행 오류
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  연결 대기
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900">네이버 브라우저 연동</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Playwright 기반의 독립 프로필로 실행되며, 개인 브라우저 세션과 간섭 없이 운영됩니다.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 font-sans">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">대상 서비스</span>
                <a
                  href="https://creator-advisor.naver.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand-600 hover:underline flex items-center space-x-1"
                >
                  <span>크리에이터 어드바이저</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">보안 프로필</span>
                <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]" title={browserData?.profilePath}>
                  독립 프로필 격리
                </span>
              </div>
              {browserData?.chromePid && (
                <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Chrome PID</span>
                  <span className="font-mono text-[11px] font-bold text-slate-800">
                    {browserData.chromePid}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenConnectModal}
              type="button"
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>{isBrowserOpen ? 'Chrome 창 설정 및 상태 확인' : '네이버 연결하기'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Trend Analysis Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                기능 안내
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">실시간 트렌드 분석</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              네이버 급상승 검색어와 주제별 유입 키워드를 분석하고 실시간 랭킹 변동을 파악합니다.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                <span>주제별 급상승 검색어 실시간 랭킹 추적</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                <span>검색 유입 비율 및 전일 대비 순위 변동</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                <span>블로그 상위 노출 상위 5개 게시물 분석</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('trends')}
              type="button"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 border border-slate-200/80 cursor-pointer"
            >
              <span>트렌드 분석 기능 둘러보기</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Keyword Library Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                기능 안내
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">키워드 보관함 & 인사이트</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              발굴한 고효율 키워드를 체계적으로 보관하고, 콘텐츠 기획 및 포스팅 관리에 활용합니다.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>관심 키워드 원클릭 보관 및 분류 관리</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>키워드별 포스팅 발행 상태 및 일정 추적</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>추후 AI 초안 글쓰기 연계 준비</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('saved')}
              type="button"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 border border-slate-200/80 cursor-pointer"
            >
              <span>키워드 보관함 기능 둘러보기</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Workflow Pipeline / Recent Activity Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">시스템 연동 파이프라인</h3>
            <p className="text-xs text-slate-500 mt-0.5">네이버 데이터 수집 및 분석을 위한 단계별 준비 상태</p>
          </div>
          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
            단계 진행 중
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border ${isBrowserOpen ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'} space-y-1.5`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">1. 독립 브라우저 구동</span>
              {isBrowserOpen ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">준비 완료</span>
              ) : (
                <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">실행 대기</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Playwright 독립 Chrome 창 실행 및 세션 프로필 연결
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border bg-amber-50/40 border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">2. 네이버 계정 로그인</span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">확인 필요</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              열린 Chrome 창에서 직접 수동 로그인 (Phase 3 준비 중)
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-200 opacity-80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">3. 트렌드 데이터 수집</span>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded">예정</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              급상승 검색어 추출, 순위 변동 저장 및 대시보드 시각화
            </p>
          </div>
        </div>
      </div>

      {/* 4. Collapsible Developer Diagnostics Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-xs font-bold text-slate-800">개발자 시스템 진단 정보</span>
              <span className="text-[11px] text-slate-400 ml-2">
                (백엔드 포트, 가동 시간, API 응답 미리보기)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span>{isDiagnosticsOpen ? '접기' : '펼쳐보기'}</span>
            {isDiagnosticsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isDiagnosticsOpen && (
          <div className="p-6 space-y-4 border-t border-slate-200/80 animate-in fade-in duration-150">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <span className="text-slate-400 block text-[11px]">Backend API</span>
                <span className="font-mono font-bold text-slate-800">
                  {isHealthLoading ? '확인 중...' : isHealthError ? '연결 오류' : '127.0.0.1:3001'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <span className="text-slate-400 block text-[11px]">Frontend Port</span>
                <span className="font-mono font-bold text-slate-800">localhost:5173</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <span className="text-slate-400 block text-[11px]">Backend Uptime</span>
                <span className="font-mono font-bold text-brand-600">
                  {healthData ? `${healthData.uptime}초` : '-'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500">
                개발 로드맵, 전체 JSON 원본 응답 및 포트 상세 정보는 시스템 정보 탭에서 확인하실 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('system')}
                className="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors flex items-center space-x-1"
              >
                <span>전체 시스템 정보 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
