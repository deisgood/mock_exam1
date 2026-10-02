import { Fragment, useState } from 'react'
import type { ReactNode } from 'react'
import { GuideSection, Part, T, Toc } from './parts'
import DATA from '../data/ncp/concepts.json'
import { NCP_QUESTIONS } from '../data/ncp'

type Lang = 'en' | 'ko'

/* concepts.json의 형태 — 파서(scripts 밖, 마크다운 원문에서 생성)와 1:1 */
interface LocQ {
  title: string
  answer: string
  concept: string
  strategy: string
}
interface Question {
  num: string
  /** 문제은행(src/data/ncp) 문항 id — 보기별 해설(오답 풀이)을 여기서 가져온다 */
  bankId?: string
  en: LocQ
  ko: LocQ
}
interface MdTable {
  head: string[]
  rows: string[][]
}
interface Domain {
  num: string
  title: string
  weight: string
  count: number
  intro: { en: string; ko: string }
  mapTitle?: { en: string; ko: string }
  map?: { en: MdTable; ko: MdTable }
  questions: Question[]
}
interface Concepts {
  desc: { en: string; ko: string }
  domains: Domain[]
  strategy: {
    en: { title: string; items: string[]; table: MdTable | null }
    ko: { title: string; items: string[]; table: MdTable | null }
  }
}

const G = DATA as Concepts

/** 인라인 마크다운 최소 렌더러 — `코드`와 **강조**만 처리한다 (원문에 그 둘만 쓰임) */
function md(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    return <Fragment key={i}>{p}</Fragment>
  })
}

/** \n\n 구분 문단들을 <p> 목록으로 */
function Paras({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={className}>
          {md(p)}
        </p>
      ))}
    </>
  )
}

function MdT({ table }: { table: MdTable }) {
  return <T head={table.head.map(md)} rows={table.rows.map((r) => r.map(md))} />
}

/** 문제은행의 보기별 해설 — 정답/오답 보기를 나란히 놓고 각각 왜 맞고 틀린지 보여준다 (해설은 한글) */
function Distractors({ bankId, lang }: { bankId?: string; lang: Lang }) {
  const bq = bankId ? NCP_QUESTIONS.find((x) => x.id === bankId) : undefined
  if (!bq || !bq.notes.length) return null
  const choices = lang === 'en' ? bq.choices : bq.choices_ko
  return (
    <>
      <p className="guide-h3">{lang === 'en' ? 'Why each choice is right or wrong' : '오답 풀이'}</p>
      <ul className="cg-distractors">
        {choices.map((ch, i) => {
          const right = bq.answer.includes(i)
          return (
            <li key={i} className={right ? 'cg-d-right' : 'cg-d-wrong'}>
              <span className="cg-d-choice">{md(ch)}</span>
              <span className="cg-d-note">{bq.notes[i]}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function QuestionCard({ q, lang }: { q: Question; lang: Lang }) {
  const c = lang === 'en' ? q.en : q.ko
  return (
    <div className="card guide-card" id={q.num.toLowerCase()}>
      <h2>
        <span className="cg-qnum">{q.num}</span> {md(c.title)}
      </h2>
      <p className="cg-answer">
        <strong>{lang === 'en' ? 'Answer' : '정답'}</strong> {md(c.answer)}
      </p>
      <p className="guide-h3">{lang === 'en' ? 'Concept' : '핵심 개념'}</p>
      <Paras text={c.concept} className="guide-desc" />
      <p className="guide-h3">{lang === 'en' ? 'Strategy' : '풀이 전략'}</p>
      <Paras text={c.strategy} className="guide-desc" />
      <Distractors bankId={q.bankId} lang={lang} />
    </div>
  )
}

/**
 * NCP-AII 72문항 개념 가이드 — 2026-09부터 전체 공개(홈 「시험 가이드」).
 * 모의문제 세트 전체를 도메인 가중치 순으로 재정렬해 문항별
 * 정답 근거 · 핵심 개념 · 풀이 전략(함정 포인트)을 EN/KO로 담은 문서.
 * 본문 데이터는 src/data/ncp/concepts.json (마크다운 원문에서 생성).
 */
export default function NcpConcepts({
  onBack,
  back,
  onWiki,
  onStudyGuide,
}: {
  onBack: () => void
  /** 돌아가기 버튼 라벨 */
  back: { short: string; long: string }
  onWiki: () => void
  onStudyGuide: () => void
}) {
  const [lang, setLang] = useState<Lang>('ko')
  const t = (en: string, ko: string) => (lang === 'en' ? en : ko)

  const toc = [
    ...G.domains.map((d) => ({
      id: d.num.toLowerCase(),
      label: `${d.num}. ${d.title} (${d.weight}) — ${d.count}${lang === 'en' ? ' questions' : '문항'}`,
    })),
    { id: 'cg-strategy', label: t('Overall Study Strategy', '종합 학습 전략') },
  ]

  return (
    <>
      <div className="doc-bar">
        <div className="doc-bar-inner">
          <button className="btn-home" onClick={onBack}>{back.short}</button>
          <span className="doc-bar-title">
            {t('NCP-AII 72-Question Concept Guide', 'NCP-AII 72문항 개념 가이드')}
          </span>
          <div className="seg">
            <button className={lang === 'en' ? 'seg-on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'ko' ? 'seg-on' : ''} onClick={() => setLang('ko')}>한글</button>
          </div>
        </div>
      </div>

      <div className="container guide guide-doc">
        <header className="home-header">
          <div className="badge">NCP-AII</div>
          <h1>{t('72-Question Concept Guide', '72문항 개념 가이드')}</h1>
          <p className="subtitle">NVIDIA-Certified Professional: AI Infrastructure (NCP-AII)</p>
        </header>

        <div className="card guide-card">
          <Paras text={lang === 'en' ? G.desc.en : G.desc.ko} className="guide-desc" />
          <T
            head={[t('Domain', '도메인'), t('Weight', '비중'), t('Questions', '문항 수')]}
            rows={G.domains.map((d) => [
              `${d.num}. ${d.title}`,
              d.weight,
              `${d.count}${lang === 'en' ? '' : '문항'}`,
            ])}
          />
          <p className="guide-note">
            {t(
              'D1 and D2 together are 64% of the exam. Weight your study toward the InfiniBand/NCCL diagnostic toolchain and the DGX hardware bring-up procedure.',
              'D1과 D2가 전체의 64%입니다. InfiniBand/NCCL 진단 도구 체계와 DGX 하드웨어 브링업 절차에 학습 비중을 가장 두텁게 두세요.',
            )}
          </p>
        </div>

        <Toc items={toc} />

        {G.domains.map((d) => {
          const intro = lang === 'en' ? d.intro.en : d.intro.ko
          return (
            <Fragment key={d.num}>
              <Part
                id={d.num.toLowerCase()}
                tag={`${d.num} · ${d.weight}`}
                title={`${d.title} — ${d.count}${lang === 'en' ? ' questions' : '문항'}`}
                lead={md(intro)}
              />
              {d.map && d.mapTitle && (
                <GuideSection title={lang === 'en' ? d.mapTitle.en : d.mapTitle.ko}>
                  <MdT table={lang === 'en' ? d.map.en : d.map.ko} />
                </GuideSection>
              )}
              {d.questions.map((q) => (
                <QuestionCard key={q.num} q={q} lang={lang} />
              ))}
            </Fragment>
          )
        })}

        <Part
          id="cg-strategy"
          tag={t('WRAP-UP', '마무리')}
          title={lang === 'en' ? G.strategy.en.title : G.strategy.ko.title}
        />
        <div className="card guide-card">
          {(lang === 'en' ? G.strategy.en.items : G.strategy.ko.items).map((p, i) => (
            <p key={i} className="guide-desc cg-strategy-item">
              {md(p)}
            </p>
          ))}
          {(lang === 'en' ? G.strategy.en.table : G.strategy.ko.table) && (
            <MdT table={(lang === 'en' ? G.strategy.en.table : G.strategy.ko.table)!} />
          )}
        </div>

        <div className="guide-foot">
          <button className="btn-secondary btn-block" onClick={onWiki}>합격 위키 보기</button>
          <button className="btn-secondary btn-block" onClick={onStudyGuide}>공식 스터디 가이드 (EN/KO) 보기</button>
          <button className="btn-secondary btn-block" onClick={onBack}>{back.long}</button>
        </div>
      </div>
    </>
  )
}
