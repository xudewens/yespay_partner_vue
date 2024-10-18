<template>
  <el-drawer
    :visible.sync="showDrawer"
    :show-close:="false"
    :with-header="false"
    :before-close="handleClose"
    custom-class="drawer-nav"
  >
    <div class="nav-container">
      <!-- header -->
      <div class="user-name">
        {{ username }}
      </div>
      <!-- navlist -->
      <div v-for="(item,index) in navList" :key="index" class="nav-item" :class="{'nav-item-active':$route.path===item.path}" @click="handleJump(item.path)">
        <i :class="item.iconName" class="navbar-icon" /><span>{{ item.text }}</span>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    // drawer: {
    //   type: Boolean,
    //   default: false
    // },
    username: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      navList:
        [
          {
            text: '首页',
            iconName: 'el-icon-s-marketing',
            path: '/homePage'

          },
          {
            text: '查单',
            iconName: 'el-icon-s-order',
            path: '/merchantManage/orderSearch'

          }
        ],
      showDrawer: false
    }
  },
  computed: {
    // showDrawer: {
    //   get() {
    //     return this.drawer
    //   },
    //   set(newValue) {
    //     this.$emit('update', newValue)
    //   }
    // }
  },
  mounted() {
    console.log('%c [  ]-65', 'font-size:13px; background:pink; color:#bf2c9f;', this.username)
  },
  methods: {
    handleClose() {
      this.showDrawer = false
    }
  }
}
</script>

<style lang="scss">
.drawer-nav{
    top: 90px !important;

}
.user-name{
    width: 100%;
    height: 60px;
    padding: 10px;
    background-color:#f4f4f4 ;
    font-size: 22px;
    color: #000;
    border-radius: 10px;
    margin-bottom: 30px;
}
.nav-container{
    padding: 20px ;
}
.navbar-icon {
    font-size: 20px;
    margin-right: 5px;
  }
.nav-item{
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  // background-color: #2e3046;
  border-bottom: 1px dashed #292727;
  padding: 6px 18px;
  text-align: center;
  margin-right: 20px;
  color: #000;
  cursor: pointer;
}
.nav-item-active{
//   background-color: #676cf6;
}
</style>
