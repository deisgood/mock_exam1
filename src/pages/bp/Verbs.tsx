import { GuideSection, Part, T } from '../parts'

/** 0. 문서 전체를 관통하는 문법 패턴 */
export default function Verbs() {
  return (
    <>
      <Part
        id="b0"
        tag="SECTION 0"
        title="이 문서 전체를 관통하는 문법 패턴"
        lead="블루프린트 항목이 전부 동사원형으로 시작하는 이유부터 잡고 간다."
      />

      <GuideSection title="동사원형으로 시작하는 이유" hint="Describe sequence of events... / Perform firmware upgrades... / Validate power...">
        <p className="guide-note">
          이건 명령문이 아니라 <strong>"수험자가 할 수 있어야 하는 능력(task statement)"</strong>을 나열하는 기술 문서 관례다.
          앞에 생략된 말은 <em>The candidate should be able to ___</em> 이다.
        </p>
        <T
          head={['동사', '뉘앙스', '시험에서 요구하는 수준']}
          rows={[
            ['Describe', '말로 설명하다', '개념·순서를 알고 있는가 (이론)'],
            ['Identify', '식별하다, 골라내다', '여러 개 중 문제 있는 것을 집어내는가'],
            ['Perform', '수행하다', '실제 절차를 실행할 수 있는가'],
            ['Execute', '(명령·프로그램을) 실행하다', 'Perform보다 "돌린다"에 가까움 (명령어 실행)'],
            ['Run', '돌리다', 'Execute의 구어체. 툴/벤치마크에 주로 씀'],
            ['Configure', '설정하다', '파라미터를 값에 맞게 세팅'],
            ['Validate', '검증하다', '기준에 맞는지 확인 후 판정'],
            ['Verify', '확인하다', '사실인지 대조 확인'],
            ['Confirm', '확정하다', 'Verify와 유사, "맞다고 최종 확인"'],
            ['Install', '설치하다', '물리적 설치 + 소프트웨어 설치 둘 다'],
            ['Demonstrate', '시연하다', '방법을 보여줄 수 있는가'],
          ]}
        />
      </GuideSection>

      <GuideSection title="Validate vs Verify vs Confirm" hint="시험에 자주 나오는 뉘앙스 차이">
        <T
          head={['동사', '핵심 질문', '예']}
          rows={[
            ['Verify', '"이게 사실인가?" 데이터를 대조', 'Verify the firmware version = 버전이 무엇인지 대조'],
            ['Validate', '"이게 요구조건을 만족하는가?" 기준 대비 판정', 'Validate power parameters = 전력이 규격 안에 있는가'],
            ['Confirm', '"최종적으로 맞다" 확정', 'Confirm cabling is correct'],
          ]}
        />
      </GuideSection>
    </>
  )
}
