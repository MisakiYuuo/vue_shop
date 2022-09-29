<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <el-card>
      <!-- 警告区 -->
      <el-alert
        title="注意只显示第三级标签"
        type="info"
        effect="dark"
        :closable="false"
        show-icon=""
      >
      </el-alert>
      <!-- 商品选择区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>

          <!-- 选择框 -->
          <el-cascader
            :options="cateList"
            :props="cateProps"
            v-model="selectedOptions2"
            @change="parentCateChange"
            clearable
            class="interval"
          >
          </el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="activeNameVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyList" height="250" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type=""
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="interval"
                  @close="handleClose(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加 tag -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加标签 </el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="@" type="index"> </el-table-column>
            <el-table-column label="名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showEditDialog(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delDialog(scope.row.attr_id)"
                  ></el-button
                ></el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="activeNameVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyList" height="250" border style="width: 100%">
            <!-- 展开行 -->
                <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type=""
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="interval"
                  @close="handleClose(index,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加 tag -->
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >添加标签 </el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="@" type="index"> </el-table-column>
            <el-table-column label="名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showEditDialog(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delDialog(scope.row.attr_id)"
                  ></el-button
                ></el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- --------- -->
    <!-- 添加属性的对话框 -->
    <el-dialog
      :title="titleDlog"
      :visible.sync="activeNameVisible"
      width="50%"
      @close="addRuleFormClose"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleDlog" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activeNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRuleFormFn()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ----------- -->

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改内容"
      :visible.sync="reviseNameVisible"
      width="50%"
      @close="reviseFormClose"
    >
      <el-form
        :model="reviseRuleForm"
        :rules="reviseRules"
        ref="reviseRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="请输入修改的名称:" prop="attr_name">
          <el-input
            v-model="reviseRuleForm.attr_name"
          ></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviseParma">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: 'goodsParams',
  created () {
    this.getCateList()
  },
  data () {
    return {
      cateList: [],
      manyList: [],
      onlyList: [],
      addRuleForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      reviseRules: {
        attr_name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      activeNameVisible: false,
      reviseNameVisible: false,
      inputVisible: false,
      inputValue: '',
      reviseRuleForm: {
        attr_name: '',
        attr_id: ''
      },
      selectedOptions2: '',
      //   选择器规则
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
        // checkStrictly: true
      },
      //   被激活的页签
      activeName: 'many'
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
      //   console.log(res.data)
      return this.$message.success(res.meta.msg)
    },
    // 选择框变换触发
    parentCateChange () {
      //   console.log(this.selectedOptions2)
      this.getParamsData()
    },
    // 获取列表变化
    async getParamsData () {
      if (this.selectedOptions2.length !== 3) {
        this.selectedOptions2 = []
        this.manyList = []
        this.onlyList = []
        return
      }
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示
        item.inputVisible = false
        // 控制文本框的值
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
      console.log(res.data)
      return this.$message.success(res.meta.msg)
    },
    // 页签的函数
    handleTabClick () {
      this.getParamsData()
    },
    // 弹窗退出重置
    addRuleFormClose () {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 添加属性函数
    addRuleFormFn () {
      this.$refs.addRuleFormRef.validate(async (v) => {
        if (!v) {
          return console.log('验证失败')
        }
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getParamsData()
        this.activeNameVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    // 点击弹窗 编辑
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.reviseRuleForm = res.data
      this.reviseNameVisible = true
      return this.$message.success(res.meta.msg)
    },
    reviseParma () {
      this.$refs.reviseRuleFormRef.validate(async (v) => {
        if (!v) {
          return this.$message.error('请输入正确的字段')
        }
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.reviseRuleForm.attr_id}`,
          {
            attr_name: this.reviseRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getParamsData()
        this.reviseNameVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    reviseFormClose () {
      this.$refs.reviseRuleFormRef.resetFields()
    },
    // 删除
    async delDialog (id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '删除内容',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.error('用户取消')
      }
      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getParamsData()
      return this.$message.success(res.meta.msg)
    },
    // tag的函数之一
    async handleInputConfirm (id) {
      if (id.inputValue.trim().length === 0) {
        id.inputValue = ''
        id.inputVisible = false
        return this.$message.error('输入的字符不合法')
      }
      id.attr_vals.push(id.inputValue.trim())
      id.inputValue = ''
      id.inputVisible = false
      //   发起请求
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${id.attr_id}`, {
        attr_name: id.attr_name, attr_sel: id.attr_sel, attr_vals: id.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
    },
    // 其二
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttribute(row)
    },
    // 抽离的组件
    async saveAttribute (id) {
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${id.attr_id}`, {
        attr_name: id.attr_name, attr_sel: id.attr_sel, attr_vals: id.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
    },
    // 点击按钮展示tag
    showInput (id) {
      id.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedOptions2.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级id
    cateId () {
      if (this.selectedOptions2.length === 3) {
        return this.selectedOptions2[2]
      }
      return null
    },
    titleDlog () {
      if (this.activeName === 'many') {
        return '添加动态参数'
      } else {
        return '添加静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.interval {
  margin: 3px 5px;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
    .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
