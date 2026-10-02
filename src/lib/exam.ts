import type { ExamId, ExamRecord, ExamSession, Question } from '../types'
import { EXAMS } from '../data/exams'

export const PASS_PERCENT = 70

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 보기 순서를 랜덤으로 섞고 정답 인덱스를 함께 리매핑 */
function shuffleChoices(q: Question): Question {
  const perm = shuffle(q.choices.map((_, i) => i)) // perm[새 위치] = 원래 인덱스
  return {
    ...q,
    choices: perm.map((o) => q.choices[o]),
    choices_ko: perm.map((o) => q.choices_ko[o]),
    notes: q.notes.length ? perm.map((o) => q.notes[o]) : q.notes,
    answer: q.answer.map((o) => perm.indexOf(o)).sort((a, b) => a - b),
  }
}

/** 전체 문제은행 출제 — 보기는 항상 랜덤, shuffled=true면 문제 순서도 랜덤 */
export function pickExamQuestions(pool: Question[], shuffled = false): Question[] {
  const qs = pool.map(shuffleChoices)
  return shuffled ? shuffle(qs) : qs
}

/** 채점: 부분점수 없음 — 정답 집합 완전 일치만 정답 */
export function isCorrect(q: Question, selected: number[]): boolean {
  if (selected.length !== q.answer.length) return false
  const sel = [...selected].sort((a, b) => a - b)
  const ans = [...q.answer].sort((a, b) => a - b)
  return sel.every((v, i) => v === ans[i])
}

export function gradeExam(
  examId: ExamId,
  questions: Question[],
  answers: number[][],
): ExamRecord {
  // 도메인 코드는 시험마다 다르므로 출제된 문항에서 동적으로 만든다
  const domains: ExamRecord['domains'] = {}
  let correct = 0
  questions.forEach((q, i) => {
    domains[q.domain] ??= { correct: 0, total: 0 }
    domains[q.domain].total++
    if (isCorrect(q, answers[i] ?? [])) {
      correct++
      domains[q.domain].correct++
    }
  })
  const score = Math.round((correct / questions.length) * 100)
  return {
    examId,
    date: new Date().toISOString(),
    score,
    total: questions.length,
    correct,
    passed: score >= PASS_PERCENT,
    domains,
  }
}

const HISTORY_KEY = 'nca-aiio-history'

export function loadHistory(): ExamRecord[] {
  try {
    const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(h) ? h : []
  } catch {
    return []
  }
}

export function saveHistory(record: ExamRecord) {
  const history = loadHistory()
  history.unshift(record)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

/* ---------- 진행 중 세션 저장 — 새로고침해도 답안과 경과 시간이 그대로 남는다 ---------- */

const SESSION_KEY = 'nca-aiio-session'
/**
 * 경과 시간(ms)은 세션과 따로 둔다 — 1초마다 갱신되는 값이라
 * 문제은행까지 들어 있는 세션 전체를 매초 직렬화하지 않기 위해서다.
 */
const ELAPSED_KEY = 'nca-aiio-elapsed'

export function loadSession(): ExamSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as ExamSession
    // 스키마가 바뀌었거나 손상된 저장본이면 버린다 (배열 길이가 어긋나면 오채점 위험)
    const n = Array.isArray(s.questions) ? s.questions.length : 0
    if (n === 0) return null
    if (!Array.isArray(s.answers) || s.answers.length !== n) return null
    if (!Array.isArray(s.flags) || s.flags.length !== n) return null
    if (!Array.isArray(s.revealed) || s.revealed.length !== n) return null
    if (!Number.isInteger(s.current)) return null
    if (s.current < 0 || s.current >= n) return null
    // 시간제한이 있던 시절(endTime)의 저장본도 이어서 풀 수 있게 시작 시각만 채워준다
    if (!Number.isFinite(s.startedAt)) s.startedAt = Date.now()
    // 저장본이 어떤 시험인지 모르면 채점 도메인이 어긋난다 — 구버전 저장본은 버린다
    if (!s.examId || !(s.examId in EXAMS)) return null
    return s
  } catch {
    return null
  }
}

export function saveSession(s: ExamSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch {
    // 저장 공간 부족 등 — 시험 진행 자체는 막지 않는다
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ELAPSED_KEY)
}

/** 시험 화면에 머문 누적 시간(ms) — 시간제한이 아니라 표시용이다 */
export function loadElapsed(): number {
  const ms = Number(localStorage.getItem(ELAPSED_KEY))
  return Number.isFinite(ms) && ms >= 0 ? ms : 0
}

export function saveElapsed(ms: number) {
  try {
    localStorage.setItem(ELAPSED_KEY, String(Math.round(ms)))
  } catch {
    // 저장 공간 부족 등 — 시험 진행 자체는 막지 않는다
  }
}
