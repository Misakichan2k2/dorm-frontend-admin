<!-- Thống kê theo khu và giới tính -->

<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        Thống kê phòng ở theo khu và giới tính
      </v-card-title>

      <!-- BỘ LỌC -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedZone"
            :items="zones"
            label="Chọn khu"
            dense
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedGender"
            :items="genders"
            label="Chọn giới tính"
            dense
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Chọn thời gian"
                readonly
                v-bind="attrs"
                @click="on"
                dense
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="selectedDateRange"
              type="month"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- BIỂU ĐỒ -->
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      />

      <!-- BẢNG DỮ LIỆU -->
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        class="mt-6"
        dense
      ></v-data-table>

      <!-- NÚT XUẤT EXCEL -->
      <v-btn class="mt-4" color="primary" @click="exportToExcel">
        Xuất Excel
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import ApexCharts from "apexcharts";
import VueApexCharts from "vue3-apexcharts";
import * as XLSX from "xlsx";

const zones = ["Khu A", "Khu B", "Khu C"];
const genders = ["Nam", "Nữ"];
const selectedZone = ref(null);
const selectedGender = ref(null);
const selectedDateRange = ref(dayjs().format("YYYY-MM"));
const menu = ref(false);

const dateRangeText = computed(() => {
  return selectedDateRange.value
    ? `Tháng ${dayjs(selectedDateRange.value).format("MM/YYYY")}`
    : "";
});

const chartOptions = {
  chart: {
    id: "room-usage-chart",
  },
  xaxis: {
    categories: ["Khu A", "Khu B", "Khu C"],
  },
};

const chartSeries = [
  {
    name: "Số sinh viên",
    data: [120, 80, 60],
  },
];

const tableHeaders = [
  { title: "Khu", value: "zone" },
  { title: "Sức chứa", value: "capacity" },
  { title: "Số sinh viên hiện tại", value: "current" },
  { title: "Tỷ lệ lấp đầy (%)", value: "occupancy" },
];

const tableData = [
  { zone: "Khu A", capacity: 150, current: 120, occupancy: "80%" },
  { zone: "Khu B", capacity: 100, current: 80, occupancy: "80%" },
  { zone: "Khu C", capacity: 90, current: 60, occupancy: "66.7%" },
];

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê");
  XLSX.writeFile(workbook, "thongke_kytucxa.xlsx");
}
</script>

<style scoped></style>
