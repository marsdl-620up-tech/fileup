<template>
  <div id="wrapper">
    <el-container>
      <el-header>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
          <el-tag type="success">fileup Lnwy alpha 0.0.1</el-tag>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">局域网文件分享</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button @click="route('/history')">历史记录</el-button>
          </div>
        </el-col>
      </el-header>
      <el-main>
        <el-upload
          align="center"
          class="upload-demo"
          drag
          action="http://localhost:3000/file_upload"
          multiple
          :on-success="uploadSucess"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-main>

      <el-footer>
        <el-tag type="success">提示：手机与电脑要在一个路由器下的无线网；上传无法使用时，查看3000端口是否被占用</el-tag>
      </el-footer>
    </el-container>

    <el-dialog :title="title" :visible.sync="qrCodeVisible" width="40%" @click="closeDialog">
      <div class="codeimg" width="200" height="200">
        <span v-for="(item, index) in urlList" :key="index">
          <div>
            <div width="200" height="200">
              <img :src="item.qrCodeUrl" width="200" height="200" />
            </div>
            <div>
              <el-button :disabled="isCopyShareUrl" @click="copyUrl(item.shareUrl)">复制链接</el-button>
            </div>
          </div>
        </span>
      </div>
    </el-dialog>

    <div id="last-footer">陆二零网络科技公司</div>
  </div>
</template>

<script>
import {
  fileDisplay,
  getLocalIp,
  copyClickBoard,
  getUserPath,
  generateShareUrl
} from "./filelist";

export default {
  data() {
    return {
      title: "局域网地址分享码-手机扫码",
      fileList: [],
      qrCodeVisible: false,
      isCopyShareUrl: true,
      codesrc: "",
      urlList: []
    };
  },
  methods: {
    uploadSucess(res, file, fileList) {
      this.fileList = [];
      if (res.code == -1) {
        this.$message.error("上传失败，请重试");
        return;
      }
      let filename = res.filename;
      let filepath = res.filepath;
      this.urlList = generateShareUrl(filepath, filename);
      this.isCopyShareUrl = false;
      this.qrCodeVisible = true;
      this.$message({ type: "success", message: "上传成功" });
    },
    copyUrl(copyUrl) {
      const result = copyClickBoard(copyUrl);
      if (result) {
        this.$notify.info({ title: "信息", message: "复制成功" });
      } else {
        this.$notify.error({title: "错误",message: "文本复制失败"});
      }
    },
    route(routeUrl) {
      this.$router.push({ path: routeUrl });
    },
    shareFile(param) {
      console.log(param);
    },
    closeDialog() {
      this.qrCodeVisible = false;
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  /* background-color: #B3C0D1; */
  margin-top: 20px;
  color: #333;
  text-align: center;
  line-height: 35px;
}

body > .el-container {
  margin-bottom: 40px;
}

.codeimg {
  text-align: center;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

#last-footer {
  font-size: 12px;
  text-align: center;
  position: fixed;
  height: 40px;
  width: 100%;
  bottom: 10px;
  color: #909399;
  /* background-color: #333; */
}
</style>
