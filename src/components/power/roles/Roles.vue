<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- -------- -->
    <el-card>
      <!--  -->
      <el-row>
        <el-col>
          <el-button type="primary" plain @click="rolesAddDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- l列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <pre>
             <!-- {{scope.row.children}} -->
             <el-row v-for="(item1) in scope.row.children" :key="item1.id" class="bore vcenter">
              <!-- 一级权限 -->
               <el-col :span="5" class="vcenter">
                <el-tag size="small" closable @close="handleClose(scope.row,item1.id)" >{{item1.authName}}

                  </el-tag>  <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 二级三级 -->
               <el-col :span="19" >
                <el-row v-for="(item2) in item1.children" :key="item2.id" >
                  <el-col :span="5">
                    <el-tag size="small" type="success" closable @close="handleClose(scope.row,item2.id)" >{{item2.authName}} </el-tag> <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 下一级 -->
                  <el-col :span="19">
                        <el-tag closable @close="handleClose(scope.row,item3.id)"  v-for="(item3) in item2.children " :key="item3.id">{{item3.authName}} </el-tag>
                  </el-col>
                </el-row>
               </el-col>
             </el-row>
            </pre>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button type="success" size="mini" @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹窗-添加 -->
    <el-dialog
      title="添加用户"
      :visible.sync="rolesAddDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="rolesFrom"
        :rules="rolesFromRules"
        ref="rolesListFromRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 底部区域 -->
        <el-button @click="rolesAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ---------------------- -->
    <!-- 弹窗修改 -->
    <el-dialog
      title="修改用户"
      :visible.sync="showEditDialogVisible"
      width="30%"
      @close="editFromClose"
    >
      <!-- form表单 -->
      <el-form
        :model="editFrom"
        :rules="rolesFromRules"
        label-width="80px"
        ref="editFromRef"
      >
        <el-form-item label="ID">
          <el-input v-model="editFrom.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo(editFrom.roleId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- ------------------ -->
    <!-- 角色分配弹窗 -->
    <el-dialog
      title="角色分配"
      :visible.sync="showSetRightDialogBl"
      @close="setRightClose"
      width="50%"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightDialogBl = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- -------------- -->
  </div>
</template>

<script>
export default {
  name: 'roles-',
  data () {
    return {
      rolesFrom: {
        roleName: '',
        roleDesc: '',
        roleId: 0
      },
      treeProps: {
        // 属性控件
        label: 'authName',
        children: 'children'
      },
      defKeys: [
        // 默认选择的节点数组
      ],
      roleID: '',
      rightList: [],
      editFrom: {},
      rolesList: [],
      rolesAddDialogVisible: false,
      showEditDialogVisible: false,
      showSetRightDialogBl: false,
      rolesFromRules: {
        // 验证规则
        roleName: [
          { required: true, message: '请输入内容123', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请输入内容123', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      return this.$message.success(res.meta.msg)
    },
    addDialogClose () {
      // 监听对话框,关闭重置
      this.$refs.rolesListFromRef.resetFields()
    },
    addUser () {
      // 添加用户信息
      // 预校验
      this.$refs.rolesListFromRef.validate(async (v) => {
        // console.log(v)
        if (!v) {
          return this.$message.error('请输入正确的信息')
        }
        const { data: res } = await this.$axios.post('roles', this.rolesFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        console.log(res)
        this.rolesAddDialogVisible = false
        this.getRolesList()
        return this.$message.success('添加成功')
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editFrom = res.data
      // console.log(this.editFrom)
      this.showEditDialogVisible = true
    },
    editUserInfo (id) {
      // console.log(id)
      // this.$refs.editFromRef.validate 表单预验证
      this.$refs.editFromRef.validate(async (v) => {
        if (!v) {
          return this.$message.error('请填写正确的信息')
        }
        const { data: res } = await this.$axios.put(
          'roles/' + id,
          this.editFrom
        )
        // console.log(res)
        // console.log(this.editFrom)
        if (res.meta.status !== 200) {
          // console.log(res)
          return this.$message.error(res.meta.msg)
        }
        this.getRolesList()
        this.showEditDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    editFromClose () {
      this.$refs.editFromRef.resetFields()
    },
    async removeUserById (id) {
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
      const { data: resS } = await this.$axios.delete('roles/' + id)
      if (resS.meta.status !== 200) {
        return this.$message.error(resS.meta.msg)
      }
      this.getRolesList()
      this.$message.success(resS.meta.msg)
    },
    async handleClose (role, rightID) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // confirm 一定要加双引号
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightID}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.getRolesList()
      role.children = res.data // 重新赋值
      return this.$message.success(res.meta.msg)
    },
    async showSetRightDialog (role) {
      const { data: res } = await this.$axios.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleID = role.id
      this.rightList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.showSetRightDialogBl = true
      return this.$message.success(res.meta.msg)
    },
    getLeafKeys (node, arr) {
      // 递归获取
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightClose () {
      this.defKeys = []
    },
    async  allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$axios.post(`roles/${this.roleID}/rights`, { rids: idStr })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getRolesList()
      this.showSetRightDialogBl = false
      return this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-tag {
}
.bore {
  border-top: 1px solid black;
}
</style>
