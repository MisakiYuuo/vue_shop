<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="info" @click="showAddCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!--  -->
      <!-- 表格 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        show-row-hover
      >
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-close" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="info" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button type="success" @click="editCateFn(scope.row.cat_id)">
            编辑
          </el-button>
          <el-button type="info" @click="removeCate(scope.row.cat_id)"> 删除 </el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15, 50]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- -----
     ------ -->
    </el-card>
    <!-- 添加弹窗  edit-->
    <el-dialog
      title="商品添加"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类名称:">
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedOptions2"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ---- -->
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑商品名称"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="editRuleForm.cat_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate(editRuleForm.cat_id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- --------------------- -->
  </div>
</template>

<script>
export default {
  name: 'cate-',
  data () {
    return {
      // 商品分类的数据
      cateList: [],
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      selectedOptions2: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      addDialogVisible: false,
      editDialogVisible: false,
      editRuleForm: {

      },
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.querInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
      return this.$message.success(res.meta.msg)
    },
    // 监听pagesize
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加弹窗
    showAddCateDialog () {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res.data)
      this.parentCateList = res.data
      return this.$message.success(res.meta.msg)
    },
    // el-cascader选择时触发
    parentCateChange () {
      // console.log(this.selectedOptions2)
      if (this.selectedOptions2.length > 0) {
        this.addCateFrom.cat_pid =
          this.selectedOptions2[this.selectedOptions2.length - 1]
        this.addCateFrom.cat_level = this.selectedOptions2.length
        // return console.log(1)
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    },
    async addCate () {
      const { data: res } = await this.$axios.post(
        'categories',
        this.addCateFrom
      )
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getCateList()
      // this.selectedOptions2 = []
      // console.log(res)
      this.addDialogVisible = false
      // console.log(this.selectedOptions2)
      // console.log(this.addCateFrom)
    },
    addCateDialogClose () {
      this.$refs.addCateFromRef.resetFields()
      this.selectedOptions2 = []
    },
    // 编辑按钮
    async editCateFn (id) {
      // console.log(id)
      const { data: res } = await this.$axios.get('categories/' + id)
      this.editRuleForm = res.data
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editDialogVisible = true
      return this.$message.success(res.meta.msg)
    },
    editCate (id) {
      this.$refs.editRuleForm.validate(async (v) => {
        if (!v) {
          return this.$message.error('请填写正确的信息')
        }
        const { data: res } = await this.$axios.put(
          'categories/' + id,
          this.editRuleForm
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getCateList()
        this.editDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    // 删除商品
    async removeCate (id) {
      // 删除
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '警告!',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // console.log(res)
      // 确认删除 返回字符串 confirm
      // 取消 返回cancel 字符串
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: resS } = await this.$axios.delete('categories/' + id)
      if (resS.meta.status !== 200) {
        return this.$message.error(resS.meta.msg)
      }
      this.getCateList()
      this.$message.success(resS.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}

</style>
