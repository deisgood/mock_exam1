import type { Lang, Question } from '../types'

export function qText(q: Question, lang: Lang): string {
  return lang === 'ko' ? q.question_ko : q.question
}

export function qChoices(q: Question, lang: Lang): string[] {
  return lang === 'ko' ? q.choices_ko : q.choices
}

export function qExpl(q: Question, lang: Lang): string {
  // 영어 시험 대비: EN 모드에서는 해설도 영어로
  return lang === 'ko' ? q.explanation : q.explanation_en
}
