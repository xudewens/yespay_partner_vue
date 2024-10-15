<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sideSelect">
      <!-- 切换地区 -->
      <!-- 菜单 -->
      <el-menu
        router
        :default-active="activeMenu"
        :default-openeds="[activemenu]"
        :collapse="isCollapse"
        background-color="#9470dc"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @open="handleOpen"
      >
        <el-submenu
          v-for="(i, k) in allMenu.children"
          :key="k"
          :index="i.id + ''"
        >
          <span slot="title">{{ i.permissionName }}</span>
          <el-menu-item-group
            v-for="(item, e) in i.children"
            :key="e"
            :index="item.id + ''"
          >
            <el-menu-item :index="item.url">{{ item.permissionName }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
// import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { user_getCountryUrl } from '@/api/essential'

export default {
  // components: { SidebarItem, Logo },
  components: { Logo },
  data() {
    return {
      userType: localStorage.getItem(process.env.VUE_APP_PARAM + '_USERTYPE'),
      activemenu: '',
      allMenu:JSON.parse(localStorage.getItem(process.env.VUE_APP_PARAM + '_MENU')) // 原菜单结构
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      console.log(path,'======meta.activeMenu')
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    console.log(this.routes,'========routes========')
    console.log(this.allMenu,'========allMenu========')
    console.log(this.permission_routes,'========permission_routes========')
  
    // user_getCountryUrl({}).then((res) => {
    //   for (let i = 0; i < res.data.length; i++) {
    //     if (this.area === (res.data[i].businessType.toUpperCase() === 'FINEPAY' ? 'JAYAPAY' + '_' + res.data[i].country : res.data[i].businessType.toUpperCase() + '_' + res.data[i].country)) {
    //       this.areaName = res.data[i].countryName + '_' + (res.data[i].businessType.toUpperCase() === 'FINEPAY' ? 'JayaPay' : res.data[i].businessType)
    //       this.country = res.data[i].country
    //       return
    //     }
    //   }
    // })
  },
  methods: {
    handleOpen(key, keyPath) {
      this.activemenu = key
    },
  }
}
</script>

<style lang="scss" scoped>
.userDropdown {
  width: 100%;
  height: 56px;
  color: #000;
  background: #FFF;
  cursor: pointer;
  border-right: 1px solid rgb(48, 65, 86);
}
.el-dropdown-link {
  line-height: 56px;
  margin: 0;
}
</style>

<style>
.sideSelect .el-menu-item-group__title {
  padding: 0 !important;
}
.sideSelect .el-dropdown-menu {
  width: 200px;
}
</style>
