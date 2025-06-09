export default [
  {
    path: "/registration",
    name: "Registration",
    component: () => import("../Registration.vue"),
  },
  {
    path: "/registration/detail/:id",
    name: "RegistrationStudentDetail",
    component: () => import("../components/StudentDetail.vue"),
  },
];
