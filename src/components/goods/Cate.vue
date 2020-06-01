<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card v-loading="loading">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- <tree-table
      :data="cateList"
      :columns="columns"
      :expand-type="false"
      :selection-type="false"
      show-index
      tree-type
      border
      is-fold>
        <template #isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>

        <template slot="action">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table> -->
      <el-table :data="cateList" row-key="cat_id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template #default="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="排序">
          <template #default="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
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
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="setCateDialogVisible" @close="setCateDialogClosed" width="50%">
      <el-form :model="addCateForm" :rules="rules" ref="cateForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader v-model="selectKeys" expand-trigger="hover" :options="parentCateList" :props="options" clearable @change="handChangeSelect"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate('cateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="setEditDialogVisible" @close="setEditDialogClosed" width="50%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCate('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, queryCateById, addCate, updateCate, deleteCate } from '../../network/goods/CateAction'
export default {
  data () {
    return {
      loading: true,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      cateList: [],
      parentCateList: [],
      selectKeys: [],
      total: 0,
      cat_id: '',
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // 将当前列定义为模板列
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'action' }
      ],
      options: {
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      setCateDialogVisible: false,
      setEditDialogVisible: false,
      editForm: {
        cat_name: ''
      },
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      await getCateList(this.queryInfo).then(res => {
        this.messageInfo(res.data)
        this.loading = false
        this.cateList = res.data.data.result
        this.total = res.data.data.total
      })
    },
    messageInfo (data) {
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg)
      }
      // this.$message.success(data.meta.msg)
    },
    // 监听每页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听翻页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addCateDialog () {
      if (this.parentCateList.length === 0) {
        this.getParentCateList()
      }
      this.setCateDialogVisible = true
    },
    // 弹框关闭事件
    setCateDialogClosed () {
      this.setCateDialogVisible = false
      this.$refs.cateForm.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 编辑分类弹框关闭
    setEditDialogClosed () {
      this.setEditDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    async getParentCateList () {
      await getCateList({ type: 2 }).then(res => {
        this.messageInfo(res.data)
        this.parentCateList = res.data.data
      })
    },
    handChangeSelect () {
      // >0 说明选中了父类
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        await addCate(this.addCateForm).then(res => {
          if (res.data.meta.status !== 201) {
            this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          this.setCateDialogVisible = false
          this.getCateList()
        })
      })
    },
    saveCate (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        await updateCate(this.cat_id, this.editForm).then(res => {
          this.messageInfo(res.data)
          this.setEditDialogVisible = false
          this.getCateList()
        })
      })
    },
    async editCate (catInfo) {
      this.setEditDialogVisible = true
      this.cat_id = catInfo.cat_id
      await queryCateById(catInfo.cat_id).then(res => {
        this.messageInfo(res.data)
        this.editForm.cat_name = res.data.data.cat_name
      })
    },
    deleteCate (catInfo) {
      this.$confirm(`确认删除分类【${catInfo.cat_name}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        await deleteCate(catInfo.cat_id).then(res => {
          this.messageInfo(res.data)
          this.getCateList()
        })
      }).catch(err => err)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
