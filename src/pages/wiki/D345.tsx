import { Cmd, GuideSection, Part, T } from '../parts'

/** Part 4 — D3 (19%) · Part 5 — D4 (12%) · Part 6 — D5 (5%) */
export default function D345() {
  return (
    <>
      <Part
        id="p4"
        tag="PART 4 · D3 19%"
        title="Control Plane Installation and Configuration"
        lead="클러스터의 두뇌를 세운다. BCM 고유 용어(소프트웨어 이미지 · 카테고리 · cmsh)와 컨테이너 GPU 스택의 내부 동작만 정확히 잡으면 실점이 없다."
      />

      <GuideSection title="4-1. Base Command Manager (BCM) 설치" hint="헤드 노드에서 컴퓨트 노드의 OS 프로비저닝·구성·모니터링·워크로드 매니저 설치를 일원 관리">
        <Cmd>{`1 헤드 노드에 BCM ISO 설치 (베이스 OS + 구성 마법사)
2 라이선스 활성화  request-license (제품 키)
3 관리 네트워크·프로비저닝 인터페이스 정의
4 소프트웨어 이미지(컴퓨트 노드용 OS 트리) 준비
5 노드 등록(MAC 기반) → 카테고리 할당 → PXE 부팅 프로비저닝`}</Cmd>
        <T
          head={['용어', '정의']}
          rows={[
            ['소프트웨어 이미지 (software image)', '컴퓨트 노드가 받을 루트 파일시스템 원본. 헤드에 보관 → 무엇을 설치하는가'],
            ['카테고리 (category)', '같은 이미지·설정을 공유하는 노드 그룹 (예: dgx-h100) → 누구에게 적용하는가'],
            ['노드 인스톨러 (node-installer)', '부팅 시 이미지와 로컬 디스크를 동기화하는 에이전트'],
            ['CMDaemon', '전 노드 관리 데몬. 관리 인터페이스는 cmsh(CLI) / Base View(GUI)'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>cmsh</code>, 'BCM 관리 CLI 진입 (device / category / softwareimage 모드)'],
            [<code>request-license</code>, '라이선스 활성화'],
            [<code>cmsh -c "device; list"</code>, '등록 노드 일람·상태'],
            [<code>cmsh -c "softwareimage; list"</code>, '소프트웨어 이미지 목록'],
            [<code>cmsh -c "device; power on -n node001"</code>, '🆕 BMC 경유 전원 제어'],
          ]}
        />
        <p className="guide-note">
          🆕 노드 상태 값: <strong>UP, DOWN, INSTALLING, INSTALLER_FAILED, PENDING, CLOSED</strong> — 프로비저닝 실패 진단의 출발점.
        </p>
      </GuideSection>

      <GuideSection title="4-2. BCM HA 구성·검증" hint="검증에는 수동 페일오버 테스트까지 포함된다">
        <T
          head={['요소', '역할']}
          rows={[
            ['공유(가상) IP', '컴퓨트 노드는 항상 이 IP로 액티브 헤드에 접근'],
            ['상태 동기화', '관리 DB·설정이 두 헤드 간 복제'],
            ['공유 스토리지', '/cm/shared, /home 등을 양쪽 헤드가 접근 (외부 스토리지 또는 DRBD류)'],
            ['하트비트·페일오버', '액티브 상실 감지 시 패시브가 역할 인수'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>cmha-setup</code>, 'HA 구성 마법사 (세컨더리 헤드 복제·공유 IP)'],
            [<code>cmha status</code>, '양 헤드 상태·동기화 확인'],
            [<code>cmha makeactive</code>, '수동 페일오버 — 대상 헤드를 액티브로 승격'],
          ]}
        />
        <p className="guide-note">
          🎯 헤드가 죽어도 <strong>이미 돌던 잡은 계속 돌 수 있으나</strong> 프로비저닝·모니터링은 마비된다.
        </p>
      </GuideSection>

      <GuideSection title="4-3. OS 설치 (BCM 프로비저닝)" hint="🪤 함정 다발 구간 — 노드에서 직접 고친 변경은 다음 동기화 때 사라진다">
        <p className="guide-desc">
          PXE 부팅 → 노드 인스톨러가 헤드에서 이미지 수신 → 디스크 동기화 → 카테고리 설정 적용.
        </p>
        <ul className="guide-list">
          <li>이미지 수정은 <strong>헤드 노드의 이미지 트리</strong>에서 한다 (chroot로 패키지 설치, 드라이버 추가)</li>
          <li>노드 인스톨러는 이미지와 디스크의 <strong>차이만 동기화</strong>한다 → 대규모에서도 빠름</li>
          <li>실행 중 노드에 변경을 밀어넣을 때는 <code>imageupdate</code> (재부팅 없이)</li>
          <li>커널·드라이버 같은 저수준 변경은 이미지 반영 후 <strong>재부팅 프로비저닝</strong>이 안전</li>
          <li>운영 패턴: 문제 노드는 고치지 않고 <strong>재프로비저닝으로 초기화</strong> (cattle, not pets)</li>
          <li>GPU 노드용 이미지에는 GPU 드라이버 · Container Toolkit · DOCA를 미리 넣어 전 노드 일관성 확보</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>cmsh -c "softwareimage; clone src new"</code>, '이미지 복제 후 수정'],
            [<code>cmsh -c "device use node001; set category dgx; commit"</code>, '노드에 카테고리 지정'],
            [<code>cmsh -c "device; imageupdate -n node001"</code>, '실행 중 노드에 변경분 동기화 (무중단)'],
            [<code>cmsh -c "device; pexec -n node001 reboot"</code>, '재부팅 → 프로비저닝 트리거'],
          ]}
        />
        <p className="guide-note">⚠️ imageupdate의 정확한 cmsh 문법·옵션은 BCM 버전별로 다르다 — Administrator Manual 확인.</p>
      </GuideSection>

      <GuideSection title="4-4. 클러스터 구성 — 카테고리 · 인터페이스 · Slurm/Enroot/Pyxis" hint="Enroot(런타임) vs Pyxis(플러그인) 역할 구분이 반복 출제">
        <T
          head={['계층', '역할']}
          rows={[
            ['카테고리', '노드 유형별(로그인/컴퓨트/DGX) 설정 묶음 — 마운트·서비스·커널 파라미터'],
            ['인터페이스', '노드/카테고리의 물리 인터페이스 ↔ 네트워크(managementnet, ibnet 등) 매핑. IB/IPoIB 설정 포함'],
            ['워크로드 매니저', 'cm-wlm-setup으로 Slurm(+Enroot/Pyxis) 설치'],
          ]}
        />
        <Cmd>{`Slurm      스케줄러 (자원 할당·큐)
  + Enroot  데몬 없는 비특권 컨테이너 런타임 (docker 이미지 → squashfs)
  + Pyxis   Slurm SPANK 플러그인 — srun에 --container-image 플래그 추가
= NGC 컨테이너를 Slurm 잡으로 바로 실행`}</Cmd>
        <h3 className="guide-h3">Slurm GPU 스케줄링 = GRES</h3>
        <T
          head={['파일/설정', '내용']}
          rows={[
            [<code>slurm.conf</code>, 'GresTypes=gpu + 노드 정의에 Gres=gpu:h100:8'],
            [<code>gres.conf</code>, 'GPU 디바이스 파일 매핑, 또는 AutoDetect=nvml(타입·개수·NUMA 자동 인식)'],
            [<code>cgroup.conf</code>, 'ConstrainDevices=yes — 잡이 할당받은 GPU만 보이게 격리'],
            ['잡 요청', 'srun --gres=gpu:8 또는 --gpus-per-node=8'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>cm-wlm-setup</code>, 'Slurm(+Enroot/Pyxis) 설치 마법사'],
            [<code>cmsh -c "category use dgx; interfaces; list"</code>, '카테고리 인터페이스 구성'],
            [<code>srun --container-image=nvcr.io#nvidia/pytorch:24.05-py3 nvidia-smi</code>, 'Pyxis로 NGC 컨테이너 잡 (동작 검증)'],
            [<code>sinfo / scontrol show node</code>, 'Slurm 노드 상태·GRES 확인'],
            [<code>srun --gres=gpu:2 nvidia-smi -L</code>, 'cgroup 격리 검증 — 2개만 보여야 정상'],
          ]}
        />
        <p className="guide-note">
          🎯 GRES 설정이 없으면 Slurm은 GPU를 스케줄하지 않는다. 격리 실패(할당보다 많은 GPU가 보임) → ConstrainDevices 확인.
        </p>
      </GuideSection>

      <GuideSection title="4-5. NVIDIA GPU · DOCA 드라이버 설치 / 업데이트 / 제거" hint="🪤 패키지 방식과 runfile 혼용 금지">
        <T
          head={['방식', '특징', '제거']}
          rows={[
            ['패키지 (권장)', '배포판/CUDA 저장소. 의존성·업데이트 관리 용이. DKMS로 커널 업데이트 시 자동 재빌드', 'apt-get purge "*nvidia*"'],
            ['runfile', '.run 실행. 저장소 없는 환경', 'nvidia-uninstall'],
          ]}
        />
        <p className="guide-note">
          커널 모듈 2종: <strong>오픈 GPU 커널 모듈</strong>(최신 데이터센터 GPU 기본 권장) vs 독점(proprietary) 모듈.
          Secure Boot 환경에서는 <strong>모듈 서명(MOK 등록)</strong>이 필요 — 드라이버 로드 실패의 흔한 원인이며
          TPM/보안 부팅과 연결되는 지점.
        </p>
        <p className="guide-desc">
          <strong>DOCA(-Host)</strong>는 BlueField/ConnectX용 소프트웨어 스택으로 과거 MLNX_OFED를 대체·포함한다.
          프로파일 메타패키지(doca-all, doca-networking, doca-ofed, doca-runtime)로 설치하고 <code>ofed_info -s</code>로 확인한다.
          ⚠️ 프로파일 명칭 구성은 DOCA 버전별로 달라진다.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>apt-get install cuda-drivers</code>, 'CUDA 저장소에서 GPU 드라이버 (Ubuntu)'],
            [<code>sh NVIDIA-Linux-x86_64-VER.run</code>, 'runfile 설치'],
            [<code>apt-get purge "*nvidia*"</code>, '패키지 드라이버 완전 제거 (업그레이드 전 정리)'],
            [<code>apt-get install doca-all</code>, 'DOCA-Host 전체 프로파일'],
            [<code>nvidia-smi / cat /proc/driver/nvidia/version</code>, '설치 확인·버전'],
            [<code>dkms status</code>, '커널별 모듈 빌드 상태'],
            [<code>ofed_info -s</code>, 'DOCA/OFED 버전'],
          ]}
        />
        <p className="guide-note">🪤 드라이버 업그레이드 시 <strong>Fabric Manager도 같은 버전으로 함께</strong> 올려야 한다.</p>
      </GuideSection>

      <GuideSection title="4-6. NVIDIA Container Toolkit · Docker에서 GPU 사용" hint="드라이버는 호스트에만, CUDA 툴킷·프레임워크는 컨테이너 안에">
        <Cmd>{`1  apt-get install nvidia-container-toolkit     (NVIDIA 저장소 등록 후)
2  nvidia-ctk runtime configure --runtime=docker
3  systemctl restart docker`}</Cmd>
        <Cmd>{`docker run --gpus all
  → nvidia 런타임 훅 개입
    → libnvidia-container가 호스트의
       · GPU 디바이스 노드 (/dev/nvidia0, /dev/nvidiactl, /dev/nvidia-uvm)
       · 드라이버 사용자 라이브러리 (libcuda.so, libnvidia-ml.so …)
      를 컨테이너 네임스페이스에 바인드 마운트`}</Cmd>
        <p className="guide-note">
          → 그래서 이미지 안에 드라이버가 없어도 nvidia-smi가 동작한다. 단, <strong>이미지의 CUDA 버전은 호스트 드라이버가
          지원하는 범위</strong>여야 한다(전방 호환 매트릭스).
        </p>
        <T
          head={['방법', '예']}
          rows={[
            ['전체', '--gpus all'],
            ['지정', '--gpus "device=0,1"'],
            ['환경변수', 'NVIDIA_VISIBLE_DEVICES=0,1 (무엇을 주입)'],
            ['기능 범위', 'NVIDIA_DRIVER_CAPABILITIES=compute,utility (어떤 기능을)'],
            ['MIG', '--gpus "device=0:0" 또는 MIG UUID'],
          ]}
        />
        <p className="guide-desc">
          <strong>CDI (Container Device Interface)</strong> — 훅 방식의 런타임 종속성을 제거. <code>nvidia-ctk cdi generate</code>로
          디바이스 스펙(JSON/YAML)을 만들면 CDI 지원 런타임(containerd/CRI-O/Podman)이 표준 인터페이스로 GPU를 주입한다.
          K8s 생태계가 이 방향으로 수렴 중.
        </p>
        <Cmd>{`🪤 "컨테이너에서 GPU 안 보임" 진단 체크리스트 (계층 순)
1 호스트 nvidia-smi 정상?                     → 드라이버 계층
2 docker info | grep -i runtime → nvidia 등록? → nvidia-ctk 실행 여부
3 --gpus 플래그 / NVIDIA_VISIBLE_DEVICES 지정?  → 요청 계층
4 컨테이너 내 ls /dev/nvidia*                  → 디바이스 주입 확인
5 이미지 CUDA 버전 vs 호스트 드라이버 호환?     → 버전 매트릭스`}</Cmd>
      </GuideSection>

      <GuideSection title="4-7. NGC CLI 설치·사용" hint="레지스트리는 nvcr.io — 로그인 사용자명은 리터럴 $oauthtoken">
        <ul className="guide-list">
          <li>CLI는 배포판 패키지가 아니라 <strong>압축 파일</strong> — 다운로드 후 압축 해제 → PATH 등록</li>
          <li>API 키 발급 → <code>ngc config set</code>으로 키·org·team 저장 (org/team 스코프가 접근 권한을 결정)</li>
          <li>컨테이너 레지스트리 로그인은 별도: 사용자명 <strong>$oauthtoken</strong>, 비밀번호는 API 키</li>
        </ul>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>ngc config set</code>, 'API 키·org·team 설정'],
            [<code>ngc registry image list "nvidia/*"</code>, '컨테이너 이미지 검색'],
            [<code>ngc registry image pull nvidia/pytorch:24.05-py3</code>, '이미지 풀'],
            [<code>ngc registry model download-version org/model:ver</code>, '모델 다운로드'],
            [<code>docker login nvcr.io</code>, '사용자명 $oauthtoken + API 키'],
            [<code>enroot import docker://nvcr.io#nvidia/pytorch:24.05-py3</code>, 'Enroot 환경에서 같은 자산 사용'],
          ]}
        />
      </GuideSection>

      <Part
        id="p5"
        tag="PART 5 · D4 12%"
        title="Troubleshoot and Optimize"
        lead="식별 → 격리 → 교체 → 재검증 사이클 + CPU/스토리지 최적화. '어떤 증상 → 어디를 본다'의 매핑이 이 도메인의 8할이다."
      />

      <GuideSection title="5-1. 하드웨어 결함 식별 — GPU · 팬 · NIC · PSU" hint="🪤 잘못된 소스를 보면(GPU 멈춤인데 SEL만 확인) 진단이 며칠씩 늦어진다">
        <T
          head={['부품', '1차 소스', '확인 명령', '2차 확인']}
          rows={[
            ['GPU', 'dmesg의 XID', 'dmesg -T | grep -i xid', 'dcgmi diag -r 3, nvidia-smi -q -d ECC,ROW_REMAPPER'],
            ['팬', 'BMC 센서 / SEL', 'ipmitool sdr elist | grep -i fan', '온도 상승 동반 여부'],
            ['PSU', 'BMC SEL', 'ipmitool sel elist | grep -iE "ps|pwr"', '이중화 상태, 입력 상실 이벤트'],
            ['NIC / 링크', 'mlxlink, ethtool', 'mlxlink -d mlx5_0 -c -e, ethtool -S if | grep -i err', 'dmesg의 mlx5 메시지, perfquery'],
            ['NVSwitch/FM', 'FM 로그', 'journalctl -u nvidia-fabricmanager', 'nvidia-smi nvlink --status'],
            ['스토리지', 'dmesg / SMART', 'nvme error-log, smartctl -a', 'fio 재현'],
          ]}
        />
        <h3 className="guide-h3">대표 XID 코드 ✅ (92·119·120 신규)</h3>
        <T
          head={['XID', '의미', '성격']}
          rows={[
            ['13', 'Graphics Engine Exception', '주로 앱/메모리 접근 문제'],
            ['31', 'GPU memory page fault', '앱 버그 가능성 우선'],
            ['43', 'GPU stopped processing', '앱 측 오류 가능'],
            ['48', 'Double-Bit ECC (DBE)', '하드웨어 메모리 오류 — 조치 필요'],
            ['63 / 64', 'ECC page retirement / row remapping 기록(63) · 기록 실패(64)', '64는 심각'],
            ['74', 'NVLink 오류', '링크/토폴로지·NVSwitch 확인'],
            ['79', 'GPU has fallen off the bus', 'PCIe에서 소실. 전원·시트·보드 문제, 대개 RMA성'],
            ['🆕 92', 'High single-bit ECC error rate', '열화 추세 — 감시 대상'],
            ['94 / 95', 'Contained(94) / Uncontained(95) ECC', '95는 GPU 리셋/노드 재부팅 수준'],
            ['🆕 119 / 120', 'GSP RPC timeout / GSP error', '최신 드라이버(GSP 펌웨어) 계열. 드라이버·FW 버전 정합 확인'],
          ]}
        />
        <p className="guide-note">
          🎯 XID 79 = 하드웨어성(버스 소실) vs XID 13/31 = 앱 가능성 — 성격 구분.
          row remapping 실패·반복 DBE = 교체(RMA) 근거.
        </p>
      </GuideSection>

      <GuideSection title="5-2. 결함 부품 교체 — GPU · 카드 · PSU" hint="drain이 첫 물리 행동 — 잡이 도는 노드에서 바로 뽑지 않는다">
        <Cmd>{`증상 인지 (잡 실패·알람)
  → 로그 확인 (dmesg XID · ipmitool sel · dcgmi)
    → 진단 실행 (dcgmi diag · mlxlink · ethtool)
      → 부품 격리 (Slurm 노드 drain)   ★ 첫 물리 행동
        → 안전 절차 (전원 차단 · ESD) → 물리 교체
          → 펌웨어/설정 정합 (클러스터 표준 번들로)
            → 재검증 (lspci/nvidia-smi → dcgmi diag -r 3 → NCCL/mlxlink)
              → scontrol resume 복귀 + 티켓·자산 기록`}</Cmd>
        <T
          head={['핫스왑 가능 (통상)', '전원 차단 필요']}
          rows={[['PSU, 팬, 일부 드라이브', 'GPU, NIC/DPU, 메모리, 마더보드']]}
        />
        <p className="guide-note">
          ⚠️ 기종별 핫스왑 지원 범위는 Service Manual 기준. 🆕 HGX/SXM 시스템의 GPU는 개별 카드가 아니라
          <strong> 베이스보드(트레이) 단위 교체</strong>인 경우가 많다.
        </p>
        <T
          head={['명령', '용도']}
          rows={[
            [<code>scontrol update nodename=n state=drain reason="GPU RMA"</code>, '노드 배수 (신규 잡 차단)'],
            [<code>sinfo -R</code>, '🆕 drain 사유 일람'],
            [<code>scontrol update nodename=n state=resume</code>, '재검증 통과 후 복귀'],
            [<code>nvidia-smi -q | grep -i serial</code>, '교체 전후 시리얼 (자산 기록)'],
          ]}
        />
      </GuideSection>

      <GuideSection title="5-3. AMD · Intel 서버 성능 최적화" hint="튜닝 3축 — NUMA 정렬 · BIOS 성능 설정 · PCIe 경로">
        <T
          head={['항목', '내용']}
          rows={[
            ['affinity 확인', 'nvidia-smi topo -m으로 GPU↔NIC↔CPU 소속 확인 → 최적화의 출발점'],
            ['프로세스 바인딩', 'numactl --cpunodebind=N --membind=N app'],
            ['BIOS', '전력 프로파일 Performance, 깊은 C-state 제한, SMT/HT는 워크로드에 따라'],
            ['PCIe ACS', 'ACS가 P2P 트랜잭션을 IOMMU로 강제 우회시켜 성능 저하 → 필요 시 비활성 (가상화 격리와 트레이드오프)'],
          ]}
        />
        <T
          head={['', 'AMD EPYC', 'Intel Xeon']}
          rows={[
            ['소켓 내부 NUMA 분할', 'NPS (NUMA Per Socket): NPS1 ~ NPS4', 'SNC (Sub-NUMA Clustering)'],
            ['IOMMU', 'IOMMU 설정이 P2P·RDMA 경로에 영향', 'VT-d'],
            ['기타', 'Preferred IO / xGMI 대역폭', '터보 · Uncore 주파수'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>nvidia-smi topo -m</code>, 'GPU/NIC의 CPU·NUMA affinity'],
            [<code>numactl -H / lscpu | grep -i numa</code>, 'NUMA 토폴로지 (NPS/SNC 결과 검증)'],
            [<code>numactl --cpunodebind=0 --membind=0 app</code>, '프로세스 바인딩'],
            [<code>cpupower frequency-set -g performance</code>, 'CPU 거버너'],
            [<code>nvbandwidth</code>, '🆕 튜닝 전후 H2D/D2H/P2P 대역폭 실측'],
          ]}
        />
        <p className="guide-note">
          🎯 "H2D 전송이 느린 GPU" → NUMA 크로스 접근 / 바인딩 확인. ⚠️ 권장 BIOS 값의 구체 수준(NPS1 vs NPS4)은
          플랫폼별 공식 튜닝 가이드로 확인.
        </p>
      </GuideSection>

      <GuideSection title="5-4. 스토리지 최적화" hint="방법론 자체가 정답 — 계층 분리 측정">
        <Cmd>{`1 로컬 vs 원격 분리   로컬 NVMe에 fio → 정상이면 네트워크/원격 계층으로
2 네트워크           iperf3로 원시 대역폭, MTU 정합, 스토리지 패브릭 링크 상태
3 클라이언트 파라미터  NFS nconnect/rsize/wsize, 병렬 FS 스트라이프·캐시
4 동시성             1노드 vs N노드 동시 접근 시 집합 대역폭 (서버측 한계)
5 GPU 직결           GDS 적용 여부·효과
→ 재측정 → 반복`}</Cmd>
        <T
          head={['패턴', '병목 신호', '대응']}
          rows={[
            ['데이터 로딩', 'GPU 사용률이 주기적으로 뚝 떨어짐', 'DataLoader 워커 수·프리페치 ↔ 스토리지 IOPS 균형'],
            ['체크포인트', '저장 시 전 노드 stall', '쓰기 집합 대역폭, 파일시스템 스트라이프'],
            ['작은 파일 수백만 개', '메타데이터 병목 (mdtest로 측정)', 'WebDataset류 샤딩 포맷으로 회피'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>/usr/local/cuda/gds/tools/gdscheck -p</code>, 'GDS 설치·지원 상태 점검'],
            [<code>/usr/local/cuda/gds/tools/gdsio ...</code>, '🆕 GDS 경로 전용 I/O 벤치마크'],
            [<code>fio --direct=1 ...</code>, '계층 분리 측정'],
            [<code>nfsstat -m / mount | grep nfs</code>, '적용 중인 클라이언트 파라미터'],
          ]}
        />
      </GuideSection>

      <Part
        id="p6"
        tag="PART 6 · D5 5%"
        title="Physical Layer Management"
        lead="비중은 가장 작지만 범위가 좁아(BlueField 관리 + MIG) 득점 효율 최고. 만점을 목표로 한다."
      />

      <GuideSection title="6-1. BlueField 네트워크 플랫폼 구성·관리" hint="✅ 동작 모드는 3가지 (기존 노트 2가지 → 정정)">
        <T
          head={['모드', '설명', '용도']}
          rows={[
            ['DPU 모드 (ECPF ownership) — 기본', 'Arm이 자체 OS를 실행하며 NIC 리소스와 데이터패스를 소유. 호스트 트래픽이 DPU의 OVS/서비스를 경유', '인프라 제어평면 분리, 멀티테넌시, 스토리지·보안 오프로드'],
            ['🆕 Zero-Trust 모드', 'DPU 모드의 확장 — 호스트 측 권한을 추가로 제한', '신뢰 경계를 호스트 밖에 두는 보안 요구'],
            ['NIC 모드', 'Arm 서브시스템 비활성(UEFI 부팅 중 sleep), 고성능 ConnectX NIC처럼만 동작. DRAM 대부분이 NIC FW에 재할당', 'AI 컴퓨트 패브릭처럼 순수 대역폭이 목적일 때'],
          ]}
        />
        <Cmd>{`# 현재 설정 확인
mst start
mlxconfig -d /dev/mst/mt41692_pciconf0 -e q     # INTERNAL_CPU_MODEL=EMBEDDED_CPU(1) 이면 DPU 모드

# BlueField-3: DPU 모드 → NIC 모드
mlxconfig -d /dev/mst/mt41692_pciconf0 s INTERNAL_CPU_OFFLOAD_ENGINE=1
mlxfwreset -d /dev/mst/mt41692_pciconf0 -l 4 r   # 또는 전원 사이클

# NIC 모드 → DPU 모드 복귀
mlxconfig -d /dev/mst/mt41692_pciconf0 s INTERNAL_CPU_OFFLOAD_ENGINE=0`}</Cmd>
        <p className="guide-note">
          BlueField-2는 INTERNAL_CPU_PAGE_SUPPLIER / ESWITCH_MANAGER / IB_VPORT0 / OFFLOAD_ENGINE 4개를 함께 설정한다.
          호스트 BIOS HII(UEFI) 메뉴 또는 BlueField BMC Redfish로도 전환 가능.
          🪤 NIC 모드에서는 multi-host가 지원되지 않으며 Arm 측 드라이버·서비스가 동작하지 않는다.
        </p>
        <T
          head={['요소', '역할']}
          rows={[
            ['rshim', '호스트에서 USB/PCIe로 DPU 콘솔 접근·이미지 설치를 제공하는 드라이버. /dev/rshim0 생성'],
            ['BFB (BlueField Bootstream)', 'Arm측 OS(Ubuntu 등) + 펌웨어를 담은 설치 이미지. bfb-install로 rshim을 통해 주입'],
            ['DOCA', 'DPU 애플리케이션·서비스 프레임워크 (호스트측 DOCA-Host + DPU측 런타임). 구 MLNX_OFED 계승'],
            ['mlxconfig', '모드 전환 등 장치 NV 설정 변경 (리셋/전원 사이클로 적용)'],
            ['bfvcheck', 'DPU에서 권장 FW/SW 번들 버전 정합 점검'],
            ['mlxfwreset', '재부팅 없이 FW/설정 적용'],
          ]}
        />
        <T
          head={['명령', '용도']}
          rows={[
            [<code>mst start && mst status</code>, 'MFT 기동 · 디바이스 경로 확인'],
            [<code>mlxconfig -d /dev/mst/DEV q</code>, '현재 NV 설정(모드 포함) 조회'],
            [<code>bfb-install --bfb image.bfb --rshim rshim0</code>, 'BFB 설치'],
            [<code>screen /dev/rshim0/console</code>, 'rshim 콘솔로 DPU 부팅 관찰'],
            [<code>bfvcheck</code>, '(DPU 내부) 번들 정합 점검'],
          ]}
        />
      </GuideSection>

      <GuideSection title="6-2. MIG (Multi-Instance GPU) 구성" hint="GPU 한 장을 최대 7개의 하드웨어 격리 인스턴스로 — 예측 가능한 QoS">
        <p className="guide-note">
          ✅ 지원 GPU: <strong>A30(최대 4개), A100, H100, H200, B200/GB200.</strong> L4 · L40S · RTX 계열은 미지원.
        </p>
        <T
          head={['방식', '격리', '용도']}
          rows={[
            ['MIG', '하드웨어 격리 (SM·메모리·L2 전용)', '다중 테넌트, 추론 서비스, 예측 가능한 QoS'],
            ['MPS', '프로세스 공유, 격리 없음', '단일 사용자 다중 소형 프로세스'],
            ['time-slicing', '시분할, 격리 없음', 'K8s에서 GPU 오버서브스크립션'],
            ['전체 GPU', '—', '대형 학습은 MIG 비활성'],
          ]}
        />
        <T
          head={['계층', '정의']}
          rows={[
            ['GI (GPU Instance)', '메모리 + SM 슬라이스 묶음. 프로파일 표기 Ng.Mgb = 컴퓨트 슬라이스 N개 + 메모리 M GB'],
            ['CI (Compute Instance)', 'GI 내부의 연산 분할. 기본은 GI 전체 = 1 CI'],
          ]}
        />
        <p className="guide-note">
          H100 80GB 프로파일 예: 1g.10gb(7개) · 1g.20gb(me 변형) · 2g.20gb(3개) · 3g.40gb(2개) · 4g.40gb(1개) · 7g.80gb(1개).
          🆕 프로파일은 <strong>배치(placement) 규칙</strong>이 있어 임의 조합이 다 되지는 않는다 — <code>nvidia-smi mig -lgip</code>의
          잔여 슬롯으로 확인.
        </p>
        <Cmd>{`1  nvidia-smi -i 0 -mig 1                        MIG 모드 활성화 (GPU 리셋 필요, 사용 중 프로세스 없어야 함)
2  nvidia-smi mig -lgip                          생성 가능한 GI 프로파일·잔여 슬롯 확인
3  nvidia-smi mig -cgi 3g.40gb,2g.20gb,1g.10gb,1g.10gb -C    GI 생성 + (-C) 기본 CI 자동 생성
4  nvidia-smi -L                                 MIG 디바이스 UUID 확인
5  워크로드 할당  CUDA_VISIBLE_DEVICES=MIG-UUID  또는  docker --gpus "device=0:0"

삭제는 역순: nvidia-smi mig -dci → nvidia-smi mig -dgi → nvidia-smi -i 0 -mig 0`}</Cmd>
        <ul className="guide-list">
          <li>MIG 모드는 재부팅 후 유지되지만 <strong>인스턴스 배치는 자동 재생성되지 않는</strong> 드라이버 버전이 있어 부팅 스크립트로 관리하는 패턴이 일반적</li>
          <li>Slurm / K8s(GPU Operator + MIG Manager)도 MIG 프로파일 인지 스케줄링을 지원</li>
          <li>🪤 <strong>MIG 인스턴스 간에는 NVLink P2P를 사용할 수 없다.</strong> 대형 학습에서 MIG를 끄는 이유</li>
        </ul>
      </GuideSection>
    </>
  )
}
