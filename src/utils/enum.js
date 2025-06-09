export const ENUM = {
  APP_LOCAL_STORAGE: {
    innerWidth: 1300,
    desktopScreen: true,
    mobileScreen: false,
    isScroll: true,
    elementId: "",
    lang: "vi",
    userData: "",
    accessToken: "",
    refreshToken: "",
  },

  USER_DATA: {
    accountId: "",
    email: "",
    role: null,
    userId: "",
    avatar: "",
    lastName: "",
    firstName: "",
    fullName: "",
    dateOfBirth: null,
    gender: null,
    phoneNumber: null,
  },

  // String, int
  MAX_LENGTH: 10,

  // Object
  REACTION_TYPE: {
    PLUS: "PLUS",
    MINUS: "MINUS",
  },

  POST_STATUS: {
    PUBLIC: "PUBLIC",
    DRAFT: "DRAFT",
  },

  POST_TYPE: {
    TEXT: "TEXT",
    MEDIA: "MEDIA",
  },

  // Array
  NO_SCREEN_NAME: ["Home", "DetailPost"],

  GENDER_OPTION: [
    { name: "Nam", code: "MALE" },
    { name: "Nữ", code: "FEMALE" },
  ],

  POST_STATUS_OPTION: [
    { name: "Công khai", code: "PUBLIC" },
    { name: "Bản nháp", code: "DRAFT" },
  ],

  POST_TABS: [
    {
      name: "Văn bản",
      code: "TEXT",
    },
    {
      name: "Phương tiện",
      code: "MEDIA",
    },
  ],

  POST_ITEM_OPTION: [
    {
      name: "Chỉnh sửa bài viết",
      code: "UPDATE_POST",
    },
    {
      name: "Xóa bài viết",
      code: "DELETE_POST",
    },
  ],

  POSITION_TYPE: [
    {
      name: "Ngang",
      code: "HORIZONTAL",
    },
    {
      name: "Dọc",
      code: "VERTICAL",
    },
  ],

  LANG_OPTION: [
    {
      name: "ພາສາລາວ",
      image: "/images/langs/lao.png",
      code: "la",
    },
    {
      name: "Tiếng Việt",
      image: "/images/langs/vi.jpg",
      code: "vi",
    },
    {
      name: "English",
      image: "/images/langs/en.webp",
      code: "en",
    },
  ],
};
