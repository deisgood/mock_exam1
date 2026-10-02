# NCP-AII 덤프 원문 (V13.35)

- **Exam**: NCP-AII / NVIDIA AI Infrastructure
- **Vendor**: NVIDIA
- **Version**: V13.35 (197문항)
- 원문의 `IT Certification Guaranteed, The Easy Way!` 광고 문구와 페이지 번호는 제거했다.
- 원문 그대로 보존한 사본이다. **정답 교정은 하지 않았다** — 교정 내역은 `docs/NCP-AII-V13.35-notes.md` 참고.

---

## QUESTION 1

A research organization deploys NVIDIA BlueField DPUs in an AI cluster to improve infrastructure efficiency. Shortly after deployment, administrators observe that CPU utilization on compute nodes decreases during storage and network-intensive workloads while GPU utilization remains unchanged. Which DPU capability most directly explains this improvement?

- A. Executing CUDA kernels on behalf of GPUs
- B. Offloading infrastructure services such as networking, storage, and security from the host CPU
- C. Increasing GPU memory capacity through memory pooling
- D. Replacing the InfiniBand fabric with PCIe communication

**Answer: B**

**Explanation:** BlueField DPUs are designed to offload infrastructure functions--including networking, storage virtualization, encryption, firewall processing, and telemetry--from the host CPU. This frees CPU resources for application execution while maintaining GPU performance. DPUs do not execute CUDA workloads, expand GPU memory, or replace the network interconnect.

## QUESTION 2

A system administrator needs to improve the performance of MPI operations and use SHARP. Which items should be offloaded?

- A. Operations to the system CPU
- B. Collective operations from the CPU to the switch network.
- C. Packets from the switch into system memory
- D. IDS/IPS operations to the switch network.

**Answer: B**

**Explanation:** SHARP improves MPI performance by offloading collective operations from the host CPU to the switch network. This allows reductions and other collective communications to be processed in-network, reducing latency, CPU overhead, and communication bottlenecks in large-scale AI/HPC workloads.

## QUESTION 3

The system administrator plans to use Multi-instance GPU profiles. What command should be used to verify that the GPU has this mode enabled?

- A. nvidia-mode
- B. nvidia-smi
- C. nvidia-mig
- D. nvidia-enable

**Answer: B**

**Explanation:** nvidia-smi is the standard NVIDIA management command used to verify whether MIG mode is enabled on a supported GPU. It displays the GPU's MIG status and can also show configured MIG instances and profiles.

## QUESTION 4

An AI operations team investigates unexpectedly slow distributed training. GPU utilization averages only 55%, while storage, CPU, and InfiniBand monitoring all indicate normal performance. DCGM reports no hardware faults, but profiling shows GPUs frequently waiting during synchronization phases. Which area should the engineers investigate first?

- A. NCCL communication configuration and topology awareness
- B. NVMe drive firmware compatibility
- C. CPU thermal throttling
- D. MIG partition sizing

**Answer: A**

**Explanation:** When GPU utilization drops primarily during synchronization despite healthy hardware and storage performance, inefficient collective communication is a likely cause. NCCL configuration--including transport selection, topology detection, and network optimization--should be examined first. Storage firmware, CPU thermals, and MIG configuration are less likely to produce synchronization-specific delays in this scenario.

## QUESTION 5

A DGX H100 system shows intermittent "Link Down" errors on a 2006 DAC cable. CVT reports "No Signal" despite physical connection. What is the first hardware check?

- A. Verify cable compatibility via ConnectX-7 firmware's validated adapters list and inspect connectors for damage.
- B. Reconfigure the port for 1006 speeds via NVIDIA MST.
- C. Replace the switch's optical transceiver with a higher-wattage model.
- D. Upgrade all leaf switches to support RS-FEC.

**Answer: A**

**Explanation:** A CVT "No Signal" result with intermittent link-down events points first to a physical-layer problem. The initial hardware check should confirm that the DAC is supported for the ConnectX-7/DGX H100 platform and inspect the cable ends, ports, and connectors for damage, seating issues, or incompatibility before changing speed, FEC, or switch hardware.

## QUESTION 6

An AI engineering team trains a foundation model whose dataset resides on a high-performance parallel file system. Storage analysis reveals that a large percentage of CPU cycles are consumed copying data between storage devices and system memory before the GPUs can access it. The architect wants to reduce CPU overhead while increasing data throughput to the GPUs. Which technology should be implemented?

- A. NVIDIA GPUDirect Storage
- B. NVIDIA MIG
- C. NVIDIA NVSwitch
- D. Kubernetes Device Plugin

**Answer: A**

**Explanation:** GPUDirect Storage enables compatible storage devices to transfer data directly into GPU memory, bypassing unnecessary CPU memory copies. This significantly reduces CPU overhead, lowers latency, and improves throughput for data-intensive AI training workloads. NVSwitch accelerates GPU interconnects, while MIG and the Device Plugin serve completely different purposes.

## QUESTION 7

During BCM cluster setup, an engineer must configure bonded network interfaces on DGX nodes for high availability. Which cmsh command sequence properly configures a bond0 interface with two physical NICs?

- A. *(원문 덤프에 보기 본문이 비어 있음 — 이미지 누락)*
- B. *(원문 덤프에 보기 본문이 비어 있음 — 이미지 누락)*
- C. *(원문 덤프에 보기 본문이 비어 있음 — 이미지 누락)*
- D. *(원문 덤프에 보기 본문이 비어 있음 — 이미지 누락)*

**Answer: C**

**Explanation:** In BCM cmsh, a bonded interface is created by adding a bond interface, appending the two physical NICs as bond members, setting the bonding mode, and assigning the bond to the appropriate network. This configures bond0 with the two physical interfaces for high availability on the internal network.

## QUESTION 8

A team is installing the NVIDIA Run:ai control plane on a Kubernetes cluster. Which two options are most critical to validate before proceeding?

- A. All cluster nodes have NVIDIA GPUs installed.
- B. Helm is installed on the installer machine.
- C. Ensure Kubernetes is running on the cluster.
- D. NTP is disabled to simplify time synchronization.

**Answer: BC**

**Explanation:** Installing the NVIDIA Run:ai control plane requires a functioning Kubernetes cluster as the target platform and Helm on the installer machine to deploy the control plane charts. These prerequisites must be validated before starting the installation.

## QUESTION 9

During a multi-day NeMo burn-in, intermittent "GPU fell off bus" errors occur. Which diagnostic approach isolates hardware faults?

- A. Run DCGM diagnostics alongside burn-in to monitor GPU health metrics
- B. Switch from BERT to GPT models for simpler computations
- C. Enable HPL_USE_NVSHMEM for alternative memory sharing
- D. Reduce blocksize to 500MB to lower memory pressure

**Answer: A**

**Explanation:** DCGM diagnostics are designed to validate GPU health and detect hardware-related issues during stress or burn-in testing. Running DCGM alongside the NeMo burn-in helps correlate "GPU fell off bus" events with GPU telemetry, PCIe issues, ECC errors, thermal behavior, or other hardware fault indicators.

## QUESTION 10

A system administrator is virtualizing GPUs in VMware vSphere and needs to allocate a vGPU profile from the drop-down menu. There are several options available. What does "grid_a100-20c" mean?

- A. This is a NVIDIA A100 which allows VMs to be over-committed.
- B. This is a vGPU Profile on NVIDIA A100 where 20 VMs can use the GPU.
- C. This is a NVIDIA A100 which allows 20 Cores of compute to a VM
- D. This is a 20GB vGPU profile on NVIDIA A100.

**Answer: D**

**Explanation:** grid_a100-20c identifies an NVIDIA A100 vGPU profile with a 20 GB framebuffer allocation. The profile name indicates the GPU family, assigned vGPU memory size, and compute-focused profile type used for VM GPU virtualization.

## QUESTION 11

A company has a registered NGC account and their server has NGC CLI installed. What step should be taken first to gain access to NGC?

- A. ngc config get
- B. ngc config update
- C. ngc config set
- D. ngc init

**Answer: C**

**Explanation:** ngc config set is the first configuration step after installing the NGC CLI. It prompts for the required NGC credentials, including the API key, and stores them so the system can authenticate and access NGC resources.

## QUESTION 12

A system administrator is installing a GPU into a server and needs to avoid damaging the device. What item should be used?

- A. Anti-ESD strap
- B. Gloves
- C. Electric screwdriver
- D. Protective film

**Answer: A**

**Explanation:** An anti-ESD strap should be used when installing a GPU to prevent electrostatic discharge from damaging sensitive electronic components on the device.

## QUESTION 13

During a 48-hour NeMo question-answering model burn-in test, GPU memory errors occur when processing large datasets. Which configuration strategy prevents Out-of-Memory (OOM) errors while maintaining processing efficiency?

- A. Increase files_per_partition to 1000 for larger batch processing.
- B. Switch from FP16 to FP32 precision for numerical stability.
- C. Disable add_filename for Parquet files to reduce metadata.
- D. Set blocksize="1GB" for data loading and enable RMM asynchronous allocation.

**Answer: D**

**Explanation:** Setting an appropriate data-loading block size helps control how much data is processed in memory at once, while RMM asynchronous allocation improves GPU memory allocation and reuse. Together, these settings reduce fragmentation and prevent OOM errors during large-dataset NeMo burn-in workloads without unnecessarily reducing processing efficiency.

## QUESTION 14

During HPL execution on a DGX cluster, the benchmark fails with "not enough memory" errors despite sufficient physical RAM. Which HPL.dat parameter adjustment is most effective?

- A. Reduce the problem size while maintaining the same block size.
- B. Disable double-buffering via BCAST parameter.
- C. Set PMAP to 1 to enable process mapping.
- D. Increase block size to 6144 to maximize GPU utilization.

**Answer: A**

**Explanation:** The HPL problem size controls the benchmark's total memory footprint. Reducing the problem size lowers memory demand while keeping the block size stable, resolving "not enough memory" failures without unnecessarily changing the computational blocking behavior.

## QUESTION 15

After initial setup and health checks, the DGX H100 system administrator wants to verify that containers can access GPUs before running production workloads. Which method is recommended for this validation?

- A. sudo docker run --gpus all --rm nvcr.io/nvidia/cuda:12.1.1-base-ubuntu22.04 nvidia-smi
- B. sudo docker run --gpus all --rm nvcr.io/nvidia/cuda:12.1.1-base-ubuntu22.04 systemctl
- C. sudo docker run --gpus all --rm nvcr.io/nvidia/cuda:12.1.1-base-ubuntu22.04 ls -la
- D. sudo docker run --rm nvcr.io/nvidia/cuda:12.1.1-base-ubuntu22.04 nvidia-smi

**Answer: A**

**Explanation:** Running a CUDA container with --gpus all and executing nvidia-smi is the standard validation that Docker, the NVIDIA container runtime, drivers, and GPU access are working correctly before production workloads are launched.

## QUESTION 16

A user wants to restrict a Docker container to use only GPUs 0 and 2. Which command achieves this?

- A. docker run -device /dev/nvidia0./dev/nvidia2 nvidia/cuda:12.1-base nvidia-smi
- B. docker run --gpus "device=0,2" nvidia/cuda:12.1-base nvidia-smi
- C. docker run --gpus all nvidia/cuda:12.1-base nvidia-smi -id=0,2
- D. docker run -e NVIDIA_VISIBLE_DEVICES=0.2 nvidia/cuda:12.1-base nvidia-smi

**Answer: B**

**Explanation:** Docker GPU access can be restricted with the --gpus flag by specifying the target GPU device IDs. Using the device filter limits the container so it can see and use only GPUs 0 and 2 rather than all GPUs on the host.

## QUESTION 17

Refer to the output *(exhibit: `nvsm show health` 요약 — GPU check unhealthy, PCI 07:00.0 GPU 누락)*: What insights can a system administrator gain regarding the DGX system's health?

- A. The system has passed the hardware health check successfully.
- B. A GPU driver upgrade has failed.
- C. A GPU is missing on the DGX system.
- D. A GPU tray upgrade failed.

**Answer: C**

**Explanation:** The health output shows the GPU check is unhealthy and reports a missing GPU at PCI address 07:00.0. This indicates the DGX system is not detecting one of the expected GPUs.

## QUESTION 18

A single-node stress test fails during the PCIe bandwidth validation phase. Which troubleshooting step is recommended first?

- A. Reseat the GPU, then rerun the test.
- B. Reduce PCIe Gen4 to Gen3 speed in BIOS settings.
- C. Reinstall NVIDIA drivers using apt-get install nvidia-driver-550
- D. Disable NVLink in BIOS to isolate PCIe performance

**Answer: A**

**Explanation:** A PCIe bandwidth validation failure commonly points to a physical seating, link-training, or connection issue between the GPU and the server PCIe slot. Reseating the GPU and rerunning the test is the recommended first step because it directly addresses the most likely hardware/connection cause before changing BIOS settings or reinstalling software.

## QUESTION 19

A system administrator is installing a DGX OS and needs to preserve existing configurations and data during installation. What option should be chosen?

- A. Backup
- B. Upgrade
- C. Reimage
- D. Export

**Answer: B**

**Explanation:** The Upgrade option preserves existing DGX OS configurations and user data while updating the operating system. Reimage performs a fresh installation and is used when existing data does not need to be preserved.

## QUESTION 20

During HPL execution on a DGX cluster, the benchmark fails with "not enough memory" errors despite sufficient physical RAM. Which HPL.dat parameter adjustment is most effective?

- A. Increase block size to 6144 to maximize GPU utilization.
- B. Reduce the problem size while maintaining the same block size.
- C. Set PMAP to 1 to enable process mapping.
- D. Disable double-buffering via BCAST parameter.

**Answer: B**

**Explanation:** The HPL problem size directly controls the memory footprint of the benchmark. Reducing the problem size lowers the amount of memory required while keeping the block size unchanged, which is the most effective adjustment when HPL reports memory allocation failures despite the system having sufficient physical RAM.

## QUESTION 21

An enterprise builds a Kubernetes-based AI platform using NVIDIA GPU Operator. After adding several new GPU nodes, administrators notice that NVIDIA drivers, container runtime components, and monitoring agents are installed automatically without manual intervention. Which capability of GPU Operator enables this behavior?

- A. Automatic firmware flashing of GPUs
- B. Lifecycle management of GPU software components through Kubernetes
- C. Dynamic migration of virtual machines between GPU nodes
- D. Automatic BIOS configuration for every worker node

**Answer: B**

**Explanation:** GPU Operator simplifies Kubernetes deployments by managing GPU drivers, the NVIDIA Container Toolkit, device plugins, DCGM exporters, and related software as Kubernetes resources. This automates installation, upgrades, and lifecycle management across the cluster. It does not configure BIOS settings or perform virtual machine migration.

## QUESTION 22

What information does the "ibnodes" command display?

- A. All host & server names
- B. All hosts & switches
- C. All server names
- D. All channel adapters

**Answer: B**

**Explanation:** ibnodes displays the InfiniBand fabric nodes discovered by the subnet manager, including host channel adapters and switches. This makes it useful for viewing all hosts and switches visible in the InfiniBand topology.

## QUESTION 23

An administrator is configuring node categories in BCM for a DGX BasePOD cluster. They need to group all NVIDIA DGX H200 nodes under a dedicated category for GPU-accelerated workloads. Which approach aligns with NVIDIA's recommended BCM practices?

- A. Avoid categories and configure each DGX node individually via CLI.
- B. Create a new "dgx-h200" category, assign all DGX H200 nodes to it.
- C. Use the existing "dgxnodes" category without modification, as it is preconfigured for all DGX systems.
- D. Assign nodes to the "login" category to simplify Slurm integration.

**Answer: B**

**Explanation:** In BCM, node categories are used to apply common configuration consistently across groups of similar systems. Creating a dedicated category for DGX H200 nodes and assigning those nodes to it supports repeatable management of GPU-accelerated workload settings across the BasePOD cluster.

## QUESTION 24

A system administrator needs to change the RAID level of DGX station and use the script included in the DGX software with no data on the array. What are the options the administrator can choose?

- A. RAID 0 and RAID 5
- B. RAID 1 and RAID 5
- C. RAID 0 and RAID 1
- D. RAID 10 and RAID 5

**Answer: A**

**Explanation:** The DGX Station RAID configuration script supports configuring the data array as RAID 0 or RAID 5. RAID 0 provides maximum performance and capacity, while RAID 5 provides fault tolerance with usable capacity tradeoff.

## QUESTION 25

An AI training cluster with NVIDIA GPUs experiences prolonged data loading times during checkpoint reloading, causing GPUs to idle frequently. CPU utilization during data transfers remains high. Which solution most effectively optimizes storage-to-GPU throughput while reducing CPU overhead?

- A. Implement GPUDirect Storage to enable direct data transfers.
- B. Migrate datasets to SATA SSDs with RAID 0 for higher sequential read speeds.
- C. Increase batch sizes to reduce the frequency of storage access.
- D. Add more GPUs to the cluster to parallelize data loading tasks.

**Answer: A**

**Explanation:** GPUDirect Storage enables data to move more directly between storage and GPU memory, bypassing much of the CPU-mediated data path. This reduces CPU overhead during checkpoint reloads and improves storage-to-GPU throughput, helping keep GPUs fed instead of idle.

## QUESTION 26

During multi-node HPL burn-in, GPUs show uneven utilization. Which configuration ensures balanced workload distribution?

- A. HPL_RUN_GEMM_TESTS to skip validation
- B. Set --gpu-affinity and --cpu-affinity to align GPU and NUMA nodes
- C. HPL_OOC_TILE_M to 8192 for larger blocks
- D. Enable HPL_USE_NVSHMEM=1 for shared memory acceleration

**Answer: B**

**Explanation:** Setting GPU and CPU affinity aligns each GPU with the appropriate CPU cores and NUMA locality, helping distribute work evenly across the node. This prevents imbalance caused by poor process placement, cross-socket traffic, or mismatched GPU-to-CPU binding during multi-node HPL burn-in.

## QUESTION 27

An engineer must ensure a BlueField-3 NIC firmware download matches the cluster's PSID. Which step is critical before installation?

- A. Check that the DPU's BMC IP is reachable via ping.
- B. Use mstflint -d <PCI_ID> query to validate the firmware's PSID
- C. Confirm the firmware file size matches the DPU's flash capacity.
- D. Verify the SHA256 hash of the firmware matches NVIDIA's public ledger.

**Answer: B**

**Explanation:** Before installing BlueField-3 NIC firmware, the engineer must verify that the firmware image matches the device PSID. Using mstflint -d <PCI_ID> query identifies the device firmware information, including PSID, so the correct NVIDIA firmware package can be selected and installed safely.

## QUESTION 28

A system administrator needs to use DCGM-exporter to export GPU metrics to an external system to create interactive dashboards. What system can the DCGM-exporter use without additional configuration?

- A. DataDog
- B. Prometheus
- C. Nagios
- D. Grafana

**Answer: B**

**Explanation:** DCGM-exporter exposes NVIDIA GPU telemetry in a Prometheus-compatible metrics format by default. Prometheus can scrape these metrics directly, and the collected data can then be visualized in dashboard tools such as Grafana.

## QUESTION 29

A network engineer is tasked with configuring the management, storage, and compute networks for a new DGX BasePOD deployment. Which statement best describes the network segmentation required for optimal operation?

- A. A single VLAN for all types of network traffic.
- B. Two networks: one for management and one for compute.
- C. Four networks: compute, storage, out-of-band, and management.

**Answer: C**

**Explanation:** DGX BasePOD deployments use separate network segments for distinct traffic classes so that management access, out-of-band hardware management, storage traffic, and high-performance compute communication do not interfere with each other. This segmentation improves performance, isolation, troubleshooting, and operational reliability.

## QUESTION 30

As the infrastructure lead for an NVIDIA AI Factory deployment, you have just uploaded the latest supported firmware packages to your DGX system. It is now critical to ensure all hardware components run the new firmware and the DGX returns to full operational capability. Which sequence best guarantees that all relevant components are correctly running updated firmware according to NVIDIA's documentation and recommended operational steps?

- A. Execute a single AC power cycle on the DGX after the update process, then reset the software stack and verify status using diagnostic commands on each node for confirmation of all component updates.
- B. Initiate a cold power cycle on the system to activate firmware for components, reset the BMC using the recommended command, and perform an AC power cycle to ensure EROT and CPLD firmware is activated.
- C. Perform a software-driven restart on the operating system of every compute node, then use advanced tools to check firmware status, and reissue update commands if any firmware appears inactive afterward.
- D. Initiate a cold power cycle on all node trays to activate firmware, follow with a DGX reboot procedure, and use the management interface to finish activating CPLD firmware on the host.

**Answer: B**

**Explanation:** After firmware packages are applied, a cold power cycle is required to activate firmware on affected hardware components. Resetting the BMC ensures the management controller runs the updated firmware, and an AC power cycle is required for components such as EROT and CPLD firmware to fully activate.

## QUESTION 31

You are training a deep neural network using NCCL to coordinate communication across four GPUs in a single node. During early performance testing, you notice inconsistent scaling and longer-than-expected training times, even though all GPUs are being used. Which strategy would most effectively improve NCCL efficiency and collective operation performance in this setting?

- A. Adjust the batch size so that each GPU receives an equalized portion of the batch, ensuring all GPUs process similar workloads and communication is evenly distributed.
- B. Increase the communication frequency between GPUs allowing workloads to be unevenly split, so that synchronization is more frequent and model updates happen faster.
- C. Disable automatic load balancing so that the deep learning framework can dynamically assign samples to any GPU available during each iteration.
- D. Assign the largest possible workload to the first GPU to maximize its utilization, and allow the remaining GPUs to process smaller or variable batch sizes as needed.

**Answer: A**

**Explanation:** NCCL collective performance depends on balanced work across GPUs so that no GPU becomes a straggler during synchronization. Equalizing the batch portion per GPU keeps computation and communication aligned, improving scaling efficiency and reducing delays in collective operations.

## QUESTION 32

A 24-hour HPL burn-in fails with "illegal value" errors during the first iteration. Which initial troubleshooting step resolves this without compromising burn-in validity?

- A. Reduce test duration to 12 hours.
- B. Switch from FP64 to FP32 precision.
- C. Verify the matrix size is divisible by block size.
- D. Disable GPU affinity.

**Answer: C**

**Explanation:** HPL "illegal value" errors at the first iteration commonly indicate an invalid HPL.dat configuration. Verifying that the matrix size is compatible with the block size corrects the parameter issue while preserving the intended burn-in workload duration and precision.

## QUESTION 33

An engineer needs to validate 400G DAC cable signal integrity in a DGX cluster. Which CVT metric best identifies marginal cables needing replacement?

- A. Effective BER > 1.5E-254 during a ≤6-hour monitoring window.
- B. Transceiver model matching QSFP-DD specifications.
- C. Temperature fluctuations > 5°C during validation.
- D. Lane power variance < 3dB across all transceivers.

**Answer: A**

**Explanation:** CVT identifies marginal 400G DAC links by monitoring the effective bit error rate during validation. An effective BER above the accepted threshold indicates poor signal integrity and points to cables that should be replaced to avoid link instability under cluster workloads.

## QUESTION 34

What command is needed to measure BER (Bit Error Rate)?

- A. mlxlink -d <device> -c -e
- B. mlxconfig -d <device> q
- C. msflint -d <device> q full
- D. ethtool -S <device>

**Answer: A**

**Explanation:** mlxlink -d <device> -c -e is used to inspect link status and extended physical-layer counters, including bit error rate information. This makes it the appropriate command for measuring BER on NVIDIA/Mellanox links.

## QUESTION 35

During cluster validation, the Cable Validation Tool (CVT) reports "Underperforming (BER)" for an InfiniBand link. Which BER thresholds indicate a critical signal quality issue requiring cable replacement?

- A. Raw BER > 1e-6 or Effective BER > 1.5E-254 for ≤6hr measurements
- B. Effective BER > 0 during the first 125 minutes of link operation
- C. Temperature > 85 °C on transceiver module
- D. Rx power variance > 3dB between lanes

**Answer: A**

**Explanation:** CVT marks a link as critically underperforming when the raw BER exceeds the acceptable physical-layer threshold or when the effective BER exceeds the defined long-window threshold. These values indicate a signal integrity problem severe enough to require cable inspection and likely replacement.

## QUESTION 36

After a recent OS upgrade, you need to reinstall NVIDIA GPU and DOCA drivers to support both AI training and accelerated networking. What best practice ensures successful installation and full hardware capability?

- A. Use the default drivers provided by the Linux distribution, unless an installation fails during system boot
- B. Download and install only the specific versions of GPU and DOCA drivers listed as compatible with the current OS and hardware
- C. Install the latest available drivers directly from the NVIDIA website
- D. Apply legacy drivers for hardware released within the last two years to maintain maximum compatibility across versions

**Answer: B**

**Explanation:** After an OS upgrade, GPU and DOCA drivers should be installed only from versions validated for the specific operating system, hardware platform, and NVIDIA software stack. This ensures the GPU driver, DOCA components, firmware dependencies, and accelerated networking features work together without compatibility conflicts.

## QUESTION 37

An administrator needs to verify HA functionality after configuring BCM. Which command confirms the active head node and failover readiness?

- A. systemctl restart cmdaemon to force a failover test.
- B. nvsm show health to validate GPU status on both head nodes.
- C. ping <secondary-head-node-ip> to test basic connectivity.
- D. cmsh status to check HA status and active/standby roles.

**Answer: D**

**Explanation:** cmsh status is the appropriate BCM command to verify HA state, including which head node is currently active and whether the standby node is ready for failover. It provides the cluster management service status needed to confirm HA functionality after configuration.

## QUESTION 38

A system administrator is working on a DGX A100 and needs to start a CUDA job. The job fails and a cudaErrorSystemNotReady error is returned. What is the cause of this error?

- A. A GPU fails to register with the fabric.
- B. FM is not completely done initializing.
- C. There are too many running CUDA jobs.
- D. CUDA is not properly installed.

**Answer: B**

**Explanation:** On a DGX A100 with NVSwitch, CUDA workloads depend on Fabric Manager completing NVSwitch/NVLink fabric initialization. If a CUDA job starts before Fabric Manager is fully initialized, the system can return cudaErrorSystemNotReady because the GPU fabric is not ready for CUDA execution.

## QUESTION 39

An enterprise IT team has completed the physical installation of an AI factory with a Spectrum-X Ethernet network connected to all GPU servers. They now need to ensure the environment is ready for scalable AI workload deployment. What is the recommended sequence of validation steps?

- A. Confirm switch and server firmware configuration, test link connectivity and port health, run network benchmarks, validate software stack, then stage AI workload tests.
- B. Perform application benchmarking, use performance logs to identify bottlenecks, update any switch and server firmware, tune the network using suitable performance tests.
- C. Set up Active Directory, LDAP, and configuring role-based access controls, and security configurations as the first task, install users, and validate network or hardware performance.
- D. Validate software stack, test link connectivity and port health, run network benchmarks, run OSPF, ensure neighbors are exchanging route info, then stage AI workload tests.

**Answer: A**

**Explanation:** After physical installation, the environment should be validated from the infrastructure layer upward. Confirming firmware and configuration first ensures supported component baselines, link and port checks verify physical connectivity, network benchmarks validate Spectrum-X fabric performance, software stack validation confirms the runtime environment, and staged AI workload tests confirm readiness for scalable production deployment.

## QUESTION 40

You are validating the environment of an NVIDIA GPU-accelerated data center during post-deployment checks. Which one action is essential to confirm that power and cooling are sufficient for the stable operation of NVIDIA DGX H100 systems?

- A. Use NVSM to disable unused PCIe devices to reduce overall system heat output.
- B. Review the system BIOS to ensure GPU overclocking is enabled for maximum performance.
- C. Verify that each DGX system is connected to redundant, properly rated PDUs and that all power supplies are reporting nominal input.
- D. Confirm the system fans are running at 100% under all workloads to prevent overheating.

**Answer: C**

**Explanation:** Stable DGX H100 operation requires properly rated, redundant power delivery and healthy power-supply input status. Verifying PDU capacity, redundancy, and nominal PSU input confirms that the system has the electrical foundation needed to support sustained GPU workloads without power-related instability.

## QUESTION 41

For an NVIDIA Enterprise AI Factory with 256 GPUs, which storage solution characteristic is most critical to validate during scaling tests?

- A. RAID rebuild times under disk failure.
- B. Consistent per-node throughput ≥8 GiB/s.
- C. Single-node write performance during idle clusters.
- D. Maximum 4K random read IOPS exceeding 1 million.

**Answer: B**

**Explanation:** At 256 GPUs, the key storage scaling concern is whether every compute node can sustain the required throughput concurrently. Consistent per-node throughput of at least 8 GiB/s validates that the storage system can keep GPUs fed with training data at scale without becoming a bottleneck.

## QUESTION 42

What command sequence is used to identify the exact name of the server that runs as the master SM in a multi-node fabric?

- A. ibstat, then sminfo
- B. sminfo, then smpquery ND
- C. ibis, then ibsim
- D. sminfo, then smpquery NI

**Answer: B**

**Explanation:** sminfo identifies the active master subnet manager and provides its LID. Using smpquery ND against that LID retrieves the node description, which includes the exact server name running the master SM.

## QUESTION 43

A DGX server reports degraded performance and storage alerts. How would you use NVSM (NVIDIA System Management) and nvidia-smi to troubleshoot both system and GPU issues?

- A. Run nvsm collect-stats to gather logs, use lsblk to understand if there are storage problems, and nvidia-smi -q to get detailed GPU information.
- B. Use nvsm show health for a system health summary, nvsm show storage for storage issues, and nvidia-smi -q to get detailed GPU information.
- C. Start by issuing nvidia-smi -L to list GPUs, followed by nvsm --refresh to clear all alerts, and nvidia-smi -q to get detailed GPU information.
- D. Run nvsm reset to restore system health, then use nvidia-smi --fix for automatic GPU repairs and status recovery.

**Answer: B**

**Explanation:** nvsm show health provides the overall DGX system health summary, while nvsm show storage focuses on storage-related alerts and status. nvidia-smi -q provides detailed GPU diagnostics such as temperature, power, clocks, ECC, utilization, and error information, making this the best combined approach for troubleshooting both storage/system and GPU performance issues.

## QUESTION 44

When updating the firmware on an NVLink switch transceiver, how can an engineer apply new firmware without interrupting the network?

- A. flint -d -lid 27 -linkx -link_auto_update -activate
- B. Physically disconnect and reconnect the transceiver.
- C. mlxfwreset -d lid 27 reset --yes to reset the transceiver.
- D. nv action reboot system to force immediate activation.

**Answer: A**

**Explanation:** flint with the LinkX auto-update and activate options is used to update and activate NVLink switch transceiver firmware in a non-disruptive way when supported. This applies the firmware without requiring a physical reseat or disruptive device/system reset.

## QUESTION 45

A system administrator needs to install the NVIDIA Container Toolkit and perform the following actions: update apt; issue the install command; configure the Docker daemon to recognize the NVIDIA Container Runtime; restart the Docker daemon to complete the installation. What step should be taken first?

- A. Add NVIDIA Repository
- B. Initialize NVIDIA Omniverse configuration
- C. Stop toolkit process
- D. Install SNAP package manager

**Answer: A**

**Explanation:** Before running apt update and installing the NVIDIA Container Toolkit package, the NVIDIA package repository must be added so the package manager can locate and install the correct toolkit packages.

## QUESTION 46

You are preparing a Spectrum-based NVIDIA switch for integration into a production AI cluster. To confirm that all modules are running approved firmware versions, you must use the appropriate command from the switch CLI. Which step most accurately meets best practices for ensuring firmware version consistency and cluster compliance?

- A. Use the show asic-version command to review firmware versions for all modules, then compare these against the documented approved versions.
- B. Use the show inventory command to display component details and serial numbers before proceeding, as this output will include all firmware versions for review.
- C. Use the show version command to check the overall system version and confirm all modules are updated if the system version matches the documentation.
- D. Use the show interfaces status command to verify all ports are up, and proceed with integration if no interface errors are shown.

**Answer: A**

**Explanation:** show asic-version is used on NVIDIA Spectrum switches to review firmware versions for switch modules and ASIC-related components. Comparing that output against the approved firmware matrix confirms version consistency and helps ensure the switch is compliant before production integration.

## QUESTION 47

Why is it important to provide a large and high-performance local cache (using SSDs configured as RAID-0) for deep learning workloads on DGX systems?

- A. Using local SSD cache in RAID-0 enables direct GPU access to files without host CPU involvement, further boosting performance.
- B. Local SSD cache allows users to increase the number of NFS threads on the server without impacting storage reliability.
- C. A local SSD cache in RAID-0 ensures that most training data is read only once from the network, significantly reducing NFS traffic.
- D. Local SSD cache in RAID-0 is necessary to provide redundancy in case one of the drives fails during long training runs.

**Answer: C**

**Explanation:** A large high-performance local SSD cache lets DGX systems stage training datasets locally so repeated epochs can read data from fast local storage instead of repeatedly pulling the same data over NFS. RAID-0 improves cache throughput and capacity, reducing network storage traffic and helping keep GPUs fed with data during training.

## QUESTION 48

On a DGX, a system administrator needs to monitor PSU, CPU Utilization, GPU Utilization, RAID, and Memory Utilization. What single NVIDIA tool should be used?

- A. DCGM
- B. MOFED
- C. NVSM
- D. SMI

**Answer: C**

**Explanation:** NVSM is the NVIDIA System Management tool for DGX systems and provides system-level monitoring across components such as power supplies, CPU utilization, GPU utilization, RAID/storage status, and memory utilization from a single management interface.

## QUESTION 49

After updating to a Docker version post 19.03, a data scientist attempts to run a container designed for GPU-accelerated applications *(exhibit: `docker run` 명령 + "could not select device driver ... with capabilities: [[gpu]]" 오류)*. What will fix the problem?

- A. The DOCA driver needs to be installed
- B. Add the argument "--gpus all" to the docker command
- C. Use an NGC TensorFlow container
- D. The NVIDIA driver should be re-installed

**Answer: B**

**Explanation:** Docker 19.03 and later uses the native --gpus flag to expose NVIDIA GPUs to containers through the NVIDIA Container Toolkit. Adding --gpus all allows the container to access all available GPUs and resolves the issue where the NVIDIA driver is not detected inside the container.

## QUESTION 50

A system administrator lost SSH connectivity to a cluster management node. It has been identified that a network is broken. Which network is it?

- A. in-band management
- B. Storage
- C. Compute
- D. Out-of-band management

**Answer: A**

**Explanation:** SSH access to a cluster management node normally uses the in-band management network. Losing SSH connectivity because of a broken network indicates a failure in the management path used for administrative login and cluster management access.

## QUESTION 51

While trying to bring-up the fabric, the administrator identifies one nonoperational InfiniBand server *(exhibit: `ibstat` 출력 — State: Active, Physical state: LinkUp, Link layer: Ethernet)*. What is the cause based on the output?

- A. The HCA port is not part of the InfiniBand fabric.
- B. The HCA port is not assigned a LID number.
- C. The HCA port is faulty.
- D. OpenSM is not running on the fabric.

**Answer: A**

**Explanation:** The port is physically up and active, but the link layer is shown as Ethernet rather than InfiniBand. This means the adapter port is operating in Ethernet mode, so it is not participating in the InfiniBand fabric.

## QUESTION 52

A cluster administrator notices that distributed training jobs scale efficiently from one to four GPUs but experience a sharp reduction in scaling efficiency when expanded to 64 GPUs across multiple servers. Hardware diagnostics show no failed components and network bandwidth remains underutilized. Which software library should the administrator examine first?

- A. NCCL
- B. cuDNN
- C. TensorRT
- D. CUDA Compiler

**Answer: A**

**Explanation:** NCCL (NVIDIA Collective Communications Library) manages collective communication operations such as AllReduce, Broadcast, and ReduceScatter across multiple GPUs. Inefficient NCCL configuration, topology detection, or transport selection can significantly impact distributed training scalability even when hardware appears healthy. The other libraries focus on inference, neural network primitives, or compilation.

## QUESTION 53

Which statement best explains why maintaining high cable signal quality is essential in modern high-speed data centers?

- A. High cable signal quality reduces electromagnetic interference (EMI) and cross-talk, helping prevent unexpected packet drops during sustained workloads.
- B. High cable signal quality minimizes bit error rates and supports reliable, high-throughput communication, reducing retransmissions and congestion across the network.
- C. High cable signal quality enables effective use of forward error correction (FEC), which is required for reliable operation at high data rates such as 200GbE and above.
- D. High cable signal quality ensures that cable length and connector type do not play as big a role in deploying new infrastructure in the data center.

**Answer: B**

**Explanation:** High cable signal quality keeps bit error rates low, which is critical for reliable high-speed Ethernet or InfiniBand communication. Low BER reduces retransmissions, congestion, latency spikes, and workload stalls, helping maintain stable high-throughput performance during sustained AI cluster traffic.

## QUESTION 54

After NCCL burn-in reports "transport retry count exceeded", which corrective action addresses the underlying fabric issue?

- A. Switch from Ring to Tree algorithms via NCCL_ALGO=TREE
- B. Inspect InfiniBand link quality metrics (BER, symbol errors) and replace faulty cables
- C. Increase NCCL_IB_TIMEOUT to tolerate longer latencies
- D. Reduce message size to decrease network utilization

**Answer: B**

**Explanation:** A "transport retry count exceeded" error during NCCL burn-in usually points to an unreliable InfiniBand fabric path, such as bad cables, poor signal quality, symbol errors, or excessive bit errors. Checking link-quality counters and replacing faulty cables addresses the underlying physical fabric problem rather than masking it.

## QUESTION 55

A researcher wants to allow a container to use only two specific GPUs out of four available ones (GPU 1 and GPU 2) on the host. The system is already set up for NVIDIA Docker with the container toolkit. Which Docker command will correctly assign only these GPUs to the container?

- A. docker run --gpus '"device=0,3"' nvidia/cuda nvidia-smi --query-gpu=uuid --format=csv
- B. docker run --rm --gpus '"device=1,2"' nvidia/cuda nvidia-smi
- C. docker run --gpus '"device=0,1"' nvidia/cuda nvidia-smi --query-gpu=uuid --format=csv
- D. docker run --rm --gpus 2 nvidia/cuda nvidia-smi

**Answer: B**

**Explanation:** The Docker --gpus option can restrict a container to specific GPU IDs. Specifying device=1,2 exposes only GPU 1 and GPU 2 to the container, and running nvidia-smi inside the CUDA container verifies that only those GPUs are visible.

## QUESTION 56

An engineer needs to validate NVLink Switch functionality on a DGX H100 system with 8 GPUs. Which NCCL command verifies intra-node NVLink bandwidth?

- A. all_reduce_perf -b 8 -e 16G -f2 -g 4 with NCCL_TESTS_SPLIT="MOD 2"
- B. all_reduce_perf -b 8 -e 16G -f2 -g 8 with NCCL_TESTS_SPLIT="OR 0x7"
- C. broadcast_perf -b 8 -e 16G -f2 -g 8 without split configuration
- D. all_reduce_perf -b 8 -e 16G -f2 -g 1 repeated 8 times

**Answer: B**

**Explanation:** Running all_reduce_perf across all 8 GPUs validates intra-node collective bandwidth across the full DGX H100 NVLink Switch domain. The split setting stresses NVLink paths within the node, making it suitable for verifying NVLink Switch functionality and bandwidth across the 8-GPU topology.

## QUESTION 57

During a scale-out expansion, the AI Factory team needs to ensure minimal communication latency between GPUs across multiple nodes. Which NVIDIA technology should be prioritized in the network design to achieve this?

- A. InfiniBand with Fat-Tree topology between nodes.
- B. Standard Ethernet switches with no GPU interconnect.
- C. Token ring network for all node communication.
- D. Spectrum-X with Dragonfly topology between nodes.

**Answer: A**

**Explanation:** InfiniBand with a Fat-Tree topology is designed for low-latency, high-bandwidth scale-out GPU communication across multiple nodes. It supports efficient East-West traffic and helps minimize communication delays for distributed AI training workloads.

## QUESTION 58

A cluster administrator is preparing to update the firmware on a DGX H100 system, including the GPU tray (baseboard). What is the correct sequence of steps to perform a safe and successful firmware upgrade?

- A. Stop all GPU activity, update and reboot the BMC, update motherboard and tray components, perform a cold reset, and verify completion.
- B. Update the BMC and skip the GPU tray and motherboard tray updates if the system appears healthy.
- C. Update the GPU tray first, then the motherboard tray, and reboot the BMC after all updates are complete.
- D. Perform a cold reset, stop all GPU activity, update and reboot the BMC, update motherboard and tray components, and verify completion.

**Answer: A**

**Explanation:** A safe DGX H100 firmware upgrade starts by stopping GPU activity to avoid workload disruption, then updating and rebooting the BMC so the management controller is current. After that, motherboard and tray components such as the GPU tray/baseboard are updated, followed by a cold reset to activate firmware fully and final verification to confirm completion.

## QUESTION 59

A customer is designing an AI Factory for enterprise-scale deployments and wants to ensure redundancy and load balancing for the management and storage networks. Which feature should be implemented on the Ethernet switches?

- A. Use only one switch for all management and storage traffic.
- B. MLAG for bonded interfaces across redundant switches.
- C. Implement redundant switches with spanning tree protocol.
- D. Disable VLANs and use unmanaged switches.

**Answer: B**

**Explanation:** MLAG allows bonded interfaces to connect across redundant Ethernet switches while presenting them as a single logical link. This provides both redundancy and load balancing for management and storage networks, improving availability without creating single-switch dependency.

## QUESTION 60

After configuring NGC CLI with ngc config set, a user receives "Authentication failed" errors when pulling containers. What step was most likely omitted?

- A. Installing the CLI with apt-get instead of manual extraction.
- B. Entering the API key during ngc config set or storing it in ~/.ngc/config.
- C. Running sudo systemctl restart docker after configuration.
- D. Setting --format_type=json to enable API interactions.

**Answer: B**

**Explanation:** NGC authentication requires a valid API key to be provided during ngc config set or stored in the user's ~/.ngc/config file. Without the API key, container pulls from NGC fail because the CLI cannot authenticate to the registry.

## QUESTION 61

A network architect deploys a Spectrum Ethernet fabric for a RoCE-based AI cluster. During stress testing, distributed training performance fluctuates significantly because packet loss occurs whenever multiple training jobs execute simultaneously. Which network feature should be prioritized to improve communication consistency?

- A. Lossless Ethernet configuration with congestion management
- B. Disabling RDMA on every interface
- C. Increasing GPU memory allocation
- D. Replacing all Top-of-Rack switches with PCIe switches

**Answer: A**

**Explanation:** RoCE performs best on a properly configured lossless Ethernet network using technologies such as Priority Flow Control (PFC), Explicit Congestion Notification (ECN), and appropriate congestion management. Packet loss causes RDMA retransmissions and reduced performance. GPU memory size and PCIe switches do not resolve network congestion issues.

## QUESTION 62

After running a 24-hour stress test on a DGX node, the administrator should verify which two key metrics to ensure system stability?

- A. Total energy consumption and NVLink bandwidth.
- B. SSD write endurance and RAM capacity.
- C. Average CPU usage ≥80% and Docker container uptime.
- D. No thermal throttling events and consistent GPU utilization ≥95% throughout the test.

**Answer: D**

**Explanation:** After a long DGX stress test, stability is confirmed by ensuring the GPUs sustained high utilization without thermal throttling. Consistent GPU utilization shows the workload ran properly under load, and the absence of throttling confirms that power and cooling remained adequate throughout the test.

## QUESTION 63

A user needs to configure NGC CLI to access resources across multiple organizations. What is the recommended command syntax to achieve this?

- A. ngc config set --org org-name --ace ace-name
- B. export NGC_CLI_ORG=org-name && ngc config set
- C. ngc config list to manually edit the JSON configuration file.
- D. ngc registry login --org org-name

**Answer: A**

**Explanation:** ngc config set --org org-name --ace ace-name configures the NGC CLI context for a specific organization and ACE, allowing the user to access resources associated with multiple organizational contexts.

## QUESTION 64

An administrator needs to add additional GPUs to an existing server. What are the server requirements to check before installing new GPUs?

- A. Sufficient storage, sufficient networking, adequate power of rack, and compatible hardware.
- B. Sufficient networking, water-cooled racks, adequate power of rack, sufficient storage, and rack space.
- C. Sufficient cooling in the data center, adequate power of rack, compatible hardware, and PCI slot allocation.
- D. Sufficient CPU capacity, PCI slot allocation, sufficient cooling in the data center, and rack space.

**Answer: C**

**Explanation:** Before adding GPUs, the administrator must confirm that the server platform supports the new GPUs, has available PCIe slots and lanes, has enough rack/data center power, and has sufficient cooling capacity. These checks ensure the GPUs can be installed safely and operate reliably under load.

## QUESTION 65

An enterprise decides to build a high-performance Ethernet-based AI cluster instead of using InfiniBand. To achieve RDMA functionality with minimal CPU overhead, which technology should the network architect implement?

- A. VXLAN
- B. RoCE
- C. MPLS
- D. GRE

**Answer: B**

**Explanation:** RoCE (RDMA over Converged Ethernet) enables Remote Direct Memory Access over Ethernet networks, providing low latency and reduced CPU utilization similar to InfiniBand. Proper lossless Ethernet configuration is typically required for optimal performance. VXLAN, MPLS, and GRE provide network virtualization or tunneling rather than RDMA capabilities.

## QUESTION 66

During East-West fabric validation on a 64-GPU cluster, an engineer runs all_reduce_perf and observes an algorithm bandwidth of 350 GB/s and bus bandwidth of 656 GB/s. What does this indicate about the fabric performance?

- A. Critical failure; bus bandwidth exceeds hardware capabilities
- B. Suboptimal performance; algorithm bandwidth should match bus bandwidth
- C. Inconclusive; rerun with point-to-point tests
- D. Optimal performance; bus bandwidth near theoretical peak for NDR InfiniBand

**Answer: D**

**Explanation:** An all_reduce_perf result showing around 350 GB/s algorithm bandwidth and 656 GB/s bus bandwidth indicates strong collective communication performance for a 64-GPU NDR InfiniBand fabric. The bus bandwidth being near the expected peak confirms the East-West fabric is performing optimally and GPUDirect RDMA paths are healthy.

## QUESTION 67

Refer to the exhibit *(NVIDIA LinkX 케이블 제품군 표)*. What is the maximum bandwidth supported by Direct Attach Copper (DAC) LinkX cables?

- A. 100 Gbps
- B. 200 Gbps
- C. 50 Gbps
- D. 400 Gbps

**Answer: D**

**Explanation:** NVIDIA LinkX Direct Attach Copper cables support high-speed Ethernet and InfiniBand connectivity up to 400 Gbps, making them suitable for dense GPU cluster interconnects and short-reach data center links.

## QUESTION 68

During server maintenance, a system administrator wants to ensure that the NVIDIA DGX server has sufficient disk space for operational activities. The administrator is scripting an alert system that will notify the team if the disk space falls below a threshold. Which command could be included in the maintenance script to check the available disk space on the server?

- A. du -sh /home/*
- B. df -h | grep '/var'
- C. nvidia-smi --query-disk-space
- D. lsof +L1

**Answer: B**

**Explanation:** df -h reports filesystem disk usage in human-readable format, and filtering for /var checks available space on a key operational filesystem commonly used for logs, packages, and system activity. This is suitable for a maintenance script that alerts when disk space drops below a defined threshold.

## QUESTION 69

You are performing storage validation for an H100-based cluster. Your goal is to ensure the storage system is optimized for AI workloads. What should you focus on?

- A. Verify the total storage capacity and confirm it matches the system specifications without running performance benchmarks.
- B. Check that the storage system is configured with RAID levels optimized for redundancy, even if it sacrifices performance.
- C. Test storage performance by transferring randomized files between nodes while monitoring metrics like transfer speed and error rates.
- D. Validate high throughput and low latency by running application-specific benchmarks designed for AI workloads.

**Answer: D**

**Explanation:** AI storage validation should confirm that the storage system can sustain the throughput and latency required by real training and data-loading workloads. Application-specific benchmarks best reflect production AI access patterns and reveal whether storage performance is sufficient for H100-based cluster workloads.

## QUESTION 70

An InfiniBand administrator needs to run performance benchmarks on new devices added to the fabric. What tool should be used to check the latency?

- A. tcpdump
- B. ib_write_lat
- C. perfmon
- D. ibdiagnet

**Answer: B**

**Explanation:** ib_write_lat is an InfiniBand performance benchmarking utility used to measure RDMA write latency between devices. It is appropriate for validating latency performance on newly added InfiniBand fabric devices.

## QUESTION 71

An enterprise is deploying an AI Factory using NVIDIA DGX BasePOD architecture. The infrastructure team must ensure high availability and efficient data transfer between compute nodes. Which network topology should they implement for the InfiniBand fabric?

- A. Single flat Ethernet network for all traffic.
- B. Fat-Tree topology with rail-optimized design.
- C. Star topology with all nodes connected to a single central switch.
- D. Simple ring topology connecting all nodes in a loop.

**Answer: B**

**Explanation:** DGX BasePOD InfiniBand fabrics use a Fat-Tree topology with rail-optimized design to provide high availability, low latency, and high-bandwidth East-West communication between compute nodes. This supports efficient distributed AI training by minimizing oversubscription and maintaining predictable GPU-to-GPU communication performance.

## QUESTION 72

You are deploying NVIDIA DGX H100 systems in a data center. Each rack is configured to support up to 10.2 kW of power consumption per unit. What is the most critical step to validate the power requirements?

- A. Confirm that the power supply units (PSUs) in each DGX H100 system are rated for 80 PLUS Gold efficiency or higher.
- B. Verify the input voltage range (200-240V AC) for compatibility with the data center's power infrastructure.
- C. Ensure that each rack has at least one power circuit capable of delivering 10.2 kW of power.
- D. Validate that the power distribution system supports N+1 redundancy with sufficient capacity for peak loads

**Answer: D**

**Explanation:** DGX H100 power validation must confirm that the rack power distribution can support peak system loads while maintaining redundancy. N+1 capacity ensures the rack can continue operating safely and reliably even if one power path or component fails.

## QUESTION 73

An infrastructure architect is selecting a network technology for a dedicated AI training cluster requiring extremely low latency, adaptive routing, congestion control, and efficient collective communications across thousands of GPUs. Which networking solution is generally the preferred choice for this environment?

- A. Standard Layer 2 Ethernet without RDMA
- B. InfiniBand
- C. Fibre Channel SAN
- D. Wi-Fi 7

**Answer: B**

**Explanation:** InfiniBand is specifically designed for high-performance computing and AI clusters. It provides RDMA, adaptive routing, congestion management, hardware offloads, and very low latency, making it well suited for large-scale distributed AI training. Standard Ethernet lacks these capabilities unless enhanced with RoCE, while Fibre Channel and Wi-Fi are unsuitable for distributed GPU communication.

## QUESTION 74

You are tasked with validating the cooling system for a high-density AI cluster using NVIDIA Blackwell GPUs, which generate up to 120 kW of power per rack. What should you prioritize during validation?

- A. Validate that the cooling system can maintain a supply air temperature below 20°C at all times to ensure GPU stability.
- B. Confirm that the cooling system uses liquid-to-air heat exchangers to manage heat dissipation efficiently.
- C. Ensure that dynamic fan speed control is enabled to optimize airflow based on real-time thermal conditions.
- D. Verify that each rack has sufficient airflow to handle 50% of its maximum heat load, as full load scenarios are rare.

**Answer: B**

**Explanation:** Blackwell rack-scale systems can generate extremely high heat loads, so cooling validation must confirm that the facility cooling architecture can efficiently remove that heat at full rack density. Liquid-to-air heat exchangers are designed to support high-density AI racks by transferring heat from liquid cooling loops into the facility air-cooling environment.

## QUESTION 75

A system administrator needs to enable MIG so that the end user can run multiple jobs on an NVIDIA A100 GPU. What command should be used?

- A. nvidia-smi -a100 -enablemig
- B. nvidia smi -i 0 --enablemig
- C. nvidia-smi -i 0 -mig 1
- D. nvidia -smi -i -mig 1 enable

**Answer: C**

**Explanation:** nvidia-smi -i 0 -mig 1 enables MIG mode on GPU index 0. Once MIG mode is enabled, the A100 can be partitioned into multiple GPU instances so separate jobs can run with isolated GPU resources.

## QUESTION 76

The system administrator needs to set up authentication credentials for NGC CLI. After installing NGC CLI on a computer, what command should be used?

- A. ngc credentials
- B. ngc config set
- C. ngc login
- D. ngc authenticate

**Answer: B**

**Explanation:** ngc config set is used after installing the NGC CLI to configure authentication credentials, including the API key and related account settings required to access NGC resources.

## QUESTION 77

You are an infrastructure engineer tasked with validating a new AI training cluster before releasing it to users. Your team wants to perform a NeMo burn-in to ensure both hardware and software are reliable and ready for production workloads. Which of the following actions are required as part of a proper NeMo burn-in process? (Choose two.)

- A. Run the configured NeMo training job repeatedly or for an extended duration, monitoring for errors, stalls, or performance drops across all GPUs and nodes.
- B. Configure a representative NeMo training or pretraining recipe and set up an executor to launch the job across intended nodes and GPUs.
- C. Test inference using the NeMo API and approve the environment if the model outputs valid predictions.
- D. Download a pre-trained NeMo model and use it for a quick accuracy check on a user dataset, then consider the burn-in complete if results are reasonable.

**Answer: AB**

**Explanation:** A proper NeMo burn-in uses a representative NeMo training or pretraining workload configured to run across the target GPUs and nodes. Running that workload for an extended duration while monitoring errors, stalls, GPU behavior, and performance stability validates that the hardware, drivers, containers, networking, and software stack are production-ready.

## QUESTION 78

What is the purpose of using NCCL in verifying east/west fabric in an NVIDIA AI Factory? (Choose two.)

- A. To measure bandwidth between GPUs.
- B. To measure the latency between GPUs.
- C. To measure the power consumption of GPUs.
- D. To measure the storage network performance.

**Answer: AB**

**Explanation:** NCCL is used to validate GPU-to-GPU communication across the east/west fabric by testing collective communication performance. Measuring bandwidth and latency between GPUs confirms that the compute fabric is performing correctly for distributed AI workloads.

## QUESTION 79

An infrastructure engineer runs a NCCL burn-in on an eight-node GPU cluster. Over a 12-hour period, all GPUs are tested with repeated all-reduce collectives. Monitoring tools show the following observations:

- Aggregate bandwidth remains within 5% of documented reference for the hardware on every run.
- No errors or timeouts are reported in NCCL logs.
- On three occasions, one GPU logged single-run bandwidth dips of 15-20% compared to its norm, but performance recovered on the next run and stayed stable afterward. System logs show no hardware or drive errors.
- Two minor NCCL WARN-level messages about "unexpected latency spike" appear in system logs for separate nodes, but could not be reproduced.

Which conclusion is the best strategy before releasing the cluster to production?

- A. Approve for AI workload use, but flag affected nodes for manual exclusion from distributed training jobs, as nodes showing any anomaly should be isolated whenever possible.
- B. Proceed, since all bandwidth targets are met, issues were transient and self-resolved, and there are no persistent errors or timeouts across repeated burn-ins.
- C. Recommend proactive maintenance, because any bandwidth drop—even if transient and unreproducible—shows the burn-in failed; clusters must not show performance variance above 10% for any GPU even once.

**Answer: B**

**Explanation:** The cluster meets the documented bandwidth target consistently, NCCL reports no persistent errors or timeouts, and the observed bandwidth dips and WARN messages were transient and unreproducible. With stable repeated burn-in results and no supporting hardware or system-log faults, the cluster can proceed to production while continuing normal monitoring.

## QUESTION 80

Which function is used to collect the cluster counters information?

- A. 0.041666667
- B. GM
- C. 0.5
- D. SM

**Answer: B**

**Explanation:** GM is the function used to collect cluster counters information, aggregating fabric-level counter data for cluster monitoring and analysis.

> *원문 덤프가 손상된 문항이다. 보기 A/C가 엑셀 날짜·숫자로 깨져 있다.*

## QUESTION 81

You are standing up a NVIDIA DGX system for enterprise production. Stakeholder teams require system reliability, performance consistency under load, and proper escalation processes before release. A recent system in another cluster experienced intermittent GPU failures attributed to missed early-stage validation. Which deployment and validation sequence best addresses production readiness and mitigates the risk of avoidable downtime or performance loss?

- A. Complete hardware and cabling, power on the system, update firmware and drivers, run full hardware health checks and stress diagnostics (using NVSM), verify all GPU and system sensor logs, and validate GPU accessibility.
- B. Power on the system, install all AI frameworks, configure the CUDA and library stack, set up user environments, then plan stress tests and diagnostics as part of ongoing routine operations.
- C. Update network topology, assign static IPs and DNS entries, register the system with NVIDIA, then conduct basic OS-level checks and enable user access after log-in testing is successful.
- D. Install latest OS images and drivers, confirm OS and container functionality, invite users for a monitored production trial, and collect workload feedback to plan any further diagnostics or updates.

**Answer: A**

**Explanation:** Production readiness for a DGX system requires completing physical installation first, then updating firmware and drivers, followed by full health checks and stress diagnostics with NVSM. Verifying GPU status, sensor logs, and container/GPU accessibility helps catch early hardware, thermal, power, or driver issues before users rely on the system for production workloads.

## QUESTION 82

An engineer is tasked with configuring Out-of-Band (OOB) management for a DGX BasePOD deployment. Which network design will best ensure secure and reliable OOB management operations?

- A. Place all BMC and management interfaces on an isolated OOB network with access restricted by firewall rules.
- B. Use a single VLAN for both OOB management and compute fabric to simplify network design.
- C. Configure OOB management interfaces to be accessible from any subnet within the data center for maximum flexibility.
- D. Connect OOB management ports to the same switch as user traffic for easier troubleshooting.

**Answer: A**

**Explanation:** OOB management should be isolated from production and compute traffic because BMC interfaces provide privileged hardware-level access. Placing BMC and management interfaces on a dedicated OOB network with firewall-restricted access improves security, reliability, and operational control for DGX BasePOD management.

## QUESTION 83

For a 48-hour NCCL burn-in test, which parameters ensure sustained fabric stress while detecting silent data corruption?

- A. all_reduce_perf -b 8G -e 32G -z 1 -G 1000
- B. broadcast_perf -b 4G -e 16G -w 100
- C. all_reduce_perf -b 8G -e 32G -c 1000 -z 1 -G 1000
- D. reduce_scatter_perf -f 2 -g 8

**Answer: C**

**Explanation:** all_reduce_perf with large message sizes sustains heavy fabric stress, while the validation/checking option helps detect silent data corruption during the burn-in. The long iteration count and GPU Direct usage keep the NCCL workload active long enough to expose intermittent fabric or data-integrity issues.

## QUESTION 84

During the setup of a new GPU cluster, you want to validate the GPUs to ensure they meet performance and reliability standards. What would demonstrate performance standards are met?

- A. Use DCGM diagnostics and gpu-burn to stress test GPUs under load.
- B. Test a small reference task, such as training a simple model, to confirm general functionality.
- C. Validate NVLink bandwidth between GPUs by running data transfer tests across all connected nodes.
- D. Verify that the GPU type and count match expected specifications.

**Answer: A**

**Explanation:** DCGM diagnostics and gpu-burn validate GPU reliability and performance under sustained load. These tools stress the GPUs, monitor health and error conditions, and help confirm that the devices can operate within expected performance and stability standards before production use.

## QUESTION 85

You are validating the networking infrastructure of a distributed GPU cluster used for AI training with InfiniBand networking fabric installed across nodes. How should you validate node connectivity?

- A. Test network performance by transferring files between nodes over Ethernet while monitoring transfer speeds.
- B. Verify IP address assignments across all nodes in the cluster to ensure proper communication paths are established.
- C. Use tools like ib_read_bw and ib_write_bw to test InfiniBand latency and throughput between nodes.
- D. Confirm that all network switches power on without errors during initialization.

**Answer: C**

**Explanation:** InfiniBand node connectivity should be validated with InfiniBand performance tools such as ib_read_bw and ib_write_bw, which test RDMA communication between nodes and confirm that the fabric can deliver the expected bandwidth and low-latency throughput required for distributed GPU training.

## QUESTION 86

To verify correct installation of a DGX system, which command should a system administrator use to collect system configuration and diagnostic information?

- A. nvsm get health
- B. lspci | grep DPU
- C. nvsm stress-test
- D. nvsm show health

**Answer: D**

**Explanation:** nvsm show health is used to verify DGX system health after installation by checking the system's configuration and diagnostic status. It provides a quick confirmation that key hardware components are detected and operating correctly.

## QUESTION 87

After updating BlueField-3 DPU BMC firmware via Redfish, the engineer observes "TaskState: Running" but no progress after 15 minutes. How should they track the update's completion status?

- A. Power cycle the DPU immediately to force a rollback.
- B. Query the DPU BMC with the Task ID of the installation process.
- C. Check /var/log/messages on the DPU OS for update logs.
- D. Run bfrec -status on the DPU to view flash progress.

**Answer: B**

**Explanation:** Redfish firmware updates create an asynchronous task that must be monitored through the task service using the returned Task ID. Querying that Task ID on the DPU BMC shows whether the installation is still running, completed successfully, or failed, without interrupting the update process.

## QUESTION 88

After installing NGC CLI on RHEL, a user runs ngc registry image list but sees no results. The API key and org are correctly configured. What resolves this?

- A. Reinstall the CLI using the yum command instead of manual installation.
- B. Run ngc config set --team team-name to specify a team.
- C. Ensure the user's NGC account has 'REGISTRY_READ' permissions for the org.
- D. Disable SELinux to eliminate unnecessary security restrictions.

**Answer: C**

**Explanation:** If the API key and organization are configured correctly but registry image listings return no results, the account likely lacks the required registry access within that organization. Granting REGISTRY_READ permission allows the NGC CLI to view and list registry images.

## QUESTION 89

When configuring an out-of-core (OOC) HPL burn-in for a 40B matrix on 8x H100 nodes, which environment variable prevents GPU out-of-memory errors while reserving space for drivers?

- A. export HPL_OOC_NUM_STREAMS=8
- B. export HPL_OOC_MODE=0
- C. export HPL_OOC_MAX_GPU_MEM=90
- D. export HPL_OOC_SAFE_SIZE=4.0

**Answer: D**

**Explanation:** HPL_OOC_SAFE_SIZE reserves a safety margin of GPU memory for drivers, runtime overhead, and other allocations during out-of-core HPL execution. Setting it prevents the OOC run from consuming all available GPU memory and helps avoid out-of-memory failures during large matrix burn-in tests.

## QUESTION 90

Which of the following steps are essential components of a recommended DGX cluster installation procedure? (Choose two.)

- A. Configure networking by validating all interfaces on each node - ensuring proper InfiniBand/Ethernet connectivity - prior to installing cluster software.
- B. Complete application containerization, run distributed jobs, validate node health or storage availability.
- C. Group nodes by function during initial setup and assign them to relevant categories in the cluster management tool.
- D. Install Slurm on the head node and then configure the compute nodes' default OS images.

**Answer: AC**

**Explanation:** A recommended DGX cluster installation requires validating network interfaces and fabric connectivity before deploying cluster software so node provisioning and workload communication are reliable. Grouping nodes by function and assigning them to the proper cluster management categories ensures consistent configuration, management, and role-based deployment across the cluster.

## QUESTION 91

An organization deploys a Kubernetes AI platform using GPU Operator. Several GPU nodes appear in the cluster, but containers requesting GPU resources remain in a Pending state. The administrator verifies that NVIDIA drivers are correctly installed. Which missing component is the most likely cause?

- A. NVIDIA Device Plugin
- B. DCGM Exporter
- C. Node Feature Discovery labels
- D. CUDA Toolkit inside user containers

**Answer: A**

**Explanation:** The NVIDIA Device Plugin advertises GPU resources to Kubernetes so that the scheduler can allocate GPUs to pods. Without it, GPUs remain invisible to Kubernetes even if drivers are installed correctly. DCGM Exporter provides monitoring, Node Feature Discovery adds hardware labels, and CUDA Toolkit inside containers does not expose GPU resources.

## QUESTION 92

An HPC administrator observes that a distributed training workload generates heavy AllReduce traffic across hundreds of GPUs. Although each InfiniBand link is healthy, several links become heavily utilized while others remain nearly idle, limiting overall scalability. Which configuration change is most likely to improve communication efficiency?

- A. Enable multi-rail communication so traffic can utilize multiple network interfaces
- B. Reduce GPU clock frequency to minimize communication demand
- C. Disable RDMA to simplify packet routing
- D. Replace NVSwitch with PCIe switches

**Answer: A**

**Explanation:** Multi-rail networking allows communication libraries such as NCCL to distribute traffic across multiple InfiniBand interfaces, improving bandwidth utilization and reducing congestion. Lowering GPU frequency reduces computational performance without solving the communication imbalance. RDMA should remain enabled for efficient transfers, and NVSwitch is unrelated to inter-server network traffic.

## QUESTION 93

Which of the following tests should be used to check for the lowest possible latency between two nodes in a fabric?

- A. ib_read_lat
- B. ib_write_lat
- C. ib_read_bw
- D. iperf

**Answer: B**

**Explanation:** ib_write_lat is the InfiniBand perftest utility used to measure RDMA write latency between two nodes. It is commonly used to validate the lowest practical fabric latency between hosts.

## QUESTION 94

A system administrator needs to troubleshoot multiple GPUs in a cluster environment. Which would be the most efficient tool for this?

- A. NVIDIA-SMI
- B. GPU Health Analyzer
- C. VMware Aria Operations
- D. NVIDIA-DCGM

**Answer: D**

**Explanation:** NVIDIA DCGM is designed for managing and diagnosing GPUs at data center and cluster scale. It provides health monitoring, diagnostics, telemetry, and validation across multiple GPUs and nodes, making it more efficient than checking each GPU individually.

## QUESTION 95

You are responsible for ensuring interoperability between AI applications deployed across a diverse IT landscape, including an on-premises data center equipped with NVIDIA GPUs and multiple cloud platforms from different vendors. These environments need to support complex AI workflows that involve large-scale data processing, real-time analytics, and machine learning model training. To maintain consistent performance and flexibility, which strategy should you prioritize?

- A. Choose a vendor and standardize on one storage solution across the environments to simplify management to improve interoperability
- B. Ensure that all environments use compatible storage protocols and APIs, such as NFS or S3, to facilitate data exchange and integration across platforms.
- C. Implement a multi-cloud strategy that leverages native storage solutions in each cloud platform while using middleware to ensure interoperability and data consistency.
- D. Focus on increasing network bandwidth between locations to reduce latency and improve data transfer speeds.

**Answer: B**

**Explanation:** Compatible storage protocols and APIs such as NFS and S3 allow AI applications, data pipelines, and analytics workflows to access and exchange data consistently across on-premises GPU infrastructure and multiple cloud platforms. This supports interoperability, portability, and flexible integration across diverse environments.

## QUESTION 96

A customer has just completed the first boot of their DGX system and is prompted to create an administrative user. What is the correct approach for setting up this user to ensure secure BMC and GRUB access?

- A. Create a unique, strong, lower-case username and password that will be used for both BMC and GRUB access, avoiding default or weak credentials.
- B. Skip the creation of a new user and retain the default admin account for BMC and GRUB access.
- C. Create separate usernames for BMC and GRUB to maximize flexibility.
- D. Use "sysadmin" as the username and a simple password for ease of management.

**Answer: A**

**Explanation:** During initial DGX setup, the administrative user should be created with unique, strong credentials because it is used for secure management access, including BMC and GRUB-related authentication. Avoiding default or weak credentials reduces the risk of unauthorized system control.

## QUESTION 97

A platform engineer uses NVIDIA DCGM to monitor hundreds of GPUs in production. One GPU repeatedly reports increasing corrected ECC memory errors, although training jobs continue to complete successfully. What is the most appropriate operational response?

- A. Continue monitoring and schedule proactive maintenance before uncorrectable errors develop.
- B. Ignore the warnings because corrected ECC errors have no operational significance.
- C. Immediately replace every GPU in the cluster.
- D. Disable ECC permanently to eliminate future alerts.

**Answer: A**

**Explanation:** Corrected ECC errors indicate that memory faults were detected and successfully corrected, allowing workloads to continue. However, a steadily increasing error rate may signal degrading hardware. Monitoring trends and scheduling planned maintenance helps prevent unexpected failures. Ignoring persistent errors or disabling ECC increases operational risk, while replacing every GPU is unnecessary.

## QUESTION 98

Refer to the exhibit *(NVIDIA LinkX DAC 케이블 사양 표)*. What is the longest distance that DAC LinkX 25G-NRZ cables can cover?

- A. 1 meter
- B. 10 meters
- C. 3 meters
- D. 5 meters

**Answer: D**

**Explanation:** DAC LinkX 25G-NRZ copper cables support short-reach server and switch connections, with the longest supported cable length being 5 meters.

## QUESTION 99

An administrator needs to perform a comprehensive pre-production stress test on a DGX H100 system. Which command validates GPU, CPU, memory, and storage components while following NVIDIA's recommended procedure?

- A. nvidia-smi -q | grep "GPU Stress Test"
- B. sudo nvsm stress-test --force
- C. stress --cpu $(nproc) --io $(nproc) --timeout 600
- D. ./gpu_burn 60

**Answer: B**

**Explanation:** sudo nvsm stress-test --force runs NVIDIA's recommended DGX system stress validation through NVSM. It exercises key hardware components, including GPUs, CPUs, memory, and storage, making it appropriate for comprehensive pre-production health and stability testing.

## QUESTION 100

An administrator notices that a server is not collecting telemetry data such as traffic flows, performance faults, and events. In which network does this information flow?

- A. Compute
- B. Storage
- C. In-band management
- D. InfiniBand management

**Answer: D**

*(원문에 해설 없음)*

## QUESTION 101

You are tasked with setting up High Availability (HA) for NVIDIA Base Command Manager (BCM) in a new GPU cluster. The cluster consists of a primary and secondary head node, as well as several compute nodes. The requirements are: automatic failover of BCM services, minimal disruption to workloads, and proper cluster health monitoring during and after installation. During your BCM HA installation and configuration process, which two of the following actions are mandatory for ensuring a robust and verified HA cluster configuration? (Choose two.)

- A. After configuration is complete, simulate a failover by stopping BCM services on the active head node to verify that all services are running on the secondary node with no interruption.
- B. During configuration, explicitly synchronize both the configuration and state data directories from the primary to the secondary head node to ensure consistency.
- C. Compute nodes must be powered on and performing work to initiate the synchronization of the head nodes.
- D. Configure both head nodes to use independent static IP addresses for BCM services instead of relying on a shared virtual IP address.
- E. Assign a floating Virtual IP address that can automatically migrate between the primary and secondary head nodes during failover.

**Answer: AE**

**Explanation:** BCM HA requires a floating Virtual IP so BCM services can move automatically between the active and standby head nodes during failover. After configuration, simulating a failover verifies that the secondary head node can assume service ownership correctly and that the HA setup is operational before production use.

## QUESTION 102

After a firmware upgrade on a DGX H100, the administrator notices that one GPU is not detected by the system. Which troubleshooting step should be performed first to identify the root cause?

- A. Remove the GPU from the system and replace it with a new one before any diagnostics.
- B. Ignore the issue and proceed with production workloads if the other GPUs are operational.
- C. Immediately re-run the firmware upgrade on all system components.
- D. Review firmware update logs and run nvsm show health to check for hardware or firmware errors on the affected GPU.

**Answer: D**

**Explanation:** After a firmware upgrade, the first step is to check the upgrade logs and run nvsm show health to identify whether the missing GPU is related to firmware activation, hardware detection, PCIe issues, or a component fault. This provides diagnostic evidence before rerunning updates or replacing hardware.

## QUESTION 103

A system administrator needs to check the health of the DGX power supplies. What command should be used?

- A. nvidia-smi -q | grep -i power\ draw
- B. nvsm show psus
- C. lspci | grep -i psu
- D. ipmitool sdr | grep PWR_SYSTEM

**Answer: B**

**Explanation:** nvsm show psus displays the DGX power supply status and health information. It is the appropriate NVSM command to check whether the power supplies are present, healthy, and operating normally.

## QUESTION 104

A data scientist needs to run a Jupyter notebook on specific GPU cards. What command should be used?

- A. docker run --gpus '"device=UUID-ABCDEF,1"' -p 8888:8888 jupyter/scipy-notebook:2023-09-25
- B. docker run --dpu "1,2" -p 8888:8888 jupyter/scipy-notebook:2023-09-25
- C. docker run --runtime=nvidia -dpu "1,2" -p 8888:8888 jupyter/scipy-notebook:2023-09-25
- D. docker run --gpus all --limit-gpu '"device=UUID-ABCDEF"' -p 8888:8888 jupyter/scipy-notebook:2023-09-25

**Answer: A**

**Explanation:** Docker uses the --gpus flag with a device= selector to expose only specific GPUs to a container. The selector can target GPUs by UUID and index, allowing the Jupyter notebook container to run only on the specified GPU cards while publishing port 8888 for notebook access.

## QUESTION 105

A systems administrator is preparing a new DGX server for deployment. What is the most secure approach to configuring the BMC port during initial setup?

- A. Enable remote access to the BMC over the internet using the default admin credentials for initial troubleshooting.
- B. Leave the BMC port disconnected until after the operating system is fully configured and in production.
- C. Connect the BMC port to a dedicated and firewalled network and change the default admin credentials.
- D. Connect the BMC port directly to the production network and retain default admin credentials for convenience.

**Answer: C**

**Explanation:** The BMC provides powerful out-of-band management access, so it should be isolated on a dedicated management network protected by firewall controls. Changing default credentials during initial setup prevents unauthorized administrative access to the DGX server.

## QUESTION 106

A system administrator notices a DGX A100 has lost a power supply, but the system is still operating at full performance. What is the minimum number of power supplies needed for the system to operate at full redundancy?

- A. 1
- B. 4
- C. 2
- D. 3

**Answer: B**

**Explanation:** DGX A100 systems require a minimum of four functioning power supplies to maintain full redundancy and full-performance operation. This allows the system to continue operating reliably even if a power supply failure occurs.

## QUESTION 107

To validate bisectional bandwidth across two racks in a Spectrum-X Ethernet fabric, which NCCL test configuration isolates East-West traffic?

- A. Run without splits and analyze per-rack averages
- B. NCCL_TESTS_SPLIT="MOD 2" ./all_reduce_perf -g 8
- C. NCCL_TESTS_SPLIT="DIV 8" ./all_reduce_perf -g 1
- D. NCCL_TESTS_SPLIT="OR 0x7" ./all_reduce_perf -g 8

**Answer: B**

**Explanation:** NCCL_TESTS_SPLIT="MOD 2" separates ranks into alternating groups, which is commonly used to force traffic across rack boundaries when ranks are arranged by rack. Running all_reduce_perf with all GPUs participates in the collective while isolating East-West paths needed to validate bisectional bandwidth between the two racks.

## QUESTION 108

You are a network administrator responsible for configuring an East-West (E/W) Spectrum-X fabric using SuperNIC. The BlueField-3 devices in your network should be set to NIC mode with RoCE enabled to optimize data flow between servers. Which of the following steps and commands are necessary? (Choose two.)

- A. Use the command sudo mlxconfig -d /dev/mst/<device> set DISABLE_SPECTRUM_X=1 to reduce overhead.
- B. Use the command sudo mlxconfig -d /dev/mst/<device> set DPU_MODE=1 to set up the BlueField-3 devices in DPU (Data Processing Unit) mode.
- C. Use the command sudo mlxconfig -d /dev/mst/<device> set INTERNAL_CPU_OFFLOAD_ENGINE=1 to configure the SuperNIC to operate in NIC mode.
- D. Use the command sudo mlxconfig -d /dev/mst/<device> set LINK_TYPE_P1=2 to enable Ethernet on the BlueField-3 devices.

**Answer: CD**

**Explanation:** For an East-West Spectrum-X fabric using SuperNIC, the BlueField-3 device must operate in NIC/SuperNIC mode and use Ethernet links for RoCE traffic. Setting the internal CPU offload engine enables the NIC-mode behavior required for SuperNIC operation, and setting the port link type to Ethernet enables the correct network mode for Spectrum-X RoCE connectivity.

## QUESTION 109

During a maintenance window, a system administrator needs to verify the CUDA version installed on the NVIDIA DGX server to ensure compatibility with applications. Which command could be used in the maintenance script to check the installed CUDA version?

- A. dpkg -l | grep cuda
- B. cat /bin/cuda/cuda.txt
- C. nvidia-smi --query-cuda-version
- D. nvcc-version

**Answer: A**

**Explanation:** dpkg -l | grep cuda lists installed CUDA-related packages on an Ubuntu-based DGX system, allowing the administrator to verify which CUDA toolkit/runtime versions are installed for application compatibility checks.

## QUESTION 110

A customer has just completed the first boot of their DGX system and is prompted to create an administrative user. What is the correct approach for setting up this user to ensure secure BMC and GRUB access?

- A. Use "sysadmin" as the username and a simple password for ease of management.
- B. Create a unique, strong, lower-case username and password that will be used for both BMC and GRUB access, avoiding default or weak credentials.
- C. Create separate usernames for BMC and GRUB to maximize flexibility.
- D. Skip the creation of a new user and retain the default admin account for BMC and GRUB access.

**Answer: B**

*(원문에 해설 없음 — QUESTION 96과 동일 문항, 보기 순서만 다름)*

## QUESTION 111

An AI engineer compares two HGX server configurations. One system uses only PCIe connections between GPUs, while the other includes NVLink and NVSwitch. During large-scale model training, the second configuration consistently finishes epochs sooner despite identical GPUs and CPUs. Which architectural feature primarily accounts for this improvement?

- A. NVSwitch enables high-bandwidth, low-latency communication among all GPUs within the server.
- B. PCIe automatically aggregates bandwidth across every GPU.
- C. NVLink replaces system memory with GPU memory.
- D. NVSwitch accelerates Ethernet routing between servers.

**Answer: A**

**Explanation:** NVSwitch connects every GPU within an HGX server through a high-bandwidth fabric, allowing efficient all-to-all communication and reducing bottlenecks during collective operations. PCIe provides lower peer-to-peer bandwidth, while NVSwitch neither replaces system memory nor manages inter-server Ethernet routing.

## QUESTION 112

A system administrator receives an alert about a potential hardware fault on an NVIDIA DGX A100. The GPU performance seems degraded, and the system fans are operating loudly. What step should be recommended to identify and troubleshoot the hardware fault?

- A. Run a deep learning workload to stress test the GPUs and check whether the issue persists.
- B. Check the NVIDIA System Management Interface (nvidia-smi) for GPU status and temperatures.
- C. Increase the fan speed to maximum and check whether the performance improves.
- D. Power drain then restart the DGX and check if the performance degradation resolves.

**Answer: B**

**Explanation:** nvidia-smi is the appropriate first diagnostic tool for checking GPU health, utilization, power, temperature, throttling, and error indicators. Since degraded performance and loud fans may point to thermal or GPU hardware issues, reviewing GPU status and temperatures helps identify the fault condition before taking corrective action.

## QUESTION 113

A media company is developing an AI platform for video content analysis that requires storing and processing large volumes of unstructured video data. The platform must support high throughput for data ingestion and provide efficient access for real-time analytics. Given these requirements, which storage strategy should the company implement?

- A. Block storage for low latency and high performance
- B. Object storage for scalability and metadata management
- C. Tape storage for its cost-effectiveness and archival capabilities
- D. File storage for hierarchical organization and easy navigation

**Answer: B**

**Explanation:** Object storage is best suited for large volumes of unstructured video data because it scales efficiently, supports high-throughput ingestion, and uses rich metadata to organize and retrieve content for analytics workflows. This makes it a strong fit for AI-based video analysis and real-time data access patterns.

## QUESTION 114

A system administrator needs to check the status of the RShim driver. What command should be used?

- A. lspci -vvv | grep RShim
- B. dmesg | grep rshim
- C. systemctl status rshim
- D. rshim status

**Answer: C**

**Explanation:** systemctl status rshim checks the Linux service state for the RShim driver, showing whether the service is loaded, active, failed, or stopped. This is the standard way to verify RShim service status before using the RShim interface for BlueField DPU access.

## QUESTION 115

Refer to the image *(BlueField DPU 제품 라벨 — base MAC 0002C9270500)*. Which MAC address should be used by the system administrator as the DPU's out-of-band management interface MAC address?

- A. 0002C9270502
- B. 0002C9270500
- C. 0002C927050F
- D. 0002C927050E

**Answer: A**

**Explanation:** The label shows the base host MAC as 0002C9270500. The BlueField DPU out-of-band management interface uses the derived management MAC by incrementing the base host MAC, resulting in 0002C9270502.

## QUESTION 116

A healthcare organization is deploying an AI system to analyze patient data for predictive diagnostics. The system must comply with strict data protection regulations such as HIPAA, ensuring that sensitive information remains confidential and secure. Considering the need for robust security measures, which combination of strategies should the organization prioritize to protect against data breaches and ensure regulatory compliance?

- A. Use tokenization to replace sensitive data with non-sensitive tokens and employ multi-factor authentication (MFA) for system access.
- B. Deploy data masking to obscure sensitive data during processing and use role-based access control (RBAC) to limit data access based on user roles.
- C. Rely on asymmetric encryption for all communications and use data deduplication to minimize storage costs without additional security measures.
- D. Implement symmetric encryption for all data at rest and rely solely on password-based access controls

**Answer: B**

**Explanation:** Data masking protects sensitive patient information during processing by obscuring confidential values, while role-based access control limits access to only authorized users based on job responsibilities. Together, these controls help reduce exposure of protected health information and support compliance with strict healthcare data protection requirements.

## QUESTION 117

An engineer wants to verify that their NVIDIA GPU is accessible inside a Docker container for running deep learning workloads. They have installed the NVIDIA Container Toolkit on a machine with working NVIDIA drivers. Which command demonstrates the correct way to run a container that can access all available GPUs?

- A. docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
- B. docker run --rm --runtime=docker nvidia/cuda nvidia-smi
- C. docker run --rm -it ubuntu:22.04 nvidia-smi
- D. docker run --rm nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi

**Answer: A**

**Explanation:** The --gpus all option exposes all available host GPUs to the Docker container through the NVIDIA Container Toolkit. Running nvidia-smi inside the CUDA container verifies that the container can see and access the GPUs correctly.

## QUESTION 118

You are tasked with updating both NVIDIA GPU drivers and DOCA drivers on a set of servers used for AI workloads. The environment previously had an older driver stack and custom kernel modules. What is the most important step to successfully upgrade the drivers without causing conflicts?

- A. Update the GPU driver leaving the DOCA and OFED drivers unchanged as long as they are detecting the hardware properly.
- B. Uninstall all existing GPU and DOCA-related drivers and associated kernel modules before the new install
- C. Keep the older driver running alongside the new version in case you need to roll back the upgrade.
- D. Validate the driver version post-install since the fresh install will overwrite the legacy drivers.

**Answer: B**

**Explanation:** Removing the existing GPU, DOCA, OFED, and related kernel-module stack before installing the new versions prevents version mismatches, stale kernel modules, and dependency conflicts. This is especially important when the servers previously used an older stack with custom modules.

## QUESTION 119

A leaf switch shows "FW Version Mismatch" alerts for transceivers after cluster expansion. Which tool validates transceiver firmware against expected versions?

- A. ethtool
- B. iblinkinfo
- C. mlxconfig
- D. flint

**Answer: D**

**Explanation:** flint is the NVIDIA/Mellanox firmware tool used to query and validate firmware images and versions for supported devices and components. It is the appropriate tool for checking transceiver firmware versions against expected levels after expansion.

## QUESTION 120

A cluster administrator deploys GPUDirect RDMA for a distributed AI training environment. After deployment, GPU utilization improves while CPU utilization during communication decreases substantially. Which architectural change most directly explains this improvement?

- A. Network traffic is compressed before entering GPU memory.
- B. Data transfers bypass CPU memory and move directly between GPUs and network adapters.
- C. All communication is redirected through NVSwitch.
- D. PCIe transactions are replaced entirely by Ethernet broadcasts.

**Answer: B**

**Explanation:** GPUDirect RDMA allows compatible network adapters to access GPU memory directly, eliminating unnecessary copies through host memory and reducing CPU involvement. This lowers latency, decreases CPU overhead, and improves overall communication efficiency during distributed AI workloads. NVSwitch only affects intra-server communication, while GPUDirect RDMA operates across network fabrics.

## QUESTION 121

After upgrading to HPL-AI 2.0 on a DGX A100 cluster, a 2x performance gain is observed. Which optimization is primarily responsible for this improvement?

- A. Reduction of problem size (N) to accelerate computation.
- B. Doubling of GPU clock speeds through firmware updates and relevant configuration.
- C. Automatic NVLink bandwidth doubling via driver updates.
- D. MPI-aware GPU communication that reduces CPU bottlenecks and GPU idle time.

**Answer: D**

**Explanation:** HPL-AI 2.0 improves performance mainly by using MPI-aware GPU communication that allows data movement to occur more efficiently between GPUs. This reduces CPU involvement, lowers communication overhead, and keeps GPUs active instead of waiting on host-side communication bottlenecks.

## QUESTION 122

You are following the official steps to install the NVIDIA Container Toolkit using a package manager on Ubuntu. After importing the NVIDIA package repository and GPG key, what is the next action?

- A. Download the CUDA toolkit installer from NVIDIA's official website.
- B. Install the nvidia-container-toolkit package using your package manager.
- C. Reboot the host system to apply the repository changes and proceed.
- D. Format the disk to clear any existing NVIDIA-related dependencies first.

**Answer: B**

**Explanation:** After adding the NVIDIA Container Toolkit repository and GPG key, the next step is to install the nvidia-container-toolkit package with the Ubuntu package manager. This installs the runtime components needed for Docker or other container engines to expose NVIDIA GPUs to containers.

## QUESTION 123

A systems engineer is updating firmware across a large DGX cluster using automation. What is the best practice for minimizing risk and ensuring cluster health during and after the process?

- A. To save time, simultaneously update all nodes in the cluster without draining or diagnostics.
- B. Drain nodes from the scheduler, run pre-update diagnostics, update firmware in batches, and verify health post-update before scaling to the next batch.
- C. Drain nodes from the scheduler, update firmware in batches, skip diagnostics and verify health post-update before scaling to the next batch.
- D. Update nodes that have reported faults, leaving others on older firmware.

**Answer: B**

**Explanation:** Large-cluster firmware updates should be performed in controlled batches after draining nodes from the scheduler so active workloads are not disrupted. Running pre-update diagnostics establishes baseline health, and post-update verification confirms each batch is stable before expanding the update to more nodes.

## QUESTION 124

An AI infrastructure team is implementing a highly available training environment. They want maintenance activities or isolated hardware failures to have minimal impact on running workloads while avoiding unnecessary complexity. Which design principle provides the strongest foundation for achieving this objective?

- A. Eliminate all redundant components to simplify troubleshooting.
- B. Introduce redundancy for critical infrastructure while avoiding unnecessary single points of failure.
- C. Concentrate every service on one large management server.
- D. Schedule all training jobs on a single compute node to simplify monitoring.

**Answer: B**

**Explanation:** High availability depends on eliminating critical single points of failure through carefully planned redundancy in networking, storage, management, and compute infrastructure. Redundancy should be applied strategically to improve resiliency without creating excessive operational complexity. Consolidating services onto single systems increases operational risk rather than reducing it.

## QUESTION 125

ClusterKit's NCCL bandwidth test shows 350 GB/s on a 400G InfiniBand fabric. How should this result be interpreted?

- A. Optimal performance, indicating healthy fabric and GPUDirect RDMA
- B. Critical failure; expected is ≥390 GB/s for HDR InfiniBand
- C. Suboptimal performance; requires FEC tuning to reach 380+ GB/s.
- D. Inconclusive; rerun with --stress=cpu to validate.

**Answer: A**

**Explanation:** A 350 GB/s NCCL bandwidth result on a 400G InfiniBand fabric indicates strong collective communication performance. This is consistent with a healthy fabric and effective GPUDirect RDMA operation during ClusterKit validation.

## QUESTION 126

A system engineer needs to set the vGPU scheduling behavior for all GPUs to share the scheduling equally with the default time slice length. What command should be used?

- A. esxcli system module parameters set -m nvidia -p "NVreg_RegistryDwords=RmPVMRL=0x00"
- B. esxcli system module parameters set -m nvidia -p "NVreg_RegistryDwords=RmPVMRL=0x01"
- C. esxcli graphics module parameters set -m nvidia -p "NVreg_RegistryDwords=RmPVMRL=0x01"
- D. esxcli system module parameters set -m nvidia -p "NVreg_RegistryDwords=FRL=0x01"

**Answer: A**

**Explanation:** The RmPVMRL=0x00 setting configures the NVIDIA vGPU scheduler to use equal-share scheduling with the default time slice length. The esxcli system module parameters set -m nvidia command is the correct ESXi command format for setting NVIDIA kernel module parameters globally for the GPUs.

## QUESTION 127

A team is validating a DGX BasePOD deployment. Using cmsh, they run a command to check GPU health across all nodes. What indicates that the system is ready for AI workloads?

- A. All GPUs report Status_Health = OK and Health = OK for each device.
- B. Only the head node's GPUs need to be healthy.
- C. At least half of the GPUs report Status_Health = OK
- D. The command output is ignored if the system powers on without errors.

**Answer: A**

**Explanation:** A DGX BasePOD is ready for AI workloads only when GPU health checks pass across the cluster. Seeing Status_Health = OK and Health = OK for every GPU confirms that all GPU devices are detected, healthy, and available for workload scheduling.

## QUESTION 128

An InfiniBand administrator needs to run performance benchmarks on new devices added to the fabric. What tool should be used to check the latency?

- A. tcpdump
- B. ibdiagnet
- C. ib_write_lat
- D. perfmon

**Answer: C**

**Explanation:** ib_write_lat is the InfiniBand performance benchmarking tool used to measure RDMA write latency between devices. It is the appropriate utility for checking latency on newly added InfiniBand fabric devices.

## QUESTION 129

If two ports must be connected, but one is SFP and one is QSFP, for example, to connect a 25 GbE HOST CHANNEL ADAPTER to a QSFP port capable of both 100 GbE and 25 GbE, which of the following solutions would best meet this requirement?

- A. QSA Adapter
- B. SFP to 1G BASE-T (RJ45) adapter
- C. SFP Connectors

**Answer: A**

**Explanation:** A QSA adapter is used to connect an SFP/SFP28 transceiver or cable to a QSFP/QSFP28 port when the QSFP port supports the lower-speed mode. This fits the requirement of connecting a 25 GbE SFP-based host adapter to a QSFP port capable of operating at 25 GbE.

## QUESTION 130

After Spectrum-X fabric deployment, NCCL tests show intermittent latency spikes. Which network condition most severely impacts East-West bandwidth?

- A. Multiple transceiver firmware mismatches.
- B. 400G port utilization at 70% on several nodes during tests.
- C. Packet loss >0.001% causing NCCL pipeline stalls.
- D. Jitter below 5us with consistent latency.

**Answer: C**

**Explanation:** Packet loss is especially damaging to East-West AI fabric performance because NCCL collective operations depend on reliable, high-throughput GPU-to-GPU communication. Even small packet-loss rates can trigger retries and pipeline stalls, causing latency spikes and reducing effective bandwidth across the fabric.

## QUESTION 131

A data scientist wants to run a PyTorch container on docker using a Multi-Instance GPU (MIG) slice. Based on the requirements, the system administrator suggests using a MIG slice with 2g compute profile and 10GB of GPU memory. What command should the administrator tell the data scientist to run?

- A. docker run --gpus '"device0"' --mig "2" nvcr.io/nvidia/pytorch:20.11-py3 nvidia-smi -L
- B. docker run --gpus '"device=0:2"' nvcr.io/nvidia/pytorch:20.11-py3 nvidia-smi -L
- C. docker run --mig '"device=0:2g.10gb"' nvcr.io/nvidia/pytorch:20.11-py3 nvidia-smi -L
- D. docker run --mig '"device=0:2"' nvcr.io/nvidia/pytorch:20.11-py3 nvidia-smi -L

**Answer: B**

**Explanation:** Docker uses the --gpus option with a device= selector to expose a specific GPU or MIG device to the container. The device=0:2 format targets a MIG device on GPU 0, allowing the PyTorch container to run using that assigned MIG slice.

## QUESTION 132

A system administrator noticed a failure on a DGX H100 server. After a reboot, only the BMC is available. What could be the reason for this behavior?

- A. There are more than two failed power supplies.
- B. A boot disk has failed.
- C. The network card has no link / connection.
- D. Multiple GPUs have failed.

**Answer: A**

**Explanation:** If more than two DGX H100 power supplies fail, the system may not have enough power capacity to bring up the host, while the BMC can still remain available on standby management power. This results in a condition where remote management is reachable but the server itself cannot fully boot.

## QUESTION 133

An enterprise deploys NVIDIA Base Command Manager to administer a newly built AI cluster. The infrastructure team wants to minimize manual provisioning whenever additional compute nodes are installed. Which capability of Base Command Manager most directly supports this objective?

- A. Automated cluster provisioning and lifecycle management
- B. Automatic retraining of machine learning models
- C. GPU firmware overclocking during deployment
- D. Automatic migration of Kubernetes workloads between clouds

**Answer: A**

**Explanation:** Base Command Manager provides centralized cluster deployment, operating system provisioning, software image management, health monitoring, and lifecycle automation. These capabilities simplify scaling AI infrastructure by reducing manual configuration effort. It does not retrain AI models, overclock hardware, or orchestrate multi-cloud workload migration.

## QUESTION 134

During a 72-hour HPL burn-in test on a DGX H100 cluster, one node shows a 15% performance drop after 48 hours. What are the two most likely causes and diagnostic steps? (Choose two.)

- A. Thermal throttling due to cooling issues; check nvidia-smi dmon
- B. Memory corruption; reboot the node and reduce problem size (N)
- C. Network packet loss; analyze ibdiagnet reports
- D. MPI configuration error; rerun with --cpu-affinity adjustments.

**Answer: AC**

**Explanation:** A delayed performance drop during a long HPL burn-in is commonly caused by thermal throttling as cooling conditions degrade under sustained load, so GPU temperature, clocks, power, and throttling behavior should be checked with nvidia-smi dmon. Network packet loss or fabric errors can also reduce multi-node HPL performance over time, so ibdiagnet reports should be analyzed for link errors, packet loss, retries, or degraded InfiniBand paths.

## QUESTION 135

A system administrator wants to configure MIG for seven slices on an H100 GPU in an NVIDIA HGX system. Which command should be used?

- A. mig-parted
- B. nvlink-config
- C. nvcc
- D. nvidia-smi

**Answer: A**

**Explanation:** mig-parted is used to configure MIG partition layouts on NVIDIA GPUs, including creating a seven-slice MIG configuration on an H100 in an HGX system. It provides a structured way to apply MIG profiles across supported GPUs.

## QUESTION 136

An engineer needs to verify NVLink isolation on a single node with 8 GPUs. Which NCCL test configuration stresses switch bisection bandwidth?

- A. Use NCCL_TESTS_SPLIT="DIV 8" with point-to-point tests
- B. Use all_reduce_perf -b 8 -e 16G -f2 -g 8 with NCCL_TESTS_SPLIT="AND 0x1"
- C. Use all_reduce_perf -b 8 -e 16G -f2 -g 8 without splits
- D. Use reduce_scatter_perf -b 8 -e 16G -f2 -g 4

**Answer: B**

**Explanation:** Using all_reduce_perf across all 8 GPUs with NCCL_TESTS_SPLIT="AND 0x1" separates GPUs into traffic groups that exercise cross-switch communication paths, making it suitable for stressing NVLink switch bisection bandwidth and validating isolation behavior within the node.

## QUESTION 137

A shared AI cluster contains H100, L40S, and A30 GPU nodes. Many users submit inference workloads without specifying hardware requirements, causing high-end H100 resources to be consumed by relatively lightweight jobs. Which administrative policy would most effectively improve overall cluster utilization?

- A. Configure Slurm partitions, constraints, or Quality of Service (QoS) policies based on workload requirements
- B. Restrict every user to a single GPU regardless of workload
- C. Disable scheduling on H100 nodes during business hours
- D. Assign every job to the first available GPU regardless of model size

**Answer: A**

**Explanation:** Slurm provides partitions, constraints, Generic Resources (GRES), and QoS policies that help direct workloads to appropriate GPU types. Reserving premium accelerators for demanding training jobs while routing inference to suitable hardware improves utilization and scheduling fairness. The remaining options either waste resources or ignore workload characteristics.

## QUESTION 138

An administrator installs NVIDIA GPU drivers on a DGX H100 system with UEFI Secure Boot enabled. After reboot, the drivers fail to load. What is the first action to resolve this issue?

- A. Reinstall drivers using apt-get install nvidia-driver-550 without rebooting.
- B. Delete /etc/X11/xorg.conf to force driver reconfiguration.
- C. Enroll the Machine Owner Key (MOK) during system reboot and enter the recorded password.
- D. Disable Secure Boot permanently in BIOS/UEFI settings.

**Answer: C**

**Explanation:** With UEFI Secure Boot enabled, NVIDIA kernel modules must be trusted before they can load. Enrolling the Machine Owner Key during reboot and entering the recorded password completes the trust process so the signed NVIDIA driver modules can load successfully.

## QUESTION 139

One of the nodes in a cluster is not running as fast as the others and the system administrator needs to check the status of the GPUs on that system. What command should be used?

- A. iblinkinfo
- B. lspci | grep NVIDIA
- C. nvidia-smi
- D. nvidia-gpu-status

**Answer: C**

**Explanation:** nvidia-smi is the standard NVIDIA command-line utility for checking GPU status, including utilization, temperature, power draw, memory usage, driver state, and running processes. It is the appropriate first command to investigate why a GPU node is performing slower than others.

## QUESTION 140

An administrator notices that a server is not collecting telemetry data such as traffic flows, performance faults, and events. In which network does this information flow?

- A. InfiniBand management
- B. In-band management
- C. Storage
- D. Compute

**Answer: A**

**Explanation:** Telemetry such as fabric traffic flows, performance counters, faults, and events is collected through the InfiniBand management path. If this data is not being collected, the InfiniBand management network should be checked for connectivity, configuration, and service issues.

## QUESTION 141

An engineer needs to verify the current firmware versions of all components (ATF, BSP, NIC, UEFI) on a BlueField-3 DPU's BMC. Which Redfish API command provides this information?

- A. mstflint -d <PCI_ID> query full
- B. curl -k -u root:<password> -X GET https://<DPU-BMC-IP>/redfish/v1/UpdateService/FirmwareList
- C. curl -k -u root:<password> -X GET https://<DPU-BMC-IP>/redfish/v1/UpdateService/FirmwareInventory
- D. mlxconfig -d <dev> q

**Answer: C**

**Explanation:** The Redfish UpdateService/FirmwareInventory endpoint is used to retrieve firmware inventory details from the BlueField DPU BMC, including installed firmware versions for components such as ATF, BSP, NIC, and UEFI.

## QUESTION 142

You must validate all physical cabling as part of the network bring-up phase in a new NVIDIA GPU cluster deployment. The design requires you to confirm that each cable matches the intended topology, all links are functional, and that future troubleshooting and scalability are supported. Which two steps are essential to an effective, recommended cabling validation process during cluster deployment? (Choose two.)

- A. Compare every cable's physical connection to the planned topology diagram and validate correct ports and link paths.
- B. Run the cable validation process incrementally during deployment (section by section), to catch and resolve errors as early as possible.
- C. Focus on validating the highest bandwidth links in the design first, deferring non-critical cable mislabelings to be fixed after initial workloads are deployed and tested.
- D. Begin validation by pinging each node's management interface and confirming the network cabling is correct when hosts respond to management pings.

**Answer: AB**

**Explanation:** Effective cabling validation requires checking each physical connection against the planned topology so port mappings, link paths, and neighbor relationships match the design. Performing this validation incrementally during deployment helps detect cabling mistakes early, reduces rework, and supports easier troubleshooting as the cluster scales.

## QUESTION 143

An AI infrastructure team upgrades a training cluster from PCIe-only GPU servers to HGX systems with NVLink and NVSwitch. Single-GPU benchmark results remain unchanged, but multi-GPU training jobs complete significantly faster. Which workload characteristic most directly benefits from the new architecture?

- A. Frequent peer-to-peer communication and collective operations among GPUs
- B. Sequential CPU-intensive preprocessing before model execution
- C. Local NVMe read performance for training datasets
- D. Kubernetes control plane scheduling latency

**Answer: A**

**Explanation:** NVLink and NVSwitch primarily improve communication between GPUs within the same server. Workloads involving frequent gradient synchronization, tensor exchange, or collective operations benefit from the substantially higher bandwidth and lower latency compared to PCIe. CPU preprocessing, storage performance, and Kubernetes scheduling are largely unaffected by the GPU interconnect architecture.

## QUESTION 144

A system administrator wants to enable vGPU virtualization on a DGX A100 system. What action should be taken first?

- A. Configure the FM service in vGPU Virtualization mode
- B. Initialize the NVLinks
- C. Bind NVSwitches and GPUs to nvidia.ko
- D. Configure the setting in the BIOS of the DGX system

**Answer: D**

**Explanation:** vGPU virtualization support on a DGX A100 must first be enabled at the platform level in the system BIOS. After the BIOS setting is configured, the NVIDIA driver, NVSwitch binding, and Fabric Manager vGPU virtualization mode can be configured to support vGPU operation.

## QUESTION 145

During cluster deployment, the UFM Cable Validation Tool reports "Wrong-neighbor" errors on multiple InfiniBand links. What is the most efficient way to resolve this issue?

- A. Verify LLDP data against topology files and remediate.
- B. Reboot all leaf switches to force LLDP rediscovery.
- C. Disable FEC on all switches to bypass neighbor validation.
- D. Replace all affected cables with higher-grade OM5 fiber optics.

**Answer: A**

**Explanation:** "Wrong-neighbor" errors indicate that the discovered cable peer does not match the expected topology. The efficient resolution is to compare LLDP-discovered neighbor data with the planned topology files, identify the mismatched links, and correct the cabling or topology definition accordingly.

## QUESTION 146

A System Administrator needs to change the scheduling behavior of a single GPU to use a fixed share scheduler. What command achieves this?

- A. mlxconfig -d /dev/mst/mt4123_pciconf0 set LINK_TYPE_P1=2
- B. esxcli -i 0 -mig 18
- C. nvidia-smi -i 0 -mig 1
- D. esxcli system module parameters set -m nvidia -p

**Answer: D**

**Explanation:** Fixed-share vGPU scheduling is configured through the NVIDIA driver module parameters on ESXi using esxcli system module parameters set -m nvidia -p .... The parameter must specify the fixed-share scheduler value, typically using NVreg_RegistryDwords with the appropriate RmPVMRL setting.

## QUESTION 147

A financial institution deploys NVIDIA BlueField DPUs in a shared AI infrastructure where multiple business units use the same physical network. Security administrators want to isolate infrastructure services from tenant workloads while enforcing networking policies independently of the host operating system. Which BlueField capability best satisfies this requirement?

- A. Infrastructure offload with isolated security and networking services on the DPU
- B. Automatic GPU virtualization through CUDA
- C. Hardware acceleration for tensor operations during model training
- D. Dynamic expansion of GPU framebuffer memory

**Answer: A**

**Explanation:** BlueField DPUs isolate networking, storage, and security functions from the host system by executing these services on dedicated Arm processors within the DPU. This architecture enhances security, enables infrastructure-level policy enforcement, and reduces dependence on the host operating system. BlueField does not virtualize GPUs, accelerate tensor computation, or increase GPU memory capacity.

## QUESTION 148

Which software library provides GPU acceleration for pandas-like DataFrame operations?

- A. R tidyverse
- B. RAPIDS cuDF
- C. Intel oneAPI Data Analytics Library
- D. TensorFlow Data API

**Answer: B**

**Explanation:** RAPIDS cuDF provides GPU-accelerated DataFrame operations with a pandas-like API, enabling faster data processing on NVIDIA GPUs for analytics and AI workflows.

## QUESTION 149

A system administrator wants to check the overall health status for their DGX systems. What command should be used?

- A. lspci
- B. nvsm
- C. ipmitool
- D. nvidia-smi

**Answer: B**

**Explanation:** nvsm is the NVIDIA System Management tool used on DGX systems to check overall platform health, including hardware, sensors, storage, power, and GPU-related system status.

## QUESTION 150

During a DGX cluster deployment, what is the most effective way to verify the health and integrity of the local RAID storage array?

- A. Verify that all configured RAID volumes are mounted and available in the operating system, and that disk utilization levels are within recommended limits.
- B. Use the mdadm --example and mdadm --detail commands to review the RAID array's status, checking for drive failures, array consistency, and error events.
- C. Run a read/write benchmark utility (such as FIO) across the RAID array, looking for expected speed and latency metrics as proof of storage integrity.

**Answer: B**

**Explanation:** mdadm --detail is the correct method to inspect Linux software RAID health directly. It shows array state, active and failed devices, rebuild or degraded status, consistency information, and error-related indicators, making it the most effective way to verify RAID integrity during DGX cluster deployment.

## QUESTION 151

When verifying network cable signal integrity during cluster deployment, which measurement result most strongly indicates a cable signal problem?

- A. Output of ifconfig showing link speed at the expected rate on both ends of the cable
- B. Repeated CRC errors and intermittent port flapping reported by switch counters.
- C. Network pings between all cluster nodes return responses with delays under 2 ms on a 100Gb network.

**Answer: B**

**Explanation:** Repeated CRC errors and intermittent port flapping are strong indicators of poor cable signal integrity. These symptoms show that the link is experiencing physical-layer errors or instability, which can cause packet loss, retransmissions, and degraded cluster performance under load.

## QUESTION 152

An AI operations team enables Multi-Instance GPU (MIG) on several NVIDIA GPUs to improve resource utilization. Shortly afterward, one data science team reports that its distributed training job runs noticeably slower than before. The cluster administrator must determine the most likely reason for this behavior.

- A. MIG increases GPU memory bandwidth for every workload.
- B. MIG divides one physical GPU into isolated compute instances with dedicated resources.
- C. MIG automatically enables NVLink aggregation across all GPU instances.
- D. MIG combines multiple physical GPUs into one logical accelerator.

**Answer: B**

**Explanation:** MIG partitions a single GPU into multiple isolated instances, each receiving dedicated compute cores, memory, cache, and bandwidth. Although this improves utilization and workload isolation, each partition has fewer resources than the full GPU. Large distributed training workloads typically perform better using complete GPUs instead of smaller MIG instances.

## QUESTION 153

A financial services firm is deploying an AI model for fraud detection that requires rapid inference and data retrieval across multiple sites. Which feature should their storage system prioritize?

- A. Tape backup systems.
- B. Low-cost HDD solutions.
- C. High capacity with moderate speed.
- D. Multi-protocol data access with low latency.

**Answer: D**

**Explanation:** Fraud detection inference across multiple sites needs fast access to data and flexibility for different workloads and applications. Multi-protocol storage with low latency supports rapid retrieval, real-time inference pipelines, and distributed access patterns required for time-sensitive AI fraud detection.

## QUESTION 154

What is the primary purpose of running a NCCL burn-in test on a new GPU cluster?

- A. To maximize the GPU utilization for machine learning workloads and to automatically tune deep learning frameworks.
- B. To test if GPUs are properly detected by the operating system and have the right drivers installed.
- C. To benchmark the application-specific runtime performance of AI models using real user data and production training scripts.
- D. To detect and resolve hardware or interconnect issues before production, by stressing GPU communication links.

**Answer: D**

**Explanation:** NCCL burn-in stresses GPU-to-GPU communication paths across NVLink, PCIe, and the network fabric. Its main purpose is to expose hardware, cabling, fabric, GPUDirect RDMA, or interconnect stability issues before the cluster is released for production workloads.

## QUESTION 155

A system administrator installed a new GPU. The system has booted but the GPU is not recognized by the OS. What is likely missing?

- A. cache drives
- B. CPU driver
- C. scheduler
- D. OFED driver

**Answer: D**

**Explanation:** If newly installed NVIDIA hardware is not recognized properly by the operating system, the required NVIDIA/Mellanox driver stack must be present. The OFED driver package provides the low-level support needed for supported NVIDIA networking/accelerated hardware to be detected and used correctly.

## QUESTION 156

You are expanding a DGX-based deep learning cluster to train on large, high-resolution images that cannot fit into local cache. Multiple nodes will access this data concurrently and require high performance. Which storage and networking solution best meets these requirements?

- A. Implement a standard NFS server on a 10GbE network since the cluster can access the export and job performance will not be impacted.
- B. Increase the SSD RAID-0 local cache size in each node so it can absorb most training data, making network storage type and speed less important for performance.
- C. Recommend general-purpose object storage for all training data as it's optimized for deep learning workloads and distributed data access at any scale
- D. Deploy a high-performance parallel filesystem across InfiniBand or 40/100GbE, ensuring at least 3GB/s per node and scalable aggregate bandwidth for all cluster workloads.

**Answer: D**

**Explanation:** Large high-resolution datasets that cannot fit in local cache require shared storage that can sustain concurrent access from many DGX nodes. A high-performance parallel filesystem over InfiniBand or high-speed Ethernet provides the per-node throughput and scalable aggregate bandwidth needed to keep distributed deep learning workloads fed with data.

## QUESTION 157

What is the best practice for configuring memory in an NVIDIA certified server for optimizing performance?

- A. Populate all memory channels evenly with identical DIMMs
- B. Leave half of the available memory channels unpopulated
- C. Populate an odd number of DIMMs per CPU socket.
- D. Use different DIMM sizes across memory channels

**Answer: A**

**Explanation:** NVIDIA certified servers should have memory channels populated evenly with identical DIMMs to maximize memory bandwidth and maintain balanced CPU memory access. This avoids channel imbalance and helps deliver consistent performance for GPU-accelerated workloads.

## QUESTION 158

A system administrator needs to configure a BlueField DPU and enable RShim on the baseboard management controller (BMC). Which command should be executed?

- A. systemctl enable bmc-rshim.service
- B. ipmitool raw 0x32 0x6a 1
- C. systemctl restart rshim
- D. scp <path_to_bfb> root@<bmc_ip>:/dev/rshim0/boot

**Answer: B**

**Explanation:** The ipmitool raw 0x32 0x6a 1 command enables RShim access through the BMC for BlueField DPU configuration. This allows the BMC to expose the RShim interface needed for DPU provisioning and management.

## QUESTION 159

The system administrator is tasked with updating GPU drivers and needs to check the driver version that is currently running. Which command should the system administrator use?

- A. nvidia-smi --query gpu driver --format=csv
- B. nvidia-smi --query-gpu=driver_version --format=csv
- C. nvidia-smi get gpu driver version --format=csv
- D. nvidia-smi gpu-driver-version --format=csv

**Answer: B**

**Explanation:** nvidia-smi --query-gpu=driver_version --format=csv uses the correct NVIDIA SMI query syntax to report the currently running NVIDIA GPU driver version in CSV format, which is useful before performing a driver update.

## QUESTION 160

You are preparing a GPU cluster for distributed AI training. Before running workloads, you need to validate the cluster's hardware. Which of the following steps is the most effective?

- A. Confirm that all nodes boot successfully into the operating system without errors.
- B. Use NCCL tests to validate GPU-to-CPU communication and run node health checks.
- C. Verify CPU performance across all nodes, as it indicates overall system stability.
- D. Run single-node benchmarks to confirm GPU performance on individual nodes.

**Answer: D**

**Explanation:** Single-node GPU benchmarks validate that each node's GPUs are functioning correctly and delivering expected performance before distributed training begins. This establishes the hardware baseline needed before moving on to multi-node communication and workload testing.

## QUESTION 161

Refer to the exhibit *(NVIDIA LinkX 케이블 색상 코드 표)*. Which type of NVIDIA LinkX cable has a teal color code?

- A. Copper cables with active circuitry (ACCs)
- B. Optical cables with active circuitry (AOCs)
- C. Optical cables with passive circuitry (POCs)
- D. Copper cables with direct attachment (DACs)

**Answer: B**

**Explanation:** NVIDIA LinkX teal-colored cables indicate active optical cables. AOCs use optical fiber with active circuitry in the cable ends to support high-speed, longer-distance data center interconnects.

## QUESTION 162

A system administrator has upgraded the firmware of the DPU. What will be the state of the firmware after the upgrade?

- A. The firmware is deleted from the DPU.
- B. The firmware is installed on the DPU.
- C. The firmware is copied to the DPU but not installed.
- D. The firmware is waiting on reboot to become active.

**Answer: D**

**Explanation:** After a DPU firmware upgrade, the new firmware is staged but does not become active until the DPU is rebooted or reset as required. The reboot activates the newly installed firmware image.

## QUESTION 163

A system administrator boots up a DGX A100 system and needs to check the NVSwitch and NVLink initializations. What will happen to the NVLink connections during initialization?

- A. The system supports ALI, NVLinks are trained at the GPU and NVSwitch hardware levels without FM.
- B. NVLink connections are trained at the GPU and NVSwitch hardware levels without FM.
- C. The NVLink connections are enabled after the NVIDIA kernel driver is loaded and NVLink peer-to-peer capability is available.
- D. The NVLink connections are enabled after the NVIDIA kernel driver is loaded and the FM configures these connections.

**Answer: D**

**Explanation:** On DGX A100 systems with NVSwitch, NVLink connectivity becomes fully available after the NVIDIA kernel driver loads and NVIDIA Fabric Manager configures the NVSwitch fabric. Fabric Manager is required to initialize and manage the NVLink/NVSwitch connections so GPU peer-to-peer communication can operate correctly.

## QUESTION 164

A Slurm-managed AI cluster contains both H100 and L40 GPU nodes. Several inference jobs requiring only modest GPU resources are repeatedly scheduled onto H100 nodes, delaying large distributed training jobs. Which scheduling strategy would best improve overall cluster efficiency?

- A. Disable scheduling on H100 nodes.
- B. Define partitions or resource constraints so workloads are matched to appropriate GPU types.
- C. Configure every node with identical GPU memory.
- D. Allow Slurm to randomly assign GPUs without resource awareness.

**Answer: B**

**Explanation:** Slurm supports partitions, Generic Resources (GRES), constraints, and scheduling policies that match workloads to suitable hardware. Assigning inference workloads to lower-cost GPUs while reserving H100 systems for large-scale training improves utilization and throughput. Disabling nodes wastes resources, and random scheduling ignores workload requirements.

## QUESTION 165

A systems administrator needs to provide an AI workload environment for a developer. Which profile type should the Administrator choose for vGPU?

- A. C-series
- B. Q-series
- C. A-series
- D. B-series

**Answer: A**

**Explanation:** C-series vGPU profiles are intended for compute workloads such as AI, deep learning, data science, and high-performance computing. They provide a vGPU profile type optimized for GPU-accelerated workload environments rather than graphics-focused use cases.

## QUESTION 166

A user encounters "permission denied" errors when running GPU-accelerated containers on a Secure Boot-enabled system. What resolves this?

- A. Disable SELinux to relax unnecessary security policies.
- B. Reinstall Docker without the NVIDIA runtime.
- C. Enroll the MOK and sign NVIDIA kernel modules.
- D. Run Docker with sudo for elevated privileges.

**Answer: C**

**Explanation:** On Secure Boot-enabled systems, unsigned NVIDIA kernel modules may be blocked from loading, which prevents GPU access inside containers and can appear as permission-related failures. Enrolling the Machine Owner Key and signing the NVIDIA kernel modules allows the trusted modules to load correctly while Secure Boot remains enabled.

## QUESTION 167

A system administrator needs to install a GPU/DPU in a server. The server has a free PCI-e slot, there are enough free PCI-e lanes, and there is enough room for the card. Which procedure should be followed?

- A. Ensure the server has enough power. Make sure the server is up and running with attached cables. Wear an ESD bracelet.
- B. Ensure the server has enough power. Verify compatibility of cables with server's platform. Make sure the server is down to remove cables safely. Do not wear an ESD bracelet.
- C. Ensure the server has enough power. Verify compatibility of cables with server's platform. Make sure the server is down to remove cables safely. Wear an ESD bracelet.
- D. Ensure the server has enough power. Make sure the server is down to remove cables safely. Wear an ESD bracelet.

**Answer: C**

**Explanation:** Installing a GPU or DPU requires confirming sufficient power, verifying that the required cables are compatible with the server platform, powering the server down before removing or connecting hardware, and wearing an ESD bracelet to prevent electrostatic damage to the card.

## QUESTION 168

It has been over two weeks since the 'ibdiagnet' tool was last used to check the InfiniBand fabric for performance. While running the utility today, the following output was received *(exhibit: ibdiagnet 요약 — 단계별 -W- 경고/-E- 오류 카운트)*. What is the first action that should be taken to further analyze the errors?

- A. Run ibdiagnet with additional options.
- B. Run ibstat.
- C. Inspect the 'ibdiagnet2.pm' file.
- D. Restart the master SM.

**Answer: A**

**Explanation:** ibdiagnet summary output only shows high-level warning and error counts by test stage. To investigate the root cause, the administrator should rerun ibdiagnet with additional diagnostic options so it generates more detailed reports for areas such as links, counters, LIDs, subnet manager status, and speed/width mismatches.

## QUESTION 169

After upgrading NVIDIA GPU Operator, Kubernetes reports all worker nodes as Ready, but newly created GPU workloads remain in the Pending state. The administrator confirms that GPUs are healthy and visible to the operating system. Which troubleshooting step should be performed first?

- A. Verify that the NVIDIA Device Plugin is running successfully on GPU nodes.
- B. Replace every GPU driver with an earlier version immediately.
- C. Increase CPU requests for every application pod.
- D. Disable the Kubernetes scheduler and assign pods manually.

**Answer: A**

**Explanation:** If GPUs are detected by the operating system but Kubernetes cannot schedule GPU workloads, the Device Plugin is one of the first components to verify. It advertises GPU resources to the Kubernetes scheduler. Healthy hardware alone does not guarantee that GPUs are available as schedulable resources within the cluster.

## QUESTION 170

An infrastructure engineer is preparing a new AI cluster for production use, which relies on NVIDIA switches and high-speed optical transceivers for node connectivity. The team is finalizing network validation before launching large-scale training jobs. Why is it critical to confirm and align the firmware version on all switch transceivers prior to production?

- A. To ensure stability, bandwidth, and compatibility across the cluster, avoiding link issues and performance loss.
- B. To guarantee that hardware inventory tools can report serial numbers and manufacturer codes for asset management critical for future support and troubleshooting.
- C. To allow the network operating system to automatically discover all connected transceivers with heterogeneous firmware.

**Answer: A**

**Explanation:** Matching supported transceiver firmware versions across the cluster helps ensure link stability, expected bandwidth, and compatibility between NVIDIA switches and optical modules. This reduces the risk of link flaps, degraded throughput, and intermittent fabric issues during large-scale AI training workloads.

## QUESTION 171

A cluster administrator needs to validate transceiver firmware versions across 200 ports using UFM. Which GUI-based method provides a consolidated view?

- A. Use "Topology" view to visually inspect cable icons.
- B. Navigate to "Devices" > select a switch > "Cables" tab to see ASIC firmware and transceiver versions.
- C. Export all switch logs and grep for "FW Version"
- D. Run mlxlink -d lid-<LID> -m on each port manually

**Answer: B**

**Explanation:** UFM provides a consolidated GUI view of cable and transceiver information from the switch device page. The Cables tab shows per-port cable details, including firmware-related information such as ASIC firmware and transceiver versions, allowing validation across many ports without checking each port manually.

## QUESTION 172

A cluster administrator is preparing to update the firmware on a DGX H100 system, including the GPU tray (baseboard). What is the correct sequence of steps to perform a safe and successful firmware upgrade?

- A. Update the BMC and skip the GPU tray and motherboard tray updates if the system appears healthy.
- B. Update the GPU tray first, then the motherboard tray, and reboot the BMC after all updates are complete.
- C. Stop all GPU activity, update and reboot the BMC, update motherboard and tray components, perform a cold reset, and verify completion.
- D. Perform a cold reset, stop all GPU activity, update and reboot the BMC, update motherboard and tray components, and verify completion.

**Answer: C**

**Explanation:** A safe DGX H100 firmware update requires stopping GPU workloads first, updating and rebooting the BMC so management firmware is current, then updating the motherboard and tray components such as the GPU tray/baseboard. A cold reset ensures all updated component firmware is fully activated, and final verification confirms the upgrade completed successfully.

## QUESTION 173

You are evaluating the integration of NVIDIA BlueField DPUs into your data center's storage architecture to optimize AI workloads. The storage solution chosen has incorporated BlueField DPUs to enhance performance and efficiency. Which of the following benefits directly results from this integration?

- A. Elimination of latency issues in data processing tasks.
- B. Enhanced I/O performance with NVMe storage access speeds.
- C. Reduced CPU load by offloading data processing tasks to DPUs.
- D. Unlimited scalability by adding more DPUs without architectural changes.

**Answer: C**

**Explanation:** NVIDIA BlueField DPUs improve storage architecture efficiency by offloading infrastructure and data-processing tasks from the host CPU. This frees CPU resources for AI workloads while the DPU handles storage, networking, and security-related processing more efficiently.

## QUESTION 174

An InfiniBand server stops working, and a system administrator runs the "ibstat" command *(exhibit: State: Initializing, Physical state: LinkUp, SM lid: 0)*. What is the cause of the issue?

- A. The HCA port is faulty.
- B. There is no running SM in the fabric.
- C. The cable is disconnected.
- D. The neighboring switch port is faulty.

**Answer: B**

**Explanation:** The port shows Physical state: LinkUp, so the cable and physical link are up, but the logical State remains Initializing and SM lid is 0. In InfiniBand, a port typically remains initializing when no subnet manager is running or reachable to bring the port to the active state.

## QUESTION 175

A system administrator is responsible for managing an NVIDIA SuperPOD. The administrator wants to verify that all systems are in a healthy state. What should the system administrator do?

- A. Use the vendor provided tools to verify the hardware health and set up proper alerting.
- B. Check the data center manually for indicator LED on the hardware.
- C. Check the hardware on a regular basis by powering down the server.
- D. Contact the NVIDIA sales team.

**Answer: A**

**Explanation:** For NVIDIA SuperPOD operations, administrators should use vendor-provided health monitoring and management tools to verify hardware status across all systems and configure alerting for failures or degraded components. This provides scalable, proactive visibility into system health instead of relying on manual checks.

## QUESTION 176

A company deploys a large language model training cluster containing multiple NVIDIA HGX servers. During benchmarking, GPUs within each server communicate efficiently, but gradient synchronization across servers introduces significantly higher latency than expected. The infrastructure engineer needs to identify the component primarily responsible for optimizing GPU-to-GPU communication between different servers while maintaining maximum bandwidth and minimum latency.

- A. NVIDIA NVSwitch
- B. NVIDIA InfiniBand fabric
- C. PCIe Gen5 switch
- D. NVIDIA MIG

**Answer: B**

**Explanation:** NVSwitch accelerates communication among GPUs inside a single HGX server, but it does not extend across physical servers. Multi-node distributed training depends on the InfiniBand fabric and technologies such as GPUDirect RDMA to provide low-latency, high-bandwidth communication. PCIe switches remain local to the server, while MIG partitions GPUs rather than improving network communication.

## QUESTION 177

Your company is planning to expand its AI capabilities significantly over the next five years. To future-proof your storage infrastructure, you need a solution that can scale in both capacity and performance. Which of the following strategies best ensures that your storage infrastructure remains adaptable to future AI demands?

- A. Implement on-premises block storage system with periodic hardware upgrades.
- B. Implement single-tier cloud storage solution to leverage cloud scalability.
- C. Use a hybrid cloud model combining scalable cloud resources with on-premises infrastructure.
- D. Deploy an all-flash array and remove data tiering to reduce latency.

**Answer: C**

**Explanation:** A hybrid cloud model provides the flexibility to scale capacity and performance over time by combining on-premises infrastructure for predictable, high-performance workloads with cloud resources for elastic growth. This approach keeps the storage architecture adaptable as AI data volumes, training workloads, and performance requirements increase.

## QUESTION 178

A system administrator needs to install a container toolkit and successfully run the following commands *(exhibit: NVIDIA Container Toolkit 설치 후 `sudo nvidia-ctk runtime configure --runtime=docker` 실행)*. What step should be taken next to finish the installation?

- A. systemctl restart docker
- B. apt-get remove nvidia-container-toolkit
- C. dpkg -i doca-host-repo-ubuntu<version>_amd64.deb
- D. apt-get install cuda-drivers

**Answer: A**

**Explanation:** After configuring the NVIDIA Container Toolkit runtime for Docker with nvidia-ctk runtime configure --runtime=docker, Docker must be restarted so it reloads the updated runtime configuration and can run GPU-enabled containers correctly.

## QUESTION 179

You are installing the operating system as part of the initial setup for a new NVIDIA Base Command Manager (BCM) cluster. Which two of the following actions are essential for a successful OS installation on the cluster's head node? (Choose two.)

- A. Start the head node OS installation process with the system BIOS set to legacy boot mode instead of UEFI.
- B. Configure network switches for PXE boot to all compute nodes before installing the OS on the head node.
- C. Set the desired time zone and configure NTP synchronization during the OS installation wizard.
- D. Download the latest BCM ISO and verify its integrity using the provided checksum, then start the installation.

**Answer: CD**

**Explanation:** A successful BCM head node installation requires using a verified BCM ISO so the installer media is trusted and complete. During the installation wizard, setting the correct time zone and configuring NTP synchronization are also essential because accurate time is required for reliable cluster services, authentication, logging, and management operations.

## QUESTION 180

A system administrator needs to reboot a server in an NVIDIA BasePOD, but is unable to SSH. However, they can log into the BMC. What network should be installed to make sure the system administrator can power up the server?

- A. In-band management network
- B. Out-of-band management network
- C. Compute network
- D. Storage network

**Answer: B**

**Explanation:** The out-of-band management network provides access to the BMC independently of the host operating system and in-band network. This allows administrators to power cycle, reboot, or recover a server even when SSH access to the server is unavailable.

## QUESTION 181

An enterprise is designing a new AI training environment expected to expand from 32 GPUs to more than 1,000 GPUs within two years. Management wants to minimize future architectural changes while maintaining high throughput for distributed training. Which infrastructure design strategy best supports these long-term objectives?

- A. Build the environment around a scalable high-speed fabric with modular expansion capabilities.
- B. Maximize the number of GPUs in a single server to eliminate networking requirements.
- C. Deploy standard office Ethernet switches because bandwidth can be increased later through software updates.
- D. Connect every server directly to every other server using dedicated cables.

**Answer: A**

**Explanation:** Large AI clusters should be designed around scalable, high-bandwidth fabrics such as InfiniBand or optimized Ethernet with RoCE. Modular network architectures allow additional compute nodes to be integrated without redesigning the infrastructure. Direct server-to-server cabling does not scale, while relying solely on larger servers limits future growth and flexibility.

## QUESTION 182

A system administrator needs to replace a failing GPU. Which of the following commands should be used to check slot capabilities?

- A. lspci
- B. netstat -tulpn
- C. nvidia-smi
- D. dmesg

**Answer: A**

**Explanation:** lspci is used to inspect PCIe devices and slot-related capabilities, including GPU detection, PCIe link width, link speed, and bus placement. This helps verify the slot characteristics before replacing or troubleshooting a GPU.

## QUESTION 183

An administrator needs to manually deploy the BlueField image on a target DPU. The administrator downloads the new image file and needs to flash it to the hardware. Which command should the administrator use?

- A. dd if=/root/bf.image of=/dev/bf/ bs=4096k
- B. bfb-install --rshim
- C. apt install doca-runtime
- D. /opt/mellanox/mlnx-fw-updater/mlnx_fw_updater.pl

**Answer: B**

**Explanation:** bfb-install --rshim is used to manually install or flash a BlueField boot image to a target DPU through the RShim interface. This is the appropriate method when deploying a downloaded BlueField image directly to the hardware.

## QUESTION 184

During acceptance testing of a newly deployed AI cluster, engineers observe that GPUs remain below 60% utilization even though CPU usage, storage throughput, and network latency all fall within expected ranges. Before recommending expensive hardware upgrades, what should the engineering team do first?

- A. Perform a systematic end-to-end performance analysis to identify the actual bottleneck.
- B. Replace all GPUs with the latest generation accelerators.
- C. Double the amount of system memory in every server.
- D. Increase the number of Kubernetes worker nodes regardless of workload characteristics.

**Answer: A**

**Explanation:** Performance optimization should begin with comprehensive measurement rather than immediate hardware replacement. Profiling GPU utilization, communication patterns, storage performance, application behavior, and software configuration helps identify the true bottleneck. Upgrading hardware without evidence often increases cost without resolving the underlying performance limitation.

## QUESTION 185

A system administrator installed a new DPU on a system and needs to connect to the RShim interface using SSH for the first time. What IP address should the system administrator connect to?

- A. 192.168.100.2/24
- B. 10.0.0.1/24
- C. 172.16.0.2/24
- D. 192.168.1.2/24

**Answer: A**

**Explanation:** The default RShim network interface uses the 192.168.100.0/24 subnet, with the BlueField DPU reachable at 192.168.100.2. This is the address used for the first SSH connection through the RShim interface.

## QUESTION 186

A system administrator needs to validate a GPU-based server and ensure that no errors occur under load. What command should be used?

- A. stress-test --usage
- B. nvsm stress-test
- C. nvsm dump health
- D. nvsm show health

**Answer: B**

**Explanation:** nvsm stress-test is used to place the DGX/GPU-based server under load and validate that the system remains stable without reporting hardware or GPU errors during the test.

## QUESTION 187

An infrastructure engineer in an AI factory has successfully replaced a power supply unit on an NVIDIA DGX H100. After installation, both the IN and OUT LEDs on the new power supply illuminate solid green. Which NVSM CLI command should the engineer use to quickly verify the overall system status and ensure it is operating as expected?

- A. nvsm show powermode
- B. nvsm show health
- C. nvsm show power
- D. nvsm show alerts

**Answer: B**

**Explanation:** nvsm show health provides a quick overall health summary for the DGX system after hardware replacement. It is the appropriate command to confirm that the system is operating normally and that no health issues remain after the PSU installation.

## QUESTION 188

Which of the following commands should be used to inspect a server's SM log file and detect if there was a change on the SM's chosen routing engine?

- A. show ib sm log matching tables
- B. grep log_tra_info /var/log/opensm.log
- C. grep tables /var/log/opensm.log
- D. show ib sm log matching log_trap_info

**Answer: B**

**Explanation:** Inspecting the OpenSM log directly with grep is the appropriate way to check whether the subnet manager changed or recalculated routing behavior. Searching for routing-table related entries in the OpenSM log helps identify changes associated with the selected routing engine.

## QUESTION 189

After ClusterKit reports "GPU-Host latency exceeds threshold", which NVIDIA diagnostic tool should be used to isolate hardware faults?

- A. nvidia-smi topo -m to inspect GPU topology connections
- B. Re-run ClusterKit with --stress=gpu -Y 60 to extend test duration
- C. DCGM Diags dcgmi diag -r 2
- D. ib_write_bw to measure InfiniBand bandwidth between nodes

**Answer: C**

**Explanation:** DCGM Diagnostics with dcgmi diag -r 2 is the NVIDIA hardware diagnostic tool used to isolate GPU-related hardware faults after performance or latency anomalies are detected. It performs deeper GPU health validation beyond topology inspection or workload reruns.

## QUESTION 190

You are leading a project to enhance the energy efficiency of a data center that heavily relies on AI workloads. NVIDIA suggests moving beyond traditional metrics like Power Usage Effectiveness (PUE) to better capture the efficiency of modern data centers. Which strategy should you prioritize to develop more accurate energy-efficiency metrics?

- A. Focus on integrating kilowatt-hours into existing metrics to better reflect the actual energy used for productive work.
- B. Use watts-used as the primary measure of efficiency, as it accurately reflects the power input at any given time.
- C. Use Power Usage Effectiveness as the primary metric while supplementing it with additional measures of useful work done per unit of energy.
- D. Develop benchmarks tailored to specific workloads, such as MLPerf for AI applications, to better understand energy use in real-world scenarios.

**Answer: D**

**Explanation:** Workload-specific benchmarks provide a more accurate view of AI data center efficiency because they measure energy use in the context of real computational output. For AI environments, benchmarks such as MLPerf better reflect useful work per unit of energy than facility-level metrics alone.

## QUESTION 191

An engineer is reimaging a DGX system in a large cluster. Which method ensures the most efficient and secure remote installation without physical access?

- A. Create a USB drive with the ISO and manually boot from it on the DGX system.
- B. Skip ISO verification and directly flash the OS to the disk via SSH.
- C. Use apt-get to upgrade the OS without rebooting the system.
- D. Build a software image on Base Command Manager and then reimage.

**Answer: D**

**Explanation:** Base Command Manager is designed for centralized cluster provisioning and reimaging. Building a managed software image in BCM and reimaging the DGX system remotely provides an efficient, repeatable, and secure method without requiring physical access to the node.

## QUESTION 192

An engineer needs to completely remove NVIDIA GPU drivers from an Ubuntu 22.04 system to troubleshoot conflicts. Which command sequence ensures all driver components are purged?

- A. sudo apt-get remove nvidia-driver-550
- B. sudo apt-get purge nvidia-* && sudo apt-get autoremove
- C. sudo rm -rf /usr/lib/nvidia
- D. sudo ubuntu-drivers uninstall

**Answer: B**

**Explanation:** Purging nvidia-* removes NVIDIA driver packages and related configuration files, while autoremove cleans up unused dependencies and kernel module packages left behind. This provides a more complete cleanup than removing only a single driver package.

## QUESTION 193

What is the primary purpose of performing a NeMo Burn-in on a new AI infrastructure?

- A. To stress test the hardware and software stack with representative NeMo workloads, ensuring reliability.
- B. To benchmark production training speed and ensure all GPUs are running at identical clock speeds.
- C. To tune NeMo model hyperparameters for maximum accuracy on user datasets during cluster deployment.

**Answer: A**

**Explanation:** NeMo Burn-in validates new AI infrastructure by running representative NeMo workloads under sustained load. This stresses the GPUs, networking, storage paths, drivers, containers, and software stack together to confirm the platform is reliable before production use.

## QUESTION 194

ClusterKit's NCCL bandwidth test shows 350 GB/s on a 400G InfiniBand fabric. How should this result be interpreted?

- A. Inconclusive; rerun with --stress=cpu to validate.
- B. Optimal performance, indicating healthy fabric and GPUDirect RDMA.
- C. Suboptimal performance; requires FEC tuning to reach 380+ GB/s.
- D. Critical failure; expected is ≥390 GB/s for HDR InfiniBand.

**Answer: B**

**Explanation:** A 350 GB/s NCCL bandwidth result on a 400G InfiniBand fabric indicates strong end-to-end collective communication performance. This level is consistent with a healthy fabric path and effective GPUDirect RDMA operation during ClusterKit validation.

## QUESTION 195

A system administrator wants to determine if ConnectX ports are configured in Ethernet or InfiniBand modes. What command should be used?

- A. ibstat
- B. netstat
- C. iostat
- D. vmstat

**Answer: A**

**Explanation:** ibstat displays ConnectX adapter and port information, including the link layer for each port. The link layer field shows whether the port is operating in InfiniBand or Ethernet mode.

## QUESTION 196

A machine learning platform stores multi-petabyte training datasets accessed concurrently by hundreds of GPUs. Administrators determine that the storage system must provide high aggregate throughput, parallel client access, and efficient scaling as additional storage nodes are added. Which storage solution is generally the most appropriate?

- A. Local USB-attached storage
- B. NFS server running on a single virtual machine
- C. Parallel file system such as BeeGFS or Lustre
- D. Individual SATA disks installed in each compute server

**Answer: C**

**Explanation:** Parallel file systems such as BeeGFS and Lustre are designed for high-performance computing and AI environments. They distribute metadata and data across multiple servers, enabling simultaneous high-bandwidth access by many clients. Single-server NFS implementations and local disks typically become bottlenecks as AI clusters grow in size and workload intensity.

## QUESTION 197

After configuring HA, the administrator runs cmsh status and notices the secondary head node reports mysql [FAIL]. What is the most likely cause?

- A. The secondary head node lacks NVIDIA GPU drivers.
- B. The BCM license expired after HA configuration.
- C. The cluster nodes are powered on during the HA configuration.
- D. Network connectivity issues between the primary and secondary head nodes.

**Answer: D**

**Explanation:** In a BCM HA setup, the secondary head node depends on reliable connectivity to the primary head node for service synchronization and database replication. A MySQL failure on the secondary after HA configuration most commonly points to communication or replication issues between the two head nodes.
