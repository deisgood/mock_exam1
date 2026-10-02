import { Toc } from './parts'
import Appx from './bp/Appx'
import S1 from './bp/S1'
import S23 from './bp/S23'
import S45 from './bp/S45'
import Verbs from './bp/Verbs'

const TOC = [
  { id: 'b0', label: '0. 전체를 관통하는 문법 패턴' },
  { id: 'b1', label: '1. System and Server Bring-up (31%)' },
  { id: 'b2', label: '2. Physical Layer Management (5%)' },
  { id: 'b3', label: '3. Control Plane Install & Config (19%)' },
  { id: 'b4', label: '4. Cluster Test and Verification (33%)' },
  { id: 'b5', label: '5. Troubleshoot and Optimize (12%)' },
  { id: 'ba', label: '부록 A. 표 자체를 읽는 영어' },
  { id: 'bb', label: '부록 B. 고빈도 어휘 40' },
  { id: 'bc', label: '부록 C. 선택지 신호어' },
]

/**
 * NCP-AII 블루프린트 문장별 정밀 해부 — 2026-09부터 전체 공개(홈 「시험 가이드」).
 * 시험은 영어로만 출제되므로, 블루프린트 문장의 동사·용어·선택지 신호어를
 * 해부해 지문을 오해하지 않도록 하는 것이 목적이다. (./bp/*)
 */
export default function NcpBlueprint({
  onBack,
  back,
  onOther,
  onStudyGuide,
}: {
  onBack: () => void
  /** 돌아가기 버튼 라벨 */
  back: { short: string; long: string }
  onOther: () => void
  onStudyGuide: () => void
}) {
  return (
    <>
      {/* 이동 바는 본문 밖에 둔다 — 바탕은 화면 전체 폭, 안쪽만 본문과 같은 폭 */}
      <div className="doc-bar">
        <div className="doc-bar-inner">
          <button className="btn-home" onClick={onBack}>{back.short}</button>
          <span className="doc-bar-title">블루프린트 영어 해부</span>
          <button className="btn-home" onClick={onStudyGuide}>스터디 가이드</button>
          <button className="btn-home" onClick={onOther}>합격 위키 →</button>
        </div>
      </div>
      <div className="container guide guide-doc">
        <header className="home-header">
          <div className="badge">NCP-AII</div>
          <h1>블루프린트 — 문장별 정밀 해부</h1>
          <p className="subtitle">시험은 영어만. 지문을 오해하면 아는 것도 틀린다</p>
        </header>

        <Toc items={TOC} />

        <Verbs />
        <S1 />
        <S23 />
        <S45 />
        <Appx />

        <div className="card guide-card">
          <h2>다음으로 할 수 있는 것</h2>
          <ul className="guide-list">
            <li>모의 문제 20문항 — 위 어휘·구문이 그대로 쓰인 영어 지문 + 선택지, 오답 이유까지 해설</li>
            <li>약어 플래시카드 150개 — 풀네임 + 발음 + 한 줄 정의</li>
            <li>특정 섹션 심화 — 예: NCCL/HPL 결과 로그 실물을 영어로 한 줄씩 해석</li>
            <li>트러블슈팅 시나리오 독해 — 실제 장애 상황 영문 지문 3~5개를 문장 단위로 해부</li>
          </ul>
        </div>

        <div className="guide-foot">
          <button className="btn-secondary btn-block" onClick={onStudyGuide}>공식 스터디 가이드 (EN/KO) 보기</button>
          <button className="btn-secondary btn-block" onClick={onOther}>합격 위키 보기 →</button>
          <button className="btn-secondary btn-block" onClick={onBack}>{back.long}</button>
        </div>
      </div>
    </>
  )
}
