import { defineStore } from "pinia";
import { API_FEEDBACK } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreFeedback = defineStore("StoreFeedback", () => {
  const { setup } = RESPONSE();
  const API = API_FEEDBACK.API_FEEDBACK;

  // Lấy tất cả feedbacks
  const onActionGetAllFeedbacks = async () => {
    return await setup({
      apiFunction: API.getAllFeedbacks(),
    });
  };

  // Lấy feedback theo ID
  const onActionGetFeedbackById = async (id) => {
    return await setup({
      apiFunction: API.getFeedbackById(id),
    });
  };

  // Cập nhật note
  const onActionUpdateFeedbackNote = async (id, data) => {
    return await setup({
      apiFunction: API.updateFeedbackNote(id, data),
    });
  };

  return {
    onActionGetAllFeedbacks,
    onActionGetFeedbackById,
    onActionUpdateFeedbackNote,
  };
});
