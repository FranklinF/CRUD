Vue.component('profile-main-component', {
	props: ['profiledata'],
    data: function() {
		return {
			imageurl: '',
			merchantname: '',
			email: '',
            staff_type: '',
            showActive: ''
		}
	},
    created: function () {
		// `this` points to the vm instance
        this.staff_type = sessionStorage.getItem("staff_type");
        if(this.staff_type === 'merchant') {
            this.showActive = true;
        }
        else {
            this.showActive = false;
        }
		console.log('Init Message is: ' + this.message);
	},
	watch: {
		'profiledata': function() {
			console.log("staff type ", typeof this.staff_type);
			this.profiledata = this.profiledata;
			this.merchantname = this.profiledata.given_name+ ' '+ this.profiledata.sur_name;
			this.imageurl = this.profiledata.imageurl;
			this.email = this.profiledata.email;
		}
	},
    template: `
    <div class="m-grid__item" id="m-profile-main" >
	<div class="m-content">
            <div class="row">
                <div class="col-xl-3 col-lg-4">
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
                                    <!--<span class="m-card-profile__name">{{merchantname}}</span>-->
                                    <a href="" class="m-card-profile__email m-link">{{email}}</a>
                                </div>
                            </div>					
                        </div>			
                    </div>	
                </div>
                <div class="col-xl-9 col-lg-8">
                    <div class="m-portlet m-portlet--full-height m-portlet--tabs  ">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-tools">
                                <ul class="nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary" role="tablist">
                                    <li v-if="staff_type !== 'merchant'" class="nav-item m-tabs__item">
                                        <a :class="(staff_type === 'merchant')? 'nav-link m-tabs__link': 'nav-link m-tabs__link active'" data-toggle="tab" href="#m_user_profile_tab_1" role="tab">
                                            <i class="flaticon-share m--hide"></i>
                                            Profile
                                        </a>
                                    </li>
                                    <li class="nav-item m-tabs__item">
                                        <a :class="(staff_type === 'merchant')? 'nav-link m-tabs__link active': 'nav-link m-tabs__link'" data-toggle="tab" href="#m_user_profile_tab_2" role="tab">
                                            {{(staff_type === 'merchant')? 'Change Password': 'Change Pin'}}
                                        </a>
                                    </li>
                                    <li v-if="staff_type === 'merchant'" class="nav-item m-tabs__item">
                                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_user_profile_tab_3" role="tab">
                                            Change Profile Picture 
                                        </a>
                                    </li>
                                </ul>
                            </div>                                                           
                        </div>
                        <div class="tab-content">
                            <div :class="(staff_type === 'merchant')? 'tab-pane': 'tab-pane active'" id="m_user_profile_tab_1">
							  <!-- <profile-update-component v-if="staff_type === '0'" :profiledata="profiledata" @showtoast="$emit('showtoast', $event)" ></profile-update-component> -->
							   <staff-update-component v-if="staff_type === 'staff'" @showtoast="$emit('showtoast', $event)" ></staff-update-component>
                            </div>
							<div :class="(staff_type === 'merchant')? 'tab-pane active': 'tab-pane'" id="m_user_profile_tab_2">
								<password-update-component @showtoast="$emit('showtoast', $event)" ></password-update-component>
                            </div>
							<div v-if="staff_type === 'merchant'" class="tab-pane " id="m_user_profile_tab_3">
								<profile-picture-update-component :profiledata="profiledata" @showtoast="$emit('showtoast', $event)"></profile-picture-update-component>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
new Vue({
    el: '#profile-page',
    data: {
        message: 'Init Message',
        errors: [],
		postBody: '',
		profiledata: ''
    },
    created: function () {
        // `this` points to the vm instance
		console.log('Init Message is: ' + this.message)
		this.getProfile();
      },
    methods: {
        sayNow: function (msg1, msg2) {
            //alert(msg1, msg2)
        },
		getProfile: function() {
			var vm = this;
            axios.get('/loyalty/merchant/profile/details')
            .then((response) => {
                console.log("Profile Response ", response.data);
                vm.profiledata= response.data;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
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
            var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');
    
            form.find('.alert').remove();
            alert.prependTo(form);

            mUtil.animateClass(alert[0], 'fadeIn animated');
            alert.find('span').html(msg);
        },
    },
})