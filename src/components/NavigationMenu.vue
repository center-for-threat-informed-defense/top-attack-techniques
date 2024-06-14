<template>
  <nav class="navbar">
    <div class="flex mx-8">
      <router-link to="/" class="mr-auto my-auto w-max">
        <img v-bind:src="Logo" class="h-5" alt="Top Attack Techniques" />
      </router-link>
      <div class="lg:inline-block hidden card">
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
      <div class=" lg:hidden inline-block w-max my-auto">
        <MenuBar :model="items" id="overlay_menu" ref="menu" class=" text-white z-50  p-menubar-mobile">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :to="href" v-bind="props.action" @click="navigate">
                <span v-bind="props.label">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </MenuBar>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TabMenu from "primevue/tabmenu";
import MenuBar from "primevue/menubar";
import Logo from "@/assets/logo-line-white.svg";

export default defineComponent({
  components: { TabMenu, MenuBar },
  data() {
    return {
      Logo,
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
      const route = this.$route.path;
      return this.items.findIndex(function (item) {
        return item.route.split("/")[1] === route.split("/")[1];
      });
    },
  },
});
</script>

<style scoped>
/* Navigation */
.navbar {
  @apply fixed bg-ctid-navy text-white pt-1 w-full top-0 z-50
}

.navbar h1 {
  @apply my-auto font-medium text-xl uppercase w-max
}
</style>
