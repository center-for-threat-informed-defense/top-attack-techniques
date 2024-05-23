<template>
  <section class="w-5/6 mx-auto pt-20 text-center">
    <div class="pt-20">
      <h1 class="uppercase font-bold text-5xl">Top 10 Lists</h1>
      <p class="pt-4">Explore the most prevalent techniques for different categories, determined by our ATT&CK analysts
      </p>
    </div>
  </section>
  <div class="my-8">
    <TabView>
      <TabPanel v-for="(list, index) in topTenLists" :key="list.id" :header="list.name">
        <div class="w-5/6 mx-auto">
          <h2 class=" text-center uppercase font-bold text-4xl mb-6 pt-8">{{ topTenLists[index].name }} Top 10 List
          </h2>
        </div>
        <top-ten-wrapper :rankedList="rankedList[index]" :allowDelete="false" />
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "@/stores/calculator.store";
import TopTenWrapper from "@/components/TopTenWrapper.vue";
import type { Technique } from "@/data/DataTypes";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

export default defineComponent({
  components: { TopTenWrapper, TabView, TabPanel },
  data() {
    return {
      calculatorStore: useCalculatorStore(),
      active: 0,
      topTenLists: [
        {
          id: "ransomware",
          name: "Ransomware",
          description: "This is the Ransomware list",
          techniques: [
            "T1486",
            "T1490",
            "T1027",
            "T1059",
            "T1036",
            "T1112",
            "T1047",
            "T1562.001",
            "T1204",
            "T1059.001",
          ]
        },
        // {
        //   id: "sector",
        //   name: "Sector",
        //   description: "This is the Sector list",
        //   techniques: []
        // },
        // {
        //   id: "black_cat",
        //   name: "BlackCat",
        //   description: "This is the BlackCat list",
        //   techniques: []
        // },
      ]
    };
  },
  computed: {
    rankedList() {
      const listsObj = [] as Array<Array<Technique>>
      for (const list of this.topTenLists) {
        listsObj.push(this.calculatorStore.getTopTenList(list.techniques))
      }
      return listsObj
    }
  },
});
</script>

<style scoped></style>
