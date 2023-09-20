<template>
  <v-app>
    <div class="login">
      <v-container>
        Login
        <v-btn link to="/">home</v-btn>
      </v-container>
    </div>
  </v-app>
</template>
<script>
// import Api from '@API'
export default {
  data () {
    return {
    }
  },
  methods: {
    teste () {
      setTimeout(() => {
        this.$root.SnackControl.open(this, {
          text: 'Seja bem-vindo!',
          color: 'success'
        })
      }, 1000)
    }
  },
  created () {
    this.teste()
  }
}
</script>
<style lang="scss" scoped>
@import "@scss/app.scss";
</style>
