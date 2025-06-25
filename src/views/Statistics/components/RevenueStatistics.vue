<script setup>
import { ref, computed, onMounted } from "vue";
import { STORE_STATISTICS } from "@/services/stores";
import { exportToExcel } from "@/utils/exportExcel";

const { onActionGetIncomeStatistics, onActionGetBuildings } =
  STORE_STATISTICS.StoreStatistics();

const selectedArea = ref(null);
const selectedYear = ref(null);
const selectedMonth = ref(null);

const yearOptions = computed(() => {
  const years = new Set();
  allData.value.forEach((d) => {
    if (d.year) years.add(d.year);
  });
  return [
    { text: "Tất cả", value: null },
    ...Array.from(years)
      .sort((a, b) => b - a)
      .map((y) => ({ text: y, value: y })),
  ];
});

const monthOptions = computed(() => {
  return [
    { text: "Tất cả", value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      text: `Tháng ${i + 1}`,
      value: i + 1,
    })),
  ];
});

const allData = ref([]);
const buildings = ref([]);

const fetchIncomeStatistics = async () => {
  try {
    const res = await onActionGetIncomeStatistics();
    allData.value = res?.data || [];
  } catch (err) {
    console.error("Lỗi lấy dữ liệu thống kê:", err);
  }
};

const fetchBuildings = () => {
  onActionGetBuildings()
    .then((res) => {
      buildings.value = res.data;
    })
    .catch(console.error);
};

const buildingOptions = computed(() => {
  const buildings = [...new Set(allData.value.map((i) => i.building))].sort();
  return [
    { text: "Tất cả", value: null },
    ...buildings.map((b) => ({ text: `Khu ${b}`, value: b })),
  ];
});

const filteredData = computed(() => {
  return allData.value.filter((item) => {
    return (
      (!selectedArea.value ||
        selectedArea.value === "Tất cả" ||
        item.building === selectedArea.value) &&
      (!selectedMonth.value ||
        selectedMonth.value === "Tất cả" ||
        item.month === selectedMonth.value) &&
      (!selectedYear.value ||
        selectedYear.value === "Tất cả" ||
        item.year === selectedYear.value)
    );
  });
});

const months = computed(() => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
});

const chartSeries = computed(() => {
  const newIncome = [];
  const renewIncome = [];

  months.value.forEach((month) => {
    const newItems = filteredData.value.filter(
      (i) => i.month === month && i.type === "Đăng ký mới"
    );
    const renewItems = filteredData.value.filter(
      (i) => i.month === month && i.type === "Gia hạn"
    );

    const newSum = newItems.reduce((sum, i) => sum + i.income, 0);
    const renewSum = renewItems.reduce((sum, i) => sum + i.income, 0);

    newIncome.push(newSum);
    renewIncome.push(renewSum);
  });

  return [
    { name: "Đăng ký mới", data: newIncome },
    { name: "Gia hạn", data: renewIncome },
  ];
});

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    stacked: false,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "80%",
    },
  },
  colors: ["#7e57c2", "#66bb6a"],
  dataLabels: {
    enabled: false,
    style: {
      colors: ["#333"], // màu chữ trên cột
      fontSize: "12px",
    },
    formatter: (val) => (val ? val.toLocaleString() : ""),
  },
  xaxis: {
    categories: months.value.map((m) => `Tháng ${m}`),
    labels: {
      style: {
        fontSize: "12px",
        colors: "#444",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toLocaleString(),
      style: { colors: "#444", fontSize: "12px" },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString() + " đ",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
}));

const totalIncome = computed(() => {
  return filteredData.value.reduce((sum, i) => sum + i.income, 0);
});

const avgCostPerStudent = computed(() => {
  const studentCount = filteredData.value.length || 1;
  return Math.round(totalIncome.value / studentCount);
});

const typeStats = computed(() => {
  const total = filteredData.value.length;
  const newCount = filteredData.value.filter(
    (i) => i.type === "Đăng ký mới"
  ).length;
  const renewalCount = total - newCount;
  return {
    new: newCount,
    renewal: renewalCount,
    newRate: total > 0 ? Math.round((newCount / total) * 100) : 0,
    renewalRate: total > 0 ? Math.round((renewalCount / total) * 100) : 0,
  };
});

const topMonth = computed(() => {
  if (filteredData.value.length === 0) return null;
  const byMonth = {};
  filteredData.value.forEach((i) => {
    const paddedMonth = i.month.toString().padStart(2, "0");
    const key = `${paddedMonth}/${i.year}`;
    byMonth[key] = (byMonth[key] || 0) + i.income;
  });
  const entries = Object.entries(byMonth);
  entries.sort((a, b) => b[1] - a[1]);
  return { label: entries[0][0], amount: entries[0][1] };
});

const tableHeaders = [
  { title: "STT", value: "index", align: "center" },
  { title: "Tháng", value: "month", align: "center" },
  { title: "Năm", value: "year", align: "center" },
  { title: "Khu nhà", value: "building", align: "center" },
  { title: "Số đơn", value: "count", align: "center" },
  { title: "Thu nhập", value: "income", align: "center" },
  { title: "Loại doanh thu", value: "type", align: "center" },
];

const resetFilters = () => {
  selectedArea.value = "Tất cả";
  selectedMonth.value = "Tất cả";
  selectedYear.value = "Tất cả";
};

const handleExport = () => {
  const data = filteredData.value.map((item, index) => ({
    STT: index + 1,
    Tháng: item.month,
    Năm: item.year,
    "Khu nhà": `Khu ${item.building}`,
    "Số đơn": item.count,
    "Thu nhập": item.income,
    "Loại doanh thu": item.type,
  }));

  exportToExcel(data, "danh-sach-bao-cao-dơn-yeu-cau-dang-ky-phong");
};

onMounted(() => {
  fetchIncomeStatistics();
  fetchBuildings();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <v-card class="pa-4 mb-4" elevation="2">
      <div class="text-center mb-5 text-h5 font-weight-bold text-blue-darken-3">
        Thống kê doanh thu
      </div>

      <v-row align="center" class="mb-2" dense>
        <v-col cols="12" sm="4">
          <span>Khu nhà:</span>
          <v-select
            v-model="selectedArea"
            :items="buildingOptions"
            item-title="text"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <span>Tháng:</span>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            item-title="text"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <span>Năm:</span>
          <v-select
            v-model="selectedYear"
            :items="yearOptions"
            item-title="text"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
        <!-- Nút làm mới -->
        <v-col cols="12" md="4" class="d-flex align-end justify-start">
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
    </v-card>

    <!-- Thẻ -->
    <!-- Thẻ chỉ số -->
    <v-row class="mb-4" dense>
      <!-- Tổng thu nhập -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="green-darken-2" size="28">mdi-cash</v-icon>
          <div class="text-subtitle-1 mt-1">Tổng thu nhập</div>
          <div class="text-subtitle-1 font-weight-bold text-green-darken-2">
            {{ totalIncome.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>

      <!-- Chi phí TB / SV -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="blue-darken-2" size="28">mdi-account-cash</v-icon>
          <div class="text-subtitle-1 mt-1">Chi phí trung bình / sinh viên</div>
          <div class="text-subtitle-1 font-weight-bold text-blue-darken-2">
            {{ avgCostPerStudent.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>

      <!-- Tháng có doanh thu cao nhất -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="amber-darken-2" size="28">mdi-trophy</v-icon>
          <div class="text-subtitle-1 mt-1">Tháng có doanh thu cao nhất</div>
          <div class="text-subtitle-1 font-weight-bold text-amber-darken-2">
            {{ topMonth?.label }}: {{ topMonth?.amount.toLocaleString() }} đ
          </div>
        </v-card>
      </v-col>

      <!-- Tỷ lệ loại doanh thu -->
      <v-col cols="12">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="deep-purple-darken-2" size="28">mdi-chart-pie</v-icon>
          <div class="text-subtitle-1 mt-1">Tỷ lệ loại doanh thu</div>
          <div
            class="text-subtitle-1 font-weight-bold text-deep-purple-darken-2"
          >
            {{ typeStats.newRate }}% Đăng ký mới / {{ typeStats.renewalRate }}%
            Gia hạn
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="pa-4 mb-4">
      <h3 class="mb-4">Biểu đồ thu nhập</h3>
      <apexchart
        width="100%"
        height="400"
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </v-card>

    <v-card elevation="2" style="background-color: #f5f5f5">
      <div class="pa-3 d-flex align-center justify-space-between">
        <div>
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              filteredData?.length
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
        :items="filteredData"
        :headers="tableHeaders"
        :items-per-page="5"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template #item.month="{ item }"> Tháng {{ item.month }} </template>

        <template #item.building="{ item }"> Khu {{ item.building }} </template>

        <template #item.income="{ item }">{{
          item.income.toLocaleString()
        }}</template>

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
      </v-data-table>
    </v-card>
  </v-container>
</template>
