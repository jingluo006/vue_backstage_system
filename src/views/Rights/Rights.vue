<template>
  <div class="rightsContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取用户权限列表
    async getRightsList() {
      const { data: res } = await axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
