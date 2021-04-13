<template>
  <div class="hello">
    <h1>{{ moduleTip }}</h1>
    <el-button @click="logout" type="primary">submit</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {}
  },
  methods: {
    logout() {
      console.log('remove')
      this.$cookies.remove('u-token')
    }
  },
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
