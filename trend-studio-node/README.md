# NAVER Trend Studio

네이버 크리에이터 어드바이저의 주제별 트렌드를 분석하고, 키워드와 관련 게시물(TOP 5)을 체계적으로 수집·관리하는 올인원 웹 플랫폼입니다.

---

## 🚀 빠른 시작 가이드 (초보자용)

### 1. 사전 요구사항 확인
- **Node.js**: v18 이상 권장 (현재 환경: Node.js v24 지원 확인)
- **Chrome**: Google Chrome 브라우저 설치 권장

### 2. 패키지 설치
프로젝트 최상위 디렉토리(`trend-studio-node`)에서 다음 명령어를 실행합니다:
```bash
npm install
```

### 3. 개발 서버 실행 (단일 명령어)
```bash
npm run dev
```
위 명령어를 실행하면 `concurrently`를 통해 백엔드와 프론트엔드가 동시에 시작됩니다.
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://127.0.0.1:3001](http://127.0.0.1:3001)
- **헬스체크**: [http://127.0.0.1:3001/api/health](http://127.0.0.1:3001/api/health)

### 4. Windows 원클릭 실행
프로젝트 폴더 내 `start.bat`을 더블 클릭하면:
1. 의존성 확인 및 자동 설치
2. 백엔드 및 프론트엔드 동시 실행
3. 서버 헬스체크 자동 완료 대기
4. 브라우저(`http://localhost:5173`) 자동 열기
가 차례대로 실행됩니다.

---

## 📁 프로젝트 구조 (npm workspaces 모노레포)

```text
trend-studio-node/
├── apps/
│   ├── web/               # React + Vite + Tailwind CSS + Lucide + TanStack Query
│   │   ├── src/
│   │   │   ├── App.tsx    # 대시보드 메인 컴포넌트
│   │   │   ├── main.tsx   # React 쿼리 프로바이더 및 진입점
│   │   │   └── index.css  # Pretendard 웹폰트 및 Tailwind 스타일
│   │   └── vite.config.ts # /api -> 127.0.0.1:3001 리버스 프록시 설정
│   └── api/               # Express.js + TypeScript (tsx watch)
│       └── src/
│           ├── index.ts   # 서버 진입점 및 크래시 방지 에러 핸들러
│           ├── server/    # Express 앱 설정 및 CORS/로깅 미들웨어
│           └── routes/    # /api/health 등 REST 라우터
├── packages/
│   └── shared/            # 프론트엔드/백엔드 공통 TypeScript 인터페이스
├── scripts/
│   └── health-check.js    # 서버 가동 상태 확인 스크립트
├── start.bat              # Windows 원클릭 실행 스크립트
├── package.json           # 모노레포 루트 워크스페이스 설정
└── README.md
```

---

## 🛠️ 개발 단계 및 로드맵
- **Phase 0 (완료)**: 개발 환경(Node.js v24, npm v11, Chrome) 점검
- **Phase 1 (완료)**: npm workspaces 모노레포 구성 및 단일 명령어로 서버 동시 구동 & 프록시 연동
- **Phase 2 (예정)**: Playwright 기반 독립 Chrome 브라우저 실행 및 연결 상태 관리
- **Phase 3 (예정)**: 네이버 크리에이터 어드바이저 수동 로그인 상태 감지
- **Phase 4 (예정)**: SaaS 디자인 대시보드 (주제별 탭, 키워드 테이블, Drawer)
- **Phase 5 (예정)**: SQLite 데이터베이스 연동 및 CSV 가져오기/내보내기
- **Phase 6 (예정)**: 네이버 트렌드 데이터 수집 연동 및 Manual Import
- **Phase 7 (예정)**: 전체 E2E 통합 테스트 및 배포 준비
