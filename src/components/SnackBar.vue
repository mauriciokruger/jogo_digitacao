<template>
  <v-snackbar
    v-model="show"
    :timeout="time"
    light
  >
  {{text}}
  <template v-slot:action="{ attrs }">
    <v-btn
      :color="color"
      v-bind="attrs"
      @click="close()"
    >
      Fechar
    </v-btn>
  </template>
</v-snackbar>
</template>
<script>

export default {
  data () {
    return {
      show: this.$root.snackbar.show,
      time: this.$root.snackbar.time,
      text: this.$root.snackbar.text,
      color: this.$root.snackbar.color
    }
  },
  watch: {
    show () {
      this.close()
    }
  },
  methods: {
    close () {
      this.$root.snackbar.show = false
      this.$root.snackbar.text = ''
    }
  }
}
</script>
<style lang="scss">
.v-snack__content {
  font-size: 40px!important;
  font-weight: bold!important;
  padding: 20px 16px!important;
}
</style>
