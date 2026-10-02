import { useCallback, useEffect, useState } from 'react'
import type { Lang } from '../types'

/** 언어 전환 — 세그먼트 컨트롤 (현재 언어가 하이라이트) */
export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="seg" role="group" aria-label="문제/해설 언어 전환" title="문제·보기·해설 언어 전환">
      <button className={lang === 'en' ? 'seg-on' : ''} onClick={() => setLang('en')}>EN</button>
      <button className={lang === 'ko' ? 'seg-on' : ''} onClick={() => setLang('ko')}>한글</button>
    </div>
  )
}

export type Theme = 'light' | 'dark'

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('nca-theme', theme)
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}

/** 문제/보기 글자 크기 조절 (10~20px, localStorage 저장) */
export function FontSizeControl({ compact = false }: { compact?: boolean }) {
  const [size, setSize] = useState(() => {
    const s = Number(localStorage.getItem('nca-fontsize'))
    return s >= 10 && s <= 20 ? s : 14
  })
  useEffect(() => {
    document.documentElement.style.setProperty('--qfs', `${size}px`)
    localStorage.setItem('nca-fontsize', String(size))
    window.dispatchEvent(new CustomEvent('nca-fs', { detail: size }))
  }, [size])
  // 다른 인스턴스(상단바/사이드바)와 값 동기화
  useEffect(() => {
    const h = (e: Event) => setSize((e as CustomEvent<number>).detail)
    window.addEventListener('nca-fs', h)
    return () => window.removeEventListener('nca-fs', h)
  }, [])
  return (
    <div className={`fs-control ${compact ? 'fs-compact' : ''}`} title="문제/보기 글자 크기 (10~20)">
      <span className="fs-label">글자</span>
      <button onClick={() => setSize((s) => Math.max(10, s - 1))} disabled={size <= 10}>−</button>
      <span className="fs-value">{size}</span>
      <button onClick={() => setSize((s) => Math.min(20, s + 1))} disabled={size >= 20}>＋</button>
    </div>
  )
}

/** 다크 모드 — 텍스트 라벨 + ON/OFF 스위치 */
export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const on = theme === 'dark'
  return (
    <button
      className={`btn-switch ${on ? 'on' : ''}`}
      onClick={onToggle}
      title={on ? '다크 모드 끄기' : '다크 모드 켜기'}
      aria-pressed={on}
    >
      <span className="switch-track"><span className="switch-knob" /></span>
      <span className="switch-label">다크 모드 <b>{on ? 'ON' : 'OFF'}</b></span>
    </button>
  )
}
