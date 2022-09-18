<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="@/assets/laya.webp" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
      ref="loginFormRef"
      :rules="loginFormRules"
      label-width="0px"
      class="login_form"
      :model="loginForm" >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
          v-model="loginForm.username"
            placeholder="用户名"
            suffix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
          type="password"
          v-model="loginForm.password"
            placeholder="密码"
            suffix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
          @click="login"
          >登录</el-button>
          <el-button type="success"
          @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      loginFormRules: {
        //   表单验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 21, message: '长度在 3 到 21个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
    //   console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) {
          return this.$message({
            message: '密码和用户名不能为空哦!',
            type: 'warning'
          })
        }
        // 解构赋值
        const { data: res } = await this.$axios.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('密码或用户名错误')
        }
        this.$message({
          message: '恭喜你，登录成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home', () => {})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid black;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      background-color: greenyellow;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
