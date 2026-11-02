import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  Chrome,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FolderLock,
  LogOut,
  Info,
  HelpCircle,
  RotateCcw,
  Terminal
} from 'lucide-react';
import { BrowserStatusResponse, ApiResponse } from '@trend-studio/shared';

interface NaverConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NaverConnectModal: React.FC<NaverConnectModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // Poll browser status
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
    refetch: refetchStatus,
  } = useQuery<BrowserStatusResponse>({
    queryKey: ['browserStatus'],
    queryFn: async () => {
      const res = await fetch('/api/browser/status');
      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }
      const json: ApiResponse<BrowserStatusResponse> = await res.json();
      return json.data!;
    },
    enabled: isOpen,
    refetchInterval: isOpen ? 3000 : false,
  });

  // Open browser mutation (supports forceRestart)
  const openMutation = useMutation({
    mutationFn: async (variables?: { forceRestart?: boolean }) => {
      const res = await fetch('/api/browser/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRestart: Boolean(variables?.forceRestart) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || 'Chrome 브라우저 실행에 실패했습니다.');
      }
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['browserStatus'] });
    },
  });

  // Verify UI mutation
  const verifyMutation = useMutation({
    mutationFn: async (verified: boolean) => {
      const res = await fetch('/api/browser/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['browserStatus'] });
    },
  });

  // Close browser mutation
  const closeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/browser/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || 'Chrome 브라우저 닫기에 실패했습니다.');
      }
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['browserStatus'] });
      setShowTroubleshoot(false);
    },
  });

  if (!isOpen) return null;

  const currentStatus = statusData?.status || 'DISCONNECTED';
  const isLaunching = openMutation.isPending || currentStatus === 'LAUNCHING';
  const isClosing = closeMutation.isPending;
  const isBrowserOpen = currentStatus === 'BROWSER_OPEN';
  const isError = currentStatus === 'ERROR' || openMutation.isError;
  const isUiVerified = Boolean(statusData?.uiVerified);
  const errorMessage = openMutation.error?.message || statusData?.error || statusData?.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-surface-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">네이버 크리에이터 어드바이저 연결</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                새로운 독립 Chrome 창을 실행합니다. 로그인은 사용자가 직접 진행합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-surface-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Detailed Status Indicator Box */}
          <div className="p-4 rounded-xl border border-surface-200 bg-surface-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">브라우저 생명주기 상태:</span>
              <button
                onClick={() => refetchStatus()}
                disabled={isStatusFetching}
                title="상태 새로고침"
                className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800"
              >
                <RefreshCw className={`w-3 h-3 ${isStatusFetching ? 'animate-spin text-brand-600' : ''}`} />
                <span>새로고침</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {isLaunching ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-amber-600 animate-spin" />
                  Chrome 실행 요청 중 (LAUNCHING)
                </span>
              ) : isBrowserOpen && isUiVerified ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  사용자 화면 표시 확인 완료 (BROWSER_OPEN)
                </span>
              ) : isBrowserOpen && !isUiVerified ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  프로세스 실행 확인됨 (화면 표시 확인 필요)
                </span>
              ) : currentStatus === 'ERROR' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                  실행 실패 (ERROR)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                  브라우저 실행 전 (DISCONNECTED)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-mono pt-1">
              {statusData?.message || '대기 중입니다.'}
            </p>
          </div>

          {/* User Visual Verification Prompt (When Browser is Open) */}
          {isBrowserOpen && !isUiVerified && (
            <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-xl space-y-3">
              <div className="flex items-start space-x-2.5">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900">
                  <h4 className="font-bold text-sm">실제 Windows 바탕화면에 Chrome 창이 보이시나요?</h4>
                  <p className="mt-1 leading-relaxed text-indigo-700">
                    Playwright 백엔드 프로세스는 정상 구동되었습니다. 실제 모니터 화면 또는 작업표시줄에 새로운 Google Chrome 창이 실제로 열렸는지 직접 확인해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => verifyMutation.mutate(true)}
                  disabled={verifyMutation.isPending}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>예, 화면에 창이 보입니다</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    verifyMutation.mutate(false);
                    setShowTroubleshoot(true);
                  }}
                  disabled={verifyMutation.isPending}
                  className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100/60 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>아니오, 창이 보이지 않습니다</span>
                </button>
              </div>
            </div>
          )}

          {/* Troubleshooting Guide Box */}
          {(showTroubleshoot || (isBrowserOpen && !isUiVerified && showTroubleshoot)) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2.5 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-amber-900">
                <Terminal className="w-4 h-4 text-amber-700" />
                <span>창이 보이지 않을 때 해결 가이드</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11.5px] leading-relaxed text-amber-800">
                <li>
                  <b>단독 스모크 테스트 실행</b>: VS Code의 일반 PowerShell 터미널에서 다음 명령어를 실행하여 단독으로 창이 뜨는지 확인합니다:
                  <div className="mt-1 p-2 bg-amber-100/80 rounded font-mono text-[11px] select-all text-slate-800">
                    node scripts/chrome-smoke-test.mjs
                  </div>
                </li>
                <li>
                  <b>기존 창 강제 종료 후 재실행</b>: 숨겨진 Chrome 프로세스를 종료하고 깨끗하게 다시 실행합니다.
                </li>
              </ol>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => openMutation.mutate({ forceRestart: true })}
                  disabled={isLaunching || isClosing}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기존 프로세스 정리 후 Chrome 다시 열기</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Box when Verified */}
          {isBrowserOpen && isUiVerified && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">화면 표시 확인이 완료되었습니다!</p>
                <p className="text-[11.5px] text-emerald-700 mt-0.5">
                  독립 Chrome 창에서 마우스와 키보드로 네이버 로그인을 직접 진행하실 수 있습니다.
                  (로그인 상태 감지는 다음 Phase 3에서 구현됩니다.)
                </p>
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {isError && errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Chrome 실행 오류가 발생했습니다</span>
              </div>
              <p className="font-mono text-[11px] pl-5 break-all">{errorMessage}</p>
            </div>
          )}

          {/* Target & Profile Details */}
          <div className="space-y-2 bg-surface-50 p-4 rounded-xl border border-surface-200 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-slate-500 font-medium shrink-0">접속 대상 URL:</span>
                <p className="text-[10.5px] text-slate-400">※ 아래 링크는 일반 브라우저 참고용 링크입니다.</p>
              </div>
              <a
                href="https://creator-advisor.naver.com/"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-brand-600 hover:underline flex items-center space-x-1 break-all text-right ml-2"
              >
                <span>https://creator-advisor.naver.com/</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="flex items-start justify-between pt-1 border-t border-surface-200/60">
              <span className="text-slate-500 font-medium shrink-0 flex items-center">
                <FolderLock className="w-3 h-3 mr-1 text-slate-400" />
                독립 사용자 프로필:
              </span>
              <span className="font-mono text-[11px] text-slate-700 text-right ml-2 break-all">
                {statusData?.profilePath || '%LOCALAPPDATA%\\TrendStudio\\ChromeProfile'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-surface-200/60">
              <span className="text-slate-500 font-medium">네이버 로그인 상태:</span>
              <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                확인 필요 (Phase 3 준비)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="px-6 py-4 border-t border-surface-200 bg-surface-50 flex items-center justify-between shrink-0">
          <div>
            {isBrowserOpen && (
              <button
                type="button"
                onClick={() => closeMutation.mutate()}
                disabled={isClosing || isLaunching}
                className="px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isClosing ? '닫는 중...' : 'Chrome 창 닫기'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-surface-300 text-slate-700 hover:bg-surface-200 text-xs font-semibold transition-colors"
            >
              모달 닫기
            </button>

            {/* If already open, provide explicit re-launch button */}
            {isBrowserOpen ? (
              <button
                type="button"
                onClick={() => openMutation.mutate({ forceRestart: true })}
                disabled={isLaunching || isClosing}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chrome 창 다시 열기</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openMutation.mutate({ forceRestart: false })}
                disabled={isLaunching || isClosing}
                className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all ${
                  isLaunching
                    ? 'bg-brand-400 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 active:scale-95'
                }`}
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Chrome 실행 중...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="w-4 h-4" />
                    <span>Chrome 창 열기</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
