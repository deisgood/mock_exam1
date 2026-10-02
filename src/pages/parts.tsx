import type { ReactNode } from 'react'

/** 카드 한 장 — 제목 + (선택) 한 줄 설명 */
export function GuideSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="card guide-card">
      <h2>{title}</h2>
      {hint && <p className="guide-hint">{hint}</p>}
      {children}
    </div>
  )
}

/** 라벨 + 설명 2열 행 (600px 이하에서는 1열로 접힘) */
export function GuideRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="guide-row">
      <div className="guide-label">{label}</div>
      <div className="guide-desc">{children}</div>
    </div>
  )
}

/** 키보드 키 표기 */
export function Key({ children }: { children: ReactNode }) {
  return <kbd className="guide-kbd">{children}</kbd>
}

export interface Ref {
  title: string
  source: string
  /** 확인된 공식 URL만 넣는다 (없으면 제목·출처로 검색) */
  url?: string
  /** 이 자료에서 시험 대비로 챙길 것 */
  note: string
}

/** 참고 문헌 목록 */
export function RefList({ items }: { items: Ref[] }) {
  return (
    <ul className="ref-list">
      {items.map((r, i) => (
        <li key={i} className="ref-item">
          <div className="ref-head">
            {r.url ? (
              <a className="ref-title" href={r.url} target="_blank" rel="noreferrer">
                {r.title} <span className="ref-ext">↗</span>
              </a>
            ) : (
              <span className="ref-title">{r.title}</span>
            )}
            <span className="ref-source">{r.source}</span>
          </div>
          <p className="ref-note">{r.note}</p>
        </li>
      ))}
    </ul>
  )
}

/* ==================== NCP-AII 가이드 문서용 ==================== */

/** 표 한 장 — 헤더 + 행들. 셀에 <code>·<strong> 같은 노드도 넣을 수 있다 */
export function T({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="gtable-wrap">
      <table className="gtable">
        <thead>
          <tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 명령어·다이어그램 블록 — 등폭, 가로 스크롤 */
export function Cmd({ children }: { children: string }) {
  return <pre className="gcode">{children}</pre>
}

/** 문서 Part 구분 헤더 — 목차 앵커(id)의 대상이 된다 */
export function Part({
  id,
  tag,
  title,
  lead,
}: {
  id: string
  tag: string
  title: string
  lead?: ReactNode
}) {
  return (
    <div className="guide-part" id={id}>
      <span className="guide-part-tag">{tag}</span>
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  )
}

/** 목차 — 각 Part의 id로 점프한다 */
export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <div className="card guide-card guide-toc">
      <h2>목차</h2>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** 범례 — 문서 전체에서 쓰는 표시 기호 */
export function Legend({ items }: { items: [string, string][] }) {
  return (
    <p className="guide-legend guide-mark-legend">
      {items.map(([mark, desc]) => (
        <span key={mark}>
          <b>{mark}</b> {desc}
        </span>
      ))}
    </p>
  )
}
