<template>
    <div class="container-body">
        <h3>Description</h3>
        <div class="description" v-html="getMarkdown(technique.description)"></div>
        <div v-if="technique.subtechniques.length > 0" class="subtechniques">
            <h3 class="mt-4">Subtechniques</h3>
            <Accordion class="mt-2">
                <AccordionTab v-for="subtechnique in technique.subtechniques" :key="subtechnique.tid">
                    <template #header>
                        <h4>
                            <span class="highlight">
                                {{ subtechnique.tid }}
                            </span>
                            {{ subtechnique.name }}
                        </h4>
                    </template>
                    <h4>Subtechnique Description</h4>
                    <div class="description" v-html="getMarkdown(subtechnique.description)"></div>
                    <div v-if="subtechnique.mitigations.length > 0">
                        <h4 class="mt-4">Mitigations</h4>
                        <ul class="mitigations">
                            <li v-for="mitigation of subtechnique.mitigations" :key="mitigation.mid">
                                <h5>{{ mitigation.mid }} - {{ mitigation.name }}</h5>
                                <div class="description" v-html="getMarkdown(mitigation.description)"></div>
                            </li>
                        </ul>
                    </div>
                    <div v-if="subtechnique.detection">
                        <h4 class="mt-4">Detections</h4>
                        <div class="description" v-html="getMarkdown(subtechnique.detection)"></div>
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
        <div v-if="technique.mitigations.length > 0">
            <h3 class="mt-4">Mitigations</h3>
            <ul class="mitigations">
                <li v-for="mitigation of technique.mitigations" :key="mitigation.mid">
                    <h4>
                        {{ mitigation.mid }} - {{ mitigation.name }}
                    </h4>
                    <div class="description" v-html="getMarkdown(mitigation.description)"></div>
                </li>
            </ul>
        </div>
        <div v-if="technique.detection">
            <h3 class="mt-4">Detections</h3>
            <div class="description" v-html="getMarkdown(technique.detection)"></div>
        </div>
        <div v-if="technique.url">
            <h3 class="mt-4">References</h3>
            <ul>
                <li>
                    <a class=" text-ctid-blue hover:underline" target="_blank" :href="technique.url">
                        {{ technique.url }}
                    </a>
                </li>
            </ul>
        </div>
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
    methods: {
        getMarkdown(text: string) {
            if (!text) {
                return ""
            }
            const t = marked(text)
            return t.replaceAll("<a ", '<a target="_blank" ')
        }
    }
});
</script>

<style scoped>
.container-body {
    @apply py-4 px-6
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