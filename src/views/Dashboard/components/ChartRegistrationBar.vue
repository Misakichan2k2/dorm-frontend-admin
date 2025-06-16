<script setup>
import { ref, watch } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler
);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const chartData = ref({
  labels: [],
  datasets: [],
});

// Theo dõi thay đổi props.data
watch(
  () => props.data,
  (newData) => {
    if (!Array.isArray(newData) || newData.length === 0) return;

    // Gộp theo {month, year}
    const grouped = {};
    newData.forEach((d) => {
      const key = `${d.month}-${d.year}`;
      if (!grouped[key]) {
        grouped[key] = { month: d.month, year: d.year, count: 0 };
      }
      grouped[key].count += d.count;
    });

    const result = Object.values(grouped).sort(
      (a, b) => a.year - b.year || a.month - b.month
    );

    chartData.value = {
      labels: result.map(
        (d) => `${String(d.month).padStart(2, "0")}/${d.year}`
      ),
      datasets: [
        {
          label: "Tổng số đơn đăng ký",
          backgroundColor: "#a1c4fd",
          data: result.map((d) => d.count),
          borderRadius: 6,
        },
      ],
    };
  },
  { immediate: true }
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: { ticks: { color: "#555" }, grid: { display: false } },
    y: { ticks: { color: "#555" }, grid: { display: true, color: "#eee" } },
  },
};
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
