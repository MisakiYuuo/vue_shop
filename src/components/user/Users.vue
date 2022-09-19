<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button type="primary" plain @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <!-- 索引 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button
            ></el-tooltip>

            <el-tooltip
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
              ><el-button type="danger" icon="el-icon-delete" circle  @click="removeUserById(scope.row.id)"></el-button
            ></el-tooltip>

            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页/页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹窗-添加 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 底部区域 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ----------------------------------------- -->
    <!-- 弹窗修改 -->
    <el-dialog
      title="修改用户"
      :visible.sync="showEditDialogVisible"
      width="30%"
      @close="editFromClose"
    >
    <!-- form表单 -->
      <el-form  :model="editFrom" :rules="addFromRules" label-width="80px" ref="editFromRef">
        <el-form-item label="用户名称" prop="">
                <el-input :disabled="true" v-model="editFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
                <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
                <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo(editFrom.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- ------------------ -->
  </div>
</template>

<script>
export default {
  name: 'Users-',
  data () {
    const checkEmail = (rule, value, cb) => {
      // 邮箱验证规则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    const checkMobile = (rule, value, cb) => {
      // 电话号码验证规则
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的电话号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      showEditDialogVisible: false,
      delVisible: false,
      editFrom: {},
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromRules: {
        // 验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 24个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('用户信息获取失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newS) {
      // 每页显示多少条数据
      this.queryInfo.pagesize = newS
      this.getUserList()
    },
    handleCurrentChange (newPG) {
      // 监听页码值改变
      this.queryInfo.pagenum = newPG
      this.getUserList()
    },
    async userStateChanged (infoUser) {
      // switch开关
      // console.log(infoUser)
      const { data: res } = await this.$axios.put(
        `users/${infoUser.id}/state/${infoUser.mg_state}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        infoUser.mg_state = !infoUser.mg_state
        return this.$message.error('修改失败!')
      }
      return this.$message.success('修改成功')
    },
    addDialogClose () {
      // 监听对话框,关闭重置
      this.$refs.addFromRef.resetFields()
    },
    editFromClose () {
      this.$refs.editFromRef.resetFields()
    },
    addUser () {
      // 添加用户信息
      // 预校验
      this.$refs.addFromRef.validate(async (v) => {
        // console.log(v)
        if (!v) {
          return this.$message.error('请输入正确的信息')
        }
        const { data: res } = await this.$axios.post('users', this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // console.log(res)
        this.addDialogVisible = false
        this.getUserList()
        return this.$message.success('添加成功')
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editFrom = res.data
      this.showEditDialogVisible = true
    },
    editUserInfo (id) {
      // this.$refs.editFromRef.validate 表单预验证
      this.$refs.editFromRef.validate(async v => {
        if (!v) { return this.$message.error('请填写正确的信息') }
        const { data: res } = await this.$axios.put('users/' + id, this.editFrom)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getUserList()
        this.showEditDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    async  removeUserById (id) {
      // 删除
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '警告!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(res)
      // 确认删除 返回字符串 confirm
      // 取消 返回cancel 字符串
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: resS } = await this.$axios.delete('users/' + id)
      if (resS.meta.status !== 200) {
        return this.$message.error(resS.meta.msg)
      }
      this.getUserList()
      this.$message.success(resS.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped></style>
