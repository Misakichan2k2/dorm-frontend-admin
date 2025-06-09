<script setup>
import { ref } from "vue";
import AllElectricityBill from "./components/AllElectricityBill.vue";

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
      <v-tab value="all">Danh sách hóa đơn điện</v-tab>
      <v-tab value="paid">Đã đóng</v-tab>
      <v-tab value="unpaid">Chưa đóng</v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="all">
          <AllElectricityBill :status-filter="'Tất cả'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="paid">
          <AllElectricityBill :status-filter="'Đã đóng'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="unpaid">
          <AllElectricityBill :status-filter="'Chưa đóng'" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
