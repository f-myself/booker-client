<template>
  <div>
    <b-button v-b-modal.modal-prevent-closing variant="success">Book it!</b-button>

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Booking"
      @show="resetModal"
      @hidden="resetModal"
      @ok="validateForm"
    >

      <div class="alert alert-danger" role="alert" v-if="error">
        {{error}}
      </div>
      <form ref="form" @submit="validateForm">
        <div class="form-group">
          <label for="userFor">Booked for:</label>
          <select class="form-control" id="userFor" v-model="formData.userFor">
            <option :key="key" v-for="(user, key) in users" :value="user.id">{{user.name}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="datestart">Book this meeting on:</label>
          <input type="date" v-model="formData.dateStart" class="form-control" id="datestart" required>
        </div>
        <div class="form-group">
          <label for="timeStart">Beginning on:</label>
          <div class="row">
            <div class="col-4">
              <select class="form-control" v-if="hoursFormat == 24">
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
              </select>
              <select class="form-control" v-else>
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
              </select>
            </div>:
            <div class="col-4">
              <select class="form-control">
                <option selected disabled>Minutes</option>
                <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
              </select>
            </div>
            <div class="col-3 pl-0" v-if="hoursFormat != 24">
              <select class="form-control">
                <option selected disabled>AM/PM</option>
                <option value="am">A.M.</option>
                <option value="am">P.M.</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="timeStart">Ending on:</label>
          <div class="row">
            <div class="col-4">
              <select class="form-control" v-if="hoursFormat == 24">
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
              </select>
              <select class="form-control" v-else>
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
              </select>
            </div>:
            <div class="col-4">
              <select class="form-control">
                <option selected disabled>Minutes</option>
                <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
              </select>
            </div>
            <div class="col-3 pl-0" v-if="hoursFormat != 24">
              <select class="form-control">
                <option selected disabled>AM/PM</option>
                <option value="am">A.M.</option>
                <option value="am">P.M.</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="event-desc">Describe event</label>
          <textarea class="form-control" id="event-desc" rows="3"></textarea>
        </div>
        <div class="custom-control custom-switch pb-2">
          <input type="checkbox" class="custom-control-input" v-model="recurrence" name="recurrence" @click="switchRecurring" id="recurrenceSwitcher">
          <label class="custom-control-label" for="recurrenceSwitcher">Is this going to be recurring event?</label>
        </div>
        <div class="pt-1 pb-1" v-if="recurrence">
          <p class="mb-2">Specify recurrence of event:</p>
          <div class="form-check" >
            <input class="form-check-input" type="radio" v-model="formData.recurring" @click="resetDuration" name="recurr" id="weekly" value="weekly" checked>
            <label class="form-check-label" for="weekly">
              Weekly
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="formData.recurring" @click="resetDuration" name="recurr" id="bi-weekly" value="bi-weekly">
            <label class="form-check-label" for="bi-weekly">
              Bi-weekly
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="formData.recurring" @click="resetDuration" name="recurr" id="monthly" value="monthly">
            <label class="form-check-label" for="monthly">
              Monthly
            </label>
          </div>
          <div class="form-group">
            <label for="duration">Duration: {{formData.duration}}</label>
            <input type="range" class="custom-range" v-model="formData.duration" v-if="formData.recurring == 'weekly'" min="1" max="4" step="1" id="duration">
            <input type="range" class="custom-range" v-model="formData.duration" v-if="formData.recurring == 'bi-weekly'" min="1" max="2" step="1" id="duration">
            <input type="range" class="custom-range" v-model="formData.duration" v-if="formData.recurring == 'monthly'" min="1" max="1" disabled value="1" id="duration">
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        users: [],
        error: undefined,
        minutes: ['00', '15', '30', '45'],
        recurrence: false,
        formData: {
          userFor: localStorage.getItem("id"),
          dateStart: "",
          hoursStart: "",
          minutesStart: "",
          hoursEnd: "",
          minutesEnd: "",
          recurring: "weekly",
          duration: 1
        }
      }
    },
    props: ['hoursFormat'],
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
      },
      getUsers: function() {
        let id = localStorage.getItem("id");
        let role = localStorage.getItem("role");
        if (role == 1){
          let token = localStorage.getItem("token");
          // fetch('api/admin/', 
          fetch('http://booker.loc/Server/app/api/admin/' + id + '/' + token, 
          // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/',
          {method: "GET"})
          .then((response) => response.json())
          .then((res) => {
            switch (res.status) {
              case "success":
                this.users = res.data;
                break;
              default:
                localStorage.clear();
                this.$router.push("/");
                break;
            }
          });
        } else {
          // fetch('api/users/', 
          fetch('http://booker.loc/Server/app/api/users/' + id, 
          // fetch('http://192.168.0.15/~user6/booker/Server/app/api/users/', 
          {method: "GET"})
          .then((response) => response.json())
          .then((res) => {
            switch (res.status) {
              case "success":
                this.users = res.data;
                break;
              case "no_user":
                localStorage.clear();
                this.$router.push("/");
                break;
              case "err_valid":
                localStorage.clear();
                this.$router.push("/");
                break;
              default:
                break;
            }
          });
        }
      },
      resetDuration: function() {
        this.formData.duration = 1;
      },
      validateForm: function() {
        if (this.formData.dateStart) {
          let date = this.formData.dateStart.split('-');
          if (+date[0] < 2019)
          {
            this.error = "You might to select the current year or later";
          }

          if (+date[1] > 12 || +date[1] < 1)
          {
            this.error = "You might to select correct month";
          }
        } else {
          this.error - "Please, choose correct date!"
        }
      },
      switchRecurring: function()
      {
        if(this.recurrence == false) {
          this.recurrence = true;
        } else {
          this.recurrence = false;
        }
      },
      standartizeHours: function(hours) {
        if (this.hoursFormat != 24)
        {
          this.hour;
        }
      }
    },
    computed: {
    },
    created: function() {
      this.getUsers();
    }
  }
</script>