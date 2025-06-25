<script setup>
import { ref, computed, onMounted } from "vue";
import { STORE_STATISTICS } from "@/services/stores";
import { exportToExcel } from "@/utils/exportExcel";

const { onActionGetRegistrationStatistics, onActionGetBuildings } =
  STORE_STATISTICS.StoreStatistics();

const allData = ref([]);
const buildings = ref([]);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedBuilding = ref(null);
const selectedStatus = ref(null);

const yearOptions = ref([]);

// Fetch toàn bộ dữ liệu đăng ký
const fetchRegistrationStatistics = async () => {
  await onActionGetRegistrationStatistics().then((res) => {
    allData.value = res?.data || [];

    const data = allData.value;

    const uniqueYears = [...new Set(data.map((i) => i.year))].sort();
    const uniqueMonths = [...new Set(data.map((i) => i.month))].sort(
      (a, b) => a - b
    );
    const uniqueBuildings = [...new Set(data.map((i) => i.building))];

    yearOptions.value = [
      { text: "Tất cả", value: null },
      ...uniqueYears.map((y) => ({ text: y.toString(), value: y })),
    ];
    monthOptions.value = [
      { text: "Tất cả", value: null },
      ...uniqueMonths.map((m) => ({ text: `Tháng ${m}`, value: m })),
    ];
    buildingOptions.value = [
      { text: "Tất cả", value: null },
      ...uniqueBuildings.map((b) => ({ text: b, value: b })),
    ];
  });
};

// Fetch danh sách tòa nhà
const fetchBuildings = async () => {
  try {
    const res = await onActionGetBuildings();
    buildings.value = res?.data || [];
  } catch (err) {
    console.error("Lỗi lấy khu nhà:", err);
  }
};

const buildingOptions = computed(() => {
  const buildings = [...new Set(allData.value.map((i) => i.building))].sort();
  return [
    { text: "Tất cả", value: null },
    ...buildings.map((b) => ({ text: `Khu ${b}`, value: b })),
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

const statusOptions = [
  { title: "Tất cả", value: null },
  { title: "Chờ duyệt", value: "pending" },
  { title: "Chấp nhận", value: "approved" },
  { title: "Từ chối", value: "rejected" },
  { title: "Bị hủy", value: "canceled" },
];

const filteredData = computed(() => {
  return allData.value.filter((item) => {
    const matchYear = !selectedYear.value || item.year === selectedYear.value;
    const matchMonth =
      !selectedMonth.value || item.month === selectedMonth.value;
    const matchBuilding =
      !selectedBuilding.value || item.building === selectedBuilding.value;
    const matchStatus =
      !selectedStatus.value || item.status === selectedStatus.value;
    return matchYear && matchMonth && matchBuilding && matchStatus;
  });
});

const totalRegistrations = computed(() =>
  filteredData.value.reduce((sum, i) => sum + i.count, 0)
);

const approvedCount = computed(() =>
  filteredData.value
    .filter((i) => i.status === "approved")
    .reduce((sum, i) => sum + i.count, 0)
);

const conversionRate = computed(() => {
  if (totalRegistrations.value === 0) return 0;
  return ((approvedCount.value / totalRegistrations.value) * 100).toFixed(2);
});

const months = Array.from({ length: 12 }, (_, i) => i + 1);

const monthSeries = computed(() => {
  const data = Array(12).fill(0);
  filteredData.value.forEach((item) => {
    if (item.month >= 1 && item.month <= 12) {
      data[item.month - 1] += item.count;
    }
  });
  return [{ name: "Số đơn đăng ký", data }];
});

const chartOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
  },
  colors: ["#1976d2"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: "80%",
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: months.map((m) => `Tháng ${m}`),
    labels: {
      rotate: -45,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toLocaleString()} đơn`,
    },
  },
};

const tableHeaders = [
  { title: "STT", value: "index", align: "center" },
  { title: "Tháng", value: "month", align: "center" },
  { title: "Năm", value: "year", align: "center" },
  { title: "Khu nhà", value: "building", align: "center" },
  { title: "Số đơn đăng ký", value: "count", align: "center" },
  { title: "Trạng thái", value: "status", align: "center" },
];

const handleExport = () => {
  const data = filteredData.value.map((item, index) => ({
    STT: index + 1,
    Tháng: item.month,
    Năm: item.year,
    "Khu nhà": `Khu ${item.building}`,
    "Số đơn đăng ký": item.count,
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-bao-cao-dơn-yeu-cau-dang-ky-phong");
};

const statusLabel = (status) =>
  ({
    pending: "Chờ duyệt",
    approved: "Chấp nhận",
    rejected: "Từ chối",
    canceled: "Bị hủy",
  }[status] || "Không rõ");

const statusColor = (status) =>
  ({
    pending: "blue",
    approved: "green",
    rejected: "red",
    canceled: "grey",
  }[status] || "grey");

const resetFilters = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedBuilding.value = null;
  selectedStatus.value = null;
};

onMounted(() => {
  fetchRegistrationStatistics();
  fetchBuildings();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <v-card class="pa-4 mb-4" elevation="2">
      <div class="text-center mb-5 text-h5 font-weight-bold text-blue-darken-3">
        Thống kê đơn yêu cầu đăng ký phòng
      </div>

      <v-row align="center" class="mb-2" dense>
        <v-col cols="12" sm="3">
          <span>Khu nhà:</span>
          <v-select
            v-model="selectedBuilding"
            :items="buildingOptions"
            item-title="text"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <span>Tháng:</span>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            item-title="text"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" sm="3">
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
        <v-col cols="12" sm="3">
          <span>Trạng thái:</span>
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            hide-details
            density="compact"
            variant="outlined"
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
    </v-card>

    <!-- Thẻ -->
    <v-row class="mb-4" dense>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center" elevation="2" color="#FFFAFA">
          <v-icon size="36" color="primary" class="mr-4"
            >mdi-file-document</v-icon
          >
          <div>
            <div class="text-subtitle-1">Tổng số đơn</div>
            <div class="text-h5 font-weight-bold">
              {{ totalRegistrations.toLocaleString() }} đơn
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center" elevation="2" color="#F5F5FF">
          <v-icon size="36" color="green" class="mr-4">mdi-chart-donut</v-icon>
          <div>
            <div class="text-subtitle-1">Tỷ lệ chuyển đổi</div>
            <div class="text-h5 font-weight-bold">{{ conversionRate }}%</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="pa-4 d-flex align-center" elevation="2" color="#F0FFF0">
          <v-icon size="36" color="teal" class="mr-4"
            >mdi-check-circle-outline</v-icon
          >
          <div>
            <div class="text-subtitle-1">Số đơn chấp nhận</div>
            <div class="text-h5 font-weight-bold">
              {{ approvedCount.toLocaleString() }} đơn
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="pa-4 mb-4">
      <h3 class="mb-4">Biểu đồ đơn yêu cầu đăng ký phòng theo tháng</h3>
      <apexchart
        type="bar"
        height="400"
        :options="chartOptions"
        :series="monthSeries"
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

        <template #item.count="{ item }">{{
          item.count.toLocaleString()
        }}</template>

        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            variant="tonal"
            size="small"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
