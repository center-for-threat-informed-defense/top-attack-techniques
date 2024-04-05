<template>
    <div>
        <Accordion :active-index="activeItemId">
            <AccordionTab v-for="(n, i) in 10" :key="i">
                <template #header>
                    <h2>
                        {{ i + 1 }}.
                        <span class="highlight">
                            {{ topTen[i].tid }}
                        </span>
                        {{ topTen[i].name }}
                    </h2>
                </template>
                <TopTenDetails :technique="topTen[i]" />
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import TopTenDetails from "./TopTenDetails.vue";

export default defineComponent({
    components: { Accordion, AccordionTab, TopTenDetails },
    props: {
        topTen: [],
        activeItemId: Number,
    },
    data() {
        return {};
    },
    methods: {
        accordionName(technique) {
            return technique.tid + " " + technique.name
        },
    }
});
</script>

<style scoped></style>