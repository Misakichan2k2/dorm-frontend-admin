<script setup>
import { ref, computed, defineProps, onMounted, watch } from "vue";
import { format } from "date-fns";
import { exportToExcel } from "@/utils/exportExcel";
import { STORE_WATER_INVOICE } from "@/services/stores";

const {
  onActionGetAllWaterInvoices,
  onActionGetBuildings,
  onActionGetRooms,
  onActionCreateWaterInvoice,
  onActionUpdateWaterInvoice,
  onGetInvoiceByRoomMonth,
} = STORE_WATER_INVOICE.StoreWaterInvoice();

// Cấu trúc bảng
const headers = [
  { title: "STT", key: "index", sortable: true },
  { title: "Tháng/Năm", key: "month", sortable: true },
  { title: "Khu", key: "room.building.name", sortable: true },
  { title: "Phòng", key: "room.room", sortable: true },
  { title: "Tổng tiêu thụ", key: "totalConsumption", sortable: true },
  { title: "Đơn giá 1M³ (VNĐ)", key: "unitPrice", sortable: true },
  { title: "Thành tiền (VNĐ)", key: "totalAmount", sortable: true },
  { title: "Hạn đóng", key: "dueDate", sortable: true },
  { title: "Trạng thái", key: "status", sortable: true, align: "center" },
  // { title: "Quá hạn", key: "overdue", align: "center", sortable: false },
  { title: "Hành động", key: "action", sortable: false },
];

const invoices = ref([]);

const props = defineProps({
  statusFilter: {
    type: String,
    default: "Tất cả",
  },
});

const fetchWaterInvoices = async () => {
  await onActionGetAllWaterInvoices().then((res) => {
    console.log(res);
    invoices.value = res?.data;
  });
};

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

const buildingOptions = computed(() =>
  buildings.value
    .slice() // tránh thay đổi mảng gốc
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((b) => ({
      title: b.name,
      value: b._id,
    }))
);

const filteredRoomOptions = computed(() => {
  if (!newInvoice.value.building) return [];

  return rooms.value
    .filter(
      (room) => room.building._id.toString() === newInvoice.value.building.value
    )
    .sort((a, b) => {
      // Chuyển room sang số để so sánh tăng dần
      return Number(a.room) - Number(b.room);
    })
    .map((r) => ({
      title: r.room,
      value: r._id,
    }));
});

const buildingOptionsFilter = computed(() => [
  "Tất cả",
  ...buildings.value.map((b) => b.name).sort((a, b) => a.localeCompare(b)),
]);

const roomOptionsFilter = computed(() => {
  const roomNumbers = rooms.value.map((r) => r.room);
  const uniqueRoomNumbers = Array.from(new Set(roomNumbers));

  // sắp xếp tăng dần theo số (nếu phòng là số)
  uniqueRoomNumbers.sort((a, b) => parseInt(a) - parseInt(b));

  return ["Tất cả", ...uniqueRoomNumbers];
});

const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};

// Danh sách filter
const selectedMonth = ref("Tất cả");
const selectedYear = ref("Tất cả");
const selectedStatus = ref("Tất cả");

// Lựa chọn tháng, năm, trạng thái
const monthOptions = ["Tất cả", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yearOptions = ["Tất cả", 2024, 2025, 2026];
const overdueOptions = ["Tất cả", "Đã quá hạn", "Chưa quá hạn"];

const selectedBuilding = ref("Tất cả");
const selectedRoom = ref("Tất cả");
const selectedOverdue = ref("Tất cả");

function isOverdue(invoice) {
  if (!invoice || invoice.status === "Đã đóng") return false;
  const today = new Date();
  const due = new Date(invoice.dueDate);
  return today > due;
}

const computedInvoices = computed(() => {
  return invoices?.value?.map((invoice) => ({
    ...invoice,
    totalConsumption: invoice.newIndex - invoice.oldIndex,
  }));
});

// Lọc dữ liệu theo bộ lọc
const filteredInvoices = computed(() => {
  return computedInvoices.value?.filter((invoice) => {
    return (
      (selectedMonth?.value === "" ||
        selectedMonth?.value === "Tất cả" ||
        invoice?.month === selectedMonth.value) &&
      (selectedYear?.value === "" ||
        selectedYear?.value === "Tất cả" ||
        invoice?.year === selectedYear.value) &&
      (selectedStatus?.value === "" ||
        selectedStatus?.value === "Tất cả" ||
        invoice.status === selectedStatus.value) &&
      (props.statusFilter === "Tất cả" ||
        invoice.status === props.statusFilter) &&
      (!selectedBuilding?.value ||
        selectedBuilding?.value === "Tất cả" ||
        invoice?.room?.building?.name
          .toLowerCase()
          .includes(selectedBuilding.value.toLowerCase())) &&
      (!selectedRoom?.value ||
        selectedRoom?.value === "Tất cả" ||
        invoice?.room?.room.includes(selectedRoom.value)) &&
      (!selectedOverdue?.value ||
        selectedOverdue?.value === "Tất cả" ||
        (selectedOverdue?.value === "Đã quá hạn" &&
          new Date(invoice.dueDate) < new Date() &&
          invoice.status !== "Đã đóng") ||
        (selectedOverdue?.value === "Chưa quá hạn" &&
          (new Date(invoice.dueDate) >= new Date() ||
            invoice.status === "Đã đóng")))
    );
  });
});

// Reset bộ lọc
const resetFilters = () => {
  selectedMonth.value = "Tất cả";
  selectedYear.value = "Tất cả";
  selectedBuilding.value = "Tất cả";
  selectedRoom.value = "Tất cả";
  selectedOverdue.value = "Tất cả";
};

const dialogNewRoom = ref(false);

const newInvoice = ref({
  month: null,
  year: null,
  building: "",
  room: "",
  oldIndex: 0,
  newIndex: 0,
  unitPrice: 7500,
  dueDate: "",
  status: "Chưa đóng",
});

const saveNewInvoice = async () => {
  const roomId = newInvoice.value.room?.value || newInvoice.value.room;
  const month = newInvoice.value.month;
  const year = newInvoice.value.year;

  // Sử dụng oldIndex đã được cập nhật từ watcher
  const consumption = newInvoice.value.newIndex - newInvoice.value.oldIndex;
  const totalAmount = consumption * newInvoice.value.unitPrice;
  console.log(`Consumption: ${consumption}, Total amount: ${totalAmount}`);

  try {
    await onActionCreateWaterInvoice({
      room: roomId,
      month,
      year,
      oldIndex: newInvoice.value.oldIndex,
      newIndex: newInvoice.value.newIndex,
      unitPrice: newInvoice.value.unitPrice,
      dueDate: newInvoice.value.dueDate,
    });

    await fetchWaterInvoices();

    dialogNewRoom.value = false;

    // Dừng watcher nếu đang chạy
    if (typeof stopWatchOldIndex === "function") {
      stopWatchOldIndex();
      console.log("Watcher stopWatchOldIndex stopped.");
    }

    // Reset form
    newInvoice.value = {
      month: null,
      year: null,
      building: "",
      room: "",
      oldIndex: 0,
      newIndex: 0,
      unitPrice: 3500,
      dueDate: "",
      status: "Chưa đóng",
    };
  } catch (err) {
    console.error("Lỗi khi tạo hóa đơn:", err);
  }
};

const isFormValid = computed(() => {
  return (
    (newInvoice.value.month &&
      newInvoice.value.year &&
      newInvoice.value.building &&
      newInvoice.value.room &&
      newInvoice.value.oldIndex &&
      newInvoice.value.dueDate) ||
    (newInvoice.value.oldIndex === 0 &&
      newInvoice.value.newIndex &&
      newInvoice.value.unitPrice &&
      newInvoice.value.dueDate)
  );
});

// Dialogs
const dialogViewDetail = ref(false);
const dialogEditInvoice = ref(false);

// Dữ liệu hóa đơn đang chọn
const selectedInvoice = ref(null);

// Xem chi tiết
const viewDetails = (invoice) => {
  selectedInvoice.value = { ...invoice };
  dialogViewDetail.value = true;
};

// Chỉnh sửa
const transferRoom = (invoice) => {
  selectedInvoice.value = { ...invoice };
  dialogEditInvoice.value = true;
};

// Lưu chỉnh sửa
const saveEditedInvoice = async () => {
  try {
    console.log("selectedInvoice:", selectedInvoice.value);

    await onActionUpdateWaterInvoice(selectedInvoice.value._id, {
      room: selectedInvoice.value.room._id,
      month: selectedInvoice.value.month,
      year: selectedInvoice.value.year,
      oldIndex: selectedInvoice.value.oldIndex,
      newIndex: selectedInvoice.value.newIndex,
      unitPrice: selectedInvoice.value.unitPrice,
      dueDate: selectedInvoice.value.dueDate,
      status: selectedInvoice.value.status,
    });

    const index = invoices.value.findIndex(
      (i) => i.id === selectedInvoice.value.id
    );
    if (index !== -1) {
      const consumption =
        selectedInvoice.value.newIndex - selectedInvoice.value.oldIndex;
      selectedInvoice.value.totalConsumption = consumption;
      selectedInvoice.value.totalAmount =
        consumption * selectedInvoice.value.unitPrice;
      invoices.value[index] = { ...selectedInvoice.value };
    }

    dialogEditInvoice.value = false;
  } catch (err) {
    console.error("Cập nhật hóa đơn thất bại:", err);
  }
};

const handleExport = () => {
  const data = filteredInvoices.value.map((item, index) => ({
    STT: index + 1,
    "Tháng/Năm": `${item.month.toString().padStart(2, "0")}/${item.year}`,
    Khu: `Khu ${item.room.building.name}`,
    Phòng: item.room.room,
    "Tổng tiêu thụ": item.totalConsumption,
    "Đơn giá 1M³ (VNĐ)": item.unitPrice,
    "Thành tiền (VNĐ)": (
      item.unitPrice *
      (item.newIndex - item.oldIndex)
    ).toLocaleString("vi-VN"),
    "Hạn đóng": formatDate(item.dueDate),
    "Trạng thái": item.status,
  }));

  exportToExcel(data, "danh-sach-hoa-don-nuoc");
};

// Lấy danh sách phòng tương ứng với building
watch(
  () => newInvoice.value.building,
  (newBuilding) => {
    // Khi chọn lại building thì reset phòng
    newInvoice.value.room = "";
  }
);

// Lấy roomId, month, year
const fetchOldIndex = async () => {
  const room = newInvoice.value.room;
  const roomId = typeof room === "object" ? room.value : room;
  const month = newInvoice.value.month;
  const year = newInvoice.value.year;

  if (!roomId || !month || !year) {
    newInvoice.value.oldIndex = 0;
    console.log("fetchOldIndex: Thiếu dữ liệu", { roomId, month, year });
    return;
  }

  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  console.log("fetchOldIndex: Fetching previous invoice with", {
    roomId,
    month: prevMonth,
    year: prevYear,
  });

  try {
    const prevInvoice = await onGetInvoiceByRoomMonth(
      roomId,
      prevMonth,
      prevYear
    );

    console.log("fetchOldIndex: API response", prevInvoice);

    if (prevInvoice && typeof prevInvoice.newIndex === "number") {
      newInvoice.value.oldIndex = prevInvoice.newIndex;
      console.log("fetchOldIndex: Lấy oldIndex =", prevInvoice.newIndex);
    } else {
      newInvoice.value.oldIndex = 0;
      console.log(
        "fetchOldIndex: Không tìm thấy hóa đơn trước, set oldIndex=0"
      );
    }
  } catch (err) {
    console.warn("fetchOldIndex: Lỗi khi gọi API", err);
    newInvoice.value.oldIndex = 0;
  }
};

let stopWatchOldIndex = null;

const stopWatchOldIndexFunc = () => {
  if (stopWatchOldIndex) {
    stopWatchOldIndex();
    stopWatchOldIndex = null;
    console.log("Watcher đã bị dừng");
  }
};

const startWatchOldIndex = () => {
  if (stopWatchOldIndex) stopWatchOldIndex();

  stopWatchOldIndex = watch(
    () => [
      newInvoice.value.room,
      newInvoice.value.month,
      newInvoice.value.year,
    ],
    ([room, month, year]) => {
      if (room && month && year) fetchOldIndex();
    },
    { immediate: true }
  );
};

// Watch dialogNewRoom mở => start watcher, đóng => stop watcher
watch(dialogNewRoom, (val) => {
  if (val) {
    newInvoice.value.oldIndex = 0;
    startWatchOldIndex();
  } else {
    stopWatchOldIndexFunc();
  }
});

onMounted(() => {
  fetchWaterInvoices();
  fetchBuildings();
  fetchRooms();
});
</script>

<template>
  <v-container class="pa-0" style="max-width: 2000px">
    <!-- Filter section -->
    <v-card class="pa-4" elevation="2">
      <v-row dense>
        <v-col cols="12" md="4">
          <span>Tháng:</span>
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            placeholder="Tháng"
            density="compact"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <span>Năm:</span>
          <v-select
            v-model="selectedYear"
            :items="yearOptions"
            placeholder="Năm"
            density="compact"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <span>Khu nhà:</span>
          <v-combobox
            v-model="selectedBuilding"
            :items="buildingOptionsFilter"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <span>Phòng:</span>
          <v-combobox
            v-model="selectedRoom"
            :items="roomOptionsFilter"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <span>Hạn thanh toán:</span>
          <v-select
            v-model="selectedOverdue"
            :items="overdueOptions"
            placeholder="Lọc hạn thanh toán"
            density="compact"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>

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

    <!-- Table -->
    <v-card class="mt-4" elevation="2">
      <div
        class="pa-3 d-flex align-center justify-space-between"
        style="background-color: #f5f5f5"
      >
        <div>
          <span class="text-blue-grey-darken-2 font-weight-bold">
            Tổng số bản ghi:
          </span>
          <v-chip color="cyan-lighten-1" class="font-weight-bold">{{
            filteredInvoices?.length
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
          <div class="d-flex justify-end">
            <v-btn
              color="cyan-darken-2"
              elevation="0"
              prepend-icon="mdi-plus-circle"
              @click="dialogNewRoom = true"
            >
              Tạo hóa đơn
            </v-btn>
          </div>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredInvoices"
        item-value="id"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.month="{ item }">
          {{ item?.month.toString().padStart(2, "0") }}/{{ item?.year }}
        </template>

        <template v-slot:item.room.building.name="{ item }">
          Khu {{ item?.room.building.name }}
        </template>

        <template v-slot:item.totalConsumption="{ item }">
          {{ item.newIndex - item.oldIndex }}
        </template>

        <template v-slot:item.totalAmount="{ item }">
          {{
            (item.unitPrice * (item.newIndex - item.oldIndex)).toLocaleString(
              "vi-VN"
            )
          }}
        </template>

        <template v-slot:item.dueDate="{ item }">
          {{ formatDate(item.dueDate) }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'Đã đóng' ? 'green' : 'red'">{{
            item.status
          }}</v-chip></template
        >

        <template v-slot:item.overdue="{ item }">
          <div
            style="width: max-content"
            v-if="isOverdue(item) && item.status !== 'Đã đóng'"
          >
            <span class="text-red font-weight-bold">Đã quá hạn</span>
          </div>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="d-flex ga-1 justify-center">
            <v-btn
              color="cyan-darken-2"
              v-bind="props"
              icon="mdi-eye-outline"
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
              icon="mdi-square-edit-outline"
              elevation="0"
              variant="text"
              rounded="lg"
              size="small"
              @click="transferRoom(item)"
              ><v-icon></v-icon>
              <v-tooltip activator="parent" location="top"
                >Chỉnh sửa</v-tooltip
              ></v-btn
            >
          </div>
        </template>

        <template v-slot:no-data>
          <div class="pa-7">
            <i
              class="mdi mdi-receipt-text-remove text-h2 text-grey-lighten-1"
            ></i>
            <p
              class="text-center text-muted font-italic text-subtitle-1 text-red-lighten-1"
            >
              Không có hóa đơn nào phù hợp với kết quả tìm kiếm!
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Dialog Tạo hóa đơn điện -->
  <v-dialog v-model="dialogNewRoom" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold"
        >Tạo hóa đơn mới</v-card-title
      >

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="newInvoice.month"
                :items="monthOptions.slice(1)"
                label="Tháng"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="newInvoice.year"
                :items="yearOptions.slice(1)"
                label="Năm"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-combobox
                v-model="newInvoice.building"
                :items="buildingOptions"
                label="Khu nhà"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-combobox
                v-model="newInvoice.room"
                :items="filteredRoomOptions"
                item-title="title"
                item-value="value"
                label="Phòng"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="newInvoice.oldIndex"
                type="number"
                label="Chỉ số cũ"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="newInvoice.newIndex"
                type="number"
                label="Chỉ số mới"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="newInvoice.unitPrice"
                type="number"
                label="Đơn giá (VNĐ)"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-date-input
                v-model="newInvoice.dueDate"
                label="Hạn đóng"
                variant="outlined"
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
                persistent-placeholder
              ></v-date-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" text @click="dialogNewRoom = false">Hủy</v-btn>
        <v-btn
          color="secondary"
          variant="elevated"
          :disabled="!isFormValid"
          @click="saveNewInvoice"
          >Tạo hóa đơn</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Xem chi tiết -->
  <v-dialog v-model="dialogViewDetail" max-width="600px">
    <v-card>
      <v-card-title
        class="text-h6 font-weight-bold d-flex justify-space-between"
      >
        Hóa đơn điện –
        {{ selectedInvoice?.month.toString().padStart(2, "0") }}/{{
          selectedInvoice?.year
        }}
        <v-chip
          class="font-weight-bold"
          :color="selectedInvoice.status === 'Đã đóng' ? 'green' : 'red'"
          >{{ selectedInvoice.status }}</v-chip
        >
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text v-if="selectedInvoice" class="pt-4">
        <v-container>
          <v-row dense>
            <v-col cols="6">
              <strong>Khu nhà:</strong> Khu
              {{ selectedInvoice.room.building.name }}
            </v-col>
            <v-col cols="6">
              <strong>Phòng:</strong> {{ selectedInvoice.room.room }}
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="6">
              <strong>Chỉ số cũ:</strong> {{ selectedInvoice.oldIndex }}
            </v-col>
            <v-col cols="6">
              <strong>Chỉ số mới:</strong> {{ selectedInvoice.newIndex }}
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="6">
              <strong>Tiêu thụ:</strong>
              {{ selectedInvoice.totalConsumption }} M³
            </v-col>
            <v-col cols="6">
              <strong>Đơn giá:</strong>
              {{ selectedInvoice.unitPrice.toLocaleString("vi-VN") }} đ/M³
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">
              <strong>Thành tiền: </strong>
              <span class="text-red font-weight-bold">
                {{
                  (
                    selectedInvoice.unitPrice * selectedInvoice.totalConsumption
                  ).toLocaleString("vi-VN")
                }}
                đ
              </span>
            </v-col>
          </v-row>

          <v-row dense class="mt-2">
            <v-col cols="">
              <strong>Hạn đóng:</strong>
              {{ formatDate(selectedInvoice.dueDate) }}
              <span
                v-if="
                  isOverdue(selectedInvoice) &&
                  selectedInvoice.status != 'Đã đóng'
                "
                class="text-red font-weight-bold"
                >(Đã quá hạn)</span
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="dialogViewDetail = false"
          >Đóng</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Chỉnh sửa hóa đơn -->
  <v-dialog v-model="dialogEditInvoice" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold"
        >Chỉnh sửa hóa đơn</v-card-title
      >

      <v-divider></v-divider>

      <v-card-text v-if="selectedInvoice">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="selectedInvoice.month"
                :items="monthOptions.slice(1)"
                label="Tháng"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedInvoice.year"
                :items="yearOptions.slice(1)"
                label="Năm"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-combobox
                v-model="selectedInvoice.room.building.name"
                :items="buildingOptions"
                label="Khu nhà"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-combobox
                v-model="selectedInvoice.room.room"
                :items="filteredRoomOptions"
                item-title="title"
                item-value="value"
                label="Phòng"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="selectedInvoice.oldIndex"
                type="number"
                label="Chỉ số cũ"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="selectedInvoice.newIndex"
                type="number"
                label="Chỉ số mới"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="selectedInvoice.unitPrice"
                type="number"
                label="Đơn giá"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-date-input
                v-model="selectedInvoice.dueDate"
                label="Hạn đóng"
                variant="outlined"
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
                persistent-placeholder
              ></v-date-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-2">
        <v-spacer />
        <v-btn color="grey" @click="dialogEditInvoice = false">Hủy</v-btn>
        <v-btn color="primary" variant="tonal" @click="saveEditedInvoice"
          >Lưu</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-chip {
  font-size: 12px;
}

.text-h5 {
  font-weight: bold;
  color: #4a4a4a;
}

.text-body-2 {
  color: #6a6a6a;
}
</style>
