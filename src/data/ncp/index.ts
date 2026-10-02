import type { Question } from '../../types'
import q1 from './questions1.json'
import q2 from './questions2.json'
import q3 from './questions3.json'
import q4 from './questions4.json'
import q5 from './questions5.json'
import q6 from './questions6.json'
import q7 from './questions7.json'
import extras from './extras.json'

type RawQuestion = Omit<Question, 'concept' | 'approach'>
type Extras = Record<string, { concept: string; approach: string; notes?: string[] }>

// 배치로 추가되는 파일들을 여기에 이어 붙인다 (questions2.json …)
const raw: RawQuestion[] = [...(q1 as RawQuestion[]), ...(q2 as RawQuestion[]), ...(q3 as RawQuestion[]), ...(q4 as RawQuestion[]), ...(q5 as RawQuestion[]), ...(q6 as RawQuestion[]), ...(q7 as RawQuestion[])]

/** NCP-AII 문제은행 — 문항 데이터 + 핵심 개념/풀이 방법 병합 */
export const NCP_QUESTIONS: Question[] = raw.map((q) => {
  const extra = (extras as Extras)[q.id] ?? { concept: '', approach: '' }
  return { ...q, ...extra, notes: extra.notes ?? [] }
})
