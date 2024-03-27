<template>
  <nav class="navbar">
    <div class="flex mx-8">
      <router-link to="/" class="mr-auto my-auto w-max">
        <h1>
          <span class="text-mitre-light-purple">Top</span> ATT&CK Techniques
        </h1>
      </router-link>
      <div class="lg:visible invisible card">
        <TabMenu :model="items" :active-index="getActiveIndex()">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :to="href" v-bind="props.action" @click="navigate">
                <span v-bind="props.label">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </TabMenu>
      </div>
      <div class="lg:invisible visible lg:w-0 w-min my-auto">
        <Button class="lg:w-0 w-6 my-auto cursor-pointer" type="button" @click="toggle" aria-haspopup="true"
          aria-controls="overlay_menu">
          <img src="../assets/menu.svg" />
        </Button>
        <TieredMenu :model="items" id="overlay_menu" ref="menu"
          class="absolute right-10 top-14 shadow-lg z-50 invisible">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :to="href" v-bind="props.action" @click="navigate">
                <span v-bind="props.label">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </TieredMenu>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TabMenu from "primevue/tabmenu";
import TieredMenu from "primevue/tieredmenu";
import Menu from "primevue/menu";
import Button from "primevue/button";
import { ref } from "vue";

export default defineComponent({
  components: { TabMenu, TieredMenu, Menu, Button },
  data() {
    return {
      items: [
        { label: "Home", route: "/" },
        { label: "Calculator", route: "/calculator" },
        { label: "Top Ten Lists", route: "/top-10-lists" },
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
    toggle() {
      const menu = document.getElementById("overlay_menu");
      if (menu.classList.contains("invisible")) {
        menu.classList.remove("invisible");
      } else {
        menu.classList.add("invisible");
      }
    },
  },
});
</script>

<style scoped></style>
