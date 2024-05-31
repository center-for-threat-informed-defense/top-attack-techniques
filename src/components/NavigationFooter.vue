<template>
    <div class=" bg-ctid-navy text-white p-16 xl:py-20 xl:px-28 xl:flex">
        <div class=" xl:w-1/2 xl:pr-10">
            <h1>
                <router-link to="/">
                    <span class="text-ctid-light-purple">Top</span> ATT&amp;CK Techniques
                </router-link>
            </h1>
            <p class="my-4">The <a href="https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/"
                    target="_blank" class="underline hover:text-ctid-light-purple">Center for Threat-Informed
                    Defense</a> is a non-profit, privately funded research and development organization. Our mission is
                to advance the state of the art and the state of the practice in threat-informed defense globally.
            </p>
            <div class="md:flex">
                <img src="../assets/logo-horizontal-white.png" class="h-6 my-auto" />
                <div class="social-links">
                    <a href="mailto:ctid@mitre-engenuity.org?subject=Top%20ATT&CK%20Techniques" class="email"><i
                            class="pi pi-envelope"></i></a>
                    <a href="https://www.linkedin.com/showcase/center-for-threat-informed-defense/" target="blank"
                        class="linkedin"><i class="pi pi-linkedin"></i></a>
                    <a href="https://www.youtube.com/@mitreengenuity" target="blank" class="youtube">
                        <i class="pi pi-youtube"></i>
                    </a>
                    <a href="https://github.com/center-for-threat-informed-defense/mappings-explorer" target="blank"
                        class="github"><i class="pi pi-github"></i></a>
                </div>
            </div>
        </div>
        <div class="xl:w-1/2 xl:pl-10 xl:my-auto mt-8">
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
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
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
    @apply flex md:ml-8 md:my-0 my-4 gap-8
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