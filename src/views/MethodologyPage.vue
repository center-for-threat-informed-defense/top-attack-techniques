<template>
  <section class="w-5/6 mx-auto py-20 text-center">
    <div class="pt-20">
      <h1 class="uppercase font-bold text-5xl">Methodology</h1>
      <p class="pt-4 lg:w-3/4 mx-auto">Our top 10 lists of MITRE ATT&amp;CK techniques are designed to be actionable and
        driven
        by threat intelligence. The Center’s methodology is composed of three different components: Actionability,
        Choke Point, and Prevalence.</p>
    </div>
    <div class="container-row">
      <div class="lg:w-1/4">
        <div class="w-full h-auto lg:border-0 border-[1px] border-ctid-black mb-4">
          <MethodologySidebar :methodology-list="methodologyList" :active-item-id="activeItemId"
            @set-active-index="(i) => activeItemId = i" />
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
          <div class="container-body text-left">
            <p>{{ methodologyList[activeItemId].description }}</p>
            <component :is="methodologyList[activeItemId].section" />
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MethodologySidebar from "../components/MethodologySidebar.vue"
import ActionabilitySection from "../components/ActionabilitySection.vue"
import ChokePointSection from "../components/ChokePointSection.vue"
import PrevalenceSection from "../components/PrevalenceSection.vue"

export default defineComponent({
  components: { MethodologySidebar, ActionabilitySection, ChokePointSection, PrevalenceSection },
  data() {
    return {
      activeItemId: 0,
      methodologyList: [
        { name: "Actionability", description: "The opportunity for a defender to detect or mitigate against each ATT&CK technique based on publicly available analytics and security controls", section: "ActionabilitySection" },
        { name: "Choke Point", description: "A specific technique where many other techniques converge or diverge, and eliminating that specific technique would cause disruption to an adversary", section: "ChokePointSection" },
        { name: "Prevalence", description: "The frequency of which an attacker uses a specific ATT&CK technique over a period of time", section: "PrevalenceSection" },
      ]
    };
  },
});
</script>

<style scoped>
.container {
  @apply h-auto mb-4
}

.container-body,
.container-header {
  @apply py-3 px-6
}

.container-body h3 {
  @apply font-bold
}

img {
  object-fit: contain;
}
</style>
