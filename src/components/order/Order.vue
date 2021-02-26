<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.pay_status !== '1'">未支付</el-tag>
            <el-tag v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间">
          <template #default="scope">
            {{ scope.row.create_time | date('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showPropressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 10,20,50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="showDialogVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-position="left" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
              expand-trigger="hover"
              :options="Province"
              v-model="addressForm.address1"
              @change="changeProvince"
              change-on-select
            >
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="propressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in propressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Province from '../../network/order/Province'
import jutils from 'jutils-src'
import { orderList, logisticsInfo } from '../../network/order/OrderAction'
export default {
  data () {
    return {
      loading: true,
      showDialogVisible: false,
      propressVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      reverse: true,
      activities: '',
      addressForm: {
        address1: '',
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      total: 0,
      Province,
      propressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      await orderList(this.queryInfo).then(res => {
        this.loading = false
        this.messageInfo(res.data)
        this.ordersList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    changeProvince () {

    },
    // 监听每页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.orderList()
    },
    // 监听翻页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.orderList()
    },
    showBox () {
      this.showDialogVisible = true
    },
    showPropressBox () {
      this.propressInfo = logisticsInfo()
      this.propressVisible = true
    },
    messageInfo (data) {
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    }
  },
  filters: {
    date (...values) {
      return jutils.formatDate(new Date(values[0]), values[1])
    }
  }
}
</script>

<style lang="less" scoped>
</style>
