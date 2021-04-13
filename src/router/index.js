//eslint-disable-next-line
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router.js";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
router.beforeEach((to, from, next) => {
  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
