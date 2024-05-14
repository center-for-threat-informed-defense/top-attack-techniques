<template>
  <section class="w-5/6 mx-auto py-20 text-center">
    <div class="pt-20">
      <h1 class="uppercase font-bold text-5xl">Methodology</h1>
      <p class="pt-4 lg:w-3/4 mx-auto">A prioritized list of MITRE ATT&amp;CK techniques should be actionable and driven
        by threat intelligence. The Center’s methodology is composed of three different components - Actionability,
        Choke
        Point, and Prevalence. Algorithms for each component were created to determine a technique’s weight within a
        specific component, and then each component weight is combined to give an overall weight. </p>
    </div>
    <div class="container-row">
      <div class="lg:w-1/4">
        <div class="w-full h-auto lg:border-0 border-[1px] border-ctid-black mb-4">
          <MethodologySidebar :methodology-list="methodologyList" :active-item-id="activeItemId" />
        </div>
      </div>
      <div class="lg:w-3/4">
        <div class="calculator-details">
          <div class="container-header">
            <h2 class="text-left">
              <span>
                {{ methodologyList[activeItemId].name }}
              </span>
            </h2>
          </div>
          <div>
            <MethodologyDetails :activeItemId="activeItemId" :methodologyList="methodologyList" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MethodologySidebar from "../components/MethodologySidebar.vue"
import MethodologyDetails from "../components/MethodologyDetails.vue"

export default defineComponent({
  components: { MethodologySidebar, MethodologyDetails },
  data() {
    return {
      activeItemId: 0,
      methodologyList: [
        { name: "Actionability", description: "The opportunity for a defender to detect or mitigate against each ATT&CK technique based on publicly available analytics and security controls" },
        { name: "Choke Point", description: "A specific technique where many other techniques converge or diverge, and eliminating that specific technique would cause disruption to an adversary" },
        { name: "Prevalence", description: "The frequency of which an attacker uses a specific ATT&CK technique over a period of time" },
      ]
    };
  },
  methods: {
    setActiveIndex(index: number) {
      this.activeItemId = index
    },
  }
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
