<script setup>
import { ref, computed, defineProps, onMounted, watch } from "vue";
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
  data: {
    type: Array,
    default: [],
  },
});

const emits = defineEmits(["onSearch", "callApi"]);

const dataRegistration = computed(() => props?.data);

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
  { title: "Thời gian thuê", key: "duration" },
  { title: "Hình thức thanh toán", key: "paymentMethod" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Hành động", key: "actions", align: "center", sortable: false },
];

const searchQuery = ref("");
const statusFilter = ref("");
const buildingFilter = ref("");
const roomFilter = ref("");
const genderFilter = ref("");
const genderOptions = ["Tất cả", "Nam", "Nữ"];

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("green");

const requests = ref([]);
const buildings = ref([]);
const rooms = ref([]);
const dialogNote = ref(false);
const note = ref("");
const selectedItem = ref({ _id: null });

const fetchRegistrations = async () => {
  await onActionGetAllRegistrations().then((res) => {
    requests.value = res?.data?.data;
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
      return "purple";
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
  openDialogNote(item);
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

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "";
  buildingFilter.value = "";
  roomFilter.value = "";
  genderFilter.value = "";
};

const openDialogNote = (item, isDetail = false) => {
  selectedItem.value = item;

  if (isDetail) {
    console.log(item);

    note.value = item.registerFormDetail || "";
  } else {
    if (item?.status === "approved") {
      note.value = `Đơn đăng ký phòng của bạn đã được duyệt. Thời gian thuê phòng bắt đầu từ ngày ${formatDate(
        item.startDate
      )}. Vui lòng đến phòng quản lý ký túc xá để nhận chìa khóa.`;
    } else if (item?.status === "rejected") {
      note.value =
        "Rất tiếc, đơn đăng ký phòng của bạn đã bị từ chối. Ngoài ra, bạn vui lòng đến phòng Quản lý Ký túc xá để nhận lại số tiền đã thanh toán. Mọi thắc mắc xin liên hệ ban quản lý ký túc xá";
    } else if (item?.status === "pending") {
      note.value =
        "Đơn đăng ký phòng của bạn đang chờ được xét duyệt. Vui lòng đợi hoặc liên hệ ban quản lý để biết thêm chi tiết.";
    } else if (item?.status === "unpaid") {
      note.value =
        "Bạn chưa thanh toán. Vui lòng hoàn tất thanh toán trong vòng 24 giờ kể từ khi tạo đơn để đơn đăng ký không bị hủy.";
    } else if (item?.status === "refunded") {
      note.value = `Việc hoàn trả tiền cho sinh viên đã được thực hiện thành công.`;
    } else {
      note.value = ``;
    }
  }

  dialogNote.value = true;
};

const saveNote = async () => {
  await onActionUpdateRegisterFormDetail(selectedItem.value._id, note.value);

  await onActionUpdateRegistrationStatus(
    selectedItem.value._id,
    selectedItem.value.status
  )
    .then(() => {
      snackbarText.value = `Đã cập nhật trạng thái thành "${getStatusLabel(
        selectedItem.value.status
      )}" cho sinh viên "${selectedItem.value.fullname}"`;
      snackbarColor.value = "success";
      snackbar.value = true;
    })
    .catch(() => {
      snackbarText.value = `Cập nhật trạng thái cho sinh viên "${selectedItem.value.fullname}" thất bại!`;
      snackbarColor.value = "error";
      snackbar.value = true;
    })
    .finally(async () => {
      emits("callApi");

      dialogNote.value = false;
    });
};

const handleExport = () => {
  const data = dataRegistration.value?.map((item, index) => ({
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

const fetchFilteredData = async () => {
  const params = {
    search: searchQuery.value,
    building: buildingFilter.value === "Tất cả" ? null : buildingFilter.value,
    room: roomFilter.value === "Tất cả" ? null : roomFilter.value,
    gender: genderFilter.value === "Tất cả" ? null : genderFilter.value,
  };

  emits("onSearch", params);
};

watch(
  [searchQuery, buildingFilter, roomFilter, genderFilter],
  fetchFilteredData
);

onMounted(() => {
  // fetchRegistrations();
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
          Xử lý yêu cầu đăng ký phòng
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
            item-title="title"
            item-value="value"
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
              dataRegistration.length
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
        :items="dataRegistration"
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

        <template v-slot:item.duration="{ item }">
          {{ formatDate(item.startDate) }}
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
              @click="openDialogNote(item, true)"
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
    :color="snackbarColor"
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
