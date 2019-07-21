<template>
  <div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6">
        <b-alert show class="text-center" v-model="infoBar.msg" :variant="infoBar.variant"><h4>{{infoBar.msg}}</h4></b-alert>
      </div>
      <div class="col-3"></div>
    </div>
    <div class="row">
      <div class="col-4"></div>
      <div class="col-4 text-left">
        <form @submit="signIn">
          <div class="form-group">
            <label for="LoginUsername">Username</label>
            <input type="text" class="form-control" v-model="loginForm.username" id="LoginUsername" aria-describedby="emailHelp" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label for="loginPass">Password</label>
            <input type="password" class="form-control" v-model="loginForm.password" id="loginPass" placeholder="Password" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data: function () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      infoBar: {
        msg: "You might to be looged to check events and make new bookings",
        variant: "info"
      },
    }
  },
  methods: {
    dataToParamString: function (data){
      
      this.loginForm.operation = "login";
      
	    var string= '';
	    for(let val in data){
		    string += val + '=' + encodeURIComponent(data[val]) + '&' 
	    }
  	return string;
  },
    signIn: function(event) {
      event.preventDefault();

      let str = this.dataToParamString(this.loginForm);

      // fetch('api/auth/', 
      fetch('http://booker.loc/Server/app/api/auth/', 
      // fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/', 
      {method: "PUT",  body: str})
      .then((response) => response.json())
      .then((data) => {
        switch (data.status) {
          case 'success':
            localStorage.setItem("id", data.id);
            localStorage.setItem("login", data.login);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            this.$router.push('/calendar/1');

            this.$emit("logSuc");
            break;
            
          case 'no_user':
            this.infoBar.variant = "danger";
            this.infoBar.msg = "No user with this login.";
            break;

          case 'err_password':
            this.infoBar.variant = "danger";
            this.infoBar.msg = "Wrong password.";
            break;

          default: 
            this.infoBar.variant = "danger";
            this.infoBar.msg = "Error. No user with this login/password.";
        }
      })
      .catch((error) => {
        this.infoBar.variant = "danger";
        this.infoBar.msg = "Error. Please, try again later.";
      })
    }
  }
}
</script>