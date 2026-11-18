<template>
    <Accordion>
        <AccordionTab v-for="group in filterGroups" :key="group"
            :header="calculatorStore.filterProperties[group].label">
            <div class="relative mb-3">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true" />
                <InputText v-model="searchQueries[group]" type="search"
                    class="w-full border border-solid border-ctid-navy rounded-none p-2 pl-10"
                    :placeholder="`Search ${calculatorStore.filterProperties[group].label}`"
                    :aria-label="`Search ${calculatorStore.filterProperties[group].label}`" />
            </div>
            <Tree :value="filteredTreeNodes[group]" selection-mode="checkbox" :selection-keys="treeSelectionKeys[group]"
                :aria-label="calculatorStore.filterProperties[group].label"
                :pt="{ toggler: { style: { order: 1, marginLeft: '0.5rem', marginRight: '0' } } }"
                @update:selection-keys="onSelectionChange(group, $event)">
                <template #togglericon="{ expanded }">
                    <i :class="['pi', expanded ? 'pi-minus' : 'pi-plus']" aria-hidden="true" />
                </template>
            </Tree>
        </AccordionTab>
    </Accordion>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Tree from "primevue/tree";
import InputText from "primevue/inputtext";
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

const searchQueries = reactive<Partial<Record<FilterGroup, string>>>({});

const filters = computed(() => calculatorStore.activeFilters);
const filterGroups = computed(() => Object.keys(calculatorStore.filterProperties) as FilterGroup[]);

const treeNodes = computed(() => {
    const trees = {} as Record<FilterGroup, TreeNode[]>;
    for (const group of filterGroups.value) {
        const nodes: TreeNode[] = [{
            key: `${group}:all`,
            label: `All ${group.toUpperCase()} Controls`,
            leaf: true,
            data: { type: "all" },
            styleClass: filters.value[group].size === 0 ? "filter-all-selected" : undefined,
        }];
        const parents = new Map<string, TreeNode>();
        const getGroup = groupingMethods[group];

        for (const option of calculatorStore.filterProperties[group].options) {
            const leaf: TreeNode = {
                key: `${group}:option:${option.id}`,
                label: option.name,
                leaf: true,
                data: { type: "option", option: option.name },
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

// Lenient filtering keeps every descendant when a parent label matches.
// Filter copies so searching never changes the full option tree or selections.
const filteredTreeNodes = computed(() => {
    const trees = {} as Record<FilterGroup, TreeNode[]>;
    for (const group of filterGroups.value) {
        const query = searchQueries[group]?.trim().toLocaleLowerCase() ?? "";
        const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.flatMap((node) => {
                if (node.data?.type === "all" || !query || node.label?.toLocaleLowerCase().includes(query)) {
                    return [node];
                }
                const children = filterNodes(node.children ?? []);
                return children.length ? [{ ...node, children }] : [];
            });
        };
        trees[group] = filterNodes(treeNodes.value[group]);
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
            if (node.data?.type === "all") {
                if (filters.value[group].size === 0) {
                    keys[node.key!] = { checked: true, partialChecked: false };
                }
                return;
            }
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

function onSelectionChange(group: FilterGroup, keys: SelectionKeys): void {
    const selected = new Set<string>();
    // A newly checked All node takes precedence over existing selections.
    // When All was already checked, allow newly checked specific options instead.
    if (keys[`${group}:all`]?.checked && filters.value[group].size > 0) {
        calculatorStore.updateActiveFilters({ ...filters.value, [group]: selected });
        return;
    }
    function visit(node: TreeNode): void {
        if (node.leaf && node.data?.type === "option" && keys[node.key!]?.checked) {
            selected.add(node.data.option);
        }
        node.children?.forEach(visit);
    }
    treeNodes.value[group].forEach(visit);
    calculatorStore.updateActiveFilters({ ...filters.value, [group]: selected });
}
</script>

<style scoped>
:deep(.filter-all-selected .p-checkbox) {
    opacity: 0.38;
}

:deep(.p-tree) {
    padding-left: 0;
    padding-top: 0;
}

:deep(.p-tree .p-treenode-children) {
    padding-left: 2rem;
}
</style>
