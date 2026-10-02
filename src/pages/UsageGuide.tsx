import { ALL_QUESTIONS } from '../data'
import { PASS_PERCENT } from '../lib/exam'
import { GuideRow, GuideSection, Key } from './parts'

/** 사용법 — 각 화면과 UI 요소를 어떻게 쓰는지 정리 */
export default function UsageGuide({
  onHome,
  onExamGuide,
}: {
  onHome: () => void
  onExamGuide: () => void
}) {
  const total = ALL_QUESTIONS.length

  return (
    <div className="container guide">
      <header className="home-header">
        <div className="badge">사용 가이드</div>
        <h1>이렇게 사용하세요</h1>
        <p className="subtitle">화면별 UI 요소와 단축키 정리</p>
      </header>

      <GuideSection title="한눈에 보기">
        <div className="info-grid info-grid-solo">
          <div><span className="info-num">{total}</span><span className="info-label">문항 (전체)</span></div>
        </div>
        <p className="note">
          문제은행 전체가 한 번에 출제됩니다. <strong>시간제한은 없습니다</strong> — 자동 제출되지 않고,
          중간에 나갔다 와도 저장된 답안으로 이어서 풀 수 있습니다.
        </p>
      </GuideSection>

      <GuideSection title="공통 헤더바" hint="홈·시험·결과 어느 화면에서나 같은 자리에 있습니다.">
        <GuideRow label="🎓 브랜드">
          현재 앱 이름입니다. 화면이 좁으면(600px 이하) 자리를 비우기 위해 숨겨집니다.
        </GuideRow>
        <GuideRow label="홈">
          홈 화면으로 돌아갑니다. <strong>시험 중에 눌러도 답안은 그대로 유지</strong>되며, 홈의{' '}
          <strong>▶ 시험 계속하기</strong> 버튼으로 이어서 풀 수 있습니다. 홈에 머무는 동안에는 경과 시간도
          멈춥니다.
        </GuideRow>
        <GuideRow label="사용법 / 시험 가이드">
          이 페이지와 시험 개념 정리 페이지로 이동합니다. 시험 중에도 이동할 수 있고 답안은 유지됩니다.
        </GuideRow>
        <GuideRow label={<>n / {total}</>}>
          현재 문항 번호입니다. <strong>누르면 문제 현황이 열리고 닫힙니다.</strong> 데스크톱에서는 문제 현황이
          항상 왼쪽에 떠 있어서 이 버튼은 주로 좁은 화면에서 쓰게 됩니다.
        </GuideRow>
        <GuideRow label="⏱ 경과">
          <strong>시간제한이 없어</strong> 남은 시간이 아니라 지금까지 들인 시간을 세어 올립니다. 자동 제출은
          없으니 필요한 만큼 오래 붙잡고 있어도 됩니다. <strong>시험 화면에 있는 동안만</strong> 흐르고, 홈·가이드
          페이지에 다녀오는 시간은 세지 않습니다. 새로고침해도 이어집니다.
        </GuideRow>
        <GuideRow label="글자 − 14 ＋">
          문제·보기 글자 크기입니다 (10~20px). 설정은 저장되어 다음에도 유지됩니다.
        </GuideRow>
        <GuideRow label="EN / 한글">
          문제·보기·해설의 언어를 바꿉니다. <strong>실제 시험이 영어라 기본값은 EN</strong>이며, 막히는 문항만
          한글로 바꿔 확인하는 방식을 권합니다.
        </GuideRow>
        <GuideRow label="다크 모드">
          밝은 테마와 어두운 테마를 전환합니다. 설정은 저장됩니다.
        </GuideRow>
        <GuideRow label="제출">
          채점하고 결과 화면으로 넘어갑니다. 미응답 문항이 남아 있으면 몇 개인지 알려주고 한 번 더 확인합니다.
        </GuideRow>
        <p className="guide-note">
          화면에 따라 필요한 것만 나옵니다 — 홈에서는 글자·언어 컨트롤이 숨겨지고(문제가 없어 효과가 없으므로),
          진행도·경과 시간·제출은 시험 중에만 나타납니다. 폭이 600px 이하인 기기에서 시험을 볼 때는 자리가 부족해
          홈·다크 모드·글자 크기가 <strong>문제 현황 서랍 안</strong>으로 들어갑니다.
        </p>
      </GuideSection>

      <GuideSection title="홈 화면">
        <GuideRow label="시험 정보">
          전체 문항 수와 도메인별 문항 수를 보여줍니다.
        </GuideRow>
        <GuideRow label="🔀 문제 순서 셔플">
          켜면 문제가 랜덤 순서로 나옵니다. 꺼도 <strong>보기(A~D) 순서는 매번 섞입니다</strong> — 정답 위치를
          외워버리는 것을 막기 위해서입니다.
        </GuideRow>
        <GuideRow label="시험 시작">
          새 시험을 시작합니다. 진행 중인 시험이 있으면 기존 답안이 지워진다고 먼저 확인합니다.
        </GuideRow>
        <GuideRow label="최근 시험 이력">
          최근 5회를 보여줍니다 (내부적으로는 최대 50회까지 저장). 날짜·점수·PASS/FAIL이 남습니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="시험 화면">
        <GuideRow label="진행 바">
          맨 위 초록 막대는 <strong>응답한 문항의 비율</strong>입니다. 정답률이 아닙니다.
        </GuideRow>
        <GuideRow label="복수 선택 배지">
          이 배지가 붙은 문항은 답이 2개 이상입니다. <strong>부분 점수가 없어 정답 조합이 완전히 일치해야</strong>
          정답 처리됩니다.
        </GuideRow>
        <GuideRow label="⚑ 표시">
          나중에 다시 볼 문항을 표시합니다. 문제 현황에서 주황 테두리로 구분되고, 상단 통계에도 개수가 잡힙니다.
        </GuideRow>
        <GuideRow label="보기 선택">
          클릭하면 선택됩니다. <strong>같은 보기를 다시 누르면 선택이 해제</strong>됩니다 — 단일 선택 문항도
          마찬가지라 답을 비워둘 수 있습니다.
        </GuideRow>
        <GuideRow label="정답 확인 ▼">
          정답·해설·핵심 개념·풀이 방법을 펼칩니다. 다시 누르면 접힙니다. 점수에는 영향이 없지만, 확인한 문항이
          오답이면 문제 현황에 빨간색으로 남아 복습할 때 유용합니다.
        </GuideRow>
        <GuideRow label="← 이전 / 다음 →">
          문항을 이동합니다. 이동하면 화면이 자동으로 맨 위로 올라갑니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="문제 현황" hint="데스크톱에서는 왼쪽에 고정, 900px 이하에서는 서랍으로 열립니다.">
        <GuideRow label="상단 통계">
          응답 / 미응답 / 플래그 개수입니다.
        </GuideRow>
        <GuideRow label="번호 격자">
          번호를 누르면 그 문항으로 바로 이동합니다. 서랍으로 열려 있었다면 이동과 함께 닫힙니다.
        </GuideRow>
        <GuideRow label="색상 의미">
          <div className="guide-legend">
            <span><i className="lg lg-answered" />응답함</span>
            <span><i className="lg lg-blank" />미응답</span>
            <span><i className="lg lg-wrong" />정답 확인했는데 오답</span>
            <span><i className="lg lg-flag" />플래그</span>
            <span><i className="lg lg-current" />현재 문항</span>
          </div>
        </GuideRow>
        <GuideRow label="닫는 방법">
          헤더의 <strong>n / {total}</strong> 버튼을 다시 누르거나, 서랍 바깥의 어두운 영역 또는 ✕ 를 누릅니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="키보드 단축키" hint="시험 화면에서만 동작합니다. 모바일에서는 하단 안내가 숨겨집니다.">
        <GuideRow label={<><Key>1</Key> ~ <Key>5</Key></>}>
          해당 순번의 보기를 선택합니다. 같은 키를 다시 누르면 해제됩니다.
        </GuideRow>
        <GuideRow label={<><Key>←</Key> <Key>→</Key></>}>
          이전 / 다음 문항으로 이동합니다.
        </GuideRow>
        <GuideRow label={<Key>Enter</Key>}>
          다음 문항으로 이동합니다. 단, 버튼이나 입력 요소에 포커스가 있을 때는 그 요소의 원래 동작이 우선합니다.
        </GuideRow>
        <GuideRow label={<Key>F</Key>}>
          현재 문항의 플래그를 켜고 끕니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="결과 화면">
        <GuideRow label="PASS / FAIL">
          {PASS_PERCENT}% 이상이면 PASS입니다. 큰 숫자는 정답률(%)입니다.
        </GuideRow>
        <GuideRow label="도메인별 정답률">
          어느 영역이 약한지 막대로 보여줍니다. <strong>공부 우선순위를 정할 때 이 표를 기준</strong>으로 삼으세요.
        </GuideRow>
        <GuideRow label="오답만 보기">
          체크하면 틀린 문항만 남깁니다. 각 문항마다 내 선택·정답·해설이 함께 표시됩니다.
        </GuideRow>
        <GuideRow label="다시 시험 보기">
          새 시험을 시작합니다. 보기 순서가 다시 섞이므로 같은 문제라도 답 위치가 달라집니다.
        </GuideRow>
        <GuideRow label="언어·글자 크기">
          결과 화면에서도 EN/한글과 글자 크기를 바꿀 수 있어, 영어로 복습하기 편합니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="알아두면 좋은 것">
        <GuideRow label="새로고침해도 안전">
          진행 중인 시험은 브라우저에 자동 저장됩니다. <strong>새로고침하거나 탭을 닫았다 다시 열면 보고 있던
          화면으로 그대로 돌아오고</strong>, 시험 중이었다면 그 문항에서 이어집니다. 홈의{' '}
          <strong>▶ 시험 계속하기</strong>로도 언제든 돌아올 수 있습니다.
        </GuideRow>
        <GuideRow label="실수로 나가지 않게">
          시험이 진행 중일 때 새로고침하거나 탭을 닫으려 하면 <strong>브라우저가 한 번 더 확인</strong>합니다.
          (그대로 나가도 답안은 저장돼 있습니다.)
        </GuideRow>
        <GuideRow label="저장되는 것">
          진행 중인 시험(답안·플래그·경과 시간·현재 문항), 보고 있던 화면과 시험 선택·언어,
          시험 이력(최대 50회), 다크 모드, 글자 크기, 셔플 설정이 브라우저에 저장됩니다.
        </GuideRow>
        <GuideRow label="기기별로 따로">
          서버가 없어 <strong>브라우저·기기마다 기록이 따로 쌓입니다.</strong> 팀원끼리 진도나 이력이 공유되지
          않고, 시크릿 모드나 브라우저 데이터 삭제 시 사라집니다.
        </GuideRow>
      </GuideSection>

      <div className="result-actions">
        <button className="btn-primary" onClick={onHome}>홈으로</button>
        <button className="btn-secondary" onClick={onExamGuide}>시험 가이드 보기</button>
      </div>
    </div>
  )
}
