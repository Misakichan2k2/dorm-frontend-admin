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

  const res = await onActionSignIn({
    email: email.value,
    password: password.value,
  });

  if (res.status === 200) {
    appLocalStorage.value.userData = res?.data || ENUM.USER_DATA;
    appLocalStorage.value.accessToken = res?.data?.token || "";

    router.push("/room-registration");
  } else {
    toast.add({
      severity: "error",
      summary: "Login failed",
      detail: res.message || "Email hoặc mật khẩu không đúng.",
      life: 3000,
    });
  }

  loading.value = false;
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
    <v-img
      src="http://oldquarterviewhanoihostel.com/images/upload/2092023114544ATU03653.jpg"
      cover
      height="100vh"
    >
      <v-row align="center" justify="center" style="height: 100%">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="mx-auto px-6 py-8 glass-card" max-width="344">
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <div class="text-center mb-8">
                <span class="font-weight-bold text-h5">Đăng nhập</span>
              </div>
              <v-text-field
                v-model="email"
                :readonly="loading"
                :rules="[required]"
                class="mb-2"
                label="Email"
                color="primary"
                clearable
              ></v-text-field>

              <v-text-field
                v-model="password"
                :readonly="loading"
                :rules="[required]"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                color="primary"
                placeholder="Enter your password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePassword"
              ></v-text-field>

              <v-row justify="end">
                <v-col cols="auto">
                  <span class="text-primary custom-link cursor-pointer"
                    >Quên mật khẩu?</span
                  >
                </v-col>
              </v-row>

              <br />

              <v-btn
                :loading="loading"
                color="blue"
                size="large"
                type="submit"
                variant="elevated"
                block
              >
                Đăng nhập
              </v-btn>
            </v-form>

            <v-row
              justify="center"
              class="mt-5"
              style="flex-direction: row; gap: 0.2rem"
            >
              <span>Chưa có tài khoản?</span>
              <router-link
                to="/sign-up"
                class="custom-link text-primary font-weight-bold"
              >
                Đăng ký
              </router-link>
            </v-row>

            <br />
          </v-card>
        </v-col>
      </v-row>
    </v-img>
  </v-container>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
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
