<template>
    <div class="container-body">
        <h3>Description</h3>
        <div id="description" v-html="this.description"></div>
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
                    <div id="description" v-html="getDescription(subtechnique)"></div>
                    <h4 class="mt-4">Mitigations</h4>
                    <ul class="mitigations">
                        <li v-for="mitigation of subtechnique.mitigations" :key="mitigation.mid">
                            <h5>{{ mitigation.mid }} - {{ mitigation.name }}</h5>
                            <p>{{ mitigation.description }}</p>
                        </li>
                    </ul>
                </AccordionTab>
            </Accordion>
        </div>
        <h3 class="mt-4">Mitigations</h3>
        <ul class="mitigations">
            <li v-for="mitigation of this.technique.mitigations" :key="mitigation.mid">
                <h4>
                    {{ mitigation.mid }} - {{ mitigation.name }}
                </h4>
                <p>{{ mitigation.description }}</p>
            </li>
        </ul>
        <h3 class="mt-4">Detections</h3>
        <p>
            {{ this.technique.detection }}
        </p>
        <h3 class="mt-4">Related</h3>
        <ul>
            <li>
                <a class=" text-mitre-blue hover:underline" target="_blank" :href="this.technique.url">
                    {{ this.technique.url }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { marked } from 'marked';

export default defineComponent({
    components: { Accordion, AccordionTab },
    props: {
        technique: {}
    },
    data() {
        return {};
    },
    computed: {
        description() {
            return marked(this.technique.description)
        }
    },
    methods: {
        getDescription(technique) {
            return marked(technique.description)
        }
    }
});
</script>

<style scoped>
.container-body {
    @apply py-4 px-6 overflow-scroll
}

.container-body h3 {
    @apply uppercase font-bold text-lg
}

.container-body h4 {
    @apply uppercase font-bold
}

ul {
    @apply list-disc ml-6
}

ul p {
    @apply pl-4
}

.mitigations h4, .mitigations h5 {
    @apply uppercase font-bold
}
</style>