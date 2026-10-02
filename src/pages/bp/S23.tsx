import { Cmd, GuideSection, Part, T } from '../parts'

/** 2. Physical Layer Management (5%) · 3. Control Plane Installation and Configuration (19%) */
export default function S23() {
  return (
    <>
      <Part
        id="b2"
        tag="SECTION 2 · 5%"
        title="Physical Layer Management"
        lead="Physical Layer = OSI 7계층 중 1계층(물리 계층). 실제 전기·광 신호와 케이블의 세계."
      />

      <GuideSection title="2-1. Configure and manage a BlueField network platform." hint="BlueField = NVIDIA의 DPU 제품군">
        <T
          head={['약어', '풀네임', '한글']}
          rows={[
            ['DPU', 'Data Processing Unit', '데이터 처리 장치 — 네트워크/스토리지/보안 작업을 CPU에서 떼어내 처리'],
            ['SmartNIC', 'Smart Network Interface Card', '지능형 네트워크 카드'],
            ['DOCA', 'Data Center Infrastructure-on-a-Chip Architecture', 'BlueField용 SDK'],
          ]}
        />
        <p className="guide-note">
          <em>The DPU offloads networking, storage, and security tasks from the host CPU, freeing up CPU cycles for
          application workloads.</em>
        </p>
        <ul className="guide-list">
          <li><strong>offload A from B</strong> = A를 B에서 덜어내다 ★핵심 동사</li>
          <li><strong>free up</strong> = (자원을) 확보하다, 놀게 만들다</li>
          <li><strong>CPU cycles</strong> = CPU 처리 자원</li>
        </ul>
        <T
          head={['BlueField 동작 모드', '설명']}
          rows={[
            ['DPU mode (= Embedded/ECPF mode)', 'DPU의 Arm 코어가 네트워크를 제어'],
            ['NIC mode', '일반 네트워크 카드처럼만 동작'],
            ['Separated host mode', '호스트와 Arm이 각각 독립적으로'],
          ]}
        />
      </GuideSection>

      <GuideSection title="2-2. Configure MIG (AI and HPC)." hint="MIG = Multi-Instance GPU (다중 인스턴스 GPU)">
        <T
          head={['단어', '의미']}
          rows={[
            ['instance', '인스턴스, 실체/사례 → 여기선 "독립적으로 쓸 수 있는 GPU 조각"'],
            ['partition', '분할하다 / 파티션'],
            ['isolate / isolation', '격리하다 / 격리'],
            ['slice', '조각내다 / 조각'],
          ]}
        />
        <p className="guide-note">
          <em>MIG partitions a single physical GPU into up to seven independent instances, each with dedicated memory,
          cache, and compute cores.</em> — partition A into B = A를 B로 분할하다 / up to = 최대 ~까지 /
          dedicated = 전용의 (↔ shared).
        </p>
        <ul className="guide-list">
          <li>HPC = High-Performance Computing (고성능 컴퓨팅)</li>
          <li>MIG 프로파일 읽는 법: <strong>1g.10gb</strong> = 1개 GPU slice + 10GB 메모리</li>
        </ul>
      </GuideSection>

      <Part
        id="b3"
        tag="SECTION 3 · 19%"
        title="Control Plane Installation and Configuration"
        lead="Control plane = 제어 평면(명령을 내리고 관리하는 층) ↔ Data plane = 데이터 평면(실제 데이터가 흐르는 층). 비유하면 control plane은 관제탑, data plane은 활주로."
      />

      <GuideSection title="3-1. Install Base Command Manager (BCM), configure and verify HA." hint="HA = High Availability (고가용성)">
        <T
          head={['단어', '의미']}
          rows={[
            ['availability', '가용성 — 시스템이 사용 가능한 상태로 있는 비율'],
            ['failover', '장애 조치 — 주 노드가 죽으면 대기 노드로 넘어감'],
            ['failback', '원복 — 복구 후 원래 노드로 되돌림'],
            ['active-passive', '하나는 일하고 하나는 대기'],
            ['active-active', '둘 다 동시에 일함'],
            ['split-brain', '양쪽이 서로 자기가 주(主)라고 믿는 위험 상태'],
            ['quorum', '정족수 — 과반이 동의해야 결정'],
            ['head node / primary node', '헤드 노드(관리 노드)'],
            ['secondary / standby node', '보조/대기 노드'],
            ['compute node', '연산 노드'],
          ]}
        />
        <p className="guide-note">
          <em>In an HA setup, the secondary head node takes over automatically in the event of a primary node failure.</em>{' '}
          — take over = 인계받다 / <strong>in the event of</strong> = ~가 발생할 경우 (격식체).
        </p>
      </GuideSection>

      <GuideSection title="3-2. Install OS." hint="OS 설치 관련 영어">
        <T
          head={['영어', '한글']}
          rows={[
            ['provision', '(자원을) 준비·할당하다 → BCM에서 노드에 OS를 밀어넣는 것'],
            ['PXE boot', 'Preboot Execution Environment — 네트워크로 부팅'],
            ['image', '이미지 — OS 전체를 담은 템플릿'],
            ['bare metal', '베어메탈 — 가상화 없는 물리 서버 그 자체'],
            ['kickstart / unattended install', '무인 자동 설치'],
            ['kernel', '커널'],
            ['repository (repo)', '저장소 (패키지 다운로드처)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="3-3. Install Cluster (category, interfaces, Slurm/Enroot/Pyxis)." hint="Slurm 명령어는 어원을 알면 외워진다">
        <T
          head={['용어', '의미']}
          rows={[
            ['category', 'BCM 용어. 동일한 설정을 공유하는 노드 그룹 분류'],
            ['interface', '네트워크 인터페이스 (물리/논리 포트)'],
            ['Slurm', 'Simple Linux Utility for Resource Management — 대표 작업 스케줄러'],
            ['Enroot', '컨테이너를 권한 없이(unprivileged) 실행하는 런타임'],
            ['Pyxis', 'Slurm이 컨테이너를 직접 실행하게 해주는 플러그인'],
          ]}
        />
        <T
          head={['명령', '어원', '뜻']}
          rows={[
            ['sbatch', 'slurm + batch', '배치 작업 제출'],
            ['srun', 's + run', '즉시 실행'],
            ['squeue', 's + queue', '대기열 조회'],
            ['sinfo', 's + info', '노드/파티션 상태'],
            ['scancel', 's + cancel', '작업 취소'],
            ['scontrol', 's + control', '설정 조회·변경'],
          ]}
        />
        <ul className="guide-list">
          <li>job (작업) / job step (작업 단계) / queue (대기열)</li>
          <li>partition (Slurm에선 노드 묶음 = 큐)</li>
          <li>allocate (할당하다) / allocation (할당량)</li>
          <li>pending (대기 중) / running (실행 중) / <strong>drained</strong> (작업 배정 중단됨)</li>
          <li>preempt (선점하다 — 우선순위 높은 작업이 낮은 작업을 밀어냄)</li>
        </ul>
        <p className="guide-note">
          <strong>node is drained</strong> = 노드가 "배수됨" → 새 작업을 받지 않는 상태. 장애 시 자주 본다.
        </p>
      </GuideSection>

      <GuideSection title="3-4. Install/update/remove NVIDIA GPU and DOCA drivers." hint="driver = OS와 하드웨어 사이의 번역기">
        <T
          head={['영어', '한글']}
          rows={[
            ['kernel module', '커널 모듈'],
            ['DKMS (Dynamic Kernel Module Support)', '커널 업데이트 시 모듈 자동 재빌드'],
            ['open kernel modules', '오픈소스 커널 모듈 (NVIDIA가 R515부터 제공)'],
            ['dependency', '의존성'],
            ['conflict', '충돌'],
            ['purge', '완전 제거 (설정 파일까지)'],
            ['rollback', '이전 버전으로 되돌리기'],
            ['compatibility matrix', '호환성 표 — 어떤 드라이버가 어떤 CUDA/OS와 맞는지'],
          ]}
        />
        <p className="guide-note">
          <em>CUDA applications are forward-compatible with newer drivers, but the driver version must meet or exceed the
          minimum requirement for the CUDA toolkit.</em> — <strong>meet or exceed</strong> = 충족하거나 상회하다 (규격 문서 상투구).
        </p>
        <ul className="guide-list">
          <li>DOCA 드라이버는 BlueField/ConnectX용. 과거의 MLNX_OFED가 DOCA-OFED로 흡수됨</li>
          <li>OFED = OpenFabrics Enterprise Distribution (InfiniBand/RDMA 드라이버 스택)</li>
          <li>RDMA = Remote Direct Memory Access — 원격 메모리 직접 접근, CPU를 거치지 않음</li>
          <li>RoCE /ˈroʊki/ "로키" = RDMA over Converged Ethernet</li>
        </ul>
      </GuideSection>

      <GuideSection title="3-5. Install the NVIDIA container toolkit." hint="container = 애플리케이션 + 실행 환경을 통째로 담은 격리 패키지">
        <T
          head={['영어', '한글']}
          rows={[
            ['runtime', '런타임 — 실행을 담당하는 엔진'],
            ['hook', '훅 — 실행 도중 끼어드는 지점'],
            ['passthrough', '통과 전달 — 호스트 장치를 컨테이너에 그대로 노출'],
            ['mount', '마운트 — 호스트 경로를 컨테이너 안에 붙임'],
            ['image / registry / pull / push', '이미지 / 레지스트리 / 내려받기 / 올리기'],
          ]}
        />
        <p className="guide-note">
          <em>The NVIDIA Container Toolkit exposes the host GPU devices to the container by injecting the driver libraries
          at runtime.</em> — expose A to B = A를 B에 노출·제공하다 / inject = 주입하다.
        </p>
      </GuideSection>

      <GuideSection title="3-6. Demonstrate how to use NVIDIA GPUs with Docker." hint="how to + 동사원형 = ~하는 방법 (명사구로 동사의 목적어가 된다)">
        <Cmd>{`docker run --rm --gpus all nvidia/cuda:12.4.0-base nvidia-smi`}</Cmd>
        <T
          head={['플래그', '의미']}
          rows={[
            ['--rm', '종료 시 컨테이너 자동 삭제 (remove)'],
            ['--gpus all', '모든 GPU를 컨테이너에 할당'],
            ['--gpus "device=0,1"', '0번, 1번 GPU만'],
            ['--ipc=host', '호스트 IPC 공유 (멀티프로세스 학습에 필요)'],
            ['--ulimit memlock=-1', '메모리 잠금 한계 해제 (RDMA용)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="3-7. Install NGC CLI on hosts." hint="인증 어휘 — credentials는 항상 복수형">
        <T
          head={['약어', '풀네임', '의미']}
          rows={[
            ['NGC', 'NVIDIA GPU Cloud', 'NVIDIA의 컨테이너/모델 카탈로그'],
            ['CLI', 'Command-Line Interface', '명령줄 인터페이스 (↔ GUI)'],
            ['host', '호스트', '컨테이너를 돌리는 물리/가상 머신 본체'],
          ]}
        />
        <ul className="guide-list">
          <li>API key (API 키) / token (토큰)</li>
          <li>authenticate (인증하다) / authorization (인가)</li>
          <li>credentials (자격 증명) — 항상 복수형</li>
          <li>log in to the registry (레지스트리에 로그인)</li>
        </ul>
      </GuideSection>
    </>
  )
}
