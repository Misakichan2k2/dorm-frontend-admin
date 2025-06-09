<script setup>
import { ref } from "vue";
import AllRoomList from "./components/AllStudentRoomList.vue";

const selectedTab = ref("all");
</script>

<template>
  <v-card flat>
    <v-tabs
      v-model="selectedTab"
      bg-color="white"
      color="primary"
      center-active
      class="border-b-sm"
    >
      <v-tab value="all">Danh sách sinh viên thuê</v-tab>
      <v-tab value="active">Đang ở</v-tab>
      <v-tab value="expired">Đã trả</v-tab>
    </v-tabs>

    <v-card-text class="pa-0 bg-grey-lighten-4">
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="all">
          <AllRoomList :status-filter="'Tất cả'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="active">
          <AllRoomList :status-filter="'Đang ở'" />
        </v-tabs-window-item>

        <v-tabs-window-item value="expired">
          <AllRoomList :status-filter="'Đã trả'" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
