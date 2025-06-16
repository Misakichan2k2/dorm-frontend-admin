<!-- src/components/charts/ChartTypePie.vue -->
<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  data: Array, // [{ name: "Đăng ký mới", value: 720 }, ...]
});

const chartData = {
  labels: props.data.map((d) => d.name),
  datasets: [
    {
      backgroundColor: ["#a1c4fd", "#c2e9fb", "#d4fc79", "#fbc2eb"],
      data: props.data.map((d) => d.value),
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
    tooltip: { enabled: true },
  },
};
</script>
