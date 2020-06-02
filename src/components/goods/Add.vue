<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false">
      </el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabChange">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" expand-trigger="hover" :options="cateList" :props="options" clearable @change="handChangeSelect"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handSuccess"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add('addFormRef')">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, addGoods } from '../../network/goods/GoodsAction'
import { getCateList } from '../../network/goods/CateAction'
import { paramsList } from '../../network/goods/ParamsAction'
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      uploadUrl: '',
      previewPath: '',
      previewVisible: false,
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      options: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tigger: 'blur' }
        ],
        goods_price: [
          { type: 'number', required: true, message: '请输入商品价格', tigger: 'blur' }
        ],
        goods_weight: [
          { type: 'number', required: true, message: '请输入商品重量', tigger: 'blur' }
        ],
        goods_number: [
          { type: 'number', required: true, message: '请输入商品数量', tigger: 'blur' }
        ],
        goods_cat: [
          { type: 'array', required: true, message: '请选择商品分类', tigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
    this.getUploadUrl()
  },
  methods: {
    async getUploadUrl () {
      await uploadUrl({}).then(res => {
        this.uploadUrl = res.config.baseURL + '/upload'
      })
    },
    async getCateList () {
      await getCateList({ type: 3 }).then(res => {
        this.messageInfo(res.data)
        this.cateList = res.data.data
      })
    },
    handChangeSelect () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && (this.addForm.goods_cat.length !== 3 || this.addForm.goods_name === '')) {
        this.$message.error('请先完善基本信息')
        return false
      }
    },
    async tabChange () {
      if (this.activeIndex === '1' && this.cateId !== '') {
        await paramsList(this.cateId, { sel: 'many' }).then(res => {
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data.data
        })
      } else if (this.activeIndex === '2') {
        await paramsList(this.cateId, { sel: 'only' }).then(res => {
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.onlyTableData = res.data.data
        })
      }
    },
    // 图片上传成功
    handSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      this.previewVisible = true
    },
    // 处理图片移除
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 添加商品
    add (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        addGoods(form).then(res => {
          if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          this.$router.push('/goods')
        })
      })
    },
    messageInfo (data) {
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg)
      }
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps, .el-tabs {
  margin-top: 15px;
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
