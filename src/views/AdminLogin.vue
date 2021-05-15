<template>
  <div >
    <el-container>
      <el-header height="20%" class="center" style="display: flex;justify-content: center;flex-wrap: wrap;width: 100%">
        <div><a href="/BookManage"><img  :src="imageUrl" width="160px" ></a> </div>
        <el-divider content-position="center" >管理员登录</el-divider>
      </el-header>

      <el-main  >

        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm">
          <div class="center">
            <el-form-item label="管理员名" prop="admin">
              <el-input type="text" maxlength="12" v-model="ruleForm.admin" placeholder="管理员名" ></el-input>

            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
            </el-form-item>

            <el-form-item prop="status">
              <JcRange v-model="ruleForm.status" :success-fun="scs"></JcRange>
            </el-form-item>

            <el-form-item>
              <!--            <div class="right"><a href="Register">没有账号？立即注册>></a></div><br>-->
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>

          </div>
        </el-form>

      </el-main>
    </el-container>

    <el-divider content-position="right"></el-divider>
    <el-header  class="center"><el-link disabled class="center">联系邮箱:944453040@qq.com</el-link></el-header>
  </div>
</template>
<script>
import JcRange from '../components/JcRange'
import ys from './ys.css'
// import imageUrl from '../static/logo.png'
export default {
  name: 'AdminLogin',

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    const validateStatus = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请拖动滑块完成验证"));
      } else {
        callback();
      }
    };
    return {
      user:{},
      ys,
      imageUrl:'./static/logo.png',
      ruleForm: {
        admin: '',
        password: '',
        status: false
      },
      rules: {
        admin: [
          {required: true, message: '请输入管理员名', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        status: [{ validator: validateStatus, trigger: 'change' }]
      }
    };
  },

  methods: {
    scs(){
      this.ruleForm.status=true;
    },
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交逻辑
          axios.post('http://localhost:8181/admin/findPassword/',this.ruleForm).then((resp)=>{
            console.log(resp.data)
            if(resp.data===true&&resp.data!==null){
              this.$message.success({
                message:"登录成功",
                showClose:true
              });
              window.sessionStorage.setItem("admin",this.ruleForm.admin);
              window.sessionStorage.setItem("adminToken",this.ruleForm.admin);
              // this.$store.dispatch("setUser",this.ruleForm.username);
              // this.$store.dispatch("setToken",this.ruleForm.token);

              // console.log(this.$store.state.isLogin)
              this.$router.push({path:'/BookManage'})


            }else {
              this.$message.error('管理员账号或密码错误');
            }
          })
        } else {
          console.log('error submit!!');
          // console.log(this.ruleForm.status)
          // return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  components: {
    JcRange
  }
}
</script>

<style scoped>

</style>
