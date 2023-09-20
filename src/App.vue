<template>
  <v-app>
    <v-main>
      <div id="app">
        <transition name="route-fade" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </v-main>
    <snack-bar v-if="toggleSnack" />
  </v-app>
</template>

<script>
import SnackBar from '@components/SnackBar.vue'
export default {
  components: {SnackBar},
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    toggleSnack () {
      return this.$root.snackbar.show
    }
  }
}
</script>

<style lang="scss">
@import "@scss/app.scss";
</style>
