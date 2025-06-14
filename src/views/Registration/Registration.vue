<script setup>
import { ref, onMounted, watch } from "vue";
import AllRegistration from "./components/AllRegistration.vue";
import { STORE_REGISTRATION } from "@/services/stores";

const { onActionGetRegistrationsStatus } =
  STORE_REGISTRATION.StoreRegistration();

// Khai báo các tab và nhãn tương ứng
const tabs = [
  { value: "all", label: "Tất cả" },
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "approved", label: "Chấp nhận" },
  { value: "rejected", label: "Từ chối" },
  { value: "canceled", label: "Bị hủy" },
  { value: "refunded", label: "Hoàn tiền" },
];

const selectedTab = ref("all");
const registrationData = ref([]);

// Hàm load data theo trạng thái
const fetchData = async (status) => {
  const res = await onActionGetRegistrationsStatus({ status: status });
  registrationData.value = res.data;
};

const onSearch = async (params) => {
  const res = await onActionGetRegistrationsStatus(params);
  registrationData.value = res.data;
};

onMounted(() => {
  fetchData(selectedTab.value);
});

watch(selectedTab, (newTab) => {
  fetchData(newTab);
});
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
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <AllRegistration :data="registrationData" @onSearch="onSearch" />
    </v-card-text>
  </v-card>
</template>
