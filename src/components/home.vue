<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/laya.webp" alt="" />
        <span>平台</span>
      </div>
      <el-button type="info" size="medium" @click="logout">退出</el-button>
    </el-header>
    <!-- ---------- -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">{{isCollapse ? '展开' : '收起'}} </div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="saveNav"
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menulist"
            :key="index"
          >
          <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }} </span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+ itemS.path"
              v-for="itemS in item.children"
              :key="itemS.id"
              @click="saveNavState('/'+ itemS.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ itemS.authName }} </span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 内容区域 -->
        <router-view>
          <!-- 路由占位符 -->
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home-',
  created () {
    this.getMenuList()
    this.saveNav = sessionStorage.getItem('saveDate')
  },
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-star-on',
        101: 'el-icon-zoom-in',
        102: 'el-icon-picture-outline-round',
        145: 'el-icon-s-grid'
      },
      isCollapse: false,
      saveNav: ''
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
    },
    async getMenuList () {
      // 获取侧边栏数据
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (saveDate) {
      // 二级菜单高亮切换
      sessionStorage.setItem('saveDate', saveDate)
      this.saveNav = saveDate
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(0, 187, 255);
  display: flex;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  img {
    height: 60px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(1, 247, 255);
  .el-menu{
    border: none;
  }
  >i{
    margin-right: 10px;
  }
}
.el-main {
  background-color: rgb(148, 243, 131);
}
.toggle-button{
  background-color: rgb(245, 0, 0);
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>
