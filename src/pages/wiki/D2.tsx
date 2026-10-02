import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 3 — D2 System and Server Bring-up (31%) */
export default function D2() {
  return (
    <>
      <Part
        id="p3"
        tag="PART 3 · D2 31%"
        title="System and Server Bring-up"
        lead="박스에서 꺼낸 서버를 '검증 가능한 GPU 노드'로 만드는 전 과정. 운영자에게 가장 생소한 물리·펌웨어 계층이라 실점이 많다. 블루프린트 bullet 11개가 3-1~3-11에 1:1 대응한다."
      />

      <GuideSection title="3-1. 배포·검증 이벤트 시퀀스" hint="순서 문제의 정답 원본">
        <Cmd>{`1  사이트 준비            전력 용량 · 냉각 · 상면(랙 하중) 확인
2  랙 마운트/물리 장착     서버 · GPU · NIC · 케이블링
3  전원 인가              → BMC 기동 (OS 없이도 BMC는 살아 있음)
4  BMC/OOB 네트워크 구성   → 원격 관리 확보  ★ 이후 모든 작업의 발판
5  펌웨어 인벤토리·업그레이드  BMC · BIOS · HGX 번들 · NIC
6  BIOS/TPM 설정          부팅 순서 · 보안 · 성능 프로파일
7  전력·냉각 파라미터 검증   센서 정상 · 부하 전 기준선 확보
8  OS 프로비저닝(BCM) → 드라이버 → 컨테이너 런타임
9  단일 노드 검증          lspci → nvidia-smi → DCGM diag → HPL/NCCL
10 패브릭 검증 → 멀티노드 검증 → 번인 → 인수인계`}</Cmd>
        <ul className="guide-list">
          <li><strong>OOB(BMC) 확보가 소프트웨어 작업보다 먼저다.</strong> 원격으로 전원·콘솔·펌웨어를 다룰 수 있어야 대규모 배포가 가능하다.</li>
          <li>펌웨어를 안 맞춘 채 OS를 올리면 <strong>드라이버 이상이 펌웨어 문제인지 구분할 수 없다.</strong></li>
          <li>검증은 좁은 범위 → 넓은 범위. 단일 노드 검증 없이 클러스터 테스트를 하면 불량 노드가 패브릭 문제처럼 보인다.</li>
        </ul>
        <p className="guide-note">
          🎯 "OS 설치 직전에 해야 할 일은?" → <strong>펌웨어·BIOS·BMC 구성 완료.</strong>{' '}
          ⚠️ 시험이 특정 문서(DGX SuperPOD/BasePOD 배포 가이드)의 단계 명칭을 그대로 쓰는지는 study guide 대조 필요.
        </p>
      </GuideSection>

      <GuideSection title="3-2. AI 팩토리 네트워크 토폴로지" hint="매칭 문제 단골 — 트래픽 종류로 네트워크를 고르게 한다">
        <T
          head={['네트워크', '트래픽', '매체', '대표 사례']}
          rows={[
            ['컴퓨트 패브릭 (E/W)', 'GPU↔GPU 학습 트래픽 (all-reduce)', 'InfiniBand(Quantum) 또는 Spectrum-X 이더넷', 'NCCL 집합통신'],
            ['스토리지 패브릭', '노드↔스토리지', '고대역 IB / 이더넷 (분리)', '데이터셋 로딩, 체크포인트 저장'],
            ['인밴드 관리 (N/S)', 'OS 레벨 관리', '이더넷', 'PXE 프로비저닝, 사용자 SSH, NGC 다운로드'],
            ['OOB 관리', 'BMC 전용', '저속 이더넷', '원격 전원 제어·센서·펌웨어 업데이트. OS가 죽어도 접근 가능'],
          ]}
        />
        <p className="guide-note">
          🎯 "체크포인트 저장 트래픽은?" → 스토리지 / "원격 펌웨어 업데이트?" → OOB / "all-reduce?" → 컴퓨트.
          <strong> 분리 이유</strong>는 성능 격리 + 장애 격리 + 보안 경계다.
        </p>
        <h3 className="guide-h3">레일 최적화(rail-optimized) 토폴로지</h3>
        <Cmd>{`노드 A [GPU0..7 · NIC0..7]      노드 B [GPU0..7 · NIC0..7]
        │ GPU i ↔ NIC i (레일 정렬)
   ┌────┴────┬─────────┬──────── ...
 Rail0 리프  Rail1 리프  Rail2 리프   (각 리프는 모든 노드의 동일 번호 NIC만 수용)
   └────┬────┴─────────┴────
     스파인 스위치 (팻트리 — 논블로킹/오버섭 비율 설계)`}</Cmd>
        <ul className="guide-list">
          <li>8-GPU 노드는 GPU당 컴퓨트 NIC 1개(총 8개 = 8레일)</li>
          <li><strong>Rail i 리프 스위치는 모든 노드의 NIC i 만 수용</strong> ← 배선 규칙 자체가 출제 포인트</li>
          <li>같은 레일의 GPU끼리는 리프 1홉 통신 → NCCL이 레일 정렬 통신을 우선 사용하므로 스파인 트래픽이 줄어든다</li>
          <li>✅ SU(Scalable Unit) = SuperPOD 증설 단위. DGX A100 = 20노드/SU, DGX H100 = 32노드/SU</li>
        </ul>
        <T
          head={['', 'InfiniBand (Quantum-2)', 'Spectrum-X (Ethernet)']}
          rows={[
            ['무손실', '링크 계층 크레딧 기반 — 태생적 무손실', 'PFC + ECN으로 무손실 구현'],
            ['라우팅', 'SM 중앙 계산', '분산 + 적응형 라우팅(Spectrum-4 + BF-3)'],
            ['집합통신 오프로드', 'SHARP', '텔레메트리 기반 혼잡 제어'],
            ['대표 장비', 'QM9700/9790 (64×400G NDR)', 'SN5600 (64×800G)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="3-3. BMC · OOB · TPM 초기 구성" hint="문제에 '자동화' 또는 '펌웨어 업데이트'가 나오면 답은 Redfish">
        <T
          head={['용어', '정의']}
          rows={[
            ['BMC (Baseboard Management Controller)', '서버 내장 독립 관리 컴퓨터. 호스트 OS와 무관하게 전원 제어·센서·가상 콘솔·펌웨어 업데이트 제공'],
            ['OOB (Out-of-Band)', 'BMC로 접근하는 전용 관리망'],
            ['TPM (Trusted Platform Module)', '키 보관·측정 부팅(Measured/Secure Boot) 지원 보안 칩. BIOS/UEFI에서 활성화'],
          ]}
        />
        <T
          head={['', 'IPMI', 'Redfish']}
          rows={[
            ['성격', '전통 프로토콜', 'RESTful API (HTTPS/JSON) — DMTF 표준'],
            ['도구', 'ipmitool', 'curl, nvfwupd, 벤더 SDK'],
            ['강점', '현장 공용어, 간단', '자동화 · 인벤토리 · 펌웨어 업데이트'],
            ['권장', '레거시/수동 작업', '✅ 최신 DGX/HGX는 Redfish 우선. 보안상 IPMI-over-LAN이 기본 비활성인 플랫폼도 있음'],
          ]}
        />
        <h3 className="guide-h3">초기 구성 체크리스트</h3>
        <ul className="guide-list">
          <li>BMC IP(정적/DHCP) 설정 → OOB 스위치 연결 확인</li>
          <li><strong>기본 계정 비밀번호 변경</strong>, 사용자/권한 생성 ← 보안 필수 단계</li>
          <li>NTP·로그 설정 (SEL 타임스탬프 정합성)</li>
          <li>TPM: BIOS/UEFI에서 활성화, 필요 시 Secure Boot 구성. OS에서 /dev/tpm0 존재·tpm2-tools로 확인</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>ipmitool lan print 1</code>, 'BMC 네트워크 설정 조회'],
            [<code>ipmitool lan set 1 ipaddr &lt;ip&gt; / netmask / defgw ipaddr</code>, 'BMC 정적 IP'],
            [<code>ipmitool user set password &lt;uid&gt; &lt;pw&gt;</code>, '기본 크리덴셜 제거'],
            [<code>ipmitool chassis power status|on|off|cycle</code>, '원격 전원 제어'],
            [<code>ipmitool sol activate</code>, 'Serial-over-LAN 원격 콘솔'],
            [<code>ipmitool sdr list / ipmitool sel elist</code>, '센서 / 이벤트 로그'],
            [<code>curl -k -u admin:&lt;pw&gt; https://&lt;bmc&gt;/redfish/v1/Systems</code>, 'Redfish 인벤토리'],
            ['/redfish/v1/Chassis · /Managers · /UpdateService', '섀시·BMC 자체·펌웨어 업데이트 엔드포인트'],
          ]}
        />
        <p className="guide-note">🎯 "OS가 응답 없는 노드의 콘솔 확인" → BMC SOL / 가상 콘솔.</p>
      </GuideSection>

      <GuideSection title="3-4. 펌웨어 업그레이드 (HGX 포함) 및 결함 탐지" hint="HGX는 펌웨어 번들 단위로 관리한다 — 개별 조각만 업데이트하는 선택지는 오답">
        <Cmd>{`GPU VBIOS / GPU FW
NVSwitch FW  ─────────────┐
HGX 베이스보드 관리 컨트롤러 FW ├─ HGX 펌웨어 번들 (묶음 관리)
서버 BMC FW · BIOS/UEFI
NIC/DPU FW (ConnectX · BlueField)
기타: PSU · 리타이머 · CPLD`}</Cmd>
        <p className="guide-note">
          🪤 벤더가 검증한 조합(버전 매트릭스)을 벗어나면 "가끔 죽는 노드", "특정 조합에서만 나는 링크 오류" 같은
          최악의 간헐 장애가 생긴다.
        </p>
        <Cmd>{`현재 버전 인벤토리 백업
  → 릴리스 노트의 지원 업그레이드 경로 확인
    → 업데이트 실행
      → 재부팅 / 전원 사이클(cold boot)
        → 버전 재확인
          → 기본 검증(dcgmi diag)`}</Cmd>
        <h3 className="guide-h3">결함 탐지 3계층 — 로그 소스 매칭 🎯</h3>
        <T
          head={['계층', '소스', '잡히는 결함']}
          rows={[
            ['BMC', 'SEL (ipmitool sel elist)', '전압·온도·팬·PSU 하드웨어 이벤트'],
            ['OS', 'dmesg의 XID (dmesg -T | grep -i xid)', 'GPU 드라이버 런타임 오류'],
            ['상시', 'DCGM', 'XID·ECC·스로틀링 지표화·알람'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>nvfwupd show_version / nvfwupd update_fw</code>, 'Redfish 경유 플랫폼 FW 조회·업데이트'],
            [<code>ipmitool sel elist</code>, '하드웨어 이벤트 1차 확인'],
            [<code>dmesg -T | grep -i xid</code>, 'GPU XID'],
            [<code>nvidia-smi -q | grep -i -A2 version</code>, 'VBIOS/드라이버/InfoROM 버전 인벤토리'],
            [<code>mlxfwmanager</code>, 'NIC/DPU FW 일괄'],
          ]}
        />
      </GuideSection>

      <GuideSection title="3-5. 물리 GPU 장착" hint="HGX 폼팩터는 GPU가 SXM 모듈로 베이스보드에 통합 — 보드 단위로 취급한다">
        <ul className="guide-list">
          <li>서버 전원 완전 차단 + 방전, <strong>ESD 스트랩 착용</strong> ← 최우선</li>
          <li>슬롯 확인: 대상 슬롯이 <strong>전기적으로 x16</strong>인지(물리 x16이어도 전기 x8인 슬롯 존재), 어느 CPU 소속인지(NUMA 영향)</li>
          <li>라이저/에어플로 방향 확인, 카드 완전 착좌(fully seated) 후 래치 고정</li>
          <li>보조 전원 체결 (8핀 EPS/CEM 또는 12VHPWR 등 카드 규격에 맞게)</li>
          <li>부팅 후 lspci로 버스 인식, LnkSta로 협상 속도/폭 확인</li>
          <li>드라이버 로드 후 nvidia-smi → dcgmi diag -r 2 이상으로 검증</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>lspci -d 10de: -vvv | grep -i lnksta</code>, 'NVIDIA(벤더 ID 10de) 장치의 실제 협상 링크 속도/폭'],
            [<code>dmesg | grep -iE "nvidia|pci"</code>, '장착 직후 커널 인식·오류 메시지'],
          ]}
        />
        <p className="guide-note">
          🎯 증상 매핑 — "간헐 인식 불가" = 덜 꽂힌 카드 / "부하 시 전원 리셋" = 미체결 보조 전원.
        </p>
      </GuideSection>

      <GuideSection title="3-6. 전력·냉각 파라미터 검증" hint="전력·냉각 부족은 즉시 장애가 아니라 '부하 걸면 스로틀링·재부팅'으로 성능 문제처럼 위장한다">
        <ul className="guide-list">
          <li>8-GPU HGX H100 서버 1대 ≈ 10 kW 이상 (공랭 랙은 통상 30~40 kW 한계 → 랙당 2~3노드)</li>
          <li>GB200 NVL72급 액랭 랙은 100 kW+ — CDU·2차 냉각 루프 필수</li>
        </ul>
        <T
          head={['범주', '확인']}
          rows={[
            ['전력', '랙 총 예산 vs 노드 정격 합, PDU 상(phase) 불균형, PSU 이중화 상태(N+1 / N+N), 서버 전력 캡 설정'],
            ['공랭', '흡기(inlet) 온도가 사양 범위 내인지, 핫아일/콜드아일 분리, 팬 속도·고장'],
            ['액랭', '냉각수 공급 온도·유량·누수 센서, CDU 상태'],
            ['GPU 관점', '전력 드로우·온도·스로틀 사유(clocks throttle reasons)'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>ipmitool sdr list / ipmitool sensor</code>, 'BMC 센서 일람 — 온도·팬·전압·전력'],
            [<code>ipmitool dcmi power reading</code>, '서버 소비 전력 판독 (DCMI 지원 시)'],
            [<code>nvidia-smi -q -d POWER,TEMPERATURE,PERFORMANCE</code>, 'GPU 전력/온도/스로틀 사유'],
            [<code>nvidia-smi -pl &lt;W&gt;</code>, 'GPU 전력 상한 설정 (전력 예산 맞춤)'],
            [<code>dcgmi dmon -e 150,155</code>, '✅ 온도(150)·전력(155) 실시간 스트리밍'],
            [<code>nvidia-smi -lgc &lt;min,max&gt;</code>, '🆕 클럭 고정 — 벤치마크 재현성 확보'],
          ]}
        />
        <p className="guide-note">
          부하 전 정상값을 <strong>기준선(baseline)</strong>으로 기록해 두고 HPL 부하 중 값과 비교해 이상 노드를 찾는다.
        </p>
      </GuideSection>

      <GuideSection title="3-7. GPU 서버 설치 확인 — nvidia-smi (SMI)" hint="✅ -d PCIE는 존재하지 않는 옵션이다">
        <T
          head={['명령', '용도']}
          rows={[
            [<code>nvidia-smi</code>, 'GPU 인식·드라이버/CUDA 버전·사용률 (개수부터 확인)'],
            [<code>nvidia-smi -q</code>, '✅ 전체 상세 — PCIe 세대·링크 폭은 GPU Link Info 절에 있다'],
            [<code>nvidia-smi --query-gpu=pcie.link.gen.max,pcie.link.gen.current,pcie.link.width.current --format=csv</code>, '✅ PCIe 협상 상태를 표로'],
            [<code>lspci -d 10de: -vvv | grep LnkSta</code>, '드라이버와 무관하게 버스 레벨에서 확인'],
            [<code>nvidia-smi -q -d ECC / nvidia-smi -e 1</code>, 'ECC 상태 확인 / 활성화'],
            [<code>nvidia-smi -pm 1</code>, '퍼시스턴스 모드 활성 (드라이버 상주 — 초기화 지연 제거, 프로덕션 권장)'],
            [<code>nvidia-smi topo -m</code>, 'GPU/NIC 토폴로지가 설계(레일 정렬)와 일치하는지'],
            [<code>nvidia-smi -L</code>, 'GPU/MIG UUID 목록'],
          ]}
        />
        <p className="guide-note">
          ✅ <code>-q -d</code>에 쓸 수 있는 값 전체: MEMORY, UTILIZATION, ECC, TEMPERATURE, POWER, CLOCK, COMPUTE, PIDS,
          PERFORMANCE, SUPPORTED_CLOCKS, PAGE_RETIREMENT, ACCOUNTING, ENCODER_STATS, SUPPORTED_GPU_TARGET_TEMP, VOLTAGE,
          FBC_STATS, ROW_REMAPPER, RESET_STATUS, GSP_FIRMWARE_VERSION.
        </p>
      </GuideSection>

      <GuideSection title="3-8. 설치 하드웨어 검증" hint="3-7이 'GPU가 보이는가'라면 여기는 '전 구성요소가 BOM·설계와 일치하는가'">
        <T
          head={['대상', '확인 방법', '기대값']}
          rows={[
            ['GPU 개수·모델', 'nvidia-smi -L', '설계 수량, 동일 모델'],
            ['GPU PCIe 링크', 'nvidia-smi -q (GPU Link Info)', 'Gen5 x16 (플랫폼 사양)'],
            ['NVLink', 'nvidia-smi nvlink --status', '전 링크 Up, 동일 속도'],
            ['NVSwitch/FM', 'systemctl status nvidia-fabricmanager', 'active (HGX)'],
            ['NIC/DPU', 'mst status, ibstat, lspci -d 15b3:', '수량·포트·속도'],
            ['메모리', 'dmidecode -t memory, free -h', '채널 균형·총량'],
            ['CPU', 'lscpu', '코어 수·NUMA 노드 수'],
            ['디스크', 'lsblk, nvme list', '수량·용량·모델'],
            ['BIOS/FW', 'dmidecode -t bios, nvfwupd show_version', '클러스터 표준 번들'],
            ['시리얼/자산', 'nvidia-smi -q | grep -i serial, dmidecode -s system-serial-number', '자산 대장 일치'],
          ]}
        />
        <p className="guide-note">
          🎯 동일 사양이어야 할 노드 사이의 <strong>"차이"</strong>를 찾는 것이 이 단계의 목적. 대량 배포에서는 위 항목을
          스크립트로 전 노드 수집 후 diff한다.
        </p>
      </GuideSection>

      <GuideSection title="3-9. 케이블·트랜시버 유형 검증" hint="선택 기준 = 거리 × 비용 × 전력">
        <T
          head={['유형', '구조', '도달 거리', '특징', '용도']}
          rows={[
            ['DAC (passive)', '구리 일체형', '~2 m', '최저가·최저전력·최저지연', '랙 내 서버↔ToR'],
            ['ACC (Active Copper)', '구리 + 신호 재생 칩', '~3~5 m', '800G급에서 구리 거리 연장', '랙 내 장거리'],
            ['AOC (Active Optical Cable)', '광섬유 + 트랜시버 일체형', '~수십 m', '커넥터 오염 관리 불필요, 파손 시 통째 교체', '랙 간'],
            ['트랜시버 + 파이버', '분리형 (OSFP/QSFP112 + MPO/MTP)', '~수백 m', '유연, 단 청결·삽입손실 관리 필요', '스위치 간 장거리'],
          ]}
        />
        <T
          head={['세대', '속도', '폼팩터']}
          rows={[
            ['EDR', '100 Gb/s', 'QSFP28'],
            ['HDR', '200 Gb/s', 'QSFP56'],
            ['NDR', '400 Gb/s', 'OSFP 중심 — 스위치 쪽은 twin-port OSFP(케이지 1개에 2×400G), HCA 쪽 OSFP/QSFP112'],
            ['XDR', '800 Gb/s', 'OSFP'],
          ]}
        />
        <p className="guide-note">Quantum-2(QM9700)는 32개 OSFP 케이지 × 2포트 = 64×400G.</p>
        <h3 className="guide-h3">🆕 검수(validate) 절차</h3>
        <ul className="guide-list">
          <li><strong>입고 검수</strong>: 케이블 라벨·파트넘버(P/N)로 속도·커넥터·길이 대조</li>
          <li><strong>장착 후 인식</strong>: mlxcables로 타입·시리얼·FW 조회</li>
          <li><strong>모듈 상세</strong>: mlxlink --show_module — 타입, 온도, 광 전력(Tx/Rx power)</li>
          <li><strong>품질</strong>: mlxlink --show_eye로 BER/eye (→ 2-4)</li>
          <li>광 취급 수칙: 커넥터 페룰 검사 후 청소, 최소 곡률 반경 준수, 미사용 포트 더스트캡</li>
        </ul>
      </GuideSection>

      <GuideSection title="3-10. 서드파티 스토리지 초기 파라미터 구성" hint="기본값 NFS 마운트로는 GPU 노드의 수십 GB/s 요구를 못 채운다">
        <T
          head={['영역', '항목']}
          rows={[
            ['네트워크', '스토리지 전용 패브릭 사용, 점보 프레임(MTU 9000) 엔드투엔드 정합, 필요 시 RDMA(RoCE/IB) 활성'],
            ['NFS 계열', 'nconnect(다중 TCP 연결), rsize/wsize 상향, 버전(v3 / v4.1 pNFS), NFSoRDMA 지원 시 proto=rdma'],
            ['병렬 FS (Lustre/GPFS/WEKA 등)', '전용 클라이언트 설치, 스트라이프/풀 정책, 클라이언트 캐시 파라미터'],
            ['마운트 지점', '모든 노드 동일 경로(/data, /home) — BCM 카테고리로 일괄 관리'],
            ['GDS', 'GPUDirect Storage — 스토리지→GPU 직접 DMA. 지원 여부는 벤더 매트릭스'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mount -o rsize=1048576,wsize=1048576,nconnect=16 srv:/data /data</code>, '고성능 NFS 마운트 예시'],
            [<code>nfsstat -m</code>, '실제 적용된 마운트 옵션 확인'],
            [<code>ip link show | grep mtu</code>, 'MTU 정합 확인'],
          ]}
        />
        <p className="guide-note">
          🎯 nconnect/rsize/wsize의 목적 = <strong>병렬화로 단일 TCP 연결 한계 돌파.</strong>{' '}
          ⚠️ 특정 벤더(DDN/VAST/WEKA) 고유 파라미터 출제 여부는 study guide 확인.
        </p>
      </GuideSection>

      <GuideSection title="3-11. 🆕 워크로드 기반 하드웨어 동작 검증" hint='블루프린트 bullet "Validate hardware operation for workloads" 직접 대응'>
        <p className="guide-desc">
          합성 진단(DCGM/HPL/NCCL)은 <strong>부품이 사양대로 동작하는가</strong>를 본다. 그러나 인수 판정의 마지막 단계는
          <strong> "실제 AI 워크로드가 정상 속도로 도는가"</strong>다.
        </p>
        <h3 className="guide-h3">합성 테스트가 못 잡는 것들</h3>
        <ul className="guide-list">
          <li>데이터로더 병목 (스토리지 IOPS ↔ CPU 워커 수 불균형) → GPU 사용률이 주기적으로 뚝뚝 떨어짐</li>
          <li>체크포인트 쓰기 중 전 노드 stall</li>
          <li>장시간 학습에서만 나타나는 메모리 누수·ECC 누적</li>
          <li>CPU-GPU NUMA 오정렬로 인한 H2D 병목</li>
          <li>컨테이너/드라이버/CUDA 버전 조합 문제</li>
        </ul>
        <T
          head={['단계', '방법']}
          rows={[
            ['1. 스모크 테스트', 'docker run --gpus all nvcr.io/nvidia/pytorch:TAG python -c "import torch; print(torch.cuda.device_count())"'],
            ['2. 단일 노드 학습', 'NGC PyTorch/NeMo 컨테이너로 소형 모델 1~2 에폭'],
            ['3. 멀티노드 학습', 'NeMo Framework 사전학습 벤치마크 — 참조 스루풋(tokens/sec, step time)과 비교'],
            ['4. 관찰', 'DCGM으로 GPU 사용률·전력·NVLink·스로틀 동시 수집'],
            ['5. 판정', '참조 성능 대비 % + 노드 간 편차 + 장시간 안정성'],
          ]}
        />
        <p className="guide-note">
          🎯 인수 판정은 "PASS/FAIL"이 아니라 <strong>참조 성능 대비 %와 노드 간 편차</strong>다.
          GPU 사용률의 주기적 하락은 GPU 결함이 아니라 <strong>데이터 로딩 병목</strong> 신호.
        </p>
      </GuideSection>
    </>
  )
}
