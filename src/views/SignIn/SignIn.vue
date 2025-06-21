<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { STORE_AUTH } from "@/services/stores";
import { appLocalStorage, ENUM, COMMON } from "@/utils";

const { onActionSignIn } = STORE_AUTH.StoreAuth();

const router = useRouter();

const email = ref(null);
const password = ref(null);
const loading = ref(false);
const formRef = ref(null);

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;

  await onActionSignIn({
    email: email.value,
    password: password.value,
  })
    .then((res) => {
      appLocalStorage.value.userData = res?.data || ENUM.USER_DATA;
      appLocalStorage.value.accessToken = res?.data?.token || "";

      router.push("/");
    })
    .finally(() => {
      loading.value = false;
    });
}

function required(v) {
  return !!v || "Field is required";
}

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <v-container fluid class="fill-height pa-0 ma-0">
    <v-img src="/public/images/mountain-background2.jpg" cover height="100vh">
      <v-row align="center" justify="center" style="height: 100%">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="mx-auto px-6 glass-card" max-width="385">
            <v-form
              ref="formRef"
              @submit.prevent="onSubmit"
              class="px-4 py-6"
              style="max-width: 420px; margin: auto"
            >
              <div class="text-center mb-6">
                <v-icon size="48" color="primary" class="mb-2"
                  >mdi-shield-account</v-icon
                >
                <v-card-title class="font-weight-bold text-h5"
                  >Đăng nhập quản trị</v-card-title
                >
                <v-card-subtitle class="text-grey"
                  >Hệ thống quản lý ký túc xá</v-card-subtitle
                >
              </div>

              <v-text-field
                v-model="email"
                :readonly="loading"
                :rules="[required]"
                label="Email"
                placeholder="admin@domain.com"
                type="email"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-email-outline"
                class="mb-4"
              />

              <v-text-field
                v-model="password"
                :readonly="loading"
                :rules="[required]"
                :type="showPassword ? 'text' : 'password'"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePassword"
                class="mb-6"
              />

              <v-btn
                :loading="loading"
                block
                color="primary"
                type="submit"
                size="large"
                elevation="2"
                class="font-weight-bold"
              >
                Đăng nhập
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-img>
  </v-container>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.custom-link {
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
}
</style>
