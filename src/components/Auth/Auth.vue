<template>
    <div>
        Hello
    </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      none: ''
    }
  },
  methods: {
      test: function() {
        var formData  = new FormData();
        formData.append('login', 'user');
        formData.append('password', 'password');

        // fetch('api/auth/', 
        // fetch('http://booker.loc/Server/app/api/auth/', 
        fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/', 
        {method: "PUT",  body: JSON.stringify({login: 'user', password: 'password'})}).then((response) => {
            console.log(response);
        });
      }
  },
  created: function() {
      this.test();
  }
}
</script>