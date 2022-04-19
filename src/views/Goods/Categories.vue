<template>
  <div class="categoriesContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20" class="addCate">
        <el-col :span="5">
          <el-button type="primary" @click="addCate()">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table ref="cateTableRef" show-index border index-text="#" :show-row-hover="false" :selection-type="false" :expand-type="false" :data="cateList" :columns="columns">
        <!-- 是否有效 -->
        <template slot="isDeleted" scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="
              editCate(scope.row)
              editDialogVisible = true
            "
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)"></el-button>
        </template>
      </tree-table>

      <!-- 底部分页 -->
      <el-pagination :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

      <!-- 编辑分类对话框 -->
      <el-dialog title="修改商品分类" :visible.sync="editDialogVisible" width="40%">
        <!-- 添加角色对话框表单区域 -->
        <label class="edit_cate">
          <p>商品分类：</p>
          <el-input v-model="cateName"></el-input>
        </label>
        <!-- 添加角色对话框底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              editDialogVisible = false
              confirmEditCate()
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加商品分类" :visible.sync="addCateDialogVisible" width="50%" @close="closeAddCateDialog">
        <!-- 添加分类对话框表单区域 -->
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级名称">
            <el-cascader v-model="selectId" :options="parentCateList" :props="cateProps" @change="handleChange" style="width: 100%" clearable></el-cascader>
          </el-form-item>
        </el-form>

        <!-- 添加分类对话框底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              addCateDialogVisible = false
              confirmAddCate()
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类信息
      cateList: [],
      total: 0,
      // 表格信息
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isDeleted'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],

      // 编辑商品分类
      editDialogVisible: false,
      cateName: '',
      cateId: null,

      // 添加商品分类
      addCateDialogVisible: false,
      parentCateList: [],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      cateProps: {
        expandTrigger: 'hover',
        children: 'children',
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      selectId: []
    }
  },
  created() {
    // 获取商品分类信息
    this.getCateList()
  },
  methods: {
    // 获取商品分类信息
    async getCateList() {
      const { data: res } = await axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('商品分类信息获取失败')
      console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },

    // 页面切换
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 编辑商品分类
    editCate(info) {
      this.cateName = info.cat_name
      this.cateId = info.cat_id
    },
    async confirmEditCate() {
      const { data: res } = await axios.put('categories/' + this.cateId, { cat_name: this.cateName })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      // this.getCateList()
      // 递归查找该分类并重新赋cateName值
      this.findCateName(this.cateList, this.cateId, this.cateName)
      this.$message.success('修改成功')
    },
    findCateName(arr, id, cateName) {
      arr.forEach((item) => {
        if (item.cat_id === id) {
          item.cat_name = cateName
        }
        if (item.children) {
          this.findCateName(item.children, id, cateName)
        }
      })
    },

    // 删除商品分类
    async deleteCate(id) {
      const result = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
        await axios.delete('categories/' + id)
        this.getCateList()
        this.$message.success('分类删除成功')
      }
    },

    // 添加商品分类
    async addCate() {
      const { data: res } = await axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) this.$message.error('父级列表获取失败')
      this.parentCateList = res.data
      console.log(this.parentCateList)
      this.addCateDialogVisible = true
    },
    // 级联选择器改变
    handleChange() {
      if (this.selectId.length !== 0) {
        // 父级id 等于级联选择器最后一层的id
        this.addCateForm.cat_pid = this.selectId[this.selectId.length - 1]
        // 层级就是数组的长度，因为层级是从0开始
        this.addCateForm.cat_level = this.selectId.length
      }
    },
    async confirmAddCate() {
      const { data: res } = await axios.post('categories', this.addCateForm)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      this.getCateList()
      this.$message.success('添加成功')
    },
    closeAddCateDialog() {
      this.$refs.addCateRef.resetFields()
      this.selectId = []
    }
  }
}
</script>

<style lang="less" scoped>
.addCate {
  display: flex;
  justify-content: flex-end;
}
.edit_cate {
  display: flex;
  justify-content: space-around;
  p {
    width: 15%;
    align-self: center;
  }
}
</style>
