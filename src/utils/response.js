export const RESPONSE = () => {
  const setup = async ({
    apiFunction = () => {
      return { data: null };
    },
    isLoading = true,
  }) => {
    if (isLoading) {
      // StoreApp().onActionIsLoading(true);
    }

    let result = null;

    try {
      const response = await apiFunction;

      result = response; // Trả về toàn bộ response
    } catch (error) {
      console.log("sbc");
      console.log(error);

      if (error?.response?.data?.message) {
        result = error.response;

        // if (toast.isShow) {
        //   TOAST.error(error.response.data.message);
        // }
      }
    } finally {
      // if (isLoading) StoreApp().onActionIsLoading(false);
    }

    return result; // Trả về toàn bộ response
  };

  return { setup };
};
