import { defineStore } from "pinia";
import { computed, ref } from "vue";

export * as STORE_BUILDING from "@/views/Area/service/store";
export * as STORE_ROOM from "@/views/Room/service/store";
export * as STORE_STUDENT_ROOM_LIST from "@/views/StudentRoomList/service/store";
export * as STORE_ELECTRIC_INVOICE from "@/views/ElectricityBill/service/store";
export * as STORE_WATER_INVOICE from "@/views/WaterBill/service/store";
export * as STORE_REPORT from "@/views/Report/service/store";
export * as STORE_REGISTRATION from "@/views/Registration/service/store";
export * as STORE_FEEDBACK from "@/views/Feedback/service/store";
export * as STORE_ACCOUNT from "@/views/Account/service/store";
export * as STORE_RENEWAL from "@/views/RenewalRequest/service/store";
export * as STORE_AUTH from "@/views/SignIn/service/store";

export const StoreApp = defineStore("StoreApp", () => {
  const routeSignIn = ref("");
  const isLoading = ref(false);

  const onGetterRouteSignIn = computed(() => routeSignIn);
  const onGetterIsLoading = computed(() => isLoading);

  // Loading
  const onActionIsLoading = (isActive = true) => {
    isLoading.value = isActive;
  };

  return {
    onGetterRouteSignIn,
    onGetterIsLoading,
    onActionIsLoading,
  };
});
