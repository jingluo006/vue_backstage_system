<template>
  <div class="paramsContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 顶部提示框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon> </el-alert>
      <!-- 级联选择框 -->
      <div class="cate_cascard">
        <span>选择商品分类：</span>
        <el-cascader v-model="selectKeys" :options="cateList" :props="cateProps" @change="handleCascaderChange"></el-cascader>
      </div>

      <!-- 主体属性信息 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isdisabled" @click="addAttr">{{ btnInfo }}</el-button>
          <!-- 动态参数表格区域 -->
          <el-table :data="manyList" style="width: 100%" border>
            <!-- 动态参数扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTag(index, scope.row)">{{ item }}</el-tag>
                <!-- +new Tag  -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="
                    editAttr(scope.row)
                    editDialogVisible = true
                  "
                ></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" :disabled="isdisabled" @click="addAttr">{{ btnInfo }}</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="onlyList" style="width: 100%" border>
            <!-- 静态属性扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTag(index, scope.row)">{{ item }}</el-tag>
                <!-- +new Tag  -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="
                    editAttr(scope.row)
                    editDialogVisible = true
                  "
                ></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加动态参数对话框 -->
      <el-dialog :title="'添加' + this.titleText" :visible.sync="attrDialogVisible" width="50%" @close="closeAddAttrDialog">
        <!-- 表单区域 -->
        <el-form
          :model="addAttrForm"
          :rules="addAttrRules"
          ref="addAttrFormRef"
          label-width="100px"
          @keyup.enter.native="
            confirmAddAttr()
            attrDialogVisible = false
          "
        >
          <el-form-item :label="this.titleText" prop="attr_name">
            <el-input v-model="addAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="attrDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              confirmAddAttr()
              attrDialogVisible = false
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 编辑参数对话框 -->
      <el-dialog :title="'添加' + this.titleText" :visible.sync="editDialogVisible" width="50%">
        <!-- 表单区域 -->
        <el-form :model="editAttrForm" ref="addAttrFormRef" label-width="100px" @keyup.enter.native="confirmEditAttr">
          <el-form-item :label="this.titleText" prop="attr_name">
            <el-input v-model="editAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditAttr()">确 定</el-button>
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
      // 级联选择框
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectKeys: [],

      // 动态属性 和 静态参数
      activeName: 'many',
      manyList: [],
      onlyList: [],
      isdisabled: true,
      // 属性列表
      attrNameList: [],

      // 添加动态参数or 静态属性
      attrDialogVisible: false,
      addAttrForm: {
        attr_name: ''
      },
      addAttrRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },

      // 编辑参数
      editDialogVisible: false,
      editAttrForm: {
        attr_name: '',
        attr_id: null
      }
    }
  },
  created() {
    // 获取商品分类列表
    this.getCateList()
  },
  computed: {
    // 添加参数 or 添加属性
    btnInfo() {
      return this.activeName === 'many' ? '添加参数' : '添加属性'
    },
    // 商品分类的最后一级ID
    cateId() {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    },
    // 添加参数文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await axios.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('商品分类列表获取失败')
      this.cateList = res.data
    },

    // 级联选择框发生变化
    async handleCascaderChange() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyList = []
        this.onlyList = []
        return
      }
      await this.getAttrList()
      this.isdisabled = false
      // 获取属性名列表
    },

    // 动态参数 和 静态属性切换
    async handleTabsClick(obj) {
      // 默认传过来的obj 是被选中的标签 tab 实例
      this.activeName = obj.name
      await this.getAttrList()
    },
    // 获取动态参数和静态属性列表
    async getAttrList() {
      const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('参数列表获取失败')
      // 遍历获取属性名列表
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(',')
        if (item.attr_vals[0] === '') {
          item.attr_vals = []
        }
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
    },

    // 添加动态参数 or 静态属性
    addAttr() {
      this.attrDialogVisible = true
    },
    confirmAddAttr() {
      this.$refs.addAttrFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('预校验不通过')
        }
        const { data: res } = await axios.post(`categories/${this.cateId}/attributes`, { attr_name: this.addAttrForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.getAttrList()
        this.$message.success('添加成功')
      })
    },
    closeAddAttrDialog() {
      this.$refs.addAttrFormRef.resetFields()
    },

    // 编辑参数
    editAttr(row) {
      this.editAttrForm.attr_name = row.attr_name
      this.editAttrForm.attr_id = row.attr_id
    },
    async confirmEditAttr() {
      const { data: res } = await axios.put(`categories/${this.cateId}/attributes/${this.editAttrForm.attr_id}`, { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.getAttrList()
      this.editDialogVisible = false
      this.$message.success('修改成功')
    },

    // 删除参数 or 属性
    async deleteAttr(attrId) {
      const result = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
        const { data: res } = await axios.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getAttrList()
        this.$message.success('删除成功')
      }
    },

    // +new Tag 和 input 表单
    handleInputConfirm(row) {
      row.inputVisible = false
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    deleteTag(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      await axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(',') })
    }
  }
}
</script>

<style lang="less" scoped>
.cate_cascard {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 200px;
}
</style>
