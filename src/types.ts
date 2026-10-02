/** 도메인 코드는 시험마다 다르다 (NCA-AIIO: infra/essential/ops, NCP-AII: systems/network/…) */
export type Domain = string

export interface Question {
  id: string
  domain: Domain
  type: 'single' | 'multiple'
  question: string
  question_ko: string
  choices: string[]
  choices_ko: string[]
  answer: number[]
  explanation: string
  explanation_en: string
  concept: string
  approach: string
  /** 보기별 한 줄 해설 — choices와 같은 순서. 정답 보기에는 '왜 맞는지', 오답에는 '왜 틀린지' */
  notes: string[]
}

export type Lang = 'en' | 'ko'

export type Screen =
  | 'landing'
  | 'home'
  | 'exam'
  | 'result'
  | 'usage'
  | 'examguide'
  | 'ncpwiki'
  | 'ncpblueprint'
  | 'ncpstudy'
  | 'ncpconcepts'

export type ExamId = 'nca-aiio' | 'ncp-aii' | 'ncp-aii-v13'

/** 시험 한 종류의 정의 — 문제은행과 표시 정보를 함께 묶는다 */
export interface ExamDef {
  id: ExamId
  /** 화면에 보이는 이름 */
  title: string
  subtitle: string
  /** 인증 등급 라벨 — 입장·홈 헤더의 배지 문구 (예: NVIDIA-Certified Associate) */
  badge: string
  passPercent: number
  domainLabel: Record<string, string>
  questions: Question[]
}

export interface ExamSession {
  /** 어떤 시험인지 — 복원 시 문제은행을 되찾기 위해 필요 */
  examId: ExamId
  questions: Question[]
  answers: number[][]
  flags: boolean[]
  revealed: boolean[]
  current: number
  /** 시험을 시작한 시각(ms) — 시간제한은 없고 기록·표시에만 쓴다 */
  startedAt: number
}

export interface ExamRecord {
  examId: ExamId
  date: string
  score: number
  total: number
  correct: number
  passed: boolean
  domains: Record<string, { correct: number; total: number }>
}
