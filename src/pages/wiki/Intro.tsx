import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 0 검수 리포트 · Part 1 시험 개요와 학습 전략 */
export default function Intro() {
  return (
    <>
      <Part
        id="p0"
        tag="PART 0"
        title="검수 리포트"
        lead="기존 「NCP-AII 개념 정리」를 공식 블루프린트와 1:1 대조 검수한 결과. 무엇이 빠졌고 무엇이 틀렸는지부터 확정하고 시작한다."
      />

      <GuideSection title="v2 갱신 안내 — 공식 스터디 가이드 대조 완료" hint="이 문서만으로 끝나지 않는다">
        <p className="guide-note">
          NVIDIA 공식 Exam Study Guide 원문과 재대조한 결과, <strong>공식 과제 34개는 100% 커버</strong>되었으나
          Job Responsibilities와 Suggested Readings에만 등장하는 <strong>14개 주제가 누락</strong>된 것을 확인했다.
          대표적으로 Run:ai · NVSM · vGPU/AI Enterprise · DGX OS · PUE 계열 지표 · BFB from BMC ·
          ib_write_lat · 패브릭 복원력 · IB 포트 카운터 · 사용자/워크로드 관리 · CUDA 버전 체계가 있다.
        </p>
        <p className="guide-note">
          또한 공식 가이드의 장 번호(1~5)와 이 위키의 D번호(D1~D5)는 <strong>순서가 다르다.</strong>{' '}
          공식 1장=D2, 2장=D5, 3장=D3, 4장=D1, 5장=D4.
        </p>
      </GuideSection>

      <GuideSection title="0-1. 도메인 커버리지" hint="결론 — 빠진 도메인 없음">
        <T
          head={['공식 도메인 (영문)', '공식 비중', '노트', '상태']}
          rows={[
            ['System and Server Bring-up', '31%', 'D2', '✔ 일치'],
            ['Physical Layer Management', '5%', 'D5', '✔ 일치'],
            ['Control Plane Installation and Configuration', '19%', 'D3', '✔ 일치'],
            ['Cluster Test and Verification', '33%', 'D1', '✔ 일치'],
            ['Troubleshoot and Optimize', '12%', 'D4', '✔ 일치'],
          ]}
        />
        <p className="guide-note">
          공식 페이지의 표 순서는 Bring-up → Physical Layer → Control Plane → Cluster Test → Troubleshoot이고,
          이 문서는 <strong>비중 내림차순(D1=33%)</strong>으로 재배열한 것이다. 번호는 노트 기준을 그대로 유지했다.
        </p>
      </GuideSection>

      <GuideSection
        title="0-2. 항목(bullet) 단위 누락 — 4건"
        hint="공식 세부 bullet 30개 대조 결과. 도메인 누락은 없고 4건이 다른 항목에 흡수돼 얇게 다뤄지고 있었다"
      >
        <T
          head={['#', '공식 bullet', '노트 상태', '조치']}
          rows={[
            ['1', 'Validate hardware operation for workloads (D2)', '독립 항목 없음. D1 검증 항목에 암묵적 흡수', '🆕 3-11 워크로드 기반 하드웨어 동작 검증 신설'],
            ['2', 'Perform NCCL / HPL / NeMo burn-in (D1, 3개 bullet)', '1개 항목("번인")으로 통합', '계층별로 분리 서술 + 판정 기준 추가'],
            ['3', 'Confirm FW/SW on switches / BlueField-3 / transceivers (D1, 3개 bullet)', '1개 항목으로 통합', '스위치 OS별(MLNX-OS/NVOS/Cumulus) 명령 분리 서술'],
            ['4', 'Describe and validate cable types and transceivers 의 validate 측면 (D2)', '유형 설명 위주, 검수 절차 얇음', '입고 검수 절차 + mlxcables / mlxlink --show_module 판독 추가'],
          ]}
        />
      </GuideSection>

      <GuideSection title="0-3. 정정이 필요한 내용" hint="오류 6건 + 부정확 5건 — 여기가 기존 노트로 공부한 사람이 틀리는 지점">
        <T
          head={['위치', '기존 서술', '판정', '정정']}
          rows={[
            ['D2 · nvidia-smi', <code>nvidia-smi -q -d PCIE</code>, '❌ 오류',
              <>
                <code>-d</code>에 PCIE라는 값은 <strong>존재하지 않는다.</strong> PCIe 링크는 <code>nvidia-smi -q</code> 전체
                출력의 GPU Link Info 절, 또는{' '}
                <code>nvidia-smi --query-gpu=pcie.link.gen.max,pcie.link.gen.current,pcie.link.width.current --format=csv</code>
              </>],
            ['D5 · BlueField', '동작 모드 2가지(DPU/NIC)', '⚠️ 불완전',
              '공식은 3가지 — DPU 모드(ECPF, 기본) · Zero-Trust 모드 · NIC 모드. Zero-Trust는 DPU 모드의 확장으로 호스트 권한을 추가 제한'],
            ['D5 · BlueField', 'NIC 모드 전환 mlxconfig 파라미터 불명', '✅ 해소',
              <>
                BF-3: <code>mlxconfig -d /dev/mst/mt41692_pciconf0 s INTERNAL_CPU_OFFLOAD_ENGINE=1</code> → BlueField
                system-level reset(<code>mlxfwreset -d &lt;dev&gt; -l 4 r</code>). 복귀는 =0. BF-2는 4개 파라미터 동시 설정
              </>],
            ['D1 · 토폴로지', 'ibdiagnet --topo_file 문법 확인 필요', '✅ 해소',
              <>
                기준선 저장은 <code>ibdiagnet -w /path/fabric.topo</code>, 설계 대조는 <code>ibdiagnet -t /path/design.topo</code>
              </>],
            ['D2 · 전력/냉각', 'dcgmi dmon -e 155,150 필드 ID는 예시', '✅ 확인됨',
              '예시가 아니라 정확하다. 150 = DCGM_FI_DEV_GPU_TEMP, 155 = DCGM_FI_DEV_POWER_USAGE'],
            ['보충 · NVSwitch', 'HGX 베이스보드 NVSwitch 4개', '⚠️ 세대 한정',
              'HGX H100/H200 = 4개(NVSwitch 3세대). HGX A100 = 6개. GB200 NVL72는 랙 단위 9개 NVSwitch 트레이'],
            ['D2 · SuperPOD SU', 'SU = 노드 32대', '⚠️ 세대 한정',
              'DGX H100 SuperPOD = 32노드/SU. DGX A100 SuperPOD = 20노드/SU'],
            ['D1 · HPL', 'N은 GPU 메모리를 최대한 채우도록', '⚠️ 부정확',
              '실무·문서 권장은 가용 메모리의 약 80~90%. 100%에 맞추면 OOM/워크스페이스 부족'],
            ['D5 · MIG', 'A100/H100급', '⚠️ 불완전',
              '지원: A30(최대 4개), A100, H100, H200, B200/GB200. L4/L40S/RTX 계열은 MIG 미지원'],
            ['D2 · BMC', 'IPMI를 1차 경로로 서술', '⚠️ 보완',
              '최신 DGX/HGX는 Redfish 우선이며 보안상 IPMI-over-LAN이 기본 비활성인 경우가 있다. 자동화·FW 문맥은 항상 Redfish'],
            ['D1 · 케이블', '노드/패브릭 도구만 서술', '⚠️ 보완',
              'IB 포트 오류 카운터 표준 도구 perfquery와 대역폭 실측 ib_write_bw(perftest) 누락'],
          ]}
        />
      </GuideSection>

      <GuideSection title="0-4. 추가한 신규 주제 (🆕) — 9건" hint="블루프린트 항목을 실제로 풀려면 필요한 개념들">
        <T
          head={['주제', '왜 필요한가', '수록 위치']}
          rows={[
            [<code>ib_write_bw / ib_read_bw</code>, 'NCCL 이전 단계의 순수 RDMA 링크 대역폭 실측. "NCCL은 느린데 링크는 정상?" 격리', '2-4'],
            [<code>perfquery</code>, 'IB 포트 오류 카운터(SymbolError, LinkDowned, PortXmitDiscards) 조회·리셋', '2-4'],
            ['NVIDIA SHARP', 'Quantum 스위치의 in-network all-reduce 오프로드. NCCL 성능 문맥', '2-8, 7-8'],
            [<code>nvbandwidth</code>, 'H2D/D2H/P2P 대역폭 실측 — NUMA·PCIe 이상 조기 발견', '2-1'],
            ['IB 논리 상태 vs 물리 상태', 'ibstat의 State(Active) ≠ Physical state(LinkUp). INIT 정체 해석의 핵심', '7-1'],
            ['XID 92 / 119 / 120', '최신 드라이버(GSP)에서 자주 보이는 코드', '5-1'],
            ['워크로드 기반 하드웨어 검증', 'D2 블루프린트 bullet 직접 대응', '3-11'],
            [<code>mlxfwreset</code>, '재부팅 없이 FW 적용 / BF 모드 전환 반영', '2-6, 6-1'],
            [<code>gdsio</code>, 'GDS 전용 I/O 벤치마크 (fio만으로는 GDS 경로 측정 불가)', '5-4'],
          ]}
        />
      </GuideSection>

      <Part
        id="p1"
        tag="PART 1"
        title="시험 개요와 학습 전략"
        lead="문항당 평균 1분 36초. 고민할 시간이 길지 않으므로 '어디를 깊게 팔지'를 먼저 정한다."
      />

      <GuideSection title="1-1. 시험 스펙 (공식)" hint="대상 직군 — 데이터센터·인프라·네트워크·스토리지 관리자, 네트워크 엔지니어, 솔루션 아키텍트">
        <T
          head={['항목', '값']}
          rows={[
            ['정식 명칭', 'NVIDIA-Certified Professional: AI Infrastructure (NCP-AII)'],
            ['레벨', 'Professional (중급)'],
            ['문항 수', '70~75문항'],
            ['제한 시간', '120분 (문항당 평균 약 1분 36초)'],
            ['응시료', '$400'],
            ['언어', '영어만'],
            ['방식', '온라인 원격 감독(remote proctored) · Certiverse 계정 필수'],
            ['유효기간', '2년 (재응시로 갱신)'],
            ['권장 경력', 'NVIDIA 하드웨어 기반 데이터센터 운영 2~3년'],
            ['결과물', '디지털 배지 + (선택) 인증서'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-2. 학습 우선순위" hint="D1+D2가 64%. 여기서 승부가 난다">
        <Cmd>{`D1 검증 33% ─┐
             ├─ 합쳐서 64%. 여기서 승부가 난다.
D2 구축 31% ─┘
D3 컨트롤플레인 19%  ← BCM 고유 용어가 낯설어 실점하기 쉬움
D4 트러블슈팅 12%    ← XID·로그 소스 매칭만 외워도 대부분 득점
D5 물리계층  5%      ← 범위가 좁아 가성비 최고. 반드시 만점 목표`}</Cmd>
        <T
          head={['도메인', '비중', '73문항 기준', '전략']}
          rows={[
            ['D1 Cluster Test and Verification', '33%', '약 24문항', '가장 깊게. 검증 사다리가 뼈대'],
            ['D2 System and Server Bring-up', '31%', '약 23문항', '물리·펌웨어 계층이라 실점이 많다'],
            ['D3 Control Plane Install & Config', '19%', '약 14문항', 'BCM 고유 용어가 낯설어 실점'],
            ['D4 Troubleshoot and Optimize', '12%', '약 9문항', 'XID·로그 소스 매칭만 외워도 득점'],
            ['D5 Physical Layer Management', '5%', '약 4문항', '범위가 좁아 가성비 최고. 만점 목표'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-3. 이 시험의 문제 유형 3가지" hint="유형을 알면 지문에서 무엇을 찾아야 할지가 정해진다">
        <T
          head={['유형', '묻는 방식', '예']}
          rows={[
            ['도구↔계층 매칭', '"이 증상은 어느 도구로 확인하나" (전체의 절반 가까이)',
              '팬 이상 → ipmitool sdr / GPU 런타임 오류 → XID / 링크 품질 → mlxlink'],
            ['순서 문제', '"다음에 할 일은?" / "잘못된 순서를 고르시오"',
              '물리 → 펌웨어 → OS → 단일노드 → 패브릭 → 클러스터 → 번인'],
            ['결과 해석', '로그·출력 스니펫을 주고 원인 추론',
              'busbw가 기대의 절반 → GPUDirect RDMA 미동작 / FM 미기동 / 링크 저속 협상'],
          ]}
        />
      </GuideSection>

      <GuideSection title="1-4. 공부 방법" hint="매뉴얼 통독 금지">
        <ul className="guide-list">
          <li>블루프린트를 인덱스로 삼아 <strong>역방향 학습</strong>한다. 매뉴얼을 처음부터 읽지 않는다.</li>
          <li>명령어는 <strong>"무엇을 확인/변경하는 명령인가"</strong> 단위로 외운다. 옵션 문자 암기는 후순위.</li>
          <li>실제 시험은 영어. 각 항목의 영문 용어(8-4 대조표)를 반드시 병행한다.</li>
          <li>확실치 않은 항목은 ⚠️ 표시를 남기고 응시 전 공식 문서 원문과 대조한다.</li>
        </ul>
      </GuideSection>
    </>
  )
}
