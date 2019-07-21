<template>
    <div class="row">
        <div class="col-9">
            <b-alert show class="text-center" v-model="status" :variant="status.variant" v-if="status">
                <h4>{{status.msg}}</h4>
            </b-alert>
            <table id="calendar2" class="table table-bordered">
                <thead>
                    <tr>
                        <td @click="prevMonth"><b-button variant="primary" class="btn-switch"> < </b-button></td>
                        <td colspan="5"><h2><font-awesome-icon :icon="['far', 'calendar-alt']" /> {{ monthYear }}</h2></td>
                        <td @click="nextMonth"><b-button variant="primary" class="btn-switch"> > </b-button></td>
                    </tr>
                    <tr class="week-days">
                        <td :key="index" v-for="(weekDay, index) in week">{{weekDay}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="index" v-for="(week, index) in days">
                        <td :key="index" v-for="(day, index) in week">{{ day.dayNum }}
                            <b-list-group>
                            <b-list-group-item :key="index" v-for="(event, index) in events" v-if="new Date(+event.startEvent).getDate() == day.dayNum" size="sm" variant="primary" class="mb-1 p-0 border-0 text-center event-badge" v-b-modal.my-modal @click="getEventById(index)"><small>
                               {{event.startHour}}:{{event.startMinutes}} {{event.ampmStart}} - {{event.endHour}}:{{event.endMinutes}} {{event.ampmEnd}}</small>
                            </b-list-group-item>
                            </b-list-group>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b-modal 
                id="my-modal" 
                title="Event details"
                hide-footer
                v-if="selectedEvent != undefined"
            >
                <table class="table">
                    <tbody>
                        <tr>
                            <th scope="row">When</th>
                            <td><small>Starts at</small> {{events[selectedEvent].startHour}}:{{events[selectedEvent].startMinutes}} {{events[selectedEvent].ampmStart}}</td>
                            <td><small>Ends at</small> {{events[selectedEvent].endHour}}:{{events[selectedEvent].endMinutes}} {{events[selectedEvent].ampmEnd}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Notes</th>
                            <td colspan="2">{{events[selectedEvent].description}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Who</th>
                            <td colspan="2">{{events[selectedEvent].name}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="modal-footer">
                    <button v-b-modal.delete-modal @click="$bvModal.hide('my-modal')" type="button" class="btn btn-outline-danger">Delete</button>
                    <router-link :to="'/edit/' + events[selectedEvent].id" class="btn btn-primary">Update</router-link>
                </div>
                <!-- {{events[selectedEvent]}} -->
            </b-modal>

            <b-modal 
                id="delete-modal" 
                title="Delete event"
                hide-footer
                v-if="selectedEvent != undefined"
            >
                <p>Are you sure you want to delete this event?</p>

                <div class="modal-footer">
                    <button type="button" @click="deleteEvent(true)" class="btn btn-outline-danger float-right">Delete all accurrencies</button>
                    <button type="button" @click="deleteEvent(false)" class="btn btn-primary float-right">Delete</button>
                </div>
            </b-modal>
        </div>
        <div class="col-3 text-left">
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="customSwitch1" @click="changeFormat" v-if="weekFormat == 'RU'">
                <input type="checkbox" class="custom-control-input" id="customSwitch1" @click="changeFormat" v-else checked>
                <label class="custom-control-label" for="customSwitch1">Switch week format: <b>({{weekFormat}})</b></label>
            </div>
            <div class="custom-control custom-switch pb-2">
                <input type="checkbox" class="custom-control-input" name="time" @click="changeTimeFormat" id="timeSwicher">
                <label class="custom-control-label" for="timeSwicher">Switch time format: {{timeFormat}}</label>
            </div>
            <div class="p-2 pt-3">
                <router-link to="/employees" class="btn btn-secondary">Employee List</router-link>
            </div>
            <div class="p-2">
                <EventForm 
                :hours-format="timeFormat"
                :current-date="date"
                @getStatus="setStatus"
                />

            </div>
        </div>
    </div>
</template>

<script>
import EventForm from "./EventForm";

export default {
    name: "Calendar",
    components: {
        EventForm
    },
    data: function() {
        return {
            status: "",
            selectedEvent: undefined,
            events: [],
            login: localStorage.getItem("login"),
            date: new Date(),
            monthes: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'October', 'December'],
            selectedMonth: undefined,
            selectedYear: undefined,
            daysInSelectedMonth: undefined,
            lastDay: undefined,
            firstWeekDay: undefined,
            firstDay: 1,
            lastWeekDay: undefined,
            days: [],
            weekFormat: "RU",
            timeFormat: 24
        }
    },
    props: ['room'],
    methods: {
        setStatus(data) {
            this.status = data;
            this.getEvents();
        },
        getEventById: function(id) {
            this.selectedEvent = id;
        },
        currentMonth: function(){
            this.selectedMonth = this.date.getMonth();
            return this.selectedMonth
        },
        currentYear: function(){
            this.selectedYear = this.date.getFullYear();
            return this.selectedYear;
        },
        showMonth: function(month){
            this.selectedMonth = month;
            return this.monthes[month];

        },
        nextMonth: function(){
            this.getFirstWeekDay();
            this.getLastDay();
            this.getLastWeekDay();
            this.getMonthesDays();
            if(this.selectedMonth < 11){
                return this.selectedMonth++;
            }
                this.selectedYear++;
                return this.selectedMonth = 0;
        },
        prevMonth(){
            this.getFirstWeekDay();
            this.getLastDay();
            this.getLastWeekDay();
            this.getMonthesDays();
            if(this.selectedMonth > 0){
                return this.selectedMonth--;
            }
                this.selectedYear--;
                return this.selectedMonth = 11;
        },
        getFirstWeekDay: function(){
            this.firstWeekDay = new Date(this.selectedYear,this.selectedMonth,1).getDay();
        },
        getLastDay: function(){
            this.lastDay = new Date(this.selectedYear,this.selectedMonth+1,0).getDate()
        },
        getLastWeekDay: function(){
            this.getLastDay();
            this.lastWeekDay = new Date(this.selectedYear,this.selectedMonth,this.lastDay).getDay()
        },
        getMonthesDays: function(){
            this.days = [];
            var week = 0;
            this.days[week] = [];
            for(var  i = 1; i <= this.lastDay; i++) {
                if(new Date(this.selectedYear,this.selectedMonth,i).getDay() != this.firstDay){
                    this.days[week].push({
                        dayNum: i,
                        dayWeek: new Date(this.selectedYear,this.selectedMonth,i).getDay()
                    })
                } else {
                    week++;
                    if(!this.days[week]){
                        this.days[week] = [];
                    }
                    this.days[week].push({
                        dayNum: i,
                        dayWeek: new Date(this.selectedYear,this.selectedMonth,i).getDay()
                    })
                }
            }
        },
        formatFirstWeek: function(){
            for(var i = this.days[0].length; i != 0 && i < 7; i++){
                this.days[0].unshift({
                    dayNum: undefined, 
                    dayWeek: i
                });
            }
        },
        changeFormat() {
            if(this.firstDay == 0){
                localStorage.setItem("firstDay", 1);
                this.firstDay = localStorage.getItem("firstDay");
                localStorage.setItem("weekFormat", "RU");
                this.weekFormat = localStorage.getItem("weekFormat");
                this.weekFormat = "RU";
            } else {
                localStorage.setItem("firstDay", 0);
                this.firstDay = localStorage.getItem("firstDay");
                localStorage.setItem("weekFormat", "USA");
                this.weekFormat = localStorage.getItem("weekFormat");
            }
            this.getMonthesDays();
        },
        changeTimeFormat() {
            if(this.timeFormat == 24)
            {
                this.timeFormat = 12;
                localStorage.setItem("timeFormat", 12);
            } else {
                localStorage.setItem("timeFormat", 24);
                this.timeFormat = 24;
            }
            this.getEvents();
        },
        getEvents: function() {
            // fetch('api/events/' + this.$route.params.id + '/' + this.selectedYear + '/' + (this.selectedMonth + 1), 
            fetch('http://booker.loc/Server/app/api/events/' + this.$route.params.id + '/' + this.selectedYear + '/' + (this.selectedMonth + 1), 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/' + this.$route.params.id + '/' + this.selectedYear + '/' + (this.selectedMonth + 1),
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case "success":
                        if(Array.isArray(res.data)) {
                            res.data.forEach(element => {
                                element.startEvent += "000";
                                element.endEvent += "000";
                                element.createdEvent += "000";

                                if (this.timeFormat == 24) {
                                    element.startHour = new Date(+element.startEvent).getHours();
                                    element.startMinutes = new Date(+element.startEvent).getMinutes();
                                    if (element.startMinutes == 0) {
                                        element.startMinutes = "00";
                                    }
                                    element.endHour = new Date(+element.endEvent).getHours();
                                    element.endMinutes = new Date(+element.endEvent).getMinutes();
                                    if (element.endMinutes == 0) {
                                        element.endMinutes = "00";
                                    }
                                } else {
                                    element.startHour = new Date(+element.startEvent).getHours();
                                    element.startMinutes = new Date(+element.startEvent).getMinutes();
                                    element.ampmStart = element.startHour >= 12 ? 'pm' : 'am';
                                    element.startHour = element.startHour % 12;
                                    element.startHour = element.startHour ? element.startHour : 12;
                                    element.startMinutes = new Date(+element.startEvent).getMinutes();
                                    if (element.startMinutes == 0) {
                                        element.startMinutes = "00";
                                    }

                                    element.endHour = new Date(+element.endEvent).getHours();
                                    element.endMinutes = new Date(+element.endEvent).getMinutes();
                                    element.ampmEnd = element.endHour >= 12 ? 'pm' : 'am';
                                    element.endHour = element.endHour % 12;
                                    element.endHour = element.endHour ? element.endHour : 12;
                                    element.endMinutes = new Date(+element.endEvent).getMinutes();
                                    if (element.endMinutes == 0) {
                                        element.endMinutes = "00";
                                    }
                                }
                            });
                        }
                        this.events = res.data;
                        break;
                    default:
                        this.status = {
                            variant: 'danger',
                            msg: 'Cannot get events'
                        }
                        break;
                }
            });
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
        deleteEvent: function(all) {
            if(localStorage.getItem("role") == 1)
            {
                this.checkAdmin();
            } else {

                if(this.events[this.selectedEvent].user_id != localStorage.getItem("id")) {
                    this.status = {
                        variant: "danger",
                        msg: "You cannot delete this event cause it doesn't belong to you"
                    }
                    this.$bvModal.hide('delete-modal');
                    return;
                }
            }

            if (all) {

                if(this.events[this.selectedEvent].parent != null)
                {
                    var eventId = this.events[this.selectedEvent].parent;
                } else {
                    var eventId = this.events[this.selectedEvent].id;
                }

                // fetch('api/events/' + eventId + '/all/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
                fetch('http://booker.loc/Server/app/api/events/' + eventId + '/all/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"),
                // fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/' + eventId + '/all/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"),
                {method: "DELETE"})
                .then((response) => response.json())
                .then((res) => {
                    switch (res.status) {
                        case 'success':
                            this.setStatus({variant: 'success', msg: "Booking has been deleted"});
                            break;

                        case 'err_valid':
                            this.setStatus({variant: 'warning', msg: "Something going wrong. Try again"});
                            break;
                            
                        case 'err_login':
                            localStorage.clear();
                            location.reload();
                            break;
                            
                        case 'err_operation':
                            this.setStatus({variant: 'warning', msg: "Something going wrong. Try again"});
                            break;

                        default: 
                            this.setStatus({variant: 'danger', msg: "Something going wrong. Try again"})
                            break;
                    }
                });
            } else {
                // fetch('api/events/', 
                fetch('http://booker.loc/Server/app/api/events/' + this.events[this.selectedEvent].id + '/single/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"),
                // fetch('http://192.168.0.15/~user6/booker/Server/app/api/events/',
                {method: "DELETE"})
                .then((response) => response.json())
                .then((res) => {
                    switch (res.status) {
                        case 'success':
                            this.setStatus({variant: 'success', msg: "Booking has been deleted"});
                            break;

                        case 'err_valid':
                            this.setStatus({variant: 'warning', msg: "Something going wrong. Try again"});
                            break;
                            
                        case 'err_login':
                            localStorage.clear();
                            location.reload();
                            break;
                            
                        case 'err_operation':
                            this.setStatus({variant: 'warning', msg: "Something going wrong. Try again"});
                            break;

                        default: 
                            this.setStatus({variant: 'danger', msg: "Something going wrong. Try again"})
                            break;
                    }
                });
            }
            this.getEvents();
            this.$bvModal.hide('delete-modal');
        }
    },

    
    computed: {
        setDefaultVals: function(){
            
        },
        monthYear: function(){
            this.days = [];
            if(void 0 === this.selectedMonth)
            {
                this.selectedMonth = this.currentMonth();
            }
            if (void 0 === this.selectedYear){
                this.selectedYear = this.currentYear();
            }
            return this.monthes[this.selectedMonth] + " " + this.selectedYear;
        },
        week(){
            if(this.firstDay == 0){
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            } else {
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        }
    },
    watch: {
        selectedMonth: function(val, oldVal) {
            this.getEvents();
            this.selectedEvent = undefined;
        },
        room: function(val, oldVal) {
            this.getEvents();
        }
    },
    created: function() {
        let first = localStorage.getItem("firstDay");
        let format = localStorage.getItem("weekFormat");
        if (first != undefined && format !=undefined)
        {
            this.firstDay = first;
            this.weekFormat = format;
        }
    },
    mounted: function() {
        this.getFirstWeekDay();
        this.getLastWeekDay();
        this.getLastDay();
        this.getMonthesDays();
        this.formatFirstWeek();
        localStorage.setItem("timeFormat", 24)
    },
    beforeUpdate: function() {
        // console.log('updating');
        this.getFirstWeekDay();
        this.getLastWeekDay();
        this.getLastDay();
        this.getMonthesDays();
        this.formatFirstWeek();
    }
}
</script>

<style>
.btn-switch{
    min-width: 50px;
}

#calendar2 {
  width: 100%;
  line-height: 1.2em;
  font-size: 15px;
  text-align: center;
}

#calendar2 tbody td {
    height: 118px;
    width: 118px;
    /* max-width: 118px; */
    font-size: 18px;
    text-align: left;
}

.week-days td {
    height: 40px!important;
    font-weight: 700;
    text-align: center!important;

}

.event-badge {
    background-color: #007bff;
    color: white;
    border-radius: .25rem;
    cursor: pointer;
}

.event-badge:hover {
    background-color: rgba(0, 140, 255, 1)!important;
    color: white!important;
}

#calendar2 thead tr:last-child {
  /* font-size: small; */
  color: rgb(85, 85, 85);
}
#calendar2 thead tr:nth-child(1) td:nth-child(2) {
  color: rgb(50, 50, 50);
}
#calendar2 thead tr:nth-child(1) td:nth-child(1):hover, #calendar2 thead tr:nth-child(1) td:nth-child(3):hover {
  cursor: pointer;
}
#calendar2 tbody td {
  color: rgb(44, 86, 122);
}
#calendar2 tbody td:nth-child(n+6), #calendar2 .holiday {
  color: rgb(231, 140, 92);
}
#calendar2 tbody td.today {
  background: rgb(220, 0, 0);
  color: #fff;
}
</style>