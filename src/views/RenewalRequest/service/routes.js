export default [
  {
    path: "/renew-rental",
    name: "RenewRental",
    component: () => import("../RenewRental.vue"),
  },
  {
    path: "/renew-student-detail",
    name: "RenewStudentDetail",
    component: () => import("../components/StudentDetail.vue"),
  },
];
