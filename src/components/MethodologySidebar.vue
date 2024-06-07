<template>
    <div>
        <ul>
            <li v-for="(n, i) in 3" :key="i" class="list-item" :class="{ 'active': activeItemId === i }">
                <div class="w-full" @click="$emit('setActiveIndex', i)">
                    <span class="highlight">{{ this.methodologyList[i].name }}:</span>
                    <span class="details">{{ this.methodologyList[i].description }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        methodologyList: Array,
        activeItemId: Number,
    },
});
</script>

<style scoped>
.list-item {
    @apply border-ctid-black border-[1px] -mt-[1px] px-5 py-3 cursor-pointer text-left;
}

.list-item.active {
    @apply bg-ctid-navy text-white
}

.list-item.active .highlight {
    @apply text-ctid-light-purple
}

.highlight {
    @apply mr-1 uppercase font-medium text-lg;
    font-family: "Fira Sans Extra Condensed", sans-serif;
}

.list-item i {
    visibility: hidden;
}

.list-item:hover i {
    visibility: visible;
}
</style>