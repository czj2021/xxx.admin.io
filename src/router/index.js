import Vue from 'vue'
import VueRouter from 'vue-router'
import BookManage from '../views/BookManage'
import AddBook from '../views/AddBook'
import BookHeader from '../views/BookHeader'
import BookUpdate from '../views/BookUpdate'
import UserList from "../views/UserList";
import ClassifyList from "../views/ClassifyList";
import AdminList from "../views/AdminList";
import AdminLogin from "../views/AdminLogin";
import AdminPage from "../views/AdminPage";
import LogoImg from "../views/LogoImg";
import HomeImg from "../views/HomeImg";
import Order from "../views/Order";


Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"分类书架管理",
    component:BookHeader,
    show:true,
    redirect:"/AdminLogin",
    children:[
      {
        path:"/BookManage",
        name:"查询图书",
        component:BookManage,

      },
      {
        path:"/AddBook",
        name:"添加图书",
        component:AddBook,

      },
      {
        path:'/BookUpdate',
        name:"修改图书",
        component:BookUpdate,

      },
      {
        path:'/ClassifyList',
        name:"图书分类管理",
        component:ClassifyList,

      }
    ],
    meta:{
      isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
    }//路由元

  },
  {
    path:"/",
    name:"会员用户管理",
    component:BookHeader,
    show:true,
    children:[
      {
        path:'/UserList',
        name:"会员用户列表",
        component:UserList,

      }
    ],
    meta:{
      isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
    }//路由元
  },
  {
    path:"/",
    name:"管理员管理",
    component:BookHeader,
    show:true,
    children:[
      {
        path:'/AdminList',
        name:"管理员列表",
        component:AdminList,
      },
      // {
      //   path:'/AdminPage',
      //   name:"修改管理员信息",
      //   component:AdminPage,
      // }
    ],
    meta:{
      isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
    }//路由元
  },
  {
    path:"/AdminLogin",
    name:"管理员登录",
    component:AdminLogin,
    // show:false,
  },
  {
    path:"/",
    name:"首页展示管理",
    component:BookHeader,
    show:true,
    children:[
      {
        path:'/LogoImg',
        name:"首页轮播图管理",
        component:LogoImg,
      },
      {
        path:'/HomeImg',
        name:"首页书架管理",
        component:HomeImg,
      }
    ],
    meta:{
      isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
    }//路由元
  },
  {
    path:"/",
    name:"订单管理",
    component:BookHeader,
    show:true,
    children:[
      {
        path:'/Order',
        name:"订单列表",
        component:Order,
      }
    ],
    meta:{
      isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
    }//路由元
  },





]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to,from,next)=>{
  if(to.matched.some(res=>res.meta.isLogin)){//判断是否需要登录
    if (window.sessionStorage.getItem('admin')) {
      next();
    }else{
      next({
        path:"/AdminLogin",
        query:{
          redirect:to.fullPath
        }
      });
    }

  }else{
    next()
  }
});

export default router
