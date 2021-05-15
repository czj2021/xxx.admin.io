<template>
  <div style="background-color: #eeeeee"><br><br>
    <el-aside>
      <div>
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8181/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
          name="picture"
          :data="{uploadType:'adminavatar',id:ruleForm.id}">
          <img v-if="ruleForm.adminavatar" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>

    </el-aside>
    <el-main>
      <div class="center">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <el-form-item label="id" prop="id">
            <el-input v-model="ruleForm.id" disabled ></el-input>
          </el-form-item>

          <el-form-item label="admin" prop="admin">
            <el-input v-model="ruleForm.admin"></el-input>
          </el-form-item>

          <el-form-item label="password" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-main>
  </div></template>
<script>
export default {
  name:"AdminPage",

  data() {
    return {

      ruleForm: {
        // id:'',
        // username:'',
        // password:'',
        // phone:'',
        // sex:'',
        // birthday:''
      },
      rules:{
        admin: [
          {required: true, message: '请输入管理员账号', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码',trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
      },
      imageUrl: './static/images/logo.png',
      // circleUrl: "./static/images/logo.png",
      admin:window.sessionStorage.getItem('admin'),
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          axios.post('http://localhost:8181/admin/updateAllById',this.ruleForm).then((resp)=>{
            // console.log(this.ruleForm.adminavatar)
            if(resp!==null){

              this.$message.success({
                message:"修改成功",
                showClose:true
              });
            }
          })
        }else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);


      // console.log(this.imageUrl)

      // axios.post('http://localhost:8181/user/updateAllById/'+this.userName).then((resp)=>{
      //
      //   console.log(resp.data)
      // })


    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },

  created() {
    this.id = this.$route.query.id
    console.log(this.$route.query.id)
    if (this.id !== null) {
      axios.post('http://localhost:8181/admin/findById/' + this.id).then((resp) => {
        // console.log(resp.data)
        //  window.sessionStorage.setItem("userId",resp.data.id);
        //  this.$store.dispatch("setUser",resp.data.id);

        // this.ruleForm.id=resp.data.id
        // this.ruleForm.username = resp.data.username
        // this.ruleForm.password=resp.data.password
        // this.ruleForm.phone = resp.data.phone
        // this.ruleForm.sex = resp.data.sex
        // this.ruleForm.birthday=resp.data.birthday
        this.ruleForm = resp.data

        this.imageUrl = resp.data.adminavatar
        // console.log(resp.data)
        // console.log(this.ruleForm)
        // this.imageUrl='./static/images/'+resp.data.head
        // console.log(this.imageUrl)
      })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
