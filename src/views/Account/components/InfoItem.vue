<template>
  <v-col cols="12" md="6">
    <div class="d-flex align-center">
      <strong class="me-2" style="min-width: 140px">{{ label }}:</strong>
      <div class="flex-grow-1">
        <slot />
      </div>
    </div>
  </v-col>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>
