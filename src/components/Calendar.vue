<template>
    <div class="row">
        <div class="col-9">
            <table id="calendar2" class="table table-bordered">
                <thead>
                    <tr>
                        {{ setDefaultVals }}
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
                        <td :key="index" v-for="(day, index) in week">{{ day.dayNum }}</td>
                    </tr>
                </tbody>
            </table>
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
                <b-button variant="info">Employee List</b-button>
            </div>
            <div class="p-2">
                <EventForm 
                :hours-format="timeFormat"
                :current-date="date"
                />
                <!-- <b-button variant="success">Book It!</b-button> -->
            </div>
            <!-- <div class="p-2">
                <b-button variant="success" @click="testRequest">Test button!</b-button>
            </div> -->
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
    methods: {
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
            //console.log(this.days[0].length)
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
                // this.weekFormat = "USA";
            }
            this.getMonthesDays();
        },
        changeTimeFormat() {
            if(this.timeFormat == 24)
            {
                this.timeFormat = 12;
            } else {
                this.timeFormat = 24;
            }
        }
    },
    computed: {
        setDefaultVals: function(){
            this.getFirstWeekDay();
            this.getLastWeekDay();
            this.getLastDay();
            this.getMonthesDays();
            this.formatFirstWeek();
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
    created: function() {
        let first = localStorage.getItem("firstDay");
        let format = localStorage.getItem("weekFormat");
        if (first != undefined && format !=undefined)
        {
            this.firstDay = first;
            this.weekFormat = format;
        }
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
    font-size: 18px;
    text-align: left;
}

.week-days td {
    height: 40px!important;
    font-weight: 700;
    text-align: center!important;

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