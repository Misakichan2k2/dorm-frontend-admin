<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_ACCOUNT } from "@/services/stores";

const { onActionGetAllAccounts, onActionUpdateStatus, onActionDeleteAccount } =
  STORE_ACCOUNT.StoreAccount();

const router = useRouter();

const searchQuery = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");
const confirmDeleteDialog = ref(false);
const userToDelete = ref(null);
const snackbarColor = ref("success");

const statusFilter = ref("");

const users = ref([]);

const fetchUsers = async () => {
  await onActionGetAllAccounts().then((res) => {
    console.log(res);
    users.value = res?.data;
  });
};

const headers = [
  { title: "ID người dùng", key: "userId", align: "center" },
  { title: "Họ tên", key: "fullname" },
  { title: "Email", key: "email" },
  { title: "Ngày tạo", key: "createdAt", align: "center" },
  { title: "Trạng thái", key: "status", align: "center" },
  { title: "Hành động", key: "actions", align: "center", sortable: false },
];

const formatDateTime = (date) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm");
};

const createdDateFilter = ref(null);

const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Bị ban", value: "banned" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "green";
    case "banned":
      return "red";
    default:
      return "grey";
  }
};

const getStatusLabel = (status) => {
  const found = statusOptions.find((opt) => opt.value === status);
  return found ? found.label : status;
};

const filteredUsers = computed(() => {
  return users?.value?.filter((user) => {
    const keyword = searchQuery.value.toLowerCase();

    const matchesKeyword =
      user?.fullname?.toLowerCase().includes(keyword) ||
      user?.email?.toLowerCase().includes(keyword);

    const matchesStatus =
      !statusFilter.value ||
      statusFilter.value === "Tất cả" ||
      user.status === statusFilter.value;

    const matchesCreatedDate =
      !createdDateFilter.value ||
      format(new Date(user.createdAt), "yyyy-MM-dd") ===
        format(new Date(createdDateFilter.value), "yyyy-MM-dd");

    return matchesKeyword && matchesStatus && matchesCreatedDate;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  statusFilter.value = "Tất cả";
  createdDateFilter.value = null;
};

const viewDetails = (rowData) => {
  router.push(`account/detail/${rowData._id}`);
};

const toggleBan = async (user) => {
  const newStatus = user.status === "banned" ? "active" : "banned";

  const success = await onActionUpdateStatus(user._id, newStatus);

  if (success) {
    await fetchUsers();
    const actionText = newStatus === "banned" ? "đã bị ban" : "được gỡ ban";
    showSnackbar(`Tài khoản ${user.fullname} ${actionText}.`);
  } else {
    showSnackbar("Có lỗi xảy ra khi cập nhật trạng thái.", "error");
  }
};

const deleteUser = (user) => {
  userToDelete.value = user;
  confirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  const success = await onActionDeleteAccount(userToDelete.value._id);

  if (success) {
    showSnackbar(
      `Tài khoản ${userToDelete.value.fullname} đã được xóa.`,
      "success"
    );
    await fetchUsers();
  } else {
    showSnackbar("Xóa tài khoản thất bại.", "error");
  }

  confirmDeleteDialog.value = false;
  userToDelete.value = null;
};

const showSnackbar = (message, color = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const handleExport = () => {
  const data = filteredUsers.value.map((user) => ({
    "ID người dùng": user.userId,
    "Họ tên": user.fullname,
    Email: user.email,
    "Ngày tạo": formatDateTime(user.createdAt),
    "Trạng thái": user.status,
  }));

  exportToExcel(data, "danh-sach-tai-khoan");
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <v-card class="pa-4" elevation="2">
          <div class="text-h5 font-weight-bold text-blue-darken-3">
            Quản lý tài khoản
          </div>
          <div class="text-body-2 text-blue-grey-darken-1">
            Quản lý thông tin cá nhân và trạng thái hoạt động của tài khoản
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter section -->
    <v-card class="pa-4" elevation="2">
      <v-row dense>
        <v-col cols="12" md="4">
          <span style="font-size: 14px">Từ khóa tìm kiếm:</span>
          <v-text-field
            v-model="searchQuery"
            placeholder="Tên hoặc email"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Trạng thái:</span>
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Ngày tạo:</span>
          <v-date-input
            v-model="createdDateFilter"
            placeholder="Chọn ngày"
            variant="outlined"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2" class="d-flex align-center">
          <v-btn
            color="cyan-darken-2"
            prepend-icon="mdi-filter-off-outline"
            variant="outlined"
            @click="resetFilters"
          >
            Làm mới
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Table section -->
    <v-card class="mt-4" elevation="2" style="background-color: #f5f5f5">
      <div class="d-flex align-center justify-space-between">
        <div class="pa-3 d-flex align-center">
          <span
            class="text-blue-grey-darken-2 font-weight-bold"
            style="font-size: 14px"
          >
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              filteredUsers.length
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
        :items="filteredUsers"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.createdAt="{ item }">
          {{ formatDateTime(item.createdAt) }}
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" text-color="white" small>
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div
            :style="
              item.status === 'Đã xóa'
                ? 'pointer-events: none; opacity: 0.5;'
                : ''
            "
          >
            <v-btn
              color="cyan-darken-2"
              rounded="lg"
              size="small"
              elevation="0"
              icon="mdi-account-details"
              variant="text"
              @click="viewDetails(item)"
            >
              <v-tooltip activator="parent" location="top"
                >Xem chi tiết</v-tooltip
              >
              <v-icon class="mdi mdi-account-details"></v-icon>
            </v-btn>

            <v-btn
              icon="mdi-cancel"
              color="orange-lighten-2"
              rounded="lg"
              size="small"
              elevation="0"
              class="text-white"
              variant="text"
              @click="toggleBan(item)"
            >
              <v-tooltip activator="parent" location="top">
                {{ item.status === "banned" ? "Gỡ ban" : "Ban" }}
              </v-tooltip>
              <v-icon class="mdi mdi-cancel"></v-icon>
            </v-btn>

            <v-btn
              icon="mdi-delete"
              color="red-lighten-1"
              rounded="lg"
              size="small"
              elevation="0"
              variant="text"
              @click="deleteUser(item)"
            >
              <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
              <v-icon class="mdi mdi-delete"></v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-account-off text-h2 text-grey-lighten-1"></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có tài khoản nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Dialog xóa -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <p class="pa-6 text-center text-grey-darken-3">
        Bạn có chắc chắn muốn xóa tài khoản
        <strong>{{ userToDelete?.fullname }}</strong
        >?
      </p>

      <v-divider></v-divider>

      <v-card-actions class="justify-center pa-3">
        <v-btn
          color="grey"
          @click="confirmDeleteDialog = false"
          class="mr-2"
          variant="text"
        >
          Hủy
        </v-btn>
        <v-btn color="red" @click="confirmDelete" variant="tonal">
          Xác nhận xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    :color="snackbarColor"
    location="top right"
    elevation="2"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<style scoped>
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
</style>
