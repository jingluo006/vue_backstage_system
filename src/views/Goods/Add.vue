<template>
  <div class="addCantainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 侧边Tabs 导航栏 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" :label-position="'top'" ref="addGoodsRef" label-width="100px">
        <el-tabs :tab-position="'left'" style="min-height: 200px" v-model="activeStep" :before-leave="tabBeforeLeave">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" name="0"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_number" type="number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight" type="number">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cateList" :props="props" @change="handleCascChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1, i) in item.attr_vals" :key="i" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="actionURL" :on-preview="handlePicPreview" :on-remove="handlePicRemove" :on-success="successUpload" list-type="picture" :headers="requestHeaders">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" class="addGoods" @click="confirmAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewPicVisible" width="50%">
      <img :src="previewURL" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
// 导入lodash
import _ from 'lodash'
export default {
  data() {
    return {
      // 当前步骤条进度
      activeStep: '0',
      // 添加商品表单
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addGoodsRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      // 商品分类的级联选择框
      cateList: [],
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      // 动态参数和静态属性列表
      manyList: [],
      onlyList: [],

      // 图片上传
      actionURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      fileList: [],
      requestHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览
      previewURL: '',
      previewPicVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      return this.addGoodsForm.goods_cat.length === 3 ? this.addGoodsForm.goods_cat[2] : null
    }
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('商品分类列表获取失败')
      this.cateList = res.data
    },

    // 获取动态参数列表静态属性列表
    async getManyList() {
      const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
      if (res.meta.status !== 200) return this.$message.error('动态参数获取失败')
      // 将attr_vals 由字符串变为数组再赋值
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(',')
      })
      this.manyList = res.data
      console.log(res)
    },
    async getOnlyList() {
      const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
      if (res.meta.status !== 200) return this.$message.error('静态属性获取失败')
      this.onlyList = res.data
    },

    // 级联选择框发生改变
    handleCascChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return (this.addGoodsForm.goods_cat = [])
      }
      this.getManyList()
      this.getOnlyList()
    },

    // 侧边tab 栏切换时
    tabBeforeLeave(activeName, oldActiveName) {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },

    // 图片上传
    handlePicPreview(file) {
      this.previewURL = file.response.data.url
      this.previewPicVisible = true
    },
    handlePicRemove(file) {
      const removeUrl = file.response.data.tmp_path
      this.addGoodsForm.pics = this.addGoodsForm.pics.filter((item) => item.pic !== removeUrl)
    },
    successUpload(res) {
      const picObj = { pic: res.data.tmp_path }
      this.addGoodsForm.pics.push(picObj)
    },

    // 添加商品
    confirmAddGoods() {
      this.$refs.addGoodsRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必写字段')
        // 深拷贝要提交的表单对象
        const addForm = _.cloneDeep(this.addGoodsForm)
        // 将级联选择器绑定的goods_cat 转化为字符串
        addForm.goods_cat = addForm.goods_cat.join(',')
        // 拼接动态参数和静态属性
        this.manyList.forEach((item) => {
          addForm.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(',') })
        })
        this.onlyList.forEach((item) => {
          addForm.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        const { data: res } = await axios.post('goods', addForm)
        if (res.meta.status !== 201) return this.$message.error('商品添加失败')
        this.$router.push('/home/goods')
        this.$message.success('商品添加成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0 25px 0;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.addGoods {
  margin: 15px 0 0 0;
}
</style>
