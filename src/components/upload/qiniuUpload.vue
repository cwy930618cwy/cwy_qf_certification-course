<template>
  <input
    type="file"
    :id="name"
    class="inputfile"
    @change.prevent="upLoad(name)"
  />
</template>
<script>
import api from "@/api/index.js";
import * as qiniu from "qiniu-js";
export default {
  props: ["name"],
  data() {
    return {
      qiniutoken: "",
      imgUrl: ""
    };
  },
  methods: {
    upLoad(name) {
      const files = document.getElementById(name).files[0];
      if (files.size / 1024 / 1024 > 2) {
        // this.$message.warning('请上传小于5M的文件');
        return this.$message.warning("请上传小于2M的文件");
      }
      const fileType = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".webp"];
      const suffix = files.name.substring(
        files.name.lastIndexOf("."),
        files.name.length
      );
      if (fileType.indexOf(suffix) === -1) {
        this.$message.warning("请上传正确格式的图片");
        return;
      }
      let key = new Date().getTime() + Math.random(1000) + files.name;
      const observable = qiniu.upload(
        files,
        null,
        this.qiniutoken,
        {
          // 上传行为
          fname: key, // 文件原始文件名
          customVars: {} // 魔法变量，更灵活的控制上传后续动作中的内容组织和传递
        },
        {
          useCdnDomain: true // 是否使用 cdn 加速域名
          //region: qiniu.region.z0,											// 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
        }
      );

      const observer = {
        next: result => {
          //主要用来展示进度
          this.$emit('handleprogress', result.total.percent)
        },
        error: err => {
          //上传错误后触发
          console.log(err, "err");
        },
        complete: url => {
          this.imgUrl = `http://qnobndcx9.hb-bkt.clouddn.com/${url.key}`;
          // console.log('this.imgUrl',this.imgUrl)
          this.$emit("uploadPic", this.imgUrl);
        }
      };
      const subscription = observable.subscribe(observer);
    }
  },
  mounted() {
    api.uploadurl().then(res => {
      this.qiniutoken = res.data;
    });
  }
};
</script>
<style scoped lang="less">
.inputfile {
  width: 100%;
  height: 100%;
  position: absolute;
  top:0px;
  left: 0px;
  opacity: 0;
  cursor: pointer;
}
</style>
