import type { ExamDef, ExamId } from '../types'

/**
 * GPU 다이 모티프 벡터 마크 — NVIDIA 상표(아이 로고)는 쓰지 않고,
 * 브랜드 컬러(--primary)와 GPU 칩 형태만으로 상징한다. 테마 변수로 다크모드 대응.
 */
function GpuMark() {
  // 다이 내부 코어 그리드 (4×4)
  const cores = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cores.push(
        <rect
          key={`${r}-${c}`}
          x={48 + c * 9}
          y={48 + r * 9}
          width={6}
          height={6}
          rx={1.2}
          fill="#fff"
          opacity={0.25 + ((r + c) % 3) * 0.28}
        />,
      )
    }
  }
  // 4면 핀 (각 면 5개)
  const pins = []
  for (let i = 0; i < 5; i++) {
    const p = 38 + i * 11
    pins.push(
      <g key={i} className="lm-pin">
        <line x1={p} y1={30} x2={p} y2={16} />
        <line x1={p} y1={130} x2={p} y2={144} />
        <line x1={30} y1={p} x2={16} y2={p} />
        <line x1={130} y1={p} x2={144} y2={p} />
      </g>,
    )
  }

  return (
    <svg className="landing-mark" viewBox="0 0 160 160" role="img" aria-label="GPU 가속 컴퓨팅">
      <defs>
        <linearGradient id="lm-die" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8fd60a" />
          <stop offset="100%" stopColor="#5a8f00" />
        </linearGradient>
      </defs>

      {/* 핀 */}
      <g className="lm-pins">{pins}</g>

      {/* 칩 패키지 */}
      <rect className="lm-pkg" x={30} y={30} width={100} height={100} rx={14} />

      {/* 다이 */}
      <rect x={44} y={44} width={72} height={72} rx={8} fill="url(#lm-die)" />
      {cores}

      {/* 다이 상단 인디케이터 */}
      <circle cx={122} cy={38} r={3.5} fill="var(--primary)" />
    </svg>
  )
}

/** 입장 화면 — 응시할 시험을 고르면 그 시험이 선택된 홈으로 들어간다 */
export default function Landing({
  exams,
  onEnter,
}: {
  /** 고를 수 있는 시험 */
  exams: ExamDef[]
  onEnter: (id: ExamId) => void
}) {
  return (
    <div className="landing">
      <div className="landing-card">
        <GpuMark />
        <div className="badge">NVIDIA Certification</div>
        <h1 className="landing-title">NVIDIA 자격증 모의 시험장</h1>
        <p className="landing-sub">응시할 시험을 선택하세요</p>

        {/* 시험 카드 — 하나를 누르면 바로 입장. 좁은 화면에서도 한 카드가 한 줄을 차지해 오터치가 없다 */}
        <div className="landing-exams">
          {exams.map((e) => (
            <button
              key={e.id}
              className={`landing-exam landing-exam-${e.id}`}
              onClick={() => onEnter(e.id)}
              aria-label={`${e.title} 모의 시험장 입장 — ${e.subtitle}, ${e.questions.length}문항`}
            >
              <span className="landing-exam-body">
                <span className="landing-exam-level">{e.badge}</span>
                <span className="landing-exam-title">{e.title}</span>
                <span className="landing-exam-sub">
                  {e.subtitle} · {e.questions.length}문항
                </span>
              </span>
              <span className="landing-exam-cta" aria-hidden="true">
                입장 →
              </span>
            </button>
          ))}
        </div>

        <p className="landing-foot">시간제한 없음 · 진행 중인 시험은 브라우저에 저장돼 이어서 풀 수 있습니다</p>
      </div>
    </div>
  )
}
