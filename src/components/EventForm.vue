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

      <b-alert show class="text-center" v-model="error" variant="danger" v-if="error">
        <h4>{{error}}</h4>
      </b-alert>
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
              <select class="form-control" v-if="hoursFormat == 24" v-model="formData.hoursStart">
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
              </select>
              <select class="form-control" v-else v-model="formData.hoursStart">
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
              </select>
            </div>:
            <div class="col-4">
              <select class="form-control" v-model="formData.minutesStart">
                <option selected disabled>Minutes</option>
                <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
              </select>
            </div>
            <div class="col-3 pl-0" v-if="hoursFormat != 24">
              <select class="form-control" v-model="formData.midnightStart">
                <option selected disabled>AM/PM</option>
                <option value="am">A.M.</option>
                <option value="pm">P.M.</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="timeStart">Ending on:</label>
          <div class="row">
            <div class="col-4">
              <select class="form-control" id="h-end" v-model="formData.hoursEnd" v-if="hoursFormat == 24">
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 24" v-if="hour >= 8 && hour <= 20">{{hour}}</option>
              </select>
              <select class="form-control" v-model="formData.hoursEnd" v-else>
                <option selected disabled>Hours</option>
                <option :key="index" v-for="(hour, index) in 12">{{hour}}</option>
              </select>
            </div>:
            <div class="col-4">
              <select class="form-control" v-model="formData.minutesEnd">
                <option selected disabled>Minutes</option>
                <option :key="index" v-for="(minute, index) in minutes">{{minute}}</option>
              </select>
            </div>
            <div class="col-3 pl-0" v-if="hoursFormat != 24">
              <select class="form-control" v-model="formData.midnightEnd">
                <option selected disabled>AM/PM</option>
                <option value="am">A.M.</option>
                <option value="pm">P.M.</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="event-desc">Describe event</label>
          <textarea class="form-control" v-model="formData.description" id="event-desc" rows="3" required></textarea>
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
          dateStart: undefined,
          hoursStart: "Hours",
          minutesStart: "Minutes",
          midnightStart: "AM/PM",
          hoursEnd: "Hours",
          minutesEnd: "Minutes",
          midnightEnd: "AM/PM",
          description: "",
          recurring: "weekly",
          duration: 1
        }
      }
    },
    props: ['hoursFormat', 'currentDate'],
    methods: {
      resetModal() {
        this.formData = {
          userFor: localStorage.getItem("id"),
          dateStart: undefined,
          hoursStart: "Hours",
          minutesStart: "Minutes",
          midnightStart: "AM/PM",
          hoursEnd: "Hours",
          minutesEnd: "Minutes",
          midnightEnd: "AM/PM",
          description: "",
          recurring: "weekly",
          duration: 1
        }
      },
      getUsers: function() {
        let id = localStorage.getItem("id");
        let role = localStorage.getItem("role");
        if (role == 1){
          let token = localStorage.getItem("token");
          // fetch('api/admin/' + id + '/' + token, 
          // fetch('http://booker.loc/Server/app/api/admin/' + id + '/' + token, 
          fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/' + id + '/' + token,
          {method: "GET"})
          .then((response) => response.json())
          .then((res) => {
            switch (res.status) {
              case "success":
                this.users = res.data;
                break;
              default:
                localStorage.clear();
                location.reload();
                break;
            }
          });
        } else {
          // fetch('api/users/' + id, 
          // fetch('http://booker.loc/Server/app/api/users/' + id, 
          fetch('http://192.168.0.15/~user6/booker/Server/app/api/users/' + id, 
          {method: "GET"})
          .then((response) => response.json())
          .then((res) => {
            switch (res.status) {
              case "success":
                this.users = res.data;
                break;
              case "no_user":
                localStorage.clear();
                location.reload()
                break;
              case "err_valid":
                localStorage.clear();
                location.reload()
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
      validateForm: function(bvModalEvt) {
        bvModalEvt.preventDefault();
        console.log('inited');

        if (!this.formData.dateStart) {
          this.error = "Please, choose the correct start date!";
          return;
        }

        if (!this.validateDate(this.formData.dateStart)) {
          return;
        }

        let hoursStart = this.standartizeHours(this.formData.hoursStart, this.formData.midnightStart);
        let hoursEnd = this.standartizeHours(this.formData.hoursEnd, this.formData.midnightEnd);

        if (hoursStart < 8 || hoursStart > 20 || hoursEnd < 8 || hoursEnd > 20) {
          this.error = "Events aviable only on 8 a.m. till 9 p.m.";
          return;
        }

        if(!hoursStart) {
          this.error = "Please, choose the correct start time";
          return;
        }

        if(!hoursEnd) {
          this.error = "Please, choose the correct ending time";
          return;
        }

        let correctDates = this.standartizeDate(this.formData.dateStart, hoursStart, this.formData.minutesStart, hoursEnd, this.formData.minutesEnd);

        if(correctDates) {
          if(correctDates.dateStart > correctDates.dateEnd){
            this.error = "The event cannot end before it starts";
            return;
          }
        } else {
          return;
        }

        if (this.formData.description.length <= 0) {
          this.error = "Desctiption is required field";
          return;
        }

        if (this.recurrence) {
          if(this.formData.recurring == 'weekly' && this.formData.duration > 4 || this.formData.duration < 1) {
            this.error = "Weekly duration cannot be more than 4";
            return;
          }

          if(this.formData.recurring == 'bi-weekly' && this.formData.duration > 2 || this.formData.duration < 1) {
            this.error = "Bi-weekly duration cannot be more than 2";
            return;
          }

          if(this.formData.recurring == 'monthly' && this.formData.duration != 1) {
            this.error = "Monthly duration cannot be more than 1";
            return;
          }
        }

        let finalFormData = new FormData();
        finalFormData.append('userForId', this.formData.userFor);
        finalFormData.append('dateStart', correctDates.dateStart);
        finalFormData.append('dateEnd', correctDates.dateEnd);
        finalFormData.append('description', this.formData.description);
        finalFormData.append('boardroom', this.$route.params.id);
        finalFormData.append('dateCreate', this.currentDate.getTime() / 1000 | 0);

        if(this.recurrence) {
          finalFormData.append("recurring", this.formData.recurring);
          finalFormData.append("duration", this.formData.duration);
        }

        // fetch('api/events/', 
        // fetch('http://booker.loc/Server/app/api/events/', 
        fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/',
        {method: "POST", body: finalFormData})
        .then((response) => response.json())
        .then((res) => {
          switch (res.status) {
            case "success":
              this.$emit("getStatus", {variant: "success", msg: "Thanks, your event created!"});
              break;
            case "err_dates":
              this.$emit("getStatus", {variant: "danger", msg: "The event cannot end before it starts!"});
              break;
            case "err_hours":
              this.$emit("getStatus", {variant: "danger", msg: "Events aviable only on 8 a.m. till 9 p.m."});
              break;
            case "err_future":
              this.$emit("getStatus", {variant: "danger", msg: "The selected date is not soon"});
              break;
            case "err_past":
              this.$emit("getStatus", {variant: "danger", msg: "You might to select the current year or later"});
              break;
            case "err_valid":
              this.$emit("getStatus", {variant: "danger", msg: "Fields were filled incorrect!"});
              break;
            case "err_time":
              this.$emit("getStatus", {variant: "danger", msg: "An event has already been booked for the specified time!"});
              break;
            case "err_holiday":
              this.$emit("getStatus", {variant: "danger", msg: "You can not book an event for the weekend!"});
              break;
            case "succ_with_errors":
              this.$emit("getStatus", {variant: "warning", msg: "The event was booked, but some recurrent events were failed cause they overlapped with other events."});
              break;
            default:
              this.$emit("getStatus", {variant: "danger", msg: "Something going wrong. Please, try again later!"});
              break;
          }
        });
          this.$nextTick(() => {
            this.$refs.modal.hide()
          })


        /*
        * доделать: 
        * Проверка на то, что время, на которое запланировано событие ещё не наступило +
        * Метод отправки данных на сервер + Модуль ивентов на сервере
        * Перерисовка формы на success message || отправка success в календарь?
        */

      },
      validateDate: function(date) {

        let dateArr = date.split('-');
        if (+dateArr[0] < 2019) {
          this.error = "You might to select the current year or later";
          return;
        }

        if (+dateArr[1] > 12 || +dateArr[1] < 1) {
          this.error = "You might to select correct month";
          return;
        }

        if (+dateArr[0] > 2020) {
          this.error = "The selected date is not soon";
          return;
        }

        // if (+dateArr[0] == 2019 && +dateArr[1] < this.currentDate.getMonth() + 1 || +dateArr[2] < this.currentDate.getDate()) {
        //   console.log(this.currentDate.getMonth() + 1)
        //   this.error = "You can not create event before current date!";
        //   return;
        // }

        return true;
      },
      switchRecurring: function()
      {
        if(this.recurrence == false) {
          this.recurrence = true;
        } else {
          this.recurrence = false;
        }
      },
      standartizeHours: function(hours, midnight) {
        if (isNaN(hours)) {
          return;
        }
        if (this.hoursFormat != 24 && midnight == 'pm') {
            return +hours + 12;
        }
        return hours;
      },
      checkHolidays: function(date) {
        if(date.getDay() >= 6) {
          this.error = "Sorry, you can't planning event on weekends";
          return;
        }
        return true;
      },
      standartizeDate: function(date, hoursStart, minutesStart, hoursEnd, minutesEnd) {
        let result = {};
        let dateArr = date.split('-');

        if(hoursStart && minutesStart) {
          var dateStart = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursStart, minutesStart);
        }
        
        if(hoursEnd && minutesEnd) {
          var dateEnd = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursEnd, minutesEnd);
        }

        if (!this.checkHolidays(dateStart) || !this.checkHolidays(dateEnd)) {
          return;
        }

        if (dateStart.getTime() < this.currentDate.getTime()) {
          this.error = "You can not create event before current time!";
          return;
        }

        if(dateStart && dateEnd) {
          result.dateStart = dateStart.getTime() / 1000;
          result.dateEnd = dateEnd.getTime() / 1000;
          return result;
        }
        this.error = "Please, choose correct date";
        return;
      }
    },
    computed: {
    },
    created: function() {
      this.getUsers();
      console.log();
    }
  }
</script>