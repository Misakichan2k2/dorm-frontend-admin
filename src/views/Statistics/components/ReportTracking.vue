<!-- Statistics Sự cố -->

<script setup>
import { ref, computed, onMounted } from "vue";
import { exportToExcel } from "@/utils/exportExcel";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { STORE_STATISTICS } from "@/services/stores";

const { onActionGetReportStatistics, onActionGetBuildings } =
  STORE_STATISTICS.StoreStatistics();

const reportCategorys = [
  "Tất cả",
  "Sự cố điện",
  "Sự cố nước",
  "Hỏng thiết bị",
  "Khác",
];
const statuses = ["Tất cả", "Chờ xử lý", "Đang xử lý", "Đã xử lý"];
const months = computed(() => {
  return [
    { text: "Tất cả", value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      text: `Tháng ${i + 1}`,
      value: i + 1,
    })),
  ];
});
const years = computed(() => {
  const uniqueYears = new Set(
    reports.value.map((r) => new Date(r.createdAt).getFullYear())
  );
  const sortedYears = Array.from(uniqueYears).sort((a, b) => b - a);
  return ["Tất cả", ...sortedYears];
});

const filters = ref({
  building: "Tất cả",
  category: "Tất cả",
  status: "Tất cả",
  month: "Tất cả",
  year: "Tất cả",
});

const reports = ref([]);
const buildings = ref([]);

const fetchReportStatistics = async () => {
  await onActionGetReportStatistics().then((res) => {
    console.log(res);
    reports.value = res?.data;
  });
};

const fetchBuildings = () => {
  onActionGetBuildings()
    .then((res) => {
      buildings.value = res.data;
    })
    .catch(console.error);
};

const buildingOptions = computed(() => {
  const buildings = [...new Set(reports.value.map((i) => i.building))].sort();
  return [
    { text: "Tất cả", value: null },
    ...buildings.map((b) => ({ text: `Khu ${b}`, value: b })),
  ];
});

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

const filteredReports = computed(() => {
  return reports?.value?.filter((report) => {
    return (
      (!filters.value.building ||
        filters.value.building === "Tất cả" ||
        report.building === filters.value.building) &&
      (!filters.value.category ||
        filters.value.category === "Tất cả" ||
        report.category === filters.value.category) &&
      (!filters.value.status ||
        filters.value.status === "Tất cả" ||
        report.status === filters.value.status) &&
      (!filters.value.month ||
        filters.value.month === "Tất cả" ||
        new Date(report.createdAt).getMonth() + 1 ===
          Number(filters.value.month)) &&
      (!filters.value.year ||
        filters.value.year === "Tất cả" ||
        new Date(report.createdAt).getFullYear() === Number(filters.value.year))
    );
  });
});

const resetFilters = () => {
  filters.value = {
    building: "Tất cả",
    category: "Tất cả",
    status: "Tất cả",
    month: "Tất cả",
    year: "Tất cả",
  };
};

const chartLabels = reportCategorys.filter((c) => c !== "Tất cả");

const chartOptions = {
  labels: chartLabels,
  legend: { position: "bottom" },
};

const chartSeries = computed(() => {
  return chartLabels.map(
    (category) =>
      filteredReports.value.filter((r) => r.category === category).length
  );
});

// Table
const headers = [
  { title: "STT", key: "index", align: "center" },
  { title: "Mã RP", key: "reportId", align: "center" },
  { title: "Khu nhà", key: "building", align: "center" },
  { title: "Phòng", key: "room", align: "center" },
  { title: "Loại sự cố", key: "category", align: "center" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Thời gian báo", key: "createdAt", align: "center" },
];

const handleExport = () => {
  const data = filteredReports.value.map((item, index) => ({
    STT: index + 1,
    "Mã sự cố": item.reportId,
    "Khu nhà": item.building,
    Phòng: item.room,
    "Loại sự cố": item.category,
    "Trạng thái": item.status,
    "Thời gian báo": formatDate(item.createdAt),
  }));

  exportToExcel(data, "danh-sach-thong-ke-bao-cao-su-co");
};

onMounted(() => {
  fetchReportStatistics();
  fetchBuildings();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <v-card class="pa-5" elevation="0">
      <v-card class="pa-3 pt-0">
        <v-row class="mb-4" dense>
          <v-col cols="12" sm="3">
            <span>Khu nhà:</span>
            <v-select
              v-model="filters.building"
              :items="buildingOptions"
              item-title="text"
              item-value="value"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <!-- <v-col cols="12" sm="4">
          <span>Loại sự cố</span>
          <v-select
            v-model="filters.category"
            :items="reportCategorys"
            hide-details
            variant="outlined"
            density="compact"
          />
        </v-col> -->
          <v-col cols="12" sm="3">
            <span>Trạng thái:</span>
            <v-select
              v-model="filters.status"
              :items="statuses"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <span>Tháng:</span>
            <v-select
              v-model="filters.month"
              :items="months"
              item-title="text"
              item-value="value"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <span>Năm:</span>
            <v-select
              v-model="filters.year"
              :items="years"
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <!-- Nút làm mới -->
          <v-col cols="12" md="3" class="d-flex align-end justify-start">
            <v-btn
              color="cyan-darken-2"
              prepend-icon="mdi-filter-off-outline"
              @click="resetFilters"
              variant="outlined"
            >
              Làm mới
            </v-btn>
          </v-col>
        </v-row>

        <!-- Biểu đồ -->

        <apexchart
          type="pie"
          height="300"
          :options="chartOptions"
          :series="chartSeries"
        />
      </v-card>

      <!-- Table -->
      <v-card class="mt-5" style="background-color: #f5f5f5">
        <div class="pa-3 d-flex align-center justify-space-between">
          <div>
            <span class="text-blue-grey-darken-2 font-weight-bold">
              Tổng số bản ghi:
              <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
                filteredReports?.length
              }}</v-chip>
            </span>
          </div>
          <div class="d-flex justify-end pr-3">
            <v-btn
              color="teal-lighten-2"
              prepend-icon="mdi-file-excel"
              elevation="0"
              @click="handleExport"
            >
              Xuất File
            </v-btn>
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredReports"
          :items-per-page="5"
        >
          <template #item.index="{ index }">
            {{ index + 1 }}
          </template>

          <template #item.building="{ item }">
            Khu {{ item.building }}
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </v-container>
</template>
