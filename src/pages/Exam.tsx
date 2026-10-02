import { useCallback, useEffect, useRef } from 'react'
import { FontSizeControl, ThemeToggle, type Theme } from '../components/controls'
import { isCorrect } from '../lib/exam'
import { qChoices, qExpl, qText } from '../lib/lang'
import type { ExamSession, Lang } from '../types'
import { DOMAIN_LABEL } from '../data/exams'

export default function Exam({
  session,
  setSession,
  sidebarOpen,
  setSidebarOpen,
  onHome,
  lang,
  theme,
  onToggleTheme,
}: {
  session: ExamSession
  setSession: (s: ExamSession) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  onHome: () => void
  lang: Lang
  theme: Theme
  onToggleTheme: () => void
}) {
  // 경과 시간·제출은 공통 헤더(AppHeader)가 담당 — 여기서는 문제 영역만 관리한다
  const sessionRef = useRef(session)
  sessionRef.current = session

  // 문항 이동 시 스크롤 최상단으로
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [session.current])

  const q = session.questions[session.current]
  const selected = session.answers[session.current]
  const answeredCount = session.answers.filter((a) => a.length > 0).length
  const flaggedCount = session.flags.filter(Boolean).length

  const toggleChoice = useCallback(
    (idx: number) => {
      const s = sessionRef.current
      const cur = s.answers[s.current]
      const qq = s.questions[s.current]
      let next: number[]
      if (qq.type === 'single') {
        next = cur.includes(idx) ? [] : [idx] // 재클릭 시 선택 해제
      } else {
        next = cur.includes(idx) ? cur.filter((v) => v !== idx) : [...cur, idx]
      }
      const answers = [...s.answers]
      answers[s.current] = next
      setSession({ ...s, answers })
    },
    [setSession],
  )

  const go = useCallback(
    (delta: number) => {
      const s = sessionRef.current
      const next = Math.min(Math.max(s.current + delta, 0), s.questions.length - 1)
      setSession({ ...s, current: next })
    },
    [setSession],
  )

  const toggleFlag = useCallback(() => {
    const s = sessionRef.current
    const flags = [...s.flags]
    flags[s.current] = !flags[s.current]
    setSession({ ...s, flags })
  }, [setSession])

  const toggleReveal = useCallback(() => {
    const s = sessionRef.current
    const revealed = [...s.revealed]
    revealed[s.current] = !revealed[s.current]
    setSession({ ...s, revealed })
  }, [setSession])

  // 키보드 단축키: 1-5 선택, ←/→ 이동, F 표시
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 버튼/입력 요소에 포커스가 있을 때 Enter는 해당 요소의 기본 동작에 맡김 (이중 이동 방지)
      const target = e.target as HTMLElement
      const tag = target?.tagName
      const onInteractive = tag === 'BUTTON' || tag === 'INPUT' || tag === 'A'
      // 라디오/체크박스에 포커스가 있으면 화살표 키의 브라우저 기본 동작
      // (그룹 내 다음 항목 자동 선택)이 문제 이동과 겹쳐 다음 문제의 보기가 선택되는 버그 방지
      const blurFocus = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      }
      if (e.key >= '1' && e.key <= '5') {
        const idx = Number(e.key) - 1
        if (idx < sessionRef.current.questions[sessionRef.current.current].choices.length) toggleChoice(idx)
      } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !onInteractive)) {
        e.preventDefault() // 네이티브 라디오 이동/선택 차단
        blurFocus()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        blurFocus()
        go(-1)
      } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && tag === 'INPUT') {
        e.preventDefault() // 위/아래 화살표로 라디오 선택이 바뀌는 것도 차단
      } else if (e.key.toLowerCase() === 'f') toggleFlag()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleChoice, go, toggleFlag])

  const jumpTo = (i: number) => {
    setSession({ ...sessionRef.current, current: i })
    setSidebarOpen(false)
  }

  return (
    <div className="exam-layout">
      {/* 문제 현황 대시보드 (데스크톱: 상시 표시 / 모바일: 서랍) */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={`exam-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <span>문제 현황</span>
          <span className="sidebar-head-actions">
            <button className="btn-home" onClick={onHome} title="홈으로 (시험은 유지됩니다)">홈</button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
          </span>
        </div>
        <div className="sidebar-stats">
          <div className="stat"><span className="stat-num stat-answered">{answeredCount}</span><span>응답</span></div>
          <div className="stat"><span className="stat-num">{session.questions.length - answeredCount}</span><span>미응답</span></div>
          <div className="stat"><span className="stat-num stat-flagged">{flaggedCount}</span><span>플래그</span></div>
        </div>
        <div className="sidebar-fs"><FontSizeControl /></div>
        <div className="sidebar-grid">
          {session.questions.map((qq, i) => {
            // 정답 확인을 눌렀고 내 선택이 정답과 다르면 빨간색 표시
            const checkedWrong =
              session.revealed[i] && session.answers[i].length > 0 && !isCorrect(qq, session.answers[i])
            const checkedRight =
              session.revealed[i] && session.answers[i].length > 0 && isCorrect(qq, session.answers[i])
            return (
              <button
                key={i}
                title={`Question ${i + 1}${session.flags[i] ? ' 🚩' : ''}${checkedWrong ? ' · 오답' : ''}`}
                className={[
                  's-cell',
                  i === session.current ? 's-current' : '',
                  session.answers[i].length > 0 ? 's-answered' : '',
                  checkedRight ? 's-right' : '',
                  checkedWrong ? 's-wrong' : '',
                  session.flags[i] ? 's-flagged' : '',
                ].join(' ')}
                onClick={() => jumpTo(i)}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="sidebar-legend">
          <span><i className="lg lg-answered" />응답</span>
          <span><i className="lg lg-blank" />미응답</span>
          <span><i className="lg lg-wrong" />오답 확인</span>
          <span><i className="lg lg-flag" />플래그</span>
          <span><i className="lg lg-current" />현재</span>
        </div>
      </aside>

      <div className="container exam exam-main">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(answeredCount / session.questions.length) * 100}%` }} />
      </div>

      <div className="card question-card">
        <div className="question-meta">
          <span>Question {session.current + 1}</span>
          <span className="review-domain">{DOMAIN_LABEL[q.domain]}</span>
          {q.type === 'multiple' && <span className="tag-multi">복수 선택</span>}
          <button className={`btn-flag ${session.flags[session.current] ? 'flagged' : ''}`} onClick={toggleFlag}>
            {session.flags[session.current] ? '🚩 표시됨' : '⚑ 표시'}
          </button>
        </div>
        <p className="question-text">{qText(q, lang)}</p>
        <div className="choices">
          {qChoices(q, lang).map((c, i) => {
            const isRevealed = session.revealed[session.current]
            const isAns = q.answer.includes(i)
            const isSel = selected.includes(i)
            const revealCls = isRevealed ? (isAns ? 'choice-answer' : isSel ? 'choice-wrong' : '') : ''
            return (
              <label key={i} className={`choice ${!isRevealed && isSel ? 'choice-selected' : ''} ${revealCls}`}>
                <input
                  type={q.type === 'single' ? 'radio' : 'checkbox'}
                  name={`q-${session.current}`}
                  checked={isSel}
                  onChange={() => {}}
                  onClick={() => toggleChoice(i)} // 재클릭 해제를 위해 onClick 사용 (radio는 onChange 미발화)
                />
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span className="choice-text">{c}</span>
                {isRevealed && isAns && <span className="mark">✓ 정답</span>}
                {isRevealed && isSel && !isAns && <span className="mark mark-wrong">내 선택</span>}
                {isRevealed && q.notes[i] && (
                  <span className={`choice-note ${isAns ? 'choice-note-right' : ''}`}>{q.notes[i]}</span>
                )}
              </label>
            )
          })}
        </div>

        <button
          className={`btn-reveal ${session.revealed[session.current] ? 'revealed' : ''}`}
          onClick={toggleReveal}
        >
          {session.revealed[session.current] ? '해설 숨기기 ▲' : '정답 확인 ▼'}
        </button>

        {session.revealed[session.current] && (
          <div className="answer-panel">
            <div className="panel-row panel-answer">
              <span className="panel-label">정답</span>
              <span>{q.answer.map((i) => String.fromCharCode(65 + i)).join(', ')}</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">해설</span>
              <span>{qExpl(q, lang)}</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">핵심 개념</span>
              <span>{q.concept}</span>
            </div>
            <div className="panel-row">
              <span className="panel-label">풀이 방법</span>
              <span>{q.approach}</span>
            </div>
          </div>
        )}
      </div>

      <div className="exam-bottom">
        <button className="btn-secondary" onClick={() => go(-1)} disabled={session.current === 0}>← 이전</button>
        <button className="btn-secondary" onClick={() => go(1)} disabled={session.current === session.questions.length - 1}>다음 →</button>
      </div>
      <p className="kbd-hint">단축키: 1~4 보기 선택 · ←/→ 이동 · F 표시</p>
      </div>
    </div>
  )
}
