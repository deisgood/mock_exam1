import { useState } from 'react'
import { PASS_PERCENT, isCorrect } from '../lib/exam'
import { qChoices, qExpl, qText } from '../lib/lang'
import type { Domain, ExamRecord, ExamSession, Lang } from '../types'
import { DOMAIN_LABEL } from '../data/exams'

export default function Result({
  record,
  session,
  onHome,
  onRetry,
  lang,
}: {
  record: ExamRecord
  session: ExamSession
  onHome: () => void
  onRetry: () => void
  lang: Lang
}) {
  const [wrongOnly, setWrongOnly] = useState(false)

  const rows = session.questions
    .map((q, i) => ({ q, i, sel: session.answers[i], correct: isCorrect(q, session.answers[i]) }))
    .filter((r) => !wrongOnly || !r.correct)

  return (
    <div className="container result">
      <div className={`card verdict ${record.passed ? 'verdict-pass' : 'verdict-fail'}`}>
        <div className="verdict-label">{record.passed ? 'PASS' : 'FAIL'}</div>
        <div className="verdict-score">{record.score}%</div>
        <div className="verdict-detail">{record.correct} / {record.total} 정답 · 합격선 {PASS_PERCENT}%</div>
      </div>

      <div className="card">
        <h2>도메인별 정답률</h2>
        {(Object.keys(record.domains) as Domain[]).map((d) => {
          const { correct, total } = record.domains[d]
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0
          return (
            <div key={d} className="domain-bar-row">
              <div className="domain-bar-head">
                <span>{DOMAIN_LABEL[d]}</span>
                <span>{correct}/{total} ({pct}%)</span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill bar-${d}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={onRetry}>다시 시험 보기</button>
        <button className="btn-secondary" onClick={onHome}>홈으로</button>
        <label className="wrong-toggle">
          <input type="checkbox" checked={wrongOnly} onChange={(e) => setWrongOnly(e.target.checked)} />
          오답만 보기
        </label>
      </div>

      <div className="review-list">
        {rows.map(({ q, i, sel, correct }) => (
          <div key={q.id} className={`card review-item ${correct ? '' : 'review-wrong'}`}>
            <div className="review-head">
              <span className={correct ? 'tag-correct' : 'tag-incorrect'}>{correct ? '정답' : '오답'}</span>
              <span className="review-num">Q{i + 1}</span>
              <span className="review-domain">{DOMAIN_LABEL[q.domain]}</span>
            </div>
            <p className="question-text">{qText(q, lang)}</p>
            <div className="choices review-choices">
              {qChoices(q, lang).map((c, ci) => {
                const isAns = q.answer.includes(ci)
                const isSel = sel.includes(ci)
                return (
                  <div key={ci} className={`choice ${isAns ? 'choice-answer' : ''} ${isSel && !isAns ? 'choice-wrong' : ''}`}>
                    <span className="choice-letter">{String.fromCharCode(65 + ci)}</span>
                    <span className="choice-text">{c}</span>
                    {isAns && <span className="mark">✓ 정답</span>}
                    {isSel && !isAns && <span className="mark mark-wrong">내 선택</span>}
                    {isSel && isAns && <span className="mark">← 내 선택</span>}
                    {q.notes[ci] && (
                      <span className={`choice-note ${isAns ? 'choice-note-right' : ''}`}>{q.notes[ci]}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="explanation">
              <p><strong>해설</strong> {qExpl(q, lang)}</p>
              <p><strong>핵심 개념</strong> {q.concept}</p>
              <p><strong>풀이 방법</strong> {q.approach}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
