<template>
  <div>
    <b-button v-b-modal.modal-prevent-closing variant="success">Book it!</b-button>

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Submit Your Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="newEvent"
    >
      <form ref="form" @submit="newEvent">
        <div class="form-group">
            <label for="LoginUsername">Username</label>
            <input type="text" class="form-control" id="LoginUsername" aria-describedby="emailHelp" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label for="loginPass">Password</label>
            <input type="password" class="form-control" id="loginPass" placeholder="Password" required>
          </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: '',
        nameState: null,
        submittedNames: []
      }
    },
    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid ? 'valid' : 'invalid'
        return valid
      },
      resetModal() {
        this.name = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      newEvent() {
          console.log("new event");
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        // Push the name to submitted names
        this.submittedNames.push(this.name)
        // Hide the modal manually
        this.$nextTick(() => {
          this.$refs.modal.hide()
        })
      }
    }
  }
</script>