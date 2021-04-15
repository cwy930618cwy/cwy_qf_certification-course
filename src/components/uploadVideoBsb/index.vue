<template>
  <input
    type="file"
    value="添加视频"
    accept=".avi, .wma, .rmvb, .rm, .flash,.mp4,.mid, 3GP, .mov, .ogg, .wmv,.mp3,.midi,.wma,.aac,.flac,.ape"
    id="file"
    class="inputfile"
    @change.prevent="addVedio($event, { name: '', id: 2 }, {id: 3})"
  />
</template>

<script>
import api from "@/api/index.js";
import * as qiniu from "qiniu-js";

export default {
  data() {
    return {
      typeName: "",
      codShow: false,
      imgUrl: "",
      title: "",
      dialogText: "",
      playVedio: false,
      qiniutoken: "",
      singswitch: false,
      loading: false,
      dialogVisible: false,
      fileName: "",
      courseId: this.$route.query.id,
      subjectId: this.$route.query.subjectId,
      status: this.$route.query.status,
      filePercent: 0,
      nodeobj: {},
      upShow: false,
      whichId: "",
      defaultShowNodes: [],
      defaultProps: { children: "children", label: "label" },
      dataList: [],
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false,
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true,
        sources: [
          {
            type: "video/mp4", // 类型
            src: "" // url地址
          }
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    };
  },
  methods: {
    addVedio(e, node, obj) {
      let _that = this;
      var files = e.target.files[0];
      node.fileName = files.name || "";

      if (files.size / 1024 / 1024 > 500) {
        // this.$message.warning('请上传小于5M的文件');
        return this.$message.warning("请上传小于500M的文件");
      }
      const fileType = [".avi", ".wma", ".rmvb", ".rm", ".flash", ".mp4", ".mid", ".3GP", ".mov", ".ogg", ".wmv", ".mp3", ".midi", ".wma", ".aac", ".flac", ".ape",];
      const suffix = files.name.substring(
        files.name.lastIndexOf("."),
        files.name.length
      );
      if (fileType.indexOf(suffix) === -1) {
        this.$message.warning("请上传正确格式的视频");
        return;
      }

      api.uploadurl({ type: 1 }).then(res => {
        _that.qiniutoken = res.data;
        console.log(files);
        if (_that.qiniutoken) {
          const observable = qiniu.upload(
            files,
            files.name,
            this.qiniutoken,
            {
              customVars: {}
            },
            {
              useCdnDomain: true
            }
          );
          this.whichId = node.id;
          const observer = {
            next: result => {
              //主要用来展示进度
              this.filePercent = parseInt(result.total.percent);
              if (this.filePercent == 100) {
                this.whichId = "";
              }
            },
            error: err => {
              //上传错误后触发
              console.log(err, "err");
            },
            complete: url => {
              this.imgUrl = `https://coding-class.codingke.com/${url.key}`
              this.$emit('uploadVideo', this.imgUrl)
            }
          };
          const subscription = observable.subscribe(observer);
        }
      });
    }
  }
};
</script>
<style lang="less">
// @import "../components/css/public.less";
.inputfile {
  position: absolute;
  top:0px;
  left: 0px;
  opacity: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
</style>