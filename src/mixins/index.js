import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['moduleTip'])
  },
  created() {
    //console.log('混入成功')
    // alert("全局混入成功");
  },
  methods: {}
}
