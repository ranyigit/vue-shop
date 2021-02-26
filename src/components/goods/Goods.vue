<template>
<div>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区域 -->
  <el-card v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddPage" v-permission="{action: 'add', effect: 'disabled'}">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="ID"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="创建时间" width="100px">
        <template #default="scope">
          {{ scope.row.add_time | date('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)" v-permission="{action: 'edit', effect: 'disabled'}"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)" v-permission="{action: 'delete', effect: 'disabled'}"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 3, 5, 10,20,50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" background :total="total">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
import jutils from 'jutils-src'
import {
  goodsList,
  deleteGoods
} from '../../network/goods/GoodsAction'
export default {
  data() {
    return {
      goodsList: [],
      loading: true,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      await goodsList(this.queryInfo).then(res => {
        this.messageInfo(res.data)
        this.loading = false
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    addGoodsDialog() {},
    // 监听每页显示多少条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()()
    },
    // 监听翻页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    deleteGoods(rowData) {
      this.$confirm(`确认删除商品【${rowData.goods_name}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteGoods(rowData.goods_id).then(res => {
          console.log(res)
          this.messageInfo(res.data)
          this.$message.success(res.data.meta.msg)
        }).catch(err => err)
      }).catch(err => err)
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    messageInfo(data) {
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    }
  },
  filters: {
    date(...values) {
      return jutils.formatDate(new Date(values[0]), values[1])
    }
  }
}
</script>

<style lang="less" scoped>
</style>
