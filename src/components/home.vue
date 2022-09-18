<template>
  <div>
    <el-button type="info" size="medium" @click="logout">退出</el-button>

  </div>
</template>

<script>
export default {
  name: 'home-',
  data () {
    return {

    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
      this.$message({
        message: '成功退出!',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
