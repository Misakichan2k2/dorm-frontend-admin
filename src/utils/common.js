import CryptoJS from "crypto-js";

export const COMMON = {
  onEncryptedData: (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      import.meta.env.VITE_BASE_JWT_SECRET
    ).toString();
  },

  onRenderScreenName: (routeName) => {
    switch (routeName) {
      case "Popular":
        return "Phổ biến";
      case "MyPost":
        return "Bài đăng của tôi";
      case "MyPost":
        return "Bài đăng của tôi";
      default:
        break;
    }
  },
};
