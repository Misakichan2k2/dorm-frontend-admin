<!-- Thồng kê doanh thu -->

<template>
  <v-container>
    <v-card class="pa-4 mb-4" elevation="2">
      <v-row align="center" class="mb-2">
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedArea"
            :items="areaOptions"
            label="Chọn khu vực"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedYear"
            :items="yearOptions"
            label="Chọn năm"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedSemester"
            :items="semesterOptions"
            label="Chọn kỳ học"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            label="Chọn tháng"
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Tổng thu nhập</div>
          <div class="text-h5 font-weight-bold">
            {{ totalIncome.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Chi phí TB / SV</div>
          <div class="text-h5 font-weight-bold">
            {{ avgCostPerStudent.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Thu nhập bị thiếu</div>
          <div class="text-h5 font-weight-bold">
            {{ totalMissing.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="pa-4 mb-4">
      <h3 class="mb-4">Biểu đồ thu nhập và thiếu</h3>
      <apexchart
        width="100%"
        height="400"
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </v-card>

    <v-card elevation="2" class="pa-4">
      <h3 class="mb-4">Bảng dữ liệu thu nhập</h3>
      <v-data-table
        :items="filteredData"
        :headers="tableHeaders"
        class="elevation-1"
      >
        <template #item.income="{ item }">{{
          item.income.toLocaleString()
        }}</template>
        <template #item.missing="{ item }">{{
          item.missing.toLocaleString()
        }}</template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

const selectedArea = ref(null);
const selectedYear = ref(null);
const selectedSemester = ref(null);
const selectedMonth = ref(null);

const areaOptions = ["Khu A", "Khu B"];
const yearOptions = [2023, 2024, 2025];
const semesterOptions = ["Kỳ 1", "Kỳ 2", "Kỳ 3"];
const monthOptions = ["Tháng 1", "Tháng 2"];

const allData = [
  {
    year: 2024,
    semester: "Kỳ 1",
    month: "Tháng 1",
    area: "Khu A",
    income: 50000000,
    missing: 5000000,
  },
  {
    year: 2024,
    semester: "Kỳ 1",
    month: "Tháng 2",
    area: "Khu A",
    income: 60000000,
    missing: 4000000,
  },
  {
    year: 2024,
    semester: "Kỳ 1",
    month: "Tháng 1",
    area: "Khu B",
    income: 45000000,
    missing: 7000000,
  },
  {
    year: 2024,
    semester: "Kỳ 1",
    month: "Tháng 2",
    area: "Khu B",
    income: 55000000,
    missing: 3000000,
  },
];

const filteredData = computed(() => {
  return allData.filter((item) => {
    return (
      (!selectedArea.value || item.area === selectedArea.value) &&
      (!selectedMonth.value || item.month === selectedMonth.value) &&
      (!selectedYear.value || item.year === selectedYear.value) &&
      (!selectedSemester.value || item.semester === selectedSemester.value)
    );
  });
});

const months = computed(() => {
  const labels = new Set();
  filteredData.value.forEach((d) => labels.add(d.month));
  return [...labels];
});

const chartSeries = computed(() => {
  const income = [];
  const missing = [];

  months.value.forEach((month) => {
    const items = filteredData.value.filter((i) => i.month === month);
    const incomeSum = items.reduce((sum, i) => sum + i.income, 0);
    const missingSum = items.reduce((sum, i) => sum + i.missing, 0);
    income.push(incomeSum);
    missing.push(missingSum);
  });

  return [
    { name: "Thu nhập", data: income },
    { name: "Thu còn thiếu", data: missing },
  ];
});

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toLocaleString(),
  },
  xaxis: {
    categories: months.value,
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toLocaleString(),
    },
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString() + " đ",
    },
  },
}));

const totalIncome = computed(() => {
  return filteredData.value.reduce((sum, i) => sum + i.income, 0);
});

const totalMissing = computed(() => {
  return filteredData.value.reduce((sum, i) => sum + i.missing, 0);
});

const avgCostPerStudent = computed(() => {
  const studentCount = filteredData.value.length || 1;
  return Math.round(totalIncome.value / studentCount);
});

const tableHeaders = [
  { title: "Năm", value: "year" },
  { title: "Kỳ", value: "semester" },
  { title: "Tháng", value: "month" },
  { title: "Khu vực", value: "area" },
  { title: "Thu nhập", value: "income" },
  { title: "Thiếu", value: "missing" },
];
</script>
