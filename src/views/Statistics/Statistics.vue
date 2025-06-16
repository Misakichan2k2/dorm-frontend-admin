<script setup>
import { ref } from "vue";
import ReportTracking from "./components/ReportTracking.vue";
import RegistrationStatistics from "./components/RegistrationStatistics.vue";
import RevenueStatistics from "./components/RevenueStatistics.vue";

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
      <v-tab value="registration">Đơn yêu cầu đăng ký phòng</v-tab>
      <v-tab value="Income ">Doanh thu</v-tab>
      <v-tab value="report">Báo cáo sự cố </v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="registration">
          <RegistrationStatistics />
        </v-tabs-window-item>
        <v-tabs-window-item value="Income ">
          <RevenueStatistics />
        </v-tabs-window-item>
        <v-tabs-window-item value="report">
          <ReportTracking />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
