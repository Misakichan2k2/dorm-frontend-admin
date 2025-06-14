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
        console.log(data);

        return data;
      })
      .catch((error) => {
        console.log(error);

        appStore().onActionSetPopupMessage({
          type: "error",
          content: error?.response?.data?.message,
        });
        throw error;
      });
  };

  return { setup };
};
