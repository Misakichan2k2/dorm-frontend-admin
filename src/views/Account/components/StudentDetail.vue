<script setup>
import { ref, computed, onMounted } from "vue";
import InfoItem from "./InfoItem.vue";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import provinces from "@/data/province";
import districts from "@/data/districts";
import wards from "@/data/ward";
import { useRoute } from "vue-router";
import { STORE_ACCOUNT } from "@/services/stores";

const { onActionGetAccountById } = STORE_ACCOUNT.StoreAccount();

const route = useRoute();

const isEditing = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");

const formData = ref({});

const fetchAccountById = () => {
  onActionGetAccountById(route.params.id)
    .then((res) => {
      console.log("Res:", res.data);
      // Gán dữ liệu vào formData
      formData.value = res.data;
    })
    .catch(console.error);
};

const formatDate = (date) => {
  return date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "";
};

console.log("Form data:", formData.value);

// Dữ liệu để chỉnh sửa
const editData = ref({
  ...formData.value,
  address: { ...formData.value.address },
});

const provinceName = computed(() => {
  const code = formData.value?.address?.provinceCode || "";
  return provinces.find((p) => p.code === code)?.name || "Không xác định";
});

const districtName = computed(() => {
  const code = formData.value?.address?.districtCode;
  return districts.find((d) => d.code === code)?.name || "Không xác định";
});

const wardName = computed(() => {
  const code = formData.value?.address?.wardCode;
  return wards.find((w) => w.code === code)?.name || "Không xác định";
});

const getNameByCode = (list, code, key = "code") =>
  list.find((item) => item[key] === code)?.name || "";

const startEditing = () => {
  isEditing.value = true;
  editData.value = {
    ...formData.value,
    address: { ...formData.value.address },
  };
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveChanges = () => {
  formData.value = {
    ...editData.value,
    address: { ...editData.value.address },
  };
  isEditing.value = false;

  snackbarMessage.value = "Lưu thông tin thành công!";
  snackbar.value = true;
};

onMounted(() => {
  fetchAccountById();
});
</script>

<template>
  <v-container class="pa-2" max-width="2000">
    <!-- Nút quay lại + Chỉnh sửa -->
    <v-row justify="space-between" class="mb-1">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="outlined"
        color="primary"
        class="mb-4"
        to="/account"
      >
        Quay lại
      </v-btn>

      <!-- <v-btn
        v-if="!isEditing"
        prepend-icon="mdi-pencil"
        color="primary"
        variant="tonal"
        @click="startEditing"
      >
        Chỉnh sửa
      </v-btn> -->
    </v-row>

    <v-card class="mb-5">
      <!-- Avatar -->
      <v-col cols="12" md="3" class="text-center">
        <v-avatar size="180">
          <v-img
            src="https://pbs.twimg.com/profile_images/481865412657684481/Nl5wU0EL_400x400.jpeg"
            alt="Avatar"
          ></v-img>
        </v-avatar>
      </v-col>
    </v-card>

    <!-- Thông tin cá nhân -->
    <v-card class="mb-5">
      <v-card-title>
        <v-icon class="me-2" color="primary">mdi-account</v-icon>
        Thông tin cá nhân
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row dense>
          <InfoItem label="Họ và tên">
            <template #default>
              <div class="d-flex align-center">
                <span v-if="!isEditing">{{
                  formData?.registration?.fullname
                }}</span>
                <v-text-field
                  v-else
                  v-model="editData.registration.fullname"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </div>
            </template>
          </InfoItem>

          <InfoItem label="Ngày sinh">
            <template #default>
              <span v-if="!isEditing">
                {{ formatDate(formData?.registration?.birthDate) }}</span
              >
              <v-date-input
                v-else
                v-model="editData.registration.birthDate"
                variant="outlined"
                density="compact"
                hide-details
                prepend-icon=""
                prepend-inner-icon="mdi-calendar"
                persistent-placeholder
              />
            </template>
          </InfoItem>

          <InfoItem label="Giới tính">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.gender
              }}</span>
              <v-select
                v-else
                v-model="editData.registration.gender"
                :items="['Nam', 'Nữ', 'Khác']"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Tôn giáo">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.religion
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.religion"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Dân tộc">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.ethnicity
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.ethnicity"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="CMND/CCCD">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.identityNumber
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.identityNumber"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Hộ khẩu -->
    <v-card class="mb-5">
      <v-card-title>
        <v-icon class="me-2" color="primary">mdi-home-city-outline</v-icon>
        Thông tin hộ khẩu
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row dense>
          <InfoItem label="Tỉnh/Thành phố">
            <template #default>
              <span v-if="!isEditing">
                {{
                  getNameByCode(
                    provinces,
                    formData?.registration?.address?.provinceCode
                  )
                }}
              </span>
              <v-select
                v-else
                v-model="editData.registration.address.provinceCode"
                :items="provinceName"
                item-title="name"
                item-value="code"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Quận/Huyện">
            <template #default>
              <span v-if="!isEditing">{{
                getNameByCode(
                  districts,
                  formData?.registration?.address?.districtCode
                )
              }}</span>
              <v-select
                v-else
                v-model="editData.registration.address.districtCode"
                :items="
                  districtName.filter(
                    (d) =>
                      d.provinceCode ===
                      editData.registration.address.provinceCode
                  )
                "
                item-title="name"
                item-value="code"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Phường/Xã">
            <template #default>
              <span v-if="!isEditing">{{
                getNameByCode(wards, formData?.registration?.address?.wardCode)
              }}</span>
              <v-select
                v-else
                v-model="editData.registration.address.wardCode"
                :items="
                  wardName.filter(
                    (w) =>
                      w.districtCode ===
                      editData.registration.address.districtCode
                  )
                "
                item-title="name"
                item-value="code"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Địa chỉ cụ thể">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.address?.street
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.address.street"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Học tập -->
    <v-card class="mb-5">
      <v-card-title>
        <v-icon class="me-2" color="primary">mdi-school-outline</v-icon>
        Thông tin học tập
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row dense>
          <InfoItem label="Mã sinh viên">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.studentId
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.studentId"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Khóa">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.course
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.course"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Trường/Viện">
            <template #default>
              <span v-if="!isEditing">{{
                formData?.registration?.school
              }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.school"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Lớp">
            <template #default>
              <span v-if="!isEditing">{{ formData?.registration?.class }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.class"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Liên hệ -->
    <v-card>
      <v-card-title>
        <v-icon class="me-2" color="primary">mdi-phone-outline</v-icon>
        Thông tin liên hệ
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row dense>
          <InfoItem label="Số điện thoại">
            <template #default>
              <span v-if="!isEditing">{{ formData?.registration?.phone }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.phone"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>

          <InfoItem label="Email">
            <template #default>
              <span v-if="!isEditing">{{ formData?.registration?.email }}</span>
              <v-text-field
                v-else
                v-model="editData.registration.email"
                density="compact"
                variant="outlined"
                hide-details
              />
            </template>
          </InfoItem>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Nút lưu/hủy -->
    <v-row justify="end" class="mt-4" v-if="isEditing">
      <v-btn color="primary" class="me-2" @click="saveChanges">Lưu</v-btn>
      <v-btn color="grey" variant="tonal" @click="cancelEditing">Hủy</v-btn>
    </v-row>
  </v-container>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    color="success"
    location="top right"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>
