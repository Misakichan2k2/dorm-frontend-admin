<script setup>
import { ref, onMounted } from "vue";
import { STORE_DASHBOARD } from "@/services/stores";
import ChartRegistrationBar from "./components/ChartRegistrationBar.vue";
import ChartIncomeLine from "./components/ChartIncomeLine.vue";

const {
  onActionGetReportStatistics,
  onActionGetRegistrationStatistics,
  onActionGetIncomeStatistics,
} = STORE_DASHBOARD.StoreDashboard();

const summaryCards = ref([
  {
    title: "Tổng số đơn",
    value: 0,
    icon: "mdi-clipboard-list",
    color: "blue",
  },
  {
    title: "Đơn chờ duyệt",
    value: 0,
    icon: "mdi-clock-outline",
    color: "orange",
  },
  {
    title: "Báo cáo chờ xử lý",
    value: 0,
    icon: "mdi-alert-circle-outline",
    color: "red",
  },
  {
    title: "Tổng thu nhập",
    value: 0,
    icon: "mdi-cash-multiple",
    color: "green",
  },
]);

const tableHeaders = [
  { title: "STT", value: "index", align: "center" },
  { title: "Tháng", value: "month", align: "center" },
  { title: "Năm", value: "year", align: "center" },
  { title: "Khu nhà", value: "building", align: "center" },
  { title: "Số đơn", value: "count", align: "center" },
  { title: "Thu nhập", value: "income", align: "center" },
  { title: "Loại doanh thu", value: "type", align: "center" },
];

const incomeChart = ref([]);
const chartData = ref([]);
const tableData = ref([]);

onMounted(async () => {
  // Đăng ký
  const regStats = await onActionGetRegistrationStatistics();
  const allData = regStats.data ?? [];
  chartData.value = allData;

  const total = allData.reduce((sum, item) => sum + (item.count || 0), 0);
  const pending = allData
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + (item.count || 0), 0);

  summaryCards.value[0].value = total;
  summaryCards.value[1].value = pending;

  // Doanh thu
  const incomeStats = await onActionGetIncomeStatistics();
  const incomeData = Array.isArray(incomeStats.data) ? incomeStats.data : [];
  incomeChart.value = incomeData;
  tableData.value = incomeData;

  const totalIncome = incomeData.reduce((sum, i) => sum + (i.income || 0), 0);
  summaryCards.value[3].value = totalIncome;

  // Báo cáo
  const reportStats = await onActionGetReportStatistics();
  summaryCards.value[2].value = reportStats.data?.pendingCount ?? 0;
});
</script>

<template>
  <v-container fluid>
    <!-- Thẻ tổng quan -->
    <v-row class="mb-4">
      <v-col cols="12" md="3" v-for="item in summaryCards" :key="item.title">
        <v-card class="pa-4 text-center" elevation="1">
          <v-icon size="30" :color="item.color">{{ item.icon }}</v-icon>
          <div class="text-subtitle-1 mt-2 font-weight-medium">
            {{ item.title }}
          </div>
          <div class="text-h5 font-weight-bold">
            {{ (item.value ?? 0).toLocaleString("vi-VN") }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Biểu đồ -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4" style="min-height: 300px">
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Thống kê đơn đăng ký theo tháng
          </div>
          <ChartRegistrationBar :data="chartData" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Thống kê doanh thu theo tháng
          </div>
          <ChartIncomeLine :data="incomeChart" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Bảng chi tiết -->
    <v-card elevation="2" class="mt-5" style="background-color: #f5f5f5">
      <div class="pa-3">
        <span class="text-blue-grey-darken-2 font-weight-bold">
          Tổng số bản ghi:
          <v-chip color="cyan-lighten-1" class="font-weight-bold">
            {{ tableData?.length }}
          </v-chip>
        </span>
      </div>

      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :items-per-page="5"
        item-value="id"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template #item.month="{ item }">
          Tháng {{ String(item.month).padStart(2, "0") }}
        </template>

        <template #item.building="{ item }"> Khu {{ item.building }} </template>

        <template #item.income="{ item }">
          <div class="text-center">
            {{ (item.income ?? 0).toLocaleString("vi-VN") }} ₫
          </div>
        </template>

        <template #item.type="{ item }">
          <v-chip
            size="small"
            :color="item.type === 'Đăng ký mới' ? 'green' : 'orange'"
            :text-color="item.type === 'Đăng ký mới' ? 'green' : 'orange'"
            variant="tonal"
          >
            {{ item.type }}
          </v-chip>
        </template>

        <template #item.count="{ item }"> {{ item.count }} đơn </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
