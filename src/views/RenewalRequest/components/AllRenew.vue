<script setup>
import { ref, computed, defineProps, onMounted } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "vue-router";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_RENEWAL } from "@/services/stores";

const {
  onActionGetAllRenewals,
  onActionGetRenewalById,
  onActionUpdateRenewalStatus,
  onActionUpdateRenewalFormDetail,
} = STORE_RENEWAL.StoreRenewal();

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
    key: "renewalRequestId",
    sortable: false,
    align: "center",
  },
  { title: "Họ và tên", key: "student.registration.fullname" },
  {
    title: "Mã số sinh viên",
    key: "student.registration.studentId",
    align: "center",
  },
  { title: "Giới tính", key: "student.registration.gender", align: "center" },
  { title: "Ngày gửi", key: "createdAt" },
  { title: "Khu", key: "stdent.registration.room.building.name" },
  { title: "Phòng", key: "student.registration.room.room" },
  { title: "Hình thức thanh toán", key: "paymentMethod", align: "center" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Hành động", key: "actions", align: "center", sortable: false },
];

const searchQuery = ref("");
const statusFilter = ref("Tất cả");
const buildingFilter = ref("Tất cả");
const roomFilter = ref("Tất cả");
const genderFilter = ref("Tất cả");

const buildingOptions = ["Tất cả", "A1", "B2"];
const roomOptions = ["Tất cả", "101", "203", "105"];
const genderOptions = ["Tất cả", "Nam", "Nữ"];
const statusOptions = [
  "Tất cả",
  "Chờ xử lý",
  "Chấp nhận",
  "Từ chối",
  "Hoàn tiền",
];

const requests = ref([
  // {
  //   registrationCode: "RR12021",
  //   studentName: "Nguyễn Văn A",
  //   studentId: "SV001",
  //   gender: "Nam",
  //   date: "2025-04-01",
  //   building: "A1",
  //   room: "101",
  //   paymentMethod: "Tiền mặt",
  //   status: "Chờ xử lý",
  // },
]);

const fetchRenewals = () => {
  onActionGetAllRenewals()
    .then((res) => {
      requests.value = res.data;
    })
    .catch(console.error);
};

const getStatusColor = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return "blue";
    case "Chấp nhận":
      return "green";
    case "Từ chối":
      return "red";
    default:
      return "grey";
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

function onPaymentMethodChange(item) {
  console.log("Payment method changed:", item.paymentMethod);

  snackbarText.value = `Đã chọn hình thức thanh toán: ${item.paymentMethod}`;
  snackbar.value = true;
}

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

const filteredRequests = computed(() => {
  return requests.value.filter((item) => {
    const keyword = searchQuery.value.toLowerCase();
    const matchesKeyword =
      item?.student?.registration?.fullname?.toLowerCase().includes(keyword) ||
      item?.student?.registration?.studentId?.toLowerCase().includes(keyword) ||
      item?.renewalRequestId?.toLowerCase().includes(keyword);

    const matchesStatus =
      props.statusFilter === "Tất cả" || item.status === props.statusFilter;

    const matchesBuilding =
      !buildingFilter.value ||
      buildingFilter.value === "Tất cả" ||
      item?.stdent?.registration?.room?.building?.name === buildingFilter.value;

    const matchesRoom =
      !roomFilter.value ||
      roomFilter.value === "Tất cả" ||
      item?.stdent?.registration?.room?.room === roomFilter.value;

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

const onStatusChange = (item) => {
  snackbarText.value = `Đã cập nhật trạng thái thành "${item.status}" cho "${item.studentName}"`;
  snackbar.value = true;
};

const detailRequest = () => {
  router.push("/renew-student-detail");
};

const snackbar = ref(false);
const snackbarText = ref("");

const dialogNote = ref(false);
const note = ref("");

const saveNote = () => {
  console.log("Ci tiết:", note.value);

  snackbarText.value = "Đã lưu chi tiết đơn đăng ký phòng!";
  snackbar.value = true;

  dialogNote.value = false;
};

const handleExport = () => {
  const data = filteredRequests.value.map((item, index) => ({
    STT: index + 1,
    "Họ và tên": item.studentName,
    "Mã số sinh viên": item.studentId,
    "Giới tính": item.gender,
    "Ngày gửi": formatDate(item.date),
    Khu: item.building,
    Phòng: item.room,
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-yeu-cau-gia-han-phong");
};

onMounted(() => {
  fetchRenewals();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Filter section -->
    <v-card class="pa-4 bg-white" elevation="2">
      <div class="mb-5 text-center" flat>
        <div class="text-h5 font-weight-bold text-blue-darken-3">
          Quản lý yêu cầu gia hạn thuê phòng
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
            :items="buildingOptions"
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
        :items-per-page="5"
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

        <template #item.paymentMethod="{ item }">
          <v-select
            v-model="item.paymentMethod"
            :items="paymentMethods"
            variant="plain"
            density="compact"
            hide-details
            @update:modelValue="onPaymentMethodChange(item)"
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
            :items="statusOptions.filter((s) => s !== 'Tất cả')"
            variant="plain"
            density="compact"
            hide-details
            @update:modelValue="onStatusChange(item)"
          >
            <template #selection="{ item: statusItem }">
              <div style="margin-right: -1rem">
                <v-chip
                  :color="getStatusColor(statusItem.value)"
                  text-color="white"
                  small
                >
                  {{ statusItem.value }}
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
              @click="detailRequest"
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
              @click="dialogNote = true"
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
  <v-dialog v-model="dialogNote" max-width="500" persistent>
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
