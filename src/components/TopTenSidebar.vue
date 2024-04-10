<template>
    <div>
        <ul>
            <li v-for="(n, i) in 10" :key="i" class="list-item" :class="{ 'active': activeItemId === i }">
                <div class="w-full" @click="this.$parent.setActiveIndex(i)">
                    {{ i + 1 }}.
                    <span class="ml-3 mr-1 highlight">{{ this.topTen[i].tid }}</span>
                    {{ this.topTen[i].name }}
                </div>
                <img v-if="i === activeItemId" :src="TrashSvgWhite" class="my-auto ml-auto"
                    @click="this.$parent.deleteTechnique(i)" />
                <img v-if="i !== activeItemId" :src="TrashSvg" class="my-auto ml-auto"
                    @click="this.$parent.deleteTechnique(i)" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TrashSvg from "../assets/trash.svg";
import TrashSvgWhite from "../assets/trash-white.svg";
import { useCalculatorStore } from "../stores/calculator.store";
export default defineComponent({
    props: {
        topTen: Array,
        activeItemId: Number,
    },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            TrashSvg,
            TrashSvgWhite,
        };
    },
    methods: {
    }
});
</script>

<style scoped>
.calculator-list .list-item {
    @apply border-mitre-black border-[1px] -mt-[1px] px-5 py-3 text-lg cursor-pointer flex uppercase font-medium
}

.calculator-list .list-item.active {
    @apply bg-mitre-navy text-white
}

.calculator-list .list-item.active .highlight {
    @apply text-mitre-light-purple
}

.list-item img {
    visibility: hidden;
}

.list-item:hover img {
    visibility: visible;
}

.list-item.active:hover img {
    fill: white;
}
</style>