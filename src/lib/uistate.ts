import type { ExamId, ExamSession, Lang, Screen } from '../types'
import { DEFAULT_EXAM, EXAMS } from '../data/exams'

/**
 * 새로고침해도 "보고 있던 화면"이 유지되도록 저장하는 UI 상태.
 * 진행 중인 답안은 exam.ts의 세션 저장본이 담당하고, 여기서는 그 세션을
 * 어느 화면에서 보고 있었는지(+ 시험 선택·언어)만 기억한다.
 */
export interface UiState {
  screen: Screen
  examId: ExamId
  lang: Lang
}

const UI_KEY = 'nca-aiio-ui'

const SCREENS: Screen[] = [
  'landing',
  'home',
  'exam',
  'result',
  'usage',
  'examguide',
  'ncpwiki',
  'ncpblueprint',
  'ncpstudy',
  'ncpconcepts',
]

/** 복원하지 않는 화면 — 채점 결과가 메모리에만 있어 새로고침하면 다시 그릴 수 없다 */
const NOT_RESTORED: Screen[] = ['result']

/**
 * 저장본에서 UI 상태를 복원한다. 값이 깨졌거나 지금 조건에 맞지 않으면(시험 화면인데
 * 세션이 없다) 안전한 화면으로 되돌린다.
 */
export function loadUi(session: ExamSession | null): UiState {
  const fallback: UiState = {
    screen: 'landing',
    examId: session?.examId ?? DEFAULT_EXAM,
    lang: 'en',
  }
  let raw: Partial<UiState>
  try {
    const s = localStorage.getItem(UI_KEY)
    if (!s) return fallback
    raw = JSON.parse(s) as Partial<UiState>
  } catch {
    return fallback
  }

  const lang: Lang = raw.lang === 'ko' ? 'ko' : 'en'

  const examId = raw.examId && raw.examId in EXAMS ? raw.examId : fallback.examId

  let screen = raw.screen && SCREENS.includes(raw.screen) ? raw.screen : 'landing'
  if (NOT_RESTORED.includes(screen)) screen = 'home'
  if (screen === 'exam' && !session) screen = 'home'

  return { screen, examId, lang }
}

export function saveUi(s: UiState) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(s))
  } catch {
    // 저장 공간 부족 등 — 화면 이동 자체는 막지 않는다
  }
}
