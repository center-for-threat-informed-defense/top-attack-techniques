<template>
  <div></div>
  <div class="" id="hero">
    <div class="lg:flex w-5/6 mx-auto h-full">
      <div class="lg:w-1/2 lg:my-auto mt-20 mb-10 lg:pr-10">
        <h1 class="uppercase text-6xl font-semibold">
          <span class="text-mitre-light-purple">Top</span> ATT&CK Techniques
        </h1>
        <hr class="border-2 border-mitre-light-purple my-4" />
        <p>
          Top ATT&CK Techniques provides defenders with a systematic approach to
          prioritizing ATT&CK techniques. Our open methodology considers
          technique prevalence, common attack choke points, and actionability to
          enable defenders to focus on the ATT&CK techniques that are most
          relevant to their organization.
        </p>
      </div>
      <div class="lg:w-1/2 my-auto lg:pl-10 gap-10">
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
          imgSrc="list.svg"
          link="help"
        />
      </div>
    </div>
    <div></div>
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
