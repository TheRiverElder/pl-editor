import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'

Vue.config.productionTip = false

Vue.filter('localizeDate', time => {
  const t = new Date(time);
  return t.toLocaleDateString() + ' - ' + t.toLocaleTimeString(undefined, {hour12: false});
});

new Vue({
  // router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
