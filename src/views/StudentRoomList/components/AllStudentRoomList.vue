<script setup>
import { ref, computed, defineProps, onMounted } from "vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "vue-router";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_STUDENT_ROOM_LIST } from "@/services/stores";

const { onActionGetStudents, onActionGetBuildings, onActionGetRooms } =
  STORE_STUDENT_ROOM_LIST.StoreStudentRoomList();

const router = useRouter();

const props = defineProps({
  statusFilter: {
    type: String,
    default: "Tất cả",
  },
});

const search = ref("");
const selectedBuilding = ref("Tất cả");
const selectedRoom = ref("Tất cả");
const selectedTerm = ref("Tất cả");
const selectedYear = ref("Tất cả");
const selectedStatus = ref("");
const selectedStudent = ref({});

const filter = ref({ dateRange: [] });

const headers = [
  { align: "center", key: "index", title: "STT", sortable: false },
  { align: "start", key: "registration.fullname", title: "Họ và tên" },
  { align: "start", key: "registration.studentId", title: "MSSV" },
  { align: "center", key: "duration", title: "Thời gian sử dụng" },
  { align: "center", key: "registration.room.building.name", title: "Khu nhà" },
  { align: "center", key: "registration.room.room", title: "Số phòng" },
  { align: "center", key: "status", title: "Trạng thái" },
  { align: "center", key: "action", title: "Hành động", sortable: false },
];

const students = ref([]);
const buildings = ref([]);
const rooms = ref([]);

const fetchStudents = async () => {
  await onActionGetStudents().then((res) => {
    console.log(res?.data);
    students.value = res?.data;
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

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

function getStatusColor(status) {
  switch (status) {
    case "Đang ở":
      return "green";
    case "Đã trả":
      return "grey";
    default:
      return "black";
  }
}

const filteredStudents = computed(() => {
  return students?.value?.filter((student) => {
    const matchesSearch =
      !search.value ||
      student?.registration?.fullname
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      student?.registration?.studentId.includes(search.value) ||
      student?.registration?.phone.includes(search.value);

    const matchesFilters =
      (!selectedBuilding.value ||
        selectedBuilding.value === "Tất cả" ||
        student?.registration?.room?.building?.name
          .toLowerCase()
          .includes(selectedBuilding.value.toLowerCase())) &&
      (!selectedRoom.value ||
        selectedRoom.value === "Tất cả" ||
        student?.registration?.room?.room
          .toLowerCase()
          .includes(selectedRoom.value.toLowerCase())) &&
      (!selectedStatus.value ||
        selectedStatus.value === "Tất cả" ||
        student?.status === selectedStatus.value) &&
      (props.statusFilter === "Tất cả" ||
        student?.status === props.statusFilter);

    if (!filter.value.dateRange || filter.value.dateRange.length === 0) {
      return matchesSearch && matchesFilters;
    }

    const filterStart = new Date(filter.value.dateRange[0]);
    const filterEnd = new Date(
      filter.value.dateRange[filter.value.dateRange.length - 1]
    );
    filterEnd.setHours(23, 59, 59, 999);

    const roomStart = new Date(student.startDate);
    const roomEnd = new Date(student.endDate);

    const matchesDate =
      (roomStart >= filterStart && roomStart <= filterEnd) ||
      (roomEnd >= filterStart && roomEnd <= filterEnd) ||
      (roomStart <= filterStart && roomEnd >= filterEnd);

    return matchesSearch && matchesFilters && matchesDate;
  });
});

const resetFilters = () => {
  search.value = "";
  selectedBuilding.value = "Tất cả";
  selectedRoom.value = "Tất cả";
  selectedTerm.value = "Tất cả";
  selectedYear.value = "Tất cả";
  filter.value.dateRange = [];
};

const dialogDetails = ref(false);
const extendDialog = ref(false);
const newEndDate = ref("");

const viewDetails = (student) => {
  selectedStudent.value = student;
  dialogDetails.value = true;
};

const openExtendDialog = (student) => {
  selectedStudent.value = { ...student };
  newEndDate.value = student.endDate;
  extendDialog.value = true;
};

if (new Date(newEndDate.value) > new Date()) {
  selectedStudent.value.status = "Đang ở";
}

const transferRoom = (rowData) => {
  router.push(`/student-room-list/room-transfer/${rowData._id}`);
};

const handleExport = () => {
  const data = filteredStudents.value.map((item, index) => ({
    STT: index + 1,
    "Họ và tên": item.name,
    MSSV: item.studentId,
    "Kỳ học": item.term,
    "Năm học": item.academicYear,
    "Thời gian sử dụng": `${formatDate(item.startDate)} - ${formatDate(
      item.endDate
    )}`,
    "Khu nhà": item.building,
    "Số phòng": item.room,
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-sinh-vien-thue");
};

onMounted(() => {
  fetchStudents();
  fetchBuildings();
  fetchRooms();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <v-card class="pa-4 bg-white" elevation="2">
      <div class="text-h5 text-center pb-5 font-weight-bold text-blue-darken-3">
        Danh sách sinh viên thuê phòng
      </div>
      <v-row dense>
        <v-col cols="12" md="3">
          <span>Từ khóa tìm kiếm:</span>
          <v-text-field
            v-model="search"
            placeholder="Tên, MSSV, SĐT..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <span>Khu nhà:</span>
          <v-combobox
            v-model="selectedBuilding"
            :items="buildingOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="3">
          <span>Số phòng:</span>
          <v-combobox
            v-model="selectedRoom"
            :items="roomOptions"
            variant="outlined"
            density="compact"
            hide-details
          ></v-combobox>
        </v-col>

        <v-col cols="12" md="3">
          <span>Thời gian sử dụng:</span>
          <v-date-input
            v-model="filter.dateRange"
            placeholder="Thời gian sử dụng"
            multiple="range"
            density="compact"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
            variant="outlined"
            hide-details
            :formatter="formatDate"
          ></v-date-input>
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

    <v-card class="mt-4" elevation="2">
      <div class="pa-3 d-flex align-center justify-space-between">
        <div>
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
            <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
              students?.length
            }}</v-chip>
          </span>
        </div>

        <div>
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
        :items="filteredStudents"
        item-value="no"
      >
        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.duration="{ item }">
          {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
        </template>

        <template v-slot:item.registration.room.building.name="{ item }">
          Khu {{ item?.registration?.room?.building?.name }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            style="font-size: 12px"
            elevation="0"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="d-flex ga-1 justify-center">
            <v-btn
              color="cyan-darken-2"
              v-bind="props"
              icon="mdi-account-details-outline"
              elevation="0"
              variant="text"
              rounded="lg"
              size="small"
              @click="viewDetails(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Xem chi tiết</v-tooltip
              ></v-btn
            >

            <v-btn
              color="cyan-darken-2"
              v-bind="props"
              icon="mdi-swap-horizontal-circle-outline"
              elevation="0"
              variant="text"
              rounded="lg"
              size="small"
              @click="transferRoom(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Điều chuyển phòng</v-tooltip
              ></v-btn
            >
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center pa-16">
            <v-icon size="48" class="text-grey-lighten-1 text-h2"
              >mdi-home-off</v-icon
            >
            <p class="text-grey-darken-1 text-subtitle-1 font-italic">
              Không có thông tin nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Dialog Chi tiết -->
  <v-dialog v-model="dialogDetails" max-width="800px">
    <v-card>
      <v-card-title
        class="text-h6 font-weight-bold text-blue-darken-3 text-center"
      >
        Thông tin sinh viên
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="selectedStudent">
        <v-list dense>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Họ và tên:</strong>
                    <span>{{ selectedStudent.registration.fullname }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Ngày sinh:</strong>
                    <span>{{
                      formatDate(selectedStudent.registration.birthDate)
                    }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Giới tính:</strong>
                    <span>{{ selectedStudent.registration.gender }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Tôn giáo:</strong>
                    <span>{{ selectedStudent.registration.religion }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Dân tộc:</strong>
                    <span>{{ selectedStudent.registration.ethnicity }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>MSSV:</strong>
                    <span>{{ selectedStudent.registration.studentId }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Khóa:</strong>
                    <span>{{ selectedStudent.registration.course }}</span>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Trường/Viện:</strong>
                    <span>{{ selectedStudent.registration.school }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Lớp:</strong>
                    <span>{{ selectedStudent.registration.class }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="d-flex justify-space-between">
                    <strong>Số điện thoại:</strong>
                    <span>{{ selectedStudent.registration.phone }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <div class="text-h6 text-blue-darken-3 text-center">
          Lịch sử phòng ở
        </div>
        <v-table dense class="mt-3 border rounded">
          <thead>
            <tr class="text-blue-darken-3 text-center">
              <th class="text-center">Khu nhà</th>
              <th class="text-center">Số phòng</th>
              <th class="text-center">Ngày bắt đầu</th>
              <th class="text-center">Ngày kết thúc</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="
                !selectedStudent.history || selectedStudent.history.length === 0
              "
            >
              <td class="text-center" colspan="4">Chưa có lịch sử phòng ở</td>
            </tr>
            <tr
              v-else
              v-for="(history, index) in selectedStudent.history"
              :key="index"
            >
              <td class="text-center">Khu {{ history.buildingName }}</td>
              <td class="text-center">{{ history.roomNumber }}</td>
              <td class="text-center">{{ formatDate(history.startDate) }}</td>
              <td class="text-center">{{ formatDate(history.endDate) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn
          color="blue-darken-2"
          variant="outlined"
          @click="dialogDetails = false"
        >
          Đóng
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
</style>
