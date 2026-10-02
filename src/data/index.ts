import type { Question } from '../types'
import q1 from './questions1.json'
import q2 from './questions2.json'
import q3 from './questions3.json'
import q4 from './questions4.json'
import extras from './extras.json'

type RawQuestion = Omit<Question, 'concept' | 'approach'>
type Extras = Record<string, { concept: string; approach: string }>

const raw: RawQuestion[] = [
  ...(q1 as RawQuestion[]),
  ...(q2 as RawQuestion[]),
  ...(q3 as RawQuestion[]),
  ...(q4 as RawQuestion[]),
]

// 문항 데이터 + 핵심 개념/풀이 방법 병합
export const ALL_QUESTIONS: Question[] = raw.map((q) => {
  const extra = (extras as Extras)[q.id] ?? { concept: '', approach: '' }
  return { ...q, ...extra, notes: [] } // NCA-AIIO 문제은행에는 보기별 해설이 아직 없다
})
