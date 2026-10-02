import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 7 — 보충 심화 (기반 개념) */
export default function Deep() {
  return (
    <>
      <Part
        id="p7"
        tag="PART 7"
        title="보충 심화 — 기반 개념"
        lead="블루프린트 항목들이 전제하는 기반 개념. 여기가 비어 있으면 D1·D2 문제의 오답 보기에 걸린다."
      />

      <GuideSection title="7-1. InfiniBand 동작 원리 — Subnet Manager · LID" hint="IB는 중앙 제어형(SDN형) 패브릭이다">
        <p className="guide-desc">
          <strong>Subnet Manager(SM)</strong>라는 단일 관리 주체가 ① 패브릭 발견 → ② 각 포트에 <strong>LID</strong> 부여 →
          ③ 모든 스위치의 포워딩 테이블 계산·배포를 수행한다. 구현체는 OpenSM(호스트 데몬, 소규모) · 스위치 내장 SM ·
          UFM(엔터프라이즈/대규모).
        </p>
        <h3 className="guide-h3">🆕 포트 상태 — 논리 vs 물리 (핵심 정정 포인트)</h3>
        <T
          head={['값', '의미']}
          rows={[
            ['Physical state', 'Polling / Disabled / LinkUp / LinkErrorRecovery … — 케이블·신호 계층. LinkUp = 물리적으로 붙음'],
            ['State (논리)', 'Down → Initializing → Armed → Active — SM 계층. Active = SM이 LID 부여·라우팅 구성 완료'],
          ]}
        />
        <p className="guide-note">
          🪤 <strong>Physical state: LinkUp 인데 State: Initializing에 머무름 = 케이블 문제가 아니라 SM 부재/미구성.</strong>{' '}
          이더넷 배경 운영자가 가장 자주 틀리는 지점이며 시험의 단골 함정.
        </p>
        <T
          head={['', 'GUID', 'LID']}
          rows={[
            ['부여 주체', '하드웨어에 각인(영구)', 'SM이 부여(서브넷 내 주소)'],
            ['대응 개념', '이더넷 MAC', '라우팅 주소'],
            ['변동', '불변', 'SM 재시작 시 바뀔 수 있음'],
          ]}
        />
        <ul className="guide-list">
          <li>패브릭당 마스터 SM 1개 + 스탠바이</li>
          <li>SM이 죽어도 기존 라우팅은 동작하지만 <strong>새 노드 추가·링크 변경이 반영되지 않는다</strong></li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>ibstat</code>, '로컬 포트 State/Physical state · LID · 속도'],
            [<code>sminfo</code>, '현재 마스터 SM의 LID·상태 (SM 존재 검증)'],
            [<code>systemctl status opensm</code>, 'OpenSM 데몬 (호스트 SM인 경우)'],
            [<code>ibnetdiscover / iblinkinfo</code>, 'SM 관점의 패브릭 토폴로지·링크 일람'],
            [<code>perfquery</code>, '포트 오류 카운터'],
          ]}
        />
      </GuideSection>

      <GuideSection title="7-2. GPUDirect RDMA · P2P" hint="GDR 미동작 증상 = 링크는 정상인데 NCCL busbw 급감 (단골 시나리오)">
        <T
          head={['기술', '경로', '대상']}
          rows={[
            ['GPUDirect P2P', 'GPU ↔ GPU (노드 내)', 'NVLink 우선, 없으면 PCIe P2P'],
            ['GPUDirect RDMA', 'NIC ↔ GPU (노드 간)', '네트워크 전송에서 CPU 메모리 바운스 버퍼 제거'],
            ['GPUDirect Storage (GDS)', '스토리지 ↔ GPU', '데이터 로딩'],
          ]}
        />
        <Cmd>{`❌ 없이:  GPU → CPU 메모리(복사) → NIC → 패브릭
✅ GDR:   GPU → PCIe(동일 스위치/루트) → NIC → 패브릭`}</Cmd>
        <h3 className="guide-h3">동작 조건 3가지 (암기)</h3>
        <ul className="guide-list">
          <li><strong>커널 모듈</strong>: nvidia-peermem 로드 (드라이버 동봉). 최신 스택은 커널 DMA-BUF 경로도 지원</li>
          <li><strong>PCIe 근접성</strong>: GPU와 NIC이 같은 PCIe 스위치/루트컴플렉스 아래(PIX/PXB). SYS(소켓 간)면 효과 급감 → 레일 정렬 설계의 이유</li>
          <li><strong>ACS 비활성</strong>: PCIe ACS가 P2P를 IOMMU로 강제 우회시키면 성능 저하</li>
        </ul>
        <T
          head={['명령', '확인 내용']}
          rows={[
            [<code>lsmod | grep nvidia_peermem</code>, 'GDR 커널 모듈 로드 여부'],
            [<code>nvidia-smi topo -m</code>, 'GPU-NIC PCIe 관계 (PIX/PXB/SYS)'],
            [<code>NCCL_DEBUG=INFO ./all_reduce_perf ...</code>, '로그에서 [NET/IB] + GDRDMA 사용 여부'],
            [<code>ib_write_bw --use_cuda=GPU</code>, '🆕 GDR 경로 직접 대역폭 측정'],
          ]}
        />
      </GuideSection>

      <GuideSection title="7-3. NVLink · NVSwitch · Fabric Manager 심화" hint="✅ NVSwitch 개수는 세대별로 다르다">
        <T
          head={['세대', 'GPU', '링크 수', '대역폭 (GPU당 양방향 합산)']}
          rows={[
            ['NVLink 3', 'A100', '12', '600 GB/s'],
            ['NVLink 4', 'H100', '18', '900 GB/s'],
            ['NVLink 5', 'Blackwell (B200)', '18', '1.8 TB/s'],
          ]}
        />
        <p className="guide-note">
          시험은 정확한 숫자보다 <strong>"세대마다 약 1.5~2배 증가"</strong> 감각과 GPU 세대 ↔ NVLink 세대 짝이 중요.
        </p>
        <T
          head={['플랫폼', 'NVSwitch']}
          rows={[
            ['HGX A100 8-GPU', '6개'],
            ['HGX H100 / H200 8-GPU', '4개 (NVSwitch 3세대)'],
            ['GB200 NVL72', '랙 규모 — 9개 NVSwitch 트레이, NVLink 도메인 72 GPU'],
          ]}
        />
        <p className="guide-note">
          🪤 "NVLink는 노드 내 통신 기술"이라는 고정관념 주의 — GB200 NVL72처럼 <strong>랙 규모 NVLink 도메인</strong>으로
          확장되는 추세다.
        </p>
        <ul className="guide-list">
          <li>FM은 NVSwitch 시스템에서 GPU 드라이버와 함께 반드시 기동 (nvidia-fabricmanager systemd 서비스)</li>
          <li>드라이버와 <strong>버전 정합</strong> 필요 — 드라이버만 올리고 FM을 안 올리면 기동 실패</li>
          <li>🪤 FM 미기동 증상: nvidia-smi는 GPU를 정상으로 보여주는데 CUDA 앱이 초기화 실패</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>systemctl status nvidia-fabricmanager</code>, 'FM 서비스 상태'],
            [<code>journalctl -u nvidia-fabricmanager</code>, '기동 실패 원인(드라이버 버전 불일치 등)'],
            [<code>nvidia-smi nvlink --status</code>, '링크별 Up/속도'],
            [<code>nvidia-smi topo -m</code>, 'NV# 표기 = NVLink 묶음 수'],
          ]}
        />
      </GuideSection>

      <GuideSection title="7-4. DCGM 모니터링 스택 — dcgm-exporter · Prometheus" hint="능동 진단 vs 상시 감시 — 반복 출제 축">
        <Cmd>{`Grafana 대시보드 · Alertmanager 알람
Prometheus            시계열 수집·저장 · 알람 규칙
dcgm-exporter         DCGM 필드를 /metrics로 노출 (기본 포트 9400, K8s는 DaemonSet)
DCGM (nv-hostengine)  GPU 텔레메트리 · 헬스 · XID 이벤트 · 정책
GPU 드라이버 / NVML    원시 지표 소스`}</Cmd>
        <T
          head={['지표', '무엇을 알려주나']}
          rows={[
            ['온도 · 전력 · 클럭(스로틀 사유)', '냉각/전력 문제 조기 신호'],
            ['ECC 정정/비정정, retired pages, row remap', '메모리 열화 추세'],
            ['XID 이벤트', '즉시 알람 대상'],
            ['PCIe / NVLink 오류 카운터', '통신 계층 열화'],
            ['GPU/메모리 사용률', '활용률 · 데이터 로딩 병목(주기적 하락 패턴)'],
          ]}
        />
        <ul className="guide-list">
          <li><strong>번인 중</strong>: 지표 수집하며 노드 간 편차(outlier) 기록 → 인수 판정 근거</li>
          <li><strong>프로덕션</strong>: XID 발생 → 알람 → 노드 자동 drain(스케줄러 연동)이 성숙한 형태</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>dcgmi dmon -e 150,155</code>, '온도·전력 실시간 스트리밍'],
            [<code>dcgmi policy --set ...</code>, 'XID/ECC/온도 조건 자동 반응 정책'],
            [<code>dcgmi health -s a / -c</code>, '백그라운드 헬스 워치 활성/조회'],
            [<code>curl localhost:9400/metrics</code>, 'dcgm-exporter 노출 확인'],
          ]}
        />
      </GuideSection>

      <GuideSection title="7-5. RoCE · Spectrum-X" hint="이더넷은 기본적으로 손실 허용 망이므로 RDMA가 성립하려면 사실상 무손실을 만들어야 한다">
        <T
          head={['기술', '동작', '리스크']}
          rows={[
            ['PFC (Priority Flow Control)', '우선순위(큐)별 pause 프레임으로 버퍼 넘침(드롭) 방지', '남용 시 HOL 블로킹 · PFC 폭풍'],
            ['ECN + CNP', '스위치가 혼잡을 표시(ECN) → 수신측이 송신측에 감속 요청(CNP) → 송신 NIC 레이트 조절. 통칭 DCQCN', '파라미터 튜닝 필요'],
          ]}
        />
        <T
          head={['', 'InfiniBand', 'RoCEv2']}
          rows={[
            ['무손실', '링크 계층 크레딧 기반 — 태생적', 'PFC/ECN 설정으로 구현'],
            ['라우팅', 'SM 중앙 계산', '표준 IP 라우팅 + ECMP'],
            ['장점', '설정 단순, 저지연', '기존 이더넷 운영 체계 재사용'],
            ['단점', '별도 패브릭 기술 스택', '설정 복잡도'],
          ]}
        />
        <T
          head={['Spectrum-X 기능', '내용']}
          rows={[
            ['적응형 라우팅', '흐름을 패킷 단위로 여러 경로에 분산(스프레이), 순서는 BF-3가 복원 → ECMP 해시 충돌로 인한 엘리펀트 플로우 병목 완화'],
            ['텔레메트리 기반 혼잡 제어', '스위치가 실시간 혼잡 정보를 DPU에 전달해 정밀 레이트 조절'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mlnx_qos -i IF</code>, 'NIC의 PFC/트래픽 클래스 설정 확인'],
            [<code>ethtool -S IF | grep -i pause</code>, 'PFC pause 프레임 카운터'],
            [<code>show_gids</code>, '🆕 RoCE GID 인덱스 확인 (NCCL_IB_GID_INDEX 설정용)'],
          ]}
        />
        <p className="guide-note">⚠️ DCQCN 파라미터 수준의 세부가 시험 범위인지는 불확실 — 개념(PFC/ECN 역할) 수준으로 대비 권장.</p>
      </GuideSection>

      <GuideSection title="7-6. Slurm GPU 스케줄링 심화 — GRES · cgroup · 토폴로지" hint="3축으로 나눠 외운다">
        <T
          head={['축', '설정', '검증']}
          rows={[
            ['GRES 정의 (무엇이 있는가)', 'slurm.conf: GresTypes=gpu, Gres=gpu:h100:8 / gres.conf: 디바이스 매핑 또는 AutoDetect=nvml', 'scontrol show node | grep -i gres'],
            ['cgroup 격리 (그것만 보게)', 'cgroup.conf: ConstrainDevices=yes', 'srun --gres=gpu:2 nvidia-smi -L → 2개만'],
            ['토폴로지 인지 (가까운 것끼리)', 'topology.conf에 스위치 계층 정의 → 같은 리프 아래 노드 우선 배치', '멀티노드 NCCL 성능'],
          ]}
        />
        <ul className="guide-list">
          <li>"--gres=gpu:2를 줬는데 8개가 다 보인다" → <strong>ConstrainDevices 미설정</strong></li>
          <li>"멀티노드 잡이 스파인 건너 배치되어 느리다" → <strong>topology.conf 미인지</strong></li>
          <li>Pyxis(--container-image)가 srun에 통합 — GRES 할당과 컨테이너 GPU 주입이 함께 동작</li>
          <li>노드 프롤로그/에필로그 또는 <strong>HealthCheckProgram</strong>으로 dcgmi 점검을 걸어 불량 노드 자동 drain</li>
        </ul>
      </GuideSection>

      <GuideSection title="7-7. 컨테이너에 GPU가 주입되는 원리" hint="이미지 안에 드라이버가 없어도 되는 이유">
        <Cmd>{`docker run --gpus
  → containerd/runc가 nvidia 런타임 훅 호출
    → libnvidia-container 가 호스트의
       디바이스 노드(/dev/nvidia0, /dev/nvidiactl, /dev/nvidia-uvm)와
       드라이버 라이브러리(libcuda.so, libnvidia-ml.so)를 바인드 마운트
    → NVIDIA_VISIBLE_DEVICES(무엇을) / NVIDIA_DRIVER_CAPABILITIES(어떤 기능을)가 범위 결정`}</Cmd>
        <ul className="guide-list">
          <li><strong>CDI</strong> — 훅 방식의 런타임 종속성 제거. nvidia-ctk cdi generate로 장치 스펙을 만들면 CDI 지원 런타임이 스펙대로 주입</li>
          <li><strong>Enroot</strong> — 데몬 없이 사용자 권한으로 실행. 도커 이미지를 squashfs로 변환 후 유저 네임스페이스에서 실행 (루트 데몬이 없어 HPC 멀티유저에 적합)</li>
          <li><strong>Pyxis</strong> — srun과 Enroot를 잇는 SPANK 플러그인</li>
        </ul>
        <Cmd>{`진단 계층화
호스트 nvidia-smi → docker info(런타임 등록) → 컨테이너 내 ls /dev/nvidia*
  → 컨테이너 내 nvidia-smi → CUDA 앱`}</Cmd>
      </GuideSection>

      <GuideSection title="7-8. 🆕 SHARP — 네트워크 내 집합통신 오프로드" hint="IB(Quantum) 전용이며 UFM/AM 구성이 전제">
        <p className="guide-desc">
          Quantum IB 스위치가 all-reduce/reduce 연산 자체를 네트워크 안에서 수행한다. 데이터가 스위치를 오가는 횟수가 줄어
          트래픽과 지연이 동시에 감소한다.
        </p>
        <T
          head={['요소', '역할']}
          rows={[
            ['Aggregation Manager (AM)', '스위치의 aggregation tree 구성 — 보통 UFM이 담당'],
            ['sharpd', '호스트 데몬 — 애플리케이션과 SHARP 자원 중개'],
            ['NCCL 연동', 'NCCL_COLLNET_ENABLE=1 (+ SHARP 플러그인)'],
          ]}
        />
        <p className="guide-note">
          🎯 "IB 패브릭에서 집합통신을 스위치로 오프로드하는 기술은?" → <strong>SHARP.</strong>{' '}
          Ethernet 계열의 대응 개념은 Spectrum-X의 적응형 라우팅·혼잡 제어(성격은 다름).
        </p>
      </GuideSection>

      <GuideSection title="7-9. Kubernetes에서 GPU — Device Plugin · GPU Operator" hint="K8s는 GPU를 모른다 — Device Plugin이 kubelet에 보고해야 스케줄된다">
        <Cmd>{`파드: resources.limits: nvidia.com/gpu: 1
NVIDIA Device Plugin (DaemonSet)  — GPU를 스케줄 가능한 리소스로 광고
GPU Operator                      — 드라이버·툴킷·플러그인·dcgm-exporter·MIG Manager 일괄 배포
NVIDIA Container Toolkit (containerd runtime)
GPU 노드 (드라이버 · MIG 설정)`}</Cmd>
        <T
          head={['MIG 전략', '동작', '리소스명']}
          rows={[
            ['single', '노드의 모든 GPU가 동일 MIG 프로파일 (균질)', 'nvidia.com/gpu 유지'],
            ['mixed', '프로파일 혼재', 'nvidia.com/mig-1g.10gb 처럼 프로파일별 리소스명'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>kubectl describe node N | grep nvidia.com</code>, '노드가 광고하는 GPU/MIG 리소스'],
            [<code>helm install gpu-operator nvidia/gpu-operator</code>, 'GPU Operator 설치'],
            [<code>kubectl get pods -n gpu-operator</code>, '구성요소 상태'],
          ]}
        />
        <p className="guide-note">
          <strong>정수 단위 할당(공유 불가)</strong>이 기본. GPU Operator는 driver container로 OS 이미지를 건드리지 않고
          드라이버 설치가 가능하다. MIG Manager가 노드 라벨 변경으로 프로파일 재구성을 자동화한다.
        </p>
      </GuideSection>
    </>
  )
}
