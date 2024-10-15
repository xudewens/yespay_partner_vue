<template>
  <!-- 员工管理 -->
  <div class="dashbody">
    <div class="move moveList">
      <div class="merchant">
        <el-input
          v-model="list.username"
          placeholder="登录账号"
          class="merchant_input"
          onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g, '')"
          @blur="list.username = $event.target.value"
        />
      </div>
      <!-- 全部角色 -->
      <div class="merchant">
        <el-select
          v-model="list.roleIds"
          clearable
          multiple
          collapse-tags
          placeholder="全部角色"
          class="merchant_input"
        >
          <el-option
            v-for="item in allRoles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.bindGoogle"
          placeholder="谷歌验证器"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in googleBindeds"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="merchant">
        <el-select
          v-model="list.status"
          placeholder="状态"
          clearable
          class="merchant_input"
        >
          <el-option
            v-for="item in lockStatuss"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-button
          v-preventReClick
          type="primary"
          style="margin-left:5px"
          @click="search(true)"
        >查询 </el-button>
        <el-button v-preventReClick style="margin-left:20px" @click="Reset()">重置</el-button>
      </div>
    </div>
    <div class="dashTable">
      <div class="operation">
        <el-button
          type="primary"
          style="margin-left:20px"
          @click="addgsForm()"
        >新增员工</el-button>
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
        <!-- 员工昵称 -->
        <el-table-column
          prop="nickname"
          label="员工昵称"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <!-- 联系方式 -->
        <el-table-column
          prop="username"
          label="登录账号"
          min-width="160"
          align="left"
        />
        <!-- 角色名称 -->
        <el-table-column
          label="关联角色"
          min-width="300"
          align="left"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <span>
            {{scope.row.roleList ? scope.row.roleList.map(item => item.roleName).join(',') : '' }}
          </span>
        </template>
      </el-table-column>
        <!-- 谷歌验证器 -->
        <el-table-column
          min-width="130"
          label="谷歌验证器"
          align="left"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.bindGoogle == 0">未绑定</p><!-- 未绑定 -->
            <p v-if="scope.row.bindGoogle == 1">已绑定</p><!-- 已绑定 -->
            <!-- <el-button
              v-if="scope.row.bindGoogle == 1"
              type="text"
              style="margin-left:10px;padding-top: 6px;padding-bottom: 6px;"
              @click="untie(scope.row)"
            >解绑</el-button> -->
          </template>
        </el-table-column>
        <!-- 员工状态 -->
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
            <span v-if="!scope.row.status">启用</span>
            <span style="color: red;" v-if="scope.row.status">禁用</span>
          </template>
        </el-table-column>
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
              @click="detail(scope.row)"
              v-if="userIdList.includes('100600010003')"
            > 编辑</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="delStaff(scope.row)"
            > 删除</el-button> -->
            <el-button
              size="mini"
              type="warning"
              @click="rowPassword(scope.row)"
            > 修改登录密码</el-button>
            <!-- <el-button
              size="mini"
              type="warning"
              @click="detail(scope.row)"
            > 修改交易密码</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 80]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 修改密码弹窗 -->
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <!-- 登陆密码： -->
       <div class="move" style="align-items: flex-end;">
        <div class="station">
            <p><i style="color:red">*</i>登陆密码：</p>
            <el-input
              v-model.trim="newpassword"
              autocomplete="off"
              placeholder="登陆密码"
              :maxlength="20"
              :type="inputType"
              class="management_input"
              @input.native="newpassword=newpassword.replace(/[^a-zA-Z0-9`~·!@#$%^&*_+-=\\|;:?]/g, '')"
            >
            <i slot="suffix" class="el-icon-view" style="cursor:pointer;line-height: 40px;" @click="isPassword = !isPassword" />
          </el-input>
         
          </div>
          <el-button type="text" style="margin-left: 8px;" @click="autoGeneral()">自动生成</el-button>
       </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { user_page,role_page,updateUser } from '@/api/user'
import MD5 from 'crypto-js/md5'
export default {
  name: 'Employees',
  data() {
    return {
      dialogFormVisible: false, // 新增/编辑员工的弹窗
      isPassword: true, // 密码是否密文显示
      userIdList:JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENUIDLIST')),
      labelPosition: 'top', // 弹窗内对齐
      edit: true, // 新增&编辑标志位
      title: '', // 新增/编辑员工弹窗的标题
      currentPage: 1,
      newpassword:'',
      allRoles:[],
      passWordInfo:{},
      size: 20,
      total: 0,
      tableData: [],
      createTime: [], // 添加日期
      list: {
        roleIds:[],
        username: '', // 员工昵称
        status: '', // 员工状态
        bindGoogle: '', // 谷歌验证器
      },
      isPassword: true, // 密码是否密文显示
      googleBindeds: [ // 谷歌验证器
        {
          label: '已绑定',
          value: 1
        },
        {
          label: '未绑定',
          value: 0
        }
      ],
      lockStatuss: [ // 账号锁定状态
        {
          label:'启用',
          value: '0'
        },
        {
          label: '禁用',
          value: '1'
        },
      ],
      statuss: [ // 员工状态
        {
          value: '0',
          label:''
        },
        {
          value: '1',
          label: ''
        }
      ],
      countrys: [], // 国家
      props: [], // 角色名称
    }
  },
  computed: {
  // 切换密码明文密文
    inputType() {
      return this.isPassword ? 'password' : 'text'
    }
  },
  mounted() {
    this.getTableData()
    this.getRolePage()
  },
  methods: {
    // 修改密码
   async changePassword(){
    if(this.newpassword.length < 6) {
      return this.$message.warning('密码长度为6-20位')
    }
      const res = await updateUser({
          id:this.passWordInfo.id,
          // nickname:this.passWordInfo.nickname,
          // remark:this.passWordInfo.remark,
          // status:this.passWordInfo.status,
          password:MD5(this.newpassword).toString().toUpperCase()
        })
      if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.dialogFormVisible = false
        this.newpassword = ''
      }
    },
    rowPassword(row){
      this.dialogFormVisible = true
      this.passWordInfo = row
    },

    // 添加时间
    dateChange(val) {
      this.list.startDate = val ? val[0] : '' 
      this.list.endDate = val ? val[1] : ''
    },
    // 分页
    handleSizeChange(size) {
      this.size = size
      this.search()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.search(false)
    },
    getRolePage() {
      role_page({
        size: 9999,
        current: 1,
      }).then((res) => {
        this.allRoles = res.data.records
      })
    },
    // 读取全部列表
    getTableData() {
      user_page({
        size: this.size,
        current: 1,
      }).then((res) => {
        this.tableData = res.data.records
        this.total = +res.data.total
      })
    },
    // 密码生成
    autoGeneral() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~·!@#$%^&*_+-=;:?';
        const passwordLength = Math.floor(Math.random() * 15) + 6; // 生成 6 到 20 之间的随机长度
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            password += randomChar;
        }
          this.newpassword = password
    },
    // 查询
    search(y) {
      if (y !== false) {
        this.currentPage = 1
      }
      let status = ''
      if(this.list.status === '1') {
        status = true
      }else if (this.list.status === '0') {
        status = false
      }else {
        status = undefined
      }
      user_page({
        size: this.size,
        current: this.currentPage,
        roleIds: this.list.roleIds.length > 0 ? this.list.roleIds : undefined,
        username: this.list.username ? this.list.username : undefined,
        status: status,
        bindGoogle: this.list.bindGoogle !== '' ? this.list.bindGoogle : undefined,
      }).then((res) => {
        this.tableData = res.data.records
        this.total = +res.data.total
      })
    },
    // 表格-单击单元格复制内容
    copyText(row, column, cell) {
      if (column.property !== undefined && column.width === undefined) {
        const cel = cell.getElementsByClassName('cell')[0].innerText
        this.copyTable(cel)
      }
    },
    // 重置
    Reset() {
      this.currentPage = 1
      this.list.roleIds = []
      this.list.username = ''
      this.list.status = ''
      this.list.bindGoogle = ''
      this.getTableData()
    },
    addgsForm(){
      this.$router.push({
        path:'/setting/addStaff',
      })
    },
    detail(row) {
      console.log(row.status,'===row.status===')
      const roleList = []
      if(row.roleList) {
        row.roleList.forEach(element => {
          roleList.push(element.id)
        });
      }
      this.$router.push({
        path:'/setting/addStaffEdit',
        query:{
          id:row.id,
          bindGoogle:row.bindGoogle,
          status:row.status,
          nickname:row.nickname,
          username:row.username,
          roleList:roleList.length > 0 ? roleList : [],
          remark:row.remark,
        }
      })
    },
    // 删除
    delStaff(){
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

<style scoped lang="scss">
.el-table td {
  padding: 4px 0;
}
.el-table .cell p {
  margin: 0;
}

.dialog-footer {
  position: relative !important;
  bottom: auto;
  justify-content: flex-end;
}
</style>
