<template>
    <div class="container-body">
        <h3>Description</h3>
        <p>
            {{ this.technique.description }}
        </p>
        <div v-if="this.technique.subtechniques.length > 0" class="subtechniques">
            <h3 class="mt-4">Subtechniques</h3>
            <Accordion>
                <AccordionTab v-for="subtechnique in this.technique.subtechniques" :key="subtechnique.tid">
                    <template #header>
                        <h4>
                            <span class="highlight">
                                {{ subtechnique.tid }}
                            </span>
                            {{ subtechnique.name }}
                        </h4>
                    </template>
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
            <li v-for="mitigation of this.technique.mitigations" :key="mitigation.mid">
                <h4>{{ mitigation.mid }} - {{ mitigation.name }}</h4>
                <p class="pl-2">{{ mitigation.description }}</p>
            </li>
        </ul>
        <h3 class="mt-4">Detections</h3>
        <p>
            {{ this.technique.detection }}
        </p>
        <h3 class="mt-4">Related</h3>
        <ul class="list-disc ml-6">
            <li>
                {{ this.technique.url }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

export default defineComponent({
    components: { Accordion, AccordionTab, },
    props: {
        technique: {}
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