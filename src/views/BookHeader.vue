<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">图书商城后台管理</el-menu-item>

      <template v-if="admin===null">
        <el-menu-item index="2"><a href="/AdminLogin" target="_blank">登录</a></el-menu-item>
      </template>
      <template v-else>

        <el-menu-item index="3">
          <el-link type="success" href="/AdminPage">欢迎你{{adminToken}}管理员</el-link>
          <el-link type="primary" @click="clear">退出</el-link>
        </el-menu-item>
      </template>


    </el-menu>

    <el-container style="height: 1000px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router :default-openeds="['0', '1']" >

          <el-submenu v-for="(item,index) in $router.options.routes" :index="index+''" v-if="item.show" :key="index" >
            <template slot="title" >{{item.name}}</template>
            <el-menu-item v-for="(item2,index2) in item.children" :index="item2.path"
                          :class="$route.path===item2.path?'is-active':''" :key="index" >{{item2.name}}</el-menu-item>
          </el-submenu>

        </el-menu>


      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>

  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'BookHeader',
  data() {
    const item = {

    };
    return {
      admin:window.sessionStorage.getItem('admin'),
      adminToken:window.sessionStorage.getItem('adminToken'),
      activeIndex2: '1',
      tableData: Array(20).fill(item)
    }
  },
  methods:{
    clear(){
      window.sessionStorage.clear();
      this.$router.push("/AdminLogin")
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created() {
    let promise=axios.post('http://localhost:8181/admin/findAllByUsername/'+this.adminToken).then((resp)=> {
      // console.log(resp.data)
      window.sessionStorage.setItem("adminId",resp.data.id);
      // this.$store.dispatch("setUser",resp.data.id);
      // console.log(resp.data.id)

    })
  }
};
</script>
