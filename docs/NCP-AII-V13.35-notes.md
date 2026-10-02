# NCP-AII V13.35 덤프 분석 · 교정 내역

원문: [NCP-AII-V13.35.md](NCP-AII-V13.35.md) (197문항, 광고 문구 제거본)
문제은행: `src/data/ncp2/` (191문항, id `v001`~`v191`) · 시험 ID `ncp-aii-v13`

## 1. 덤프 품질 요약

| 구분 | 건수 | 처리 |
|---|---|---|
| 완전 중복 문항 | 6쌍 | 한 쪽만 채택 |
| 보기가 비어 있음(이미지 누락) | 1 | 실제 문법으로 보기 재구성 |
| exhibit(이미지) 없이는 풀 수 없음 | 10 | 출력·라벨 내용을 문제 본문에 텍스트로 편입 |
| 정답 또는 보기가 명백히 틀림 | 4 | 교정 후 해설에 원문 표기 명시 |
| OCR 손상(숫자·명령 깨짐) | 5 | 원래 값으로 복원 |

## 2. 제거한 중복 (뒤쪽을 버림)

| 원문 | 중복 상대 | 내용 |
|---|---|---|
| Q14 | Q20 | HPL "not enough memory" → 문제 크기 축소 |
| Q70 | Q128 | InfiniBand 지연 측정 도구 |
| Q58 | Q172 | DGX H100 펌웨어 업그레이드 순서 |
| Q96 | Q110 | DGX 최초 부팅 관리자 계정 |
| Q125 | Q194 | ClusterKit 350 GB/s 해석 |
| Q100 | Q140 | 패브릭 텔레메트리가 흐르는 네트워크 |

## 3. 정답·보기 교정

| 문항 | 덤프 원문 | 교정 | 근거 |
|---|---|---|---|
| Q80 → `v079` | 정답 **GM**, 보기 A/C가 `0.041666667`·`0.5`로 깨짐 | 정답 **PM**(Performance Manager), 보기를 BM/GM/PM/SM으로 복원 | 패브릭 카운터 수집은 Performance Manager의 역할. 깨진 보기는 엑셀이 "AM/PM"을 시각으로 변환한 흔적 |
| Q126 → `v124` | Equal Share = `RmPVMRL=0x00` | `RmPVMRL=0x01` | 0x00 = Best Effort, 0x01 = Equal Share(기본 time slice), 0x11 = Fixed Share |
| Q37 → `v036` | `cmsh status` | `cmha status` | BCM HA 상태 점검 전용 명령 |
| Q146 → `v142` | `esxcli system module parameters set -m nvidia -p` (값 잘림) | `NVreg_RegistryDwordsPerDevice=pci=<domain>:<bdf>;RmPVMRL=0x11` | 단일 GPU 대상은 PerDevice, Fixed Share는 0x11 |
| Q34 → `v033` | `mlxlink -d <device> -c -e` | 보기는 유지, 해설에서 **BER 플래그는 `-c`(--show_counters), `-e`는 --show_eye** 로 명시 | 보기 중 mlxlink는 하나뿐이라 정답 자체는 불변 |

## 4. OCR·표기 복원

- Q5 → `v005`: `2006 DAC` / `1006 speeds` → **200G / 100G**
- Q108 → `v107`: `mixconfig` → **mlxconfig**
- Q188 → `v183`: `grep log_tra_info varlogopensm.log` → **`grep -i 'routing' /var/log/opensm.log`**
- Q131·Q104 → `v128`·`v103`: 따옴표가 깨진 `--gpus` 셀렉터 표기 정리
- Q33·Q35 → `v032`·`v034`: 의미 없는 `1.5E-254` 수치를 "문서화된 임계값 초과"로 일반화

## 5. 이미지 의존 문항 처리

보기만으로는 풀 수 없던 문항은 exhibit의 핵심 내용을 본문에 넣어 자립형으로 만들었다.

| 원문 | 편입한 내용 |
|---|---|
| Q7 → `v007` | 보기 A~D가 통째로 비어 있어 실제 cmsh 본딩 문법으로 4지선다 재작성 |
| Q17 → `v017` | `Verify installed GPUs ... Unhealthy` + PCI 07:00.0 누락 |
| Q49 → `v048` | `could not select device driver ... capabilities: [[gpu]]` 오류 |
| Q51 → `v050` | ibstat: State Active / Physical LinkUp / **Link layer Ethernet** |
| Q67·Q98·Q161 → `v066`·`v097`·`v157` | LinkX DAC 최대 속도·최대 길이·색상 코드 |
| Q115 → `v113` | 라벨의 base MAC `0002C9270500` |
| Q168 → `v164` | ibdiagnet 단계별 경고/오류 개수 요약이라는 사실 |
| Q174 → `v169` | ibstat: State Initializing / LinkUp / **SM lid 0** |
| Q178 → `v173` | `nvidia-ctk runtime configure --runtime=docker` 실행 직후 상황 |

## 6. 해설에 함정으로 표시한 문항

- `v156`(Q160): 보기 중 **"NCCL로 GPU-CPU 통신 검증"** 은 서술 자체가 오류(NCCL은 GPU 간 라이브러리). 그래서 단일 노드 벤치마크가 정답이 된다.
- `v151`(Q155): 원문은 GPU 설치 상황인데 보기에 GPU 드라이버가 없다. 문항의 핵심은 "드라이버 부재"이며 보기 중 드라이버는 OFED뿐 — 본문을 "NVIDIA 장치"로 일반화하고 해설에 이 사정을 남겼다.
- `v065`(Q66): busbw는 2(n−1)/n 보정 환산값이라 algbw보다 큰 것이 정상. 다만 NVLink가 섞인 멀티노드 실행에서는 IB 부하를 과대평가할 수 있다는 단서를 덧붙였다.

## 7. 도메인 분포 (공식 블루프린트 대비)

| 도메인 | 본 문제은행 | 공식 비중 |
|---|---|---|
| D1 Cluster Test & Verification | 43 (22.5%) | 33% |
| D2 System & Server Bring-up | 49 (25.7%) | 31% |
| D3 Control Plane Install & Config | 42 (22.0%) | 19% |
| D4 Troubleshoot & Optimize | 29 (15.2%) | 12% |
| D5 Physical Layer Management | 28 (14.7%) | 5% |

덤프 특성상 D5(케이블·DPU·vGPU)와 D3(컨테이너·NGC)가 공식 비중보다 과대 표집되어 있다. 결과 화면의 도메인별 정답률을 볼 때 이 편향을 감안할 것.

## 8. 검증

```bash
npm run validate:ncp2
```

`answer-key.json`(정답 문자 원장) ↔ `questions*.json`(정답 인덱스) 대조 191/191 일치.
