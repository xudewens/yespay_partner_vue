<template>
  <!-- 员工管理 -->
  <div class="dashbody">
    <div class="dashTable">
      <div class="operation">
        <el-button
          type="primary"
          style="margin-left:20px"
          @click="addRoles()"
        >新增角色</el-button>
      </div>
      <el-table
        :data="tableData"
        max-height="450"
        class="management_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
      >
        <!-- 员工ID -->
        <el-table-column
          label="序号"
          min-width="90"
          align="left"
          type="index"
        />
        <!-- 角色名称 -->
        <el-table-column
          prop="roleName"
          label="角色名称"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 关联员工 -->
        <el-table-column
          prop="userNames"
          label="关联员工"
          min-width="300"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
            <span>{{ scope.row.userNames ? scope.row.userNames.join(',') : '' }}</span>
        </template>
      </el-table-column>
        <el-table-column
          label="状态"
          min-width="90"
          align="left"
        >
          <template slot-scope="scope">
            <!-- <el-switch
              v-model="scope.row.status"
              @change="change(scope.row)"
            /> -->
            <span v-if="scope.row.status">启用</span>
            <span style="color: red;" v-if="!scope.row.status">禁用</span>
          </template>
        </el-table-column>
        <!-- 角色说明 -->
        <el-table-column
          prop="remark"
          label="角色说明"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="left"
          min-width="300"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="relatedEmployees(scope.row)"
            > 关联员工</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addRolesEdit(scope.row)"
            > 编辑角色</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="delRoles(scope.row)"
            > 删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { role_page } from '@/api/user'
export default {
  name: 'Employees',
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.search()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.search(false)
    },
    // 读取全部列表
    getTableData() {
      role_page({
        size: this.pageSize,
        current: 1,
      }).then((res) => {
        this.tableData = res.data.records
        this.total = +res.data.total
      })
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.current = 1
      }
      role_page({
          size: this.size,
          current: this.currentPage,
      })
      .then((res) => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(error => {
        console.log(error);
      });
    },
    // 表格-单击单元格复制内容
    copyText(row, column, cell) {
      if (column.property !== undefined && column.width === undefined) {
        const cel = cell.getElementsByClassName('cell')[0].innerText
        this.copyTable(cel)
      }
    },
    // 跳转新增/编辑页面
    addRoles(){
      this.$router.push({
        path:'/setting/addRoles'
      })
    },
    addRolesEdit(row){
      this.$router.push({
        path:'/setting/addRolesEdit',
        query:{
          id:row.id
        }
      })
    },
    // 跳转关联员工
    relatedEmployees(row){
      this.$router.push({
        path:'/setting/relatedEmployees',
        query:{
          id:row.id,
          roleName:row.roleName,
          remark:row.remark
        }
      })
    },
    // 删除
    delRoles(){
      this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });          
          });
    },
  }
}
</script>

<style>
.el-table td {
  padding: 4px 0;
}
.el-table .cell p {
  margin: 0;
}
</style>
