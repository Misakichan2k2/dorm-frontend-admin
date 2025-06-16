export default [
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import("../Statistics.vue"),
  },
  {
    path: "/statistics/area",
    name: "StatisticsArea",
    component: () => import("../components/AreaReport.vue"),
  },
  {
    path: "/statistics/issue",
    name: "StatisticsIssue",
    component: () => import("../components/ReportTracking.vue"),
  },
  {
    path: "/statistics/registration",
    name: "StatisticsRegistration",
    component: () => import("../components/RegistrationStatistics.vue"),
  },
  {
    path: "/statistics/revenue",
    name: "StatisticsRevenue",
    component: () => import("../components/RevenueStatistics.vue"),
  },
];
