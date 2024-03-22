<template>
  <div class="bg-mitre-navy">
    <div class="min-h-screen bg-mitre-navy text-white absolute top-0" id="hero">
      <div class="relative w-5/6 min-h-screen mx-auto">
        <div class="w-3/4 mx-auto mt-60 flex gap-6">
          <h1 class="uppercase text-6xl font-semibold my-auto">
            <span class="text-mitre-light-purple">Top</span> ATT&CK Techniques
          </h1>
          <div class="w-4 h-40 bg-mitre-light-purple my-4"></div>
          <p class="my-auto">
            Top ATT&CK Techniques provides defenders with a systematic approach
            to prioritizing ATT&CK techniques. Our open methodology considers
            technique prevalence, common attack choke points, and actionability
            to enable defenders to focus on the ATT&CK techniques that are most
            relevant to their organization.
          </p>
        </div>
        <div class="mx-auto my-16 flex gap-8">
          <section-item
            title="Calculator"
            description="Use the criteria to score your system and click generate in order to see your personalized list of techniques. Our calculator will show you a customized list of the vulnerabilities you have and what you need to prioritize for your system."
            imgSrc="calculator.svg"
            link="calculator"
          />
          <section-item
            title="Methodology"
            description="Use the criteria to score your system and click generate in order to see your personalized list of techniques. Our calculator will show you a customized list of the vulnerabilities you have and what you need to prioritize for your system."
            imgSrc="book.svg"
            link="methodology"
          />
          <section-item
            title="Help"
            description="The Top Ransomware Technique List provides a starting point for defending against ransomware attacks and demonstrates how the Top ATT&CK Techniques methodology can be tailored to different use cases."
            imgSrc="help.svg"
            link="help"
          />
          <section-item
            title="Top 10 lists"
            description="The Top Ransomware Technique List provides a starting point for defending against ransomware attacks and demonstrates how the Top ATT&CK Techniques methodology can be tailored to different use cases."
            imgSrc="list.svg"
            link="top-10-lists"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useExampleStore } from "../stores/example.store";
import SectionItem from "./SectionItem.vue";

export default defineComponent({
  components: { SectionItem },
  data() {
    return {
      exampleStore: useExampleStore(),
    };
  },
});
</script>

<style scoped></style>
