<template>
  <div>
    <div class="w-5/6 mx-auto pt-20 pb-10">
      <h1 class="text-center uppercase font-bold text-5xl">Your Top 10 Techniques </h1>
      <p class="text-center">System settings</p>
    </div>
    <div class="grid grid-cols-3 gap-4 w-5/6 mx-auto calculator-box auto-rows-fr">
      <div class="col-span-1 calculator-list">
        <ul>
          <li v-for="index in 10" :key="index" class="list-item" :class="{ 'active': activeItemId === index }"
            @click="setActiveIndex(index)">
            {{ index }}.
            {{ topTen[index].tid }}
            {{ topTen[index].name }}
          </li>
        </ul>
        <button class="btn-primary mt-4">Download List</button>
      </div>
      <div class="col-span-2 calculator-details h-full">
        <div class="container-header">
          <h2>
            {{ topTen[activeItemId].tid }}
            {{ topTen[activeItemId].name }}
          </h2>
        </div>
        <div class="container-body">
          <h3>Description</h3>
          <p>
            {{ topTen[activeItemId].description }}
          </p>
          <div v-if="topTen[activeItemId].subtechniques">
            <h3 class="mt-4">Subtechniques</h3>
            <Accordion>
              <AccordionTab v-for="subtechnique in topTen[activeItemId].subtechniques" :key="subtechnique.tid"
                :header="accordionName(subtechnique)">
                <h4>Subtechnique Description</h4>
                <p>{{ subtechnique.description }}</p>
                <h4 class="mt-4">Mitigations</h4>
                <ul class="list-disc ml-6">
                  <li v-for="mitigation of subtechnique.mitigations" :key="mitigation.mid">
                    <h5>{{ mitigation.mid }} - {{ mitigation.name }}</h5>
                    <p class="pl-2">{{ mitigation.description }}</p>
                  </li>
                </ul>
              </AccordionTab>
            </Accordion>
          </div>
          <h3 class="mt-4">Mitigations</h3>
          <ul class="list-disc ml-4">
            <li v-for="mitigation of topTen[activeItemId].mitigations" :key="mitigation.mid">
              <h4>{{ mitigation.mid }} - {{ mitigation.name }}</h4>
              <p class="pl-2">{{ mitigation.description }}</p>
            </li>
          </ul>
          <h3 class="mt-4">Detections</h3>
          <p>
            {{ topTen[activeItemId].detection }}
          </p>
          <h3 class="mt-4">Related</h3>
          <ul class="list-disc ml-6">
            <li>
              {{ topTen[activeItemId].url }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useExampleStore } from "../stores/example.store";
import { useCalculatorStore } from "../stores/calculator.store";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

export default defineComponent({
  components: { Accordion, AccordionTab },
  data() {
    return {
      exampleStore: useExampleStore(),
      calculatorStore: useCalculatorStore(),
      activeItemId: 1
    };
  },
  computed: {
    topTen() {
      this.calculatorStore.setTechniques()
      return this.calculatorStore.techniques
    }
  },
  methods: {
    setActiveIndex(index) {
      this.activeItemId = index
    },
    accordionName(technique) {
      return technique.tid + " " + technique.name
    }
  }
});
</script>

<style scoped></style>
