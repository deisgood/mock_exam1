import { Cmd, GuideSection, Part, T } from '../parts'

/** 1. System and Server Bring-up (31%) — 1-1 ~ 1-11 */
export default function S1() {
  return (
    <>
      <Part
        id="b1"
        tag="SECTION 1 · 31%"
        title="System and Server Bring-up"
        lead='"Bring-up"은 동사구 bring up(작동시키다)에서 온 하이픈 명사. 엔지니어링 영어로는 새 하드웨어를 처음 전원 넣고 동작 상태까지 올리는 전 과정을 뜻한다.'
      />

      <GuideSection title="섹션 제목 해부 — bring-up" hint="일반 영어와 엔지니어링 영어의 뜻이 다르다">
        <ul className="guide-list">
          <li>일반 영어: bring up = ① (화제를) 꺼내다 ② (아이를) 키우다</li>
          <li>엔지니어링: 새 하드웨어·시스템을 처음으로 전원 넣고 동작하는 상태까지 올리는 전 과정</li>
          <li>예: <em>The board bring-up took three weeks.</em> (보드 초기 기동 작업에 3주가 걸렸다)</li>
          <li>유사 표현: power-on, commissioning(시운전), provisioning(자원 할당·준비)</li>
        </ul>
      </GuideSection>

      <GuideSection title="1-1. Describe sequence of events for deployment and validation." hint="직역 — 배포와 검증을 위한 이벤트의 순서를 설명하라">
        <T
          head={['단어', '발음', '의미', '맥락']}
          rows={[
            ['sequence', '/ˈsiːkwəns/', '순서, 연속', '시간 순서대로 이어지는 것'],
            ['event', '/ɪˈvent/', '사건, 단계', '여기선 "행사"가 아니라 작업 단계'],
            ['deployment', '/dɪˈplɔɪmənt/', '배포, 전개', '동사 deploy. 원래 군사용어(부대 전개)'],
            ['validation', '/ˌvælɪˈdeɪʃn/', '검증', '동사 validate, 형용사 valid'],
          ]}
        />
        <p className="guide-note">
          <strong>문법 포인트</strong> — sequence of events는 of로 연결된 명사구. <em>for A and B</em>는 "A와 B를 위한"으로
          앞의 sequence를 수식한다.
        </p>
        <Cmd>{`Rack & Stack (랙 설치) → Power-on → BMC/OOB 설정 → Firmware 업데이트
→ OS 설치 → Driver 설치 → Cluster 구성 → Validation (HPL/NCCL)`}</Cmd>
        <p className="guide-note">
          응용 문장: <em>You must complete firmware upgrades prior to OS installation.</em>{' '}
          (OS 설치 전에 펌웨어 업그레이드를 완료해야 한다.) — <strong>prior to = before의 격식체.</strong> 기술문서에 매우 자주 등장.
        </p>
      </GuideSection>

      <GuideSection title="1-2. Describe network topologies for AI factories." hint="AI factory = 데이터를 넣으면 지능을 찍어내는 공장 (NVIDIA 마케팅 용어)">
        <T
          head={['단어', '의미', '설명']}
          rows={[
            ['topology /təˈpɒlədʒi/', '토폴로지', '망 구성 형태 (물리적/논리적 연결 구조)'],
            ['AI factory', 'AI 팩토리', 'NVIDIA의 마케팅 용어'],
          ]}
        />
        <h3 className="guide-h3">반드시 알아야 할 3개 네트워크 평면</h3>
        <T
          head={['영어', '한글', '역할']}
          rows={[
            ['Compute fabric (= East-West network)', '연산 패브릭', 'GPU ↔ GPU 통신. InfiniBand/RoCE'],
            ['Storage fabric', '스토리지 망', '노드 ↔ 스토리지'],
            ['In-band management', '인밴드 관리망', 'OS가 살아있을 때의 관리 트래픽'],
            ['Out-of-band (OOB)', '아웃오브밴드', 'OS와 무관하게 BMC로 직접 접근'],
          ]}
        />
        <p className="guide-note">
          <strong>East-West vs North-South — 시험 단골.</strong> East-West traffic = 데이터센터 내부 서버 간 트래픽(좌우 방향),
          AI 학습의 핵심. North-South traffic = 데이터센터 외부와 주고받는 트래픽(상하 방향).
        </p>
        <T
          head={['토폴로지 용어', '의미']}
          rows={[
            ['Fat-tree / Spine-Leaf', '스파인(척추) 스위치와 리프(잎) 스위치의 2계층 구조'],
            ['Rail-optimized', '각 노드의 같은 번호 GPU끼리 같은 스위치에 묶는 방식. rail = "동일 인덱스 GPU들의 전용 경로"'],
            ['Non-blocking', '막힘 없는. 모든 포트가 동시에 최대 대역폭을 낼 수 있는 설계'],
            ['Oversubscription', '초과 가입/과다 할당. 업링크 대역폭이 다운링크보다 적은 상태'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-3. Perform initial configuration of BMC, OOB, and TPM." hint="약어 완전 해부">
        <T
          head={['약어', '풀네임', '읽기', '의미']}
          rows={[
            ['BMC', 'Baseboard Management Controller', '비엠씨', '서버 메인보드에 박힌 독립 마이크로컨트롤러. 서버 전원이 꺼져 있어도 살아있음'],
            ['OOB', 'Out-of-Band (management)', '아웃오브밴드', '정규 네트워크 바깥의 별도 관리 경로'],
            ['TPM', 'Trusted Platform Module', '티피엠', '암호키를 저장하는 보안 칩'],
          ]}
        />
        <ul className="guide-list">
          <li><strong>baseboard</strong> = base(기반) + board(기판) → 메인보드</li>
          <li><strong>out-of-band</strong>: band = 주파수 대역 → "정규 통신 대역 밖". 반대말 in-band</li>
          <li><strong>trusted</strong> = trust(신뢰하다)의 과거분사 → "신뢰된, 신뢰 기반의"</li>
        </ul>
        <p className="guide-note">
          <em>The BMC remains powered even when the host is powered off, which allows administrators to power-cycle the
          server remotely.</em> (BMC는 호스트 전원이 꺼져 있어도 전원이 유지되어, 관리자가 원격으로 서버를 전원 재투입할 수 있게 한다.)
        </p>
        <T
          head={['동사구', '의미']}
          rows={[
            ['power-cycle', '전원을 껐다 켜다 (동사로 씀) — "Power-cycle the node."'],
            ['power on / power off', '전원 인가 / 차단'],
            ['cold boot', '완전 전원 차단 후 부팅'],
            ['warm boot / reboot', '재시작'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-4. Perform firmware upgrades (including on HGX) and fault detection." hint="fault 계열 어휘 구분이 시험에 나온다">
        <T
          head={['단어', '의미', '뉘앙스']}
          rows={[
            ['firmware', '펌웨어', 'firm(단단한) + ware → 하드웨어에 내장된 소프트웨어'],
            ['upgrade', '업그레이드', '더 높은 버전으로'],
            ['update', '업데이트', '최신으로 갱신 (upgrade보다 작은 변화)'],
            ['flash (동사)', '플래시하다', '펌웨어를 칩에 굽다'],
            ['fault', '결함, 고장', 'error(오류)보다 하드웨어적 고장에 가까움'],
            ['detection', '탐지', '동사 detect'],
          ]}
        />
        <T
          head={['영어', '한글', '뜻']}
          rows={[
            ['fault', '결함', '고장의 원인이 되는 물리적 결함'],
            ['error', '오류', '결함으로 인해 발생한 잘못된 상태'],
            ['failure', '장애', '기능이 정지된 상태'],
            ['degradation', '성능 저하', '죽진 않았지만 느려진 상태'],
            ['fault tolerance', '결함 감내', '고장이 나도 계속 동작하는 능력'],
            ['RAS', 'Reliability, Availability, Serviceability', '신뢰성·가용성·정비성'],
          ]}
        />
        <p className="guide-note">
          HGX = NVIDIA의 GPU 베이스보드 플랫폼(예: HGX H100 = 8개 GPU + NVSwitch가 얹힌 보드).
          <em> Use nvfwupd to flash the HGX baseboard firmware bundle.</em> — <strong>bundle = 묶음.</strong> 여러 컴포넌트
          펌웨어를 한 파일로 묶은 것.
        </p>
      </GuideSection>

      <GuideSection title="1-5. Validate power and cooling parameters." hint="전력·냉각 필수 어휘">
        <T
          head={['영어', '한글', '설명']}
          rows={[
            ['PSU (Power Supply Unit)', '전원 공급 장치', ''],
            ['PDU (Power Distribution Unit)', '전력 분배 장치', '랙 안에서 콘센트를 나눠주는 장치'],
            ['redundancy', '이중화', '하나 죽어도 되게 여분을 둠'],
            ['N+1 redundancy', 'N+1 이중화', '필요한 N개 + 예비 1개'],
            ['rated power / TDP', '정격 전력 / 열설계전력', 'Thermal Design Power'],
            ['draw (동사/명사)', '소비하다 / 소비량', '"The node draws 10.2 kW"'],
            ['airflow', '공기 흐름', ''],
            ['front-to-back airflow', '전면흡기 후면배기', ''],
            ['hot aisle / cold aisle', '온복도 / 냉복도', '데이터센터 배치 방식'],
            ['liquid cooling', '액랭', '↔ air cooling (공랭)'],
            ['DLC (Direct Liquid Cooling)', '직접 액랭', ''],
            ['CDU (Coolant Distribution Unit)', '냉각수 분배 장치', ''],
            ['inlet temperature', '흡입 온도', 'inlet(입구) ↔ outlet(출구)'],
            ['thermal throttling', '온도에 의한 성능 제한', 'throttle = 조이다, 목을 죄다'],
          ]}
        />
        <p className="guide-note">
          <em>If the GPU exceeds its thermal threshold, the driver will throttle the clock speed to prevent damage.</em>{' '}
          — exceed = 초과하다 / threshold /ˈθreʃhoʊld/ = 임계값 / prevent = 방지하다.
        </p>
      </GuideSection>

      <GuideSection title="1-6. Install GPU-based servers (SMI)." hint="SMI = System Management Interface → nvidia-smi">
        <p className="guide-note">
          <strong>GPU-based의 문법</strong> — 명사 + -based = "~을 기반으로 한". 하이픈으로 묶여 형용사가 된다.
          cloud-based service / rack-based deployment / x86-based server.
        </p>
        <T
          head={['nvidia-smi 필드', '의미']}
          rows={[
            ['Persistence-M', 'Persistence Mode — 드라이버를 메모리에 상주시켜 초기화 지연 제거'],
            ['Bus-Id', 'PCIe 버스 주소'],
            ['Disp.A', 'Display Active — 디스플레이 연결 여부'],
            ['Volatile Uncorr. ECC', '휘발성 정정불가 ECC 오류 수'],
            ['Compute M.', 'Compute Mode (Default / Exclusive_Process / Prohibited)'],
            ['Pwr:Usage/Cap', '현재 소비전력 / 상한'],
            ['MIG M.', 'MIG 모드 활성 여부'],
          ]}
        />
        <ul className="guide-list">
          <li><strong>Correctable error</strong> (정정 가능 오류): 자동 복구됨. 무시 가능</li>
          <li><strong>Uncorrectable error</strong> (정정 불가 오류): 심각. 카드 교체 신호</li>
          <li><strong>Row remapping</strong> (행 재매핑): 불량 메모리 행을 예비 행으로 대체하는 기능</li>
        </ul>
      </GuideSection>

      <GuideSection title="1-7. Validate installed hardware." hint="installed = 과거분사가 형용사로 쓰인 것 = 설치된">
        <Cmd>{`lspci        # list PCI devices — PCI 장치 목록
dmidecode    # DMI(하드웨어 정보 테이블) 디코드
ipmitool     # IPMI 인터페이스 도구
nvidia-smi topo -m   # topology matrix — GPU 간 연결 구조 행렬`}</Cmd>
        <T
          head={['topo -m 약어', '의미']}
          rows={[
            ['NV#', 'NVLink로 #개 링크 연결됨 (가장 빠름)'],
            ['PIX', '같은 PCIe 스위치를 지남'],
            ['PXB', '여러 PCIe 스위치를 지남'],
            ['PHB', 'PCIe Host Bridge를 지남'],
            ['SYS', 'CPU 소켓 간(QPI/UPI)을 넘어감 (가장 느림)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-8. Describe and validate cable types and transceivers." hint="transceiver = transmit + receiver 합성어">
        <T
          head={['약어', '풀네임', '한글', '특징']}
          rows={[
            ['DAC', 'Direct Attach Copper', '직결 구리 케이블', '짧은 거리(~3m), 저렴, 저전력'],
            ['ACC', 'Active Copper Cable', '액티브 구리 케이블', '신호증폭 칩 내장, ~5m'],
            ['AOC', 'Active Optical Cable', '액티브 광 케이블', '광섬유 일체형, 장거리(~100m)'],
            ['Transceiver + MPO fiber', '분리형 광모듈 + 광점퍼', '분리형', '가장 유연, 가장 비쌈'],
          ]}
        />
        <ul className="guide-list">
          <li>passive (수동) ↔ active (능동, 전원을 쓰는 증폭 회로 포함)</li>
          <li>MPO/MTP = Multi-fiber Push-On, 다심 광커넥터</li>
          <li>OSFP / QSFP-DD = 800G/400G 광모듈 폼팩터. OSFP = Octal Small Form-factor Pluggable (octal=8배)</li>
          <li>finned-top OSFP = 방열핀이 달린 OSFP (공랭 스위치용) / flat-top OSFP = 평평한 OSFP (액랭·서버 측)</li>
        </ul>
      </GuideSection>

      <GuideSection title="1-9. Install physical GPUs." hint="하드웨어 설치 동사 모음 — 실무 영어">
        <T
          head={['영어', '한글']}
          rows={[
            ['seat / reseat', '자리에 꽂다 / 뺐다 다시 꽂다'],
            ['slot in', '슬롯에 끼우다'],
            ['latch', '걸쇠로 잠그다'],
            ['fasten / secure', '고정하다'],
            ['torque to spec', '규정 토크로 조이다'],
            ['ground yourself / wear an ESD strap', '접지하다 / 정전기 방지 밴드 착용'],
            ['rack and stack', '랙에 장비를 넣고 쌓다'],
          ]}
        />
        <p className="guide-note">
          ESD = Electrostatic Discharge (정전기 방전). 안전 경고문 단골.
          <strong> Reseat the card</strong> = "카드를 뺐다 다시 꽂아라" — 접촉 불량 1차 조치의 표준 표현.
        </p>
      </GuideSection>

      <GuideSection title="1-10. Validate hardware operation for workloads." hint="workload = 처리해야 할 일 그 자체">
        <ul className="guide-list">
          <li>training workload (학습 작업) ↔ inference workload (추론 작업)</li>
          <li>synthetic workload (합성/인공 부하 — 벤치마크용) ↔ production workload (실제 운영 부하)</li>
          <li><strong>under load</strong> = 부하가 걸린 상태에서 — <em>The GPU temperature reaches 78°C under sustained load.</em></li>
        </ul>
      </GuideSection>

      <GuideSection title="1-11. Configure initial parameters for third-party storage." hint="third party = 나(first)·상대방(second)이 아닌 그 외 외부 업체">
        <T
          head={['영어', '한글']}
          rows={[
            ['parallel file system', '병렬 파일 시스템 (Lustre, GPFS)'],
            ['mount / mount point', '마운트(연결)하다 / 마운트 지점'],
            ['NFS (Network File System)', '네트워크 파일 시스템'],
            ['NVMe-oF (NVMe over Fabrics)', '패브릭 상의 NVMe'],
            ['GDS / GPUDirect Storage', '스토리지 → GPU 메모리 직접 전송 (CPU 우회)'],
            ['throughput', '처리량 (GB/s)'],
            ['IOPS', 'Input/Output Operations Per Second, 초당 입출력 횟수'],
            ['latency', '지연 시간'],
            ['bypass the CPU', 'CPU를 우회하다'],
          ]}
        />
        <p className="guide-note">
          <strong>Throughput vs Latency vs Bandwidth — 혼동 주의.</strong> Bandwidth = 이론적 최대 통로 폭 /
          Throughput = 실제로 흘러간 양 / Latency = 한 건이 도착하는 데 걸린 시간.
        </p>
      </GuideSection>
    </>
  )
}
