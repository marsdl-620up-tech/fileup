<template>
  <div>
    <el-container>
      <el-header>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button @click="route('/')">
              <i class="el-icon-back"></i> 首页
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">文件分享历史记录</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button @click="openFileManage">打开分享文件目录</el-button>
          </div>
        </el-col>
      </el-header>
      <el-main>
        <el-table :data="fileListData" border style="width: 100%" empty-text="无分享文件历史记录">
          <el-table-column prop="originName" label="文件原名" width="180"></el-table-column>
          <el-table-column prop="filename" label="文件别名" width="180"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="handleShare(scope.$index, scope.row)">分享</el-button>
              <el-button size="mini" type="danger" @click="deleteShareFile(scope.row)">删除分享文件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer></el-footer>
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
const { shell } = require("electron");
const os = require("os");
import {
  fileDisplay,
  getLocalIp,
  copyClickBoard,
  getUserPath,
  getLocalFileList,
  generateShareUrl,
  deleteFileByFileName
} from "../filelist";

export default {
  data() {
    return {
      title: "局域网地址分享码-手机扫码",
      fileList: [],
      qrCodeVisible: false,
      isCopyShareUrl: true,
      codesrc: "",
      urlList: [],
      fileListData: []
    };
  },
  created() {
    this.getFileListData();
  },
  methods: {
    getFileListData() {
      this.fileListData = getLocalFileList();
      if (!this.fileListData) {
        this.fileListData = [];
      }
    },
    route(routeUrl) {
      this.$router.push({ path: routeUrl });
    },
    openFileManage() {
      const configDir = os.homedir() + "/fileup/localfile";
      shell.openItem(configDir);
    },
    handleShare(rowIndex, scopeRow) {
      const configDir = os.homedir() + "/fileup/localfile/" + scopeRow.filename;
      this.urlList = generateShareUrl(configDir, scopeRow.originName);
      this.isCopyShareUrl = false;
      this.qrCodeVisible = true;
    },
    deleteShareFile(scopeRow) {
      this.$confirm("亲亲，要确定要删除分享文件吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          debugger;
          if (deleteFileByFileName(scopeRow.filename)) {
            debugger;
            this.getFileListData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    copyUrl(copyUrl) {
      const result = copyClickBoard(copyUrl);
      if (result) {
        this.$notify.info({ title: "信息", message: "复制成功" });
      } else {
        this.$notify.error({ title: "错误", message: "文本复制失败" });
      }
    },
    closeDialog() {
      this.qrCodeVisible = false;
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-alert {
  margin-top: 10px;
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
