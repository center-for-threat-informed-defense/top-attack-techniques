<template>
    <div>
        <ul>
            <li v-for="(n, i) in 10" :key="i" class="list-item" :class="{ 'active': activeItemId === i }">
                <div class="w-full" @click="this.$parent.setActiveIndex(i)">
                    {{ i + 1 }}.
                    <span class="ml-3 mr-1 highlight">{{ this.topTen[i].tid }}</span>
                    {{ this.topTen[i].name }}
                </div>
                <button @click="this.$parent.deleteTechnique(i)">
                    <i class="pi pi-trash"></i>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
export default defineComponent({
    props: {
        topTen: Array,
        activeItemId: Number,
    },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
        };
    },
    methods: {
    }
});
</script>

<style scoped>
.calculator-list .list-item {
    @apply border-ctid-black border-[1px] -mt-[1px] px-5 py-3 text-lg cursor-pointer flex uppercase font-medium;
    font-family: "Fira Sans Extra Condensed", sans-serif;

}

.calculator-list .list-item.active {
    @apply bg-ctid-navy text-white
}

.calculator-list .list-item.active .highlight {
    @apply text-ctid-light-purple
}

.list-item i {
    visibility: hidden;
}

.list-item:hover i {
    visibility: visible;
}
</style>