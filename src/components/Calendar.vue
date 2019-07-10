<template>
    <div>
        <h1>Hello, <font-awesome-icon icon="user" /> {{login}} </h1>
    </div>
</template>

<script>
export default {
    name: "Calendar",
    data: function() {
        return {
            login: localStorage.getItem("login")
        }
    }
}
</script>
