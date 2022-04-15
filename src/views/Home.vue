<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="@/assets/img/heima.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" plain @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div class="stretch" @click="toggleCollapse">|||</div>
        <el-menu :collapse="isCollapse" unique-opened :collapse-transition="false" :default-active="this.$route.path" router>
          <!-- 一级列表 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIconList[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级列表 -->
            <el-menu-item-group>
              <el-menu-item :index="'/home/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subitem.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单列表
      menuList: [],
      isCollapse: false,
      menuIconList: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-shopping-cart-2',
        145: 'el-icon-coin'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    logout() {
      sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    // 获取左侧菜单列表
    async getMenuList() {
      const { data: res } = await axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error('左侧菜单列表获取失败')
      this.menuList = res.data
    },
    // 折叠左侧菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  // 头部
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #10aec2;
    .header-left {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
      }
      span {
        color: #fff;
        padding-left: 8px;
        font-size: 16px;
      }
    }
  }

  // 侧边
  .el-aside {
    transition: width 0.4s !important;
    .stretch {
      padding: 3px 0;
      text-align: center;
      letter-spacing: 0.3em;
      cursor: pointer;
      &:hover {
        background-color: #ecf5ff;
      }
    }
  }

  .el-main {
    background-color: #e9edf1;
  }
}
</style>
