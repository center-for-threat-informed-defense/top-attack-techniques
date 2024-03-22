<template>
  <nav
    class="fixed bg-highlighter bg-mitre-navy text-white shadow-xl pt-1 w-full top-0"
  >
    <div class="flex mx-8">
      <h1 class="my-auto bold uppercase mr-auto">Top ATT&CK Techniques</h1>
      <div class="lg:visible invisible card">
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
      <button
        class="lg:invisible lg:w-0 w-6 visible"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      >
        <img src="../assets/menu.svg" />
      </button>
      <TieredMenu
        ref="menu"
        id="overlay_menu"
        :model="items"
        :popup="true"
        class="absolute right-4 top-4 shadow-md"
      >
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
      </TieredMenu>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TabMenu from "primevue/tabmenu";
import TieredMenu from "primevue/tieredmenu";
import { ref } from "vue";

export default defineComponent({
  components: { TabMenu, TieredMenu },
  data() {
    return {
      items: [
        { label: "Home", route: "/" },
        { label: "Calculator", route: "/calculator" },
        { label: "Methodology", route: "/methodology" },
        { label: "Help", route: "/help" },
      ],
      menu: ref(),
    };
  },
  methods: {
    getActiveIndex() {
      let route = this.$route.path;
      return this.items.findIndex(function (item) {
        return item.route === route;
      });
    },
    toggle(event) {
      this.menu.value.toggle(event);
    },
  },
});
</script>

<style scoped></style>
