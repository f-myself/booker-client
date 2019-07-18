<template>
    <div>
        {{status}}
        <!-- <h1> hello, {{id}}</h1> -->
        <p v-if="showEvent">{{eventData}}</p>
    </div>
</template>

<script>
export default {
    name: "EditEvent",
    data: function() {
        return {
            status: "",
            eventData: {},
            showEvent: false,
            formData: {

            },
        }
    },
    methods: {
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
            return result.promiseValue;
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
                        if(res.data.user_id == localStorage.getItem("id") || localStorage.getItem("role") == 1) {
                            this.eventData = res.data;
                            this.showEvent = true;
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
        }
    },
    created: function() {
        if(localStorage.getItem("role") == 1) {
            this.checkAdmin()
        }
        this.getEvent()
    }
}
</script>
