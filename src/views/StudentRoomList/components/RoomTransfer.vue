<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { STORE_STUDENT_ROOM_LIST } from "@/services/stores";

const { onActionGetRooms, onActionGetStudentById, onActionTransferRoom } =
  STORE_STUDENT_ROOM_LIST.StoreStudentRoomList();

const route = useRoute();

const search = ref("");
const selectedGender = ref("Tất cả");
const selectedArea = ref("Tất cả");
const availableSeats = ref("");
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("green");

const headers = [
  { align: "center", key: "index", sortable: true, title: "STT" },
  { align: "center", key: "building.name", title: "Khu nhà" },
  { align: "center", key: "room", title: "Số phòng" },
  { align: "center", key: "gender", title: "Giới tính" },
  { align: "center", key: "price", title: "Giá" },
  { align: "center", key: "building.peoplePerRoom", title: "Định mức đăng ký" },
  { align: "center", key: "total", title: "Số lượng đã đăng ký" },
  { align: "center", key: "empty", title: "Còn trống" },
  { align: "center", key: "action", sortable: false },
];

const roomTable = ref([]);
const studentInfo = ref(null);

const fetchRooms = async (studentId) => {
  try {
    const response = await onActionGetRooms(studentId);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phòng:", error);
    return [];
  }
};

const fetchStudent = async (studentId) => {
  try {
    const response = await onActionGetStudentById(studentId);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
    return null;
  }
};

const genderOptions = ["Tất cả", "Nam", "Nữ"];

function formatPrice(value) {
  return value.toLocaleString("vi-VN");
}

const buildingOptions = computed(() => {
  const uniqueBuildings = [
    ...new Set(roomTable.value.map((r) => r.building.name)),
  ];
  uniqueBuildings.sort((a, b) => a.localeCompare(b));

  return ["Tất cả", ...uniqueBuildings];
});

// Lọc danh sách theo điều kiện
const filteredRooms = computed(() => {
  return roomTable.value
    .map((room) => ({
      ...room,
    }))
    .filter((room) => {
      return (
        (selectedGender.value === "Tất cả" ||
          room.gender === selectedGender.value) &&
        (selectedArea.value === "Tất cả" ||
          room.building.name
            .toLowerCase()
            .includes(selectedArea.value.toLowerCase())) &&
        (search.value === "" || room.room.toString().includes(search.value)) &&
        (availableSeats.value === "" ||
          room.empty.toString() === availableSeats.value)
      );
    });
});

// Làm mới bộ lọc
const resetFilters = () => {
  search.value = "";
  selectedGender.value = "Tất cả";
  selectedArea.value = "Tất cả";
  availableSeats.value = "";
};

const confirmTransferDialog = ref(false);
const selectedRoom = ref(null);

const openTransferDialog = (room) => {
  selectedRoom.value = room;
  confirmTransferDialog.value = true;
};

const transferRoom = async () => {
  if (!selectedRoom.value) return;

  const registrationId = studentInfo.value.registration._id;
  const studentId = studentInfo.value._id;

  const data = {
    room: selectedRoom.value._id,
  };

  try {
    const res = await onActionTransferRoom(registrationId, data);

    if (res?.data?.success) {
      studentInfo.value.registration = res.data.data;

      const updatedRooms = await fetchRooms(studentId);
      roomTable.value = updatedRooms;

      snackbarText.value = `Chuyển thành công sang phòng ${selectedRoom.value.room} - Khu ${selectedRoom.value.building.name}`;
      snackbarColor.value = "green";
      snackbar.value = true;
      confirmTransferDialog.value = false;
    } else {
      snackbarText.value = "Chuyển phòng thất bại. Vui lòng thử lại.";
      snackbarColor.value = "red";
      snackbar.value = true;
    }
  } catch (error) {
    snackbarText.value = "Có lỗi xảy ra khi chuyển phòng.";
    snackbarColor.value = "red";
    snackbar.value = true;
  }
};

onMounted(async () => {
  const studentId = route.params.id;

  const [roomsData, studentData] = await Promise.all([
    fetchRooms(studentId),
    fetchStudent(studentId),
  ]);

  roomTable.value = roomsData;
  studentInfo.value = studentData;
});
</script>

<template>
  <v-container class="pa-0">
    <div class="mb-2">
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        to="/student-room-list"
      >
        Quay lại
      </v-btn>
    </div>

    <!-- Filter Section -->
    <v-card class="pa-4">
      <div class="text-center py-4">
        <div class="text-h5 font-weight-bold text-primary mb-1">
          Điều chuyển phòng
        </div>
        <div class="text-body-1 text-grey-darken-2">
          Sinh viên: {{ studentInfo?.registration?.fullname }} -
          {{ studentInfo?.registration?.studentId }}
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" md="3">
          <span>Tìm theo số phòng:</span>
          <v-text-field
            v-model="search"
            placeholder="Số phòng"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <span>Lọc theo giới tính:</span>
          <v-select
            v-model="selectedGender"
            :items="genderOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <span>Lọc theo khu nhà:</span>
          <v-combobox
            v-model="selectedArea"
            :items="buildingOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-combobox>
        </v-col>

        <v-col cols="12" md="3">
          <span>Lọc theo số chỗ trống:</span>
          <v-text-field
            v-model="availableSeats"
            placeholder="Chỗ trống"
            prepend-inner-icon="mdi-filter-outline"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        color="secondary"
        prepend-icon="mdi-filter-off-outline"
        variant="outlined"
        @click="resetFilters"
        class="mt-3"
      >
        Làm mới
      </v-btn>
    </v-card>

    <!-- Room Table -->
    <v-card class="mt-4" elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredRooms"
        item-value="room"
        class="elevation-1"
      >
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.building.name="{ item }"
          >Khu {{ item.building.name }}
        </template>

        <template v-slot:item.gender="{ item }">
          <v-chip
            :color="item.gender === 'Nam' ? 'blue' : 'pink'"
            elevation="0"
          >
            {{ item.gender }}
          </v-chip>
        </template>

        <template v-slot:item.price="{ item }"
          >{{ formatPrice(item.price) }}
        </template>

        <template v-slot:item.empty="{ item }">
          <v-chip
            :color="
              item.empty === 0 ? 'red' : item.empty < 3 ? 'orange' : 'green'
            "
            elevation="0"
          >
            {{ item.empty }} chỗ
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            color="primary"
            size="small"
            :disabled="item.empty === 0"
            @click="openTransferDialog(item)"
          >
            Chuyển
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i class="mdi mdi-home-off text-h2 text-grey-lighten-1"></i>
            <p class="text-grey-darken-1 text-subtitle-1 font-italic">
              Không có phòng nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Dialog Chuyển phòng -->
  <v-dialog v-model="confirmTransferDialog" max-width="400px" persistent>
    <v-card>
      <p class="pa-6 text-center text-grey-darken-3">
        Bạn có chắc chắn muốn chuyển sang phòng {{ selectedRoom?.room }} Khu
        {{ selectedRoom?.building.name }}?
      </p>

      <v-divider></v-divider>

      <v-card-actions class="justify-center pa-3">
        <v-btn
          color="grey"
          @click="confirmTransferDialog = false"
          class="mr-2"
          variant="text"
        >
          Hủy
        </v-btn>
        <v-btn
          color="secondary"
          @click="transferRoom"
          class="ml-2"
          variant="tonal"
        >
          Chuyển
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
    {{ snackbarText }}
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
}

.v-data-table th {
  background-color: #009688;
  color: white;
}

.v-data-table td {
  text-align: center;
}
</style>
