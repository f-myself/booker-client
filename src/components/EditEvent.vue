<template>
    <div class="row">
        <div class="col-12">
            <b-alert show class="text-center" v-model="status" :variant="statusVar" v-if="status">
                <h4>{{status}}</h4>
            </b-alert>
        </div>
        <!-- <h1> hello, {{id}}</h1> -->
        <div class="col-4"></div>
        <div class="col-4">
        <form ref="form" class="text-left" @submit="validateForm" v-if="showEvent">
            <div class="form-group">
            <label for="userFor">Booked for:</label>
            <select class="form-control" id="userFor" v-model="formData.userFor">
                <option :key="key" v-for="(user, key) in users" :value="user.id">{{user.name}}</option>
            </select>
            </div>
            
            <div class="form-group">
            <label for="timeStart">Beginning on (<small>Old time: {{formData.oldTime}}</small>):</label>
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
            <div class="custom-control custom-switch pb-2" v-if="showRecurrence">
            <input type="checkbox" class="custom-control-input" v-model="recurrence" name="recurrence" @click="switchRecurring" id="recurrenceSwitcher">
            <label class="custom-control-label" for="recurrenceSwitcher">Apply to all occurrences?</label>
            </div>
            <button type="submit" class="btn btn-primary right">Submit</button>
        </form>
        </div>
        <div class="col-4"></div>
    </div>
</template>

<script>
export default {
    name: "EditEvent",
    data: function() {
        return {
            statusVar: "danger",
            status: "",
            eventData: [],
            showEvent: false,
            showRecurrence: false,
            recurrence: false,
            formData: {
                userFor: localStorage.getItem("id"),
                dateStart: "",
                hoursStart: "Hours",
                minutesStart: "Minutes",
                midnightStart: "AM/PM",
                hoursEnd: "Hours",
                minutesEnd: "Minutes",
                midnightEnd: "AM/PM",
                description: "",
                oldTime: ""

            },
            hoursFormat: localStorage.getItem("timeFormat"),
            users: [],
            minutes: ['00', '15', '30', '45'],
        }
    },
    methods: {
        switchRecurring: function() {
            if(this.recurrence == false) {
                this.recurrence = true;
            } else {
                this.recurrence = false;
            }
        },
        getDate: function(startEvent) {
            let start = startEvent + "000";
            let date = new Date(+start);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return year + '-' + month + '-' + day;
        },
        getTime: function(startEvent, endEvent) {
            let start = startEvent + "000";
            let dateStart = new Date(+start);
            if(dateStart.getMinutes() == 0) {
                var timeStart = dateStart.getHours() + ':00';
            } else {
                var timeStart = dateStart.getHours() + ':' + dateStart.getMinutes();
            }
            let end = endEvent + "000";
            let dateEnd = new Date(+end);
            if(dateEnd.getMinutes() == 0) {
                var timeEnd = dateEnd.getHours() + ':00';
            } else {
                var timeEnd = dateEnd.getHours() + ':' + dateEnd.getMinutes();
            }

            return timeStart + " - " + timeEnd;
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

        standartizeDate: function(date, hoursStart, minutesStart, hoursEnd, minutesEnd) {
            let result = {};
            let dateArr = date.split('-');
            let currentDate = new Date;

            if(hoursStart && minutesStart) {
            var dateStart = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursStart, minutesStart);
            }
            
            if(hoursEnd && minutesEnd) {
            var dateEnd = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], hoursEnd, minutesEnd);
            }

            if (dateStart.getTime() < currentDate.getTime()) {
                this.status = "Sorry, but event is already finished!";
                return;
            }

            if(dateStart && dateEnd) {
                result.dateStart = dateStart.getTime() / 1000;
                result.dateEnd = dateEnd.getTime() / 1000;
                return result;
            }
            this.status = "Please, choose correct date";
            return;
        },
        checkAdmin: function() {
            var result = 
            // fetch('api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            fetch('http://booker.loc/Server/app/api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {

                    case 'success':
                        return true;
                        break;
                        
                    default: 
                        localStorage.clear();
                        location.reload();
                        break;
                }
            })
        },
        getUsers: function() {
            let id = localStorage.getItem("id");
            let role = localStorage.getItem("role");
            if (role == 1){
            let token = localStorage.getItem("token");
            // fetch('api/admin/' + id + '/' + token, 
            fetch('http://booker.loc/Server/app/api/admin/' + id + '/' + token, 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/' + id + '/' + token,
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
            fetch('http://booker.loc/Server/app/api/users/' + id, 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/users/' + id, 
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
        getEvent: function() {
            // fetch('api/events/' + this.$route.params.id, 
            fetch('http://booker.loc/Server/app/api/events/' + this.$route.params.id, 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/' + this.$route.params.id, 
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {

                    case 'success':
                        if(res.data[0].user_id == localStorage.getItem("id") || localStorage.getItem("role") == 1) {
                            this.eventData = res.data;
                            if(res.data.length > 1 || res.data[0].parent) {
                                this.showRecurrence = true;
                            }
                            this.showEvent = true;
                            this.formData.dateStart = this.getDate(res.data[0].startEvent);
                            this.formData.description = res.data[0].description;
                            this.formData.oldTime = this.getTime(res.data[0].startEvent, res.data[0].endEvent)
                        } else {
                            this.status = "error! not yours!";
                        }
                        break;
                        
                    default: 
                        this.status = "error";
                    }
            })
            .catch((error) => {
                this.status = "error"
            })
        },
        dataToParamString: function (data) {
            var string= '';
            for(let val in data){
                string += val + '=' + encodeURIComponent(data[val]) + '&' 
            }
            return string;
        },
        validateForm: function(event) {
            event.preventDefault();

            let hoursStart = this.standartizeHours(this.formData.hoursStart, this.formData.midnightStart);
            let hoursEnd = this.standartizeHours(this.formData.hoursEnd, this.formData.midnightEnd);

            if (hoursStart < 8 || hoursStart > 20 || hoursEnd < 8 || hoursEnd > 20) {
                this.status = "Events aviable only on 8 a.m. till 9 p.m.";
                return;
            }

            if(!hoursStart || isNaN(this.formData.minutesStart)) {
                this.status = "Please, choose the correct start time";
                return;
            }

            if(!hoursEnd || isNaN(this.formData.minutesStart)) {
                this.status = "Please, choose the correct ending time";
                return;
            }


            let correctDates = this.standartizeDate(this.formData.dateStart, hoursStart, this.formData.minutesStart, hoursEnd, this.formData.minutesEnd);

            if(correctDates) {
                if(correctDates.dateStart > correctDates.dateEnd) {
                    this.status = "The event cannot end before it starts";
                    return;
                }
            } else {
            return;
            }

            if (this.formData.description.length <= 0) {
                this.error = "Desctiption is required field";
                return;
            }

            var dataForm = {
                eventId: this.eventData[0].id,
                roomId: this.eventData[0].boardroom_id,
                parent: this.eventData[0].parent,
                userFor: this.formData.userFor,
                dateStart: correctDates.dateStart,
                dateEnd: correctDates.dateEnd,
                description: this.formData.description,
                recFlag: this.recurrence,
                userId: localStorage.getItem("id"),
                token: localStorage.getItem("token")
            }

            var sendingData = this.dataToParamString(dataForm);

            // fetch('api/events/', 
            fetch('http://booker.loc/Server/app/api/events/',
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/', 
            {method: "PUT",  body: sendingData})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case 'success':
                        this.statusVar = 'success';
                        this.status = 'Thanks, events were updated!';
                        break;
                    
                    case 'err_valid':
                        this.status = 'Fill in the fields correctly!'
                        break;

                    case 'err_dates':
                        this.status = 'The event cannot end before it starts!'
                        break;

                    case 'err_hours':
                        this.status = 'The selected date is not soon';
                        break;

                    case 'err_future':
                        this.status = 'Events aviable only on 8 a.m. till 9 p.m.';
                        break;

                    case 'err_past':
                        this.status = 'You might to select the current year or later';
                        break;

                    case 'err_time':
                        this.status = 'An event has already been booked for the specified time!';
                        break;

                    case 'err_current':
                        this.status = 'Sorry, but event is already finished!';
                        break;
                    
                    case 'succ_with_errors':
                        this.statusVar = 'warning';
                        this.status = 'events were updated but problems occurred!';
                        break;

                    case 'err_login':
                        localStorage.clear();
                        location.reload()
                        break;

                    default: 
                        break
                }
            });

            console.log('sending');
            console.log(sendingData);
        },
    },
    created: function() {
        if(localStorage.getItem("role") == 1) {
            this.checkAdmin()
        }
        this.getEvent()
        this.getUsers();
    }
}
</script>
