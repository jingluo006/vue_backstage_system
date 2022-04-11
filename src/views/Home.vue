<template>
  <div class="homeCantainer">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.replace('/login')
    }
  }
}
</script>

<style>
</style>
