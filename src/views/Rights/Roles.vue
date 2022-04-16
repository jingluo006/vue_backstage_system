<template>
  <div class="rolesContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区域 -->
    <el-card class="box-card">
      <!-- 顶部添加角色 -->
      <el-row :gutter="20" class="addRights">
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="roleList" border style="width: 100%" stripe>
        <!-- 展开权限部分 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="20" v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="['rights-center', 'bdbottom', index1 == 0 ? 'bdtop' : '']" style="margin-left: 50px; margin-right: 30px">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag> {{ item1.authName }}<i class="el-icon-caret-right"></i> </el-tag>
              </el-col>
              <!-- 二、三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row :gutter="20" v-for="(item2, index2) in item1.children" :key="item2.id" :class="['rights-center', 'bdtop', index2 == 0 ? 'clsbdtop' : '']">
                  <el-col :span="8">
                    <el-tag type="success"> {{ item2.authName }}<i class="el-icon-caret-right"></i> </el-tag>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="deleteRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="
                editRole(scope.row.id)
                editDialogVisible = true
              "
            ></el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
            <!-- 分配权限 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="
                giveRight(scope.row)
                giveDialogVisible = true
              "
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="cancelAddRole">
      <!-- 添加角色对话框表单区域 -->
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        label-width="100px"
        @keydown.enter.native="
          addDialogVisible = false
          addRole()
        "
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加角色对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addDialogVisible = false
            addRole()
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%">
      <!-- 添加角色对话框表单区域 -->
      <el-form
        :model="editRoleForm"
        ref="addRoleFormRef"
        label-width="100px"
        @keydown.enter.native="
          editDialogVisible = false
          confirmEditRole()
        "
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加角色对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            editDialogVisible = false
            confirmEditRole()
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="giveDialogVisible" width="40%">
      <!-- 树形区域 -->
      <el-tree :data="treeRightList" :props="defaultProps" ref="treeRightsRef" show-checkbox node-key="id" :default-checked-keys="defaultCheckedKeys"></el-tree>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="giveDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            giveDialogVisible = false
            confirmGiveRights()
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
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      // 角色ID
      roleId: null,
      // 添加角色表单
      addDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色
      editDialogVisible: false,
      editRoleForm: {},

      // 权限列表
      treeRightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 分配权限
      giveDialogVisible: false,
      defaultCheckedKeys: []
    }
  },
  created() {
    this.getRoleList()
    this.getRightsList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
      this.roleList = res.data
    },
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.treeRightList = res.data
    },
    // 添加角色
    async addRole() {
      const { data: res } = await axios.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) return this.$message.error('角色添加失败')
      this.getRoleList()
      this.$message.success('用户添加成功')
    },
    cancelAddRole() {
      console.log(this.$refs.addRoleFormRef)
      this.$refs.addRoleFormRef.resetFields()
    },

    // 修改角色
    async editRole(id) {
      this.roleId = id
      const { data: res } = await axios.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('角色获取失败')
      this.editRoleForm = res.data
    },
    async confirmEditRole() {
      const { data: res } = await axios.put('roles/' + this.roleId, this.editRoleForm)
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.getRoleList()
      this.$message.success('角色修改成功')
    },

    // 删除角色
    async deleteRole(id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        const { data: res } = await axios.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('用户删除失败')
        this.getRoleList()
        this.$message.success('角色删除成功')
      }
    },

    // 删除某个权限
    async deleteRight(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
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
        const { data: res } = await axios.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('权限删除失败')
        // 重新给该角色赋值新的权限，不要给整个this.roleList赋值
        role.children = res.data
        this.$message.success('权限删除成功')
      }
    },

    // 分配权限
    async giveRight(role) {
      this.roleId = role.id
      // 这里一定要重新获取权限列表，不然就会保持上一个点击产生的权限列表
      const { data: res } = await axios.get('rights/tree')
      if (res.meta.status !== 200) this.$message.error('权限列表获取失败')
      this.treeRightList = res.data
      // 递归前先清空defaultCheckedKeys
      this.defaultCheckedKeys = []
      // 递归遍历，直到第三级，再将ID 存到defaultCheckedId
      this.getDefKeys(role, this.defaultCheckedKeys)
    },

    // 递归查找默认权限
    getDefKeys(node, defKeys) {
      if (!node.children) {
        return defKeys.push(node.id)
      }
      node.children.forEach((item) => {
        this.getDefKeys(item, defKeys)
      })
    },
    // 确认分配这些权限
    async confirmGiveRights() {
      // 叶子节点的keys和半选中节点的keys
      const rights = [...this.$refs.treeRightsRef.getCheckedKeys(), ...this.$refs.treeRightsRef.getHalfCheckedKeys()]
      const rightsStr = rights.join(',')
      const { data: res } = await axios.post(`roles/${this.roleId}/rights`, { rids: rightsStr })
      if (res.meta.status !== 200) return this.$message.error('权限更新失败')
      this.getRoleList()
      this.$message.success('权限更改成功')
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  .addRights {
    display: flex;
    justify-content: flex-end;
  }
}
/deep/.rights-center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.clsbdtop {
  border-top: none;
}
</style>
