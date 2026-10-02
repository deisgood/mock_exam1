import type { Lang, Screen } from '../types'
import { FontSizeControl, LangToggle, ThemeToggle, type Theme } from './controls'

/**
 * 공통 헤더바 — 홈/시험/결과 모든 화면에 동일하게 적용.
 * 가운데 영역만 화면에 따라 바뀌고(시험: 진행도+경과 시간 / 결과: 제목),
 * 브랜드·홈·글자·언어·다크모드는 항상 같은 자리에 온다.
 */
export default function AppHeader({
  screen,
  examTitle,
  onExamGuide,
  onHome,
  onLanding,
  onGo,
  lang,
  setLang,
  theme,
  onToggleTheme,
  exam,
}: {
  screen: Screen
  /** 지금 보고 있는(또는 응시 중인) 시험 이름 — 브랜드 문구에 쓴다 */
  examTitle: string
  /** 시험 가이드 — 보고 있는 시험에 맞는 문서를 App이 고른다 (NCA-AIIO: 개요 문서 / NCP-AII: 합격 위키) */
  onExamGuide: () => void
  onHome: () => void
  /** 입장(메인) 화면으로 — 브랜드 클릭 */
  onLanding: () => void
  onGo: (s: Screen) => void
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  onToggleTheme: () => void
  exam?: {
    current: number
    total: number
    /** 지금까지 시험 화면에 머문 시간 — 시간제한이 없어 세어 올라간다 */
    timeStr: string
    onToggleSidebar: () => void
    onSubmit: () => void
  }
}) {
  // 글자 크기·언어는 문제가 실제로 보이는 화면에서만 의미가 있다
  const showQuestionControls = screen === 'exam' || screen === 'result'
  const TITLE: Partial<Record<Screen, string>> = {
    result: '시험 결과',
    usage: '사용법',
    examguide: '시험 가이드',
  }

  return (
    <nav className={`site-nav nav-${screen}`}>
      <div className="site-nav-inner">
        {/* 시험 중에는 실수로 빠져나가지 않도록 클릭 불가 (시험은 유지되지만 화면이 튄다) */}
        {screen === 'exam' ? (
          <span className="site-brand">🎓 {examTitle} Mock Exam</span>
        ) : (
          <button className="site-brand site-brand-btn" onClick={onLanding} title="메인 화면으로">
            🎓 {examTitle} Mock Exam
          </button>
        )}
        {screen !== 'home' && (
          <button className="btn-home" onClick={onHome} title="홈으로 (시험은 유지됩니다)">홈</button>
        )}
        <div className="nav-links">
          {screen !== 'usage' && (
            <button className="btn-home" onClick={() => onGo('usage')} title="화면별 UI 사용법">사용법</button>
          )}
          {screen !== 'examguide' && (
            <button className="btn-home" onClick={onExamGuide} title={`${examTitle} 시험 개요와 핵심 개념`}>
              시험 가이드
            </button>
          )}
        </div>

        <div className="nav-center">
          {exam && (
            <>
              <button className="btn-ghost" onClick={exam.onToggleSidebar} title="문제 현황 열기/닫기">
                {exam.current} / {exam.total}
              </button>
              <div className="timer" title="시험 화면에 머문 시간 — 시간제한 없음">
                ⏱ {exam.timeStr}
                <span className="timer-note">경과</span>
              </div>
            </>
          )}
          {TITLE[screen] && !exam && <span className="result-title">{TITLE[screen]}</span>}
        </div>

        <div className="site-nav-right">
          {showQuestionControls && <FontSizeControl compact />}
          {showQuestionControls && <LangToggle lang={lang} setLang={setLang} />}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {exam && <button className="btn-submit" onClick={exam.onSubmit}>제출</button>}
        </div>
      </div>
    </nav>
  )
}
