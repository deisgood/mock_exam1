import { Cmd, GuideSection, Part, T } from '../parts'

/** 4. Cluster Test and Verification (33%) · 5. Troubleshoot and Optimize (12%) */
export default function S45() {
  return (
    <>
      <Part
        id="b4"
        tag="SECTION 4 · 33%"
        title="Cluster Test and Verification"
        lead="★ 최대 비중. 스트레스 테스트·벤치마크·케이블 무결성·펌웨어 검증·대역폭 확인의 영어가 모두 여기 모인다."
      />

      <GuideSection title="4-1. Perform a single-node stress test." hint="burn-in의 어원 — 죽을 놈은 출고 전에 죽게 만든다">
        <T
          head={['영어', '한글']}
          rows={[
            ['single-node', '단일 노드 (↔ multi-node 다중 노드)'],
            ['stress test', '스트레스 테스트 — 한계까지 부하를 걸어 견디는지 확인'],
            ['soak test', '장시간 지속 부하 테스트 (soak = 담그다)'],
            ['burn-in', '번인 — 초기 불량을 걸러내기 위한 장시간 가동'],
          ]}
        />
        <p className="guide-note">
          burn in = "태워 넣다". 전자부품은 초기에 고장이 몰린다(<strong>infant mortality</strong>, 초기 고장).
          관련 곡선은 <strong>bathtub curve</strong>(욕조 곡선) — 초기고장↘ 안정기→ 마모고장↗.
          이 문서에 NCCL burn-in, HPL burn-in, NeMo burn-in이 반복된다.
        </p>
      </GuideSection>

      <GuideSection title="4-2. Execute HPL (High-Performance Linpack)." hint="TOP500 슈퍼컴퓨터 순위의 기준 벤치마크">
        <T
          head={['단어', '의미']}
          rows={[
            ['Linpack', 'Linear Algebra Package. 선형대수 연산 라이브러리에서 유래'],
            ['FLOPS', 'Floating-Point Operations Per Second, 초당 부동소수점 연산'],
            ['R_peak', '이론 최대 성능 (theoretical peak)'],
            ['R_max', '실측 최대 성능 (achieved maximum)'],
            ['efficiency', '효율 = R_max / R_peak'],
          ]}
        />
        <p className="guide-note">
          <em>HPL solves a dense system of linear equations and reports the sustained performance in TFLOPS.</em>{' '}
          — dense = 조밀한 (↔ sparse 희소한) / sustained = 지속적인 (↔ peak 순간 최대).
        </p>
        <p className="guide-desc">
          해석 포인트: HPL은 연산+메모리+전력+냉각을 동시에 극한으로 밀기 때문에 <strong>노드 하드웨어 건전성 판정</strong>에
          최적이다. 어떤 노드만 유독 낮으면 → 그 노드에 문제.
        </p>
      </GuideSection>

      <GuideSection title="4-3. Perform single-node NCCL (including verifying NVLink Switch)." hint='NCCL /ˈnɪkəl/ "니클"'>
        <T
          head={['Collective 연산', '한글', '동작']}
          rows={[
            ['All-Reduce', '올리듀스', '모든 GPU의 값을 합산 후 모두에게 결과 배포. 분산 학습의 핵심'],
            ['Reduce', '리듀스', '합산 후 한 GPU에만'],
            ['Broadcast', '브로드캐스트', '한 GPU의 값을 모두에게'],
            ['All-Gather', '올게더', '각자의 조각을 모아 모두가 전체를 가짐'],
            ['Reduce-Scatter', '리듀스스캐터', '합산 후 조각내어 나눠 가짐'],
            ['All-to-All', '올투올', '모두가 모두에게 서로 다른 데이터 전송 (MoE에 필수)'],
          ]}
        />
        <ul className="guide-list">
          <li>NVLink = GPU 간 초고속 직결 인터커넥트</li>
          <li>NVSwitch = NVLink 트래픽을 교환하는 스위치 칩</li>
          <li>NVLink Switch (NVL Switch) = 랙 단위로 NVLink를 확장하는 외부 스위치</li>
          <li>상태 확인: <code>nvidia-smi nvlink -s</code></li>
        </ul>
        <T
          head={['영어', '한글', '설명']}
          rows={[
            ['algbw (algorithm bandwidth)', '알고리즘 대역폭', '데이터 크기 ÷ 시간 (단순 계산)'],
            ['busbw (bus bandwidth)', '버스 대역폭', '실제 링크에 흐른 양. 하드웨어 판정은 이 값으로'],
          ]}
        />
        <p className="guide-note">
          <strong>왜 busbw를 보나?</strong> All-Reduce는 내부적으로 데이터를 여러 번 주고받으므로 실제 링크 트래픽이
          algbw보다 크다. 하드웨어가 정상인지 보려면 busbw를 이론 대역폭과 비교해야 한다.
          테스트 도구는 nccl-tests → all_reduce_perf, all_gather_perf 등.
        </p>
      </GuideSection>

      <GuideSection title="4-4. Validate cables by verifying signal quality." hint="by + 동명사 = ~함으로써 (수단·방법을 나타내는 핵심 구문)">
        <T
          head={['영어', '한글', '설명']}
          rows={[
            ['BER (Bit Error Rate)', '비트 오류율', '낮을수록 좋음. 예: 1e-15'],
            ['Raw BER / Effective BER', '정정 전 / 정정 후 오류율', 'FEC 적용 전후'],
            ['FEC (Forward Error Correction)', '순방향 오류 정정', '수신 측에서 스스로 오류 복구'],
            ['SNR (Signal-to-Noise Ratio)', '신호 대 잡음비', '높을수록 좋음'],
            ['eye diagram / eye margin', '아이 다이어그램 / 아이 마진', '신호 파형의 "눈" 개폐 정도 = 여유'],
            ['link flap', '링크 플랩', '링크가 올라갔다 내려갔다 반복 (flap=퍼덕이다)'],
            ['CRC error', '순환중복검사 오류', '프레임 손상'],
            ['symbol error', '심볼 오류', ''],
            ['attenuation / insertion loss', '감쇠 / 삽입 손실', '신호가 약해짐'],
            ['Rx power / Tx power', '수광/발광 파워 (dBm)', '광모듈 상태 판단'],
          ]}
        />
        <Cmd>{`mlxlink   -d <device> -m -e -c   # link status, eye/BER 정보
mlxcables -d <device>            # 케이블/트랜시버 정보
ibdiagnet                        # InfiniBand 패브릭 전체 진단

-m = module info (모듈 정보)   -e = eye info   -c = counters (카운터)`}</Cmd>
        <p className="guide-note">
          <em>A high raw BER combined with frequent link flaps is indicative of a marginal cable that should be
          replaced.</em> — <strong>be indicative of</strong> = ~을 나타내다/시사하다 (진단 문서 상투구) /
          <strong> marginal</strong> = 아슬아슬한, 규격 경계에 걸친 → 완전 고장은 아니지만 못 믿을.
        </p>
      </GuideSection>

      <GuideSection title="4-5. Confirm cabling is correct." hint="cabling = 배선 (케이블 배치 전체를 가리키는 불가산 명사)">
        <T
          head={['영어', '한글']}
          rows={[
            ['miscabling', '잘못된 배선'],
            ['cable map / wiring diagram', '배선도'],
            ['as-built documentation', '실제 시공 상태 문서'],
            ['port mapping', '포트 매핑'],
            ['LLDP (Link Layer Discovery Protocol)', '이웃 장비 자동 발견 프로토콜'],
            ['rail alignment', '레일 정렬 — GPU N번은 스위치 N번에'],
          ]}
        />
        <ul className="guide-list">
          <li>UFM = Unified Fabric Manager. NVIDIA의 InfiniBand 패브릭 관리 도구</li>
          <li>subnet manager (SM) = InfiniBand 망의 라우팅을 결정하는 관리자 프로세스. <strong>반드시 하나는 살아있어야 함</strong></li>
        </ul>
        <p className="guide-note">
          <em>Rail-optimized topologies require that GPU n on every node connect to the same leaf switch; a miscabled rail
          will show asymmetric NCCL bandwidth.</em> — <strong>asymmetric</strong> = 비대칭의 ★ 성능 문제 진단의 핵심 단서.
        </p>
      </GuideSection>

      <GuideSection title="4-6~8. Confirm FW/SW on switches / BlueField-3 / transceivers." hint="intermittent — 트러블슈팅 최다 빈출 형용사">
        <T
          head={['영어', '한글']}
          rows={[
            ['version drift', '버전 불일치가 벌어짐 (drift = 표류)'],
            ['baseline', '기준선 — 모두가 맞춰야 할 표준 버전'],
            ['golden image', '표준 검증 이미지'],
            ['inventory', '자산 목록 조사'],
            ['audit', '감사, 대조 점검'],
            ['out of sync', '동기화 어긋남'],
            ['mismatch', '불일치'],
          ]}
        />
        <p className="guide-note">
          <em>Version mismatches across the fabric can cause intermittent link failures that are difficult to
          reproduce.</em> — intermittent /ˌɪntəˈmɪtnt/ = 간헐적인 / reproduce = 재현하다.
        </p>
        <Cmd>{`flint  -d <dev> q          # query firmware version (Mellanox/NVIDIA 펌웨어 도구)
mlxfwmanager --query       # 설치된 모든 장치 펌웨어 조회
mst status                 # Mellanox Software Tools 장치 목록`}</Cmd>
      </GuideSection>

      <GuideSection title="4-9. Run ClusterKit to perform a multifaceted node assessment." hint="to + 동사원형 = 목적의 부정사 (~하기 위해)">
        <T
          head={['단어', '발음', '의미']}
          rows={[
            ['multifaceted', '/ˌmʌltiˈfæsɪtɪd/', 'multi(다수) + facet(면, 보석의 깎인 면) → 다면적인'],
            ['assessment', '/əˈsesmənt/', '평가 (동사 assess)'],
          ]}
        />
        <ul className="guide-list">
          <li>bandwidth / latency — 노드 간 대역폭·지연</li>
          <li><strong>bisection bandwidth</strong> — 이등분 대역폭: 클러스터를 반으로 갈랐을 때 두 반쪽 사이 대역폭. 패브릭 건전성의 종합 지표</li>
          <li>GPU-to-GPU / GPU-Direct RDMA</li>
          <li><strong>outlier detection</strong> — 이상치 탐지. "다른 노드보다 유독 느린 노드"를 찾아내는 것</li>
        </ul>
        <p className="guide-note">
          <strong>outlier</strong> = 이상치, 튀는 값. 클러스터 검증의 목표는 결국 outlier 노드를 찾아내 고치는 것.
          <strong> straggler</strong> = 낙오자. 분산 학습에서 혼자 느려서 전체를 지연시키는 노드(straggler effect).
        </p>
      </GuideSection>

      <GuideSection title="4-10. Run NCCL to verify E/W fabric bandwidth." hint="E/W = East/West">
        <p className="guide-note">
          <em>Because all-reduce is bottlenecked by the slowest link, a single degraded cable can cap the bandwidth of the
          entire job.</em> — <strong>be bottlenecked by</strong> = ~에 병목되다 / <strong>cap (동사)</strong> = 상한을 씌우다,
          제한하다 / <strong>degraded</strong> = 열화된, 성능이 떨어진.
        </p>
      </GuideSection>

      <GuideSection title="4-11~13. Perform NCCL / HPL / NeMo burn-in." hint="세 가지를 다 하는 이유 — 각각 다른 것을 조인다">
        <T
          head={['벤치마크', '주로 스트레스하는 대상', '잡아내는 문제']}
          rows={[
            ['HPL', '연산 유닛, 메모리, 전력·발열', '약한 GPU, 냉각 부족, 전력 트립'],
            ['NCCL', '인터커넥트 (NVLink, IB)', '불량 케이블/트랜시버, 배선 오류'],
            ['NeMo', '전부 + 스토리지 + 스케줄러', '실제 학습 워크로드에서만 드러나는 문제'],
          ]}
        />
        <p className="guide-note">
          <em>A NeMo burn-in exercises the full stack — compute, interconnect, storage, and the scheduler — under
          conditions that closely resemble production training.</em> — <strong>exercise (동사)</strong> = 기술문서에서
          "코드/하드웨어를 실제로 돌려본다" / full stack = 전 계층 / resemble = 닮다.
        </p>
      </GuideSection>

      <GuideSection title="4-14. Test storage." hint="측정 지표 문장">
        <p className="guide-note">
          <em>Measure sequential read/write throughput and random IOPS at various block sizes and queue depths.</em>
        </p>
        <T
          head={['영어', '한글']}
          rows={[
            ['sequential ↔ random', '순차 ↔ 랜덤'],
            ['block size', '블록 크기'],
            ['queue depth', '큐 깊이 (동시 요청 수)'],
            ['fio (Flexible I/O tester)', '대표 스토리지 벤치마크 도구'],
            ['IOR, mdtest', 'HPC 병렬 파일시스템 벤치마크'],
            ['checkpoint', '체크포인트 — 학습 중 모델 상태 저장. 스토리지 부하의 주범'],
          ]}
        />
      </GuideSection>

      <Part
        id="b5"
        tag="SECTION 5 · 12%"
        title="Troubleshoot and Optimize"
        lead="troubleshoot = trouble(문제) + shoot(쏘다) → 문제를 찾아 해결하다. 명사는 troubleshooting, 사람은 troubleshooter."
      />

      <GuideSection title="5-1. Identify and troubleshoot hardware faults (e.g., GPU, fan, network card)." hint="e.g.(예를 들어) ↔ i.e.(즉, 다시 말해) 구분은 독해에 중요하다">
        <T
          head={['영어', '한글']}
          rows={[
            ['fall off the bus', 'GPU가 PCIe 버스에서 사라짐 (GPU has fallen off the bus) ★대표 에러'],
            ['Xid error', 'NVIDIA 드라이버가 내는 GPU 오류 코드'],
            ['double-bit error (DBE)', '정정 불가 ECC 오류 → 교체 신호'],
            ['retired pages / row remap failure', '불량 메모리 처리 실패'],
            ['thermal event / overtemp', '과열 이벤트'],
            ['fan failure / fan speed anomaly', '팬 고장 / 회전수 이상'],
            ['link down', '링크 끊김'],
            ['SEL (System Event Log)', 'BMC의 시스템 이벤트 로그'],
            ['DCGM (Data Center GPU Manager)', 'GPU 헬스 모니터링 도구'],
          ]}
        />
        <p className="guide-note">
          <em>If the GPU is no longer enumerated by lspci, the most likely cause is a seating or power delivery issue
          rather than a driver problem.</em> — <strong>enumerate</strong> = PCIe에서 "장치가 인식되어 목록에 오르다" /
          the most likely cause is = 가장 유력한 원인은 / <strong>A rather than B</strong> = B라기보다는 A ★선택지 문제 핵심 구문.
        </p>
        <p className="guide-note"><code>dcgmi diag -r 3</code> — DCGM 진단 실행. -r = run level (1=빠름, 4=장시간).</p>
      </GuideSection>

      <GuideSection title="5-2. Identify faulty cards, GPUs, and power supplies." hint="faulty = 결함이 있는 (동의어 defective, failing, bad)">
        <ul className="guide-list">
          <li><strong>failing</strong> = 아직 죽진 않았지만 죽어가는 중 / <strong>failed</strong> = 이미 죽은</li>
          <li><strong>suspect</strong> (형용사) = 의심스러운 → "suspect cable"</li>
        </ul>
        <T
          head={['방법론 영어', '의미']}
          rows={[
            ['swap test', '부품을 바꿔 끼워 문제가 따라가는지 보는 시험'],
            ['isolate the fault', '결함을 격리·특정하다'],
            ['narrow down', '범위를 좁히다'],
            ['rule out', '(원인에서) 배제하다'],
            ['known-good', '정상임이 확인된 (부품) — Replace with a known-good cable.'],
            ['reproduce', '재현하다'],
            ['root cause analysis (RCA)', '근본 원인 분석'],
          ]}
        />
        <p className="guide-note">
          <em>Swap the suspect transceiver with a known-good unit; if the error follows the transceiver, the module is
          faulty.</em>
        </p>
      </GuideSection>

      <GuideSection title="5-3. Replace faulty cards, GPUs, and power supplies." hint="only after it passes — only가 조건을 강하게 제한한다">
        <T
          head={['영어', '한글']}
          rows={[
            ['RMA (Return Merchandise Authorization)', '반품/교체 승인 — 불량 부품을 제조사에 보내는 절차'],
            ['FRU (Field Replaceable Unit)', '현장 교체 가능 부품'],
            ['hot-swappable', '전원 켠 채 교체 가능 (PSU, 팬, 디스크)'],
            ['cold-swap', '전원 내리고 교체해야 함 (GPU, CPU)'],
            ['decommission', '운용에서 내리다'],
            ['drain the node', '노드에 새 작업 배정 중단'],
            ['return to service', '서비스 복귀'],
          ]}
        />
        <p className="guide-note">
          <em>Drain the node in Slurm, power it down, replace the GPU, re-run DCGM diagnostics, and return the node to
          service only after it passes.</em>
        </p>
      </GuideSection>

      <GuideSection title="5-4. Execute performance optimization for AMD and Intel servers." hint="여기서 AMD/Intel = CPU 플랫폼. GPU가 아니라 호스트 서버 측 튜닝이다">
        <T
          head={['영어', '한글']}
          rows={[
            ['NUMA (Non-Uniform Memory Access)', '비균일 메모리 접근 — CPU마다 가까운 메모리가 다름'],
            ['NUMA affinity / node locality', 'NUMA 친화도 / 지역성'],
            ['NPS (Nodes Per Socket)', 'AMD BIOS 설정 — 소켓당 NUMA 노드 수'],
            ['SNC (Sub-NUMA Clustering)', 'Intel의 유사 기능'],
            ['IOMMU', 'I/O 메모리 관리 유닛 (passthrough 시 설정 중요)'],
            ['ACS (Access Control Services)', 'PCIe 기능. GPUDirect RDMA를 위해 보통 비활성화'],
            ['C-states / P-states', 'CPU 절전 상태 / 성능 상태'],
            ['performance governor', '성능 우선 주파수 정책'],
            ['hyper-threading / SMT', '하이퍼스레딩 / 동시 멀티스레딩'],
            ['pin / affinity', '프로세스를 특정 코어에 고정'],
            ['PCIe lane / bifurcation', 'PCIe 레인 / 분기'],
            ['hugepages', '대용량 페이지'],
          ]}
        />
        <p className="guide-note">
          <em>Pinning each process to the CPU cores local to its GPU's NUMA node minimizes cross-socket memory traffic and
          improves effective bandwidth.</em> — pin A to B = A를 B에 고정하다 / local to = ~에 인접한 /
          <strong> cross-socket</strong> = 소켓을 넘나드는 ★ 성능 저하 주요 원인.
        </p>
        <p className="guide-note">
          자주 나오는 튜닝 지시: <em>Disable C-states and set the CPU governor to performance to reduce latency jitter.</em>{' '}
          — jitter = 지터, 시간 변동폭.
        </p>
      </GuideSection>

      <GuideSection title="5-5. Optimize storage." hint="X bound = X에 의해 제한되는 ★ 성능 분석 필수 표현">
        <T
          head={['영어', '한글']}
          rows={[
            ['prefetch', '미리 읽어오다'],
            ['cache hit / miss', '캐시 적중 / 실패'],
            ['tiering', '계층화 (빠른 층 ↔ 느린 층)'],
            ['striping', '스트라이핑 — 여러 디스크에 나눠 병렬 기록'],
            ['stripe count / stripe size', '스트라이프 개수 / 크기 (Lustre 튜닝 핵심)'],
            ['saturate the link', '링크를 포화시키다'],
            ['data staging', '데이터를 미리 로컬로 옮겨놓기'],
            ['I/O bound ↔ compute bound', '입출력 병목 ↔ 연산 병목'],
          ]}
        />
        <p className="guide-note">
          <em>If GPU utilization fluctuates while the data loader stalls, the workload is I/O bound, not compute
          bound.</em> — fluctuate = 변동하다, 출렁이다 / stall = 멎다, 지체되다.
        </p>
      </GuideSection>
    </>
  )
}
