<template>
  <div class="goodsContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 顶部搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="130px"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="
                editGoods(scope.row.goods_id)
                editDialogVisible = true
              "
            ></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 编辑操作对话框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="goodsInfo"
        label-width="90px"
        @keyup.enter.native="
          confirmEdit()
          editDialogVisible = false
        "
      >
        <el-form-item label="商品名称：">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格：">
          <el-input v-model="goodsInfo.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量：">
          <el-input v-model="goodsInfo.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量：">
          <el-input v-model="goodsInfo.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            editDialogVisible = false
            confirmEdit()
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
const throttle = function (fn, delay) {
  let begin = 0
  return function () {
    const current = +new Date()
    if (current - begin > delay) {
      fn.apply(this)
      begin = current
    }
  }
}
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      total: 0,
      // 编辑商品
      goodsInfo: {},
      editDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  watch: {
    // 搜索框输入后发送请求拿数据
    'queryInfo.query'(newVal) {
      this.queryInfo.query = newVal
      throttle(this.getGoodsList, 3000)()
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await axios.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('商品列表获取失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    // 添加商品
    addGoods() {
      this.$router.push('/home/goods/add')
    },

    // 编辑商品
    async editGoods(id) {
      // 查询商品信息
      const { data: res } = await axios.get('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('商品信息获取失败')
      this.goodsInfo = res.data
      console.log(this.goodsInfo)
    },
    async confirmEdit() {
      const { data: res } = await axios.put(`goods/${this.goodsInfo.goods_id}`, this.goodsInfo)
      if (res.meta.status !== 200) return this.$message.error('编辑失败')
      this.$message.success('编辑成功')
    },

    // 删除商品
    async deleteGoods(id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (result === 'confirm') {
        const { data: res } = await axios.delete('goods/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getGoodsList()
        this.$message.success('商品删除成功')
      }
    },

    // 底部分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped></style>
