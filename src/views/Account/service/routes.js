export default [
  {
    path: "/account",
    name: "Account",
    component: () => import("../Account.vue"),
  },
  {
    path: "/account/detail/:id",
    name: "AccountStudentDetail",
    component: () => import("../components/StudentDetail.vue"),
  },
];
