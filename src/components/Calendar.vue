<template>
    <div class="row">
        <div class="col-10">
            <table id="calendar2">
                <thead>
                    <tr>
                        {{ setDefaultVals }}
                        <td @click="prevMonth">‹</td>
                        <td colspan="5">{{ monthYear }}</td>
                        <td @click="nextMonth">›</td>
                    </tr>
                    <tr>
                        <td>Mon</td>
                        <td>Tue</td>
                        <td>Wed</td>
                        <td>Thu</td>
                        <td>Fri</td>
                        <td>Sat</td>
                        <td>Sun</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="week in days">
                        <td v-for="day in week">{{ day.dayNum }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-2">
            
        </div>
    </div>
</template>

<script>
export default {
    name: "Calendar",
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
            lastWeekDay: undefined,
            days: []
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
            var week = 0;
            this.days[week] = [];
            for(var  i = 1; i <= this.lastDay; i++) {
                if(new Date(this.selectedYear,this.selectedMonth,i).getDay() != 1){
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
            for(var i = this.days[0].length; i < 7; i++){
                this.days[0].unshift({
                    dayNum: undefined, 
                    dayWeek: i
                });
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
        }
    }
}
</script>

<style>
#calendar2 {
  width: 20%;
  font: monospace;
  line-height: 1.2em;
  font-size: 15px;
  text-align: center;
}
#calendar2 thead tr:last-child {
  font-size: small;
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