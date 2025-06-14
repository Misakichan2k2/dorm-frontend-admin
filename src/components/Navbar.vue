<script setup>
import { ref } from "vue";
import { onDeleteAppLocalStorage } from "@/utils";

const drawer = ref(true);
const rail = ref(false);

const toggleRail = () => {
  rail.value = !rail.value;
};

const onLogout = () => {
  onDeleteAppLocalStorage();
};
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    class="glass-card"
  >
    <!-- Header của sidebar -->
    <v-list-item nav>
      <v-list-item-title
        v-if="!rail"
        class="pl-2 font-weight-bold text-blue-darken-3 text-subtitle-1"
        >Quản lý ký túc xá</v-list-item-title
      >

      <template v-slot:append>
        <v-btn
          icon="mdi-view-list"
          variant="text"
          @click.stop="toggleRail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-city"
        title="Trang chủ"
        value="dashboard"
        :to="'/'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-office-building"
        title="Quản lý khu nhà"
        value="area"
        :to="'/area'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-bed-king"
        title="Quản lý phòng ở"
        value="room"
        :to="'/room'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-file-sign"
        title="Yêu cầu đăng ký phòng"
        value="registration"
        :to="'/registration'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-calendar-clock"
        title="Yêu cầu Gia hạn thuê phòng"
        value="renewRental"
        :to="'/renewal-request'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-table-account"
        title="Danh sách sinh viên thuê"
        value="studentRoomList"
        :to="'/student-room-list'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-lightning-bolt"
        title="Hóa đơn Điện"
        value="elctricityBill"
        :to="'/electricity-bill'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-water"
        title="Hóa đơn Nước"
        value="waterBill"
        :to="'/water-bill'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-hammer-wrench"
        title="Danh sách báo cáo sự cố"
        value="report"
        :to="'/report'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-message-processing"
        title="Danh sách phản hồi"
        value="feedback"
        :to="'/feedback'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi mdi-account-group"
        title="Quản lý tài khoản"
        value="account"
        :to="'/account'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi mdi-chart-multiple"
        title="Báo cáo thống kê"
        value="statistics"
        :to="'/statistics'"
      ></v-list-item>
    </v-list>
    <template #append>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          @click="onLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
}
</style>
