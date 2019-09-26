Vue.component('password-update-component', {
	data: function() {
        return {
            message: 'Init Brand',
            errors: [],
            postBody: '',
            old_password: '',
            new_password: '',
            confirm_password: '',
            staff_type: '',
            showPasswordForm: '',
            staff_code:'',
            new_staff_pin: '',
            old_staff_pin: '',
            confirm_staff_pin: ''
        }
    },
    watch: {
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.staff_type = sessionStorage.getItem("staff_type");
        this.staff_code = sessionStorage.getItem("staff_code");
        if(this.staff_type === 'merchant') {
            this.showPasswordForm = true;
        }
        else {
            this.showPasswordForm = false;
        }
    },
	methods: {
        showErrorMsg: function(form, type, msg) {
            var alert = $('<div id="alertBox" class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');
    
            form.find('.alert').remove();
            alert.prependTo(form);

            mUtil.animateClass(alert[0], 'fadeIn animated');
			alert.find('span').html(msg);
			setTimeout(() => {
                $('#alertBox').addClass('d-none');
            }, 5000);
		},
		updatePassword: function(e) {
			
            var btn = $('#password_submit');
            var vm = this;
            e.preventDefault();
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                       
           
            if(this.showPasswordForm) {
                var form = $('#password_update_form');
                form.validate({
                    rules: {
                        old_password: {
                            required: true,
                        },
                        new_password: {
                            required: true,
                            notEqualTo: "#old_password"
                        },
                        confirm_password: {
                            required: true,
                            equalTo: "#new_password"
                        }
                    },
                    messages: {
                        new_password: " Enter Password",
                        confirm_password: " Enter Confirm Password Same as Password"
                    }
                });

                if (!form.valid()) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    return;
                } 
                
                var passwordData = {
                    old_password: vm.old_password,
                    new_password: vm.new_password
                };

                axios.put('loyalty/merchant/password', passwordData)
                .then((response) => {
                    console.log("Password Response ", response);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    this.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})                
                    // vm.showErrorMsg(form, 'success', 'Password update success!..');
                    window.location.replace("/login");
                    sessionStorage.clear();
                })
                .catch((error => {
                    var e = error;
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Password Error ", error);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                    // vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
                }))
            }
            else {
                var form = $('#pin_update_form');
                form.validate({
                    rules: {
                        old_staff_pin: {
                            required: true,
                        },
                        new_staff_pin: {
                            required: true,
                            notEqualTo: "#old_staff_pin"
                        },
                        confirm_staff_pin: {
                            required: true,
                            equalTo: "#new_staff_pin"
                        }
                    },
                    messages: {
                        new_staff_pin: "Old and New pin can't be same",
                        confirm_staff_pin: " Enter Confirm Pin Same as Password",
                        notEqualTo: "old and new pin can't be same"
                    }
                });

                if (!form.valid()) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    return;
                } 
                
                var passwordData = {
                    old_staff_pin: vm.old_staff_pin,
                    new_staff_pin: vm.new_staff_pin,
                    staff_code: this.staff_code
                };

                axios.put('loyalty/staffs/update/pin/change', passwordData)
                .then((response) => {
                    console.log("Password Response ", response);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    this.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})                
                    // vm.showErrorMsg(form, 'success', 'Password update success!..');
                    window.location.replace("/login");
                    sessionStorage.clear();
                })
                .catch((error => {
                    var e = error;
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Password Error ", error);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                    // vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
                }))
            }
            
		}
		
	},
	template: `	  
	<form v-if="showPasswordForm" class="m-form m-form--fit m-form--label-align-right" id="password_update_form">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Old Password</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="password" v-model="old_password" id="old_password" name="old_password" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">New Password</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="password" v-model="new_password" id="new_password" name="new_password" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Confirm Password</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<input type="password" v-model="confirm_password" id="confirm_password" name="confirm_password" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
                <div class="offset-3 col-lg-4 col-md-9 col-sm-12">                
                    <button id="password_submit" v-on:click="updatePassword($event)" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Update Password</button>
                </div>				
			</div>
		</div>
    </form>
    
    <form v-else class="m-form m-form--fit m-form--label-align-right" id="pin_update_form">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Old pin</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="password" :maxlength="6" :minlength="6" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" v-model="old_staff_pin" id="old_staff_pin" name="old_staff_pin" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">New pin</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="password" :maxlength="6" :minlength="6" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" v-model="new_staff_pin" id="new_staff_pin" name="new_staff_pin" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Confirm pin</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<input type="password" :maxlength="6" :minlength="6" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" v-model="confirm_staff_pin" id="confirm_staff_pin" name="confirm_staff_pin" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
                <div class="offset-3 col-lg-4 col-md-9 col-sm-12">                
                    <button id="password_submit" v-on:click="updatePassword($event)" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Save</button>
                </div>				
			</div>
		</div>
	</form>
	`
})