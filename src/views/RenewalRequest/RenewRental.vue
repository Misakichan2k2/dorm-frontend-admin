<script setup>
import { ref, onMounted, watch } from "vue";
import AllRenewRental from "./components/AllRenew.vue";
import { STORE_RENEWAL } from "@/services/stores";

const { onActionGetRenewalByParams } = STORE_RENEWAL.StoreRenewal();

// Khai báo các tab và nhãn tương ứng
const tabs = [
  { value: "all", label: "Tất cả" },
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "approved", label: "Chấp nhận" },
  { value: "rejected", label: "Từ chối" },
  { value: "refunded", label: "Hoàn tiền" },
];

const selectedTab = ref("all");
const requests = ref([]);

const fetchData = async (status) => {
  const res = await onActionGetRenewalByParams({ status: status });
  requests.value = res.data;
  console.log(status);
  console.log(requests.value);
};

const onSearch = async (params) => {
  const res = await onActionGetRenewalByParams(params);
  requests.value = res.data;
};

onMounted(() => {
  fetchData(selectedTab.value);
});

watch(selectedTab, (newTab) => {
  fetchData(newTab);
});
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
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <AllRenewRental :data="requests" @onSearch="onSearch" />
    </v-card-text>
  </v-card>
</template>
