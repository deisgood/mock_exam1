import { useCallback, useEffect, useRef, useState } from 'react'
import AppHeader from './components/AppHeader'
import { useTheme } from './components/controls'
import { EXAM_LIST, getExam } from './data/exams'
import {
  clearSession,
  gradeExam,
  loadElapsed,
  loadSession,
  pickExamQuestions,
  saveElapsed,
  saveHistory,
  saveSession,
} from './lib/exam'
import { loadUi, saveUi } from './lib/uistate'
import type { ExamId, ExamRecord, ExamSession, Lang, Screen } from './types'
import NcpBlueprint from './pages/NcpBlueprint'
import NcpConcepts from './pages/NcpConcepts'
import NcpStudyGuide from './pages/NcpStudyGuide'
import NcpWiki from './pages/NcpWiki'
import Exam from './pages/Exam'
import ExamGuide from './pages/ExamGuide'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Result from './pages/Result'
import UsageGuide from './pages/UsageGuide'

// 공통 헤더를 띄우지 않는 화면 — 단독으로 보여준다
const CHROMELESS: Screen[] = [
  'landing',
  'ncpwiki',
  'ncpblueprint',
  'ncpstudy',
  'ncpconcepts',
]

// 첫 렌더 전에 저장본을 한 번만 읽는다 — UI 상태 복원이 세션 유무에 따라 달라지므로 함께 읽는다
const SAVED_SESSION = loadSession()
const SAVED_UI = loadUi(SAVED_SESSION)

export default function App() {
  // 새로고침해도 보고 있던 화면으로 돌아온다 (시험 중이었으면 시험 화면으로)
  const [screen, setScreen] = useState<Screen>(SAVED_UI.screen)
  // 새로고침해도 진행 중 시험이 이어지도록 저장본에서 복원 (없으면 null)
  const [session, setSession] = useState<ExamSession | null>(SAVED_SESSION)
  const [record, setRecord] = useState<ExamRecord | null>(null)
  const [examActive, setExamActive] = useState<boolean>(SAVED_SESSION !== null)
  const examActiveRef = useRef(false)
  examActiveRef.current = examActive
  const [examId, setExamId] = useState<ExamId>(SAVED_UI.examId)
  const [lang, setLang] = useState<Lang>(SAVED_UI.lang)
  const [theme, toggleTheme] = useTheme()
  const [shuffled, setShuffled] = useState<boolean>(() => localStorage.getItem('nca-shuffle') === '1')
  // 헤더가 공통이라 시험용 상태(경과 시간·사이드바·제출)도 App이 소유한다
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // 경과 시간(ms) — 시간제한이 없으므로 세어 올리기만 하고 자동 제출은 없다
  const [elapsed, setElapsed] = useState<number>(SAVED_SESSION ? loadElapsed() : 0)
  const elapsedRef = useRef(elapsed)
  const sessionRef = useRef<ExamSession | null>(session)
  sessionRef.current = session

  const toggleShuffle = (v: boolean) => {
    setShuffled(v)
    localStorage.setItem('nca-shuffle', v ? '1' : '0')
  }

  const startExam = () => {
    const exam = getExam(examId)
    const questions = pickExamQuestions(exam.questions, shuffled)
    setSession({
      examId: exam.id,
      questions,
      answers: questions.map(() => []),
      flags: questions.map(() => false),
      revealed: questions.map(() => false),
      current: 0,
      startedAt: Date.now(),
    })
    elapsedRef.current = 0
    setElapsed(0)
    saveElapsed(0)
    setExamActive(true)
    setSidebarOpen(false)
    setScreen('exam')
  }

  /** 진행 중인 시험으로 돌아간다 — 답안·경과 시간은 저장본에서 그대로 이어진다 */
  const resumeExam = () => {
    setScreen('exam')
  }

  const submitExam = useCallback((s: ExamSession) => {
    if (!examActiveRef.current) return // 중복 제출 방지 (버튼 연타 등)
    setExamActive(false)
    const rec = gradeExam(s.examId, s.questions, s.answers)
    saveHistory(rec)
    clearSession() // 제출된 시험은 더 이상 복원 대상이 아니다
    setRecord(rec)
    setSidebarOpen(false)
    setScreen('result')
  }, [])

  // 진행 중 세션을 localStorage에 저장 — 답안·플래그·이동이 있을 때마다
  useEffect(() => {
    if (session && examActive) saveSession(session)
  }, [session, examActive])

  // 화면·시험 선택·언어를 저장 — 새로고침 후 같은 자리로 돌아오기 위해
  useEffect(() => {
    saveUi({ screen, examId, lang })
  }, [screen, examId, lang])

  // 경과 시간 — 시험 화면에 머무는 동안만 흐른다 (홈·가이드에 다녀온 시간은 세지 않는다).
  // 시간제한이 없으므로 만료·자동 제출이 없고, 매 tick마다 저장해 새로고침에도 이어진다.
  useEffect(() => {
    if (screen !== 'exam' || !examActive) return
    let last = Date.now()
    const t = setInterval(() => {
      const now = Date.now()
      elapsedRef.current += now - last // 백그라운드 탭에서 tick이 밀려도 실제 흐른 시간으로 보정
      last = now
      setElapsed(elapsedRef.current)
      saveElapsed(elapsedRef.current)
    }, 1000)
    return () => clearInterval(t)
  }, [screen, examActive])

  // 시험 중 실수로 새로고침·탭 닫기를 하면 브라우저가 한 번 더 확인하게 한다
  // (답안은 저장돼 이어서 풀 수 있지만, 화면이 튀는 것 자체를 막는다)
  useEffect(() => {
    if (!examActive) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = '' // 일부 브라우저는 returnValue를 봐야 확인 창을 띄운다
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [examActive])

  // 화면이 바뀌면 맨 위부터 보이도록
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const confirmSubmit = () => {
    const s = sessionRef.current
    if (!s) return
    const unanswered = s.answers.filter((a) => a.length === 0).length
    const msg = unanswered > 0 ? `미응답 문항이 ${unanswered}개 있습니다. 제출할까요?` : '시험을 제출할까요?'
    if (confirm(msg)) submitExam(s)
  }

  // 가이드 문서는 홈 또는 헤더에서 열고, 돌아가기는 항상 홈으로 간다
  const guideBack = { short: '← 홈', long: '← 홈으로 돌아가기' }

  // 헤더에 쓸 시험 이름 — 응시/결과 화면에서는 그 시험을, 그 밖에는 현재 선택된 시험을 따른다
  const headerExamId =
    screen === 'exam' && session ? session.examId : screen === 'result' && record ? record.examId : examId

  const sec = Math.floor(elapsed / 1000)
  const hh = Math.floor(sec / 3600)
  const mm = Math.floor((sec % 3600) / 60)
  const ss = sec % 60
  const timeStr =
    (hh > 0 ? `${hh}:` : '') + `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`

  return (
    <div className="app">
      {/* 입장·가이드 문서 화면은 헤더 없이 단독으로 보여준다 */}
      {!CHROMELESS.includes(screen) && (
        <AppHeader
          screen={screen}
          examTitle={getExam(headerExamId).title}
          onExamGuide={() =>
            headerExamId === 'nca-aiio' ? setScreen('examguide') : setScreen('ncpwiki')
          }
          onHome={() => setScreen('home')}
          onLanding={() => setScreen('landing')}
          onGo={setScreen}
          lang={lang}
          setLang={setLang}
          theme={theme}
          onToggleTheme={toggleTheme}
          exam={
            screen === 'exam' && session
              ? {
                  current: session.current + 1,
                  total: session.questions.length,
                  timeStr,
                  onToggleSidebar: () => setSidebarOpen((o) => !o),
                  onSubmit: confirmSubmit,
                }
              : undefined
          }
        />
      )}
      {screen === 'landing' && (
        <Landing
          exams={EXAM_LIST}
          onEnter={(id) => {
            setExamId(id)
            setScreen('home')
          }}
        />
      )}
      {screen === 'ncpwiki' && (
        <NcpWiki
          onBack={() => setScreen('home')}
          back={guideBack}
          onOther={() => setScreen('ncpblueprint')}
          onStudyGuide={() => setScreen('ncpstudy')}
        />
      )}
      {screen === 'ncpblueprint' && (
        <NcpBlueprint
          onBack={() => setScreen('home')}
          back={guideBack}
          onOther={() => setScreen('ncpwiki')}
          onStudyGuide={() => setScreen('ncpstudy')}
        />
      )}
      {screen === 'ncpconcepts' && (
        <NcpConcepts
          onBack={() => setScreen('home')}
          back={guideBack}
          onWiki={() => setScreen('ncpwiki')}
          onStudyGuide={() => setScreen('ncpstudy')}
        />
      )}
      {screen === 'ncpstudy' && (
        <NcpStudyGuide
          onBack={() => setScreen('home')}
          back={guideBack}
          onWiki={() => setScreen('ncpwiki')}
          onBlueprint={() => setScreen('ncpblueprint')}
        />
      )}
      {screen === 'home' && (
        <Home
          exams={EXAM_LIST}
          examId={examId}
          onSelectExam={setExamId}
          onStart={startExam}
          shuffled={shuffled}
          onToggleShuffle={toggleShuffle}
          activeSession={examActive ? session : null}
          activeElapsedMs={elapsed}
          onResume={resumeExam}
          onExamGuide={() => setScreen('examguide')}
          onWiki={() => setScreen('ncpwiki')}
          onBlueprint={() => setScreen('ncpblueprint')}
          onStudyGuide={() => setScreen('ncpstudy')}
          onConcepts={() => setScreen('ncpconcepts')}
        />
      )}
      {screen === 'exam' && session && (
        <Exam
          session={session}
          setSession={setSession}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onHome={() => setScreen('home')}
          lang={lang}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {screen === 'result' && record && session && (
        <Result
          record={record}
          session={session}
          onHome={() => setScreen('home')}
          onRetry={startExam}
          lang={lang}
        />
      )}
      {screen === 'usage' && (
        <UsageGuide onHome={() => setScreen('home')} onExamGuide={() => setScreen('examguide')} />
      )}
      {screen === 'examguide' && (
        <ExamGuide onHome={() => setScreen('home')} onUsage={() => setScreen('usage')} />
      )}
    </div>
  )
}
