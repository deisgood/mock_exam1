import { useState } from 'react'
import { GuideSection, Part, T } from './parts'

/** 원문 PDF (NVIDIA 배포본) */
const SOURCE_PDF =
  'https://nvdam.widen.net/s/grnbg9hbdw/nvt-certification-study-guide-ncp-ai-infrastructure-3770919-r2-web'
const CERT_HOME = 'https://www.nvidia.com/en-us/learn/certification/'

type Lang = 'en' | 'ko'

/** 읽을거리 한 줄. url이 없으면 제목으로 검색 링크를 만든다 */
interface Reading {
  title: string
  url?: string
}

function ReadingList({ items, lang }: { items: Reading[]; lang: Lang }) {
  return (
    <ul className="sg-readings">
      {items.map((r) => {
        const direct = Boolean(r.url)
        const href = r.url ?? `https://www.google.com/search?q=${encodeURIComponent('NVIDIA ' + r.title)}`
        return (
          <li key={r.title}>
            <a href={href} target="_blank" rel="noreferrer">
              {r.title}
            </a>{' '}
            <span className="sg-linktag">{direct ? '↗ docs' : lang === 'en' ? '🔎 search' : '🔎 검색'}</span>
          </li>
        )
      })}
    </ul>
  )
}

/** 도메인 한 개 */
interface Domain {
  id: string
  weight: string
  en: { title: string; intro: string; tasks: string[]; training: string[] }
  ko: { title: string; intro: string; tasks: string[]; training: string[] }
  readings: Reading[]
}

const DOMAINS: Domain[] = [
  {
    id: 'sg1',
    weight: '31%',
    en: {
      title: 'Systems and Server Bring-Up',
      intro:
        'These tasks involve end-to-end hardware deployment: rack, power, BMC, security, firmware, physical installation, initial server and network setup, cable validation, and hardware verification for AI workloads. Ensures all components are correctly deployed, configured, and operational before scaling AI operations.',
      tasks: [
        '1.1 Describe the sequence of events for deployment and validation',
        '1.2 Describe network topologies for AI Factories',
        '1.3 Perform initial configuration of BMC, OOB, and TPM',
        '1.4 Perform firmware upgrades (including on NVIDIA HGX systems) and fault detection',
        '1.5 Validate power and cooling parameter',
        '1.6 Install GPU-based servers (SMI)',
        '1.7 Validate installed hardware',
        '1.8 Describe and validate cable types and transceivers',
        '1.9 Install physical GPUs',
        '1.10 Validate hardware operation for workloads',
        '1.11 Configure initial parameters for third party storage',
      ],
      training: [
        'AI in the Data Center Overview',
        'Compute Platforms for AI',
        'BlueField Networking Platform – Overview, Bring-Up, Firmware, Management',
        'AI Data Center Management',
        'Practice: Bringing Up an AI cluster With BCM',
      ],
    },
    ko: {
      title: '시스템·서버 브링업',
      intro:
        '엔드투엔드 하드웨어 배포 전반 — 랙·전력·BMC·보안·펌웨어·물리 설치·서버와 네트워크 초기 설정·케이블 검증, 그리고 AI 워크로드를 위한 하드웨어 확인까지 포함한다. AI 운영을 확장하기 전에 모든 구성요소가 올바르게 배포·구성·동작하도록 보장하는 단계다.',
      tasks: [
        '1.1 배포와 검증의 이벤트 순서를 설명한다',
        '1.2 AI 팩토리의 네트워크 토폴로지를 설명한다',
        '1.3 BMC · OOB · TPM 초기 구성을 수행한다',
        '1.4 펌웨어 업그레이드(NVIDIA HGX 시스템 포함)와 결함 탐지를 수행한다',
        '1.5 전력·냉각 파라미터를 검증한다',
        '1.6 GPU 기반 서버를 설치한다 (SMI)',
        '1.7 설치된 하드웨어를 검증한다',
        '1.8 케이블 유형과 트랜시버를 설명하고 검증한다',
        '1.9 물리 GPU를 장착한다',
        '1.10 워크로드 관점에서 하드웨어 동작을 검증한다',
        '1.11 서드파티 스토리지의 초기 파라미터를 구성한다',
      ],
      training: [
        'AI 데이터센터 개요',
        'AI를 위한 컴퓨트 플랫폼',
        'BlueField 네트워킹 플랫폼 — 개요·브링업·펌웨어·관리',
        'AI 데이터센터 관리',
        '실습: BCM으로 AI 클러스터 브링업',
      ],
    },
    readings: [
      { title: 'NVIDIA System Management Interface', url: 'https://docs.nvidia.com/deploy/nvidia-smi/' },
      { title: 'NVIDIA System Management User Guide' },
      { title: 'NVIDIA CUDA Compiler Driver NVCC', url: 'https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/' },
      { title: 'NVIDIA Virtual GPU Software', url: 'https://docs.nvidia.com/vgpu/' },
      { title: 'InfiniBand Fabric Utilities', url: 'https://docs.nvidia.com/networking/' },
      { title: 'Getting Started With the NGC Command-Line Interface (CLI)', url: 'https://docs.ngc.nvidia.com/cli/' },
      { title: 'NVIDIA LinkX Cables and Transceivers' },
      { title: 'DGX BasePOD Deployment Guide', url: 'https://docs.nvidia.com/dgx-basepod/' },
      { title: 'NVIDIA DGX H100/H200 User Guide: Quickstart and Basic Operation', url: 'https://docs.nvidia.com/dgx/dgxh100-user-guide/' },
      { title: 'AI Factory Whitepaper' },
      { title: 'DGX SuperPOD Deployment Guide', url: 'https://docs.nvidia.com/dgx-superpod/' },
      { title: 'DGX SuperPOD Administration Guide', url: 'https://docs.nvidia.com/dgx-superpod/' },
      { title: 'DGX CentOS Install Guide' },
      { title: 'Choosing the Right Storage (Blog)' },
      { title: 'Protecting Sensitive Data and AI Models (Blog)' },
      { title: 'Choosing the Right Storage for Enterprise AI Workloads (Blog)' },
      { title: 'DGX SuperPOD Data Center Design' },
      { title: 'Datacenter Efficiency Metrics' },
      { title: 'DGX OS User Guide', url: 'https://docs.nvidia.com/dgx/dgx-os-6-user-guide/' },
      { title: 'Using NVSM' },
      { title: 'NVIDIA Networking', url: 'https://docs.nvidia.com/networking/' },
      { title: 'DGX SuperPOD Design Guide' },
      { title: 'Cabling Data Centers' },
      { title: 'DGX H100 User Guide', url: 'https://docs.nvidia.com/dgx/dgxh100-user-guide/' },
      { title: 'DGX A100 Service Manual' },
    ],
  },
  {
    id: 'sg2',
    weight: '5%',
    en: {
      title: 'Physical Layer Management',
      intro:
        'This exam topic focuses on configuring and maintaining physical resources, including GPU/BlueField DPU networks, cable and transceiver management, and GPU partitioning with MIG. Ensures all physical components support secure, scalable, high-performance AI data center operations.',
      tasks: ['2.1 Configure and manage a BlueField Network Platform', '2.2 Configure MIG (AI and HPC)'],
      training: [
        'BlueField Networking Platform',
        'Compute Platforms for AI / Virtualizing GPU Resources',
        'Practice: BlueField bring-up',
      ],
    },
    ko: {
      title: '물리 계층 관리',
      intro:
        'GPU·BlueField DPU 네트워크, 케이블·트랜시버 관리, MIG를 이용한 GPU 분할 등 물리 자원의 구성과 유지에 초점을 둔다. 모든 물리 구성요소가 안전하고 확장 가능하며 고성능인 AI 데이터센터 운영을 뒷받침하도록 보장한다.',
      tasks: ['2.1 BlueField 네트워크 플랫폼을 구성·관리한다', '2.2 MIG를 구성한다 (AI 및 HPC)'],
      training: [
        'BlueField 네트워킹 플랫폼',
        'AI를 위한 컴퓨트 플랫폼 / GPU 자원 가상화',
        '실습: BlueField 브링업',
      ],
    },
    readings: [
      { title: 'NVIDIA System Management User Guide' },
      { title: 'NVIDIA RAPIDS cuDF Accelerates pandas Nearly 150x With Zero Code Changes (Blog)' },
      { title: 'Choosing the Right Storage for Enterprise AI Workloads' },
      { title: 'NVIDIA ConnectX Card Replacement' },
      { title: 'NVIDIA DCGM', url: 'https://docs.nvidia.com/datacenter/dcgm/latest/' },
      { title: 'Data Center GPU Manager Guide', url: 'https://docs.nvidia.com/datacenter/dcgm/latest/' },
      { title: 'Introduction to NVIDIA DGX H100/H200 Systems', url: 'https://docs.nvidia.com/dgx/dgxh100-user-guide/' },
      { title: 'Spotlight: NVIDIA BlueField DPUs Power the VAST Data Platform for AI Workload Optimization' },
      { title: 'NVIDIA-Certified Systems' },
      { title: 'Deploying DPU OS Using BFB From BMC', url: 'https://docs.nvidia.com/doca/' },
      { title: 'DPU Modes of Operation', url: 'https://docs.nvidia.com/doca/' },
      { title: 'Using mlxconfig', url: 'https://docs.nvidia.com/networking/' },
      { title: 'Installing NVIDIA DOCA on a DPU', url: 'https://docs.nvidia.com/doca/' },
      { title: 'Advanced GPU Configuration — NVIDIA AI Enterprise: VMware Deployment Guide', url: 'https://docs.nvidia.com/ai-enterprise/' },
      { title: 'MIG User Guide — NVIDIA Multi-Instance GPU User Guide', url: 'https://docs.nvidia.com/datacenter/tesla/mig-user-guide/' },
      { title: 'User Guide: NVIDIA AI Enterprise Documentation', url: 'https://docs.nvidia.com/ai-enterprise/' },
    ],
  },
  {
    id: 'sg3',
    weight: '19%',
    en: {
      title: 'Control Plane Installation and Configuration',
      intro:
        'These topics cover installation and configuration of operating systems, cluster managers, drivers, container tools, and management software. Enables orchestrated deployment, resource grouping, secure access, and reliable system software integration for NVIDIA AI clusters.',
      tasks: [
        '3.1 Install BCM, configure, and verify HA',
        '3.2 Install OS',
        '3.3 Install Cluster (configure category, configure interfaces, install Slurm/Enroot/Pyxis)',
        '3.4 Install/update/remove NVIDIA GPU and DOCA drivers',
        '3.5 Install the NVIDIA container toolkit',
        '3.6 Demonstrate how to use NVIDIA GPUs with Docker',
        '3.7 Install NGC CLI on hosts',
      ],
      training: [
        'AI Data Center Management',
        'Virtualizing GPU Resources',
        'NVIDIA AI Software',
        'Compute Platforms for AI',
      ],
    },
    ko: {
      title: '컨트롤 플레인 설치·구성',
      intro:
        '운영체제·클러스터 매니저·드라이버·컨테이너 도구·관리 소프트웨어의 설치와 구성을 다룬다. NVIDIA AI 클러스터에서 오케스트레이션된 배포, 자원 그룹화, 안전한 접근, 신뢰할 수 있는 시스템 소프트웨어 통합을 가능하게 한다.',
      tasks: [
        '3.1 BCM을 설치하고 HA를 구성·검증한다',
        '3.2 OS를 설치한다',
        '3.3 클러스터를 설치한다 (카테고리 구성, 인터페이스 구성, Slurm/Enroot/Pyxis 설치)',
        '3.4 NVIDIA GPU 및 DOCA 드라이버를 설치·업데이트·제거한다',
        '3.5 NVIDIA 컨테이너 툴킷을 설치한다',
        '3.6 Docker에서 NVIDIA GPU를 사용하는 방법을 시연한다',
        '3.7 호스트에 NGC CLI를 설치한다',
      ],
      training: [
        'AI 데이터센터 관리',
        'GPU 자원 가상화',
        'NVIDIA AI 소프트웨어',
        'AI를 위한 컴퓨트 플랫폼',
      ],
    },
    readings: [
      { title: 'BCM Administrator Manual', url: 'https://docs.nvidia.com/base-command-manager/' },
      { title: 'Initial Cluster Setup — NVIDIA DGX SuperPOD', url: 'https://docs.nvidia.com/dgx-superpod/' },
      { title: 'DOCA-Host Installation and Upgrade', url: 'https://docs.nvidia.com/doca/' },
      { title: 'NVIDIA-Certified Systems Configuration Guide' },
      { title: 'Virtual GPU Client Licensing User Guide', url: 'https://docs.nvidia.com/vgpu/' },
      { title: 'Installing the NVIDIA Container Toolkit', url: 'https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html' },
      { title: 'Specialized Configurations With Docker — NVIDIA Container Toolkit', url: 'https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/' },
      { title: 'Running a Sample Workload — NVIDIA Container Toolkit', url: 'https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/' },
      { title: 'Getting Started With the NGC CLI', url: 'https://docs.ngc.nvidia.com/cli/' },
    ],
  },
  {
    id: 'sg4',
    weight: '33%',
    en: {
      title: 'Cluster Test and Verification',
      intro:
        'The section of the exam focuses on validating cluster health and readiness through stress testing, benchmarking, cable integrity checks, firmware validation, and bandwidth verification. Includes end-to-end diagnostics and burn-in to ensure high reliability and optimal AI workload performance.',
      tasks: [
        '4.1 Perform single-node stress test',
        '4.2 Execute HPL (High-Performance Linpack)',
        '4.3 Perform single-node NCCL (including verify NVIDIA NVLink Switch)',
        '4.4 Validate cables by verifying signal quality',
        '4.5 Confirm cabling is correct',
        '4.6 Confirm FW/SW on switches',
        '4.7 Confirm FW/SW on BlueField 3',
        '4.8 Confirm FW on transceivers',
        '4.9 Run ClusterKit to perform a multifaceted node assessment',
        '4.10 Run NCCL to verify E/W fabric bandwidth',
        '4.11 Perform NCCL burn-in',
        '4.12 Perform HPL burn-in',
        '4.13 Perform NeMo burn-in',
        '4.14 Test storage',
      ],
      training: [
        'Practice activities in Compute, Networking, Storage, and BlueField sections',
        'AI Data Center Management',
        'BlueField and Networking for AI',
      ],
    },
    ko: {
      title: '클러스터 테스트·검증',
      intro:
        '스트레스 테스트·벤치마킹·케이블 무결성 점검·펌웨어 검증·대역폭 확인을 통해 클러스터의 건전성과 준비 상태를 검증하는 데 초점을 둔다. 높은 신뢰성과 최적의 AI 워크로드 성능을 보장하기 위한 엔드투엔드 진단과 번인을 포함한다.',
      tasks: [
        '4.1 단일 노드 스트레스 테스트를 수행한다',
        '4.2 HPL(High-Performance Linpack)을 실행한다',
        '4.3 단일 노드 NCCL을 수행한다 (NVIDIA NVLink 스위치 검증 포함)',
        '4.4 신호 품질을 확인하여 케이블을 검증한다',
        '4.5 배선이 올바른지 확정한다',
        '4.6 스위치의 FW/SW를 확정한다',
        '4.7 BlueField-3의 FW/SW를 확정한다',
        '4.8 트랜시버의 FW를 확정한다',
        '4.9 ClusterKit을 실행해 다면적 노드 평가를 수행한다',
        '4.10 NCCL을 실행해 E/W 패브릭 대역폭을 검증한다',
        '4.11 NCCL 번인을 수행한다',
        '4.12 HPL 번인을 수행한다',
        '4.13 NeMo 번인을 수행한다',
        '4.14 스토리지를 테스트한다',
      ],
      training: [
        '컴퓨트·네트워킹·스토리지·BlueField 섹션의 실습 활동',
        'AI 데이터센터 관리',
        'AI를 위한 BlueField와 네트워킹',
      ],
    },
    readings: [
      { title: 'ib_write_lat', url: 'https://docs.nvidia.com/networking/' },
      { title: 'AI Fabric Resiliency and Why Network Convergence Matters (Blog)' },
      { title: 'Overview of NCCL — NCCL Documentation', url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html' },
      { title: 'NVIDIA Collective Communications Library (NCCL)', url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html' },
      { title: 'Overview — NVIDIA NeMo Framework User Guide', url: 'https://docs.nvidia.com/nemo-framework/user-guide/latest/overview.html' },
      { title: 'Train a Reasoning-Capable LLM in One Weekend With NVIDIA NeMo' },
      { title: 'Storage - DGX' },
      { title: 'Best Practices for DGX' },
      { title: 'InfiniBand Port Counters', url: 'https://docs.nvidia.com/networking/' },
      { title: 'UFM Supported Counter and Events', url: 'https://docs.nvidia.com/networking/' },
      { title: 'Cabling Data Centers' },
      { title: 'NVIDIA Cable Management Guidelines and FAQ' },
      { title: 'Cable Validation', url: 'https://docs.nvidia.com/networking/' },
      { title: 'NVIDIA DGX B200 Firmware Update Guide' },
      { title: 'System Management Interface SMI', url: 'https://developer.nvidia.com/system-management-interface' },
    ],
  },
  {
    id: 'sg5',
    weight: '12%',
    en: {
      title: 'Troubleshooting and Optimization',
      intro:
        'This section of the exam focuses on detecting, analyzing, and resolving hardware faults and performance bottlenecks. It encompasses root-cause analysis, component replacement, server/storage tuning, and ongoing optimization for multivendor hardware in NVIDIA-powered AI factories.',
      tasks: [
        '5.1 Identify and troubleshoot hardware faults (e.g., GPU/fan/network card)',
        '5.2 Identify faulty cards/GPUs/power supplies',
        '5.3 Replace faulty cards/GPUs/power supplies',
        '5.4 Execute performance optimization for AMD and Intel Servers',
        '5.5 Storage Optimization',
      ],
      training: [
        'Compute Platforms for AI / Storage for AI',
        'BlueField Networking Platform',
        'Practices throughout the course',
        'AI Data Center Management',
      ],
    },
    ko: {
      title: '트러블슈팅·최적화',
      intro:
        '하드웨어 결함과 성능 병목을 탐지·분석·해결하는 데 초점을 둔다. 근본 원인 분석, 부품 교체, 서버·스토리지 튜닝, 그리고 NVIDIA 기반 AI 팩토리의 멀티벤더 하드웨어에 대한 지속적 최적화를 포괄한다.',
      tasks: [
        '5.1 하드웨어 결함을 식별하고 해결한다 (예: GPU / 팬 / 네트워크 카드)',
        '5.2 불량 카드·GPU·전원 공급 장치를 식별한다',
        '5.3 불량 카드·GPU·전원 공급 장치를 교체한다',
        '5.4 AMD 및 Intel 서버의 성능 최적화를 수행한다',
        '5.5 스토리지를 최적화한다',
      ],
      training: [
        'AI를 위한 컴퓨트 플랫폼 / AI를 위한 스토리지',
        'BlueField 네트워킹 플랫폼',
        '과정 전반의 실습',
        'AI 데이터센터 관리',
      ],
    },
    readings: [
      { title: 'NVIDIA SMI', url: 'https://docs.nvidia.com/deploy/nvidia-smi/' },
      { title: 'DGX-2 Service Manual: DGX Systems Documentation' },
      { title: 'NVIDIA DCGM', url: 'https://docs.nvidia.com/datacenter/dcgm/latest/' },
      { title: 'Debugging and Troubleshooting — NVIDIA DCGM Documentation', url: 'https://docs.nvidia.com/datacenter/dcgm/latest/' },
      { title: 'NVIDIA System Management (NVSM)' },
      { title: 'NVIDIA-Certified Systems' },
      { title: 'Overview — NVIDIA DCGM Documentation', url: 'https://docs.nvidia.com/datacenter/dcgm/latest/' },
      { title: 'NVIDIA System Management User Guide' },
      { title: 'Using the NVSM CLI — NVIDIA System Management User Guide' },
      { title: 'Introduction to the NVIDIA DGX A100 System', url: 'https://docs.nvidia.com/dgx/dgxa100-user-guide/' },
      { title: 'RAPIDS cuDF Accelerates pandas Nearly 150x With Zero Code Changes (Blog)' },
      { title: 'Choose the Right Storage for Enterprise AI Workloads (Blog)' },
      { title: 'Spotlight: NVIDIA BlueField DPUs Power the VAST Data Platform for AI Workload Optimization' },
    ],
  },
]

const RESPONSIBILITIES_EN = [
  'Lead deployment and validation of servers and systems for AI factories.',
  'Configure and manage network topologies, BMC, OOB, TPM, power, and cooling.',
  'Install, upgrade, and validate GPU-based servers, BlueField DPUs, cables, and transceivers.',
  'Perform firmware upgrades, hardware validation, and storage setup.',
  'Configure and administer physical and logical resources, including MIG partitioning and BlueField platforms.',
  'Install and configure operating systems, cluster software, drivers, containers (Docker), and NGC CLI.',
  'Manage and orchestrate clusters using NVIDIA Base Command Manager, Slurm, Pyxis, Enroot, and Run:ai.',
  'Perform stress, benchmarking, and burn-in tests using HPL, NCCL, NVIDIA NeMo, and ClusterKit.',
  'Verify cabling, firmware/software versions, and network signal quality.',
  'Troubleshoot and resolve hardware, software, storage, and performance faults.',
  'Replace faulty components and optimize systems for AMD/Intel platforms.',
  'Monitor, document, and report on cluster health, resource usage, and job performance.',
  'Ensure secure, efficient, and scalable operation of NVIDIA AI infrastructure, including user access and workload management.',
]

const RESPONSIBILITIES_KO = [
  'AI 팩토리를 위한 서버·시스템의 배포와 검증을 주도한다.',
  '네트워크 토폴로지, BMC, OOB, TPM, 전력·냉각을 구성·관리한다.',
  'GPU 기반 서버, BlueField DPU, 케이블, 트랜시버를 설치·업그레이드·검증한다.',
  '펌웨어 업그레이드, 하드웨어 검증, 스토리지 설정을 수행한다.',
  'MIG 분할과 BlueField 플랫폼을 포함해 물리·논리 자원을 구성·관리한다.',
  '운영체제, 클러스터 소프트웨어, 드라이버, 컨테이너(Docker), NGC CLI를 설치·구성한다.',
  'NVIDIA Base Command Manager, Slurm, Pyxis, Enroot, Run:ai로 클러스터를 관리·오케스트레이션한다.',
  'HPL, NCCL, NVIDIA NeMo, ClusterKit으로 스트레스·벤치마크·번인 테스트를 수행한다.',
  '배선, 펌웨어/소프트웨어 버전, 네트워크 신호 품질을 확인한다.',
  '하드웨어·소프트웨어·스토리지·성능 결함을 진단하고 해결한다.',
  '불량 부품을 교체하고 AMD/Intel 플랫폼에 맞춰 시스템을 최적화한다.',
  '클러스터 건전성, 자원 사용량, 잡 성능을 모니터링·문서화·보고한다.',
  '사용자 접근과 워크로드 관리를 포함해 NVIDIA AI 인프라의 안전하고 효율적이며 확장 가능한 운영을 보장한다.',
]

/**
 * NVIDIA 공식 Exam Study Guide — 영어 원문과 한글 번역을 한 페이지에서 전환해 본다.
 * 원문 PDF와 참고 문서로 가는 링크를 함께 둔다.
 */
export default function NcpStudyGuide({
  onBack,
  back,
  onWiki,
  onBlueprint,
}: {
  onBack: () => void
  /** 돌아가기 버튼 라벨 */
  back: { short: string; long: string }
  onWiki: () => void
  onBlueprint: () => void
}) {
  const [lang, setLang] = useState<Lang>('ko')
  const t = (en: string, ko: string) => (lang === 'en' ? en : ko)

  return (
    <>
      <div className="doc-bar">
        <div className="doc-bar-inner">
          <button className="btn-home" onClick={onBack}>{back.short}</button>
          <span className="doc-bar-title">NCP-AII 공식 스터디 가이드</span>
          <div className="seg">
            <button className={lang === 'en' ? 'seg-on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'ko' ? 'seg-on' : ''} onClick={() => setLang('ko')}>한글</button>
          </div>
        </div>
      </div>

      <div className="container guide guide-doc">
        <header className="home-header">
          <div className="badge">NCP-AII</div>
          <h1>{t('AI Infrastructure Exam Study Guide', 'AI 인프라 시험 스터디 가이드')}</h1>
          <p className="subtitle">NVIDIA-Certified Professional: AI Infrastructure (NCP-AII)</p>
        </header>

        <div className="card guide-card">
          <p className="guide-desc">
            {t(
              'This study guide provides an overview of each topic covered on the NVIDIA AI Infrastructure certification exam, as well as recommended training and suggested reading to help prepare for the exam.',
              '이 스터디 가이드는 NVIDIA AI 인프라 인증 시험에서 다루는 각 주제의 개요와 함께, 시험 준비에 도움이 되는 권장 교육과 추천 자료를 제시한다.',
            )}
          </p>
          <ul className="sg-readings">
            <li>
              <a href={SOURCE_PDF} target="_blank" rel="noreferrer">
                {t('Official study guide (PDF, NVIDIA)', '공식 스터디 가이드 원문 (PDF · NVIDIA 배포본)')}
              </a>{' '}
              <span className="sg-linktag">↗ PDF</span>
            </li>
            <li>
              <a href={CERT_HOME} target="_blank" rel="noreferrer">
                {t('Information about NVIDIA certifications', 'NVIDIA 인증 안내 페이지')}
              </a>{' '}
              <span className="sg-linktag">↗ nvidia.com</span>
            </li>
          </ul>
          <p className="guide-note">
            {t(
              'Links marked "search" open a web search for the document title — NVIDIA moves these pages often, so the exact URL is not hard-coded.',
              '"검색" 표시가 붙은 링크는 문서 제목으로 웹 검색을 엽니다. NVIDIA가 문서 URL을 자주 바꾸기 때문에 정확한 주소를 고정하지 않았습니다.',
            )}
          </p>
        </div>

        <Part
          id="sg0"
          tag={t('CONTENTS', '목차')}
          title={t('Exam weights', '도메인별 시험 비중')}
          lead={t(
            'Five domains. The order below follows the official document.',
            '5개 도메인. 아래 순서는 공식 문서 순서를 그대로 따랐다.',
          )}
        />

        <GuideSection
          title={t('Certification Topics', '인증 주제')}
          hint={t('Total 100%', '합계 100%')}
        >
          <T
            head={[t('Domain', '도메인'), t('Exam Weight', '시험 비중')]}
            rows={DOMAINS.map((d) => [
              <a href={`#${d.id}`}>{lang === 'en' ? d.en.title : `${d.ko.title} (${d.en.title})`}</a>,
              d.weight,
            ])}
          />
        </GuideSection>

        <GuideSection
          title={t('Job Description', '직무 설명')}
          hint={t('Who this certification is for', '이 자격이 대상으로 하는 사람')}
        >
          <p className="guide-desc">
            {t(
              'A professional who passes the NVIDIA NCP-AII exam is skilled in deploying, configuring, and validating advanced NVIDIA AI infrastructure. They manage end-to-end system bring-up, physical installation, and networking, handle NVIDIA BlueField and MIG configurations, install and maintain control plane and drivers, perform comprehensive cluster testing, storage validation, troubleshooting, and ongoing optimization for complex, GPU-powered environments.',
              'NVIDIA NCP-AII 시험에 합격한 전문가는 고급 NVIDIA AI 인프라를 배포·구성·검증하는 역량을 갖춘다. 엔드투엔드 시스템 브링업, 물리 설치, 네트워킹을 관리하고, NVIDIA BlueField와 MIG 구성을 다루며, 컨트롤 플레인과 드라이버를 설치·유지하고, 복잡한 GPU 환경에 대해 종합적인 클러스터 테스트·스토리지 검증·트러블슈팅·지속적 최적화를 수행한다.',
            )}
          </p>
        </GuideSection>

        <GuideSection
          title={t('Job Responsibilities', '직무 책임')}
          hint={t('13 items from the official guide', '공식 가이드의 13개 항목')}
        >
          <ol className="guide-list">
            {(lang === 'en' ? RESPONSIBILITIES_EN : RESPONSIBILITIES_KO).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <p className="guide-note">
            {t(
              'Note: Run:ai, NVSM, vGPU/AI Enterprise and user/workload management appear only here and in the reading list — not in the exam objectives. Cover them separately.',
              '참고: Run:ai · NVSM · vGPU/AI Enterprise · 사용자/워크로드 관리는 시험 과제 목록이 아니라 여기(직무 책임)와 추천 자료에만 등장한다. 별도로 챙길 것.',
            )}
          </p>
        </GuideSection>

        <GuideSection
          title={t('Recommended Qualifications and Experience', '권장 자격·경력')}
          hint={t('From the official guide', '공식 가이드 기준')}
        >
          <ul className="guide-list">
            <li>
              {t(
                "Bachelor's degree in computer science, software engineering, AI, or a related field.",
                '컴퓨터과학·소프트웨어공학·AI 또는 관련 분야 학사 학위.',
              )}
            </li>
            <li>
              {t(
                'Expertise in NVIDIA GPU/DPU technologies, AI software stacks, and data center management for high-performance AI workloads.',
                '고성능 AI 워크로드를 위한 NVIDIA GPU/DPU 기술, AI 소프트웨어 스택, 데이터센터 관리에 대한 전문성.',
              )}
            </li>
          </ul>
        </GuideSection>

        {DOMAINS.map((d) => {
          const c = lang === 'en' ? d.en : d.ko
          return (
            <div key={d.id}>
              <Part
                id={d.id}
                tag={`${t('EXAM WEIGHT', '시험 비중')} ${d.weight}`}
                title={lang === 'en' ? d.en.title : `${d.ko.title} — ${d.en.title}`}
                lead={c.intro}
              />
              <GuideSection
                title={t('Exam objectives', '시험 과제')}
                hint={t('The tasks the exam actually asks about', '실제 출제 대상이 되는 과제 목록')}
              >
                <ul className="guide-list">
                  {c.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </GuideSection>
              <GuideSection
                title={t('Recommended Training (Optional)', '권장 교육 (선택)')}
                hint={t('Course reference: AI Infrastructure Professional', '과정 참조: AI Infrastructure Professional')}
              >
                <ul className="guide-list">
                  {c.training.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </GuideSection>
              <GuideSection
                title={t('Suggested Readings', '추천 자료')}
                hint={t('Document titles as printed in the official guide', '공식 가이드에 실린 문서 제목 그대로')}
              >
                <ReadingList items={d.readings} lang={lang} />
              </GuideSection>
            </div>
          )
        })}

        <div className="card guide-card">
          <p className="guide-note">
            © 2025 NVIDIA Corporation and affiliates. All rights reserved. NVIDIA, the NVIDIA logo, Base Command,
            BlueField, ConnectX, CUDA, DGX, DGX SuperPOD, DOCA, LinkX, NGC, NVIDIA-Certified Systems, NVLink, and RAPIDS
            are trademarks and/or registered trademarks of NVIDIA Corporation and affiliates in the U.S. and other
            countries. (3770919. SEP25)
          </p>
        </div>

        <div className="guide-foot">
          <button className="btn-secondary btn-block" onClick={onWiki}>합격 위키 보기 →</button>
          <button className="btn-secondary btn-block" onClick={onBlueprint}>블루프린트 영어 해부 보기 →</button>
          <button className="btn-secondary btn-block" onClick={onBack}>{back.long}</button>
        </div>
      </div>
    </>
  )
}
