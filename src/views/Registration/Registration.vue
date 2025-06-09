<script setup>
import { ref } from "vue";
import AllRegistration from "./components/AllRegistration.vue";

const selectedTab = ref("all");
</script>

<template>
  <!-- <div class="d-flex justify-end mb-3">
    <v-btn
      color="teal-lighten-2"
      prepend-icon="mdi-file-excel"
      @click="handleExport"
    >
      Xuất File
    </v-btn>
  </div> -->

  <v-card flat>
    <v-tabs
      v-model="selectedTab"
      bg-color="white"
      color="primary"
      center-active
      class="border-b-sm"
    >
      <v-tab value="all">Tất cả</v-tab>
      <v-tab value="unpaid">Chưa thanh toán</v-tab>
      <v-tab value="pending">Chờ xử lý</v-tab>
      <v-tab value="Accepted">Chấp nhận</v-tab>
      <v-tab value="Rejected">Từ chối</v-tab>
      <v-tab value="Refunded">Hoàn tiền</v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="all">
          <AllRegistration :statusFilter="'Tất cả'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="unpaid">
          <AllRegistration :statusFilter="'Chưa thanh toán'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="pending">
          <AllRegistration :statusFilter="'Chờ xử lý'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="accepted">
          <AllRegistration :statusFilter="'Chấp nhận'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="rejected">
          <AllRegistration :statusFilter="'Từ chối'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="refunded">
          <AllRegistration :statusFilter="'Hoàn tiền'" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
