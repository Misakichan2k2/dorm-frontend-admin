export default [
  {
    path: "/sign-in",
    name: "SignIn",
    meta: { publicPage: true },
    component: () => import("../SignIn.vue"),
  },
];
