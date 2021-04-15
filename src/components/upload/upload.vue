<template>
  <div>
    <!-- <label class="lable-origin" for="avatar"></label> -->
    <input
      type="file"
      id="avatar"
      class="upload-input"
      @change.prevent="upLoad()"
    />
  </div>
</template>
<script>
import api from "@/api/index";
export default {
  data() {
    return {};
  },
  methods: {
    upLoad() {
      const files = window.event.target.files[0];
      if (files.size / 1024 / 1024 > 5) {
        // this.$message.warning('请上传小于5M的文件');
        return;
      }
      const fileType = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"];
      const suffix = files.name.substring(
        files.name.lastIndexOf("."),
        files.name.length
      );
      if (fileType.indexOf(suffix) === -1) {
        this.$message.warning("请上传正确格式的图片");
        return;
      }
      this.handleUpload(files);
    },
    handleUpload(files) {
      this.ossUpload(files)
        .then(res => {
          // console.log('success',res)
          // 上传成功之后的回调
          let obj = {
            url: res,
            file: files
          };
          this.$emit("success", obj);
        })
        .catch(files => {
          // this.$message.warning('上传失败')
        });
    },
    ossUpload(file) {
      return new Promise(resolve => {
        const arr = file.name.split(".");
        const name1 = arr[arr.length - 1];
        // 上传到百度云
        const _date = new Date();
        const time =
          _date.getFullYear() +
          "-" +
          (_date.getMonth() + 1 < 10
            ? "0" + (_date.getMonth() + 1)
            : _date.getMonth() + 1) +
          "-" +
          (_date.getDate() < 10 ? "0" + _date.getDate() : _date.getDate());
        api.getBaiduBce().then(res => {
          // ACCESS_KEY: "e9d19924f342400caa9b04795c0f3003"
          // BUCKET_NAME: "qfzy"
          // DOC: "doc"
          // ENDPOINT: "http://qfzy.static.1000phone.net"
          // IMG: "img"
          // MEDIA: "media"
          // SECRET_KEY: "addfcfff83754176b0b1fae60b60d9c7"
          const baseImgUrl = res.ENDPOINT;
          const config = {
            endpoint: res.ENDPOINT, // 传入Bucket所在区域域名
            credentials: {
              ak: res.ACCESS_KEY, // 您的AccessKey
              sk: res.SECRET_KEY // 您的SecretAccessKey
            }
          };
          const client = new baidubce.sdk.BosClient(config);
          const name = new Date();
          const key =
            (name.getFullYear() + "").padStart(2, "0") +
            (name.getMonth() + 1 + "").padStart(2, "0") +
            (name.getDate() + "").padStart(2, "0") +
            (name.getHours() + "").padStart(2, "0") +
            (name.getMinutes() + "").padStart(2, "0") +
            (name.getSeconds() + "").padStart(2, "0") +
            "." +
            name1;
          const blob = file;
          const bucket = `${res.IMG}/koudingxuetangShare/${time}`;
          const bucketName = "/" + bucket;
          // 创建bucket
          client
            .createBucket(bucketName)
            .then(() => {
              // 上传文件
              client
                .putObjectFromBlob(bucketName, key, blob)
                .then(res => {
                  // console.log(baseImgUrl + '/' + bucket + '/' + key)
                  resolve(baseImgUrl + "/" + bucket + "/" + key);
                })
                .catch(err => {
                  console.log(err);
                });
              // 查看文件
            })
            .catch(error => {
              console.log(error);
            });
        });
      });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
// .lable-origin{
//     width: 100%;
//     position: absolute;
//     height: 100%;
//     top: 0px;
//     left: 0px;
//     cursor: pointer;
// }
.upload-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  width: 352px;
  height: 200px;
  cursor: pointer;
}
</style>
