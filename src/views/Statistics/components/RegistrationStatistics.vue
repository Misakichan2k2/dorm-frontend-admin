<template>
  <v-container>
    <v-card class="pa-4 mb-4" elevation="2">
      <v-row align="center" class="mb-2">
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedArea"
            :items="areaOptions"
            label="Chọn khu vực"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedYear"
            :items="yearOptions"
            label="Chọn năm"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedSemester"
            :items="semesterOptions"
            label="Chọn kỳ học"
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Tổng số đơn đăng ký</div>
          <div class="text-h5 font-weight-bold">
            {{ totalRegistrations.toLocaleString() }} đơn
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Tỷ lệ chuyển đổi</div>
          <div class="text-h5 font-weight-bold">{{ conversionRate }}%</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="text-h6">Trạng thái đơn</div>
          <div class="text-subtitle-1">Được duyệt: {{ approvedCount }}</div>
          <div class="text-subtitle-1">Bị từ chối: {{ rejectedCount }}</div>
          <div class="text-subtitle-1">Chờ duyệt: {{ pendingCount }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="pa-4 mb-4">
      <h3 class="mb-4">Biểu đồ đơn đăng ký theo khu vực và kỳ học</h3>
      <apexchart
        width="100%"
        height="400"
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </v-card>

    <v-card elevation="2" class="pa-4">
      <h3 class="mb-4">Bảng dữ liệu đơn đăng ký</h3>
      <v-data-table
        :items="filteredData"
        :headers="tableHeaders"
        class="elevation-1"
      >
        <template #item.count="{ item }">{{
          item.count.toLocaleString()
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

const areaOptions = ["Khu A", "Khu B"];
const yearOptions = [2023, 2024, 2025];
const semesterOptions = ["Kỳ 1", "Kỳ 2"];

const allData = [
  {
    year: 2024,
    semester: "Kỳ 1",
    area: "Khu A",
    count: 120,
    status: "Đã duyệt",
    realStay: true,
  },
  {
    year: 2024,
    semester: "Kỳ 2",
    area: "Khu A",
    count: 90,
    status: "Bị từ chối",
    realStay: false,
  },
  {
    year: 2024,
    semester: "Kỳ 1",
    area: "Khu B",
    count: 100,
    status: "Chờ duyệt",
    realStay: false,
  },
  {
    year: 2024,
    semester: "Kỳ 2",
    area: "Khu B",
    count: 110,
    status: "Đã duyệt",
    realStay: true,
  },
];

const filteredData = computed(() => {
  return allData.filter((item) => {
    return (
      (!selectedArea.value || item.area === selectedArea.value) &&
      (!selectedYear.value || item.year === selectedYear.value) &&
      (!selectedSemester.value || item.semester === selectedSemester.value)
    );
  });
});

const totalRegistrations = computed(() => {
  return filteredData.value.reduce((sum, i) => sum + i.count, 0);
});

const approvedCount = computed(() => {
  return filteredData.value
    .filter((i) => i.status === "Đã duyệt")
    .reduce((sum, i) => sum + i.count, 0);
});

const rejectedCount = computed(() => {
  return filteredData.value
    .filter((i) => i.status === "Bị từ chối")
    .reduce((sum, i) => sum + i.count, 0);
});

const pendingCount = computed(() => {
  return filteredData.value
    .filter((i) => i.status === "Chờ duyệt")
    .reduce((sum, i) => sum + i.count, 0);
});

// Tỷ lệ chuyển đổi chỉ dựa trên số đơn "Đã duyệt"
const conversionRate = computed(() => {
  if (totalRegistrations.value === 0) return 0;
  return ((approvedCount.value / totalRegistrations.value) * 100).toFixed(2);
});

const areaLabels = computed(() => {
  const labels = new Set();
  filteredData.value.forEach((d) => labels.add(d.area));
  return [...labels];
});

const chartSeries = computed(() => {
  const series = [];
  semesterOptions.forEach((sem) => {
    const data = [];
    areaLabels.value.forEach((area) => {
      const found = filteredData.value.find(
        (i) => i.area === area && i.semester === sem
      );
      data.push(found ? found.count : 0);
    });
    series.push({ name: sem, data });
  });
  return series;
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
  },
  xaxis: {
    categories: areaLabels.value,
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toLocaleString(),
    },
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString() + " đơn",
    },
  },
}));

const tableHeaders = [
  { title: "Năm", value: "year" },
  { title: "Kỳ học", value: "semester" },
  { title: "Khu vực", value: "area" },
  { title: "Số đơn đăng ký", value: "count" },
  { title: "Trạng thái", value: "status" },
  { title: "Ở thực tế", value: "realStay" },
];
</script>
