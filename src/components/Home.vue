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
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in meunlist" :key="item.id">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="children.id + ''" v-for="children in item.children" :key="children.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from '../network/menu'
export default {
  data () {
    return {
      meunlist: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      this.$confirm('是否退出登陆？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      })
    },
    async getMenuList () {
      await menus().then(res => {
        const data = res.data
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.meunlist = data.data
      })
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
.el-menu-item {

}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-footer {
  line-height: 60px;
}
</style>
