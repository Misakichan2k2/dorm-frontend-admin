import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const appStore = defineStore("appStore", () => {
  const popupMessage = ref({ display: false, type: "", content: "" });

  const onGetterPopupMessage = computed(() => popupMessage);

  const onActionSetPopupMessage = ({ display = true, type, content }) => {
    popupMessage.value.display = display;
    popupMessage.value.type = type;
    popupMessage.value.content = content;
  };

  return {
    onGetterPopupMessage,

    onActionSetPopupMessage,
  };
});
