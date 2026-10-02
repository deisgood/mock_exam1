import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 8 치트시트 · Part 9 함정·체크리스트 · 부록 블루프린트 대조표 */
export default function Ref() {
  return (
    <>
      <Part
        id="p8"
        tag="PART 8"
        title="빠른 참조 (치트시트)"
        lead="시험 전날 이 파트만 반복해도 된다. 특히 8-1 도구↔계층 매칭표는 백지에 재현할 수 있어야 한다."
      />

      <GuideSection title="8-1. 도구 ↔ 검증 계층 마스터 표" hint="🎯 최다 출제 유형 — 증상을 주고 도구를 고르게 한다">
        <T
          head={['계층', '무엇을 보나', '도구']}
          rows={[
            ['PCIe 버스 인식', '장치가 버스에 보이는가', 'lspci -d 10de: / lspci -d 15b3:'],
            ['GPU 드라이버', '인식·버전·PCIe·ECC·토폴로지', 'nvidia-smi'],
            ['GPU 능동 진단', '부하 걸고 판정', 'dcgmi diag -r 1~4'],
            ['GPU 상시 감시', '온도·전력·ECC·XID 추세', 'dcgmi health/policy, dcgm-exporter'],
            ['GPU 런타임 오류', '결함 코드', 'dmesg | grep XID'],
            ['데이터 경로 대역폭', 'H2D/D2H/P2P', 'nvbandwidth'],
            ['연산·전력·열', 'FP64 효율', 'HPL'],
            ['노드 내 통신', 'NVLink/NVSwitch', 'all_reduce_perf -g 8, nvidia-smi nvlink --status, FM 상태'],
            ['BMC 하드웨어 이벤트', '팬·PSU·전압·온도', 'ipmitool sdr/sel, Redfish'],
            ['플랫폼 FW', 'HGX 번들', 'nvfwupd, Redfish UpdateService'],
            ['NIC/DPU FW', '버전·PSID', 'mlxfwmanager, flint'],
            ['케이블/트랜시버', '타입·시리얼·FW', 'mlxcables, mlxlink --show_module'],
            ['링크 신호 품질', 'BER·FEC·eye', 'mlxlink --show_eye/--show_counters'],
            ['로컬 IB 포트', 'State/Physical state·LID', 'ibstat, ibstatus'],
            ['IB 포트 오류 카운터', '누적 오류', 'perfquery'],
            ['패브릭 전수 진단', '링크·속도·토폴로지', 'ibdiagnet, iblinkinfo'],
            ['배선 대조', '설계 vs 실제', 'ibnetdiscover, ibdiagnet -t/-w'],
            ['SM 존재 확인', '마스터 SM LID', 'sminfo, systemctl status opensm'],
            ['순수 RDMA 대역폭', '노드 쌍 링크', 'ib_write_bw / ib_read_bw'],
            ['패브릭 전수 성능', 'N×N 매트릭스', 'ClusterKit (HPC-X)'],
            ['노드 간 집합통신', 'busbw', '멀티노드 all_reduce_perf -g 1'],
            ['스토리지 범용', '대역폭·IOPS', 'fio --direct=1'],
            ['스토리지 병렬 집합', '집합 대역폭', 'IOR'],
            ['스토리지 메타데이터', '파일 생성/삭제', 'mdtest'],
            ['GDS 경로', '스토리지→GPU DMA', 'gdscheck -p, gdsio'],
            ['실워크로드', 'end-to-end', 'NeMo 벤치마크'],
          ]}
        />
      </GuideSection>

      <GuideSection title="8-2. 증상 → 진단 경로" hint="지문의 증상 한 줄에서 바로 1순위 확인처가 떠올라야 한다">
        <T
          head={['증상', '1순위 확인', '다음']}
          rows={[
            ['컨테이너에서 GPU 안 보임', '호스트 nvidia-smi', 'docker info 런타임 → --gpus → /dev/nvidia* → CUDA 버전 호환'],
            ['nvidia-smi는 정상인데 CUDA 초기화 실패', 'Fabric Manager 상태', 'FM↔드라이버 버전 정합'],
            ['NCCL busbw가 절반', 'GPUDirect RDMA 동작 여부(NCCL_DEBUG=INFO)', 'nvidia-peermem, topo(PIX/SYS), ACS'],
            ['링크는 Up인데 특정 구간만 느림', 'mlxlink BER/카운터', 'perfquery -R 후 재관찰 → 케이블 교체'],
            ['IB 포트가 Initializing에서 안 넘어감', 'SM 존재 확인 (sminfo)', 'OpenSM/스위치 SM/UFM 상태'],
            ['부하 걸면 성능 저하·재부팅', '스로틀 사유 · 흡기 온도 · 전력', 'nvidia-smi -q -d PERFORMANCE, ipmitool sdr'],
            ['특정 노드만 HPL 느림', '냉각·전력 → FW → GPU 결함 순', '노드 간 baseline 비교'],
            ['GPU 사용률이 주기적으로 뚝뚝', '데이터 로딩 병목', '스토리지 계층 분리 측정, DataLoader 워커'],
            ['--gres=gpu:2인데 8개 보임', 'cgroup.conf ConstrainDevices', 'Slurm 재시작'],
            ['H2D 전송만 느림', 'NUMA 크로스 접근', 'nvidia-smi topo -m → numactl 바인딩'],
            ['잡이 스파인 건너 배치되어 느림', 'topology.conf', '스위치 계층 정의'],
            ['배선은 다 Up인데 NCCL 성능 미달', '오배선(레일 불일치)', 'ibnetdiscover + .topo 대조'],
            ['노드 프로비저닝 실패', 'BCM 노드 상태(INSTALLER_FAILED)', 'PXE·이미지·카테고리 확인'],
          ]}
        />
      </GuideSection>

      <GuideSection title="8-3. 명령어 치트시트" hint="옵션 문자보다 '무엇을 확인/변경하는 명령인가'를 먼저">
        <h3 className="guide-h3">GPU</h3>
        <Cmd>{`nvidia-smi                                   # 개수·드라이버·CUDA
nvidia-smi -q                                # 전체 상세 (GPU Link Info에 PCIe 정보)
nvidia-smi --query-gpu=pcie.link.gen.current,pcie.link.width.current --format=csv
nvidia-smi -q -d ECC,ROW_REMAPPER,POWER,TEMPERATURE,PERFORMANCE
nvidia-smi -pm 1 ; nvidia-smi -e 1 ; nvidia-smi -pl <W>
nvidia-smi topo -m ; nvidia-smi nvlink --status ; nvidia-smi -L
dcgmi discovery -l ; dcgmi diag -r 3 ; dcgmi dmon -e 150,155
dmesg -T | grep -i xid`}</Cmd>
        <h3 className="guide-h3">MIG</h3>
        <Cmd>{`nvidia-smi -i 0 -mig 1
nvidia-smi mig -lgip
nvidia-smi mig -cgi 3g.40gb,2g.20gb,1g.10gb,1g.10gb -C
nvidia-smi mig -lgi ; nvidia-smi mig -lci ; nvidia-smi -L
nvidia-smi mig -dci ; nvidia-smi mig -dgi ; nvidia-smi -i 0 -mig 0`}</Cmd>
        <h3 className="guide-h3">BMC / 펌웨어</h3>
        <Cmd>{`ipmitool lan print 1 ; ipmitool lan set 1 ipaddr <ip>
ipmitool chassis power status|on|off|cycle ; ipmitool sol activate
ipmitool sdr list ; ipmitool sel elist ; ipmitool dcmi power reading
curl -k -u admin:<pw> https://<bmc>/redfish/v1/Systems
nvfwupd show_version ; nvfwupd update_fw`}</Cmd>
        <h3 className="guide-h3">네트워크 / MFT</h3>
        <Cmd>{`mst start && mst status
mlxfwmanager ; flint -d /dev/mst/<dev> query ; mlxfwreset -d <dev> -l 3 r
mlxcables ; mlxlink -d mlx5_0 -p 1 --show_module --show_counters --show_eye
ibstat ; ibstatus ; sminfo ; iblinkinfo ; perfquery -a
ibnetdiscover ; ibdiagnet ; ibdiagnet -w fabric.topo ; ibdiagnet -t design.topo
ib_write_bw -d mlx5_0 -a          # 서버 / 클라이언트에 IP 추가
mlnx_qos -i <if> ; ethtool -S <if> | grep -i err`}</Cmd>
        <h3 className="guide-h3">BlueField</h3>
        <Cmd>{`mlxconfig -d /dev/mst/mt41692_pciconf0 -e q
mlxconfig -d /dev/mst/mt41692_pciconf0 s INTERNAL_CPU_OFFLOAD_ENGINE=1   # NIC 모드
mlxfwreset -d /dev/mst/mt41692_pciconf0 -l 4 r
bfb-install --bfb <image.bfb> --rshim rshim0
screen /dev/rshim0/console ; bfvcheck`}</Cmd>
        <h3 className="guide-h3">BCM / Slurm</h3>
        <Cmd>{`cmsh ; request-license
cmsh -c "device; list" ; cmsh -c "softwareimage; list"
cmsh -c "device use node001; set category dgx; commit"
cmsh -c "device; imageupdate -n node001"
cmha-setup ; cmha status ; cmha makeactive
cm-wlm-setup
sinfo ; sinfo -R ; scontrol show node <n>
srun --gres=gpu:2 nvidia-smi -L
srun --container-image=nvcr.io#nvidia/pytorch:24.05-py3 nvidia-smi
scontrol update nodename=<n> state=drain reason="RMA" | state=resume`}</Cmd>
        <h3 className="guide-h3">컨테이너 / NGC</h3>
        <Cmd>{`nvidia-ctk runtime configure --runtime=docker && systemctl restart docker
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml
ngc config set ; ngc registry image pull nvidia/pytorch:24.05-py3
docker login nvcr.io            # user: $oauthtoken  pass: API key
enroot import docker://nvcr.io#nvidia/pytorch:24.05-py3`}</Cmd>
        <h3 className="guide-h3">벤치마크</h3>
        <Cmd>{`./build/all_reduce_perf -b 8 -e 8G -f 2 -g 8                    # 단일 노드
mpirun -np 16 -H a:8,b:8 -x NCCL_DEBUG=INFO ./all_reduce_perf -b 8 -e 8G -f 2 -g 1
mpirun -np 8 hpl.sh --dat ./HPL.dat
$HPCX_CLUSTERKIT_DIR/bin/clusterkit.sh --hostfile hosts
fio --name=r --rw=read --bs=1M --iodepth=32 --numjobs=8 --direct=1 --size=10G
mpirun -np N ior -w -r -t 1m -b 4g ; mpirun -np N mdtest -n 10000 -d /fs/t
/usr/local/cuda/gds/tools/gdscheck -p`}</Cmd>
      </GuideSection>

      <GuideSection title="8-4. 영문 용어 대조표" hint="시험은 영어 — 한글로 외운 개념이 영어로 나오면 못 알아본다">
        <T
          head={['한글', '영문 시험 표현']}
          rows={[
            ['브링업 / 초기 구성', 'bring-up / initial configuration'],
            ['배포 및 검증 순서', 'sequence of events for deployment and validation'],
            ['대역외 관리', 'out-of-band (OOB) management'],
            ['펌웨어 번들', 'firmware bundle'],
            ['결함 탐지', 'fault detection'],
            ['전력·냉각 파라미터 검증', 'validate power and cooling parameters'],
            ['케이블·트랜시버', 'cables and transceivers'],
            ['서드파티 스토리지 초기 파라미터', 'initial parameters for third-party storage'],
            ['물리 계층 관리', 'physical layer management'],
            ['컨트롤 플레인', 'control plane'],
            ['소프트웨어 이미지 / 카테고리', 'software image / category'],
            ['고가용성', 'high availability (HA), active/passive head node'],
            ['노드 배수', 'drain a node'],
            ['단일 노드 스트레스 테스트', 'single-node stress test'],
            ['번인', 'burn-in'],
            ['신호 품질 검증', 'validate cables by verifying signal quality'],
            ['배선 확인', 'confirm cabling is correct'],
            ['다면 노드 평가', 'multifaceted node assessment (ClusterKit)'],
            ['E/W 패브릭 대역폭', 'East-West fabric bandwidth'],
            ['집합 통신', 'collective communication'],
            ['하드웨어 결함 식별', 'identify hardware faults'],
            ['성능 최적화', 'performance optimization'],
            ['초기 불량', 'infant mortality'],
            ['오배선', 'miscabling'],
            ['저속 협상', 'link speed negotiation / degraded link'],
            ['스로틀링', 'throttling (clocks throttle reasons)'],
            ['격리', 'isolation (cgroup / hardware isolation)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="8-5. 약어표 (확장·정정본)" hint="풀네임을 모르면 영어 지문에서 못 알아본다">
        <T
          head={['약어', '전체 이름', '한 줄 정리']}
          rows={[
            ['BMC', 'Baseboard Management Controller', '서버 내장 독립 관리 컴퓨터 — OS가 죽어도 전원·센서·콘솔·펌웨어를 원격 제어'],
            ['OOB', 'Out-of-Band Management', 'BMC 전용 관리망 — 프로덕션 망과 분리, 장애 시에도 접근 보장'],
            ['TPM', 'Trusted Platform Module', '키 보관·측정 부팅용 보안 칩. BIOS/UEFI에서 활성화'],
            ['HGX', 'NVIDIA HGX GPU 베이스보드 플랫폼', '8-GPU + NVSwitch 베이스보드. 펌웨어를 번들로 관리'],
            ['SMI', 'System Management Interface (nvidia-smi)', 'GPU 상태·설정 CLI — 인식/버전/PCIe/ECC/전력/토폴로지 1차 도구'],
            ['SEL', 'System Event Log', 'BMC 하드웨어 이벤트 로그 — 전원·팬·온도·PSU 결함 1차 확인처'],
            ['XID', 'XID Error', 'GPU 런타임 오류 표준 코드 — HW vs SW 성격 구분'],
            ['DCGM', 'Data Center GPU Manager', 'GPU 헬스 감시 + 능동 진단(dcgmi diag)'],
            ['EUD', 'Extended User Diagnostics', 'DCGM과 별개의 필드 확장 진단'],
            ['HPL', 'High-Performance Linpack', 'FP64 벤치마크 — 이론 대비 효율을 숫자 하나로'],
            ['HPL-MxP', 'HPL Mixed Precision', '혼합정밀 별도 벤치마크 (HPL과 혼동 주의)'],
            ['NCCL', 'NVIDIA Collective Communications Library', '집합통신 — nccl-tests로 NVLink/패브릭 대역폭 검증'],
            ['algbw / busbw', 'algorithm / bus bandwidth', '하드웨어 검증 지표는 busbw'],
            ['NVLink / NVSwitch', 'GPU 인터커넥트 / 크로스바 스위치', '노드 내(또는 랙 규모) 통신 성능의 근간'],
            ['FM', 'Fabric Manager', 'NVSwitch 라우팅 구성 호스트 서비스 — 미기동 시 CUDA/NCCL 실패'],
            ['IB', 'InfiniBand', '저지연·고대역 RDMA 패브릭 (Quantum 스위치)'],
            ['SM', 'Subnet Manager', 'IB 패브릭 중앙 관리자 — LID 부여·라우팅 계산'],
            ['LID / GUID', 'Local Identifier / Globally Unique ID', 'SM이 부여하는 주소 / 하드웨어 각인 영구 식별자'],
            ['UFM', 'Unified Fabric Manager', 'IB 패브릭 중앙 관리·텔레메트리 플랫폼 (SHARP AM 포함)'],
            ['🆕 SHARP', 'Scalable Hierarchical Aggregation and Reduction Protocol', '스위치에서 집합통신을 오프로드'],
            ['RDMA / RoCE', 'Remote DMA / RDMA over Converged Ethernet', 'CPU 개입 없는 원격 메모리 접근 / 이더넷 구현'],
            ['PFC / ECN / DCQCN', 'Priority Flow Control / Explicit Congestion Notification', '이더넷 무손실화의 두 기둥과 그 조합'],
            ['BER / FEC', 'Bit Error Rate / Forward Error Correction', 'Raw(정정 전) vs Effective(정정 후) BER로 케이블 품질 판정'],
            ['DAC / ACC / AOC', 'Direct Attach Copper / Active Copper / Active Optical Cable', '거리·비용·전력으로 선택'],
            ['OSFP / QSFP112', '고속 트랜시버 폼팩터', 'NDR IB는 OSFP(스위치 twin-port) 중심'],
            ['MFT', 'Mellanox Firmware Tools', 'mlxlink·flint·mlxfwmanager·mlxcables·mlxconfig·mlxfwreset'],
            ['HPC-X', 'NVIDIA HPC-X', 'MPI/통신 스택 — ClusterKit 포함'],
            ['BCM', 'Base Command Manager', '이미지 기반 OS 프로비저닝·카테고리·Slurm 설치·HA 일원화'],
            ['CMDaemon / cmsh', 'BCM 관리 데몬 / CLI', 'Base View는 GUI'],
            ['HA', 'High Availability', '액티브/패시브 헤드 이중화 + 공유 IP'],
            ['PXE', 'Preboot eXecution Environment', '네트워크 부팅 — BCM 프로비저닝의 토대'],
            ['GRES', 'Generic RESource (Slurm)', 'gres=gpu 설정이 있어야 GPU가 스케줄 대상'],
            ['Enroot / Pyxis', '비특권 컨테이너 런타임 / Slurm SPANK 플러그인', 'srun --container-image로 NGC 컨테이너 실행'],
            ['CDI', 'Container Device Interface', '런타임 훅 없이 표준 스펙으로 GPU 주입'],
            ['DOCA', 'Data Center infrastructure-On-A-Chip Architecture', 'BlueField SW 프레임워크 — 구 MLNX_OFED 계승'],
            ['DPU', 'Data Processing Unit (BlueField)', 'NIC + Arm CPU — 오프로드로 인프라 분리'],
            ['BFB', 'BlueField Bootstream', 'DPU Arm측 OS+FW 설치 이미지 (rshim 경유 bfb-install)'],
            ['rshim', 'RShim 드라이버', '호스트↔DPU 콘솔·이미지 설치 경로 (/dev/rshim0)'],
            ['NGC', 'NVIDIA GPU Cloud', '공식 컨테이너·모델 카탈로그, 레지스트리 nvcr.io'],
            ['MIG', 'Multi-Instance GPU', 'GPU 1장 → 최대 7개 하드웨어 격리 인스턴스'],
            ['GI / CI', 'GPU Instance / Compute Instance', 'MIG 2계층 분할 단위'],
            ['GDS', 'GPUDirect Storage', '스토리지→GPU 직접 DMA'],
            ['GDR', 'GPUDirect RDMA', 'NIC↔GPU 직접 DMA (노드 간)'],
            ['ECC / DBE / SBE', 'Error-Correcting Code / Double-, Single-Bit Error', 'DBE 반복 → row remapping·RMA 판단'],
            ['NUMA / NPS / SNC', 'Non-Uniform Memory Access / NUMA Per Socket(AMD) / Sub-NUMA Clustering(Intel)', 'GPU·NIC·프로세스 정렬이 튜닝의 기본'],
            ['ACS', 'Access Control Services (PCIe)', '활성 시 P2P를 IOMMU로 우회 → GDR/P2P 성능 저하'],
            ['SU', 'Scalable Unit', 'SuperPOD 증설 단위 (H100 = 32노드, A100 = 20노드)'],
            ['ESD', 'ElectroStatic Discharge', '부품 취급 시 스트랩 착용 — 물리 작업 첫 규칙'],
            ['RMA', 'Return Merchandise Authorization', '불량 부품 반품·교체. 진단 근거(XID·diag) 첨부'],
          ]}
        />
      </GuideSection>

      <Part
        id="p9"
        tag="PART 9"
        title="함정 모음 · 시험 직전 체크리스트"
        lead="여기 20개만 확실히 해도 실점의 상당 부분이 사라진다."
      />

      <GuideSection title="9-1. 함정 20선" hint="오답 보기가 가장 그럴듯하게 파고드는 지점들">
        <ol className="guide-list trap-list">
          <li><code>nvidia-smi -q -d PCIE</code>는 <strong>존재하지 않는다.</strong> PCIe는 -q 전체 출력의 GPU Link Info 또는 --query-gpu=pcie.*</li>
          <li>FM이 죽으면 nvidia-smi는 멀쩡해 보인다. CUDA 초기화 실패 시 FM부터 본다</li>
          <li>링크 "Up"은 품질 보증이 아니다. BER/FEC 카운터로 판정</li>
          <li>IB 포트 Initializing = <strong>SM 문제</strong>, 케이블 문제 아님</li>
          <li>busbw ≠ algbw. 하드웨어 검증은 busbw</li>
          <li>단일 노드는 -g 8, 멀티노드는 -g 1</li>
          <li>HPL은 FP64. Tensor Core FP8/BF16과 혼동 금지 (혼합정밀은 HPL-MxP)</li>
          <li>P×Q = GPU 수여야 한다</li>
          <li>HGX 펌웨어는 <strong>번들 단위.</strong> 개별 조각 업데이트가 오답 포인트</li>
          <li>BlueField는 NIC FW와 Arm BFB가 별개 버전</li>
          <li>BlueField 모드는 <strong>3가지</strong> (DPU / Zero-Trust / NIC)</li>
          <li>MIG 삭제는 CI → GI 역순, 활성화는 GPU 리셋·무프로세스 조건</li>
          <li>MIG 인스턴스 간 NVLink P2P 불가 → 대형 학습은 MIG 끔</li>
          <li>BCM은 노드에서 직접 고치지 않는다. 이미지 수정 → 재프로비저닝</li>
          <li>드라이버 패키지 방식과 runfile 혼용 금지</li>
          <li>Secure Boot에서는 커널 모듈 서명(MOK)이 필요 — 드라이버 로드 실패 단골</li>
          <li>컨테이너 이미지에 드라이버는 없어도 된다. 호스트 라이브러리 바인드 마운트</li>
          <li><code>docker login nvcr.io</code>의 사용자명은 리터럴 <strong>$oauthtoken</strong></li>
          <li>교체 후 재검증 없이 프로덕션 복귀 금지. <strong>drain이 첫 단계</strong></li>
          <li>GPU 사용률 주기적 하락은 GPU 결함이 아니라 <strong>데이터 로딩 병목</strong></li>
        </ol>
      </GuideSection>

      <GuideSection title="9-2. 응시 전 최종 확인 리스트" hint="반드시 외운 상태로 들어갈 것">
        <ul className="guide-list">
          <li>DCGM diag 레벨 r1/r2/r3/r4의 성격</li>
          <li>배포·검증 이벤트 시퀀스 10단계</li>
          <li>AI 팩토리 4개 네트워크와 트래픽 매칭</li>
          <li>레일 최적화 정의 — "Rail i 스위치에는 모든 노드의 NIC i"</li>
          <li>IPMI vs Redfish (자동화·FW = Redfish)</li>
          <li>SEL / XID / DCGM — 결함 로그 소스 3계층</li>
          <li>XID 13·31·48·63/64·74·79·94/95 (+92·119/120)</li>
          <li>DAC / ACC / AOC / 트랜시버+파이버 거리 매칭</li>
          <li>BCM: 소프트웨어 이미지 vs 카테고리, cmsh/Base View, cmha 3종</li>
          <li>Slurm GRES 3종 세트 (slurm.conf / gres.conf / cgroup.conf)</li>
          <li>Enroot(런타임) vs Pyxis(SPANK 플러그인)</li>
          <li>Container Toolkit 설치 3단계</li>
          <li><code>$oauthtoken</code></li>
          <li>BlueField: 3모드, rshim, BFB, bfvcheck</li>
          <li>MIG: 프로파일 표기, 구성 5단계, 삭제 역순</li>
          <li>busbw vs algbw, NDR 400Gb/s ≈ 50 GB/s</li>
          <li>GDR 3대 조건 (nvidia-peermem / PCIe 근접성 / ACS)</li>
          <li>SM·LID·GUID, 포트 상태 기계</li>
          <li>번인 3종의 검증 계층</li>
        </ul>
        <h3 className="guide-h3">응시 전 공식 문서로 대조할 ⚠️ 항목</h3>
        <ul className="guide-list">
          <li>DCGM 레벨별 정확한 소요 시간·서브테스트 구성 (버전 의존)</li>
          <li>플랫폼별(H100/B200) HPL 권장 NB·N 값과 기대 효율</li>
          <li>mlxlink 축약 플래그 표기 (MFT 버전별)</li>
          <li>nvfwupd 서브커맨드 문법·지원 플랫폼 범위</li>
          <li>mlxcables FW 업데이트 지원 범위 (LinkX 한정 여부)</li>
          <li>imageupdate cmsh 문법 (BCM 버전별)</li>
          <li>DOCA 프로파일 메타패키지 명칭 (DOCA 버전별)</li>
          <li>스위치 OS별(MLNX-OS / NVOS / Cumulus) 버전 확인 명령 정확한 문법</li>
          <li>기종별 핫스왑 지원 범위 (Service Manual)</li>
          <li>공식 번인 시간·반복 횟수 기준 존재 여부</li>
          <li>특정 스토리지 벤더(DDN/VAST/WEKA) 파라미터 출제 여부</li>
          <li>권장 BIOS 값의 구체 수준 (NPS1 vs NPS4 등)</li>
          <li>DCQCN 파라미터 세부의 출제 범위</li>
        </ul>
      </GuideSection>

      <GuideSection title="9-3. 남은 2주 학습 플랜 (예시)" hint="비중이 큰 곳부터, 마지막 3일은 반복·영문·함정">
        <T
          head={['기간', '내용']}
          rows={[
            ['1~4일', 'D1 전체 (2-1 ~ 2-10) + 보충 7-1, 7-2, 7-3'],
            ['5~8일', 'D2 전체 (3-1 ~ 3-11) + 보충 7-5'],
            ['9~10일', 'D3 (4-1 ~ 4-7) + 보충 7-6, 7-7'],
            ['11일', 'D4 + D5 (5-x, 6-x) + 보충 7-4, 7-8, 7-9'],
            ['12일', 'Part 8 치트시트 반복 — 도구↔계층 매칭표를 백지에 재현'],
            ['13일', '영문 모드 통독 (8-4 대조표 + 블루프린트 원문)'],
            ['14일', 'Part 9 함정 20선 + ⚠️ 항목 공식 문서 대조'],
          ]}
        />
      </GuideSection>

      <Part
        id="pa"
        tag="부록"
        title="공식 블루프린트 원문 대조표"
        lead="커버리지 — 공식 bullet 30/30 = 100%"
      />

      <GuideSection title="도메인별 bullet ↔ 본 위키 매핑" hint="공식 문서를 펼쳤을 때 어디를 보면 되는지">
        <T
          head={['도메인', '%', '공식 bullet', '본 위키']}
          rows={[
            ['System and Server Bring-up', '31%', 'Describe sequence of events for deployment and validation', '3-1'],
            ['', '', 'Describe network topologies for AI factories', '3-2'],
            ['', '', 'Perform initial configuration of BMC, OOB, and TPM', '3-3'],
            ['', '', 'Perform firmware upgrades (including HGX) and fault detection', '3-4'],
            ['', '', 'Validate power and cooling parameters', '3-6'],
            ['', '', 'Install GPU-based servers (SMI)', '3-7'],
            ['', '', 'Validate installed hardware', '3-8'],
            ['', '', 'Describe and validate cable types and transceivers', '3-9'],
            ['', '', 'Install physical GPUs', '3-5'],
            ['', '', 'Validate hardware operation for workloads', '3-11 🆕'],
            ['', '', 'Configure initial parameters for third-party storage', '3-10'],
            ['Physical Layer Management', '5%', 'Configure and manage a BlueField network platform', '6-1'],
            ['', '', 'Configure MIG (AI and HPC)', '6-2'],
            ['Control Plane Install & Config', '19%', 'Install BCM, configure and verify HA', '4-1, 4-2'],
            ['', '', 'Install OS', '4-3'],
            ['', '', 'Install Cluster (category, interfaces, Slurm/Enroot/Pyxis)', '4-4'],
            ['', '', 'Install/update/remove NVIDIA GPU and DOCA drivers', '4-5'],
            ['', '', 'Install the NVIDIA container toolkit', '4-6'],
            ['', '', 'Demonstrate how to use NVIDIA GPUs with Docker', '4-6'],
            ['', '', 'Install NGC CLI on hosts', '4-7'],
            ['Cluster Test and Verification', '33%', 'Perform a single-node stress test', '2-1'],
            ['', '', 'Execute HPL', '2-2'],
            ['', '', 'Perform single-node NCCL (incl. verifying NVLink Switch)', '2-3'],
            ['', '', 'Validate cables by verifying signal quality', '2-4'],
            ['', '', 'Confirm cabling is correct', '2-5'],
            ['', '', 'Confirm FW/SW on switches', '2-6'],
            ['', '', 'Confirm FW/SW on BlueField-3', '2-6b'],
            ['', '', 'Confirm FW on transceivers', '2-6c'],
            ['', '', 'Run ClusterKit', '2-7'],
            ['', '', 'Run NCCL to verify E/W fabric bandwidth', '2-8'],
            ['', '', 'Perform NCCL / HPL / NeMo burn-in', '2-9'],
            ['', '', 'Test storage', '2-10'],
            ['Troubleshoot and Optimize', '12%', 'Identify and troubleshoot hardware faults', '5-1'],
            ['', '', 'Identify faulty cards, GPUs, and power supplies', '5-1'],
            ['', '', 'Replace faulty cards, GPUs, and power supplies', '5-2'],
            ['', '', 'Execute performance optimization for AMD and Intel servers', '5-3'],
            ['', '', 'Optimize storage', '5-4'],
          ]}
        />
      </GuideSection>
    </>
  )
}
