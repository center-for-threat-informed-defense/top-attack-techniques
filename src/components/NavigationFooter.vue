<template>
    <div class="bg-ctid-navy text-white">
        <div class="xl:max-w-[1536px] mx-auto p-16 xl:py-20 lg:px-32 2xl:px-16 xl:flex">
            <div class=" xl:w-1/2 xl:pr-10">
                <h1>
                    <router-link to="/">
                        <img v-bind:src="Logo" class="h-6" alt="Top Attack Techniques" />
                    </router-link>
                </h1>
                <p class="my-4">
                    The <a href="https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/"
                        target="_blank" class="underline hover:text-ctid-light-purple">Center for Threat-Informed
                        Defense</a> is a non-profit, privately funded research and development organization. Our
                    mission is to advance the state of the art and the state of the practice in threat-informed defense
                    globally.
                </p>
                <div class="md:flex">
                    <img src="../assets/ctid-logo-horizontal-white.png" class="h-6 my-auto"
                        alt="Center for Threat Informed Defense" />
                    <div class="social-links">
                        <a href="mailto:ctid@mitre-engenuity.org?subject=Top%20ATT&amp;CK%20Techniques"
                            aria-label="email ctid" class="email">
                            <i class="pi pi-envelope"></i>
                        </a>
                        <a href="https://www.linkedin.com/showcase/center-for-threat-informed-defense/" target="blank"
                            aria-label="ctid on linkedin" class="linkedin">
                            <i class="pi pi-linkedin"></i>
                        </a>
                        <a href="https://www.youtube.com/@mitreengenuity" target="blank" class="youtube"
                            aria-label="mitre engenuity youtube">
                            <i class="pi pi-youtube"></i>
                        </a>
                        <a href="https://github.com/center-for-threat-informed-defense/" target="blank" class="github"
                            aria-label="ctid github">
                            <i class="pi pi-github"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="xl:max-w-1/2 xl:pl-10 xl:my-auto mt-8">
                <h2 class="mt-8">Related Projects</h2>
                <div class="internal-links">
                    <div v-for="(item, i) of externalProjects" :key="item.label" class="flex">
                        <a :href="item.route" target="blank"
                            class="hover:underline hover:text-ctid-light-purple md:mx-0 mx-2 my-auto">{{
                            item.label }}</a>
                        <div v-if="i !== externalProjects.length - 1"
                            class="md:block hidden mx-4 2xl:mx-8 w-[3px] h-full bg-ctid-light-purple"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "@/assets/logo-line-white.svg";

export default defineComponent({
    data() {
        return {
            Logo,
            externalProjects: [
                { label: "Attack Flow", route: "https://center-for-threat-informed-defense.github.io/attack-flow/" },
                { label: "M3TID", route: "https://center-for-threat-informed-defense.github.io/m3tid/" },
                { label: "Mappings Explorer", route: "https://center-for-threat-informed-defense.github.io/mappings-explorer/" },
                { label: "Summiting the Pyramid", route: "https://center-for-threat-informed-defense.github.io/summiting-the-pyramid/" },
            ]
        };
    },
});
</script>

<style scoped>
h1 {
    @apply text-3xl font-medium
}

h2 {
    @apply text-xl font-semibold
}

.social-links {
    @apply flex md:ml-8 md:my-0 my-4 gap-6 xl:gap-4 2xl:gap-8
}

.internal-links {
    @apply md:flex my-4 uppercase;
    font-family: "Fira Sans Extra Condensed", sans-serif;
}

.internal-links div::before {
    @apply text-ctid-light-purple mr-2 block md:hidden text-lg;
    content: "-";
}

.social-links a {
    @apply bg-ctid-light-purple hover:bg-white text-ctid-navy rounded-full flex h-8 w-8 my-auto text-center;
}

.social-links i {
    @apply m-auto;

}
</style>