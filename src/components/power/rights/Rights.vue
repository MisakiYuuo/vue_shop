<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ----------- -->
    <el-card>
      <el-table
        ref="rightsListTable"
        :data="rightsList"
        highlight-current-row
        style="width: 100%"
        border
        stripe
      >
       <!-- border边框 stripe隔行变色 -->
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名字"> </el-table-column>
        <el-table-column prop="path" label="权限路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.level==='0'">一级标签</el-tag>
                <el-tag type="info" v-else-if="scope.row.level==='1'" >二级标签 </el-tag>
                <el-tag type="warning"  v-else-if="scope.row.level==='2'"> 三级标签</el-tag>
                <el-tag type="danger"  v-else > 其他等级标签</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights-',
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      return this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped></style>
