<template>
    <div>
        <template v-for="monitoringType of Object.keys(calculatorStore.systemScore)" :key="monitoringType">
            <div
                class=" 2xl:flex lg:block md:flex mt-4">
                <div class="flex items-center gap-2">
                    <h3 class="uppercase font-semibold text-xl my-auto">{{ monitoringType }} Monitoring Components</h3>
                    <button
                        class="text-sm"
                        @click="() => onClickMoreInfo(monitoringType)"
                    >
                        <i  v-if="openComponents.has(monitoringType)" class="pi pi-chevron-up text-xs"></i>
                        <i  v-else class="pi pi-chevron-down text-xs"></i>
                    </button>
                </div>
                <div
                    v-if="openComponents.has(monitoringType)"
                    class="monitoring-description ml-1 mb-2 text-sm mt-1 2xl:hidden"
                    v-html="monitorDescriptions[monitoringType as MonitoringType]"
                >
                </div>
                <select-button v-model="systemScores[monitoringType as MonitoringType]" :options="options" optionLabel="label"
                    dataKey="value" class="my-auto ml-auto"></select-button>
            </div>
            <div
                v-if="openComponents.has(monitoringType)"
                class="monitoring-description ml-1 text-sm mt-1 hidden 2xl:block"
                v-html="monitorDescriptions[monitoringType as MonitoringType]"
            >
            </div>
        </template>
        
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { type CalculatorStore, useCalculatorStore } from "../stores/calculator.store";
import SelectButton from "primevue/selectbutton";

type MonitoringType = keyof CalculatorStore["systemScoreObj"];

export default defineComponent({
    components: { SelectButton },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            selectedValue: 0,
            options: [
                { label: "None", value: 1 },
                { label: "Low", value: 0.6666666666667 },
                { label: "Medium", value: 0.33333333333 },
                { label: "High", value: 0 },
            ],
            monitorDescriptions: {
                network: `
                    <p>
                        Continuous observation of network traffic, device health, and protocol activity to detect
                        malicious traffic, lateral movement attempts, command-and-control (C2) communications,
                        and policy violations 
                    </p>
                    <p>
                        Rubric:
                        <ul>
                            <li>None: No maintained traffic logs.</li>
                            <li>Low: Basic checks (e.g., ping/ICMP, simple uptime) without detailed metrics or alerting. </li>
                            <li>
                                Medium: Collection of core metrics (latency, bandwidth, error rates) with alerts on
                                known signatures or threshold breaches; some visualization dashboards.</li>
                            <li>
                                High: Full packet-capture, encrypted-traffic analysis, UEBA (user-entity-behavior
                                analytics), automated containment (e.g., SDN quarantine) and integration with
                                threat-intel feeds.
                            </li>
                        </ul>
                    </p>
                `,
                process: `
                    <p>
                        Ongoing inspection of host-level processes and services for suspicious behavior such as
                        abnormal privilege escalation, unexpected network connections, code injection, or execution of
                        known malware binaries 
                    </p>
                    <p>
                        Rubric:
                        <ul>
                            <li>None: No process visibility; services run unchecked.</li>
                            <li>Low: Manual review of a few critical processes, occasional log checks. </li>
                            <li>
                                Medium: Automated collection of CPU, memory, I/O for all processes; alerts on unknown
                                binaries or privilege escalation patterns.
                            </li>
                            <li>
                                High: Real-time behavioral baselines, anomaly detection, automatic
                                isolation/quarantine, and forensic replay of process activity 
                            </li>
                        </ul>
                    </p>
                `,
                file: `
                    <p>
                        The systematic observation of files and directories for changes such as creation, modification,
                        deletion, or access to detect unauthorized edits, configuration drift, and data exfiltration,
                        and to maintain audit trails of file-system activity. 
                    </p>
                    <p>
                        Rubric:
                        <ul>
                            <li>None: No formal file monitoring.</li>
                            <li>Low: Periodic manual audits of select files or directories.</li>
                            <li>
                                Medium: File-integrity monitoring (hashes, ACL changes) on critical assets; alerts on
                                unauthorized modifications
                            </li>
                            <li>
                                High: Continuous, real-time monitoring of the entire file system, immutable audit logs,
                                tamper-evidence, integration with security information and event management (SIEM) for
                                automated response; automatic rollback or containment actions
                            </li>
                        </ul>
                    </p>
                `,
                cloud: `
                    <p>
                        Visibility into cloud-native workloads, APIs, storage buckets, IAM policies, and serverless
                        functions for security-focused events such as unusual API calls, privilege-escalation attempts,
                        misconfigurations, and exposure of sensitive data 
                    </p>
                    <p>
                        Rubric:
                        <ul>
                            <li>
                                None: No telemetry from cloud services; reliance on manual console checks. 
                            </li>
                            <li>
                                Low: Simple uptime checks for a few cloud instances; basic health-status dashboards
                                for VMs
                            </li>
                            <li>
                                Medium: Cloud-security logs (API activity, IAM changes, configuration rules) collected
                                and correlated; alerts on anomalous calls or misconfigurations
                            </li>
                            <li>
                                High: Integrated CSP native security services plus third-party SIEM, automated
                                policy-as-code enforcement, continuous compliance scanning, and threat-intel-driven
                                response orchestration 
                            </li>
                        </ul>
                    </p>
                `,
                hardware: `
                    <p>
                        Surveillance of physical server and endpoint health metrics with tamper-evidence sensors to
                        guard against hardware-based attacks (e.g., firmware implants, side-channel exploitation) to
                        ensure the integrity of the trusted computing base. 
                    </p>
                    <p>
                        Rubric:
                        <ul>
                            <li>
                                None: No physical-layer visibility; firmware attacks undetectable
                            </li>
                            <li>
                                Low: Occasional manual checks of temperature or fan speed on select devices.
                            </li>
                            <li>
                                Medium: Regular polling of hardware sensors (temperature, power, SMART) with
                                threshold alerts for out-of-range values.
                            </li>
                            <li>
                                High: Formal hardware monitoring processes including firmware integrity
                                verification, tamper-evidence logging, and automated escalation to incident response
                                when hardware anomalies align with cyber indicators 
                            </li>
                        </ul>
                    </p>
                `
            } as Record<MonitoringType, string>
        };
    },
    setup() {
        const openComponents = ref(new Set<string>([]));

        return {
            openComponents
        }
    },
    computed: {
        systemScores() {
            return this.calculatorStore.systemScore
        },
    },
    methods: {
        saveNewScores() {
            this.calculatorStore.updateSystemScores(this.systemScores)
        },
        onClickMoreInfo(monitoringType: string) {
            if (this.openComponents.has(monitoringType)) {
                this.openComponents.delete(monitoringType);
            } else {
                this.openComponents.add(monitoringType);
            }
            this.openComponents = new Set(this.openComponents);
        }
    }
});
</script>

<style scoped>

details[open] summary .pi-chevron-down {
    transform: rotate(180deg);
}

.monitoring-description :deep(ul) {
    list-style: initial;
    padding-left: 18px;
}

.monitoring-description :deep(p) {
    margin-bottom: 5px;
}

</style>