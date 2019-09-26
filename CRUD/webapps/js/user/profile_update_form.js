Vue.component('profile-update-component', {
    props:['profiledata'],
	data: function() {
        return {
            message: 'Init Profile',
            errors: [],
			postBody: '',
			given_name:'',
			sur_name: '',
			business_name: '',
			business_type: '',
			registration_no: '',
			contact_person: '',
			contact_no: '',
			business_desc: '',
			business_url: '',
			business_address: '',
			eos_account_name: '',
			earning_mechanics: '',
			email: '',
			mobile: '',
			city: '',
			country: '',
			country_code: 'IN',
			time_zone: '',
            formatedphone:'',
            phonenofull:'',
            isvalidphone:'',
            phonenohelp:"Enter merchant's valid phone in  E.g: +1 5417543010",
            contact_country_code: 'IN',
            formatedcontact:'',
            contactnofull:'',
            isvalidcontact:'',
            contacthelp:"Enter merchant's valid phone in  E.g: +1 5417543010",
            countryList : '',
			bannerurl: '',
			newBannerImage: '',
			showEditProfile: false,
			industryList: [],
			timeZoneList: [],
        }
    },
    watch: {
        'mobile': function(){
            this.debouncedCheckNumber()
        }, 
        'contact_no': function(){
        this.debouncedCheckContactNumber()
        },
      
    },    
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.getProfile();
        this.getUtils();
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
        this.debouncedCheckContactNumber = _.debounce(this.checkContact, 500);
    },
	methods: {       
        getUtils: function() {
			var vm = this;
            axios.get('/loyalty/utils/COUNTRY')
            .then((response) => {
                var data = response.data;
                this.countryList = data.details;

			})
			
			axios.get('/loyalty/utils/INDUSTRY')
            .then((response) => {
                var data = response.data;
                this.industryList = data.details;

			})

			axios.get('/loyalty/utils/TIMEZONE')
            .then((response) => {
				var data = response.data.details;
				data.forEach(timezone => {
					vm.timeZoneList.push({
						lookup_name: timezone.lookup_name,
						lookup_display_name: timezone.lookup_display_name[0]
					})
				})
                

            })
        },
        getProfile: function() {
			var vm = this;
            axios.get('/loyalty/merchant/profile/details')
            .then((response) => {
				
				var data = response.data;
				vm.name = data.given_name+ ' '+ data.sur_name;
				vm.given_name = data.given_name;
				vm.sur_name = data.sur_name;
				vm.business_name = data.business_name;
				vm.business_type = data.business_type;
				vm.registration_no = data.registration_no;
				vm.contact_person = data.contact_person;
				vm.contact_no = data.contact_no;
				vm.country_code = vm.country_code;
				vm.business_desc = data.business_desc;
				vm.business_url = data.business_url;
				vm.business_address = data.business_address;
				vm.eos_account_name = data.eos_account_name;
				vm.earning_mechanics = data.earning_mechanics;
				vm.email = data.email;
				vm.mobile = data.mobile;
				vm.city = data.city;
				vm.country = data.country;
				vm.time_zone = data.time_zone;
				vm.contactnofull = data.contact_no;
				vm.phonenofull = data.mobile;
				vm.bannerurl = data.bannerurl; 
				console.log("Profile Response ", vm.bannerurl);
				var bannerImage = new Image();
				bannerImage.src = this.bannerurl;
				bannerImage.onerror = function() {
					console.log("error ", vm.newBannerImage);
					vm.newBannerImage = true;
				}
				bannerImage.onload = function() { console.log("success ", vm.newBannerImage); vm.newBannerImage = false; };
            })
            .catch((error) => {
				console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })
		},
        checkContact:  function () {
            var vm = this;
            if(vm.contact_no != null && vm.contact_no.length > 0){
                axios.get(`generic/phonecheck/`+vm.contact_no)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.formatedcontact = response.data.phonenumberformat;
                        vm.isvalidcontact = response.data.isvalidnumber;
                        vm.contactnofull = response.data.contactnofull;
                })
                .catch(function (error) {
                    vm.contacthelp = 'Error! Could not reach the API. ' + error
                    vm.formatedcontact='';
                    vm.isvalidcontact = false;
                })
            }else{
                vm.contacthelp = "Enter merchant's valid phone in  E.g: +1 5417543010"
                vm.formatedcontact='';
                vm.isvalidcontact = false;
            }

        },
        checkPhone:  function () {
            var vm = this;
            if(vm.mobile != null && vm.mobile.length > 0){
                axios.get(`generic/phonecheck/`+vm.mobile)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.formatedphone = response.data.phonenumberformat;
                        vm.isvalidphone = response.data.isvalidnumber;
                        vm.phonenofull = response.data.phonenumber;
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.formatedphone='';
                    vm.isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter merchant's valid phone in  E.g: +1 5417543010"
                vm.formatedphone='';
                vm.isvalidphone = false;
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
		updateProfile: function(e) {
			var form = $('m_profile_form');
            var btn = $('#profile_submit');
			var vm = this;
            e.preventDefault();
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			var profileData = {
				given_name: vm.given_name,
				sur_name: vm.sur_name,
				business_name: vm.business_name,
				business_type: vm.business_type,
				registration_no: vm.registration_no,
				contact_person: vm.contact_person,
				contact_no: vm.contactnofull,
				business_desc: vm.business_desc,
				business_url: vm.business_url,
				earning_mechanics: vm.earning_mechanics,
				business_address: vm.business_address,
				eos_account_name: vm.eos_account_name,
				email: vm.email,
				time_zone: vm.time_zone,
				mobile: vm.phonenofull,
				country_code: vm.country_code,
				city: vm.city,
				country: vm.country
            };
            if(vm.business_url !== '') {
				form.validate({
					rules: {
						business_url: {
							required: true
						}
					},
					messages: {
						business_url: 'Please Enter Valid URL Ex: http://example.com'
					}
                })
                
                if(!form.valid()) {
                    return;
                }
			}

			axios.put('loyalty/merchant', profileData)
			.then((response) => {
                console.log("Profile Response ", response);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})
				// vm.showErrorMsg(form, 'success', 'profile update success!..');
			})
			.catch((error) => {
				var e = error;
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("profile Error ", error);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
				// vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
			})
		}
		
	},
	template: `	  
	<form class="m-form m-form--fit m-form--label-align-right" id="m_profile_form">    
        <div class="m-portlet__body">
            <div class="form-group m-form__group m--margin-top-10 m--hide">
                <div class="alert m-alert m-alert--default" role="alert">
                    The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-10 ml-auto">
                    <h3 class="m-form__section">1. Business Details</h3>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Name:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <input type="text" v-model="business_name" name="business_name" class="form-control m-input">
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Industry Type:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">                
                    <select v-model="business_type" class="form-control m-input" id="m_select2_1" name="business_type">
                        <option v-for="industry in industryList" :value="industry.lookup_name">{{industry.lookup_name}}</option>
                    </select>	
                    <!-- <input type="text" v-model="business_type" name="business_type" class="form-control m-input"> -->
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Earning Mechanics:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <input type="text" v-model="earning_mechanics" name="earning_mechanics" class="form-control m-input">
                <span class="m-form__help">Points earnings methods for customer's</span>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Description:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <textarea type="text" :maxlength="256" v-model="business_desc" name="business_desc" class="form-control m-input"></textarea>
                </div>
            </div>

            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Time Zone:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">					               
                    <select v-model="time_zone" class="form-control m-input" id="m_select2_1" name="time_zone">
                        <option v-for="time in timeZoneList" :value="time.lookup_display_name">{{time.lookup_name}}</option>
                    </select>	
                </div>
            </div>                         
            
            <div class="form-group m-form__group row">
                <div class="col-10 ml-auto">
                    <h3 class="m-form__section">2. Business Contact Details</h3>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Website </label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <input class="form-control m-input" type="url"  value="" name="business_url" id="business_url" v-model="business_url">
                    <span class="m-form__help">Please Enter Valid URL Ex: http://example.com</span>
                </div>
            </div> 			
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Email:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <input type="text" v-model="email" readonly name="email" class="form-control m-input">
                </div>
            </div> 
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Contact Person:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <input type="text" v-model="contact_person" name="contact_person" class="form-control m-input">
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Contact Number</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text">{{contact_country_code}}</i></span></div>
                        <input type="text" v-model="contact_no" name="contact_no" class="form-control m-input">                                                          
                        <div class="input-group-prepend"> <span class="input-group-text">
                            <i v-if="isvalidcontact" class="la la-check-circle-o"></i>
                            <i v-else class="la la-times-circle-o"></i>
                        </span></div>                                                                
                    </div>
                    <span class="m-form__help">{{contacthelp}}</span>                    
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-10 ml-auto">
                    <h3 class="m-form__section">3. Business Communication Address Details</h3>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Business Communication Address:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <textarea type="text" v-model="business_address" name="business_address" class="form-control m-input"></textarea>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">City:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                <input type="text" v-model="city" name="city" class="form-control m-input">
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-form-label col-lg-3 col-sm-12">Country:</label>
                <div class="col-lg-4 col-md-9 col-sm-12">                
                    <select v-model="country" class="form-control m-input" id="m_select2_1" name="country">
                        <option v-for="country in countryList" :value="country.lookup_name">{{country.lookup_name}}</option>
                    </select>				
                </div>
            </div>
        </div>
	</form>
	`
})