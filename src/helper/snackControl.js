class SnackControl {
  static open (self, data) {
    self.$root.snackbar.show = true
    self.$root.snackbar.text = data.text ? data.text : ''
    self.$root.snackbar.time = data.time ? data.time : 5000
    self.$root.snackbar.color = data.color ? data.color : 'success'
  }
  static close (self) {
    self.$root.snackbar.show = false
    self.$root.snackbar.text = ''
    self.$root.snackbar.time = 5000
    self.$root.snackbar.color = 'success'
  }
}

export default SnackControl
