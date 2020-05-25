<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$confirm('是否退出登陆？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
