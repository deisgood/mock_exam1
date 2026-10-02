import type { Question } from '../../types'
import q01 from './questions01.json'
import q02 from './questions02.json'
import q03 from './questions03.json'
import q04 from './questions04.json'
import q05 from './questions05.json'
import q06 from './questions06.json'
import q07 from './questions07.json'
import q08 from './questions08.json'
import q09 from './questions09.json'
import q10 from './questions10.json'
import q11 from './questions11.json'
import q12 from './questions12.json'
import q13 from './questions13.json'
import q14 from './questions14.json'
import q15 from './questions15.json'
import q16 from './questions16.json'
import q17 from './questions17.json'
import q18 from './questions18.json'
import q19 from './questions19.json'
import extras from './extras.json'

type RawQuestion = Omit<Question, 'concept' | 'approach' | 'notes'>
type Extras = Record<string, { concept: string; approach: string; notes?: string[] }>

// NCP-AII V13.35 덤프(197문항)에서 중복 6문항을 뺀 191문항. 원문은 docs/NCP-AII-V13.35.md
const raw: RawQuestion[] = [
  ...(q01 as RawQuestion[]), ...(q02 as RawQuestion[]), ...(q03 as RawQuestion[]),
  ...(q04 as RawQuestion[]), ...(q05 as RawQuestion[]), ...(q06 as RawQuestion[]),
  ...(q07 as RawQuestion[]), ...(q08 as RawQuestion[]), ...(q09 as RawQuestion[]),
  ...(q10 as RawQuestion[]), ...(q11 as RawQuestion[]), ...(q12 as RawQuestion[]),
  ...(q13 as RawQuestion[]), ...(q14 as RawQuestion[]), ...(q15 as RawQuestion[]),
  ...(q16 as RawQuestion[]), ...(q17 as RawQuestion[]), ...(q18 as RawQuestion[]),
  ...(q19 as RawQuestion[]),
]

export const NCP_V13_QUESTIONS: Question[] = raw.map((q) => {
  const extra = (extras as Extras)[q.id] ?? { concept: '', approach: '' }
  return { ...q, ...extra, notes: extra.notes ?? [] }
})
