Vue.component('staff-update-component', {
	data: function() {
        return {
            staff: {
                staff_code: '',
                username: '',
                staff_pin: '',
                staff_name:'',
                staff_email:'',
                contact_no:'',
                status: true,
                staff_country:'IN',
                staff_formatedphone:'',
                staff_phonenofull:'',
                staff_isvalidphone:'',
                staff_isvalidemail:''
            },
            phonenohelp:"Enter staff's valid phone in  E.g: +1 5417543010",
            emailhelp:"staff's communication email address Ex. john@gmail.com",
        }
    },
    watch: {
      'staff.contact_no': function(){
        this.debouncedCheckContactNumber()
      }
    },    
    created: function () {
        // `this` points to the vm instance
		console.log('Init Message is: ' + this.message);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
        this.debouncedCheckContactNumber = _.debounce(this.checkPhone, 500);
        this.getStaff();
    },
	methods: {
        getStaff: function() {
            var vm = this;
            var lid = sessionStorage.getItem("loginid");
            axios.get("/loyalty/staffs/staff_code/details")
            .then((response) => {
                let data = response.data;
                vm.staff.staff_code = data.staff_code;
                vm.staff.username = data.staff_name;
                // vm.staff.staff_pin = data.staff_pin;
                vm.staff.contact_no = data.staff_contact_no;
            })
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.staff.contact_no != null && vm.staff.contact_no.length > 0){
                axios.get(`generic/phonecheck/`+vm.staff.contact_no)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.staff.staff_name=response.data.staff_name;
                        vm.staff.staff_country=response.data.countrycode;
                        vm.staff.staff_formatedphone = response.data.phonenumberformat;
                        vm.staff.staff_isvalidphone = response.data.isvalidnumber;
                        vm.staff.staff_phonenofull = response.data.phonenumber;
                        // vm.checkPhoneRegistered();
                        vm.staff.staff_isvalidphone = true;
                        vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' valid to register '
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.staff.staff_formatedphone='';
                    vm.staff.staff_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter staff's valid phone in  E.g: +1 5417543010"
                vm.staff.staff_formatedphone='';
                vm.staff.staff_isvalidphone = false;
            }

        },
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
		updateStaffProfile: function(e) {
			var form = $('m_profile_staff_form');
            var vm = this;
            var lid = sessionStorage.getItem("loginid");
            e.preventDefault();

			axios.put('loyalty/staffs/staff_code/update_profile', {
                'staff_code': vm.staff.staff_code,
                'staff_name': vm.staff.username,
                'staff_contact_no': vm.staff.staff_phonenofull,
            })
			.then((response) => {
                //console.log("Profile Response ", response);
                //btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})
				// vm.showErrorMsg(form, 'success', 'profile update success!..');
			})
			.catch((error => {
				var e = error;
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("profile Error ", error);
                //btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
				// vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
			}))
		}
		
	},
	template: `	  
	<form class="m-form m-form--fit m-form--label-align-right" id="m_profile_staff_form">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>
			<div class="form-group m-form__group row">
				<div class="col-10 ml-auto">
					<h3 class="m-form__section">1. Staff Details</h3>
				</div>
			</div>                                              
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> Staff Name:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <input v-model="staff.username" type="text" name="username" id="username"  class="form-control m-input" placeholder="" value="">
                    <span class="m-form__help">Please enter staff's first and last names</span>
                </div>
            </div>                                                
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> Staff Code:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <input v-model="staff.staff_code" type="text" name="staff_code" readonly id="staff_code"  class="form-control m-input" placeholder="" value="">
                    <span class="m-form__help">Please enter staff's code</span>
                </div>
            </div> 
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text">{{staff.staff_country}}</i></span></div>
                        <input v-model="staff.contact_no" type="text" name="phone" id="contact_no" class="form-control m-input" placeholder="9876543210" value="">                                                            
                        <div class="input-group-prepend"> <span class="input-group-text">
                            <i v-if="staff.staff_isvalidphone" class="la la-check-circle-o"></i>
                            <i v-else class="la la-times-circle-o"></i>
                        </span></div>                                                                
                    </div>
                    <span class="m-form__help">{{phonenohelp}}</span>
                    
                </div>
            </div>
			<div class="form-group m-form__group row">
                <div class="offset-3 col-lg-4 col-md-9 col-sm-12">                
                    <button  v-on:click="updateStaffProfile($event)" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Update Profile</button>
                </div>				
			</div>
		</div>
	</form>
	`
})