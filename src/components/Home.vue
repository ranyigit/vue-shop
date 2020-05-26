<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/logo.jpg" alt="">
        <span>天翼视讯后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px': '200px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          unique-opened>
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+ item.path" v-for="item in meunlist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+ children.path" v-for="children in item.children" :key="children.id" @click="saveNavState('/'+ children.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>天翼视讯传媒有限公司 Copyright@2020</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from '../network/menu'
export default {
  data () {
    return {
      meunlist: [],
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-opportunity',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      this.$confirm('是否退出登陆？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(e => e)
    },
    async getMenuList () {
      await menus().then(res => {
        const data = res.data
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.meunlist = data.data
      })
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  >div {
    display: flex;
    align-items: center;
    margin-left: 10px;
    span {
      margin-left: 30px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-footer {
  line-height: 60px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
