<script setup>
import { ref, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

// Nhận prop data
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

// Biến phản ứng cho dữ liệu biểu đồ
const chartData = ref({
  labels: [],
  datasets: [],
});

// Theo dõi props.data và xử lý dữ liệu gộp theo tháng/năm
watch(
  () => props.data,
  (newData) => {
    if (!Array.isArray(newData) || newData.length === 0) return;

    // Gộp dữ liệu theo khóa "month-year"
    const grouped = {};
    newData.forEach(({ month, year, income }) => {
      const key = `${month}-${year}`;
      if (!grouped[key]) {
        grouped[key] = { month, year, income: 0 };
      }
      grouped[key].income += income;
    });

    // Sắp xếp theo thời gian tăng dần
    const sortedData = Object.values(grouped).sort(
      (a, b) => a.year - b.year || a.month - b.month
    );

    // Cập nhật chartData
    chartData.value = {
      labels: sortedData.map(
        ({ month, year }) => `${String(month).padStart(2, "0")}/${year}`
      ),
      datasets: [
        {
          label: "Tổng doanh thu (đ)",
          data: sortedData.map(({ income }) => income),
          borderColor: "#84fab0",
          backgroundColor: "#84fab066",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  },
  { immediate: true }
);

// Tùy chọn cấu hình biểu đồ
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      ticks: { color: "#444" },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#444" },
      grid: { color: "#eee" },
    },
  },
};
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
