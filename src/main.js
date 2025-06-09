import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";
import VueApexCharts from "vue3-apexcharts";

import App from "./App.vue";
import router from "./router";

const vuetify = createVuetify({
  components: {
    ...components,
    VFileUpload,
    VDateInput,
  },
  directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.component("apexchart", VueApexCharts);

app.mount("#app");
