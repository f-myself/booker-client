<template>
    <div style="margin-bottom: 20px;">
        <b-navbar toggleable="lg" type="dark" variant="primary" class="my-navbar">
            <b-navbar-brand to="/calendar/1" @click="changeRoom(1)">Boardroom Booker</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item-dropdown text="Calendar" class="white" left>
                    <b-dropdown-item :key="room.id" v-for="room in rooms" @click="changeRoom(room.id)" :to="'/calendar/' + room.id">{{room.name}}</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template slot="button-content" class="white">Hello, <font-awesome-icon icon="user" /> {{username}}</template>
                <b-dropdown-item @click="logout" href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: "navBar",
    data: function() {
        return {
            username: localStorage.getItem("login"),
            logoutData: {
                id: localStorage.getItem("id"),
                operation: ""
            },
            rooms: {}
        }
    },
    methods: {
        dataToParamString: function (data){
      
            this.logoutData.operation = "logout";
      
	        var string= '';
	        for(var val in data){
		        string += val + '=' + encodeURIComponent(data[val]) + '&' 
	        }
  	        return string;
        },

        logout: function(){
            localStorage.clear();
            var str = this.dataToParamString(this.logoutData);


            fetch('api/auth/', 
            // fetch('http://booker.loc/Server/app/api/auth/', 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/', 
            {method: "PUT",  body: str})
            
            location.reload();
        },
        getRooms: function() {
            fetch('api/rooms/', 
            // fetch('http://booker.loc/Server/app/api/rooms/', 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/rooms/',
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case 'success':
                        this.rooms = res.data;
                        break;

                    default:
                        break;
                }
            });
        },
        changeRoom: function(room) {
            this.$emit("changeRoom", room);
        }
    },
    created: function() {
        this.getRooms()
    }    
}
</script>
<style>
.white {
    color: yellow!important;
}
</style>
