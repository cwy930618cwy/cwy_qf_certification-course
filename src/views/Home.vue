<template>
  <ul class="home">
    <li class="menu_group">
      <div class="headers_ele">
        <span class="logo_txt">华为认证管理后台</span>
        <span class="usernames">钱老师</span>
      </div>
    </li>
    <li class="rights">
      <ul class="home_body">
        <li>
          <el-col>
            <el-menu :default-active="defaultCctive" class="el-menu-vertical-demo" :collapse="collapse" @select="menuselect" @open="handleOpen" @close="handleClose">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>认证课管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="openPages('authentication')">课程管理</el-menu-item>
                  <el-menu-item index="2-2" @click="openPages('certification')">课程认证类型管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="2" @click="openPages('orderman')">
                <i class="el-icon-menu"></i>
                <span slot="title">订单管理</span>
              </el-menu-item>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限配置</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </li>
        <li>
          <div class="main_content"><router-view></router-view></div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      defaultCctive: '1-1',
      collapse: false
    }
  },
  watch: {
    defaultCctive: function (v) {
      console.log(v)
    }
  },
  components: {},
  created() {
    this.$cookies.set('u-token', '123444')
  },
  methods: {
    // 打开页面
    openPages(name) {
      if (this.$route.name != name) {
        this.$router.push({
          name
        })
      }
    },
    menuselect(a, b, c) {
      console.log(a)
      console.log(b)
      console.log(c)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  .el-menu-vertical-demo {
    height: 100vh;
  }
  .rights {
    flex: 1;
  }
  .menu_group {
    border-right: solid 1px #e6e6e6;
  }
  .el-menu {
    border-right: none;
  }
  .main_content {
    padding: 26px;
    position: absolute;
    top: 60px;
    left: 220px;
    right: 20px;
    bottom: 16px;
  }
  .headers_ele {
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid red;
    .logo_txt {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #277fff;
      line-height: 25px;
      margin-top: 20px;
      display: inline-block;
      margin-left: 30px;
    }
    .usernames {
      float: right;
    }
  }
  .el-menu-item {
    width: 200px;
  }
}

.home_body {
  display: flex;
}
</style>
