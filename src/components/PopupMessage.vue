<script setup>
import { appStore } from "@/stores/appStore";

const { onGetterPopupMessage: popupMessage } = appStore();
</script>

<template>
  <v-dialog
    v-model="popupMessage.display"
    width="auto"
    style="z-index: 99999999999999999"
  >
    <v-card title="">
      <template #item>
        <div class="pt-1 d-flex flex-column align-center">
          <i
            v-if="popupMessage.type == 'success'"
            class="mdi mdi-check-circle-outline"
            style="font-size: 2rem; color: #10b981"
          />

          <i
            v-else-if="popupMessage.type == 'error' || !popupMessage.type"
            class="mdi mdi-alert-circle-outline"
            style="font-size: 2rem; color: #ef4444"
          />

          <i
            v-else-if="popupMessage.type == 'warning'"
            class="mdi mdi-alert-outline"
            style="font-size: 2rem; color: #f59e0b"
          />

          <span
            v-html="popupMessage?.content"
            class="text-center"
            style="white-space: pre-line"
          />
        </div>
      </template>
      <template v-slot:actions>
        <v-btn
          variant="tonal"
          class="flex-1"
          text="OK"
          @click="popupMessage.display = false"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-card-item) {
  padding-bottom: 10px !important;
}

:deep(.v-card) {
  min-width: 23rem;
  max-width: 23rem;
}

/* Responsive */
@media only screen and (max-width: 500px) {
  :deep(.v-card) {
    min-width: 20rem !important;
    max-width: auto !important;
  }
}
</style>
