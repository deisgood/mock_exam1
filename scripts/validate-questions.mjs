#!/usr/bin/env node
/**
 * 문제 데이터 검증 — questions1~4.json + extras.json
 *
 * 검사 항목:
 *  - 필수 필드 존재, 빈 문자열
 *  - id 중복
 *  - choices ↔ choices_ko 길이 일치
 *  - answer: 비어있음 / 범위 초과 / 중복 인덱스
 *  - type(single/multiple) ↔ 정답 개수 일치
 *  - domain 값 유효성
 *  - 보기 5개 초과 (키보드 단축키 1~5 범위 밖)
 *  - extras.json 커버리지 (양방향) + concept/approach 빈 값
 *  - 문제 텍스트 완전 중복 (경고)
 *  - "Choose two" 등 복수선택 문구 ↔ type 불일치 (경고)
 *  - 해설·개념·풀이에 보기 문자(A~E) 하드코딩 (경고 — 보기 순서가 셔플되므로)
 *
 * 종료 코드: 오류(error)가 있으면 1, 경고(warn)만 있으면 0
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
const DOMAINS = new Set(['infra', 'essential', 'ops'])
const REQUIRED = [
  'id', 'domain', 'type', 'question', 'question_ko',
  'choices', 'choices_ko', 'answer', 'explanation', 'explanation_en',
]

const errors = []
const warns = []
const err = (id, msg) => errors.push(`  [${id}] ${msg}`)
const warn = (id, msg) => warns.push(`  [${id}] ${msg}`)

const load = (name) => JSON.parse(readFileSync(join(DATA_DIR, name), 'utf8'))
const files = ['questions1.json', 'questions2.json', 'questions3.json', 'questions4.json']
const questions = files.flatMap((f) => load(f).map((q) => ({ ...q, __file: f })))
const extras = load('extras.json')

/* ---- 문항별 검사 ---- */
const seenIds = new Map()
const seenTexts = new Map()

for (const q of questions) {
  const id = q.id ?? `(${q.__file} id 없음)`

  for (const k of REQUIRED) {
    if (!(k in q)) { err(id, `필수 필드 누락: ${k}`); continue }
    const v = q[k]
    if (typeof v === 'string' && v.trim() === '') err(id, `빈 문자열: ${k}`)
  }

  if (seenIds.has(q.id)) err(id, `id 중복 (${seenIds.get(q.id)}에도 있음)`)
  seenIds.set(q.id, q.__file)

  if (!DOMAINS.has(q.domain)) err(id, `잘못된 domain: ${q.domain}`)
  if (q.type !== 'single' && q.type !== 'multiple') err(id, `잘못된 type: ${q.type}`)

  if (Array.isArray(q.choices) && Array.isArray(q.choices_ko)) {
    if (q.choices.length !== q.choices_ko.length)
      err(id, `choices(${q.choices.length}) ↔ choices_ko(${q.choices_ko.length}) 길이 불일치`)
    if (q.choices.length > 5) err(id, `보기 ${q.choices.length}개 — 키보드 단축키(1~5) 범위 초과`)
    if (q.choices.some((c) => !c || !c.trim())) err(id, '빈 보기(choices)')
    if (q.choices_ko.some((c) => !c || !c.trim())) err(id, '빈 보기(choices_ko)')
  }

  if (Array.isArray(q.answer)) {
    if (q.answer.length === 0) err(id, '정답이 비어 있음')
    if (new Set(q.answer).size !== q.answer.length) err(id, `정답 인덱스 중복: [${q.answer}]`)
    for (const a of q.answer) {
      if (!Number.isInteger(a) || a < 0 || a >= (q.choices?.length ?? 0))
        err(id, `정답 인덱스 범위 초과: ${a} (보기 ${q.choices?.length}개)`)
    }
    if (q.type === 'single' && q.answer.length !== 1)
      err(id, `single인데 정답 ${q.answer.length}개`)
    if (q.type === 'multiple' && q.answer.length < 2)
      err(id, `multiple인데 정답 ${q.answer.length}개`)
  }

  // 복수선택 문구 힌트 ↔ type 교차 확인
  const text = (q.question ?? '').toLowerCase()
  const multiHint = /(choose|select)\s+(two|three|all)/.test(text)
  if (multiHint && q.type !== 'multiple') err(id, `문구는 복수선택인데 type=single: "${q.question.slice(0, 60)}…"`)
  if (q.type === 'multiple' && !multiHint) warn(id, '복수선택인데 문제에 "(Choose two)" 등의 안내 문구가 없음')

  // 문제 텍스트 완전 중복
  const key = text.trim()
  if (seenTexts.has(key)) warn(id, `문제 텍스트가 ${seenTexts.get(key)}와 중복`)
  else seenTexts.set(key, q.id)
}

/* ---- extras.json 교차 검사 ---- */
const qIds = new Set(questions.map((q) => q.id))
for (const q of questions) {
  const e = extras[q.id]
  if (!e) { err(q.id, 'extras.json에 항목 없음'); continue }
  if (!e.concept?.trim()) err(q.id, 'extras: concept 비어 있음')
  if (!e.approach?.trim()) err(q.id, 'extras: approach 비어 있음')
}
for (const k of Object.keys(extras)) {
  if (!qIds.has(k)) warn(k, 'extras.json에만 있고 문항이 없음')
}

/* ---- 보기 문자 하드코딩 검사 (보기 순서 셔플로 무의미해짐) ---- */
const letterRef = /\b(?:option|choice|answer)\s+[A-E]\b|보기\s*[A-E]|\b[A-E](?:가|는|이)\s/
for (const q of questions) {
  const fields = {
    explanation: q.explanation, explanation_en: q.explanation_en,
    concept: extras[q.id]?.concept, approach: extras[q.id]?.approach,
  }
  for (const [name, v] of Object.entries(fields)) {
    if (v && letterRef.test(v)) warn(q.id, `${name}에 보기 문자 참조 의심 (보기 순서는 셔플됨): "${v.slice(0, 60)}…"`)
  }
}

/* ---- 결과 ---- */
console.log(`문항 ${questions.length}개 · extras ${Object.keys(extras).length}개 검사 완료`)
const byDomain = {}
for (const q of questions) byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1
console.log(`도메인 분포: ${Object.entries(byDomain).map(([k, v]) => `${k} ${v}`).join(' · ')}`)

if (errors.length) {
  console.error(`\n오류 ${errors.length}건:`)
  for (const e of errors) console.error(e)
}
if (warns.length) {
  console.warn(`\n경고 ${warns.length}건:`)
  for (const w of warns) console.warn(w)
}
if (!errors.length && !warns.length) console.log('문제 없음 ✔')
process.exit(errors.length ? 1 : 0)
