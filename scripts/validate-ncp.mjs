#!/usr/bin/env node
/**
 * NCP-AII 문제 데이터 검증
 *
 * 핵심 검사: answer-key.json의 정답 문자(원문 덤프의 "Selected Answer")와
 * questions*.json의 answer 인덱스가 일치하는지 대조한다. 보기 순서는 시험마다
 * 셔플되지만 원본 JSON의 배열 순서는 고정이므로, 인덱스↔문자 대조가 성립한다.
 *
 * 종료 코드: 오류가 있으면 1
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// 인자로 문제은행 디렉터리를 받는다 (기본: ncp) — 같은 스키마의 문제은행을 추가할 때 재사용
const BANK = process.argv[2] ?? 'ncp'
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', BANK)
const DOMAINS = new Set(['d1', 'd2', 'd3', 'd4', 'd5']) // 공식 블루프린트 5개 도메인
const REQUIRED = ['id','domain','type','question','question_ko','choices','choices_ko','answer','explanation','explanation_en']

const errors = []
const warns = []
const err = (id, m) => errors.push(`  [${id}] ${m}`)
const warn = (id, m) => warns.push(`  [${id}] ${m}`)
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf8'))

const files = readdirSync(DIR).filter((f) => /^questions\d+\.json$/.test(f)).sort()
const questions = files.flatMap((f) => load(f).map((q) => ({ ...q, __file: f })))
const extras = load('extras.json')
const key = load('answer-key.json')

const letters = (idxs) => [...idxs].sort((a, b) => a - b).map((i) => String.fromCharCode(65 + i)).join('')

const seen = new Set()
for (const q of questions) {
  const id = q.id ?? `(${q.__file})`
  for (const k of REQUIRED) {
    if (!(k in q)) { err(id, `필수 필드 누락: ${k}`); continue }
    if (typeof q[k] === 'string' && !q[k].trim()) err(id, `빈 문자열: ${k}`)
  }
  if (seen.has(q.id)) err(id, 'id 중복')
  seen.add(q.id)

  if (!DOMAINS.has(q.domain)) err(id, `잘못된 domain: ${q.domain}`)
  if (q.type !== 'single' && q.type !== 'multiple') err(id, `잘못된 type: ${q.type}`)

  if (Array.isArray(q.choices) && Array.isArray(q.choices_ko)) {
    if (q.choices.length !== q.choices_ko.length)
      err(id, `choices(${q.choices.length}) ↔ choices_ko(${q.choices_ko.length}) 길이 불일치`)
    if (q.choices.length > 5) err(id, `보기 ${q.choices.length}개 — 단축키(1~5) 범위 초과`)
    if (q.choices.some((c) => !c || !c.trim())) err(id, '빈 보기')
  }

  if (Array.isArray(q.answer)) {
    if (!q.answer.length) err(id, '정답이 비어 있음')
    if (new Set(q.answer).size !== q.answer.length) err(id, `정답 인덱스 중복: [${q.answer}]`)
    for (const a of q.answer)
      if (!Number.isInteger(a) || a < 0 || a >= (q.choices?.length ?? 0))
        err(id, `정답 인덱스 범위 초과: ${a}`)
    if (q.type === 'single' && q.answer.length !== 1) err(id, `single인데 정답 ${q.answer.length}개`)
    if (q.type === 'multiple' && q.answer.length < 2) err(id, `multiple인데 정답 ${q.answer.length}개`)
  }

  // ★ 정답 문자 원장 대조
  const expect = key[q.id]
  if (!expect) err(id, 'answer-key.json에 정답 문자가 없음')
  else if (letters(q.answer) !== expect)
    err(id, `정답 불일치 — 원장=${expect} / 데이터=${letters(q.answer)}  ("${q.choices[q.answer[0]]?.slice(0, 50)}…")`)

  const e = extras[q.id]
  if (!e) err(id, 'extras.json에 항목 없음')
  else {
    if (!e.concept?.trim()) err(id, 'extras: concept 비어 있음')
    if (!e.approach?.trim()) err(id, 'extras: approach 비어 있음')
    // 보기별 해설 — 있으면 보기 수와 정확히 맞아야 한다 (셔플 시 같은 순열로 재배열되므로 어긋나면 오답 유도)
    if (e.notes !== undefined) {
      if (!Array.isArray(e.notes)) err(id, 'extras: notes가 배열이 아님')
      else {
        if (e.notes.length !== (q.choices?.length ?? 0))
          err(id, `extras: notes(${e.notes.length}) ↔ choices(${q.choices?.length}) 길이 불일치`)
        e.notes.forEach((t, i) => { if (!t || !String(t).trim()) err(id, `extras: notes[${i}] 비어 있음`) })
      }
    }
  }
}

// 원장에만 있고 문항이 없는 경우
for (const k of Object.keys(key)) {
  if (k.startsWith('_')) continue
  if (!seen.has(k)) warn(k, 'answer-key.json에만 있고 문항이 없음')
}

// 보기 문자 하드코딩 (보기 순서가 셔플되므로 무의미)
const letterRef = /\b(?:option|choice|answer)\s+[A-E]\b|보기\s*[A-E]|(?<![A-Za-z])[A-E](?:가|는|이|를|의)\s/
for (const q of questions) {
  for (const [name, v] of Object.entries({
    explanation: q.explanation, explanation_en: q.explanation_en,
    concept: extras[q.id]?.concept, approach: extras[q.id]?.approach,
    ...Object.fromEntries((extras[q.id]?.notes ?? []).map((t, i) => [`notes[${i}]`, t])),
  })) {
    if (v && letterRef.test(v)) warn(q.id, `${name}에 보기 문자 참조 의심: "${v.slice(0, 55)}…"`)
  }
}

console.log(`[${BANK}] 문항 ${questions.length}개 · 파일 ${files.length}개 검사 완료`)
const byDomain = {}
for (const q of questions) byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1
console.log(`도메인 분포: ${Object.entries(byDomain).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
console.log(`정답 문자 대조: ${questions.length - errors.filter((e) => e.includes('정답 불일치')).length}/${questions.length} 일치`)

if (errors.length) { console.error(`\n오류 ${errors.length}건:`); errors.forEach((e) => console.error(e)) }
if (warns.length) { console.warn(`\n경고 ${warns.length}건:`); warns.forEach((w) => console.warn(w)) }
if (!errors.length && !warns.length) console.log('문제 없음 ✔')
process.exit(errors.length ? 1 : 0)
