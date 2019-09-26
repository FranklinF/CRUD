Vue.component('token-form-header', {
    props:['isformvalid'],
    computed: {
        isDisabled() {
          return this.isformvalid == false;
        }
    },
    template:`
    <div class="m-portlet__head">
        <div class="m-portlet__head-progress">
            <!-- here can place a progress bar-->
        </div>
        <div class="m-portlet__head-wrapper">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <h3 class="m-portlet__head-text">
                        Brand Token 
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
               
            </div>
        </div>
    </div>
    `
})

Vue.component('token-form-component', {
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
    <div class="m-grid__item m-content-token-form" id="m-token-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <token-form-header 
                    ></token-form-header>
                    <div class="m-portlet__body">  
                        <form class="m-form m-form--fit m-form--label-align-right" id="m_form_setting_brand">
                            <div class="m-portlet__body">
                                <div class="form-group m-form__group m--margin-top-10 m--hide">
                                    <div class="alert m-alert m-alert--default" role="alert">
                                        The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
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
                        </div>											
                    </div>
                    <!--end::Portlet-->
                </div>
            </div>
        </div>
    </div>
	`
})