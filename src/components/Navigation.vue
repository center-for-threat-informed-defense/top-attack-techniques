<template>
  <nav
    class="bg-highlighter bg-mitre-primary-purple text-white shadow-xl pt-1 fixed w-full top-0"
  >
    <div class="flex justify-between mx-8">
      <h1 class="my-auto bold uppercase">Top ATT&CK Techniques</h1>
      <div class="card">
        <TabMenu :model="items" :active-index="getActiveIndex()">
          <template #item="{ item, props }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a :to="href" v-bind="props.action" @click="navigate">
                <span v-bind="props.label">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </TabMenu>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TabMenu from "primevue/tabmenu";

export default defineComponent({
  components: { TabMenu },
  data() {
    return {
      items: [
        { label: "Home", route: "/" },
        { label: "Calculator", route: "/calculator" },
        { label: "Methodology", route: "/methodology" },
        { label: "Help", route: "/help" },
      ],
    };
  },
  methods: {
    getActiveIndex() {
      let route = this.$route.path;
      return this.items.findIndex(function (item) {
        return item.route === route;
      });
    },
  },
});
</script>

<style scoped></style>
