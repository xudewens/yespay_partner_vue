<template>
  <!-- 商户列表 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-input
          v-model.trim="list.mchNo"
          placeholder="按商户编号查询"
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.mchNo = $event.target.value"
        />
      </div>
      <div class="merchant">
        <el-input
          v-model.trim="list.mchName"
          placeholder="按商户名称查询"
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.mchName = $event.target.value"
        />
      </div>
      <div>
        <el-button
          id="109"
           
          type="primary"
          style="margin-left: 5px"
          @click="search(true)"
        >查询</el-button>
        <el-button style="margin-left: 20px" @click="reset()">重置</el-button>
      </div>
    </div>
    <div class="dashTable">
      <div class="operation">
        <el-button
          type="primary"
          style="margin-left:20px"
          @click="$router.push('/merchantManage/addMerchant')"
        >新增商户</el-button>
      </div>
      <el-table
        :data="tableData"
        max-height="450"
        class="merchant_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
        @cell-click="copyText"
      >
        <!--序号 -->
        <el-table-column
          :label="'序号'"
          width="60"
          align="left"
          type="index"
        />
        <!-- 商户编号 -->
        <el-table-column
          prop="mchNo"
          :label="'商户编号'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 卡商名 -->
        <el-table-column
          prop="mchName"
          :label="'卡商名'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 收付账号数量 -->
        <!-- <el-table-column
          prop="linkedName"
          :label="'收付账号数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 出款账号数量 -->
        <!-- <el-table-column
          prop="linkedName"
          :label="'出款账号数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 中转账号数量 -->
        <!-- <el-table-column
          prop="linkedName"
          :label="'中转账号数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 登录账号数量 -->
        <!-- <el-table-column
          prop="linkedType"
          :label="'登录账号数量'"
          min-width="150"
          align="left"
          show-overflow-tooltip
        /> -->
        <!-- 状态 -->
        <el-table-column
          prop="status"
          :label="'状态'"
          min-width="80"
          align="left"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">启用</span>
            <span v-if="scope.row.status == 0" style="color: red;">禁用</span>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          :label="'创建时间'"
          min-width="160"
          align="left"
        />
         <!-- 创建人 -->
         <el-table-column
          prop="createBy"
          :label="'创建人'"
          min-width="160"
          align="left"
        />
         <!-- 最近操作时间 -->
         <el-table-column
          prop="updateTime"
          :label="'最近操作时间'"
          min-width="160"
          align="left"
        />
        <!-- 最近操作人 -->
        <el-table-column
          prop="updateBy"
          :label="'最近操作人'"
          min-width="160"
          align="left"
        />
        <!-- 操作 -->
        <el-table-column
          :label="'操作'"
          min-width="150"
          fixed="right"
          align="left"
        >
          <template slot-scope="scope">
            <el-button
              name="111"
              size="mini"
              type="primary"
              @click="detail(scope.row)"
            >
              编辑
            </el-button>
            <el-button
               name="111"
               size="mini"
               type="danger"
               @click="disabledItem(scope.row)"
               v-if="scope.row.status == 1"
             >
               禁用
             </el-button>
             <el-button
               name="111"
               size="mini"
               type="success"
               v-if="scope.row.status == 0"
               @click="opemItem(scope.row)"
             >
               启用
             </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="current"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { mchInfo_table ,mchInfo_updateMch} from '@/api/merchant'
export default {
  name: 'merchantManage',
  data() {
    return {
      current: 1,
      size: 80,
      total: 0,
      tableData: [],
      list: {
        mchNo: '', // 代理商编号
        mchName: '', // 代理商名称
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    //  日期
    dateChange(val) {
      this.list.startDate = val ? val[0] : ''
      this.list.endDate = val ? val[1] : ''
    },
    // 分页
    handleSizeChange(size) {
      this.size = size
      this.search()
    },
    handleCurrentChange(current) {
      this.current = current
      this.search(false)
    },
    //  读取全部列表
    getTableData() {
      mchInfo_table({
            size: this.size,
            current: 1
          }).then(res => {
            console.log(res.data)
            this.tableData = res.data.records
            this.total = +res.data.total
        }).catch(error => {
          console.log(error);
        });
      },
    // 查询
    search(y) {
      if (y !== false) {
        this.current = 1
      }
      mchInfo_table({
        size: this.size,
        current: this.current,
        mchNo: this.list.mchNo !== '' ? this.list.mchNo : undefined,
        mchName: this.list.mchName !== '' ? this.list.mchName : undefined,
      }).then((res) => {
        this.tableData = res.data.records
        this.total = +res.data.total
      })
    },
    // 表格-单击单元格复制内容
    copyText(row, column, cell) {
      if (column.property !== undefined) {
        const cel = cell.getElementsByClassName('cell')[0].innerText
        this.copyTable(cel)
      }
    },
    // 重置
    reset() {
      this.current = 1
      this.list.mchNo = ''
      this.list.mchName = ''
      this.getTableData()
    },
    // 详情
    detail(row) {
      if(row.id) {
        this.$router.push({
          path: '/merchantManage/addMerchantEdit',
          query: {
            id: ''+row.id,
            linkedName: row.linkedName,
            email: row.email,
            mchNo: row.mchNo,
            mchName: row.mchName,
            phone: row.phone,
            status: row.status,
            tgNotificationId: row.tgNotificationId,
          }
        })
      }else {
        this.$router.push({
          path: '/merchantManage/addMerchant',
        })
      }
    },
     //禁用
     disabledItem(item){
      this.$confirm('是否要禁用商户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await mchInfo_updateMch({
          id:item.id,
          status: '0',
        })
        if(res.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.search(true)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    //启用
    opemItem(item){
      this.$confirm('是否要启用商户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await mchInfo_updateMch({
          id:item.id,
          status: '1',
        })
        if(res.code == '021-000-S-999') {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.search(true)
        }
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
