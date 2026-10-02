import { useMemo } from 'react'
import { DOMAIN_LABEL, EXAM_SHORT, getExam } from '../data/exams'
import { loadHistory } from '../lib/exam'
import type { ExamDef, ExamId, ExamSession } from '../types'

export default function Home({
  exams,
  examId,
  onSelectExam,
  onStart,
  shuffled,
  onToggleShuffle,
  activeSession,
  activeElapsedMs,
  onResume,
  onExamGuide,
  onWiki,
  onBlueprint,
  onStudyGuide,
  onConcepts,
}: {
  /** 고를 수 있는 시험 */
  exams: ExamDef[]
  examId: ExamId
  onSelectExam: (id: ExamId) => void
  onStart: () => void
  shuffled: boolean
  onToggleShuffle: (v: boolean) => void
  activeSession: ExamSession | null
  /** 진행 중 시험에 지금까지 들인 시간(ms) — 남은 시간이 아니라 경과 시간이다 */
  activeElapsedMs: number
  onResume: () => void
  /** 시험 가이드 — NCA-AIIO는 개요·핵심 개념 문서 1종, NCP-AII는 합격 가이드 4종 */
  onExamGuide: () => void
  onWiki: () => void
  onBlueprint: () => void
  onStudyGuide: () => void
  onConcepts: () => void
}) {
  const exam = getExam(examId)

  const handleStart = () => {
    if (activeSession && !confirm('진행 중인 시험이 있습니다. 새로 시작하면 기존 답안이 사라집니다. 계속할까요?')) return
    onStart()
  }
  const resumeInfo = activeSession
    ? {
        answered: activeSession.answers.filter((a) => a.length > 0).length,
        total: activeSession.questions.length,
        // 1분이 안 됐을 때 "0분 경과"로 보이지 않게 초 단위로 바꿔 쓴다
        elapsed:
          activeElapsedMs < 60000
            ? `${Math.floor(activeElapsedMs / 1000)}초`
            : `${Math.floor(activeElapsedMs / 60000)}분`,
        startedAt: new Date(activeSession.startedAt),
      }
    : null
  const history = useMemo(loadHistory, [])
  const total = exam.questions.length
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    exam.questions.forEach((q) => {
      c[q.domain] = (c[q.domain] ?? 0) + 1
    })
    return c
  }, [exam])

  return (
    <div className="container home">
      <header className="home-header">
        <div className="badge">{exam.badge}</div>
        <h1>{exam.title} Mock Exam</h1>
        <p className="subtitle">{exam.subtitle} · 전체 문제 풀기</p>
      </header>

      {/* 입장 화면에서 고른 시험이 선택돼 있고, 여기서 바꿀 수도 있다 */}
      {exams.length > 1 && (
        <div className="card exam-picker">
          <h2>시험 선택</h2>
          <div className="exam-picker-list">
            {exams.map((e) => (
              <button
                key={e.id}
                className={`exam-pick ${e.id === examId ? 'on' : ''}`}
                onClick={() => onSelectExam(e.id)}
              >
                <span className="exam-pick-title">{e.title}</span>
                <span className="exam-pick-sub">
                  {e.subtitle} · {e.questions.length}문항
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card exam-info">
        <div className="info-grid info-grid-solo">
          <div><span className="info-num">{total}</span><span className="info-label">문항 (전체)</span></div>
        </div>
        <div className="domain-list">
          {/* 도메인은 시험 정의(domainLabel)의 순서대로 — 문항 등장 순서에 따라 D4가 D3 앞에 오는 일이 없게 */}
          {[...Object.keys(exam.domainLabel), ...Object.keys(counts)]
            .filter((d, i, arr) => counts[d] && arr.indexOf(d) === i)
            .map((d) => (
            <div key={d} className="domain-row">
              <span className={`dot dot-${d}`} />
              <span className="domain-name">{DOMAIN_LABEL[d] ?? d}</span>
              <span className="domain-count">{counts[d]}문항</span>
            </div>
          ))}
        </div>
        <p className="note">
          전체 {total}문항이 출제되며, 보기 순서는 매 시험마다 랜덤으로 섞입니다. <strong>시간제한은 없고</strong>{' '}
          헤더의 ⏱ 는 지금까지 들인 시간을 보여줍니다. 답안은 브라우저에 자동 저장돼 새로고침하거나 창을 닫아도
          이어서 풀 수 있습니다. 시험 중 EN/한글 버튼으로 언어 전환이 가능하고, 다중선택은 완전 일치해야
          정답(부분점수 없음)입니다.
        </p>
        <label className="shuffle-toggle">
          <input type="checkbox" checked={shuffled} onChange={(e) => onToggleShuffle(e.target.checked)} />
          <span className="shuffle-icon">🔀</span>
          <span className="shuffle-text">
            <strong>문제 순서 셔플</strong>
            <small>{shuffled ? '랜덤 순서로 출제됩니다' : `원본 순서(1→${total})로 출제됩니다`}</small>
          </span>
        </label>
        {resumeInfo && (
          <>
            <p className="resume-hint">
              {resumeInfo.startedAt.toLocaleString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              에 시작한 시험이 저장돼 있습니다. 시간제한이 없으니 그대로 이어서 풀면 됩니다.
            </p>
            <button className="btn-primary btn-resume" onClick={onResume}>
              ▶ 시험 계속하기 — {resumeInfo.answered}/{resumeInfo.total} 응답 · {resumeInfo.elapsed} 경과
            </button>
          </>
        )}
        <button className={resumeInfo ? 'btn-secondary btn-block' : 'btn-primary'} onClick={handleStart}>
          {resumeInfo ? '새 시험 시작 (기존 답안 삭제)' : '시험 시작'}
        </button>
      </div>

      {/* 시험 가이드 — 선택한 시험에 맞는 학습 문서. 시험 시작 카드 바로 아래에 둬서 응시 전에 훑어보게 한다 */}
      <div className="card">
        <h2>{exam.title} 시험 가이드</h2>
        {exam.id === 'nca-aiio' ? (
          <>
            <p className="guide-hint">
              공식 블루프린트 기준으로 정리한 시험 개요·핵심 개념·참고 문헌. 시험 중에도 헤더의 「시험 가이드」로 바로 열 수 있다.
            </p>
            <button className="btn-secondary btn-block" onClick={onExamGuide}>
              시험 가이드 — 시험 개요 · 도메인별 핵심 개념 · 참고 문헌 · 학습 전략
            </button>
          </>
        ) : (
          <>
            <p className="guide-hint">
              공식 블루프린트·스터디 가이드 기준으로 정리한 학습 문서 4종. 시험을 보다가 헤더의 「시험 가이드」로 바로 열 수 있다.
            </p>
            <div className="guide-list">
              <button className="btn-secondary btn-block" onClick={onWiki}>
                합격 위키 — 검증 사다리 · 도구↔계층 매칭 · 함정 20선
              </button>
              <button className="btn-secondary btn-block" onClick={onBlueprint}>
                블루프린트 영어 해부 — 동사 뉘앙스 · 신호어 · 고빈도 어휘
              </button>
              <button className="btn-secondary btn-block" onClick={onStudyGuide}>
                공식 스터디 가이드 — 영어 원문 · 한글 번역 · 참고 문서 링크
              </button>
              <button className="btn-secondary btn-block" onClick={onConcepts}>
                72문항 개념 가이드 — 문항별 정답 근거 · 핵심 개념 · 풀이 전략 (EN/KO)
              </button>
            </div>
          </>
        )}
      </div>

      {history.length > 0 && (
        <div className="card">
          <h2>최근 시험 이력</h2>
          <div className="history-list">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="history-row">
                <span className="history-date">{new Date(h.date).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                {/* 예전 기록에는 examId가 없다(그때는 NCA-AIIO 하나뿐) · 제거된 시험의 기록은 id를 그대로 보여준다 */}
                <span className="history-exam">{h.examId ? EXAM_SHORT[h.examId] ?? h.examId : 'NCA'}</span>
                <span className="history-score">{h.correct}/{h.total} ({h.score}%)</span>
                <span className={h.passed ? 'tag-pass' : 'tag-fail'}>{h.passed ? 'PASS' : 'FAIL'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
