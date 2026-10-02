import { useMemo } from 'react'
import { ALL_QUESTIONS } from '../data'
import type { Domain } from '../types'
import { DOMAIN_LABEL } from '../data/exams'
import { GuideRow, GuideSection, RefList, type Ref } from './parts'

/** 공식 블루프린트 출제 비중 */
const OFFICIAL_WEIGHT: Record<Domain, number> = { essential: 38, infra: 40, ops: 22 }

/** 도메인별 공식 출제 목표 (블루프린트 항목을 우리말로 정리) */
const OBJECTIVES: Record<Domain, string[]> = {
  essential: [
    'AI 환경에서 쓰이는 NVIDIA 소프트웨어 스택 설명',
    '학습(training)과 추론(inference)의 아키텍처 요구사항 비교',
    'AI · 머신러닝 · 딥러닝 개념 구분',
    '최근 AI가 빠르게 발전하고 확산된 요인 설명',
    '주요 AI 활용 사례와 산업 설명',
    'NVIDIA 솔루션별 목적과 용도 설명',
    'AI 개발·배포 수명주기와 관련된 소프트웨어 구성요소 설명',
    'GPU와 CPU 아키텍처 비교',
  ],
  infra: [
    '특정 AI 학습 워크로드에 필요한 하드웨어 요구사항 파악',
    '용도별 GPU 인프라 확장(scaling)',
    '데이터센터 전력·냉각 요구사항의 핵심 개념과 사양',
    '온프레미스와 클라우드의 장점·과제·고려사항',
    '가속 인프라 클러스터의 핵심 구성요소와 고려사항',
    '시설(facility) 요구사항 파악',
    'AI 워크로드의 네트워킹 요구사항 결정',
    '데이터센터 네트워킹 프로토콜과 핵심 개념',
    '고속 데이터센터 네트워크 옵션과 각각의 용도',
    '데이터센터에서 DPU의 목적과 이점',
  ],
  ops: [
    'AI 데이터센터 관리·모니터링 기본',
    'AI 클러스터 오케스트레이션과 잡 스케줄링 기본',
    'GPU 모니터링의 주요 지표와 판단 기준',
    '가속 인프라를 가상화할 때의 핵심 고려사항',
  ],
}

/** 공식 추천 코스(AI Infrastructure and Operations Fundamentals)의 도메인별 단원 매핑 */
const TRAINING: Record<Domain, string[]> = {
  essential: [
    'Unit 1 — AI Transformation Across Industries',
    'Unit 2 — Introduction to Artificial Intelligence',
    'Unit 4 — Accelerating AI With GPUs',
    'Unit 5 — AI Software Ecosystems',
    'Unit 7 — Compute Platforms for AI',
    'Unit 14 — Orchestration, MLOps, and Job Scheduling',
  ],
  infra: [
    'Unit 4 — Accelerating AI With GPUs',
    'Unit 7.1 — Data Center Platform',
    'Unit 7.4 — Data Center Transformation With NVIDIA DPUs',
    'Unit 8 — Networking for AI',
    'Unit 10 · 11 — Energy-Efficient Computing',
    'Unit 12.4 — AI in the Cloud Considerations',
  ],
  ops: [
    'Unit 5 — AI Software Ecosystem',
    'Unit 8 — Networking for AI',
    'Unit 13 — AI Data Center Management and Monitoring',
    'Unit 14 — Orchestration, MLOps, and Job Scheduling',
  ],
}

/** 공식 Suggested Reading List — 각 자료에서 시험 대비로 챙길 점을 정리 */
const REFS: Record<Domain, Ref[]> = {
  essential: [
    {
      title: 'NVIDIA TensorRT',
      source: 'NVIDIA Developer',
      url: 'https://developer.nvidia.com/tensorrt',
      note: '학습이 끝난 모델을 배포용으로 바꾸는 단계가 무엇인지 — 그래프 최적화, 레이어 퓨전, 저정밀(FP8/INT8) 변환, 커널 자동 튜닝. "TensorRT = 추론 최적화"만 확실히 잡으면 됩니다.',
    },
    {
      title: 'Deep Learning Training vs. Inference: Do You Know the Difference?',
      source: 'Medium',
      note: '학습과 추론의 목적·연산 패턴·하드웨어 요구가 어떻게 갈리는지. 1.2 목표에 직결되고 출제 빈도가 높습니다.',
    },
    {
      title: 'Understanding Machine Learning Inference',
      source: 'Run:ai',
      note: '추론에서 지연(latency)과 처리량(throughput)이 왜 상충하는지, 배치 크기와 서빙 구조의 관계.',
    },
    {
      title: 'Tips on Scaling Storage for AI Training and Inferencing',
      source: 'NVIDIA Technical Blog',
      note: 'GPU를 굶기지 않으려면 스토리지 처리량이 왜 함께 설계되어야 하는지. 데이터 파이프라인 병목 개념으로 Infrastructure 영역과도 이어집니다.',
    },
    {
      title: 'What Is Machine Learning (ML)?',
      source: 'IBM',
      note: '지도·비지도·강화학습 분류와 기본 용어. 1.3 목표의 바탕.',
    },
    {
      title: 'Machine Learning: What It Is and Why It Matters',
      source: 'SAS',
      note: '산업별 ML 활용 사례. 1.5(주요 활용 사례와 산업) 문항 대비용으로 사례를 몇 개 외워두면 좋습니다.',
    },
    {
      title: 'What Are Large Language Models Used For?',
      source: 'NVIDIA Blog',
      note: 'LLM의 정의와 대표 활용처. 생성형 AI 관련 문항의 기본 배경입니다.',
    },
    {
      title: 'NVIDIA GPU Operator: Simplifying GPU Management in Kubernetes',
      source: 'NVIDIA Technical Blog',
      url: 'https://docs.nvidia.com/datacenter/cloud-native/',
      note: '쿠버네티스에 드라이버·컨테이너 툴킷·DCGM을 자동으로 깔아주는 오퍼레이터. Essential과 Operations 양쪽에 걸칩니다.',
    },
    {
      title: "CPU vs. GPU: What's the Difference?",
      source: 'Intel',
      note: '코어 수, 병렬성, 용도 차이. 1.8 목표에 그대로 대응합니다.',
    },
  ],
  infra: [
    {
      title: 'Offloading and Isolating Data Center Workloads With NVIDIA BlueField DPU',
      source: 'NVIDIA Technical Blog',
      url: 'https://www.nvidia.com/en-us/networking/products/data-processing-unit/',
      note: 'DPU가 CPU에서 정확히 어떤 일(네트워킹·스토리지·보안)을 가져가는지, 그리고 테넌트 격리를 어떻게 하드웨어로 보장하는지. 2.10 직결.',
    },
    {
      title: 'NVIDIA DGX SuperPOD Reference Architecture',
      source: 'NVIDIA Docs Hub',
      url: 'https://docs.nvidia.com/dgx-superpod/',
      note: '컴퓨트 노드 · InfiniBand 컴퓨트 패브릭 · 스토리지 · 관리 노드가 어떻게 한 덩어리로 묶이는지. 클러스터 구성요소(2.5) 문항의 표준 답안이 여기 있습니다.',
    },
    {
      title: 'Power Constraints and AI Workloads: The Hidden Challenges of High-Density Data Centers',
      source: 'LinkedIn (NetZero News)',
      note: '기존 데이터센터가 왜 AI 랙을 그대로 받지 못하는지 — 랙당 전력 밀도 급증과 그에 따른 전력·냉각 제약. 2.3 · 2.6 대비.',
    },
    {
      title: 'High-Density Servers: Maximizing Efficiency and Performance in Data Centers',
      source: 'FS',
      note: '랙 밀도, 냉각 방식(공랭 한계 → 액랭), 공간 효율의 트레이드오프.',
    },
    {
      title: 'Introduction to the NVIDIA DGX H100 System',
      source: 'NVIDIA Docs Hub',
      note: '실제 시스템 한 대의 구성 — GPU 수, NVLink/NVSwitch 연결, 네트워크 포트. 추상적인 개념을 구체적인 숫자로 붙잡을 수 있습니다.',
    },
    {
      title: 'InfiniBand Key Features',
      source: 'NVIDIA Academy',
      note: '무손실(lossless) 전송, 저지연, 적응형 라우팅, SHARP 인네트워크 연산. 이더넷/RoCE와의 비교 문항에서 핵심 근거가 됩니다.',
    },
    {
      title: 'Modernizing GPU Network Data Transfer With NVIDIA NVSwitch',
      source: 'AMAX',
      note: 'NVLink/NVSwitch가 PCIe 대비 무엇이 다른지. "노드 안 = NVLink, 노드 사이 = IB/이더넷" 구분을 확실히 하세요.',
    },
    {
      title: 'Accelerating IO in the Modern Data Center: Network IO',
      source: 'NVIDIA Technical Blog',
      note: 'RDMA와 GPUDirect가 CPU·시스템 메모리를 우회해 IO 경로를 줄이는 원리. 2.7 · 2.8 대비.',
    },
  ],
  ops: [
    {
      title: 'NVIDIA DCGM',
      source: 'NVIDIA Developer',
      url: 'https://docs.nvidia.com/datacenter/dcgm/latest/',
      note: 'GPU 원격측정·헬스체크·진단 도구. 어떤 지표를 수집하는지(사용률·메모리·온도·전력·ECC·XID)와 Prometheus 연동 방식. 3.1 · 3.3 직결.',
    },
    {
      title: 'NVIDIA Multi-Instance GPU (MIG)',
      source: 'NVIDIA',
      url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/index.html',
      note: 'GPU 한 장을 하드웨어로 격리된 인스턴스로 분할 — Ampere 이상에서 최대 7개까지. 작은 워크로드가 많을 때 활용률을 올리는 대표 수단입니다.',
    },
    {
      title: '6 Reasons for Low GPU Utilization and How to Improve It',
      source: 'Run:ai',
      note: '활용률이 낮은 원인은 대개 GPU가 아니라 주변 — 데이터 로딩, 작은 배치, CPU 전처리, 통신 오버헤드, 스케줄링. 3.3에서 자주 나옵니다.',
    },
    {
      title: 'Slurm Workload Manager — Overview',
      source: 'SchedMD',
      url: 'https://slurm.schedmd.com/overview.html',
      note: 'HPC 배치 스케줄러의 큐·파티션·자원 할당(GRES) 개념. GPU를 잡에 어떻게 배정하는지.',
    },
    {
      title: 'Kubernetes Documentation',
      source: 'Kubernetes',
      url: 'https://kubernetes.io/docs/',
      note: '파드·노드·스케줄러의 기본 동작. Slurm과의 역할 차이(배치 잡 vs 서비스형 컨테이너)를 설명할 수 있어야 합니다.',
    },
    {
      title: 'What Is a Container?',
      source: 'Docker',
      url: 'https://www.docker.com/resources/what-container/',
      note: '컨테이너와 가상머신의 차이, 이미지와 격리. AI 배포가 왜 컨테이너 표준으로 갔는지.',
    },
    {
      title: "Let's Explore the Importance of Job Scheduling in a Cloud Environment",
      source: 'Samsung SDS',
      note: '잡 스케줄링이 자원 활용률과 대기 시간에 미치는 영향. 3.2의 배경.',
    },
    {
      title: 'Baseboard Management Controller',
      source: 'NVIDIA Docs Hub',
      note: 'BMC가 OS와 무관하게 동작하는 이유와 할 수 있는 일 — 전원 제어, 펌웨어 업데이트, 원격 콘솔.',
    },
    {
      title: 'Out-of-Band Management Networks',
      source: 'Dell Technologies',
      note: '관리망을 서비스망과 물리적으로 분리하는 이유. 장애 상황에서도 접근 가능해야 한다는 것이 요점입니다.',
    },
    {
      title: 'NVIDIA Base Command',
      source: 'NVIDIA',
      note: '클러스터에서 AI 학습 워크로드를 제출·관리하는 플랫폼. 이름과 용도만 매칭할 수 있으면 충분합니다.',
    },
  ],
}

/** 시험 전에 깔고 가야 할 기본기 */
const BASICS: [string, string][] = [
  [
    '데이터센터 물리 구성',
    '랙과 U 단위, PDU와 전력 공급 이중화, 냉복도/열복도(hot/cold aisle), 바닥 하중. AI 랙은 일반 서버 랙보다 훨씬 무겁고 전기를 많이 먹는다는 감각이 필요합니다.',
  ],
  [
    '서버 구성요소',
    'CPU · 메모리 · NIC · 스토리지가 PCIe로 연결되는 구조. GPU도 PCIe에 꽂히지만, GPU끼리는 NVLink라는 별도 경로로 직접 이어진다는 점이 핵심 차이입니다.',
  ],
  [
    '네트워크 기본',
    '대역폭(Gb/s)과 지연(µs)은 별개입니다. 스위치·토폴로지(leaf-spine), 동/서 트래픽, 오버서브스크립션 개념을 알아야 "AI 학습에는 왜 논블로킹 패브릭이 필요한가"를 답할 수 있습니다.',
  ],
  [
    '가상화 vs 컨테이너',
    'VM은 게스트 OS까지 통째로 가상화하고, 컨테이너는 호스트 커널을 공유합니다. 그래서 컨테이너가 가볍고 시작이 빠릅니다. GPU는 패스스루·vGPU·MIG 등 여러 방식으로 나눠 쓸 수 있습니다.',
  ],
  [
    '리눅스와 CLI',
    'AI 인프라는 사실상 전부 리눅스입니다. 프로세스·파일시스템·SSH·패키지 관리 정도의 기본기와 `nvidia-smi`로 GPU 상태를 읽는 법은 알고 가세요.',
  ],
  [
    '클라우드 기본',
    'IaaS/PaaS/SaaS 구분, CapEx(자본지출)와 OpEx(운영비용)의 차이. 온프렘 vs 클라우드 비교 문항이 결국 이 축에서 갈립니다.',
  ],
  [
    'AI 워크플로',
    '데이터 수집·정제 → 학습 → 평가 → 최적화 → 배포 → 모니터링 → 재학습. 각 단계에 붙는 도구를 하나씩 연결해두면 소프트웨어 문항이 쉬워집니다.',
  ],
  [
    '단위 감각',
    'TFLOPS(연산), GB/s(대역폭), kW(전력), µs와 ms(지연)의 자릿수 감각. 숫자 자체를 외울 필요는 없지만 "이 값이 큰 건지 작은 건지"는 판단할 수 있어야 합니다.',
  ],
]

export default function ExamGuide({
  onHome,
  onUsage,
}: {
  onHome: () => void
  onUsage: () => void
}) {
  const counts = useMemo(() => {
    const c: Record<Domain, number> = { infra: 0, essential: 0, ops: 0 }
    ALL_QUESTIONS.forEach((q) => c[q.domain]++)
    return c
  }, [])
  const total = ALL_QUESTIONS.length
  const order: Domain[] = ['infra', 'essential', 'ops']

  return (
    <div className="container guide">
      <header className="home-header">
        <div className="badge">NVIDIA-Certified Associate</div>
        <h1>시험 가이드 · 핵심 개념</h1>
        <p className="subtitle">NCA-AIIO 공식 블루프린트 기반 정리</p>
      </header>

      <GuideSection title="시험 개요">
        <GuideRow label="자격증">
          NVIDIA-Certified Associate: AI Infrastructure and Operations (<strong>NCA-AIIO</strong>) —
          AI 인프라·운영의 기초 개념을 검증하는 입문(Associate) 등급입니다.
        </GuideRow>
        <GuideRow label="문항 / 시간">
          <strong>50문항 · 60분</strong> (문항당 72초)
        </GuideRow>
        <GuideRow label="응시 방식">
          온라인 · 원격 감독(proctored). 응시하려면 <strong>Certiverse 계정</strong>이 필요합니다.
        </GuideRow>
        <GuideRow label="응시료 / 언어">
          $125 · 영어
        </GuideRow>
        <GuideRow label="사전 요구사항">
          데이터센터 인프라에 대한 기본적인 이해
        </GuideRow>
        <GuideRow label="유효기간">
          발급일로부터 <strong>2년</strong>. 갱신은 재응시로 합니다.
        </GuideRow>
        <GuideRow label="합격 시">
          디지털 배지와 (선택) 인증서가 발급됩니다.
        </GuideRow>
        <GuideRow label="대상 직무">
          데이터센터 기술자, DevOps·네트워킹 엔지니어, IT 관리자, 시스템 관리자, 솔루션·시스템 아키텍트,
          기술 영업 및 프로페셔널 서비스 엔지니어 등
        </GuideRow>
        <p className="guide-note">
          응시 전에 NVIDIA 시험 정책(examination policy)을 확인하세요. 위 정보는 공식 인증 페이지 기준이며,
          응시료·정책은 변경될 수 있으니 등록 시점에 다시 확인하시기 바랍니다.
        </p>
      </GuideSection>

      <GuideSection
        title="공식 직무 정의"
        hint="스터디 가이드가 밝힌 대상자와 기대 역량입니다. 문항의 눈높이가 여기서 결정됩니다."
      >
        <GuideRow label="누구를 위한 시험인가">
          <strong>AI 운영·인프라를 처음 접하는 IT 전문가</strong>가 대상입니다. 데이터센터와 온프레미스
          환경에서 AI를 도입할 때 필요한 구성요소를 <strong>설명할 수 있는 수준</strong>을 요구합니다 —
          직접 구축하고 튜닝하는 능력이 아니라, 무엇이 왜 필요한지 말할 수 있느냐를 봅니다.
        </GuideRow>
        <GuideRow label="기대 역량">
          <ul className="guide-list">
            <li>AI 워크로드와 활용 사례 이해</li>
            <li>AI와 머신러닝 개념 구분</li>
            <li>AI에 특화된 데이터센터 운영의 핵심 개념 설명</li>
            <li>AI 환경의 네트워킹 요구사항에 대한 기본 이해</li>
            <li>GPU·DPU가 CPU 아키텍처와 어떻게 다른지 확실히 이해</li>
            <li>전문 관리자와 협업하여 AI 데이터센터 운영에 기여</li>
            <li>클러스터 오케스트레이션·관리, 잡 스케줄링, 모니터링 기본</li>
            <li>가상화 환경에서의 AI 워크로드 활용 방법 설명</li>
            <li>AI 배포에 쓰이는 NVIDIA 소프트웨어·하드웨어 이해</li>
          </ul>
        </GuideRow>
        <GuideRow label="권장 배경">
          컴퓨터공학·소프트웨어공학·AI 관련 학위, 엔터프라이즈 데이터센터 및 온프레미스 컴퓨트 환경 경험,
          AI·머신러닝 개념에 대한 탄탄한 이해. <strong>필수는 아니고 권장 사항</strong>입니다.
        </GuideRow>
      </GuideSection>

      <GuideSection
        title="기초 다지기"
        hint="도메인 공부에 들어가기 전에 이 정도는 깔려 있어야 문항이 읽힙니다."
      >
        {BASICS.map(([k, v]) => (
          <GuideRow key={k} label={k}>
            {v}
          </GuideRow>
        ))}
        <p className="guide-note">
          공식 사전 요구사항은 <strong>“데이터센터 인프라에 대한 기본적인 이해”</strong> 하나뿐입니다.
          위 항목 중 절반 이상이 낯설다면 문제부터 풀기보다 추천 코스를 먼저 듣는 편이 빠릅니다.
        </p>
      </GuideSection>

      <GuideSection
        title="출제 비중"
        hint="공식 블루프린트 비중과 이 앱의 문제 분포를 나란히 비교했습니다."
      >
        {order.map((d) => {
          const appPct = Math.round((counts[d] / total) * 1000) / 10
          return (
            <div key={d} className="domain-bar-row">
              <div className="domain-bar-head">
                <span><span className={`dot dot-${d}`} /> {DOMAIN_LABEL[d]}</span>
                <span>
                  공식 <strong>{OFFICIAL_WEIGHT[d]}%</strong> · 이 앱 {counts[d]}문항 ({appPct}%)
                </span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill bar-${d}`} style={{ width: `${OFFICIAL_WEIGHT[d]}%` }} />
              </div>
            </div>
          )
        })}
        <p className="guide-note">
          이 앱의 분포는 공식 비중과 거의 일치합니다. 따라서 <strong>결과 화면의 도메인별 정답률을 실제 시험
          점수의 대리 지표로 봐도 무리가 없습니다.</strong> 비중이 큰 AI Infrastructure와 Essential AI
          Knowledge에서 점수를 잃으면 타격이 큽니다.
        </p>
      </GuideSection>

      {order.map((d) => (
        <GuideSection key={d} title={`출제 목표 — ${DOMAIN_LABEL[d]} (${OFFICIAL_WEIGHT[d]}%)`}>
          <ul className="guide-list">
            {OBJECTIVES[d].map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </GuideSection>
      ))}

      <GuideSection
        title="핵심 개념 — Essential AI Knowledge"
        hint="개념의 정의와 서로 간의 차이를 묻는 문항이 많습니다."
      >
        <GuideRow label="AI · ML · DL">
          포함 관계입니다. AI ⊃ 머신러닝 ⊃ 딥러닝. 머신러닝은 데이터로 규칙을 학습하고, 딥러닝은 다층 신경망을
          써서 <strong>특징(feature)을 사람이 설계하지 않고 스스로 뽑아냅니다.</strong> 대신 데이터와 연산이 훨씬
          많이 필요해 GPU가 필수가 됩니다.
        </GuideRow>
        <GuideRow label="학습 vs 추론">
          <strong>학습</strong>은 대규모 배치·역전파·높은 정밀도(FP32/TF32/BF16)가 필요하고, 여러 GPU와 고속
          인터커넥트를 쓰며 며칠~몇 주 걸립니다. <strong>추론</strong>은 낮은 지연과 높은 처리량이 관건이고,
          저정밀(FP8/INT8) 양자화로 GPU 한 장이나 엣지에서도 돌릴 수 있습니다.
        </GuideRow>
        <GuideRow label="GPU vs CPU">
          CPU는 코어 수가 적지만 각각 강력해 분기가 많은 <strong>직렬 처리와 낮은 지연</strong>에 유리합니다.
          GPU는 단순한 코어 수천 개로 같은 연산을 동시에 수행(SIMT)해 <strong>대규모 병렬 처리와 높은 메모리
          대역폭</strong>에 유리합니다. 행렬 곱이 핵심인 딥러닝이 GPU에 잘 맞는 이유입니다.
        </GuideRow>
        <GuideRow label="소프트웨어 스택">
          아래에서 위로 — <strong>드라이버 → CUDA → 라이브러리(cuDNN·cuBLAS·NCCL) → 프레임워크(PyTorch·
          TensorFlow) → 애플리케이션</strong>. 컨테이너·모델·헬름 차트는 <strong>NGC</strong> 카탈로그에서
          받고, 엔터프라이즈 지원이 붙은 묶음이 <strong>NVIDIA AI Enterprise</strong>입니다.
        </GuideRow>
        <GuideRow label="주요 솔루션">
          <strong>TensorRT</strong> 추론 최적화(양자화·레이어 퓨전) · <strong>Triton</strong> 여러 모델과
          프레임워크를 한 서버에서 서빙 · <strong>RAPIDS</strong> GPU 가속 데이터 사이언스(cuDF·cuML) ·
          <strong>NeMo</strong> 생성형 AI·LLM 개발 · <strong>Base Command</strong> 클러스터 학습 워크로드 관리 ·
          <strong>Omniverse</strong> 3D 시뮬레이션. 각각 "무엇을 하는 도구인지" 한 줄로 답할 수 있어야 합니다.
        </GuideRow>
        <GuideRow label="AI 급성장 요인">
          데이터 폭증, GPU 연산 성능 향상, 알고리즘 발전(특히 트랜스포머), 사전학습 모델과 오픈소스 생태계,
          클라우드로 낮아진 진입 장벽 — 이 다섯 축으로 묶어 외우면 됩니다.
        </GuideRow>
        <GuideRow label="개발 수명주기">
          데이터 수집·준비 → 학습 → 최적화 → 배포 → 모니터링·재학습. 각 단계에 어떤 도구가 붙는지(예: 배포에
          Triton, 모니터링에 DCGM) 연결해 두세요.
        </GuideRow>
      </GuideSection>

      <GuideSection
        title="핵심 개념 — AI Infrastructure"
        hint="비중이 가장 큰 영역입니다. 네트워킹과 전력·냉각에서 실점이 많습니다."
      >
        <GuideRow label="시스템 라인업">
          <strong>DGX</strong> 검증된 턴키 AI 시스템 · <strong>HGX</strong> OEM이 서버에 얹는 GPU 베이스보드 ·
          <strong>EGX</strong> 엣지용 · <strong>DGX SuperPOD</strong> 대규모 클러스터를 위한 검증된 레퍼런스
          아키텍처.
        </GuideRow>
        <GuideRow label="NVLink / NVSwitch">
          <strong>노드 안에서</strong> GPU끼리 직접 잇는 고대역폭 링크입니다. PCIe보다 훨씬 빠르고, NVSwitch는
          이를 스위칭해 모든 GPU가 전대역으로 통신하게 합니다. 대형 모델을 여러 GPU에 쪼개 올릴 때 필수입니다.
        </GuideRow>
        <GuideRow label="InfiniBand vs 이더넷/RoCE">
          <strong>InfiniBand</strong>는 저지연·무손실이 기본이고 SHARP 같은 인네트워크 연산을 지원해 대규모
          학습에 유리합니다. <strong>RoCE</strong>는 이더넷 위에서 RDMA를 구현해 기존 인프라와 운영 경험을
          그대로 쓸 수 있는 것이 장점입니다. "노드 <em>사이</em>는 IB/RoCE, 노드 <em>안</em>은 NVLink"로
          구분하세요.
        </GuideRow>
        <GuideRow label="GPUDirect">
          GPU 메모리와 NIC·스토리지가 <strong>CPU와 시스템 메모리를 거치지 않고 직접</strong> 데이터를
          주고받게 합니다. 지연과 CPU 부하가 크게 줄어듭니다.
        </GuideRow>
        <GuideRow label="DPU (BlueField)">
          네트워킹·스토리지·보안 같은 <strong>인프라 작업을 CPU에서 떼어내 전담 처리</strong>합니다. CPU 코어를
          애플리케이션에 온전히 돌려주고, 테넌트 간 격리와 제로 트러스트 보안을 하드웨어 수준에서 제공합니다.
        </GuideRow>
        <GuideRow label="전력 · 냉각">
          GPU 랙은 밀도가 높아 랙당 수십 kW를 넘어섭니다. 일정 밀도를 넘으면 <strong>공랭으로는 한계라 액랭
          (direct liquid cooling)</strong>으로 갑니다. 전력 효율 지표는 <strong>PUE</strong>이고,
          이 값이 1에 가까울수록 효율적입니다. 전력·냉각·바닥 하중은 시설(facility) 요구사항으로 함께 묶입니다.
        </GuideRow>
        <GuideRow label="온프레미스 vs 클라우드">
          온프레미스는 초기 투자(CapEx)가 크지만 <strong>가동률이 높으면 장기 TCO가 유리</strong>하고 데이터
          주권·규제 대응에 강합니다. 클라우드는 OpEx 기반이라 빠르게 시작하고 탄력적으로 늘릴 수 있지만 장기
          대규모 사용 시 비용이 커집니다. 하이브리드로 절충하기도 합니다.
        </GuideRow>
        <GuideRow label="클러스터 구성요소">
          컴퓨트 노드, 고속 인터커넥트, 공유 스토리지, 관리·프로비저닝 노드, 그리고 <strong>목적별로 분리된
          네트워크</strong>(컴퓨트·스토리지·관리/대역 외). 학습 데이터를 GPU에 끊김 없이 공급하려면 스토리지
          처리량도 함께 설계해야 합니다.
        </GuideRow>
      </GuideSection>

      <GuideSection
        title="핵심 개념 — AI Operations"
        hint="비중은 가장 작지만 용어만 알면 확실히 챙길 수 있는 영역입니다."
      >
        <GuideRow label="DCGM">
          NVIDIA의 GPU 관리·모니터링 도구입니다. 사용률, 메모리, 온도, 전력, ECC 오류, XID 같은 원격측정과
          헬스 체크를 제공하고 Prometheus·Grafana와 연동합니다.
        </GuideRow>
        <GuideRow label="주요 GPU 지표">
          GPU 사용률과 SM 점유율, 메모리 사용량·대역폭, 전력, 온도와 <strong>스로틀링 여부</strong>, ECC 오류.
          사용률이 높다고 잘 쓰는 것은 아니라는 점이 자주 나옵니다.
        </GuideRow>
        <GuideRow label="낮은 GPU 활용률">
          대개 GPU가 아니라 <strong>주변이 병목</strong>입니다 — 데이터 로딩·전처리 지연, 너무 작은 배치 크기,
          CPU 병목, 분산 학습의 통신 오버헤드, 잘못된 스케줄링.
        </GuideRow>
        <GuideRow label="Slurm vs Kubernetes">
          <strong>Slurm</strong>은 HPC 계열의 배치 잡 스케줄러로 큐·자원 할당(GRES)에 강합니다.
          <strong>Kubernetes</strong>는 컨테이너 오케스트레이터로 서비스형 워크로드에 강하고,
          <strong>GPU Operator</strong>가 드라이버·디바이스 플러그인·모니터링 설치를 자동화합니다.
        </GuideRow>
        <GuideRow label="MIG">
          A100·H100 등에서 <strong>GPU 하나를 하드웨어로 격리된 여러 인스턴스로 분할</strong>합니다. 작은
          워크로드가 여러 개일 때 활용률이 크게 올라가고, 인스턴스 간 성능 간섭이 없습니다.
        </GuideRow>
        <GuideRow label="vGPU와 가상화">
          가상 머신들이 GPU를 나눠 쓰게 합니다. MIG가 하드웨어 파티셔닝이라면 vGPU는 주로 시간 분할 기반이고,
          둘을 조합할 수도 있습니다. 가상화 시에는 오버헤드, 패스스루 여부, 라이선스를 함께 고려합니다.
        </GuideRow>
        <GuideRow label="컨테이너">
          <strong>NVIDIA Container Toolkit</strong>이 컨테이너에 GPU와 드라이버를 주입합니다. 환경 재현성이
          좋아져 AI 배포의 표준이 되었습니다.
        </GuideRow>
        <GuideRow label="BMC / 대역 외 관리">
          <strong>BMC</strong>는 OS와 무관하게 동작하는 관리 컨트롤러로, <strong>OOB(대역 외) 네트워크</strong>를
          통해 전원 제어·펌웨어 업데이트·콘솔 접근을 원격으로 수행합니다. 서비스 네트워크와 분리하는 것이 원칙입니다.
        </GuideRow>
      </GuideSection>

      <GuideSection
        title="추천 교육 (Recommended Training)"
        hint="공식 스터디 가이드가 지정한 코스와 도메인별 단원 매핑입니다."
      >
        <GuideRow label="코스">
          <strong>AI Infrastructure and Operations Fundamentals</strong> — 자기주도형, 약 7시간.
          Introduction to AI · AI Infrastructure · AI Operations 세 모듈로 구성되며 블루프린트가 이 코스의
          단원과 그대로 매핑됩니다.{' '}
          <a href="https://www.coursera.org/learn/ai-infrastructure-operations-fundamentals" target="_blank" rel="noreferrer">
            Coursera에서 수강 ↗
          </a>
        </GuideRow>
        {order.map((d) => (
          <GuideRow key={d} label={DOMAIN_LABEL[d]}>
            <ul className="guide-list">
              {TRAINING[d].map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </GuideRow>
        ))}
        <GuideRow label="공식 문서">
          <a href="https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate" target="_blank" rel="noreferrer">
            NCA-AIIO 인증 페이지 ↗
          </a>
          {' · '}
          <a href="https://www.nvidia.com/en-us/learn/certification/" target="_blank" rel="noreferrer">
            NVIDIA 인증 프로그램 전체 ↗
          </a>
          {' · '}
          <a href="https://www.nvidia.com/en-us/training/" target="_blank" rel="noreferrer">
            NVIDIA DLI 교육 ↗
          </a>
          <br />
          인증 페이지의 <strong>Exam Study Guide</strong> PDF에 원문 목표와 참고문헌이 실려 있습니다.
        </GuideRow>
      </GuideSection>

      {order.map((d) => (
        <GuideSection
          key={d}
          title={`참고 문헌 — ${DOMAIN_LABEL[d]}`}
          hint="공식 Suggested Reading List. 각 항목 아래는 시험 대비로 무엇을 챙기면 되는지입니다."
        >
          <RefList items={REFS[d]} />
        </GuideSection>
      ))}

      <GuideSection title="참고 문헌 읽는 순서">
        <GuideRow label="시간이 없다면">
          <strong>CPU vs GPU</strong> → <strong>Training vs Inference</strong> →{' '}
          <strong>InfiniBand Key Features</strong> → <strong>DCGM</strong> →{' '}
          <strong>6 Reasons for Low GPU Utilization</strong>. 이 다섯 개가 출제 목표와 가장 촘촘히 겹칩니다.
        </GuideRow>
        <GuideRow label="개념이 안 잡힌다면">
          IBM·SAS·Intel·Docker 자료처럼 <strong>벤더 중립적인 입문 글</strong>부터 읽으세요. NVIDIA 문서는
          제품 이름이 많아 기초가 없으면 오히려 헷갈립니다.
        </GuideRow>
        <GuideRow label="구성이 안 그려진다면">
          <strong>DGX SuperPOD 레퍼런스 아키텍처</strong>의 구성도 한 장을 보고, 컴퓨트·스토리지·관리·
          인터커넥트가 각각 어디에 붙는지 손으로 그려보세요. Infrastructure 영역 문항의 절반이 이 그림 안에
          있습니다.
        </GuideRow>
        <GuideRow label="링크가 없는 항목">
          공식 URL을 확인하지 못한 자료는 링크를 걸지 않았습니다. <strong>제목 + 출처</strong>로 검색하면
          바로 나옵니다.
        </GuideRow>
      </GuideSection>

      <GuideSection title="학습 전략">
        <GuideRow label="우선순위">
          비중 순서대로 <strong>AI Infrastructure(40%) → Essential AI Knowledge(38%) → AI Operations(22%)</strong>.
          앞의 둘이 78%라 여기서 무너지면 만회가 어렵습니다.
        </GuideRow>
        <GuideRow label="영어로 풀기">
          실제 시험은 영어입니다. 이 앱도 기본값이 EN이니 <strong>먼저 영어로 풀고, 막힌 문항만 한글로 확인</strong>
          하세요. 용어의 영어 표기에 익숙해지는 것 자체가 대비입니다.
        </GuideRow>
        <GuideRow label="시간 감각">
          실제 시험은 문항당 72초입니다. <strong>이 앱에는 시간제한이 없으니</strong> 헤더의 ⏱ 경과 시간으로
          스스로 페이스를 재보세요. 모르는 문항은 <strong>⚑ 플래그를 걸고 넘어간 뒤</strong> 문제 현황에서
          되돌아오는 습관을 들이면 됩니다.
        </GuideRow>
        <GuideRow label="복습 루프">
          채점 후 <strong>오답만 보기</strong>로 해설을 읽고, 결과 화면의 도메인별 정답률에서 가장 낮은 영역을
          위 핵심 개념으로 다시 훑는 순환이 가장 효율적입니다.
        </GuideRow>
        <GuideRow label="합격선">
          이 앱의 합격선은 70%로 잡혀 있습니다. 실제 시험의 커트라인은 공개되지 않으므로,
          <strong>여유 있게 80% 이상</strong>을 목표로 삼기를 권합니다.
        </GuideRow>
      </GuideSection>

      <div className="result-actions">
        <button className="btn-primary" onClick={onHome}>홈으로</button>
        <button className="btn-secondary" onClick={onUsage}>사용법 보기</button>
      </div>
    </div>
  )
}
