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
                    <a href="mailto:ctid@mitre-engenuity.org?subject=Mappings%20Explorer" class="email"><i
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
            <h2>Explore</h2>
            <div class="internal-links">
                <div v-for="(item, i) of items" :key="item.label" class="flex">
                    <router-link :to="item.route" class="hover:underline hover:text-ctid-light-purple md:mx-0 mx-2">{{
                    item.label
                }}</router-link>
                    <div v-if="i !== items.length - 1"
                        class="md:block hidden mx-4 2xl:mx-8 w-1 h-full bg-ctid-light-purple"></div>
                </div>
            </div>
            <!-- <h2>Learn More</h2>
            <div class="internal-links">
                <div v-for="(item, i) of items" :key="item.label" class="flex">
                    <router-link :to="item.route">{{ item.label }}</router-link>
                    <div v-if="i !== items.length - 1" class="mx-4 2xl:mx-8 w-1 h-full bg-ctid-light-purple"></div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            items: [
                { label: "Home", route: "/" },
                { label: "Calculator", route: "/calculator" },
                { label: "Top Ten Lists", route: "/top-10-lists" },
                { label: "Methodology", route: "/methodology" },
                { label: "Help", route: "/help" },
            ],
        };
    },
    methods: {
        getActiveIndex() {
            const route = this.$route.path;
            return this.items.findIndex(function (item) {
                return item.route.split("/")[1] === route.split("/")[1];
            });
        },
    },
});
</script>

<style scoped>
h1 {
    @apply text-3xl font-medium
}

h2 {
    @apply text-xl font-medium
}

.social-links {
    @apply flex md:ml-8 md:my-0 my-4 gap-8
}

.internal-links {
    @apply md:flex my-4;
}

.internal-links div::before {
    @apply text-ctid-light-purple mr-2 block md:hidden text-lg;
    content: "-";
}

/* .internal-links div::after {
    @apply text-ctid-light-purple mx-8;
    content: "|";
} */

.social-links a {
    @apply bg-ctid-light-purple hover:bg-white text-ctid-navy rounded-full flex h-8 w-8 my-auto;

}

.social-links i {
    @apply m-auto;

}
</style>