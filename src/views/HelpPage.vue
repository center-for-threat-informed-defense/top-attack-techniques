<template>
  <section class="w-5/6 mx-auto py-20 text-center">
    <div class="pt-20">
      <h1 class="uppercase font-bold text-5xl">How to Use the Calculator</h1>
      <p class="pt-4 lg:w-3/4 mx-auto">Top ATT&amp;CK Techniques is your resource. Tell us about the challenges you face
        as
        a defender and let us offer some suggestions you may not have thought about. A Top ATT&amp;CK Techniques
        Specialist
        will address your query and respond promptly.</p>
    </div>
    <div class="container-row">
      <div class="lg:w-1/4">
        <div class="container">
          <div class="container-header">
            <h2>FAQs</h2>
          </div>
          <div class="container-body">
            <h3>Which ATT&amp;CK Version is the calculator using?</h3>
            <p>The calculator was built using ATT&amp;CK Version 14.0</p>
            <h3>Can the user import their own data?</h3>
            <p>The user cannot input their own data into the calculator. However, if you go to our Github you will find
              our excel document that you can manipulate for local use.</p>
          </div>
        </div>
        <div class="link-section">
          <h2>Got a problem? Feature Request?</h2>
          <a href="https://github.com/center-for-threat-informed-defense/top-attack-techniques/issues/new"
            target="_blank"><button class="btn-primary">
              Submit an Issue<i class="pi pi-external-link ml-8"></i></button></a>
          <h2>Want to learn more about this project?</h2>
          <button @click="$router.push({ path: '/methodology' })" class="btn-primary">Methodology Page</button>
          <a href="https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/" target="_blank">
            <button class="btn-primary">CTID Website <i class="pi pi-external-link ml-8"></i></button>
          </a>
        </div>
      </div>
      <div class="lg:w-3/4">
        <h2 class="font-bold text-left text-xl my-2">Step 1: score your system</h2>
        <div class="container">
          <div class="container-header">
            <h2>Filters</h2>
          </div>
          <div class="container-body lg:flex">
            <div class="block mr-6">
              <p>The filters section is located on the left side of the Calculator tab. Filters were created to allow
                the
                user to eliminate certain techniques that do not apply to their environment. Each filter is made up of
                components that we used to create our methodology. Each component is mapped to one or more ATT&CK
                technique. If a user deselects each component for a specific technique, then that technique will be
                removed from pool of available techniques. Each filter was implemented at the subtechnique level, if
                applicable.</p>
              <p>Within our Actionability component, we took into account different security controls and detection
                analytics to weigh each ATT&CK technique. Each of those controls and analytics are available to
                select/deselect, based on the user’s environment. For operating systems, many OSes can be
                selected/deselected, depending upon the environment. If only Windows machines exist, selecting Windows
                will remove all techniques that are that do not apply to Windows.</p>
              <p>For instance, under NIST 800-53, the Configuration Management (CM) Control Family is an option. If
                someone
                works in Incident Response, they might have less interest in ATT&CK techniques that can be mitigated
                with
                CM. Deselecting controls within CM will remove CM as a contributing factor in the final technique list.
                If
                a technique contains ONLY CM, that technique will be removed. If a technique contains CM AND others,
                that
                technique will remain, unless the other mitigations are deselected, as well. If no controls are
                selected,
                they will all be included by default. The same process was applied to the detection analytics, except
                due
                to the large volume, we grouped these by the repository from which they came, e.g. SigmaHQ.</p>
            </div>
            <img class="xl:w-1/3 lg:w-1/2 w-full" src="../assets/filter-img.png" />
          </div>
        </div>
        <div class="container">
          <div class="container-header">
            <h2>Monitoring Components</h2>
          </div>
          <div class="container-body lg:flex">
            <div class="block mr-6">
              <p>Monitoring components allow the user to modify the weight of each technique, based on their inputs.
                There
                are four levels of monitoring: None, Low, Medium, and High. Each level increases the weight of a
                technique
                by a fixed amount. The lower the level of monitoring, the higher the increase.
              </p>
              <p>
                There are five monitoring components: Network, Process, File, Cloud, and Hardware. These components came
                from data sources that are found in MITRE ATT&CK. By modifying a specific component, any technique that
                can be detected by that component will have its weight changed. If a user has a lower level of
                monitoring
                for a specific component, techniques that can be detected with that component will receive a higher
                weight. The same is true for the inverse: higher monitoring results in a lower weight. For instance,
                Windows Management Instrumentation (WMI) can be detected by process monitoring. If a user has a low
                amount
                of process monitoring, WMI will become a higher priority technique. This should help the user figure out
                if they have a gap that would prevent them from catching WMI usage.</p>
            </div>
            <img class="xl:w-1/3 lg:w-1/2 w-full" src="../assets/score-img.png" />
          </div>
        </div>
        <h2 class="font-bold text-left text-xl my-2">Step 2: Explore Your Results</h2>
        <div class="container">
          <div class="container-header">
            <h2>Your Top 10 List</h2>
          </div>
          <div class="container-body lg:flex">
            <div class="block mr-6">
              <p>After hitting "Generate Results,” a top 10 list will appear. For each technique in the list, all the
                information from the ATT&amp;CK page is populated. Users can see a description, subtechniques,
                mitigations,
                and detections.
              </p>
              <p>
                The trash can icon next to each technique allows the user to remove that technique from their top 10
                list,
                which will be replaced by the 11th technique.</p>
              <p>
                Users can download the entire ranked list of techniques in JSON format by clicking the “Download All Top
                Techniques” button.
              </p>
            </div>
            <img class="xl:w-1/2 lg:w-2/3 w-full" src="../assets/results-img.png" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {};
  },
});
</script>

<style scoped>
.container {
  @apply h-auto mb-4
}

.container-body,
.container-header {
  @apply py-4 px-6
}

.container-body h3 {
  @apply font-bold
}

.container-body p {
  @apply mb-2 text-sm
}

img {
  object-fit: contain;
  /* @apply xl:w-1/3 lg:w-1/2 w-full */
}

.link-section h2 {
  @apply font-bold text-left mt-4
}

.btn-primary {
  @apply my-2
}
</style>
