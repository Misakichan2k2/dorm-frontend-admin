<script setup>
import { ref, computed, defineProps, onMounted } from "vue";
import { format } from "date-fns";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_REPORT } from "@/services/stores";

const {
  onActionGetAllReports,
  onActionGetBuildings,
  onActionGetRooms,
  onActionUpdateReportStatus,
} = STORE_REPORT.StoreReport();

const props = defineProps({
  statusFilter: {
    type: String,
    default: "Tất cả",
  },
});

const headers = [
  { title: "STT", key: "index", sortable: false },
  { title: "Ảnh minh chứng", key: "image", sortable: false },
  { title: "Khu nhà", key: "building" },
  { title: "Phòng", key: "room" },
  { title: "Danh mục sự cố", key: "category" },
  { title: "Tiêu đề sự cố", key: "title" },
  { title: "Thời gian báo", key: "createdAt" },
  { title: "Thời gian hoàn thành", key: "completedAt", align: "center" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Hành động", key: "action", sortable: false },
];

const searchQuery = ref("");
const selectedImage = ref("");
const selectedReport = ref(null);

const reports = ref([]);
const buildings = ref([]);
const rooms = ref([]);

const fetchReports = async () => {
  await onActionGetAllReports().then((res) => {
    console.log(res);
    reports.value = res?.data;
  });
};

const fetchBuildings = () => {
  onActionGetBuildings()
    .then((res) => {
      buildings.value = res.data;
    })
    .catch(console.error);
};

const fetchRooms = async () => {
  await onActionGetRooms()
    .then((res) => {
      rooms.value = res?.data;
    })
    .catch(console.error);
};

const buildingOptions = computed(() => [
  "Tất cả",
  ...buildings.value.map((b) => b.name).sort((a, b) => a.localeCompare(b)),
]);

const roomOptions = computed(() => {
  const roomNumbers = rooms.value.map((r) => r.room);
  const uniqueRoomNumbers = Array.from(new Set(roomNumbers));

  // sắp xếp tăng dần theo số (nếu phòng là số)
  uniqueRoomNumbers.sort((a, b) => parseInt(a) - parseInt(b));

  return ["Tất cả", ...uniqueRoomNumbers];
});

const statusOptions = ["Chờ xử lý", "Đang xử lý", "Đã xử lý", "Đã hủy"];
const reportCategories = [
  "Tất cả",
  "Hỏng thiết bị",
  "Sự cố điện",
  "Sự cố nước",
  "Khác",
];

const search = ref({
  reporter: "",
  title: "",
  building: "Tất cả",
  room: "Tất cả",
  status: "Tất cả",
  category: "Tất cả",
});

const formatDate = (date) => {
  if (!date) return "-";
  return format(new Date(date), "dd/MM/yyyy");
};

const filteredReports = computed(() => {
  return reports?.value?.filter((report) => {
    const keyword = searchQuery?.value?.toLowerCase();
    const matchesKeyword =
      report?.reporter?.toLowerCase().includes(keyword) ||
      report?.title?.toLowerCase().includes(keyword);

    const matchesBuilding =
      !search?.value.building ||
      search?.value?.building === "Tất cả" ||
      report?.building
        .toLowerCase()
        .includes(search.value.building.toLowerCase());

    const matchesRoom =
      !search.value.room ||
      search.value.room === "Tất cả" ||
      report?.room.includes(search.value.room);

    const matchesStatus =
      !search.value.status ||
      search.value.status === "Tất cả" ||
      report?.status === search.value.status;

    const matchesStatusFilter =
      props.statusFilter === "Tất cả" || report.status === props.statusFilter;

    const matchesCategory =
      !search.value.category ||
      search.value.category === "Tất cả" ||
      report?.category === search.value.category;

    return (
      matchesKeyword &&
      matchesBuilding &&
      matchesRoom &&
      matchesStatus &&
      matchesStatusFilter &&
      matchesCategory
    );
  });
});

const resetFilters = () => {
  search.value = {
    reporter: "",
    title: "",
    building: "Tất cả",
    room: "Tất cả",
    status: "Tất cả",
    category: "Tất cả",
  };
  searchQuery.value = "";
};

const getStatusColor = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return "orange";
    case "Đang xử lý":
      return "blue";
    case "Đã xử lý":
      return "green";
    default:
      return "red";
  }
};

const dialog = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");
const detailDialog = ref(false);

const onStatusChange = (item, newStatus) => {
  item.status = newStatus;
  onActionUpdateReportStatus(item._id, newStatus);

  snackbarText.value = `Đã cập nhật trạng thái thành "${newStatus}" cho "${item.title}"`;
  snackbarColor.value = getStatusColor(newStatus);
  snackbar.value = true;
};

const openDetailDialog = (rp) => {
  selectedReport.value = { ...rp };
  detailDialog.value = true;
};

const emit = defineEmits(["close"]);

const handleExport = () => {
  const data = filteredReports.value.map((item, index) => ({
    STT: index + 1,
    "Khu nhà": item.building,
    Phòng: item.room,
    "Danh mục sự cố": item.category,
    "Tiêu đề sự cố": item.title,
    "Thời gian báo": formatDate(item.reportedAt),
    "Thời gian hoàn thành": formatDate(item.completedAt),
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-bao-cao-su-co");
};

onMounted(() => {
  fetchReports();
  fetchBuildings();
  fetchRooms();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Filter section -->
    <v-card class="pa-4 bg-white" elevation="2">
      <div class="text-h5 mb-5 text-center font-weight-bold text-blue-darken-3">
        Danh sách báo cáo sự cố
      </div>
      <v-row dense>
        <v-col cols="12" md="3">
          <span>Từ khóa tìm kiếm:</span>
          <v-text-field
            v-model="searchQuery"
            placeholder="Nhập tên hoặc tiêu đề sự cố..."
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <span>Khu nhà:</span>
          <v-combobox
            v-model="search.building"
            :items="buildingOptions"
            placeholder="Lọc theo khu"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <span>Số phòng:</span>
          <v-combobox
            v-model="search.room"
            :items="roomOptions"
            placeholder="Lọc theo phòng"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <span>Danh mục sự cố:</span>
          <v-select
            v-model="search.category"
            :items="reportCategories"
            variant="outlined"
            density="compact"
            hide-details
          />
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

    <!-- Table -->
    <v-card class="mt-4" elevation="2">
      <div class="pa-3 d-flex align-center justify-space-between">
        <div>
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              filteredReports.length
            }}</v-chip>
          </span>
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
        :items="filteredReports"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template #item.image="{ item }">
          <v-avatar size="64" rounded>
            <v-tooltip activator="parent" location="top"
              >Nhấn để xem ảnh</v-tooltip
            >
            <img
              :src="item.image"
              alt="Report Image"
              class="w-100 rounded-lg cursor-pointer"
              @click="
                () => {
                  selectedImage = item.image;
                  dialog = true;
                }
              "
            />
          </v-avatar>
        </template>

        <template #item.building="{ item }"> Khu {{ item.building }} </template>

        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template #item.completedAt="{ item }">
          {{ formatDate(item.completedAt) }}
        </template>

        <template #item.status="{ item }">
          <v-select
            v-model="item.status"
            :items="statusOptions"
            variant="plain"
            density="compact"
            hide-details
            @update:modelValue="(val) => onStatusChange(item, val)"
          >
            <template #selection="{ item }">
              <div style="width: 5rem">
                <v-chip
                  :color="getStatusColor(item.raw)"
                  text-color="white"
                  class="w-100 d-flex justify-center"
                >
                  {{ item.raw }}
                </v-chip>
              </div>
            </template>
          </v-select>
        </template>

        <template #item.action="{ item }">
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
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-hammer-wrench text-h2 text-grey-lighten-1"></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có báo cáo nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-img :src="selectedImage" aspect-ratio="16/9" cover></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog chi tiết -->
  <v-dialog v-model="detailDialog" max-width="700">
    <v-card rounded="lg">
      <v-card-title
        class="d-flex text-h6 font-weight-bold justify-space-between pa-5"
      >
        📝 Chi tiết báo cáo sự cố: #{{ selectedReport.reportId }}

        <v-chip
          :color="getStatusColor(selectedReport.status)"
          text-color="white"
        >
          {{ selectedReport.status }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-row dense class="mb-4">
          <v-col cols="12" class="d-flex justify-center">
            <v-img :src="selectedReport.image" class="rounded"></v-img>
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <strong>Người gửi:</strong>
            {{ selectedReport.creator }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>MSSV:</strong> {{ selectedReport.studentId }}
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <strong>Khu nhà:</strong> Khu {{ selectedReport.building }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Phòng:</strong> {{ selectedReport.room }}
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <strong>Danh mục:</strong> {{ selectedReport.category }}
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <strong>Tiêu đề:</strong> {{ selectedReport.title }}
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12">
            <strong>Mô tả:</strong>
            {{ selectedReport.description }}
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12" sm="6">
            <strong>Thời gian báo:</strong>
            {{ formatDate(selectedReport.createdAt) }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Thời gian hoàn thành:</strong>
            {{ formatDate(selectedReport.completedAt) }}
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end pa-2">
        <v-btn color="primary" variant="outlined" @click="detailDialog = false"
          >Đóng</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar -->
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    :color="snackbarColor"
    rounded="pill"
    location="top right"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<style scoped>
.v-card {
  background-color: #f5f5f5;
}

.text-h5 {
  font-weight: bold;
  color: #4a4a4a;
}

.text-body-2 {
  color: #6a6a6a;
}

.v-chip {
  font-size: 12px;
}

.v-chip {
  margin: 0 !important;
  padding: 2px 8px !important;
}

.v-select .v-select__selections {
  margin: 0 !important;
}
</style>
