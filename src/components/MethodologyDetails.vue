<template>
    <div class="container-body text-left">
        <p>{{ methodologyList[activeItemId].description }}</p>
        <div v-if="activeItemId === 0">
            <h3>Why we include actionability</h3>
            <p>It’s important to understand how a defender can take action to protect themselves against a specific
                technique. Depending on the number of publicly available detections and mitigations per technique, this
                allows the defender the ability respond to an incident faster, or to prevent the incident all together.
            </p>
            <h3>Finding Actionability</h3>
            <p>We broke down actionability into two categories: detections and mitigations.

            </p>
            <p>For detections, we reviewed several publicly available analytic resources and mapped each of them to
                ATT&CK. The repositories we used were <a href="https://car.mitre.org/" target="_blank">MITRE’s Cyber
                    Analytic Repository</a>, <a href="https://github.com/elastic/detection-rules"
                    target="_blank">Elastic</a>, <a href="https://github.com/SigmaHQ/sigma" target="_blank">Sigma HQ's
                    rules</a>, and <a href="https://research.splunk.com/detections/" target="_blank">Splunk
                    Detections</a>.

            </p>
            <p>For mitigations, we reviewed security controls from two publicly available repositories and mapped each
                of them to ATT&CK. The repositories we used were <a href="https://www.cisecurity.org/controls"
                    target="_blank">CIS Critical Security Controls</a> and <a
                    href="https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" target="_blank">NIST 800-53 Security
                    Controls</a>.
            </p>
            <p>We then made a total count of all detections and mitigations available for each ATT&CK technique.
                Techniques that have a greater number of detections and mitigations are weighted more heavily than those
                with a lower number. If a technique has a limited number of ways to detect or protect against it, we
                believe defending against those techniques will provide diminishing returns and more attention should be
                placed elsewhere.

            </p>
            <p>For instance, T1014: Rootkit has zero detections or mitigations in the repositories that we referenced.
                Since rootkits are better identified by heuristics and forensics than analytics and security controls, a
                disproportionate number of resources would need to be used to detect or prevent against them. Those
                resources could be better allocated to defending against techniques that are more easily detected, but
                just as dangerous.

            </p>
            <p>There are a few limitations to this methodology. First, we did not search each repository to see if each
                analytic or control was still valid or if there were duplicates. Second, we did not differentiate for
                analytics that are similarly related. For instance, an analytic looking for Powershell executing an
                encoded command and one for Powershell executing Mimikatz would both count for T1053 (command and
                scripting interpreter). We tried to account for these limitations by setting upper bounds. After a
                certain point, the value of each additional analytic and control does not provide the same value to the
                defender. Because of this, any detections and controls over 100 and 55, respectively, do not change the
                weighted list.

            </p>
            <p>Finally, we recognize that for some, defending against rootkits, or other similarly stealthy techniques,
                is just as, if not more, important than other techniques. We tried to account for this by allowing users
                to choose which analytics and controls should be included in the weighted list.

            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        methodologyList: Array,
        activeItemId: 0,
    },
    data() {
        return {

        };
    },
});
</script>

<style scoped>
.container-body {
    @apply py-4 px-6
}

.container-body h3 {
    @apply uppercase font-bold text-lg
}

.container-body h4 {
    @apply uppercase font-bold
}

ul {
    @apply list-disc ml-6
}

ul p {
    @apply pl-4
}

.mitigations h4, .mitigations h5 {
    @apply uppercase font-bold
}

a {
    @apply text-ctid-blue hover:underline
}

p {
    @apply mt-2
}
</style>