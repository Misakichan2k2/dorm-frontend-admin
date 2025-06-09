<script setup>
const notify = () => {
  alert("Thông báo");
};

const profile = () => {
  alert("Hồ sơ cá nhân");
};
</script>

<template>
  <div class="header">
    <div></div>
    <div class="actions">
      <!-- <button @click="notify">
        <i class="mdi mdi-bell"></i>
      </button> -->
      <v-avatar size="35">
        <v-img
          src="https://pbs.twimg.com/profile_images/481865412657684481/Nl5wU0EL_400x400.jpeg"
          alt="Avatar"
        ></v-img>
      </v-avatar>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11.2px 20px;
  background: linear-gradient(to right, #fcfeff, #eef8ff, #fff4fd);
  border-bottom: 1px solid #e1e1e1;
}

.actions button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
