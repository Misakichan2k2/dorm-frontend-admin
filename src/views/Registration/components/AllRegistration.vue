<script setup>
import { ref, computed, defineProps, onMounted } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "vue-router";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_REGISTRATION } from "@/services/stores";

const {
  onActionGetAllRegistrations,
  onActionGetBuildings,
  onActionGetRooms,
  onActionUpdateRegistrationPaymentMethod,
  onActionUpdateRegistrationStatus,
  onActionUpdateRegisterFormDetail,
} = STORE_REGISTRATION.StoreRegistration();

const router = useRouter();

const props = defineProps({
  statusFilter: {
    type: String,
    default: "Tất cả",
  },
});

const headers = [
  { title: "STT", key: "index", sortable: false, align: "center" },
  {
    title: "Mã yêu cầu",
    key: "registrationCode",
    sortable: false,
    align: "center",
  },
  { title: "Họ và tên", key: "fullname" },
  { title: "Mã số sinh viên", key: "studentId", align: "center" },
  { title: "Giới tính", key: "gender", align: "center" },
  { title: "Ngày gửi", key: "createdAt" },
  { title: "Khu", key: "room.building.name" },
  { title: "Phòng", key: "room.room" },
  { title: "Hình thức thanh toán", key: "paymentMethod" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Hành động", key: "actions", align: "center", sortable: false },
];

const searchQuery = ref("");
const statusFilter = ref("Tất cả");
const buildingFilter = ref("Tất cả");
const roomFilter = ref("Tất cả");
const genderFilter = ref("Tất cả");
const genderOptions = ["Tất cả", "Nam", "Nữ"];

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("green");

const requests = ref([]);
const buildings = ref([]);
const rooms = ref([]);

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

const buildingOptionsFilter = computed(() => [
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

const statusOptions = [
  { label: "Chưa thanh toán", value: "unpaid" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Chấp nhận", value: "approved" },
  { label: "Từ chối", value: "rejected" },
  { label: "Bị hủy", value: "canceled" },
  { label: "Hoàn tiền", value: "refunded" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "green";
    case "pending":
      return "blue";
    case "unpaid":
      return "orange";
    case "rejected":
      return "red";
    case "canceled":
      return "grey";
    default:
      return "yellow";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "approved":
      return "Chấp nhận";
    case "pending":
      return "Chờ xử lý";
    case "unpaid":
      return "Chưa thanh toán";
    case "rejected":
      return "Từ chối";
    case "canceled":
      return "Bị hủy";
    default:
      return "Hoàn tiền";
  }
};

const onStatusChange = async (item) => {
  console.log(item);

  try {
    await onActionUpdateRegistrationStatus(item._id, item.status);

    snackbarText.value = `Đã cập nhật trạng thái thành "${getStatusLabel(
      item.status
    )}" cho sinh viên "${item.fullname}"`;
    snackbarColor.value = "success";
    snackbar.value = true;

    fetchRegistrations();
  } catch (error) {
    snackbarText.value = `Cập nhật trạng thái cho sinh viên "${item.fullname}" thất bại!`;
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const paymentMethods = ["Chuyển khoản", "Tiền mặt"];

function getpaymentMethodColor(value) {
  switch (value) {
    case "Chuyển khoản":
      return "blue";
    case "Tiền mặt":
      return "green";
    default:
      return "grey";
  }
}

const onUpdatePaymentMethod = async (item) => {
  try {
    await onActionUpdateRegistrationPaymentMethod(item._id, item.paymentMethod);
    snackbarText.value = `Cập nhật phương thức thanh toán cho sinh viên "${item.fullname}" thành công.`;
    snackbarColor.value = "green";
  } catch (error) {
    snackbarText.value = `Cập nhật thất bại: ${
      error.response?.data?.message || error.message
    }`;
    snackbarColor.value = "red";
  } finally {
    snackbar.value = true;
  }
};

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

const filteredRequests = computed(() => {
  return requests.value.filter((item) => {
    const keyword = searchQuery.value.toLowerCase();

    const matchesKeyword =
      (item.fullname?.toLowerCase().includes(keyword) ?? false) ||
      (item.studentId?.toLowerCase().includes(keyword) ?? false) ||
      (item.registrationCode?.toLowerCase().includes(keyword) ?? false);

    const matchesStatus =
      props.statusFilter === "Tất cả" || item.status === props.statusFilter;

    const matchesBuilding =
      !buildingFilter.value ||
      buildingFilter.value === "Tất cả" ||
      item.room.building.name
        .toLowerCase()
        .includes(buildingFilter.value.toLowerCase());

    const matchesRoom =
      !roomFilter.value ||
      roomFilter.value === "Tất cả" ||
      item.room.room === roomFilter.value;

    const matchesGender =
      genderFilter.value === "Tất cả" || item.gender === genderFilter.value;

    return (
      matchesKeyword &&
      matchesStatus &&
      matchesBuilding &&
      matchesRoom &&
      matchesGender
    );
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "Tất cả";
  buildingFilter.value = "Tất cả";
  roomFilter.value = "Tất cả";
  genderFilter.value = "Tất cả";
};

const fetchRegistrations = async () => {
  await onActionGetAllRegistrations().then((res) => {
    console.log(res?.data?.data);
    requests.value = res?.data?.data;
  });
};

const dialogNote = ref(false); // trạng thái dialog
const note = ref("");
const selectedItem = ref(null);

const openDialogNote = (item) => {
  selectedItem.value = item;
  note.value = item.registerFormDetail || "";
  dialogNote.value = true;
};

const saveNote = async () => {
  try {
    await onActionUpdateRegisterFormDetail(selectedItem.value._id, note.value);

    await fetchRegistrations();

    snackbarText.value = "Đã lưu chi tiết đơn đăng ký phòng!";
    snackbarColor.value = "green";
  } catch (error) {
    snackbarText.value =
      "Lưu thất bại: " + (error.response?.data?.message || error.message);
    snackbarColor.value = "red";
  } finally {
    snackbar.value = true;
    dialogNote.value = false;
  }
};

const handleExport = () => {
  const data = filteredRequests.value.map((item, index) => ({
    STT: index + 1,
    "Họ và tên": item.fullname,
    "Mã số sinh viên": item.studentId,
    "Giới tính": item.gender,
    "Ngày gửi": formatDate(item.createdAt),
    Khu: item.room.building.name,
    Phòng: item.room.room,
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-dang-ky-phong");
};

const detailRequest = (rowData) => {
  router.push(`/registration/detail/${rowData._id}`);
};

onMounted(() => {
  fetchRegistrations();
  fetchBuildings();
  fetchRooms();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Filter section -->
    <v-card class="pa-4 bg-white" elevation="2">
      <div class="mb-5 text-center" flat>
        <div class="text-h5 font-weight-bold text-blue-darken-3">
          Quản lý yêu cầu đăng ký phòng
        </div>
      </div>
      <v-row dense>
        <v-col cols="12" md="3">
          <span>Từ khóa tìm kiếm:</span>
          <v-text-field
            v-model="searchQuery"
            placeholder="Tên, MSSV, Mã yêu cầu..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <span>Khu nhà:</span>
          <v-combobox
            v-model="buildingFilter"
            :items="buildingOptionsFilter"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <span>Phòng:</span>
          <v-combobox
            v-model="roomFilter"
            :items="roomOptions"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <span>Giới tính:</span>
          <v-select
            v-model="genderFilter"
            :items="genderOptions"
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

    <!-- Table section -->
    <v-card class="mt-4" elevation="2">
      <div class="d-flex align-center justify-space-between">
        <div class="pa-3 d-flex align-center">
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              filteredRequests.length
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
        :items="filteredRequests"
        :items-per-page="10"
        ref="pdfTable"
        class="elevation-1"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.gender="{ item }">
          <v-chip :color="item.gender === 'Nam' ? 'blue' : 'pink'">{{
            item.gender
          }}</v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.room.building.name="{ item }">
          Khu {{ item.room.building.name }}
        </template>

        <template #item.paymentMethod="{ item }">
          <v-select
            v-model="item.paymentMethod"
            :items="paymentMethods"
            variant="plain"
            density="compact"
            hide-details
            @update:modelValue="onUpdatePaymentMethod(item)"
          >
            <template #selection="{ item: method }">
              <div style="margin-right: -5rem">
                <v-chip
                  :color="getpaymentMethodColor(method.value)"
                  text-color="white"
                  small
                >
                  {{ method.value }}
                </v-chip>
              </div>
            </template>
          </v-select>
        </template>

        <template #item.status="{ item }">
          <v-select
            v-model="item.status"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            variant="plain"
            density="compact"
            hide-details
            @update:modelValue="() => onStatusChange(item)"
          >
            <template #selection="{ item: statusItem }">
              <div style="margin-right: 2rem">
                <v-chip
                  :color="getStatusColor(statusItem.value)"
                  text-color="white"
                  small
                >
                  {{ statusItem.raw.label }}
                </v-chip>
              </div>
            </template>
          </v-select>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-1 justify-center">
            <v-btn
              color="cyan-darken-2"
              v-bind="props"
              icon="mdi-account-details"
              elevation="0"
              variant="text"
              rounded="lg"
              size="small"
              @click="detailRequest(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Xem chi tiết</v-tooltip
              ></v-btn
            >

            <v-btn
              color="cyan-darken-2"
              v-bind="props"
              icon="mdi-note-edit-outline"
              elevation="0"
              variant="text"
              rounded="lg"
              size="small"
              @click="openDialogNote(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Thêm chi tiết</v-tooltip
              ></v-btn
            >
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-file-remove text-h2 text-grey-lighten-1"></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có yêu cầu nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    color="success"
    rounded="pill"
    location="top right"
  >
    {{ snackbarText }}
  </v-snackbar>

  <!-- Dialog Thêm chi tiết đơn đăng ký phòng -->
  <v-dialog v-model="dialogNote" max-width="500">
    <v-card class="rounded-lg elevation-10">
      <v-card-title class="text-h6 font-weight-bold text-blue-600">
        📝 Thêm chi tiết đơn đăng ký phòng
      </v-card-title>

      <v-card-text class="pt-2">
        <v-textarea
          v-model="note"
          label="Nhập chi tiết..."
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

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
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
  margin: 0 !important;
  padding: 2px 8px !important;
}

.v-select .v-select__selections {
  margin: 0 !important;
}
</style>
