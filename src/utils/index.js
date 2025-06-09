import { computed } from "vue";
import router from "@/router";
import { useStorage } from "@vueuse/core";
import { StoreApp } from "@/services/stores";
import { COMMON } from "@/utils/common";
import { ENUM } from "@/utils/enum";
import { RESPONSE } from "@/utils/response";

const appLocalStorage = useStorage(
  "AppLocalStorage",
  ENUM.APP_LOCAL_STORAGE,
  localStorage,
  { mergeDefaults: true }
);

const userData = computed(
  () => appLocalStorage.value.userData || ENUM.USER_DATA
);
const accessToken = computed(() => appLocalStorage.value.accessToken || "");
const refreshToken = computed(() => appLocalStorage.value.refreshToken || "");

const innerWidth = computed(() => appLocalStorage.value.innerWidth || 1300);
const desktopScreen = computed(() => appLocalStorage.value.desktopScreen);
const mobileScreen = computed(() => appLocalStorage.value.mobileScreen);
const isScroll = computed(() => appLocalStorage.value.isScroll);
const elementId = computed(() => appLocalStorage.value.elementId);

const onDeleteAppLocalStorage = () => {
  localStorage.removeItem("AppLocalStorage");
  appLocalStorage.value = ENUM.APP_LOCAL_STORAGE;

  setTimeout(() => {
    router.replace({ name: "SignIn" });
  }, 500);
};

export {
  // ----------------------
  appLocalStorage,
  userData,
  accessToken,
  refreshToken,
  innerWidth,
  desktopScreen,
  mobileScreen,
  isScroll,
  elementId,
  onDeleteAppLocalStorage,

  // -----------------------
  COMMON,
  ENUM,
  RESPONSE,
};
