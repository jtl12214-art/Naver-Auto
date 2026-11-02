import React from 'react';
import {
  Chrome,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { BrowserStatus } from '@trend-studio/shared';
import { NavTab } from './Sidebar.js';

interface HeaderProps {
  activeTab: NavTab;
  browserStatus: BrowserStatus;
  uiVerified?: boolean;
  onOpenConnectModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  browserStatus,
  uiVerified = false,
  onOpenConnectModal,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: '대시보드',
          description: '네이버 크리에이터 어드바이저 트렌드 수집 및 계정 연동 현황',
        };
      case 'trends':
        return {
          title: '트렌드 분석 안내',
          description: '급상승 검색어와 주제별 트렌드 지표 분석 기능',
        };
      case 'saved':
        return {
          title: '키워드 보관함 안내',
          description: '발굴한 고효율 검색어 저장 및 콘텐츠 기획 관리',
        };
      case 'system':
        return {
          title: '시스템 정보 & 개발자 진단',
          description: '서버 상태, 브라우저 프로세스, 원본 API 응답 데이터 및 로드맵',
        };
      default:
        return {
          title: '대시보드',
          description: '네이버 트렌드 스튜디오',
        };
    }
  };

  const { title, description } = getTabTitle();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-xs">
      {/* Title & Description */}
      <div className="min-w-0 pr-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight flex items-center space-x-2">
          <span>{title}</span>
        </h2>
        <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
      </div>

      {/* Badges & Action */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Chrome Status Badge */}
        {browserStatus === 'BROWSER_OPEN' && uiVerified ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chrome: <b>독립 창 확인 완료</b></span>
          </div>
        ) : browserStatus === 'BROWSER_OPEN' && !uiVerified ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Chrome: <b>실행 확인됨 · 화면 확인 필요</b></span>
          </div>
        ) : browserStatus === 'LAUNCHING' ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Chrome: <b>실행 중...</b></span>
          </div>
        ) : browserStatus === 'ERROR' ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 shadow-xs">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Chrome: <b>실행 오류</b></span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Chrome: <b>대기 중</b></span>
          </div>
        )}

        {/* Naver Login Status Badge */}
        <div
          title="네이버 로그인은 독립 Chrome 창에서 직접 진행합니다 (로그인 자동 감지는 Phase 3 예정)"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>네이버 로그인: <b>확인 필요</b></span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={onOpenConnectModal}
          type="button"
          className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer hover:shadow-brand-500/20"
        >
          <Chrome className="w-3.5 h-3.5" />
          <span>네이버 연결하기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
