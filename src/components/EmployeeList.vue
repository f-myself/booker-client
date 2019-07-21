<template>
    <div>
        <div class="row">
            <div class="col-12">
                <b-alert show class="text-center" :variant="status.variant" v-if="status.msg">
                    <h4>{{status.msg}}</h4>
                </b-alert>
            </div>
        </div>
        <div class="row" v-if="showList">
            <div class="col-2"></div>
            <div class="col-8">
                <table class="table table-striped text-left">
                    <thead>
                        <tr>
                        <th scope="col">Name</th>
                        <th scope="col" class="text-right actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="index" v-for="(user, index) in users">
                        <td>
                            <a :href="'mailto:' + user.email">
                                {{user.name}}
                            </a>
                        </td>
                        <td class="text-right actions">
                            <button type="button" @click="selectUser(index)" class="btn btn-outline-danger mr-1" v-b-modal.modal-delete>
                                Delete
                            </button>
                            <button type="button" @click="selectUser(index)" class="btn btn-primary ml-1" v-b-modal.modal-update>
                                Update
                            </button>
                        </td>
                        </tr>
                    </tbody>
                </table>
                    <button type="button" class="btn btn-primary ml-1" v-b-modal.add-modal>
                        Add user
                    </button>
                <b-modal 
                    id="modal-update"
                    title="Update User"
                    hide-footer
                    @hidden="resetUpdate"
                    v-if="selectedUser != undefined"
                >
                    <b-alert show class="text-center" :variant="updateError.variant" v-if="updateError.msg">
                        <h4>{{updateError.msg}}</h4>
                    </b-alert>
                    <form>
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" v-model="updateForm.email" id="email" aria-describedby="emailHelp" placeholder="email@mail.com" required>
                        </div>
                        <div class="form-group">
                            <label for="username">Name</label>
                            <input type="text" class="form-control" v-model="updateForm.name" id="username" placeholder="User name" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Select role</label>
                            <select class="form-control" v-model="updateForm.role" id="role">
                                <option selected disabled>Select role</option>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </select>
                        </div>
                        <div class="custom-control custom-switch pb-2">
                            <input type="checkbox" v-model="updateForm.passRestore" class="custom-control-input" @click="switchPassRestore" name="pass-restore" id="pass-restore">
                            <label class="custom-control-label" for="pass-restore">Restore pass?</label>
                        </div>
                        <div v-if="updateForm.passRestore">
                            <div class="form-group">
                                <label for="newPassword">New password</label>
                                <input type="password" v-model="updateForm.newPassword" class="form-control" id="newPassword" placeholder="Password" required>
                            </div>
                            <div class="form-group">
                                <label for="rePassword">Repeat Password</label>
                                <input type="password" v-model="updateForm.rePassword" class="form-control" id="rePassword" placeholder="Password" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary float-right" @click="validateUpdate">
                            Submit
                        </button>
                    </form>
                </b-modal>
                <b-modal 
                    id="add-modal" 
                    title="Add User"
                    hide-footer
                    @hidden="resetAdd"
                >
                    <b-alert show class="text-center" :variant="addError.variant" v-if="addError.msg">
                        <h4>{{addError.msg}}</h4>
                    </b-alert>
                    <form>
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" v-model="addForm.email" id="email" aria-describedby="emailHelp" placeholder="email@mail.com" required>
                        </div>
                        <div class="form-group">
                            <label for="username">Name</label>
                            <input type="text" class="form-control" v-model="addForm.name" id="username" placeholder="User name" required>
                        </div>
                        <div class="form-group">
                            <label for="login">Login</label>
                            <input type="text" class="form-control" v-model="addForm.login" id="login" placeholder="login" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Select role</label>
                            <select class="form-control" v-model="addForm.role" id="role">
                                <option selected disabled>Select role</option>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Password</label>
                            <input type="password" v-model="addForm.password" class="form-control" id="newPassword" placeholder="Password" required>
                        </div>
                        <div class="form-group">
                            <label for="rePassword">Repeat Password</label>
                            <input type="password" v-model="addForm.rePassword" class="form-control" id="rePassword" placeholder="Password" required>
                        </div>
                        <button type="submit" class="btn btn-primary float-right" @click="validateAdd">
                            Submit
                        </button>
                    </form>
                </b-modal>
                <b-modal 
                    id="modal-delete" 
                    title="Delete user"
                    hide-footer
                    @hidden="getUsers"
                    v-if="selectedUser != undefined"
                >
                    <p>Are you sure you want to delete this user?</p>

                    <div class="modal-footer">
                        <button type="button" @click="$bvModal.hide('modal-delete')" class="btn btn-outline-secondary float-right">Cancel</button>
                        <button type="button" @click="deleteUser" class="btn btn-danger float-right">Delete</button>
                    </div>
                </b-modal>
            </div>
            <div class="col-2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "EmployeeList",
    data: function() {
        return {
            status: {
                variant: 'danger',
                msg: '',
            },
            showList: false,
            users: [],
            selectedUser: undefined,
            updateError: {
                variant: "danger",
                msg: ""
            },
            addError: {
                variant: "danger",
                msg: ""
            },
            modalAddShow: false,
            updateForm: {
                name: undefined,
                email: undefined,
                passRestore: false,
                role: "Select role",
                newPassword: "",
                rePassword: ""
            },
            addForm: {
                name: "",
                email: "",
                login: "",
                role: "Select role",
                password: "",
                rePassword: "",
            }
        }
    },
    methods: {
        switchPassRestore: function() {
            if(this.updateForm.passRestore == false) {
                this.updateForm.passRestore = true;
            } else {
                this.updateForm.passRestore = false;
            }
        },
        dataToParamString: function (data){
                var string= '';
                for(let val in data){
                    string += val + '=' + encodeURIComponent(data[val]) + '&' 
                }
            return string;
        },
        selectUser: function(id) {
            this.selectedUser = id;
            this.updateForm.name = this.users[id].name;
            this.updateForm.email = this.users[id].email;
        },
        resetUpdate: function() {
            this.updateForm = {
                passRestore: false,
                role: "Select role",
                newPassword: "",
                rePassword: ""
            },
            this.updateError = {
                variant: "danger",
                msg: ""
            };
            this.selectedUser = undefined;
            this.getUsers();
        },
        validateUpdate: function(event) {
            event.preventDefault();

            if(this.updateForm.name.length <= 0) {
                this.updateError.msg = "Username is required!";
                return;
            }

            if(this.updateForm.email.length <= 0) {
                this.updateError.msg = "Email is required!";
                return;
            }

            if(isNaN(this.updateForm.role)) {
                this.updateError.msg = "Please, select new role!";
                return;
            }

            if(this.updateForm.passRestore) {
                if(!this.updateForm.newPassword || !this.updateForm.rePassword) {
                    this.updateError.msg = "Passwords are required! Disable the pass-restoring to cancel operation.";
                    return;
                }

                if(this.updateForm.newPassword != this.updateForm.rePassword) {
                    this.updateError.msg = "Passwords do not match!";
                    return;
                }
            }

            var updateData = {
                id: this.users[this.selectedUser].id,
                email: this.updateForm.email,
                name: this.updateForm.name,
                role: this.updateForm.role,
                passRestore: this.updateForm.passRestore,
                newPass: this.updateForm.newPassword,
                rePass: this.updateForm.rePassword,
                userId: localStorage.getItem("id"),
                token: localStorage.getItem("token"),
            }

            var dataToSend = this.dataToParamString(updateData);

            // fetch('api/admin/', 
            fetch('http://booker.loc/Server/app/api/admin/', 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/', 
            {method: "PUT", body: dataToSend})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case 'success':
                        this.status.variant = "success";
                        this.status.msg = "Thanks, new user has been added";
                        break;

                    case 'err_valid':
                        this.status.variant = "danger";
                        this.status.msg = "Invalid inputs. Try again";
                        break;

                    case 'err_login':
                        localStorage.clear();
                        location.reload();
                        break;
                    
                    case 'err_exists':
                        this.status.variant = "danger";
                        this.status.msg = "Sorry, but user with this login or email already exists";
                        break;

                    case 'err_password':
                        this.status.variant = "danger";
                        this.status.msg = "Sorry, but passwords do not match";
                        break;
                    
                    default:
                        this.status.variant = "danger";
                        this.status.msg = "Error. Try again later";
                        break;
                }
            });

            this.$bvModal.hide('modal-update');
        },
        submitUpdate: function() {

        },
        validateAdd: function(event) {
            event.preventDefault();

            if(this.addForm.email.length <= 0) {
                this.addError.msg = "Email is required!";
                return;
            }
            
            if(this.addForm.name.length <= 0) {
                this.addError.msg = "Username is required!";
                return;
            }

            if(this.addForm.login.length <= 0) {
                this.addError.msg = "Login is required!";
                return;
            }

            if(isNaN(this.addForm.role)) {
                this.addError.msg = "Please, select new role!";
                return;
            }

            if(!this.addForm.password || !this.addForm.rePassword) {
                this.addError.msg = "Passwords are required! Disable the pass-restoring to cancel operation.";
                return;
            }

            if(this.addForm.password != this.addForm.rePassword) {
                this.addError.msg = "Passwords do not match!";
                return;
            }

            var addFormData = new FormData();
            for(var name in this.addForm) {
                addFormData.append(name, this.addForm[name]);
            }
            addFormData.append("userId", localStorage.getItem("id"));
            addFormData.append("token", localStorage.getItem("token"));


            // fetch('api/admin/', 
            fetch('http://booker.loc/Server/app/api/admin/', 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/', 
            {method: "POST", body: addFormData})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case 'success':
                        this.status.variant = "success";
                        this.status.msg = "Thanks, new user has been added";
                        break;

                    case 'err_valid':
                        this.status.variant = "danger";
                        this.status.msg = "Invalid inputs. Try again";
                        break;

                    case 'err_login':
                        localStorage.clear();
                        location.reload();
                        break;
                    
                    case 'err_exists':
                        this.status.variant = "danger";
                        this.status.msg = "Sorry, but user with this login or email already exists";
                        break;

                    case 'err_password':
                        this.status.variant = "danger";
                        this.status.msg = "Sorry, but passwords do not match";
                        break;
                    
                    default:
                        this.status.variant = "danger";
                        this.status.msg = "Error. Try again later";
                        break;
                }
            });

            this.$bvModal.hide('add-modal');
        },
        resetAdd: function() {
            this.addForm = {
                name: "",
                email: "",
                login: "",
                role: "Select role",
                password: "",
                rePassword: ""
            }
            this.getUsers();
        },
        deleteUser: function() {
            var userId = this.users[this.selectedUser].id;
            // fetch('api/admin/' + userId + '/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            fetch('http://booker.loc/Server/app/api/admin/' + userId + '/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"),
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/' + userId + '/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"),
            {method: "DELETE"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                    case 'success':
                        this.status.variant = "success";
                        this.status.msg = "Thanks. User and the events were successfully deleted!";
                        break;

                    case 'err_valid':
                        localStorage.clear();
                        location.reload();
                        break;
                        
                    case 'err_login':
                        localStorage.clear();
                        location.reload();
                        break;

                    default: 
                        this.status.variant = "danger";
                        this.status.msg = "Something going wrong. Try again";
                        break;
                }
            });
            this.$bvModal.hide('modal-delete');
        },
        checkAdmin: function() {
            // fetch('api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            fetch('http://booker.loc/Server/app/api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/auth/' + localStorage.getItem("id") + '/' + localStorage.getItem("token"), 
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {

                    case 'success':
                        this.showList = true;
                        break;
                        
                    default: 
                        localStorage.clear();
                        location.reload();
                        break;
                }
            })
        },
        getUsers: function() {
            let id = localStorage.getItem("id");
            let token = localStorage.getItem("token");
            // fetch('api/admin/' + id + '/' + token, 
            fetch('http://booker.loc/Server/app/api/admin/' + id + '/' + token, 
            // fetch('http://192.168.0.15/~user6/booker/Server/app/api/admin/' + id + '/' + token,
            {method: "GET"})
            .then((response) => response.json())
            .then((res) => {
                switch (res.status) {
                case "success":
                    this.users = res.data;
                    break;
                default:
                    localStorage.clear();
                    location.reload();
                    break;
                }
            });
        }
    },
    created: function() {
        if (localStorage.getItem("role") == 1) {
            this.checkAdmin();
            this.getUsers();
        } else {
            this.status.msg = "Only admins can check employee list";
        }

        // this.getUsers();
    },
    mounted: function() {

    }
}
</script>

<style>
.actions {
    width: 200px!important;
}
</style>
