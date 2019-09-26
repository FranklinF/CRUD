Vue.component('settings-component', {
	data: function() {
		return {
			imageurl: '',
			name: '',
			email: ''
		}
	},
    created: function () {
        // `this` points to the vm instance
		console.log('Init Message is: ' + this.message);
		this.getProfile();
	  },
	methods: {
		getProfile: function() {
			var vm = this;
            axios.get('/loyalty/merchant/profile/details')
            .then((response) => {
				console.log("Profile Response ", response.data);
				var data = response.data;
				vm.name = data.given_name+ ' '+ data.sur_name;
				vm.imageurl = data.imageurl;
				vm.email = data.email;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
            })
		},
	},
	template: `
	<div class="m-content">
            <div class="row">
                <!-- <div class="col-xl-3 col-lg-4">
                    <div class="m-portlet ">
                        <div class="m-portlet__body">
                            <div class="m-card-profile">
                                <div class="m-card-profile__title m--hide">
                                    Your Profile
                                </div>
                                <div class="m-card-profile__pic">
                                    <div class="m-card-profile__pic-wrapper">	
                                        <img :src="imageurl" onError="this.src ='../assets/app/media/img/users/user4.png'" alt=""/>
                                    </div>
                                </div>
                                <div class="m-card-profile__details">
                                    <span class="m-card-profile__name">{{name}}</span>
                                    <a href="" class="m-card-profile__email m-link">{{email}}</a>
                                </div>
                            </div>					
                        </div>			
                    </div>	
                </div> -->
                <div class="col-xl-12 col-lg-12">
                    <div class="m-portlet m-portlet--full-height m-portlet--tabs  ">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-tools">
                                <ul class="nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary" role="tablist">
									<!-- <li class="nav-item m-tabs__item">
										<a class="nav-link m-tabs__link " data-toggle="tab" href="#m_user_profile_tab_2" role="tab">
											Brand
										</a>
									</li> -->
                                    <li class="nav-item m-tabs__item">
                                        <a class="nav-link m-tabs__link active" data-toggle="tab" href="#m_user_profile_tab_1" role="tab">
                                            <i class="flaticon-share m--hide"></i>
                                            Merchant Profile
                                        </a>
                                    </li>
                                    <li class="nav-item m-tabs__item">
                                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_user_profile_tab_3" role="tab">
                                            Settings
                                        </a>
                                    </li>
                                </ul>
                            </div>                                                           
                        </div>
                        <div class="tab-content">
                            <div class="tab-pane active" id="m_user_profile_tab_1">
                               <profile-component @profileupdate = "$emit('profileupdate', $event)"></profile-component>
                            </div>
                            <!-- <div class="tab-pane " id="m_user_profile_tab_2">
								<settings-brand-form-component
								@showtoast="$emit('showtoast', $event)"
								@brandformcancel="cancelForm()"
								@brandformsave="submitForm()"
								></settings-brand-form-component>
                            </div> -->
                            <div class="tab-pane " id="m_user_profile_tab_3">
                                <settings-management-component @showtoast="$emit('showtoast', $event)"></settings-management-component>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})





Vue.component('settings-brand-form-component', {
	props: ['brandid'],
	data: function() {
        return {
            message: 'Init Brand',
            errors: [],
            postBody: '',
			brand: {
				token_name: '',
				symbol: '',
				brand_desc: '',
				brand_url: ''
			},
			submitBtntxt: 'Create Brand',
			update: false,
			brandimg: '',
			updateBrandImg: false,
			readSymbol: false,
        }
    },
    created: function () {
        // `this` points to the vm instance
		console.log('Init Message is: ' + this.message);
		this.getToken();
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
		getToken: function() {
			var vm = this;
            axios.get('/loyalty/tokens')
            .then((response) => {
				console.log("Token Response ", response.data);
				let tokenData = [];
				tokenData = response.data.tokens;
				if(tokenData.length > 0) {
					let tokenName = tokenData[0].symbol;
					vm.submitBtntxt = "Update Brand";
					vm.update = true;
					vm.readSymbol = true;
					vm.getTokenDetails(tokenName);
				}
				else {
					vm.submitBtntxt = "Create Brand";
					vm.update = false;
					vm.readSymbol = false;
				}
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            })
		},
		getTokenDetails: function(symbol) {
			let vm = this;
			axios.get('/loyalty/tokens/'+ symbol+ '/details')
            .then((response) => {
				console.log("Token Details Response ", response.data);
				let data = response.data;
				vm.brand.token_name = data.token_name;
				vm.brand.symbol = data.symbol;
				vm.brand.brand_desc = data.brand_desc;
				vm.brand.brand_url = data.brand_url;
				vm.brandimg = data.imageurl
				var img = new Image();
				img.src = vm.brandimg;
				img.onerror = function() {
					console.log("error ", vm.updateBrandImg);
					vm.updateBrandImg = false;
				  }
				img.onload = function() { console.log("success ", vm.updateBrandImg); vm.updateBrandImg = true; }; 
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            })
		},
		uploadBrandImage: function(event) {
			console.log("Event ", event.target.files[0], this.updateBrandImg);
			let vm = this;
            var form = $('#m_form_setting_brand');
			const image = event.target.files[0];
			const reader = new FileReader();
			var fileType = image.type;
			var validImageTypes = ["image/jpeg", "image/png"];
			if ($.inArray(fileType, validImageTypes) < 0) {
				this.$emit('showtoast',{'msg':'Upload only Images ','type':'error','event':this.$event})
			   }
			else {
				reader.readAsDataURL(image);
				reader.onload = e =>{
					vm.brandimg = e.target.result;
					let rawData = vm.brandimg.split("base64,");
					if (rawData.length > 1) {
						rawData = rawData[1];
						let data = {
							filename: image.name,
							b64data: rawData,
							mimetype: image.type
						}
						if(vm.brand.symbol !== '') {
							axios.get('/loyalty/tokens/'+ vm.brand.symbol + '/images/token')
							.then((response) => {
								console.log("Response ", response.data)
							})						
							.catch(e => {
								if(e.response.status == 403) {
									window.location.replace('/login');
								}
								console.log('failure call:', e.response);
							
							})
							if(!vm.updateBrandImg) {
								
							}
							else {
								axios.put('/loyalty/tokens/'+ vm.brand.symbol + '/images/token', data).then(response => {
									console.log(response.data.status);
									this.$emit('showtoast',{'msg':'Brand Image update Success','type':'success','event':this.$event})
									// vm.showErrorMsg(form, 'success', 'brand image update Success!! ');
								})
								.catch(e => {
									if(e.response.status == 403) {
										window.location.replace('/login');
									}
									
									axios.post('/loyalty/tokens/'+ vm.brand.symbol + '/images/token', data).then(response => {
										console.log(response.data.status);
										this.$emit('showtoast',{'msg':'Brand Image upload Success','type':'success','event':this.$event})
										// vm.showErrorMsg(form, 'success', 'brand image update Success!! ');
									})
									.catch(e => {
										if(e.response.status == 403) {
											window.location.replace('/login');
										}
										console.log('failure call:', e.response.data.error_msg);
										this.$emit('showtoast',{'msg':'Brand Image upload Failed','type':'error','event':this.$event})
										// vm.showErrorMsg(form, 'danger', 'brand Image Upload failed !! ' + e.response.data.error_msg);
									})
								})
							}
						}
						else {
							vm.showErrorMsg(form, 'danger', 'Please Enter Brand Symbol');
						}
					}
					
				};
			}
			
		},
		submitForm:function(){
            var vm = this;
            var btn = $('#brand_submit');
            var form = $('#m_form_setting_brand');
            form.validate({
                rules: {
                    token_name: {
                        required: true,
                    },
                    symbol: {
                        required: true,
                    }
                }
			});
			if(vm.brand_url !== '') {
				form.validate({
					rules: {
						brand_url: {
							required: true
						}
					},
					messages: {
						brand_url: 'Please Enter Valid URL Ex: http://example.com'
					}
				})
			}
            if (!form.valid()) {
                return;
            }
			console.log(vm.brand);
			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			let tokenDetails = { 
				token_name: vm.brand.token_name,
				symbol: vm.brand.symbol.toUpperCase(),
				brand_url: vm.brand.brand_url,
				brand_desc: vm.brand.brand_desc
			 };
			 if(!vm.update) {
				axios.post(`/loyalty/tokens`, tokenDetails).then(response => {
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					// vm.getToken();
					this.$emit('showtoast',{'msg':'Brand Updated Success','type':'success','event':this.$event})
					axios.get("/loyalty/merchant/profile/details").then(response => {
						var profile = response.data;
						if(profile.price_plan !== 'free_plan') {
							axios.get('/loyalty/merchant/cards/details').then(response => {
								var cards = response.data.cards;
								if(cards.length === 0) {
									window.location.replace("/accounts");
								}
							})
							.catch(error => {
								if(error.response.status == 403) {
									window.location.replace('/login');
								}
								console.log("Card details Error ", error);
							})
						}
					})
					.catch(err => {
						if(err.response.status == 403) {
							window.location.replace('/login');
						}
						console.log("Error get profile ", err);
					})  
					
					// vm.showErrorMsg(form, 'success', 'brand create success !! ');
				})
				.catch(e => {
					if(e.response.status == 403) {
						window.location.replace('/login');
					}
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					console.log('failure call:', e.response.data.error_msg);
					this.$emit('showtoast',{'msg':'Brand Updated Failed','type':'error','event':this.$event})
					// vm.showErrorMsg(form, 'danger', 'brand create failed !! ' + e.response.data.error_msg);
				})
			 }
			 else {
				axios.put(`/loyalty/tokens/`+ vm.brand.symbol, tokenDetails).then(response => {
					console.log('Update :', response.data);
					vm.getToken();
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					this.$emit('showtoast',{'msg':'Brand Updated Success','type':'success','event':this.$event})
					// vm.showErrorMsg(form, 'success', 'brand update success !! ');
				})
				.catch(e => {
					if(e.response.status == 403) {
						window.location.replace('/login');
					}
					console.log('failure call:', e.response.data.error_msg);
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					this.$emit('showtoast',{'msg':'Brand Updated Success','type':'error','event':this.$event})
					// vm.showErrorMsg(form, 'danger', 'brand update failed !! ' + e.response.data.error_msg);
				})
			 }
            
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('brandformcancel',{'brand':this.brand,'event':this.$event})
        
        }
	},
	template: `	  
	<form class="m-form m-form--fit m-form--label-align-right" id="m_form_setting_brand">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>

			<div class="form-group m-form__group row">
				<div class="col-10 ml-auto">
					<h3 class="m-form__section">Brand Token Details</h3>
				</div>
			</div>

			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Name <i class="m-menu__link-icon flaticon-exclamation-2 infoIcon tooltipInfo"><span class="tooltiptext">Brand Name</span></i></label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input v-model="brand.token_name" class="form-control m-input" type="text" value="">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Code </label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input class="form-control m-input" type="text" :readonly="readSymbol" :maxlength="5" :minlength="3" value="" v-model="brand.symbol" v-on:input="brand.symbol = $event.target.value.toUpperCase()">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Description</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input class="form-control m-input" type="text" value="" v-model="brand.brand_desc" >
				</div>
			</div>
			<!-- <div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Brand URL</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input class="form-control m-input" type="url"  value="" name="brand_url" id="brand_url" v-model="brand.brand_url">
					<span class="m-form__help">Please Enter Valid URL Ex: http://example.com</span>
				</div>
			</div> -->                             
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Logo</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input class="form-control m-input" type="file" v-on:change="uploadBrandImage($event)">
				</div>
				<div class="offset-3 col-lg-4 col-md-9 col-sm-12">
					<div class="m-portlet ">
						<div class="m-portlet__body">
							<div class="m-card-profile">
								<div class="m-card-profile__pic">
									<div class="m-card-profile__pic-wrapper">	
										<img :src="brandimg" alt=""/>
									</div>
								</div>
							</div>					
						</div>			
					</div>
				</div>
			</div>
		</div>
		<div class="m-portlet__foot m-portlet__foot--fit">
			<div class="m-form__actions">
				<div class="row">
					<div class="col-2">
					</div>
					<div class="col-lg-4 col-md-9 col-sm-12">
						<button type="button" id="brand_submit" v-on:click="submitForm()"  class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Save</button>
					</div>
				</div>
			</div>
		</div>
	</form>
	`
})

Vue.component('settings-management-component', {
	props: ['brandid'],
	data: function() {
        return {
            message: 'Init Brand',
            errors: [],
			postBody: '',			
			customer_key: '',
			reward_method: '',
			newSetting: '',
			btnSettings: 'Add Settings'
        }
    },
    created: function () {
        // `this` points to the vm instance
		console.log('Init Message is: ' + this.message);
		this.getSettings();
	  },
	methods: {
		getSettings: function() {
			var vm = this;
            axios.get('/loyalty/merchant/settings/details')
            .then((response) => {
				this.newSetting = false;
				console.log("Settings Response ", response.data);
				var settings = response.data.loyalty;
				vm.customer_key = settings.customer_key;
				vm.reward_method = settings.reward_method;
				vm.btnSettings= 'update Settings'
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
				this.newSetting = true;
				vm.btnSettings= 'Add Settings'
            })
		},
        showToast: function(msg, type) {
			toastr.options = {
				"closeButton": false,
				"debug": false,
				"newestOnTop": false,
				"progressBar": false,
				"positionClass": "toast-top-right",
				"preventDuplicates": false,
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};
			
			toastr[type](msg);
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
		submitSettingForm:function(e){
            var vm = this;
            var btn = $('#settings_submit');
            var form = $('#m_form_settings');
            form.validate({
                rules: {
                    customer_key: {
                        required: true,
                    },
                    reward_method: {
                        required: true,
                    }
                }
            });
            if (!form.valid()) {
                return;
			}
			e.preventDefault();
			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			console.log(vm.newSetting);
			let settings = { 
				loyalty: {
					customer_key: vm.customer_key,
					reward_method: vm.reward_method
				}
			 };
			 if(vm.newSetting) {
				axios.post(`/loyalty/merchant/settings`, settings).then(response => {	
					console.log('Create :', response.data);	
					var loyalty = response.data.loyalty;
					vm.customer_key = loyalty.customer_key;
					vm.reward_method = loyalty.reward_method;
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					// this.showToast('Settings Created Success', 'success');
					this.$emit('showtoast',{'msg':'Settings Updated Success','type':'success','event':this.$event})
					// vm.showErrorMsg(form, 'success', 'brand create success !! ');
				})
				.catch(e => {
					if(e.response.status == 403) {
						window.location.replace('/login');
					}
					console.log('failure call:', e.response.data.error_msg);
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					this.$emit('showtoast',{'msg':'Settings Updated Failed','type':'error','event':this.$event})
					// this.showToast('Settings Failed '+ e.response.data.error_msg , 'error');
					// vm.showErrorMsg(form, 'danger', 'brand create failed !! ' + e.response.data.error_msg);
				})
			 }
			 else {
				axios.put(`/loyalty/merchant/settings`, settings).then(response => {
					console.log('Update :', response.data);
					var loyalty = response.data.loyalty;
					vm.customer_key = loyalty.customer_key;
					vm.reward_method = loyalty.reward_method;
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					// this.showToast('Settings Updated Success', 'success');
					this.$emit('showtoast',{'msg':'Settings Updated Success','type':'success','event':this.$event})
					// vm.showErrorMsg(form, 'success', 'brand update success !! ');
				})
				.catch(e => {
					if(e.response.status == 403) {
						window.location.replace('/login');
					}
					console.log('failure call:');
					btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
					this.$emit('showtoast',{'msg':'Settings Updated Failed','type':'error','event':this.$event})
					// this.showToast('Settings Failed '+ e.response.data.error_msg , 'error');
					// vm.showErrorMsg(form, 'danger', 'brand update failed !! ' );
				})
			 }
            
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('brandformcancel',{'brand':this.brand,'event':this.$event})
        
        }
	},
	template: `	  
	<form class="m-form m-form--fit m-form--label-align-right" id="m_form_settings">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Primary Customer Key:</label>
				<div class="col-xl-9 col-lg-9">
					<div class="m-radio-inline">
						<label class="m-radio">
						<input v-model="customer_key" value="M" type="radio"> Mobile
						<span></span>
						</label>
						<label class="m-radio">
						<input v-model="customer_key" value="E" type="radio"> E-Mail
						<span></span>
						</label>
						<label class="m-radio">
						<input v-model="customer_key" value="C" type="radio"> Customer Code
						<span></span>
						</label>
					</div>					
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12"> Loyalty Reward Method <span> <i class="fa fa-info-circle" data-container="body" data-toggle="m-tooltip" data-placement="right" title="Default Loyalty Issuing method in Mobile Application" ></i></span> :</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<div class="m-radio-inline">
						<label class="m-radio">
						<input v-model="reward_method" value="M" type="radio"> Manual
						<span></span>
						</label>
						<label class="m-radio">
						<input v-model="reward_method" value="R" type="radio"> Receipt Based
						<span></span>
						</label>
					</div>
				</div>
			</div>
			<div class="m-portlet__foot m-portlet__foot--fit">
				<div class="m-form__actions">
					<div class="row">
						<div class="col-2">
						</div>
						<div class="col-lg-4 col-md-9 col-sm-12">
							<button type="button" id="settings_submit" v-on:click="submitSettingForm($event)"  class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Save</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
	`
})

Vue.component('profile-component', {
	props: ['brandid'],
	data: function() {
        return {
            message: 'Init Brand',
            errors: [],
			postBody: '',
			name:'',
			given_name: '',
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
		// 'contact_no': function(){
		//   this.debouncedCheckContactNumber()
		// },
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
        checkContact:  function () {
            var vm = this;
            if(vm.contact_no != null && vm.contact_no.length > 0){
                axios.get(`/generic/phonecheck/`+vm.contact_no)
                .then(function (response) {
                        console.log(response)
                        vm.contact_country_code=response.data.countrycode;
                        vm.formatedcontact = response.data.phonenumberformat;
                        vm.isvalidcontact = response.data.isvalidnumber;
						vm.contactnofull = response.data.phonenumber;
						vm.contacthelp = "Valid phone - " + vm.contactnofull;
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
                axios.get(`/generic/phonecheck/`+vm.mobile)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        vm.country_code=response.data.countrycode;
                        vm.formatedphone = response.data.phonenumberformat;
                        vm.isvalidphone = response.data.isvalidnumber;
                        vm.phonenofull = response.data.phonenumber;
						console.log(vm.phonenofull);
						vm.phonenohelp = "Valid phone - " + vm.phonenofull;
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
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
            })
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
		editProfile: function(e) {
			e.preventDefault();
			// $('#m_form_settings').addClass('d-none');
			// $('#m_profile_form').removeClass('d-none')
			this.showEditProfile = true;

		},
		showProfile:  function() {
			// e.preventDefault();
			// $('#m_form_settings').removeClass('d-none');
			// $('#m_profile_form').addClass('d-none')
			this.showEditProfile = false;

		},
		updateProfile: function(e) {
			var form = $('m_profile_form');
            var btn = $('#profile_submit');
			var vm = this;
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
			}
            e.preventDefault();
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			var profileData = {
				given_name: vm.given_name,
				sur_name: vm.sur_name,
				business_name: vm.business_name,
				business_type: vm.business_type,
				registration_no: vm.registration_no,
				contact_person: vm.contact_person,
				contact_no: vm.contact_no,
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
			// console.log("profileData", profileData);

			axios.put('loyalty/merchant', profileData)
			.then((response) => {
				console.log("Profile Response ", response);
				vm.showEditProfile = false;
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
				this.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})
				this.$emit('profileupdate', this.$event)
				// vm.showErrorMsg(form, 'success', 'profile update success!..');
			})
			.catch((error) => {
				var e = error;
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("profile Error ", error);
				vm.showEditProfile = true;
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
				// vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
			})
		},
        uploadBannerImage: function(event) {
            let vm = this;
            var form = $('#profile_picture_update_form');
            var btn = $('#banner_image_submit');
			const image = event.target.files[0];
            btn.addClass('m-loader m-loader--brand');
			const reader = new FileReader();
			var fileType = image.type;
			var validImageTypes = ["image/jpeg", "image/png"];
			if ($.inArray(fileType, validImageTypes) < 0) {
				this.$emit('showtoast',{'msg':'Upload only Images ','type':'error','event':this.$event})
			   }
			else {
				reader.readAsDataURL(image);
				reader.onload = e =>{
					vm.bannerurl = e.target.result;
					let rawData = vm.bannerurl.split("base64,");
					if (rawData.length > 1) {
						rawData = rawData[1];
						let data = {
							filename: image.name,
							b64data: rawData,
							mimetype: image.type
						}

						if(this.newBannerImage) {
							
						}
						else {

							axios.put('/loyalty/merchant/images/banner', data)
							.then((response) => {
								btn.removeClass('m-loader m-loader--brand');
								this.$emit('showtoast',{'msg':'Profile Banner Image Updated Success','type':'success','event':this.$event})
								// vm.showErrorMsg(form, 'success', 'Profile banner update Success!! ');
							})
							.catch((error) => {
								var e = error;
								if(e.response.status == 403) {
									window.location.replace('/login');
								}
								// console.log("profile Error ", error);
								// btn.removeClass('m-loader m-loader--brand');
								// this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})							
								// vm.showErrorMsg(form, 'danger', 'Profile banner update Failed!! ');
								axios.post('/loyalty/merchant/images/banner', data)
								.then((response) => {
									btn.removeClass('m-loader m-loader--brand');
									this.$emit('showtoast',{'msg':'Profile Banner Image Updated Success','type':'success','event':this.$event})
									// vm.showErrorMsg(form, 'success', 'Profile banner update Success!! ');
								})
								.catch((error) => {
									var e = error;
									if(e.response.status == 403) {
										window.location.replace('/login');
									}
									console.log("profile Error ", error);
									btn.removeClass('m-loader m-loader--brand');
									this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
									// vm.showErrorMsg(form, 'danger', 'Profile banner update Failed!! ');
								})
							})
						}
					}
				}
			}

        },
	},
	template: `	  
	<form v-if="!showEditProfile" class="m-form m-form--fit m-form--label-align-right" id="m_form_settings">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>
			<div class="form-group m-form__group row">
                <div class="offset-6 col-lg-2 col-md-2 col-sm-2">                
                    <button id="profile_submit" v-on:click="editProfile($event)" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Change Profile</button>
                </div>				
			</div>
			<div class="form-group m-form__group row">
				<div class="col-10 ml-auto">
					<h3 class="m-form__section">1. Business Details</h3>
				</div>
			</div>
		<!--	<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Name:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{name}}</label>
				</div>
			</div> -->
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Name:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{business_name}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Type:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{business_type}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Description:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{business_desc}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Earning Mechanics:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{earning_mechanics}}</label>				
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Time Zone:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{time_zone}}</label>
				</div>
			</div>
			<!-- <div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Registration Number:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{registration_no}}</label>
				</div>
			</div> -->
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Banner Image</label>
                <div class="col-lg-4 col-md-9 col-sm-12">                    
                    <br/>
                    <br/>
                    <br/>
                    <div class="m-portlet ">                        
                        <div class="m-portlet__body">
                            <div class="m-widget19">
                                <div  id="banner_image_submit" class="" style="width: 30px; display: inline-block;"></div>
                                <div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height-: 286px">							 
                                    <img :src="bannerurl" onError="this.src ='../assets/app/media/img/misc/notification_bg.jpg'" alt="">                            
                                    
                                </div>
                            </div>
                        </div>			
                    </div>
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
					<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{business_url}}</label>					
				</div>
			</div> 			
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Email:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{email}}</label>
				</div>
			</div>
			<!-- <div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Mobile:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{mobile}}</label>
				</div>
			</div> -->
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Contact Person:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{contact_person}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Contact Person Number:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{contact_no}}</label>
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
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{business_address}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">City:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{city}}</label>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Country:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<label class="form-control m-input" style="border-color: transparent; font-weight: 600;">{{country}}</label>
				</div>
			</div> 
			
		</div>
	</form>	  
	<form v-else="showEditProfile" class="m-form m-form--fit m-form--label-align-right" id="m_profile_form">
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
			<!-- <div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">First Name:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="text" v-model="given_name" name="given_name" class="form-control m-input">
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Last Name:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="text" v-model="sur_name" name="sur_name" class="form-control m-input">
				</div>
			</div> -->
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Business Name:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<input type="text" v-model="business_name" :maxlength="30"  name="business_name" class="form-control m-input">
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
				<label class="col-form-label col-lg-3 col-sm-12">Business Description:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<textarea type="text" :maxlength="256" v-model="business_desc" name="business_desc" class="form-control m-input"></textarea>
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
				<label class="col-form-label col-lg-3 col-sm-12">Business Time Zone:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">					               
					<select v-model="time_zone" class="form-control m-input" id="m_select2_1" name="time_zone">
						<option v-for="time in timeZoneList" :value="time.lookup_display_name">{{time.lookup_name}}</option>
					</select>	
				</div>
			</div>
			<!-- <div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Registration Number:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<input type="text" v-model="registration_no" name="registration_no" class="form-control m-input">
				</div>
			</div> -->                          
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Business Banner Image</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input class="form-control m-input" id="banner_image_submit" type="file" v-on:change="uploadBannerImage($event)">
				</div>          
            </div>
            <div class="form-group m-form__group row">
                <div class="offset-3 col-lg-4 col-md-9 col-sm-12">                    
                    <br/>
                    <br/>
                    <br/>
                    <div class="m-portlet ">                        
                        <div class="m-portlet__body">
                            <div class="m-widget19">
                                <div  id="banner_image_submit" class="" style="width: 30px; display: inline-block;"></div>
                                <div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height-: 286px">							 
                                    <img :src="bannerurl" onError="this.src ='../assets/app/media/img/misc/notification_bg.jpg'" alt="">                            
                                    
                                </div>
                            </div>
                        </div>			
                    </div>
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
           <!-- <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Mobile</label>
                <div class="col-lg-4 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text">{{country_code}}</i></span></div>
                        <input type="text" v-model="mobile" name="mobile" class="form-control m-input">                                                            
                        <div class="input-group-prepend"> <span class="input-group-text">
                            <i v-if="isvalidphone" class="la la-check-circle-o"></i>
                            <i v-else class="la la-times-circle-o"></i>
                        </span></div>                                                                
                    </div>
                    <span class="m-form__help">{{phonenohelp}}</span>                    
                </div>
            </div> -->
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12">Contact Person:</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
				<input type="text" v-model="contact_person" name="contact_person" class="form-control m-input">
				</div>
			</div>                
			<div class="form-group m-form__group row">
				<label class="col-xl-3 col-lg-3 col-form-label"> Contact Number</label>
				<div class="col-lg-4 col-md-9 col-sm-12">
					<input type="text" v-model="contact_no" name="contact_no" class="form-control m-input"> 
					<span class="m-form__help">{{contacthelp}}</span>                    
				</div>
			</div>
			<div class="form-group m-form__group row">
				<div class="col-10 ml-auto">
					<h3 class="m-form__section">3. Business Communication Address Details</h3>
				</div>
			</div>
			<div class="form-group m-form__group row">
				<label class="col-form-label col-lg-3 col-sm-12"> Address:</label>
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
			<div class="form-group m-form__group row">
                <div class="offset-3 col-lg-4 col-md-9 col-sm-12">                
                    <button id="profile_submit" v-on:click="updateProfile($event)" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Save</button>
                </div>				
			</div>
		</div>
	</form>
	`,
	mounted: function() {
		this.showProfile();
	}
})