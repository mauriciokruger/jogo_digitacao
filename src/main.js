import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import 'typeface-roboto/index.css'
import App from './App'
import moment from 'moment'
import SnackControl from '@helper/snackControl'
import Formatter from '@helper/formatter'

moment.locale('pt-br')

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use({
  vuetify
})
new Vue({
  el: '#app',
  router,
  vuetify,
  data: {
    snackbar: {
      show: false,
      text: '',
      time: 5000,
      color: 'success'
    },
    SnackControl,
    Permissions,
    Formatter
  },
  components: { App },
  template: '<App/>'
})
