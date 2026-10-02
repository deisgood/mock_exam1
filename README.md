# NVIDIA 자격증 모의 시험장

NVIDIA 자격증 대비 모의시험 웹앱입니다. 시간제한 없음 · 합격선 70% · 영어/한글 전환.

| 시험 | 등급 | 문항 |
|---|---|---|
| **NCA-AIIO** | NVIDIA-Certified Associate | 105 |
| **NCP-AII** | NVIDIA-Certified Professional | 72 |
| **NCP-AII V13.35** | NVIDIA-Certified Professional | 191 |

- **운영 서버**: http://15.165.3.90 (사내용)

로그인·관리자 화면은 없습니다. 시험과 학습 문서는 모두 공개입니다.

---

## 기술 스택

React 18 · TypeScript 5 (strict) · Vite 6 · 순수 CSS. 프로덕션 의존성은 `react`, `react-dom` 둘뿐입니다.
백엔드가 없고, 문항은 번들에 포함된 정적 JSON이며, 기록은 브라우저 localStorage에 저장됩니다.

## 실행

```bash
npm install
npm run dev            # http://localhost:5173
npm run validate:all   # 문제 데이터 검증 (3개 시험, 정답 원장 대조 포함)
npm run build          # 타입 검사 + dist/ 생성
```

Node가 없는 머신에서는 `npm …`을 컨테이너로 실행합니다.

```bash
docker run --rm -v "$PWD":/app -w /app node:22-alpine npm run build
```

개발 서버는 타입 오류를 무시하므로 배포 전에는 `npm run build`가 실질적인 검증입니다.

## 배포

```bash
./scripts/deploy.sh --dry-run   # 전송·삭제 목록만 확인
./scripts/deploy.sh             # 검증 → 빌드 → rsync → HTTP 200 확인
```

로컬에서 빌드한 `dist/`만 서버로 보냅니다. 서버는 nginx만 있고 Node가 없습니다.
`npm`이 없으면 검증·빌드를 `node:22-alpine` 컨테이너에서 자동으로 실행합니다.

> 빌드에 필요한 환경 변수는 없습니다. `VITE_*` 변수는 번들에 그대로 노출되므로 비밀값을 넣지 마세요.

## 프로젝트 구조

```
src/
  App.tsx            화면 전환(screen state) · 경과 시간 · 제출 · 상태 저장
  types.ts           Question · ExamDef · ExamSession · Screen
  index.css          전체 스타일 (CSS 변수 · 다크모드 · 반응형)
  components/        공통 헤더 · 언어/테마/글자 크기 컨트롤
  pages/
    Landing · Home · Exam · Result       입장 → 홈 → 응시 → 결과
    UsageGuide · ExamGuide               사용법 · NCA-AIIO 시험 가이드
    NcpWiki · NcpBlueprint · NcpStudyGuide · NcpConcepts   NCP-AII 학습 가이드 4종
    wiki/ · bp/ · parts.tsx              가이드 본문 섹션 · 공용 컴포넌트
  lib/
    exam.ts          출제 · 채점 · 이력 · 세션 저장
    uistate.ts       보고 있던 화면 · 시험 선택 · 언어 저장/복원
    lang.ts          문항 언어 헬퍼
  data/
    exams.ts         시험 정의 (이름 · 도메인 라벨 · 문제은행)
    questions*.json · extras.json      NCA-AIIO
    ncp/  · ncp2/    NCP-AII · NCP-AII V13.35 (각각 answer-key.json 정답 원장 포함)
scripts/             데이터 검증 · 배포 · 서버/nginx 최초 설정
nginx/               nginx 사이트 설정
docs/                NCP-AII V13.35 원문 덤프 · 정리 노트
```

라우터를 쓰지 않습니다. 시험 중 뒤로가기로 답안을 잃는 일을 막기 위해서이며, URL은 항상 `/`입니다.

## 사용법

- **입장 화면**에서 시험을 고르면 그 시험이 선택된 홈으로 들어갑니다. 홈에서도 시험을 바꿀 수 있습니다.
- **홈**에서 문제 순서 셔플을 켜고 끌 수 있습니다. 보기 순서는 항상 섞입니다.
- **시험 화면**의 「정답 확인」은 정답·해설·핵심 개념·풀이 방법을 보여주며 채점에는 영향이 없습니다.
- **단축키**: `1`~`5` 보기 선택 · `←`/`→` 이동 · `Enter` 다음 · `F` 플래그
- **결과 화면**에서 도메인별 정답률과 문항별 리뷰를 보고, 오답만 걸러 볼 수 있습니다.

**채점**: 부분점수가 없습니다. 복수선택은 정답 집합이 완전히 일치해야 정답입니다.

## 데이터 저장 (localStorage)

| 키 | 내용 |
|---|---|
| `nca-aiio-session` · `nca-aiio-elapsed` | 진행 중인 시험과 경과 시간 |
| `nca-aiio-ui` | 보고 있던 화면 · 선택한 시험 · 언어 |
| `nca-aiio-history` | 시험 이력 (최대 50회) |
| `nca-theme` · `nca-fontsize` · `nca-shuffle` | UI 설정 |

새로고침해도 보고 있던 화면과 진행 중인 시험이 복원됩니다. 기록은 기기·브라우저마다 따로 쌓이며 공유되지 않습니다.

## 문제 데이터 수정

문항 JSON과 `extras.json`(핵심 개념 · 풀이 방법 · 보기별 해설)을 고친 뒤 반드시 검증합니다.

```bash
npm run validate:all
```

- 해설에 보기 문자(A/B/C/D)를 쓰지 마세요. 보기 순서가 섞이므로 어긋납니다. 검증 스크립트가 이를 경고합니다.
- NCP 문제은행은 `answer-key.json`의 정답 문자와 데이터의 정답 인덱스를 대조합니다.
- NCA-AIIO는 105문항 중 56문항이 3지선다라 점수가 실제보다 높게 나올 수 있습니다.
