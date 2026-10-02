import type { ExamDef, ExamId, Question } from '../types'
import { ALL_QUESTIONS } from './index'
import { NCP_QUESTIONS } from './ncp'
import { NCP_V13_QUESTIONS } from './ncp2'

/** NCA-AIIO 도메인 라벨 (기존 3분류) */
export const AIIO_DOMAIN_LABEL: Record<string, string> = {
  infra: 'AI Infrastructure',
  essential: 'Essential AI Knowledge',
  ops: 'AI Operations',
}

/** NCP-AII 공식 블루프린트 5개 도메인 (괄호는 공식 출제 비중) */
export const NCP_DOMAIN_LABEL: Record<string, string> = {
  d1: 'D1 Cluster Test & Verification (33%)',
  d2: 'D2 System & Server Bring-up (31%)',
  d3: 'D3 Control Plane Install & Config (19%)',
  d4: 'D4 Troubleshoot & Optimize (12%)',
  d5: 'D5 Physical Layer Management (5%)',
}

/** 공식 출제 비중 — 결과 화면에서 실제 분포와 비교하는 데 쓴다 */
export const NCP_OFFICIAL_WEIGHT: Record<string, number> = {
  d1: 33, d2: 31, d3: 19, d4: 12, d5: 5,
}

export const EXAMS: Record<ExamId, ExamDef> = {
  'nca-aiio': {
    id: 'nca-aiio',
    title: 'NCA-AIIO',
    subtitle: 'AI Infrastructure and Operations',
    badge: 'NVIDIA-Certified Associate',
    passPercent: 70,
    domainLabel: AIIO_DOMAIN_LABEL,
    questions: ALL_QUESTIONS,
  },
  'ncp-aii': {
    id: 'ncp-aii',
    title: 'NCP-AII',
    subtitle: 'AI Infrastructure (Professional)',
    badge: 'NVIDIA-Certified Professional',
    passPercent: 70,
    domainLabel: NCP_DOMAIN_LABEL,
    questions: NCP_QUESTIONS,
  },
  'ncp-aii-v13': {
    id: 'ncp-aii-v13',
    title: 'NCP-AII V13.35',
    subtitle: 'AI Infrastructure (Professional) — 덤프',
    badge: 'NVIDIA-Certified Professional',
    passPercent: 70,
    domainLabel: NCP_DOMAIN_LABEL,
    questions: NCP_V13_QUESTIONS,
  },
}

/** 이력 목록처럼 좁은 자리에 쓰는 짧은 이름 */
export const EXAM_SHORT: Record<ExamId, string> = {
  'nca-aiio': 'NCA',
  'ncp-aii': 'NCP',
  'ncp-aii-v13': 'V13',
}

export const DEFAULT_EXAM: ExamId = 'nca-aiio'

export function getExam(id: ExamId): ExamDef {
  return EXAMS[id] ?? EXAMS[DEFAULT_EXAM]
}

/** 입장·홈 화면에서 고를 수 있는 시험 목록 */
export const EXAM_LIST: ExamDef[] = Object.values(EXAMS)

/** 도메인 코드 → 표시 라벨 (없는 코드는 코드 자체를 보여준다) */
export function domainLabel(examId: ExamId, domain: string): string {
  return getExam(examId).domainLabel[domain] ?? domain
}

/** 세션 복원 시 저장본의 문항이 현재 문제은행과 같은 시험인지 확인용 */
export function questionsOf(id: ExamId): Question[] {
  return getExam(id).questions
}

/** 모든 시험의 도메인 라벨 병합 — 시험 간 도메인 코드가 겹치지 않아 단일 조회로 충분하다 */
export const DOMAIN_LABEL: Record<string, string> = { ...AIIO_DOMAIN_LABEL, ...NCP_DOMAIN_LABEL }
