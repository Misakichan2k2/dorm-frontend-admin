<script setup>
import Header from "./components/Header.vue";
import Navbar from "./components/Navbar.vue";
import { appLocalStorage } from "./utils";
import PopupMessage from "./components/PopupMessage.vue";
</script>

<template>
  <v-app>
    <PopupMessage />
    <Navbar v-if="appLocalStorage?.accessToken" />
    <v-main class="d-flex flex-column background">
      <Header v-if="appLocalStorage?.accessToken" />
      <div
        class="flex-grow-1 bg-grey-lighten-4"
        :class="{ content: appLocalStorage?.accessToken }"
      >
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.content {
  padding: 1rem;
}

.background {
  background: linear-gradient(#f6fcfe, #e6f5ff, #fff2fc);
}
</style>
