import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import pt from 'vuetify/src/locale/pt.ts'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt'
  },
  theme: {
    dark: true,
    themes: {
      light: {
        primary: '#054074',
        secondary: '#F8BD18',
        anchor: '#707070',
        success: '#00C064',
        error: '#FF0B0B',
        blue: '#4393B6'
      }
    }
  }
})

export default vuetify
