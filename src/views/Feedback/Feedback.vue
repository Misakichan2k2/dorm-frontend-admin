<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_FEEDBACK } from "@/services/stores";

const { onActionGetAllFeedbacks, onActionUpdateFeedbackNote } =
  STORE_FEEDBACK.StoreFeedback();

const search = ref("");
const selectedType = ref("Tất cả");
const dialogNote = ref(false);
const dialogDetail = ref(false);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("green");

const selectedFeedback = ref(null);
const note = ref("");

const headers = [
  { key: "idex", title: "STT", align: "center", sortable: false },
  { key: "type", title: "Loại", align: "center" },
  { key: "title", title: "Tiêu đề", align: "" },
  // { key: "content", title: "Nội dung", align: "start" },
  { key: "createdAt", title: "Ngày gửi", align: "" },
  { key: "note", title: "Ghi chú", align: "start", width: "10rem" },
  { key: "action", title: "Hành động", align: "center", sortable: false },
];

const feedbacks = ref([]);

const fetchFeedbacks = async () => {
  await onActionGetAllFeedbacks().then((res) => {
    console.log(res);
    feedbacks.value = res?.data;
  });
};

const typeOptions = ["Tất cả", "Khen ngợi", "Khiếu nại", "Góp ý", "Khác"];

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

const filteredFeedbacks = computed(() => {
  return feedbacks?.value?.data?.filter((fb) => {
    const matchesType =
      selectedType?.value === "Tất cả" || fb.type === selectedType.value;

    const matchesSearch =
      search.value === "" ||
      fb.content.toLowerCase().includes(search.value.toLowerCase());
    return matchesType && matchesSearch;
  });
});

const getTypeColor = (type) => {
  switch (type) {
    case "Khen ngợi":
      return "green";
    case "Khiếu nại":
      return "red";
    case "Góp ý":
      return "blue";
    default:
      return "grey";
  }
};

const openNoteDialog = (fb) => {
  selectedFeedback.value = fb;
  note.value = fb.note || "";
  dialogNote.value = true;
};

const saveNote = async () => {
  const data = { note: note.value };
  const item = selectedFeedback.value;

  try {
    const res = await onActionUpdateFeedbackNote(item._id, data);

    if (res?.data?.data?._id) {
      // Cập nhật feedback local
      selectedFeedback.value.note = note.value;
      dialogNote.value = false;

      snackbarText.value = "Cập nhật ghi chú thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;
    } else {
      throw new Error("Không có data phản hồi sau khi cập nhật");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật ghi chú:", error);

    snackbarText.value = "Cập nhật ghi chú thất bại!";
    snackbarColor.value = "red";
    snackbar.value = true;
  }
};

const resetFilters = () => {
  search.value = "";
  selectedType.value = "Tất cả";
};

const openDetailDialog = (fb) => {
  selectedFeedback.value = fb;
  dialogDetail.value = true;
};

const feedbackFields = computed(() => {
  if (!selectedFeedback.value) return {};
  return {
    "Họ tên": selectedFeedback.value.fullname,
    MSSV: selectedFeedback.value.studentId,
    Khu: `Khu ${selectedFeedback.value.building}`,
    Phòng: selectedFeedback.value.room,
    "Loại phản hồi": selectedFeedback.value.type,
    "Nội dung": selectedFeedback.value.content,
    "Ngày gửi": formatDate(selectedFeedback.value.createdAt),
    ...(selectedFeedback.value.note && {
      "Ghi chú": selectedFeedback.value.note,
    }),
  };
});

const handleExport = () => {
  const data = filteredFeedbacks.value.map((item, index) => ({
    STT: index + 1,
    Loại: item.type,
    "Nội dung": item.content,
    "Ngày gửi": formatDate(item.date),
    "Ghi chú": item.note,
  }));

  exportToExcel(data, "danh-sach-phan-hoi");
};

onMounted(fetchFeedbacks);
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <v-card class="pa-4" elevation="2">
          <div class="text-h5 font-weight-bold text-blue-darken-3">
            Danh sách phản hồi
          </div>
          <div class="text-body-2 text-blue-grey-darken-1">
            Theo dõi và xử lý phản hồi từ sinh viên
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bộ lọc -->
    <v-card class="pa-4 bg-white" elevation="2">
      <v-row dense>
        <v-col cols="12" md="6">
          <span style="font-size: 14px">Tìm kiếm:</span>
          <v-text-field
            v-model="search"
            placeholder="Nội dung phản hồi..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Loại phản hồi:</span>
          <v-select
            v-model="selectedType"
            :items="typeOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" class="d-flex justify-start">
          <v-btn
            color="cyan-darken-2"
            prepend-icon="mdi-filter-off-outline"
            @click="resetFilters"
            variant="outlined"
            >Làm mới</v-btn
          >
        </v-col>
      </v-row>
    </v-card>

    <!-- Bảng phản hồi -->
    <v-card class="mt-4" elevation="2">
      <div
        class="pa-3 d-flex align-center justify-space-between"
        style="background-color: #f5f5f5"
      >
        <div>
          <span
            class="text-blue-grey-darken-2 font-weight-bold"
            style="font-size: 14px"
          >
            Tổng số phản hồi:
          </span>
          <v-chip color="cyan-lighten-1" class="font-weight-bold">
            {{ filteredFeedbacks?.length }}
          </v-chip>
        </div>
        <div class="d-flex justify-end pr-3">
          <v-btn
            color="teal-lighten-2"
            prepend-icon="mdi-file-excel"
            elevation="0"
            @click="handleExport"
          >
            Xuất File
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredFeedbacks"
        item-value="id"
        class="elevation-1"
      >
        <template v-slot:item.idex="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.type="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            text-color="white"
            size="small"
            class="font-weight-medium"
          >
            {{ item.type }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.note="{ item }" style="max-width: 10rem">
          <div class="note-cell">{{ item.note }}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="d-flex ga-1 justify-center">
            <v-btn
              color="cyan-darken-2"
              icon="mdi-eye-outline"
              elevation="0"
              variant="outlined"
              rounded="lg"
              size="small"
              @click="openDetailDialog(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Xem chi tiết</v-tooltip
              >
            </v-btn>

            <v-btn
              color="cyan-darken-2"
              icon="mdi-note-edit-outline"
              elevation="0"
              variant="outlined"
              rounded="lg"
              size="small"
              @click="openNoteDialog(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top">Ghi chú</v-tooltip>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-note-off text-h2 text-grey-lighten-1"></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có phản hồi nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Dialog Ghi chú -->
  <v-dialog v-model="dialogNote" max-width="500">
    <v-card class="rounded-lg elevation-10">
      <v-card-title class="text-h6 font-weight-bold text-blue-600">
        📝 Ghi chú xử lý phản hồi
      </v-card-title>

      <v-card-text class="pt-2">
        <v-textarea
          v-model="note"
          label="Nhập ghi chú..."
          rows="4"
          variant="outlined"
          auto-grow
          class="mb-2"
          color="blue"
          hide-details="auto"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" color="grey-darken-1" @click="dialogNote = false">
          Hủy
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-white"
          @click="saveNote"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Chi tiết phản hồi -->
  <v-dialog v-model="dialogDetail" max-width="600">
    <v-card class="rounded-xl elevation-10">
      <v-card-title class="text-h6 font-weight-bold text-blue-600">
        📋 Chi tiết phản hồi
      </v-card-title>

      <v-card-text v-if="selectedFeedback">
        <v-container fluid class="pa-0">
          <v-row
            v-for="(value, label) in feedbackFields"
            :key="label"
            class="py-1"
          >
            <v-col cols="4" class="font-weight-medium text-grey-darken-1">
              {{ label }}:
            </v-col>
            <v-col cols="8">
              <span>{{ value }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn text color="grey-darken-1" @click="dialogDetail = false">
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar -->
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="top right"
    rounded
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<style scoped>
.note-cell {
  max-width: 14rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
