<script setup>
import { ref, computed, onMounted } from "vue";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_ROOM } from "@/services/stores";

const {
  onActionGetRooms,
  onActionGetBuildings,
  onActionCreateRoom,
  onActionUpdateRoom,
  onActionDeleteRoom,
} = STORE_ROOM.StoreRoom();

const search = ref("");
const selectedGender = ref("Tất cả");
const selectedBuilding = ref("Tất cả");
const availableSeats = ref("");
const selectedStatus = ref("Tất cả");
const dialogNewRoom = ref(false);
const dialogEditRoom = ref(false);
const selectedRoom = ref(null);
const confirmDeleteDialog = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

const buildings = ref([]);
const roomTable = ref([]);

const headers = [
  { align: "center", key: "index", sortable: false, title: "STT" },
  { align: "center", key: "building.name", title: "Khu nhà" },
  { align: "center", key: "room", title: "Số phòng" },
  { align: "center", key: "gender", title: "Giới tính" },
  { align: "center", key: "price", title: "Giá (VNĐ)" },
  { align: "center", key: "building.peoplePerRoom", title: "Định mức ở" },
  { align: "center", key: "rented", title: "Số lượng ở" },
  { align: "center", key: "empty", title: "Còn trống" },
  { align: "center", key: "status", title: "Trạng thái" },
  { align: "center", key: "action", title: "Hành động", sortable: false },
];

const fetchRooms = async () => {
  await onActionGetRooms().then((res) => {
    console.log(res);
    roomTable.value = res?.data;
  });
};

const fetchBuildings = () => {
  onActionGetBuildings()
    .then((res) => {
      buildings.value = res.data; // ✅ Lấy đúng mảng dữ liệu
      console.log("Buildings:", buildings.value);
    })
    .catch(console.error);
};

const buildingOptions = computed(() =>
  buildings.value.map((b) => ({
    title: b.name,
    value: b._id,
  }))
);

const buildingOptionsFilter = computed(() => [
  "Tất cả",
  ...buildings.value.map((b) => b.name).sort((a, b) => a.localeCompare(b)),
  ,
]);

const genderOptions = ["Tất cả", "Nam", "Nữ"];
const statusOptions = ["Tất cả", "Mở", "Đóng", "Hỏng"];

function formatPrice(value) {
  return value.toLocaleString("vi-VN");
}
const filteredRooms = computed(() => {
  return roomTable.value
    .map((room) => ({
      ...room,
    }))
    .filter((room) => {
      return (
        (selectedGender.value === "Tất cả" ||
          room.gender === selectedGender.value) &&
        (selectedBuilding.value === "Tất cả" ||
          room.building.name
            .toLowerCase()
            .includes(selectedBuilding.value.toLowerCase())) &&
        (search.value === "" || room.room.toString().includes(search.value)) &&
        (availableSeats.value === "" ||
          room.empty.toString() === availableSeats.value) &&
        (selectedStatus.value === "Tất cả" ||
          room.status === selectedStatus.value)
      );
    });
});

const resetFilters = () => {
  search.value = "";
  selectedGender.value = "Tất cả";
  selectedBuilding.value = "Tất cả";
  availableSeats.value = "";
  selectedStatus.value = "Tất cả";
};

const newRoom = ref({
  building: "",
  room: "",
  price: "",
  gender: "",
});

const isFormValid = computed(() => {
  return (
    newRoom.value.building &&
    newRoom.value.room &&
    newRoom.value.gender &&
    newRoom.value.price &&
    newRoom.value.status
  );
});

const addRoom = () => {
  onActionCreateRoom(newRoom.value)
    .then(() => {
      dialogNewRoom.value = false;
      return fetchRooms();
    })
    .then(() => {
      snackbarMessage.value = "Thêm phòng thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;

      newRoom.value = {
        building: "",
        room: "",
        gender: "",
        price: "",
      };
    })
    .catch((error) => {
      console.error(error);

      // Lấy message từ backend nếu có
      const message = error?.response?.data?.message || "Thêm phòng thất bại!";
      snackbarMessage.value = message;
      snackbarColor.value = "red";
      snackbar.value = true;
    });
};

const editRoom = (room) => {
  selectedRoom.value = {
    ...room,
    building: room.building._id,
  };
  dialogEditRoom.value = true;
};

const updateRoom = () => {
  // Nếu selectedRoom.value.building là object, lấy _id
  if (
    typeof selectedRoom.value.building === "object" &&
    selectedRoom.value.building !== null
  ) {
    selectedRoom.value.building = selectedRoom.value.building._id;
  }

  onActionUpdateRoom(selectedRoom.value)
    .then(() => {
      dialogEditRoom.value = false;
      fetchRooms();

      snackbarMessage.value = "Cập nhật phòng thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;
    })
    .catch((error) => {
      console.error(error);
      const message =
        error?.response?.data?.message || "Cập nhật phòng thất bại!";
      snackbarMessage.value = message;
      snackbarColor.value = "red";
      snackbar.value = true;
    });
};

const confirmDelete = (room) => {
  selectedRoom.value = { ...room };
  confirmDeleteDialog.value = true;
};

const deleteRoom = () => {
  console.log("Gọi hàm deleteRoom");
  if (!selectedRoom.value || !selectedRoom.value._id) return;

  onActionDeleteRoom(selectedRoom.value._id)
    .then(() => {
      fetchRooms();
      confirmDeleteDialog.value = false;

      snackbarMessage.value = "Xoá phòng thành công!";
      snackbarColor.value = "green";
      snackbar.value = true;
    })
    .catch((error) => {
      console.error(error);
      const message = error?.response?.data?.message || "Xoá phòng thất bại!";
      snackbarMessage.value = message;
      snackbarColor.value = "red";
      snackbar.value = true;
    });
};

const isUpdateFormValid = computed(() => {
  return (
    selectedRoom.value.building &&
    selectedRoom.value.room &&
    selectedRoom.value.gender &&
    selectedRoom.value.price &&
    selectedRoom.value.status
  );
});

const handleExport = () => {
  const data = filteredRooms.value.map((item, index) => ({
    STT: index + 1,
    "khu nhà": item.building.name,
    "Số phòng": item.room,
    "Giới tính": item.gender,
    Giá: item.price,
    "Định mức ở": item.building.peoplePerRoom,
    "Số lượng ở": item.rented,
    "Còn trống": item.empty,
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-phong-o");
};

const onBuildingSelect = (buildingId) => {
  console.log(buildingId);

  const selectedBuilding = buildings?.value?.find((b) => b._id === buildingId);
  if (selectedBuilding) {
    if (selectedBuilding.type.includes("nữ")) {
      newRoom.value.gender = "Nữ";
    } else if (selectedBuilding.type.includes("nam")) {
      newRoom.value.gender = "Nam";
    } else {
      newRoom.value.gender = "";
    }
  } else {
    newRoom.value.gender = "";
  }
};

onMounted(() => {
  fetchRooms();
  fetchBuildings();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12" class="text-center">
        <v-card class="pa-4 bg-white" elevation="2">
          <div class="text-h5 font-weight-bold text-blue-darken-3">
            Quản lý phòng
          </div>
          <div class="text-body-2 text-blue-grey-darken-1">
            Quản lý các phòng ký túc xá cho sinh viên
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter section -->
    <v-card class="pa-4 bg-white" elevation="2">
      <v-row dense>
        <!-- Hàng 1 -->
        <v-col cols="12" md="4">
          <span style="font-size: 14px">Số phòng:</span>
          <v-text-field
            v-model="search"
            placeholder="Số phòng"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Giới tính:</span>
          <v-select
            v-model="selectedGender"
            :items="genderOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Khu nhà:</span>
          <v-combobox
            v-model="selectedBuilding"
            :items="buildingOptionsFilter"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
          ></v-combobox>
        </v-col>

        <!-- Hàng 2 -->
        <v-col cols="12" md="4">
          <span style="font-size: 14px">Chỗ trống:</span>
          <v-text-field
            v-model="availableSeats"
            placeholder="Chỗ trống"
            prepend-inner-icon="mdi-filter-outline"
            variant="outlined"
            density="compact"
            hide-details
            persistent-placeholder
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <span style="font-size: 14px">Trạng thái:</span>
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>

        <!-- Nút làm mới -->
        <v-col cols="12" md="4" class="d-flex align-end justify-start">
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

    <!-- Room Table -->
    <v-card class="mt-4" elevation="2">
      <div class="pa-3 d-flex align-center justify-space-between">
        <div>
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
          </span>
          <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
            filteredRooms.length
          }}</v-chip>
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
              elevation="0"
              prepend-icon="mdi-plus-circle"
              @click="dialogNewRoom = true"
            >
              Thêm mới
            </v-btn>
          </div>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredRooms"
        item-value="room"
        class="elevation-1"
      >
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.building.name="{ item }">
          Khu {{ item.building.name }}
        </template>

        <template v-slot:item.gender="{ item }">
          <v-chip
            :color="item.gender === 'Nam' ? 'blue' : 'pink'"
            style="font-size: 12px"
            elevation="0"
          >
            {{ item.gender }}
          </v-chip>
        </template>

        <template v-slot:item.price="{ item }">
          <span> {{ formatPrice(item.price) }} </span>
        </template>

        <template v-slot:item.empty="{ item }">
          <v-chip
            :color="
              item.empty === 0 ? 'red' : item.empty < 3 ? 'orange' : 'green'
            "
            style="font-size: 12px"
            elevation="0"
          >
            {{ item.empty }} chỗ
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <span
            :style="{
              color:
                item.status === 'Mở'
                  ? 'green'
                  : item.status === 'Hỏng'
                  ? 'red'
                  : 'grey',
            }"
          >
            {{ item.status }}
          </span>
        </template>

        <template v-slot:item.action="{ item, index }">
          <div class="d-flex justify-center">
            <v-btn
              color="cyan-darken-2"
              rounded="lg"
              size="small"
              elevation="0"
              icon="mdi mdi-square-edit-outline"
              variant="text"
              @click="editRoom(item, index)"
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
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-home-off text-h2 text-grey-lighten-1"></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có phòng nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- <small style="margin-top: -2rem">
          {{ buildings.filter((x) => x._id === newRoom?.building)[0].type }}
        </small>
        <br /> -->
  <!-- Dialog Thêm mới -->
  <v-dialog v-model="dialogNewRoom" max-width="500">
    <v-card>
      <v-card-title class="text-h5"> Thêm phòng mới </v-card-title>
      <v-card-text>
        <span>Khu nhà:</span>
        <!-- <v-autocomplete
          v-model="newRoom.building"
          :items="buildingOptions"
          item-title="title"
          item-value="value"
          placeholder="Chọn khu"
          variant="outlined"
          density="compact"
        /> -->
        <v-autocomplete
          v-model="newRoom.building"
          :items="buildings"
          item-title="name"
          item-value="_id"
          placeholder="Chọn khu"
          variant="outlined"
          density="compact"
          @update:model-value="onBuildingSelect"
        />
        <span>Số phòng:</span>
        <v-text-field
          v-model="newRoom.room"
          placeholder="Số phòng"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <span>Giới tính:</span>
        <!-- <v-select
          v-model="newRoom.gender"
          :items="['Nam', 'Nữ']"
          placeholder="Giới tính"
          variant="outlined"
          density="compact"
        ></v-select> -->

        <v-select
          v-model="newRoom.gender"
          :items="['Nam', 'Nữ']"
          placeholder="Giới tính"
          variant="outlined"
          density="compact"
          :disabled="true"
          readonly
        />

        <span>Giá thuê phòng:</span>
        <v-text-field
          v-model="newRoom.price"
          placeholder="Giá tiền"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <span>Trạnh thái:</span>
        <v-select
          v-model="newRoom.status"
          :items="['Mở', 'Đóng', 'Hỏng']"
          placeholder="Trạng thái"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-card-text>
      <v-card-actions style="margin: -1rem 0 1rem 0">
        <v-btn color="grey" @click="dialogNewRoom = false">Hủy</v-btn>
        <v-btn
          color="secondary"
          elevation="0"
          :disabled="!isFormValid"
          @click="addRoom"
        >
          Thêm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Chỉnh Sửa -->
  <v-dialog v-model="dialogEditRoom" max-width="500">
    <v-card>
      <v-card-title class="text-h5"> Sửa thông tin phòng </v-card-title>
      <v-card-text>
        <span>Khu nhà:</span>
        <v-autocomplete
          v-model="selectedRoom.building"
          :items="buildingOptions"
          item-title="title"
          item-value="value"
          placeholder="Chọn khu"
          variant="outlined"
          density="compact"
        />

        <span>Số phòng:</span>
        <v-text-field
          v-model="selectedRoom.room"
          placeholder="Số phòng"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <span>Giới tính:</span>
        <v-select
          v-model="selectedRoom.gender"
          :items="['Nam', 'Nữ']"
          placeholder="Giới tính"
          variant="outlined"
          density="compact"
        ></v-select>

        <span>Giá thuê phòng:</span>
        <v-text-field
          v-model="selectedRoom.price"
          placeholder="Giá tiền"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <span>Trạng thái:</span>
        <v-select
          v-model="selectedRoom.status"
          :items="['Mở', 'Đóng', 'Hỏng']"
          placeholder="Trạng thái"
          variant="outlined"
          density="compact"
        ></v-select>
      </v-card-text>
      <v-card-actions style="margin: -1rem 0 1rem 0">
        <v-btn color="grey" @click="dialogEditRoom = false">Hủy</v-btn>
        <v-btn
          color="secondary"
          variant="elevated"
          :disabled="!isUpdateFormValid"
          @click="updateRoom"
          >Cập nhật</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Xác nhận xóa -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <p class="pa-6 text-center text-grey-darken-3">
        Bạn có chắc chắn muốn xóa phòng này?
      </p>

      <v-divider></v-divider>

      <v-card-actions class="justify-center pa-3">
        <v-btn
          color="secondary"
          @click="confirmDeleteDialog = false"
          class="mr-2"
          variant="text"
        >
          Hủy
        </v-btn>
        <v-btn color="red" @click="deleteRoom" class="ml-2" variant="tonal">
          Xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Thông báo snackbar -->
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
