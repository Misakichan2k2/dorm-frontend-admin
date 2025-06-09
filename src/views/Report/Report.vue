<script setup>
import { ref } from "vue";
import AllReport from "./components/AllReport.vue";

const selectedTab = ref("all");
</script>

<template>
  <v-card flat>
    <v-tabs
      v-model="selectedTab"
      bg-color="white"
      color="primary"
      center-active
      class="border-b-sm"
    >
      <v-tab value="all">Tất cả</v-tab>
      <v-tab value="pending">Chờ xử lý</v-tab>
      <v-tab value="inProgress">Đang xử lý</v-tab>
      <v-tab value="completed">Đã xử lý</v-tab>
      <v-tab value="canceled">Đã hủy</v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="all">
          <AllReport :statusFilter="'Tất cả'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="pending">
          <AllReport :statusFilter="'Chờ xử lý'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="inProgress">
          <AllReport :statusFilter="'Đang xử lý'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="completed">
          <AllReport :statusFilter="'Đã xử lý'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="canceled">
          <AllReport :statusFilter="'Đã hủy'" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
