<template>
    <div style="margin-bottom: 20px;">
        <b-navbar toggleable="lg" type="dark" variant="primary" class="my-navbar">
            <b-navbar-brand><router-link to="/calendar" style="color: white; text-decoration: none;">Boardroom Booker</router-link></b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item-dropdown text="Boardroom" class="white" left>
                    
                    <b-dropdown-item href="#">Boardroom #1</b-dropdown-item>
                    <b-dropdown-item href="#">Boardroom #2</b-dropdown-item>
                    <b-dropdown-item href="#">Boardroom #3</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template slot="button-content" class="white">Hello, <font-awesome-icon icon="user" /> {{username}}</template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item @click="logout" href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: "adminBar",
    data: () => {
        return {
            username: localStorage.getItem("login"),
            logoutData: {
                id: localStorage.getItem("id"),
                operation: ""
            }
        }
    },
    methods: {
        dataToParamString: function (data){
      
            this.logoutData.operation = "logout";
      
	        var string= '';
	        for(let val in data){
		        string += val + '=' + encodeURIComponent(data[val]) + '&' 
	        }
  	        return string;
        },

        logout: function(){
            localStorage.clear();
            let str = this.dataToParamString(this.logoutData);


            // fetch('api/auth/', 
            fetch('http://booker.loc/Server/app/api/auth/', 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/', 
            {method: "PUT",  body: str})
            
            location.reload();
        }
    }
    
}
</script>
<style>
.white {
    color: yellow!important;
}
</style>
