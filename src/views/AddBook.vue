<template>
  <div style="background-color: #eeeeee">
    <br><br>
    <el-form style="width: 40%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="图书名称" prop="bookname">
        <el-input v-model="ruleForm.bookname"></el-input>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="ruleForm.author"></el-input>
      </el-form-item>

      <el-form-item label="页数" prop="pages">
        <el-input v-model="ruleForm.pages"></el-input>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>

      <el-form-item label="出版社" prop="publish">
        <el-input v-model="ruleForm.publish"></el-input>
      </el-form-item>

      <el-form-item label="库存量" prop="nums">
        <el-input v-model="ruleForm.nums"></el-input>
      </el-form-item>

      <el-form-item label="类别" prop="titlekey">
        <el-input v-model="ruleForm.titlekey"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddBook',
  data() {
    return {
      ruleForm: {
        bookname: '',
        author: '',
        pages:'',
        price:'',
        publish:'',
        nums:'',
        titlekey:'',
      },
      rules: {
        bookname: [
          { required: true, message: '图书名称不能为空', trigger: 'blur' }
        ],
        author:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        price:[
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        nums:[
          { required: true, message: '库存量不能为空', trigger: 'blur' }
        ],
        titlekey:[
          { required: true, message: '类别不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://localhost:8181/booksrc/saveAll',this.ruleForm).then(function(resp){
            // if(resp.data === 'success'){
            //   _this.$alert('《'+_this.ruleForm.bookname+'》添加成功！', '消息', {
            //     confirmButtonText: '确定',
            //     callback: action => {
            //       _this.$router.push('/BookManage')
            //     }
            //   })
            // }
            _this.$message({
              message: '添加成功',
              type: 'success'
            });
            _this.$router.push('/BookManage')
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

