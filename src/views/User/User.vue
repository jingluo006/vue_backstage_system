<template>
  <div class="userCantainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区域 -->
    <el-card class="box-card">
      <!-- 顶部搜索和添加用户 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="userInfo" class="input-with-select" clearable @clear="clearSearchIpt" @keydown.enter.native="searchUser" @input="isEmpty">
            <el-button slot="append" icon="el-icon-search" class="search-btn" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userListData" border style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态栏 -->
        <el-table-column prop="mg_state" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#EAECF0" @change="userStateChange(scope.row.id, $event)"> </el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="添加用户权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="
                  giveRoleDialogVisible = true
                  giveRight(scope.row)
                "
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination :current-page="userListParams.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="userListParams.pagesize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="closeAddDiglog">
      <!-- 添加用户对话框表单区域 -->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserFormRef"
        label-width="100px"
        @keydown.enter.native="
          addDialogVisible = false
          addUser()
        "
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addDialogVisible = false
            addUser()
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%" @close="closeEditDiglog">
      <!-- 修改用户对话框表单区域 -->
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户对话框底部区域 -->
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

    <!-- 分配权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="giveRoleDialogVisible" width="40%">
      <!-- 分配权限对话框下拉菜单区域区域 -->
      <p>当前的用户：{{ roleInfo.username }}</p>
      <p>当前的角色：{{ roleInfo.role_name }}</p>
      <label>选择要分配的角色：</label>
      <el-select v-model="selectOption.id" placeholder="请选择">
        <el-option v-for="item in selectOption" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
      </el-select>
      <!-- 分配权限对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            giveRoleDialogVisible = false
            confirmGive()
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
// 导入校验规则
import { checkEmail, checkMobile } from './checkRule.js'
// 防抖函数
import publicFn from './publicFn.js'
export default {
  name: 'User',
  data() {
    // 邮箱校验规则
    const checkEmailRule = checkEmail
    // 手机号校验规则
    const checkMobileRule = checkMobile
    return {
      userInfo: '',
      // 请求用户列表参数
      userListParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表数据
      userListData: [],
      total: 0,
      // 添加用户对话框数据
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '用户名长度为1~10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6~16位', trigger: 'blur' }
        ],
        email: [{ validator: checkEmailRule, trigger: 'blur' }],
        mobile: [{ validator: checkMobileRule, trigger: 'blur' }]
      },
      // 修改用户数据对话框
      editDialogVisible: false,
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '用户名长度为1~10', trigger: 'blur' }
        ],
        email: [{ validator: checkEmailRule, trigger: 'blur' }],
        mobile: [{ validator: checkMobileRule, trigger: 'blur' }]
      },
      // 分配权限对话框
      giveRoleDialogVisible: false,
      roleInfo: {},
      selectOption: []
    }
  },
  created() {
    this.getUserListData()
  },
  methods: {
    // 获取用户列表数据
    async getUserListData() {
      if (sessionStorage.getItem('pagenum')) {
        this.userListParams.pagenum = sessionStorage.getItem('pagenum') * 1
      }
      if (sessionStorage.getItem('pagesize')) {
        this.userListParams.pagesize = sessionStorage.getItem('pagesize') * 1
      }
      const { data: res } = await axios.get('users', { params: this.userListParams })
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
      this.userListData = res.data.users
      this.total = res.data.total
    },

    // 搜索用户
    searchUser() {
      this.userListParams.query = this.userInfo
      this.getUserListData()
    },
    isEmpty() {
      if (!this.userInfo.trim()) {
        this.clearSearchIpt()
      }
    },
    // 清空搜索框
    clearSearchIpt() {
      this.userListParams.query = ''
      this.getUserListData()
    },
    // 关闭添加用户弹框时重置
    closeAddDiglog() {
      this.$refs.addUserFormRef.resetFields()
    },

    // 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('预校验不通过')
        await axios.post('users', this.addUserForm)
        this.getUserListData()
        this.$message.success('用户添加成功')
      })
    },

    // 修改用户
    async editUser(id) {
      this.editDialogVisible = true
      const { data: res } = await axios.get('users/' + id)
      this.editUserForm.id = id
      this.editUserForm.username = res.data.username
      this.editUserForm.email = res.data.email
      this.editUserForm.mobile = res.data.mobile
    },
    // 关闭添加用户弹框时重置
    closeEditDiglog() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 确认修改用户
    confirmEdit() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('预校验失败')
        await axios.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
        this.getUserListData()
      })
    },

    // 删除用户
    async deleteUser(id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
        const { data: res } = await axios.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('用户删除失败')
        this.$message.success('用户删除成功')
        this.getUserListData()
      }
    },

    // 用户列表页码大小发生改变时
    handleSizeChange(newSize) {
      this.userListParams.pagesize = newSize
      sessionStorage.setItem('pagesize', newSize)
      this.getUserListData()
    },
    handleCurrentChange(newPage) {
      this.userListParams.pagenum = newPage
      sessionStorage.setItem('pagenum', newPage)
      this.getUserListData()
    },
    // 用户状态发生改变时
    // 节流（如果要用防抖就用publicFn.debounce）
    async userStateChange(id, newState) {
      await this.userStateChangeDebounce(id, newState)
    },
    userStateChangeDebounce: publicFn.debounce(async function (id, newState) {
      const { data: res } = await axios.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('状态修改失败')
      this.$message.success('状态修改成功')
    }, 1000),

    // 分配权限
    async giveRight(role) {
      this.roleInfo = role
      // 获取角色列表
      const { data: res } = await axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('角色获取失败')
      this.selectOption = res.data
    },
    async confirmGive() {
      const { data: res } = await axios.put(`users/${this.roleInfo.id}/role`, { rid: this.selectOption.id })
      if (res.meta.status !== 200) return this.$message.error('角色分配失败')
      this.getUserListData()
      this.$message.success('角色分配成功')
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  .search-btn {
    &:hover {
      background-color: #eee;
    }
  }
}
p {
  margin: 10px 0;
}
</style>
