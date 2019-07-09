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

        fetch('http://booker.loc/Server/app/api/auth/', 
        {method: "PUT",  body: formData}).then((response) => {
            console.log(response);
        });
      }
  },
  created: function() {
      this.test();
  }
}
</script>