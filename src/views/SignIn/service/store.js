import { defineStore } from "pinia";
import { API_AUTH } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreAuth = defineStore("StoreAuth", () => {
  const { setup } = RESPONSE();
  const API = API_AUTH.API_AUTH;

  // Sign in
  const onActionSignIn = async (data) => {
    return await setup({
      apiFunction: API.signIn(data),
    });
  };

  // Sign up
  const onActionSignUp = async (data) => {
    return await setup({
      apiFunction: API.signUp(data),
    });
  };

  return {
    onActionSignIn,
    onActionSignUp,
  };
});
