<template>
    <div>
        <Accordion :active-index="activeItemId">
            <AccordionTab v-for="(technique, i) of rankedList?.slice(0, results)" :key="i">
                <template #header>
                    <h2>
                        {{ i + 1 }}.
                        <span class="highlight">
                            {{ technique.tid }}
                        </span>
                        {{ technique.name }}
                    </h2>
                </template>
                <TopTenDetails :technique="technique" />
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import TopTenDetails from "./TopTenDetails.vue";
import { type Technique } from "@/data/DataTypes";

export default defineComponent({
    components: { Accordion, AccordionTab, TopTenDetails },
    props: {
        rankedList: {
            type: Array as PropType<Technique[]>,
            required: true
        },
        activeItemId: Number,
        results: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {};
    },
});
</script>

<style scoped></style>