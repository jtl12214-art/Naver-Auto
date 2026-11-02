import React from 'react';
import {
  TrendingUp,
  Layers,
  Bookmark,
  FileText,
  Sparkles,
  Cpu,
  ChevronRight,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'dashboard' | 'trends' | 'saved' | 'system';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isBackendHealthy: boolean;
  isBackendLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isBackendHealthy,
  isBackendLoading,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 select-none">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-100 flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">NAVER Trend</span>
          </div>
          <p className="text-xs text-brand-600 font-semibold mt-1 tracking-wide">Studio</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3.5 space-y-1.5 flex-1">
        <div className="px-3 pb-1 pt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          주요 메뉴
        </div>

        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Layers className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-brand-600' : 'text-slate-400'}`} />
            <span>대시보드</span>
          </div>
          {activeTab === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
        </button>

        {/* Trends */}
        <button
          onClick={() => onSelectTab('trends')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'trends'
              ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className={`w-4 h-4 ${activeTab === 'trends' ? 'text-brand-600' : 'text-slate-400'}`} />
            <span>트렌드 분석</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">안내</span>
        </button>

        {/* Saved Keywords */}
        <button
          onClick={() => onSelectTab('saved')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bookmark className={`w-4 h-4 ${activeTab === 'saved' ? 'text-brand-600' : 'text-slate-400'}`} />
            <span>키워드 보관함</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">안내</span>
        </button>

        {/* Section: Future Features */}
        <div className="px-3 pb-1 pt-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          확장 예정
        </div>

        {/* Post Analysis - Disabled */}
        <div
          title="추후 개발 예정인 기능입니다"
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-400 cursor-not-allowed bg-slate-50/50"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-slate-300" />
            <span>게시물 분석</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">추후 개발</span>
        </div>

        {/* AI Writing - Disabled */}
        <div
          title="추후 개발 예정인 기능입니다"
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-400 cursor-not-allowed bg-slate-50/50"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-4 h-4 text-slate-300" />
            <span>AI 글쓰기</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">추후 개발</span>
        </div>

        {/* Section: Settings & System */}
        <div className="px-3 pb-1 pt-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          관리 & 진단
        </div>

        <button
          onClick={() => onSelectTab('system')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'system'
              ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Cpu className={`w-4 h-4 ${activeTab === 'system' ? 'text-brand-600' : 'text-slate-400'}`} />
            <span>시스템 정보</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-100/80 text-brand-700 font-semibold">진단</span>
        </button>
      </nav>

      {/* Sidebar Footer with Engine Health Pill */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">엔진 상태</span>
          {isBackendLoading ? (
            <span className="inline-flex items-center text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse mr-1.5" />
              확인 중
            </span>
          ) : isBackendHealthy ? (
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              정상 가동
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
              오류
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 leading-tight">
          독립 Playwright 인스턴스 격리 모드
        </div>
      </div>
    </aside>
  );
};
