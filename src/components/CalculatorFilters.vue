<template>
    <Accordion>
        <AccordionTab v-for="group in filterGroups" :key="group"
            :header="calculatorStore.filterProperties[group].label">
            <div class="checkbox-group">
                <Checkbox :model-value="filters[group].size === 0" :disabled="filters[group].size === 0"
                    binary :input-id="`select_all_${group}`" @update:model-value="selectAll(group)">
                </Checkbox>
                <label :for="`select_all_${group}`" class="my-auto">All {{ group.toUpperCase() }} Controls</label>
            </div>
            <Tree :value="treeNodes[group]" selection-mode="checkbox" :selection-keys="treeSelectionKeys[group]"
                :aria-label="calculatorStore.filterProperties[group].label"
                @update:selection-keys="onSelectionChange(group, $event)" />
        </AccordionTab>
    </Accordion>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";
import Tree from "primevue/tree";
import type { TreeNode } from "primevue/treenode";
import { useCalculatorStore } from "../stores/calculator.store";

const calculatorStore = useCalculatorStore();
type FilterGroup = keyof typeof calculatorStore.activeFilters;
type SelectionKeys = Record<string, { checked: boolean; partialChecked: boolean }>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const groupingMethods: Partial<Record<FilterGroup, (option: string) => string>> = {
    nist: (option) => option.slice(0, 2),
    cis: (option) => option.split(".")[0],
};

calculatorStore.setFilters();

const filters = computed(() => calculatorStore.activeFilters);
const filterGroups = computed(() => Object.keys(calculatorStore.filterProperties) as FilterGroup[]);

const treeNodes = computed(() => {
    const trees = {} as Record<FilterGroup, TreeNode[]>;
    for (const group of filterGroups.value) {
        const nodes: TreeNode[] = [];
        const parents = new Map<string, TreeNode>();
        const getGroup = groupingMethods[group];

        for (const option of calculatorStore.filterProperties[group].options) {
            const leaf: TreeNode = {
                key: `${group}:option:${option.id}`,
                label: option.name,
                leaf: true,
                data: { option: option.name },
            };
            if (!getGroup) {
                nodes.push(leaf);
                continue;
            }

            const label = getGroup(option.name);
            let parent = parents.get(label);
            if (!parent) {
                parent = { key: `${group}:group:${label}`, label, children: [] };
                parents.set(label, parent);
                nodes.push(parent);
            }
            parent.children!.push(leaf);
        }
        trees[group] = nodes;
    }
    return trees;
});

// Derive leaf and parent checkbox states from the store so navigation and
// external filter changes stay in sync without a second selection state.
const treeSelectionKeys = computed(() => {
    const selections = {} as Record<FilterGroup, SelectionKeys>;
    for (const group of filterGroups.value) {
        const keys: SelectionKeys = {};
        const visit = (node: TreeNode): void => {
            if (node.leaf) {
                if (filters.value[group].has(node.data.option)) {
                    keys[node.key!] = { checked: true, partialChecked: false };
                }
                return;
            }

            const children = node.children ?? [];
            children.forEach(visit);
            const checked = children.length > 0 && children.every((child) => keys[child.key!]?.checked);
            const partialChecked = !checked && children.some((child) => {
                const state = keys[child.key!];
                return state?.checked || state?.partialChecked;
            });
            if (checked || partialChecked) {
                keys[node.key!] = { checked, partialChecked };
            }
        };
        treeNodes.value[group].forEach(visit);
        selections[group] = keys;
    }
    return selections;
});

function selectAll(group: FilterGroup): void {
    filters.value[group].clear();
}

function onSelectionChange(group: FilterGroup, keys: SelectionKeys): void {
    const selected = new Set<string>();
    function visit(node: TreeNode): void {
        if (node.leaf && keys[node.key!]?.checked) {
            selected.add(node.data.option);
        }
        node.children?.forEach(visit);
    }
    treeNodes.value[group].forEach(visit);
    calculatorStore.updateActiveFilters({ ...filters.value, [group]: selected });
}
</script>
