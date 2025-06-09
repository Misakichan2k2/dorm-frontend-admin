<!-- Statistics Sự cố -->

<script setup>
import { ref, computed } from "vue";
import * as XLSX from "xlsx";

const areas = ["Khu A", "Khu B", "Khu C"];
const issueTypes = ["Điện", "Nước", "Thiết bị", "Khác"];
const statuses = ["Chờ xử lý", "Đang xử lý", "Đã xử lý"];
const months = ["1", "2", "3", "4", "5", "6"];

const filters = ref({
  area: null,
  type: null,
  status: null,
  month: null,
});

const issues = ref([
  {
    id: "SC001",
    room: "A101",
    area: "Khu A",
    type: "Điện",
    status: "Chờ xử lý",
    date: "2025-04-01",
  },
  {
    id: "SC002",
    room: "B203",
    area: "Khu B",
    type: "Nước",
    status: "Đã xử lý",
    date: "2025-03-22",
  },
  {
    id: "SC003",
    room: "C305",
    area: "Khu C",
    type: "Thiết bị",
    status: "Đang xử lý",
    date: "2025-04-05",
  },
]);

const filteredIssues = computed(() => {
  return issues.value.filter((issue) => {
    return (
      (!filters.value.area || issue.area === filters.value.area) &&
      (!filters.value.type || issue.type === filters.value.type) &&
      (!filters.value.status || issue.status === filters.value.status) &&
      (!filters.value.month ||
        new Date(issue.date).getMonth() + 1 === Number(filters.value.month))
    );
  });
});

// Chart data
const chartOptions = {
  labels: issueTypes,
  legend: { position: "bottom" },
};
const chartSeries = computed(() => {
  const counts = issueTypes.map(
    (type) => filteredIssues.value.filter((i) => i.type === type).length
  );
  return counts;
});

// Table
const headers = [
  { title: "Mã SC", key: "id" },
  { title: "Phòng", key: "room" },
  { title: "Khu", key: "area" },
  { title: "Loại sự cố", key: "type" },
  { title: "Trạng thái", key: "status" },
  { title: "Ngày", key: "date" },
];

// Export Excel
const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredIssues.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SuCoBaoTri");
  XLSX.writeFile(wb, "SuCoBaoTri.xlsx");
};
</script>

<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-row align="center" class="mb-4" dense>
        <v-col cols="12" sm="3">
          <v-select
            v-model="filters.area"
            :items="areas"
            label="Khu"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="filters.type"
            :items="issueTypes"
            label="Loại sự cố"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="filters.status"
            :items="statuses"
            label="Trạng thái"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="filters.month"
            :items="months"
            label="Tháng"
            clearable
          />
        </v-col>
      </v-row>

      <!-- Biểu đồ -->
      <apexchart
        type="pie"
        height="300"
        :options="chartOptions"
        :series="chartSeries"
      />

      <!-- Bảng -->
      <v-data-table
        class="mt-6"
        :headers="headers"
        :items="filteredIssues"
        :items-per-page="5"
      />

      <!-- Xuất Excel -->
      <v-btn color="primary" class="mt-4" @click="exportExcel">
        Xuất Excel
      </v-btn>
    </v-card>
  </v-container>
</template>
