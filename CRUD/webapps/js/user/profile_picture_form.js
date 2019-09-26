Vue.component('profile-picture-update-component', {
    props: ['profiledata'],
	data: function() {
        return {
            message: 'Init Brand',
            errors: [],
            postBody: '',
            imageurl: '',
            bannerurl: '',
            newProfileImage: '',
            newBannerImage: ''
        }
    },
    watch: {
        'profiledata': function() {
            this.imageurl = this.profiledata.imageurl;
            this.bannerurl = this.profiledata.bannerurl;
            var image = new Image();
            image.src = this.imageurl;
            let vm = this;
            image.onerror = function() {
                console.log("error ", vm.newProfileImage);
                vm.newProfileImage = true;
            }
            image.onload = function() { console.log("success ", vm.newProfileImage); vm.newProfileImage = false; };
            var bannerImage = new Image();
            bannerImage.src = this.bannerurl;
            bannerImage.onerror = function() {
                console.log("error ", vm.newBannerImage);
                vm.newBannerImage = true;
            }
            bannerImage.onload = function() { console.log("success ", vm.newBannerImage); vm.newBannerImage = false; };
        },
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
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
        uploadProfileImage: function(event) {
            let vm = this;
            var form = $('#profile_picture_update_form');
            var btn = $('#profile_image_submit');
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
                    vm.imageurl = e.target.result;
                    let rawData = vm.imageurl.split("base64,");
                    if (rawData.length > 1) {
                        rawData = rawData[1];
                        let data = {
                            filename: image.name,
                            b64data: rawData,
                            mimetype: image.type
                        }

                        if(this.newProfileImage) {
                            axios.post('/loyalty/merchant/images/merchant', data)
                            .then((response) => {
                                console.log("Profile Response ", response);
                                btn.removeClass('m-loader m-loader--brand');
                                window.location.reload(false);
                                this.$emit('showtoast',{'msg':'Profile Image Updated Success','type':'success','event':this.$event})
                                // vm.showErrorMsg(form, 'success', 'profile update success!..');
                            })
                            .catch((error) => {
                                var e = error;
                                if(e.response.status == 403) {
                                    window.location.replace('/login');
                                }
                                console.log("profile Error ", error);
                                btn.removeClass('m-loader m-loader--brand');
                                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                                // vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
                            })
                        }
                        else {
                            console.log("Update Profile");
                            axios.put('/loyalty/merchant/images/merchant', data)
                            .then((response) => {
                                console.log("Profile Response ", response);
                                btn.removeClass('m-loader m-loader--brand');
                                window.location.reload(false);
                                this.$emit('showtoast',{'msg':'Profile Image Updated Success','type':'success','event':this.$event})
                                // vm.showErrorMsg(form, 'success', 'profile update success!..');
                            })
                            .catch((error) => {
                                var e = error;
                                if(e.response.status == 403) {
                                    window.location.replace('/login');
                                }
                                
                                // console.log("profile Error ", error);
                                // btn.removeClass('m-loader m-loader--brand');
                                // this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                                // vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
                                axios.post('/loyalty/merchant/images/merchant', data)
                                .then((response) => {
                                    console.log("Profile Response ", response);
                                    btn.removeClass('m-loader m-loader--brand');
                                    window.location.reload(false);
                                    this.$emit('showtoast',{'msg':'Profile Image Updated Success','type':'success','event':this.$event})
                                    // vm.showErrorMsg(form, 'success', 'profile update success!..');
                                })
                                .catch((error) => {
                                    var e = error;
                                    if(e.response.status == 403) {
                                        window.location.replace('/login');
                                    }
                                    console.log("profile Error ", error);
                                    btn.removeClass('m-loader m-loader--brand');
                                    this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                                    // vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
                                })
                            })
                        }
                    }
                }
            }

        },
        uploadBannerImage: function(event) {
            let vm = this;
            var form = $('#profile_picture_update_form');
            var btn = $('#banner_image_submit');
			const image = event.target.files[0];
            btn.addClass('m-loader m-loader--brand');
			const reader = new FileReader();
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
                        axios.post('/loyalty/merchant/images/banner', data)
                        .then((response) => {
                            btn.removeClass('m-loader m-loader--brand');
                            window.location.reload(false);
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
                    }
                    else {

                        axios.put('/loyalty/merchant/images/banner', data)
                        .then((response) => {
                            btn.removeClass('m-loader m-loader--brand');
                            window.location.reload(false);
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
                    }
                }
            }

        },
		
	},
	template: `	  
	<form class="m-form m-form--fit m-form--label-align-right" id="profile_picture_update_form">
		<div class="m-portlet__body">
			<div class="form-group m-form__group m--margin-top-10 m--hide">
				<div class="alert m-alert m-alert--default" role="alert">
					The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
				</div>
			</div>                                
			<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-2 col-form-label">Profile Picture</label>
				<div class="col-7">
					<input class="form-control m-input" id="profile_image_submit" type="file" v-on:change="uploadProfileImage($event)">
				</div>
				<div class="offset-2 col-7">
					<div class="m-portlet ">
						<div class="m-portlet__body">
							<div class="m-card-profile">
                                <div class="m-card-profile__pic">
                                    <div  id="profile_image_submit" class="" style="width: 30px; display: inline-block;"></div>
									<div class="m-card-profile__pic-wrapper">	
                                        <img :src="imageurl" onError="this.src ='../assets/app/media/img/users/user4.png'" alt=""/>
									</div>
								</div>
							</div>					
						</div>			
					</div>
				</div>
			</div>                               
		<!--	<div class="form-group m-form__group row">
				<label for="example-text-input" class="col-2 col-form-label">Banner Image</label>
				<div class="col-7">
					<input class="form-control m-input" id="banner_image_submit" type="file" v-on:change="uploadBannerImage($event)">
				</div>          
            </div>
            <div class="form-group m-form__group row">
                <div class="offset-2 col-7">                    
                    <br/>
                    <br/>
                    <br/>
                    <div class="m-portlet ">                        
                        <div class="m-portlet__body">
                            <div class="m-widget19">
                                <div  id="banner_image_submit" class="" style="width: 30px; display: inline-block;"></div>
                                <div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height-: 286px">							 
                                    <img :src="bannerurl" onError="this.src ='../assets/app/media/img/misc/notification_bg.jpg'" alt="">                            
                                    <div class="m-widget19__shadow"></div>
                                </div>
                            </div>
                        </div>			
                    </div>
                </div>
            </div> -->
		</div>
	</form>
	`
})