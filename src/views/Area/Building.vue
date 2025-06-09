<script setup>
import { ref, computed, onMounted } from "vue";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_BUILDING } from "@/services/stores";

const {
  onActionCreateBuilding,
  onActionGetBuildings,
  onActionUpdateBuilding,
  onActionDeleteBuilding,
} = STORE_BUILDING.StoreBuilding();

const searchQuery = ref("");
const selectedTypeFilter = ref("Tất cả");
const confirmDeleteDialog = ref(false);
const addDialog = ref(false);
const editDialog = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

const dormData = ref({
  name: "",
  type: "",
  rooms: 0,
  peoplePerRoom: 0,
  rentedStudents: 0,
  damagedRooms: 0,
});

const dorms = ref([]);

const headers = [
  { title: "STT", key: "index", align: "center" },
  { title: "Tên khu", key: "name", align: "center" },
  { title: "Loại khu", key: "type", align: "center" },
  { title: "Số lượng phòng", key: "rooms", align: "center" },
  { title: "Định mức ở", key: "peoplePerRoom", align: "center" },
  { title: "Số lượng ở", key: "rentedStudents", align: "center" },
  { title: "Phòng hỏng", key: "damagedRooms", align: "center" },
  { title: "Hành động", key: "actions", align: "center", sortable: false },
];

const filteredDorms = computed(() => {
  return dorms.value?.filter((d) => {
    const matchesName = d?.name
      .toLowerCase()
      .includes(searchQuery.value?.toLowerCase());
    const matchesType =
      selectedTypeFilter?.value === "Tất cả" ||
      d.type === selectedTypeFilter?.value;
    return matchesName && matchesType;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedTypeFilter.value = "Tất cả";
};

const fetchBuildings = async () => {
  await onActionGetBuildings().then((res) => {
    console.log(res);
    dorms.value = res?.data;
  });
};

const openAddDialog = () => {
  dormData.value = {
    name: "",
    type: "",
    rooms: null,
    peoplePerRoom: null,
    damagedRooms: 0,
  };
  addDialog.value = true;
};

const editDorm = (dorm, index) => {
  dormData.value = { ...dorm };
  editDialog.value = true;
};

const isFormValid = computed(
  () =>
    dormData.value.name &&
    dormData.value.type &&
    dormData.value.rooms &&
    dormData.value.peoplePerRoom
);

const createDorm = () => {
  onActionCreateBuilding(dormData.value)
    .then(() => {
      return fetchBuildings();
    })
    .then(() => {
      addDialog.value = false;
      snackbarMessage.value = "Tạo khu nhà thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;
    })
    .catch((error) => {
      console.error(error);

      // Nếu backend có trả message
      const message = error?.response?.data?.message || "Tạo khu nhà thất bại!";
      snackbarMessage.value = message;
      snackbarColor.value = "red";
      snackbar.value = true;
    });
};

const updateDorm = () => {
  if (!dormData.value.damagedRooms && dormData.value.damagedRooms !== 0) {
    dormData.value.damagedRooms = 0;
  }

  const id = dormData.value._id;

  onActionUpdateBuilding(id, dormData.value)
    .then(() => {
      return fetchBuildings();
    })
    .then(() => {
      editDialog.value = false;

      // Snackbar thành công
      snackbarMessage.value = "Cập nhật khu nhà thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;
    })
    .catch((error) => {
      console.error(error);

      // Snackbar lỗi
      snackbarMessage.value = "Cập nhật khu nhà thất bại!";
      snackbarColor.value = "red";
      snackbar.value = true;
    });
};

const confirmDelete = (dorm) => {
  dormData.value = { ...dorm };
  confirmDeleteDialog.value = true;
};

const deleteDorm = async () => {
  await onActionDeleteBuilding(dormData.value._id);
  await fetchBuildings();
  confirmDeleteDialog.value = false;
};

const handleExport = () => {
  const data = filteredDorms.value?.map((item, index) => ({
    STT: index + 1,
    "Tên khu": item.name,
    "Loại khu": item.type,
    "Số lượng phòng": item.rooms,
    "Định mức ở": item.peoplePerRoom,
    "Số lượng ở": item.rentedStudents,
    "Phòng hỏng": item.damagedRooms,
  }));

  exportToExcel(data, "danh-sach-khu-nha");
};

onMounted(async () => {
  await fetchBuildings();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <v-card class="pa-4 bg-white">
          <div class="text-h5 font-weight-bold text-blue-darken-3">
            Quản lý khu ký túc xá
          </div>
          <div class="text-body-2 text-blue-grey-darken-1">
            Quản lý danh sách khu nhà trong ký túc xá
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="pa-4 bg-white" elevation="2">
      <v-row dense class="d-flex align-center">
        <v-col cols="12" md="4">
          <span style="font-size: 14px">Từ khóa tìm kiếm:</span>
          <v-text-field
            v-model="searchQuery"
            placeholder="Tìm kiếm khu KTX"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Loại khu:</span>
          <v-select
            v-model="selectedTypeFilter"
            :items="['Tất cả', 'Khu nam', 'Khu nữ']"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn
            color="cyan-darken-2"
            prepend-icon="mdi-filter-off-outline"
            @click="resetFilters"
            variant="outlined"
          >
            Làm mới
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Table -->
    <v-card class="mt-4" elevation="2">
      <div class="d-flex align-center justify-space-between">
        <div class="pa-3 d-flex align-center" style="font-size: 14px">
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              filteredDorms?.length
            }}</v-chip>
          </span>
        </div>
        <div class="d-flex">
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
          <div class="d-flex justify-end pr-3">
            <v-btn
              color="cyan-darken-2"
              prepend-icon="mdi-plus-circle"
              elevation="0"
              @click="openAddDialog"
            >
              Thêm khu mới
            </v-btn>
          </div>
        </div>
      </div>
      <v-data-table :items="filteredDorms" :headers="headers">
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.name="{ item }"> Khu {{ item.name }} </template>

        <template v-slot:item.type="{ item }">
          <v-chip :color="item.type === 'Khu nam' ? 'blue' : 'pink'">
            {{ item.type }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item, index }">
          <v-btn
            color="cyan-darken-2"
            rounded="lg"
            size="small"
            elevation="0"
            icon="mdi mdi-square-edit-outline"
            variant="text"
            @click="editDorm(item, index)"
          >
            <v-tooltip activator="parent" location="top">Chỉnh sửa</v-tooltip>
            <v-icon class="mdi mdi-square-edit-outline"></v-icon>
          </v-btn>

          <v-btn
            icon="mdi-delete"
            color="red-lighten-1"
            rounded="lg"
            size="small"
            elevation="0"
            variant="text"
            @click="confirmDelete(item)"
          >
            <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
            <v-icon class="mdi mdi-delete"></v-icon>
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="text-center pa-16">
            <v-icon size="48" class="text-grey-lighten-1 text-h2"
              >mdi-home-off</v-icon
            >
            <p class="text-grey-darken-1 text-subtitle-1 font-italic">
              Không có khu ký túc xá nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Thêm -->
  <v-dialog v-model="addDialog" max-width="500px">
    <v-card class="pa-8">
      <div class="text-h5 font-weight-bold mb-4">Thêm mới khu ký túc xá</div>

      <span>Tên khu:</span>
      <v-text-field
        v-model="dormData.name"
        placeholder="Tên khu"
        variant="outlined"
        density="compact"
      />

      <span>Loại khu:</span>
      <v-select
        v-model="dormData.type"
        :items="['Khu nam', 'Khu nữ']"
        variant="outlined"
        density="compact"
      />

      <span>Số lượng phòng trong khu nhà:</span>
      <v-text-field
        v-model="dormData.rooms"
        type="number"
        placeholder="Số lượng phòng"
        variant="outlined"
        density="compact"
      />

      <span>Định mức ở:</span>
      <v-text-field
        v-model="dormData.peoplePerRoom"
        type="number"
        placeholder="Định mức ở"
        variant="outlined"
        density="compact"
      />

      <span>Số phòng hỏng:</span>
      <v-text-field
        v-model="dormData.damagedRooms"
        type="number"
        placeholder="Số phòng hỏng"
        variant="outlined"
        density="compact"
      />

      <div class="d-flex justify-end ga-3 mt-4">
        <v-btn variant="text" color="grey" @click="addDialog = false"
          >Hủy</v-btn
        >
        <v-btn
          color="secondary"
          elevation="0"
          :disabled="!isFormValid"
          @click="createDorm"
          >Thêm</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <!-- Sửa -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card class="pa-8">
      <div class="text-h5 font-weight-bold mb-4">Chỉnh sửa khu ký túc xá</div>

      <!-- Các trường giống như trên -->
      <span>Tên khu:</span>
      <v-text-field
        v-model="dormData.name"
        placeholder="Tên khu"
        variant="outlined"
        density="compact"
      />
      <span>Loại khu:</span>
      <v-select
        v-model="dormData.type"
        :items="['Khu nam', 'Khu nữ']"
        variant="outlined"
        density="compact"
      />
      <span>Số lượng phòng trong khu nhà:</span>
      <v-text-field
        v-model="dormData.rooms"
        type="number"
        placeholder="Số lượng phòng"
        variant="outlined"
        density="compact"
      />
      <span>Định mức ở:</span>
      <v-text-field
        v-model="dormData.peoplePerRoom"
        type="number"
        placeholder="Định mức ở"
        variant="outlined"
        density="compact"
      />
      <span>Số phòng hỏng:</span>
      <v-text-field
        v-model="dormData.damagedRooms"
        type="number"
        placeholder="Số phòng hỏng"
        variant="outlined"
        density="compact"
      />

      <div class="d-flex justify-end ga-3 mt-4">
        <v-btn variant="text" color="grey" @click="editDialog = false"
          >Hủy</v-btn
        >
        <v-btn
          color="secondary"
          elevation="0"
          :disabled="!isFormValid"
          @click="updateDorm"
          >Lưu</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <!-- Xác nhận xóa -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <p class="pa-6 text-center text-grey-darken-3">
        Bạn có chắc chắn muốn xóa khu ký túc xá này?
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
        <v-btn color="red" @click="deleteDorm" class="ml-2" variant="tonal">
          Xóa
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
  >
    {{ snackbarMessage }}
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

.v-data-table td {
  text-align: center;
}
</style>
