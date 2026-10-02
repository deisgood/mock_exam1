import { Cmd, GuideSection, Part, T } from '../parts'

/** 부록 A 표 읽는 영어 · 부록 B 고빈도 어휘 40 · 부록 C 선택지 신호어 */
export default function Appx() {
  return (
    <>
      <Part
        id="ba"
        tag="부록 A"
        title="블루프린트 표 자체를 읽는 영어"
        lead="시험 안내문·표 헤더에서 반복되는 압축 표현을 문장 구조 단위로 분해한다."
      />

      <GuideSection title="원문 문장 해부" hint='"The table below provides an overview of the topic areas covered in the certification exam and how much of the exam is focused on that subject."'>
        <Cmd>{`[The table below] provides [an overview of A and B]
   주어              동사        목적어

A = the topic areas [covered in the certification exam]   ← 과거분사구가 topic areas를 수식
B = how much of the exam is focused on that subject       ← 간접의문문이 명사절로 of의 목적어`}</Cmd>
        <T
          head={['표현', '의미']}
          rows={[
            ['the table below', '아래의 표 (below가 명사 뒤에서 수식)'],
            ['provide an overview of', '~의 개요를 제공하다'],
            ['topic area', '주제 영역'],
            ['covered in', '~에서 다뤄지는'],
            ['be focused on', '~에 집중되다'],
            ['% of Exam', '시험 비중'],
          ]}
        />
        <p className="guide-note">
          <strong>"Topics Covered"</strong> = 다뤄지는 주제들. <em>Topics (that are) covered</em>에서 관계사 + be동사가
          생략된 형태. 표 헤더에서 매우 흔한 압축 표기.
        </p>
      </GuideSection>

      <Part
        id="bb"
        tag="부록 B"
        title="시험 지문에서 반복될 고빈도 어휘 40"
        lead="지문 자체를 빠르게 넘기기 위한 어휘. 뜻이 아니라 '보면 즉시 지나갈 수 있는' 수준을 목표로 한다."
      />

      <GuideSection title="고빈도 어휘 40" hint="좌우 두 쌍씩 대응해 외운다">
        <T
          head={['영어', '한글', '영어', '한글']}
          rows={[
            ['prior to', '~에 앞서', 'subsequently', '그 후에'],
            ['ensure', '반드시 ~하게 하다', 'verify', '확인하다'],
            ['in order to', '~하기 위해', 'so as to', '~하도록'],
            ['given that', '~라는 점을 감안하면', 'provided that', '~라는 조건 하에'],
            ['with respect to', '~에 관하여', 'in terms of', '~의 측면에서'],
            ['be responsible for', '~을 담당하다', 'be required to', '~해야 한다'],
            ['adhere to', '(규정을) 준수하다', 'comply with', '준수하다'],
            ['mitigate', '완화하다', 'remediate', '시정하다'],
            ['escalate', '상위로 넘기다', 'isolate', '격리하다'],
            ['leverage', '활용하다', 'utilize', '이용하다'],
            ['deprecated', '더 이상 권장되지 않는', 'obsolete', '구식의'],
            ['mandatory', '필수의', 'optional', '선택적인'],
            ['prerequisite', '선행 조건', 'dependency', '의존성'],
            ['consistent', '일관된', 'consistently', '일관되게'],
            ['respectively', '각각', 'accordingly', '그에 따라'],
            ['threshold', '임계값', 'tolerance', '허용 오차'],
            ['baseline', '기준선', 'benchmark', '기준 성능 측정'],
            ['granularity', '세분성', 'overhead', '부가 비용'],
            ['concurrent', '동시적인', 'sequential', '순차적인'],
            ['idle', '유휴 상태의', 'saturated', '포화된'],
          ]}
        />
      </GuideSection>

      <Part
        id="bc"
        tag="부록 C"
        title="선택지 문제에서 답을 가르는 신호어"
        lead="같은 지문에서도 이 한 단어가 정답을 바꾼다. EXCEPT/NOT이 최다 실수 지점."
      />

      <GuideSection title="신호어 표" hint="문제를 읽을 때 먼저 표시하고 시작한다">
        <T
          head={['신호어', '의미', '주의점']}
          rows={[
            ['BEST', '가장 적절한', '여러 개가 맞아 보여도 최적 하나'],
            ['MOST likely', '가장 유력한', '확률적 판단을 요구'],
            ['FIRST', '가장 먼저', '순서를 묻는 것. 정답도 오답도 다 유효한 조치'],
            ['NEXT', '다음으로', '앞 단계는 이미 했다고 가정'],
            ['EXCEPT / NOT', '제외하고 / 아닌 것', '틀린 것을 고르는 문제. 최다 실수 지점'],
            ['primary purpose', '주된 목적', '부수 효과가 아닌 본래 목적'],
            ['minimum requirement', '최소 요구사항', '충분조건 아님'],
            ['Which two...', '두 개를 고르시오', '개수 지정 확인 필수'],
            ['regardless of', '~와 무관하게', '조건 무효화'],
            ['assuming', '~라고 가정하면', '가정을 반드시 반영'],
          ]}
        />
        <p className="guide-note">
          전형적 문제 문장: <em>An administrator observes intermittent NCCL bandwidth degradation on a single node. Which
          action should be performed FIRST?</em> → FIRST이므로 "케이블 교체"(조치)가 아니라 "mlxlink로 링크 카운터/BER
          확인"(진단)이 정답일 가능성이 높다. <strong>진단 → 격리 → 조치</strong> 순서가 이 시험의 사고 방식이다.
        </p>
      </GuideSection>
    </>
  )
}
