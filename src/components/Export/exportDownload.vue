<template>
  <div>
    <el-dropdown style="margin-left:20px;" @command="Export">
      <el-button type="primary" :disabled="disabled" :loading="exportLoad">
        导出列表
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <slot v-if="definition" name="elDropdown" />
      <el-dropdown-menu v-else slot="dropdown">
        <el-dropdown-item command="1">
          导出数据
        </el-dropdown-item>
        <el-dropdown-item command="2">
          查看下载
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="导出"
      :visible.sync="dialogFormVisible"
      class="newChannelDialog"
      width="1100px"
      :close-on-click-modal="false"
      @close="closeNewChannel"
    >
      <el-table
        :data="Form"
        max-height="450"
        class="management_table"
        border
        :header-cell-style="{ background: '#f3f3f3', color: '#4F4F4F' }"
      >
        <!-- 文件名称 -->
        <el-table-column
          prop="fileName"
          label="文件名称"
          min-width="300"
          align="left"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p v-if="scope.row.fileName">{{ scope.row.fileName }}</p>
            <p v-else>{{ fileName }}</p>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="160"
          align="left"
        />
        <!-- 过期时间 -->
        <el-table-column
          prop="expirationTime"
          label="过期时间"
          min-width="160"
          align="left"
        />
        <!-- 操作人 -->
        <el-table-column
          prop="username"
          label="操作人"
          min-width="130"
          align="left"
          show-overflow-tooltip
        />
        <!-- 操作人 -->
        <el-table-column
          prop="status"
          label="状态"
          min-width="130"
          align="left"
          show-overflow-tooltip
        />
        <!-- 操作 -->
        <el-table-column
          label="操作"
          min-width="180"
          align="left"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.status === 'ERROR'" class="NO">导出失败</p>
            <p v-if="scope.row.status === 'MAKING'" class="Warning">正在导出，完成后可下载</p>
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.status !== '导出成功'"
              :loading="scope.row.loading"
              @click="updownLoad(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNewChannel()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { query_ExportDatas, downLoad } from '@/api/publicInterface'
import Cookies from 'js-cookie'
export default {
  name: 'ExportDownload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    fileName: {
      type: String,
      required: true
    },
    definition: {
      type: Boolean,
      require: true,
      default: false
    },
    queryValue: {
      type: Object,
      required: true,
      default: () => {}
    },
    expandFun: {
      type: Function,
      required: true,
      default: () => function() {}
    },
    expandListfun: {
      type: Function,
      required: true,
      default: () => function() {}
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      newExpandUrl: '',
      newTableName: '',
      Form: [],
      downList: [],
      exportLoad: false // 导出loading
    }
  },
  watch: {
    expandUrl: {
      deep: true,
      immediate: true,
      handler: function(val) {
        this.newExpandUrl = val
      }
    },
    fileName: {
      deep: true,
      immediate: true,
      handler: function(val) {
        this.newFileName = val
      }
    }
  },
  created() {
    this.newFileName = this.fileName
  },
  methods: {
    // 判断点击的菜单
    Export(command) {
      this.$emit('menuOperation', command)
      if (command === '1' || command === '3') {
        if (this.queryValue.timeList) {
          const _flag = this.queryValue.timeList.flag // 其他关键字标志位
          const _timeList = this.queryValue.timeList.data // 时间参数
          if (_flag) {
            this.newExport()
          } else {
            let allInvalid = true
            // eslint-disable-next-line
            for (const key in _timeList) {
              if (_timeList[key] && _timeList[key].length === 2) {
                // 计算时间差值
                if (new Date(_timeList[key][1]).getTime() - new Date(_timeList[key][0]).getTime() > 1000 * 60 * 60 * 24 * 32) {
                  this.$message.error('导出时间范围最多不超过32天')
                  return
                } else {
                  allInvalid = false
                  this.newExport()
                  return
                }
              }
            }
            if (allInvalid) {
              this.$message.error('请选择时间范围')
            }
          }
        } else {
          this.newExport()
        }
      } else if (command === '2') {
        this.exportList()
      }
    },
    // 导出操作
    newExport() {
      this.$confirm('是否导出文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoad = true
        this.expandFun({
          ...this.queryValue
        }).then((res) => {
          if (res && res.code === '021-000-S-999') {
            this.exportLoad = false
            this.$message.success('正在导出文件，请稍候查看')
            this.opendialog = true
          } else {
            this.exportLoad = false
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.exportLoad = false
        })
      }).catch(() => {
        this.exportLoad = false
        this.$message.info('已取消')
      })
    },
    // 打开弹窗 - 查看导出列表
    exportList() {
      this.exportLoad = true
      this.expandListfun({}).then((res) => {
        if (res.data && res.data.length) {
          res.data.forEach(item => {
            this.$set(item, 'loading', false)
            this.downList.push(item)
          })
          this.Form = this.downList.slice(0, 5) //只保留前五条数据
        } else {
          this.Form = []
        }
        this.dialogFormVisible = true
      }).finally(() => {
        this.exportLoad = false
      })
    },
    // 下载文件
    updownLoad(item) {
      this.$message.success('正在下载...')
      item.loading = true
      const a = document.createElement('a')
      a.href = item.downloadUrl
      // a.download = item.fileName ? item.fileName : this.newFileName + '.xlsx'
      a.click()
      // window.URL.revokeObjectURL(item.downloadUrl)
      item.loading = false
    },
    // 关闭弹窗
    closeNewChannel() {
      this.dialogFormVisible = false
      this.Form = []
      this.downList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.management_table {
  margin-top: 0;
}
</style>

<style>
.el-popover {
  min-width: 65px;
  color: #969699;
}
</style>
