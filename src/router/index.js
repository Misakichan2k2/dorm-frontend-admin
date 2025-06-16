import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard/Dashboard.vue";
import RoutesArea from "@/views/Area/service/routes";
import RoutesRoom from "@/views/Room/service/routes";
import RoutesStudentRoomList from "@/views/StudentRoomList/service/routes";
import RoutesElectricityBill from "@/views/ElectricityBill/service/routes";
import RoutesWaterBill from "@/views/WaterBill/service/routes";
import RoutesReport from "@/views/Report/service/routes";
import RoutesRegistration from "@/views/Registration/service/routes";
import RoutesRenewRental from "@/views/RenewalRequest/service/routes";
import RoutesAccount from "@/views/Account/service/routes";
import RoutesStatistics from "@/views/Statistics/service/routes";
import RoutesFeedback from "@/views/Feedback/service/routes";
import RoutesSignIn from "@/views/SignIn/service/routes";
import { appLocalStorage } from "@/utils";

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  ...RoutesArea,
  ...RoutesRoom,
  ...RoutesStudentRoomList,
  ...RoutesElectricityBill,
  ...RoutesWaterBill,
  ...RoutesReport,
  ...RoutesRegistration,
  ...RoutesRenewRental,
  ...RoutesAccount,
  ...RoutesStatistics,
  ...RoutesFeedback,
  ...RoutesSignIn,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPage = to.meta.publicPage;

  if (!appLocalStorage.value.accessToken && !publicPage) {
    return next({ name: "SignIn" });
  }

  if (appLocalStorage.value.accessToken && ["SignIn"].includes(to.name)) {
    return next({ name: "Dashboard" });
  }

  next();
});

export default router;
