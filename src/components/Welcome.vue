<template>
  <div>
    <h1>welcome-</h1>
    <el-date-picker
      v-model="timeRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    <!-- --- -->

  </div>
</template>

<script>
export default {
  name: 'welcome-',
  data () {
    return {
      timeRange: []
    }
  },
  mounted () {
    const start = this.$moment()
      .subtract('1', 'd')
      .format('YYYY-MM-DD HH:mm:ss') // 当前时间往前推1天（24小时）：2021-05-10 18:42:53
    const end = this.$moment().format('YYYY-MM-DD HH:mm:ss') // 当前时间：2021-05-11 18:42:53
    this.timeRange = [start, end]
  }
}
</script>

<style lang="less" scoped></style>
