<template>

  <div style="background-color: #eeeeee"><br><br>
    <el-aside width="10%"></el-aside>
    <el-main>
      <el-table  border style="width: 100%;"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                 :default-sort = "{prop: 'tableData', order: 'descending'}"
                 :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
        <el-table-column fixed prop="id" label="图书编号" width="120px" sortable>
        </el-table-column>
        <el-table-column fixed prop="bookname" label="图书名" width="150">
        </el-table-column>

        <el-table-column fixed prop="src" label="图片" width="150">
          <template slot-scope="scope">
            <!--          <el-avatar :size="50" :src="scope.row.src" class="el-avatar" shape="square"></el-avatar>-->
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8181/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept="image/*"
              name="picture"
              :data="{uploadType:'imgsrc',id:scope.row.id}">
              <img v-if="scope.row.imgsrc" :src="scope.row.imgsrc" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            </el-upload>
            <el-tooltip class="item" effect="dark" content="点击图片直接修改" placement="right">
              <el-button type="text" plain size="small" >提示</el-button></el-tooltip>

          </template>

        </el-table-column>




        <el-table-column fixed prop="author" label="作者" width="150">
        </el-table-column>
        <el-table-column fixed prop="pages" label="页数" width="80" sortable>
        </el-table-column>
        <el-table-column  fixed prop="price" label="价格" width="80" sortable>
        </el-table-column>
        <el-table-column  fixed prop="publish" label="出版社" width="150">
        </el-table-column>
        <el-table-column  fixed prop="nums" label="库存量" width="100" sortable>
        </el-table-column>
        <el-table-column  fixed prop="titlekey" label="类别" width="80">
        </el-table-column>

        <el-table-column label="操作" fixed>
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="warning" size="small" plain>修改</el-button>
            <el-button @click="deleteBook(scope.row)" type="danger" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="right"> <el-button type="primary" round plain @click="AddBook">添加图书</el-button></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>
<!--      <el-footer style="position: absolute">-->
<!--&lt;!&ndash;        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="page">&ndash;&gt;-->
<!--&lt;!&ndash;        </el-pagination>&ndash;&gt;-->

<!--      </el-footer>-->

    </el-main>


  </div>
</template>

<script>
export default {
  name: 'BookManage',
  methods: {
    thStyleFun() {
      return 'text-align:center'
    },
    cellStyleFun() {
      return 'text-align:center'
    },
    AddBook(){
      this.$router.push('/AddBook')
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // this.$router.push('/UserPage')
      // console.log(this.imageUrl)
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
    },
    deleteBook(row){
      const _this = this
      axios.delete('http://localhost:8181/booksrc/deleteAllById/'+row.id).then(function(resp){
        _this.$alert('删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
        this.findAll()
      })
    },
    edit(row) {
      this.$router.push({
        path: '/BookUpdate',
        query:{
          id:row.id
        }
      })
    },
    findAll(){
      axios.get('http://localhost:8181/booksrc/findAll/').then((resp)=>{

        this.tableData = resp.data
        // this.pageSize = resp.data.size
        // this.total = resp.data.totalElements

        this.imageUrl=resp.data.imgsrc
        // this.userList = resp.data

        // console.log(resp.data)
        // this.imageUrl=resp.data.imgsrc
        // console.log(this.tableData)
        // console.log( this.tableData)
      })
    }
    // page(currentPage){
    //   const _this = this
    //   axios.get('http://localhost:8181/booksrc/findAllClass/'+(currentPage-1)+'/6').then(function(resp){
    //     console.log(resp)
    //     _this.tableData = resp.data.content
    //     _this.pageSize = resp.data.size
    //     _this.total = resp.data.totalElements
    //   })
    // }
  },

  data() {
    return {
      currentPage:1, //初始页
      pagesize:5,    //    每页的数据
      // userList: [],
      // pageSize:'1',
      total:'11',
      tableData: [],
      imageUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    }
  },

  created() {

    this.findAll()



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
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>
