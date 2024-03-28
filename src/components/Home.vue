<template>
  <div>
    <div class="hero">
      <div class="w-5/6 h-full mx-auto my-auto">
        <div class="title">
          <h1 class="">
            <span class="text-ctid-light-purple">Top</span> ATT&CK Techniques
          </h1>
          <div class="lg:w-6 lg:h-36 w-full h-1 bg-ctid-light-purple my-4"></div>
          <p class="my-auto">
            Top ATT&CK Techniques provides defenders with a systematic approach
            to prioritizing ATT&CK techniques. Our open methodology considers
            technique prevalence, common attack choke points, and actionability
            to enable defenders to focus on the ATT&CK techniques that are most
            relevant to their organization.
          </p>
        </div>
        <div class="mx-auto my-16 grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          <section-item title="Calculator"
            description="Use the criteria to score your system and click generate in order to see your personalized list of techniques. Our calculator will show you a customized list of the vulnerabilities you have and what you need to prioritize for your system."
            imgSrc="calculator.svg" link="calculator" />
          <section-item title="Top 10 lists"
            description="The Top Ransomware Technique List provides a starting point for defending against ransomware attacks and demonstrates how the Top ATT&CK Techniques methodology can be tailored to different use cases."
            imgSrc="list.svg" link="top-10-lists" />
          <section-item title="Methodology"
            description="Use the criteria to score your system and click generate in order to see your personalized list of techniques. Our calculator will show you a customized list of the vulnerabilities you have and what you need to prioritize for your system."
            imgSrc="book.svg" link="methodology" />
          <section-item title="Help"
            description="The Top Ransomware Technique List provides a starting point for defending against ransomware attacks and demonstrates how the Top ATT&CK Techniques methodology can be tailored to different use cases."
            imgSrc="help.svg" link="help" />
        </div>
      </div>
    </div>
    <section class="bg-gray-200 w-full py-20">
      <h2 class="text-center uppercase text-5xl font-medium">
        Want to Learn More?
      </h2>
      <div class="md:flex my-10 lg:w-2/3 w-5/6 mx-auto lg:gap-40 md: gap-10">
        <div class="md:w-1/2">
          <p>
            The methodology page outlines the rationale behind the ATT&CK
            technique scores and ranking. A technique’s score is calculated by
            the three core components: Actionability, Choke Point, and
            Prevalence.
          </p>
          <router-link to="/methodology">
            <button class="btn-primary w-full">Read the Methodology</button>
          </router-link>
        </div>
        <div class="md:w-1/2">
          <p>
            The help page contains the answers to common questions and issues
            that may pop up for users of Top ATT&CK Techniques. It also has a
            step by step guide to learning your top ATT&CK techniques customized
            to your system.
          </p>
          <router-link to="/help">
            <button class="btn-primary w-full">Check out the FAQ</button>
          </router-link>
        </div>
      </div>
    </section>
    <section class="h-96 w-full py-20">
      <h2 class="text-center text-5xl font-medium">
        Ransomware Top 10 Techniques
      </h2>
      <p class="text-center">content coming soon...</p>
    </section>
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
