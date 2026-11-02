import React from 'react';
import {
  Bookmark,
  FolderPlus,
  Calendar,
  Sparkles,
  ChevronRight,
  Chrome,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { NavTab } from './Sidebar.js';

interface SavedGuideViewProps {
  onOpenConnectModal: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const SavedGuideView: React.FC<SavedGuideViewProps> = ({
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
              <span>Phase 5 개발 예정 기능</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">키워드 보관함 & 콘텐츠 기획</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              발굴한 알짜 키워드를 한곳에 저장하고 포스팅 상태, 타겟 일정, 연관 상위 게시물 레퍼런스를 체계적으로 관리합니다.
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
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">관심 키워드 원클릭 보관</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            트렌드 분석 화면에서 마음에 드는 키워드를 즉시 보관함에 담고 나만의 우선순위를 지정할 수 있습니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 중요도 별점 지정<br />
            • 키워드별 메모 작성
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FolderPlus className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">카테고리 & 태그 분류</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            발행 예정 블로그 주제에 맞추어 폴더 및 커스텀 태그를 지정해 수많은 키워드를 효율적으로 관리합니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 주제별 폴더 생성<br />
            • 태그 기반 다차원 필터링
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">포스팅 발행 파이프라인</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            기획 중 &gt; 초안 작성 &gt; 발행 완료 상태를 추적하여 정기적인 블로그 포스팅 일정을 안정적으로 유지합니다.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            • 상태 플래그 (대기/작성중/발행)<br />
            • AI 글쓰기 생성 버튼 연계
          </div>
        </div>
      </div>

      {/* Feature Preview Mockup Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">키워드 보관함 레이아웃 미리보기 (Preview)</h3>
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
                <th className="py-2.5 px-4">키워드명</th>
                <th className="py-2.5 px-4">폴더 분류</th>
                <th className="py-2.5 px-4">수집 일자</th>
                <th className="py-2.5 px-4">발행 상태</th>
                <th className="py-2.5 px-4 text-center">AI 글쓰기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 opacity-70">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  <span className="flex items-center space-x-2">
                    <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                    <span>네이버 블로그 수익화 노하우</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">수익형 블로그</td>
                <td className="py-3 px-4 text-slate-400 font-mono">2026-10-19</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-semibold border border-amber-200">기획 중</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">초안 생성</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  <span className="flex items-center space-x-2">
                    <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                    <span>스마트블록 노출 가이드</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">검색 알고리즘</td>
                <td className="py-3 px-4 text-slate-400 font-mono">2026-10-18</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold border border-emerald-200">발행 완료</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">완료됨</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-xl text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>SQLite 로컬 데이터베이스 연동(Phase 5)을 통해 보관함 기능이 정식 제공될 예정입니다.</span>
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            type="button"
            className="text-teal-700 font-semibold hover:underline shrink-0 ml-3"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
