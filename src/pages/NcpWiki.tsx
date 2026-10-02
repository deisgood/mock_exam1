import { Legend, Toc } from './parts'
import D1 from './wiki/D1'
import D2 from './wiki/D2'
import D345 from './wiki/D345'
import Deep from './wiki/Deep'
import Intro from './wiki/Intro'
import Ref from './wiki/Ref'

const TOC = [
  { id: 'p0', label: 'Part 0. 검수 리포트' },
  { id: 'p1', label: 'Part 1. 시험 개요와 학습 전략' },
  { id: 'p2', label: 'Part 2. D1 — Cluster Test and Verification (33%)' },
  { id: 'p3', label: 'Part 3. D2 — System and Server Bring-up (31%)' },
  { id: 'p4', label: 'Part 4. D3 — Control Plane Install & Config (19%)' },
  { id: 'p5', label: 'Part 5. D4 — Troubleshoot and Optimize (12%)' },
  { id: 'p6', label: 'Part 6. D5 — Physical Layer Management (5%)' },
  { id: 'p7', label: 'Part 7. 보충 심화 — 기반 개념' },
  { id: 'p8', label: 'Part 8. 빠른 참조 (치트시트)' },
  { id: 'p9', label: 'Part 9. 함정 모음 · 체크리스트' },
  { id: 'pa', label: '부록. 공식 블루프린트 대조표' },
]

/**
 * NCP-AII 합격 위키 — 2026-09부터 전체 공개(홈 「시험 가이드」).
 * 기존 개념 정리를 공식 블루프린트와 1:1 대조 검수한 뒤 누락을 채우고 오류를 정정한 통합 문서.
 * 분량이 커서 Part 단위로 파일을 나눴다 (./wiki/*).
 */
export default function NcpWiki({
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
          <span className="doc-bar-title">NCP-AII 합격 위키</span>
          <button className="btn-home" onClick={onStudyGuide}>스터디 가이드</button>
          <button className="btn-home" onClick={onOther}>영어 해부 →</button>
        </div>
      </div>
      <div className="container guide guide-doc">
        <header className="home-header">
          <div className="badge">NCP-AII</div>
          <h1>NCP-AII 합격 위키</h1>
          <p className="subtitle">NVIDIA-Certified Professional: AI Infrastructure</p>
        </header>

        <div className="card guide-card">
          <p className="guide-desc">
            기존 「NCP-AII 개념 정리」를 <strong>공식 블루프린트와 1:1 대조 검수</strong>한 뒤, 누락 항목을 채우고 오류를
            정정하여 재작성한 통합 문서다.
          </p>
          <Legend
            items={[
              ['🆕', '기존 노트에 없던 신규 추가'],
              ['✅', '정정됨'],
              ['🎯', '출제 포인트'],
              ['🪤', '함정'],
              ['⚠️', '공식 문서 대조 필요'],
            ]}
          />
        </div>

        <Toc items={TOC} />

        <Intro />
        <D1 />
        <D2 />
        <D345 />
        <Deep />
        <Ref />

        <div className="guide-foot">
          <button className="btn-secondary btn-block" onClick={onStudyGuide}>공식 스터디 가이드 (EN/KO) 보기</button>
          <button className="btn-secondary btn-block" onClick={onOther}>블루프린트 영어 해부 보기 →</button>
          <button className="btn-secondary btn-block" onClick={onBack}>{back.long}</button>
        </div>
      </div>
    </>
  )
}
