export default [
  {
    path: "/renewal-request",
    name: "RenewRental",
    component: () => import("../RenewRental.vue"),
  },
  {
    path: "/renewal-request/:id",
    name: "RenewStudentDetail",
    component: () => import("../components/StudentDetail.vue"),
  },
];
