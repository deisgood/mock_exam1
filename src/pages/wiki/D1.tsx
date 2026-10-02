import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 2 — D1 Cluster Test and Verification (33%) */
export default function D1() {
  return (
    <>
      <Part
        id="p2"
        tag="PART 2 · D1 33%"
        title="Cluster Test and Verification"
        lead="구축이 끝난 클러스터가 사양대로 동작하는지를 부품 → 노드 → 패브릭 → 클러스터 → 실워크로드 순으로 범위를 넓혀가며 증명한다."
      />

      <GuideSection title="검증 사다리" hint="이 그림이 도메인 전체의 뼈대 — 순서 문제의 정답 논리는 항상 이것">
        <Cmd>{`① 부품 인식      lspci → nvidia-smi → ibstat / mlxlink
② 단일 노드      dcgmi diag r3/r4 · HPL · nvbandwidth
③ 노드 내 통신   nccl-tests -g 8  (NVLink / NVSwitch / Fabric Manager)
④ 물리 패브릭    mlxlink(BER) · ibdiagnet · ibnetdiscover(배선 대조) · perfquery
⑤ 패브릭 성능    ib_write_bw → ClusterKit(N×N) → 멀티노드 NCCL(busbw)
⑥ 스토리지       fio → IOR → mdtest
⑦ 번인           NCCL 번인 → HPL 번인 → NeMo 번인
⑧ 인수인계       보고서 · 기준선(baseline) 기록`}</Cmd>
        <p className="guide-note">
          🎯 아래 계층이 통과되기 전에 위 계층으로 올라가지 않는다. <strong>단일 노드 검증 없이 클러스터 테스트를 하면
          불량 노드가 패브릭 문제처럼 보인다.</strong>
        </p>
      </GuideSection>

      <GuideSection title="2-1. 단일 노드 스트레스 테스트 — DCGM Diagnostics" hint="단일 노드 수용(acceptance) 테스트의 표준 수단">
        <p className="guide-desc">
          DCGM(Data Center GPU Manager)은 GPU 헬스 모니터링·진단 도구다. <code>dcgmi diag</code>는 <strong>능동(부하) 진단</strong>으로
          배포 상태·PCIe·메모리·연산·전력을 단계별로 검사한다.
        </p>
        <T
          head={['레벨', '별칭', '소요(대략)', '내용']}
          rows={[
            ['-r 1', 'short', '수 초', '소프트웨어 배포 검사 — 드라이버·권한·라이브러리·NVML 응답. 부하 없음'],
            ['-r 2', 'medium', '~2분', 'r1 + PCIe/NVLink 대역폭, 간단한 메모리 검사'],
            ['-r 3', 'long', '~15분', 'r2 + 본격 스트레스 — Targeted Stress, Targeted Power, Memory Bandwidth, SM Stress'],
            ['-r 4', 'extended (xlong)', '30분+', 'r3의 확장 — 메모리 오류 정밀 검출. 수용 테스트 / RMA 판정용'],
          ]}
        />
        <p className="guide-note">
          레벨 인자는 숫자 대신 이름도 받는다: <code>dcgmi diag -r long</code>. ⚠️ 정확한 소요 시간·서브테스트 구성은
          DCGM 버전에 따라 다르므로 최신 User Guide 표를 확인할 것.
        </p>

        <h3 className="guide-h3">능동 진단 vs 상시 감시 — 반복 출제 축</h3>
        <T
          head={['', 'dcgmi diag', 'dcgmi health / dcgmi policy']}
          rows={[
            ['성격', '능동 — 부하를 걸어 판정', '수동 — 백그라운드 워치'],
            ['시점', '인수·교체 후·의심 시', '상시'],
            ['결과', 'PASS / FAIL / WARN', '헬스 상태 · 정책 트리거'],
          ]}
        />

        <T
          head={['명령', '용도']}
          rows={[
            [<code>dcgmi discovery -l</code>, 'GPU 목록·토폴로지 인식 확인'],
            [<code>dcgmi diag -r 1|2|3|4</code>, '능동 진단 실행'],
            [<code>dcgmi health -s a / dcgmi health -c</code>, '백그라운드 헬스 워치 설정 / 조회'],
            [<code>dcgmi dmon -e 150,155</code>, '✅ 온도(150)·전력(155) 실시간 스트리밍'],
            [<code>nvidia-smi -q -d TEMPERATURE,POWER,ECC</code>, '스트레스 중 온도·전력·ECC 관찰'],
          ]}
        />

        <p className="guide-note">
          🆕 <strong>nvbandwidth</strong> — dcgmi diag가 GPU 자체를 본다면, nvbandwidth는 Host↔Device(H2D/D2H),
          Device↔Device(P2P) 복사 대역폭을 실측한다. NUMA 오정렬·PCIe 저속 협상·ACS 간섭이 여기서 숫자로 드러난다.
        </p>
        <ul className="guide-list">
          <li>🎯 "빠른 배포 확인" → r1 / "장시간 수용 테스트" → r3·r4</li>
          <li>🎯 diag(능동) vs health(수동) 역할 구분</li>
          <li>🎯 실패 서브테스트(ECC / Thermal / PCIe)에 따른 다음 조치 연결</li>
        </ul>
      </GuideSection>

      <GuideSection title="2-2. HPL (High-Performance Linpack)" hint="연산 + HBM + NVLink + 전력 전달계를 동시에 한계까지 끌어올리는 대표 수용·번인 워크로드">
        <p className="guide-desc">
          밀집 선형계를 LU 분해로 푸는 벤치마크. TOP500 순위 산정 기준이다. NVIDIA는 직접 빌드하지 않고
          NGC의 <strong>HPC-Benchmarks 컨테이너</strong>(nvcr.io/nvidia/hpc-benchmarks)로 실행하는 것을 표준으로 제공한다
          (GPU 최적화 xhpl 바이너리 + hpl.sh 포함).
        </p>
        <T
          head={['파라미터', '의미', '실무 기준']}
          rows={[
            ['N', '문제 크기(행렬 차수)', '✅ GPU 메모리 총량의 약 80~90%를 채우도록 (100%는 OOM)'],
            ['NB', '블록 크기', 'GPU는 CPU보다 크게 (수백~1024 수준, 플랫폼별 권장값 존재)'],
            ['P × Q', '프로세스 그리드', 'P×Q = 총 GPU(프로세스) 수와 반드시 일치. 정사각형에 가깝게'],
          ]}
        />
        <ul className="guide-list">
          <li>출력의 <strong>GFLOPS(Rmax)</strong>를 이론 피크 FP64와 비교해 효율(%) 산출</li>
          <li>마지막 잔차(residual) 검사가 <strong>PASSED</strong>여야 수치적으로 유효한 실행</li>
          <li>동일 사양 노드 중 유독 낮은 노드 = 냉각·전력·펌웨어·GPU 결함 의심 → <strong>outlier detection</strong>이 HPL의 실무적 존재 이유</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>docker run --gpus all nvcr.io/nvidia/hpc-benchmarks:...</code>, 'NGC 컨테이너 실행'],
            [<code>mpirun -np 8 hpl.sh --dat ./HPL.dat</code>, '노드 내 8-GPU HPL'],
            [<code>srun --container-image=nvcr.io#nvidia/hpc-benchmarks:... hpl.sh</code>, 'Slurm + Pyxis 경로'],
          ]}
        />
        <ul className="guide-list">
          <li>🎯 P×Q ≠ GPU 수 → 실행 실패/오구성 시나리오</li>
          <li>🎯 HPL은 <strong>FP64</strong> 중심. Tensor Core FP8/BF16 성능과 혼동시키는 보기 주의 — 혼합정밀은 <strong>HPL-MxP</strong>라는 별도 벤치마크</li>
          <li>🪤 "HPL 점수가 낮다 → GPU 불량"이 항상 답은 아니다. 흡기 온도·전력 상한·클럭 스로틀링이 더 흔한 원인</li>
        </ul>
      </GuideSection>

      <GuideSection title="2-3. 단일 노드 NCCL — NVLink · NVSwitch 검증" hint="하드웨어 검증 지표는 언제나 busbw">
        <T
          head={['지표', '정의', '용도']}
          rows={[
            ['algbw (algorithm bandwidth)', '데이터 크기 ÷ 시간', '알고리즘 관점 처리량'],
            ['busbw (bus bandwidth)', 'algbw × 집합연산 계수', '하드웨어 링크가 실제 나른 대역폭. 링크 사양과 직접 비교 가능'],
          ]}
        />
        <p className="guide-note">
          all-reduce의 계수는 <strong>2(n−1)/n</strong>. 하드웨어 검증에는 반드시 busbw를 본다.
        </p>
        <p className="guide-desc">
          NVSwitch가 있는 시스템(HGX/DGX)은 <strong>Fabric Manager</strong>(nvidia-fabricmanager) 서비스가 필수다.
          🪤 FM이 죽으면 <code>nvidia-smi</code>는 GPU를 정상으로 보여주지만 CUDA 초기화/NCCL이 실패한다.
        </p>

        <h3 className="guide-h3">nvidia-smi topo -m 범례 ✅</h3>
        <T
          head={['기호', '의미']}
          rows={[
            ['X', '자기 자신'],
            ['NV#', 'NVLink # 개 묶음으로 연결'],
            ['PIX', 'PCIe 브리지 1개 이하 경유 (가장 가까움)'],
            ['PXB', '여러 PCIe 브리지 경유 (호스트 브리지는 미경유)'],
            ['PHB', 'PCIe 호스트 브리지(보통 CPU) 경유'],
            ['NODE', '같은 NUMA 노드 내 여러 호스트 브리지 경유'],
            ['SYS', 'NUMA 노드 간 인터커넥트(UPI/xGMI) 경유 — 가장 멂'],
          ]}
        />
        <p className="guide-note">
          GPUDirect RDMA는 GPU-NIC가 <strong>PIX/PXB</strong> 관계일 때 효과적이고, <strong>SYS</strong>면 효과가 급감한다.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>./build/all_reduce_perf -b 8 -e 8G -f 2 -g 8</code>, '8B→8GB 2배씩, GPU 8개. busbw 열을 본다'],
            [<code>nvidia-smi nvlink --status</code>, 'NVLink 링크 상태/속도 (다운 링크 탐지)'],
            [<code>nvidia-smi topo -m</code>, 'GPU↔GPU/NIC 토폴로지'],
            [<code>systemctl status nvidia-fabricmanager</code>, 'NVSwitch 시스템 필수 서비스'],
            [<code>NCCL_DEBUG=INFO ./all_reduce_perf ...</code>, 'NCCL이 선택한 경로 로그 확인'],
          ]}
        />
        <ul className="guide-list">
          <li>🎯 NVSwitch 장비에서 NCCL/CUDA 실패 → Fabric Manager 상태 최우선 확인</li>
          <li>🎯 <code>-g 8</code>(단일 프로세스 다중 GPU) = 노드 내부만 검증, 네트워크 미개입</li>
        </ul>
      </GuideSection>

      <GuideSection title="2-4. 케이블 신호 품질 검증 (BER · mlxlink)" hint="링크가 Up이어도 BER이 높으면 실효 성능이 떨어진다 — Up/Down이 아니라 품질로 검증한다">
        <T
          head={['지표', '의미', '판정']}
          rows={[
            ['Raw BER', 'FEC 정정 전 오류율', '물리 신호 품질 자체'],
            ['Effective BER', 'FEC 정정 후 잔여 오류율', '사실상 0 (1e-15 이하)이어야 정상'],
            ['FEC 정정 카운터', '정정 가능 오류 누적', '꾸준히 증가 = 마진 없는 링크'],
            ['링크 플랩 카운터', 'Up/Down 반복 횟수', '0이어야 정상'],
            ['협상 속도/폭', '실효 링크 속도', '사양보다 낮으면 매체·트랜시버 의심'],
          ]}
        />
        <h3 className="guide-h3">도구 계층 매칭 (출제 포인트)</h3>
        <T
          head={['범위', '도구']}
          rows={[
            ['로컬 포트 1개', 'mlxlink (링크 상태·속도·BER·eye·모듈 정보)'],
            ['로컬 HCA 상태', 'ibstat, ibstatus'],
            ['패브릭 전수', 'ibdiagnet (링크별 오류·속도 불일치 리포트)'],
            ['패브릭 링크 일람', 'iblinkinfo (저속 협상 링크 탐지)'],
            ['🆕 포트 오류 카운터', 'perfquery (SymbolErrorCounter, LinkDownedCounter, PortRcvErrors, PortXmitDiscards)'],
            ['🆕 RDMA 대역폭 실측', 'ib_write_bw / ib_read_bw / ib_send_lat (perftest 패키지)'],
          ]}
        />
        <Cmd>{`링크 Up 확인 (ibstat)
  → 속도/폭 협상 확인 (iblinkinfo)
    → 신호 품질 (mlxlink: Raw/Effective BER, eye)
      → 누적 오류 (perfquery -R로 리셋 후 부하 → 재조회)
        → 순수 대역폭 (ib_write_bw)
          → 집합 통신 (NCCL busbw)`}</Cmd>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mlxlink -d mlx5_0 -p 1 -m -c -e</code>, '모듈(--show_module) + 카운터(--show_counters) + eye/BER(--show_eye)'],
            [<code>ibdiagnet</code>, 'IB 패브릭 전수 진단. 결과는 /var/tmp/ibdiagnet2/'],
            [<code>iblinkinfo</code>, '모든 링크의 상태·속도·폭 일람'],
            [<code>ibstat / ibstatus</code>, '로컬 HCA 포트 상태(Active/Down)·LID·속도'],
            [<code>perfquery -a / perfquery -R</code>, '🆕 포트 오류 카운터 조회 / 리셋 후 재관찰'],
            [<code>ib_write_bw -d mlx5_0 -a</code>, '🆕 서버에서 실행 후, 클라이언트는 뒤에 서버 IP를 붙인다'],
          ]}
        />
        <p className="guide-note">
          ⚠️ mlxlink의 축약 플래그(-m/-c/-e)는 MFT 버전별로 다를 수 있다. 전체 옵션명(--show_module 등)으로 기억할 것.
        </p>
      </GuideSection>

      <GuideSection title="2-5. 케이블 연결(토폴로지) 확인" hint="오배선은 링크가 정상 Up이라 눈에 띄지 않는다 — 설계도와 대조해야만 드러난다">
        <p className="guide-desc">
          레일 최적화 토폴로지는 "노드 A의 NIC3은 반드시 Rail3 리프 스위치의 특정 포트"처럼 <strong>배선 자체가 성능</strong>이다.
          오배선은 NCCL 성능 저하·라우팅 비효율로만 나타난다.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>ibnetdiscover</code>, '패브릭 전체 노드·스위치·연결을 텍스트로 덤프'],
            [<code>ibdiagnet -w /path/fabric.topo</code>, '✅ 현재 토폴로지를 .topo 파일로 저장 (기준선 생성)'],
            [<code>ibdiagnet -t /path/design.topo</code>, '✅ 설계 토폴로지와 대조 → 불일치(오배선) 리포트'],
            [<code>iblinkinfo</code>, '스위치 포트별 상대 장비 확인 (개별 케이블 추적)'],
            [<code>ibportstate &lt;lid&gt; &lt;port&gt;</code>, '🆕 포트 상태 조회 / enable·disable (격리 시험)'],
          ]}
        />
        <p className="guide-note">UFM 사용 환경에서는 GUI의 Topology Compare(Periodic / Custom)가 같은 역할을 한다.</p>
      </GuideSection>

      <GuideSection title="2-6. FW/SW 확인 ① 스위치" hint="블루프린트는 스위치 / BlueField-3 / 트랜시버를 각각 별도 bullet으로 둔다">
        <T
          head={['플랫폼', 'OS', '버전 확인 명령']}
          rows={[
            ['Quantum / Quantum-2 (IB)', 'MLNX-OS', 'show version (CLI), show inventory'],
            ['Quantum-2 / Spectrum (신형)', 'NVOS', 'nv show system, nv show platform firmware'],
            ['Spectrum (Ethernet)', 'Cumulus Linux', 'nv show system / decode-syseeprom'],
            ['Spectrum (구형 Eth)', 'Onyx', 'show version'],
          ]}
        />
        <p className="guide-note">
          ⚠️ 스위치 OS별 세부 문법은 릴리스별로 다르다. <strong>"MLNX-OS/Onyx = show version, Cumulus/NVOS = nv show"</strong>{' '}
          대응만 확실히. IB 스위치 내장 SM 사용 시 SM 활성 여부도 함께 확인한다.
        </p>
      </GuideSection>

      <GuideSection title="2-6b. FW/SW 확인 ② NIC · BlueField-3" hint="NIC FW와 Arm 측 소프트웨어(BFB·DOCA)는 별개 버전이다">
        <T
          head={['대상', '도구', '비고']}
          rows={[
            ['ConnectX / BlueField NIC FW', <code>mlxfwmanager</code>, '장치 스캔 + 현재/최신 FW 비교 + 일괄 업데이트'],
            ['개별 장치 FW·PSID', <code>flint -d /dev/mst/... query</code>, 'PSID = 보드 모델 식별자'],
            ['MFT 디바이스 인터페이스', <code>mst start / mst status</code>, '모든 MFT 작업의 전제'],
            ['🆕 FW 적용(재부팅 없이)', <code>mlxfwreset -d &lt;dev&gt; -l 3 r</code>, '레벨에 따라 PCI/시스템 리셋'],
            ['BlueField 번들 정합', <code>bfvcheck</code>, 'DPU Arm 측에서 실행. 권장 FW/SW 번들 대비 점검'],
            ['BF Arm OS 버전', <code>cat /etc/mlnx-release</code>, 'DPU 내부에서 BFB 릴리스 식별'],
          ]}
        />
      </GuideSection>

      <GuideSection title="2-6c. FW/SW 확인 ③ 트랜시버·케이블" hint="링크 양단의 FW 조합 불일치 = 링크 불안정·저속 협상·기능 미지원">
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mlxcables</code>, '연결된 케이블/모듈의 타입·파트넘버·시리얼·FW 버전'],
            [<code>mlxcables -d &lt;cable&gt; --update</code>, '지원 모듈(LinkX)의 FW 업데이트 ⚠️ 지원 범위 확인 필요'],
            [<code>mlxlink -d &lt;dev&gt; -p &lt;port&gt; --show_module</code>, '포트에 꽂힌 트랜시버 상세(타입·온도·전력)'],
          ]}
        />
        <ul className="guide-list">
          <li>🎯 장치 종류 → 도구 매칭: NIC/DPU = mlxfwmanager·flint / 케이블 = mlxcables / BF 번들 = bfvcheck / 스위치 = OS CLI</li>
          <li>🎯 "전 구성요소 버전 일치"는 재현 가능한 성능의 전제 조건</li>
        </ul>
      </GuideSection>

      <GuideSection title="2-7. ClusterKit — 다면(multifaceted) 노드 평가" hint="HPC-X 패키지에 포함 — 소속 관계 자체가 출제 포인트">
        <p className="guide-desc">
          노드 쌍 간 대역폭·지연시간을 전수(N×N) 측정해 매트릭스로 보여준다. 수백 노드에서 수동 테스트는 불가능하므로,
          결과 매트릭스에서 <strong>특정 행/열만 어두운 패턴</strong>을 보고 문제 노드·리프 스위치·케이블을 즉시 지목한다.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>source $HPCX_HOME/hpcx-init.sh && hpcx_load</code>, 'HPC-X 환경 로드'],
            [<code>$HPCX_CLUSTERKIT_DIR/bin/clusterkit.sh --hostfile hosts</code>, '호스트 목록 대상 대역폭/지연 all-to-all'],
          ]}
        />
        <p className="guide-note">⚠️ 세부 옵션(테스트 종류 선택 플래그)은 HPC-X 버전별 문서 확인.</p>
      </GuideSection>

      <GuideSection title="2-8. 멀티노드 NCCL — E/W 패브릭 대역폭 검증" hint="GPU → NIC → 리프 → 스파인을 관통하는 실효 대역폭">
        <T
          head={['', '단일 노드', '멀티노드']}
          rows={[
            ['검증 대상', 'NVLink / NVSwitch', 'InfiniBand / RoCE 패브릭'],
            ['실행 형태', '-g 8 (1프로세스 8GPU)', '프로세스당 GPU 1개(-g 1) × 노드 수'],
          ]}
        />
        <T
          head={['환경 변수', '역할']}
          rows={[
            [<code>NCCL_DEBUG=INFO</code>, '선택된 전송 경로(IB/RoCE, GDRDMA 사용 여부, 링/트리) 로그. 진단 출발점'],
            [<code>NCCL_IB_HCA=mlx5_0,mlx5_1,...</code>, '사용할 HCA 지정 — 의도한 컴퓨트 레일만 쓰는지 통제'],
            [<code>NCCL_SOCKET_IFNAME</code>, '부트스트랩용 TCP 인터페이스 지정'],
            [<code>NCCL_NET_GDR_LEVEL</code>, '🆕 GPUDirect RDMA 사용 조건(PCIe 거리) 강제'],
            [<code>NCCL_IB_GID_INDEX</code>, '🆕 RoCE 환경 필수 — RoCEv2 GID 선택. 잘못되면 통신 실패'],
            [<code>NCCL_IB_TC / NCCL_IB_SL</code>, '🆕 RoCE 트래픽 클래스 / IB 서비스 레벨 (PFC 우선순위 정렬)'],
            [<code>NCCL_COLLNET_ENABLE=1</code>, '🆕 SHARP in-network 집합통신 오프로드 활성'],
          ]}
        />
        <h3 className="guide-h3">판정 기준</h3>
        <ul className="guide-list">
          <li>큰 메시지에서의 busbw를 NIC 라인레이트와 비교 — EDR 100Gb/s ≈ 12.5 GB/s · HDR 200Gb/s ≈ 25 GB/s · <strong>NDR 400Gb/s ≈ 50 GB/s</strong> · XDR 800Gb/s ≈ 100 GB/s (GPU당)</li>
          <li>노드 수를 2 → 4 → 8로 늘려도 busbw가 유지되는지(팻트리 스케일링) 확인</li>
          <li>2노드는 정상인데 대규모에서 저하 → 스파인 오버섭스크립션 / 특정 레일 문제</li>
        </ul>
        <p className="guide-note">
          🆕 <strong>SHARP</strong> — Quantum IB 스위치가 all-reduce 연산 자체를 네트워크 안에서 수행해 트래픽과 지연을 줄이는
          NVIDIA 고유 기술. UFM의 Aggregation Manager + 호스트 sharpd가 필요하며 NCCL에서는 <code>NCCL_COLLNET_ENABLE=1</code>로
          사용한다. 🎯 "IB 패브릭에서 집합통신을 오프로드하는 기술은?" → SHARP.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mpirun -np 16 -H nodeA:8,nodeB:8 ./all_reduce_perf -b 8 -e 8G -f 2 -g 1</code>, '2노드 × 8GPU'],
            [<code>mpirun ... -x NCCL_DEBUG=INFO -x NCCL_IB_HCA=mlx5</code>, '환경변수 전달'],
            [<code>srun --mpi=pmix --container-image=... all_reduce_perf ...</code>, 'Slurm + Pyxis 실행'],
          ]}
        />
        <p className="guide-note">
          🎯 busbw 저하 → ① FM/NVLink(노드 내) ② GDR 미동작 ③ 레일 오배선 ④ 스파인 오버섭 순으로 격리한다.
        </p>
      </GuideSection>

      <GuideSection title="2-9. 번인 — NCCL · HPL · NeMo" hint='"죽을 부품은 인수 전에 죽게 만든다" — 초기 불량(infant mortality) 색출'>
        <T
          head={['번인', '도구', '검증 계층', '노출되는 결함']}
          rows={[
            ['NCCL 번인', 'nccl-tests 장시간 루프', '통신 (NVLink + 패브릭)', '링크 플랩, BER 상승, 간헐 재전송, FM 불안정'],
            ['HPL 번인', 'HPL 반복 실행', '연산 · 전력 · 열', '열 포화 시 클럭 스로틀링, ECC 오류, 전력계/PSU 문제'],
            ['NeMo 번인', 'NGC NeMo 컨테이너로 실제 LLM 사전학습', '전체 스택 (end-to-end)', '데이터 로딩→연산→집합통신→체크포인트 상호작용 문제'],
          ]}
        />
        <Cmd>{`① 단일 노드 스트레스 (DCGM r3/r4 · HPL)
② 단일 노드 NCCL (NVLink)
③ 패브릭 검증 (ClusterKit · 멀티노드 NCCL)
④ 클러스터 번인 (HPL/NCCL 장시간 반복)
⑤ NeMo 번인 (실제 LLM 학습 워크로드)`}</Cmd>
        <ul className="guide-list">
          <li>번인 중 DCGM으로 온도·전력·클럭(스로틀 사유)·ECC·XID를 수집하며 <strong>노드 간 편차(outlier)</strong>를 기록 → 인수 판정 근거</li>
          <li>🎯 NCCL=통신 / HPL=연산·전력·열 / NeMo=전체 스택</li>
          <li>🎯 번인 결과 = 기준선(baseline) → 운영 중 비교 기준</li>
          <li>⚠️ 공식적으로 규정된 번인 시간·횟수 기준은 공개 문서에 명시되지 않는 경우가 많다. 시험은 목적·계층 구분 위주로 물어본다</li>
        </ul>
      </GuideSection>

      <GuideSection title="2-10. 스토리지 테스트" hint="데이터 로딩이 느리면 GPU가 논다(starvation)">
        <T
          head={['도구', '측정 대상', '대표 명령']}
          rows={[
            ['fio', '범용 단일/다중 노드 I/O (순차/랜덤, 블록 크기, iodepth)', 'fio --name=seqread --rw=read --bs=1M --iodepth=32 --numjobs=8 --direct=1 --size=10G'],
            ['IOR', 'MPI 기반 병렬 파일시스템 집합 대역폭', 'mpirun -np N ior -w -r -t 1m -b 4g'],
            ['mdtest', '메타데이터 연산(생성/삭제/조회)', 'mpirun -np N mdtest -n 10000 -d /fs/testdir'],
            ['🆕 gdsio', 'GPUDirect Storage 경로 전용 I/O', '/usr/local/cuda/gds/tools/gdsio -f /fs/f -d 0 -w 8 -s 10G -x 0'],
          ]}
        />
        <h3 className="guide-h3">학습 워크로드 I/O 패턴</h3>
        <ul className="guide-list">
          <li><strong>읽기</strong>: 데이터셋 랜덤/순차 읽기 (에폭마다 반복)</li>
          <li><strong>쓰기 버스트</strong>: 체크포인트 — 대용량 순차 쓰기가 짧게 폭발</li>
          <li><strong>메타데이터</strong>: 작은 파일 수백만 개 데이터셋</li>
        </ul>
        <p className="guide-note">
          🎯 <code>--direct=1</code>의 이유 = <strong>페이지 캐시 배제</strong>(캐시 히트로 인한 허위 고성능 방지).
          fio(범용) / IOR(병렬 집합) / mdtest(메타데이터) 매칭이 출제 포인트.
        </p>
      </GuideSection>
    </>
  )
}
