import { appStore } from "@/stores/appStore";

export const RESPONSE = () => {
  const setup = async ({
    apiFunction = () => {
      return { data: null };
    },
    isLoading = true,
  }) => {
    return apiFunction
      .then((data) => {
        return data;
      })
      .catch((error) => {
        appStore().onActionSetPopupMessage({
          type: "error",
          content: error?.response?.data?.message,
        });
        throw error;
      });
  };

  return { setup };
};
