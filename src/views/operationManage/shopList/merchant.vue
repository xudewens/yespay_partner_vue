<template>
  <!-- 基础信息 -->
  <div>
    <div class="main">
      <!-- 基础信息 -->
      <p class="title" style="padding-bottom: 20px;">商户信息</p>
      <div class="Merchant">
        <div class="left">
          <div class="title">已选商户</div>
          <div class="content">
            <div v-for="item in selectedItems" :key="item.id" style="padding: 5px;display: flex;justify-content: space-between;">
              <span>{{ item.label }}</span>
              <i class="el-icon-delete" @click="delMerchant(item)"></i>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">可选商户</div>
          <div class="content">
            <el-checkbox-group v-model="available" @change="changeMerchant">
              <el-checkbox v-for="item in availableItems" :key="item.id" :label="item.label"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="head">
      <el-button style="margin-right: 30px;" @click="reback()">取消</el-button>
      <el-button  type="primary" @click="nextClick()">完成</el-button>
    </div>
  </div>
</template>

<script>
import { mchInfo_table } from '@/api/merchant'
import { listByChannelId } from '@/api/channel'
export default {
  name: 'merchant',
  props: {
    mchData: { // 编辑回显的数据
      type: Object,
      default: () => {}
    },
    channelId:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      channelID:'',
      dataInfo:{
        status:'1',
        expands:{

        }
      },
      availableItems: [

      ],
      available:[],
      selectedItems: []
    }
  },
  computed: {

  },
  mounted() {
    this.getMchInfo()
  },
  watch: {
    mchData: {
      deep: true,
      immediate: true,
      handler(val, oldval) {
        if (val !== oldval && val.length && this.type === 'edit') {
          this.getTableData(val)
        }
      }
    }
  },
  // activated() {
  //   if (this.type !== 'edit' && this.name === '') {
  //     this.chooseCountry(JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_COUNTRY')))
  //   }
  // },
  created () {
    this.channelID = this.$route.query.id
  },
  methods: {
    //  读取全部列表
    getMchInfo() {
      mchInfo_table({
            size: 9999,
            current: 1
          }).then(res => {
            console.log(res.data)
            res.data.records.forEach(item => {
              this.availableItems.push({
                label:item.mchName,
                value:item.id,
                checked:false
              })
            })  
            if(this.channelID) {
              this.listByChannelId()
            }
        }).catch(error => {
          console.log(error);
        });
      },
   async listByChannelId(){
      const res = await listByChannelId(this.channelID)
      console.log(res,'====channelID===')
      this.available = []
      res.data.forEach(item => {
        if(item.mchChannelState) {
          this.available.push(item.mchName)
        }
      })
      this.selectedItems = []
      this.availableItems.forEach(item => {
        if(this.available.includes(item.label)) {
          this.selectedItems.push(item)
        }
      });
    },
    // 切换商户
    changeMerchant(){
      this.selectedItems = []
      this.availableItems.forEach(item => {
        if(this.available.includes(item.label)) {
          this.selectedItems.push(item)
        }
      });
    },
    // 删除已选商户
    delMerchant(value){
      console.log(value)
      this.selectedItems = this.selectedItems.filter(item => value.label !== item.label);
      this.available = this.available.filter(item => value.label !== item);
    },
    // 下一步
    nextClick() {
      if(this.selectedItems.length < 1) {
        this.$message.warning('请选择商户')
      }
      this.$confirm('是否要保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const list = []
          this.selectedItems.forEach(item => {
            list.push({
              state:true,
              mchId:item.value
            })
          })
          this.$emit('nextClick', list)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      },
    // 取消操作
    reback(){
      this.$confirm('是否取消所有保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$router.go(-1)
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      },
    // },
  }
}
</script>

<style scoped lang='scss'>
.main {
}
.head {
  margin-top: 20px;
  text-align: center;
}
.title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}
.move {
  margin-bottom: 30px;
}
.station {
  display: flex;
  align-items: center;
  margin: 25px 30px 0 0;
  width:  350px;
}
.station > p {
  text-align: right;
  width: 200px !important;
  font-size: 12px;
  margin: 0;
}
.management_input {
  width: 300px !important;
}
.moves {
  margin-bottom: 30px;
}
.Merchant {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
      font-size: 14px;
      font-weight: bold;
      border: 1px solid #d7d7d7;
      padding: 10px;
    }
    .content {
      padding: 20px;
    }
  .left {
    width: 40%;
    min-height: 300px;
    border: 1px solid #d7d7d7;
  }
  .right {
    width: 60%;
    min-height: 300px;
    border: 1px solid #d7d7d7;
  }
}
.stations {
  display: flex;
  align-items: center;
  margin: 25px 0 0 0;
}
.stations > p {
  text-align: right;
  width: 160px !important;
  font-size: 12px;
  margin: 0;
}
.title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
}
.titles {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  display: inline-block;
}
.update_but {
  font-size: 12px;
  margin-left: 20px;
}
/* 滚动条整体部分 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f6fa;
}
/* 滚动条的轨道 */
::-webkit-scrollbar-track {
  width: 8px;
  height: 8px;
}
/* 滚动条的滑块按钮 */
::-webkit-scrollbar-thumb {
  width: 6px;
  height: 6px;
  border-radius: 4px;
  background-color: #b6bece;
}
/* 表格头部的白块设置成与表头一样的颜色 */
.el-table__fixed-right-patch {
  background-color: #E9EBF0 !important;
}
/* 当没有滚动条时 */
.el-table__fixed-right {
  right: -1px !important;
}
/* 当有滚动条的时候 默认偏移距离 */
.el-table--scrollbar-y .el-table__fixed-right {
  right: 6px !important;
}
</style>

<style>
.passwordInput .el-input__suffix {
  top: 12px !important;
}
</style>
