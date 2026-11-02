import React from 'react';
import {
  TrendingUp,
  Search,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight,
  Chrome,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NavTab } from './Sidebar.js';

interface TrendGuideViewProps {
  onOpenConnectModal: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const TrendGuideView: React.FC<TrendGuideViewProps> = ({
  onOpenConnectModal,
  onNavigateTab,
}) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span>Phase 4 개발 예정 기능</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">네이버 실시간 검색 트렌드 분석</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              네이버 크리에이터 어드바이저에서 제공하는 실시간 유입 검색어와 카테고리별 트렌드를 자동으로 분석하여 블로그 주제 선정에 필요한 인사이트를 제공합니다.
            </p>
          </div>

          <button
            onClick={onOpenConnectModal}
            type="button"
            className="self-start md:self-auto px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center space-x-2"
          >
            <Chrome className="w-4 h-4" />
            <span>네이버 연결 상태 확인</span>
          </button>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">실시간 급상승 키워드 Top 20</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            현재 시간 기준 네이버 검색 유입이 급격히 증가한 핵심 키워드를 순위별로 추적하고 변동폭을 시각화합니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 전일/전주 대비 순위 변동 감지<br />
            • 유입 기여도 비율 산출
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">주제/카테고리별 필터링</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            IT/테크, 패션/뷰티, 맛집/여행 등 블로그 주제별로 세분화된 검색어 랭킹을 선택적으로 수집하고 분석합니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 멀티 카테고리 전환 탐색<br />
            • 타겟 독자군 관심사 분석
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">상위 노출 포스트 분석</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            해당 키워드로 현재 스마트블록 및 검색 1~5위에 랭크된 블로그 포스팅의 제목과 구조를 분석합니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 상위 노출 블로그 포스트 구조 분석<br />
            • 키워드 보관함 원클릭 저장
          </div>
        </div>
      </div>

      {/* Feature Preview Mockup Container (Notice: Clear Coming Soon Tag) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">트렌드 화면 레이아웃 미리보기 (Preview)</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            개발 예정 가이드
          </span>
        </div>

        {/* Dummy Table Preview to show anticipated look */}
        <div className="overflow-x-auto border border-slate-200/60 rounded-xl bg-slate-50/40">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold text-[11px] uppercase border-b border-slate-200/60">
              <tr>
                <th className="py-2.5 px-4 w-16">순위</th>
                <th className="py-2.5 px-4">키워드</th>
                <th className="py-2.5 px-4">카테고리</th>
                <th className="py-2.5 px-4">변동 추이</th>
                <th className="py-2.5 px-4">유입 점유율</th>
                <th className="py-2.5 px-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 opacity-70">
              <tr>
                <td className="py-3 px-4 font-bold text-brand-700"># 1</td>
                <td className="py-3 px-4 font-semibold text-slate-800">네이버 블로그 수익화</td>
                <td className="py-3 px-4 text-slate-500">IT / 테크</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">▲ 3위 상승</td>
                <td className="py-3 px-4 font-mono">18.4%</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">보관</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-brand-700"># 2</td>
                <td className="py-3 px-4 font-semibold text-slate-800">스마트블록 노출 조건</td>
                <td className="py-3 px-4 text-slate-500">비즈니스</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">▲ 1위 상승</td>
                <td className="py-3 px-4 font-mono">14.2%</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">보관</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-brand-700"># 3</td>
                <td className="py-3 px-4 font-semibold text-slate-800">크리에이터 어드바이저 활용법</td>
                <td className="py-3 px-4 text-slate-500">마케팅</td>
                <td className="py-3 px-4 text-slate-400 font-medium">- 유지</td>
                <td className="py-3 px-4 font-mono">11.8%</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">보관</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Phase 2의 Chrome 브라우저 실행 및 Phase 3의 네이버 로그인 감지가 완료되면 이 화면이 활성화됩니다.</span>
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            type="button"
            className="text-emerald-700 font-semibold hover:underline shrink-0 ml-3"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
