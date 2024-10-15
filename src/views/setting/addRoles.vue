<template>
  <div class="main">
    <!-- 新增卡商 -->
    <p id="BasicInformation" class="title">{{id ? '编辑' : '新增'}}角色</p>
    <div class="move">
      <!-- 角色名称： -->
      <div class="station">
        <p><i style="color:red">*</i>角色名称：</p>
        <el-input
          v-model.trim="roleName"
          autocomplete="off"
          :placeholder="'角色名称'"
          class="management_input"
          :maxlength="20"
        />
      </div>
      <!-- 状态： -->
      <div class="station" style="position:relative" v-if="id">
        <p><i style="color:red">*</i>状态：</p>
        <el-radio-group v-model="status" @change="changeStatus">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!-- 角色描述： -->
    <div style="width: 100%;padding:0 60px;">
        <p style="font-size: 12px;">角色描述：</p>
        <el-input
          v-model.trim="remark"
          autocomplete="off"
          :maxlength="50"
          type="textarea"
          :rows="2" 
          placeholder="角色描述"
        />
    </div>
    <!-- 权限配置 -->
    <div style="width: 100%;padding:0 60px; height: 520px; overflow-y: auto;">
        <p style="font-size: 12px;"><i style="color:red">*</i>权限配置：</p>
        <el-tree
          ref="tree"
          node-key="id"
          :data="treeDataOne.children"
          :props="props"
          show-checkbox
          :default-expanded-keys="ExpandedKeys"
          :default-checked-keys="CheckedKeys"
        />
    </div>
    <div class="head" style="background-color: #fff;">
      <el-button
        style="margin-right: 60px;"
        @click="back()"
      >取消</el-button>
      <el-button type="primary" @click="save()">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { addRole , updateRole ,get_roleInfo} from '@/api/user'
import { flattenTree } from '@/filters'
export default {
  name: 'addMerchant',
  data() {
    return {
      id:'',
      roleName:'',
      remark:'',
      treeDataOne: JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENU')), // 一级菜单总数据
      ExpandedKeys: [], // 默认展开的节点的 key 的数组
      CheckedKeys: [], // 默认勾选的节点的 key 的数组
      CheckedNodes: [],
      status:'1',
      CheckedNodess: [],
      props: {
        label: 'permissionName',
        children: 'children',
        isLeaf: true
      },
    }
  },
  computed: {

  },
  watch: {
   
  },
  activated() {
  
  },
  created () {
    if(this.$route.query.id) { //有id表示编辑
      this.id = this.$route.query.id
      this.getRoleInfo()
    }
    this.CheckedKeys = []
    console.log(this.treeDataOne,'====this.treeDataOne==')
    // if(this.treeDataOne.children){
    //     this.treeDataOne.children.forEach(item => {
    //     this.CheckedKeys.push(item.id)
    //     if(item.children.length > 0) {
    //       item.children.forEach(v => {
    //         this.CheckedKeys.push(v.id)
    //       })
    //     }
    //   })
    // }

  },
  methods: {
    // 保存
    save(){
      const permissionIds = this.$refs.tree.getCheckedNodes(false,true)
      const checkIDs = []
      permissionIds.forEach(item => {
        checkIDs.push(item.id)
      })
      if(!this.roleName) {
        return this.$message.warning('请填写正确的角色名称')
      }
      if(checkIDs.length == 0 || !permissionIds){
        return this.$message.warning('至少选择一个菜单')
      }
      let res = ''
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if(this.id) {
          // 有id,是编辑走更新
          res = await updateRole({
            id:this.id,
            permissionIds:checkIDs,
            remark:this.remark,
            roleName:this.roleName,
            status:this.status == '1' ? true : false
          })
        }else {
          // 无id,是新增走添加
          res = await addRole({
            permissionIds:checkIDs,
            remark:this.remark,
            roleName:this.roleName,
            status:this.status == '1' ? true : false
          })
        }
      if(res.code == '021-000-S-999') {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.$router.push({
          path:'/systemManage/roleManage'
        })
      }
      }).catch((error) => {
        console.log(error)
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    // 取消返回
    back(){
      this.$confirm('是否要取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
  async getRoleInfo () {
      const res = await get_roleInfo(this.id)
      // this.treeDataOne = res.data.permissionTree || JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENU'))
      this.remark = res.data.remark
      this.roleName = res.data.roleName
      this.status = res.data.status ? '1' : '0'
      this.CheckedKeys = flattenTree(res.data.permissionTree)
      this.processCheckedKeys()
    },
    processCheckedKeys() {
      this.treeDataOne.children.forEach(parentNode => {
        this.checkAndRemove(parentNode);
      });
    },
    checkAndRemove(node) {
      if (node.children && node.children.length > 0) {
        const hasUncheckedChild = node.children.some(child => {
          if (child.children && child.children.length > 0) {
            return child.children.some(grandChild => !this.CheckedKeys.includes(grandChild.id));
          }
          return !this.CheckedKeys.includes(child.id);
        });

        if (hasUncheckedChild && this.CheckedKeys.includes(node.id)) {
          const index = this.CheckedKeys.findIndex(id => id === node.id);
          if (index !== -1) {
            this.CheckedKeys.splice(index, 1);
          }
        }

        node.children.forEach(child => {
          this.checkAndRemove(child);
        });
      }
    },
    //  切换状态
    changeStatus(val){
      console.log(val)
      val == '1' ? this.status = '0' : this.status = '1'
      if(val == '0'){
        this.$confirm('是否确认禁用角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.status = '0'
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
        }else {
          this.status = '1'
        }
    },
  }
}
</script>

<style scoped lang='scss'>
.main {
  background: #FFFFFF;
  padding: 20px;
}
::v-deep .el-transfer-panel {
  width: 35%!important;
  // height: 400px;
}

.head {
  position: fixed;
  width: 100%;
  padding: 20px;
  bottom: 0;
  margin-top: 30px;
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
  width: 350px;
}
.station>p {
  text-align: right;
  width: 200px !important;
  font-size: 12px;
  margin: 0;
}
.management_input {
  width: 300px !important;
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
</style>

<style>
.passwordInput .el-input__suffix {
  top: 12px !important;
}
</style>
