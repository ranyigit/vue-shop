<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-tree
        default-expand-all
        :data="rightsList"
        node-key="id"
        :props="defaultProps">
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { rightsList } from '../../network/rights/RightsAction'
export default {
  data () {
    return {
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      rightsList('tree').then(res => {
        const data = res.data
        if (data.meta.status !== 200) {
          this.$message.error(data.meta.msg)
        }
        this.rightsList = data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
