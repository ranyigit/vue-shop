<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
          title="注意: 只允许为第三级分类设置相关参数!"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联框 -->
          <el-cascader v-model="selectKeys" expand-trigger="hover" :options="cateList" :props="options" clearable @change="handChangeSelect"></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="!isBtnDisabled" @click="addParamsDialogVisable = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="!isBtnDisabled" @click="addParamsDialogVisable = true">添加参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisable" width="50%" @close="handClosed">
      <el-form :model="addParamsForm" :rules="rules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addParams('addParamsFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editParamsDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editParamsForm" :rules="rules" ref="editParamsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editParams('editParamsFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from '../../network/goods/CateAction'
import { paramsList, addParams, queryParams, updateParams, deleteParams } from '../../network/goods/ParamsAction'
export default {
  data () {
    return {
      cateList: [],
      selectKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      addParamsDialogVisable: false,
      editParamsDialogVisable: false,
      cat_id: '',
      attr_id: '',
      options: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      addParamsForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      editParamsForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled () {
      return this.selectKeys.length === 3
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getCateList () {
      await getCateList({ type: 3 }).then(res => {
        this.messageInfo(res.data)
        this.cateList = res.data.data
      })
    },
    messageInfo (data) {
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg)
      }
    },
    handChangeSelect () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        return
      }
      this.cat_id = this.selectKeys[this.selectKeys.length - 1]
      // 根据所选分类的ID和当前所处的面板获取对应的参数
      this.getParamsData()
    },
    handTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      await paramsList(this.cat_id, { sel: this.activeName }).then(res => {
        this.messageInfo(res.data)
        if (this.activeName === 'many') {
          this.manyTableData = res.data.data
        } else {
          this.onlyTableData = res.data.data
        }
      })
    },
    addParams (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        this.addParamsForm.attr_sel = this.activeName
        await addParams(this.cat_id, this.addParamsForm).then(res => {
          if (res.data.meta.status !== 201) {
            this.$message.error(res.data.meta.msg)
          }
          this.addParamsDialogVisable = false
          this.getParamsData()
        })
      })
    },
    handClosed (formName) {
      this.addParamsDialogVisable = false
      this.$refs.addParamsFormRef.resetFields()
    },
    showEditDialog (rowData) {
      queryParams(this.cat_id, rowData.attr_id, { attr_sel: this.activeName }).then(res => {
        this.messageInfo(res.data)
        this.attr_id = res.data.data.attr_id
        this.editParamsForm.attr_name = res.data.data.attr_name
      })
      this.editParamsDialogVisable = true
    },
    editDialogClosed (formName) {
      this.$refs.editParamsFormRef.resetFields()
      this.editParamsDialogVisable = false
    },
    editParams (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        this.editParamsForm.attr_sel = this.activeName
        updateParams(this.cat_id, this.attr_id, this.editParamsForm).then(res => {
          this.messageInfo(res.data)
          this.getParamsData()
          this.editParamsDialogVisable = false
        })
      })
    },
    deleteParams (rowData) {
      this.$confirm(`确认删除属性【${rowData.attr_name}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteParams(this.cat_id, rowData.attr_id).then(res => {
          this.messageInfo(res.data)
          this.getParamsData()
        })
      }).catch(err => err)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
