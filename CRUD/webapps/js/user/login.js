Vue.component('login-wrapper-1', {
    props: ['login-wrapper-1'],
    data: function() {
        return {
            // logintitle:'NuTick Loyalty for Merchants',
            // logindesc:'Amazing Stuff is Lorem Here.Grownng Team'
            logintitle:'Develop and Grow Repeat Customers Easily',
            logindesc:'A blockchain-based solution for Business'
        }
    },
    template: `
        <div class="m-login__wrapper-1 m-portlet-full-height">
            <div class="m-login__wrapper-1-1">
                <div class="m-login__contanier">
                    <div class="m-login__content top">
                        <div class="m-login__logo">
                            
                        </div> 
                        <div class="m-login__title">
                            <h3>{{logintitle}}</h3>
                        </div>
                        <!--begin::Preview-->
                        <div class="m-demo">
                            <div class="m-demo__preview">
                                <div class="m-list-timeline">
                                    <div class="m-list-timeline__items">
                                        <div class="m-list-timeline__item">
                                            <span class="m-list-timeline__badge m-list-timeline__badge--success"></span>
                                            <span class="m-list-timeline__icon flaticon-user"></span>
                                            <span class="m-list-timeline__text">Enhances Relationships with Existing Customers</span>
                                        </div>
                                        <div class="m-list-timeline__item">
                                            <span class="m-list-timeline__badge m-list-timeline__badge--danger"></span>
                                            <span class="m-list-timeline__icon flaticon-interface-7"></span>
                                            <span class="m-list-timeline__text">Make First-Time Customers into Repeat Ones</span>
                                        </div>
                                        <div class="m-list-timeline__item">
                                            <span class="m-list-timeline__badge m-list-timeline__badge--warning"></span>
                                            <span class="m-list-timeline__icon flaticon-placeholder"></span>
                                            <span class="m-list-timeline__text">Increase Your Average Order Value</span>
                                        </div>
                                        <div class="m-list-timeline__item">
                                            <span class="m-list-timeline__badge m-list-timeline__badge--primary"></span>
                                            <span class="m-list-timeline__icon flaticon-share"></span>
                                            <span class="m-list-timeline__text">Reduce the Customer Acquisition Cost</span>
                                        </div>
                                        <div class="m-list-timeline__item">
                                            <span class="m-list-timeline__badge m-list-timeline__badge--brand"></span>
                                            <span class="m-list-timeline__icon flaticon-exclamation-1"></span>
                                            <span class="m-list-timeline__text">Create Brand Advocates</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--end::Preview-->
                        <div class="m-login__desc">
                            <!--{{logindesc}}-->
                        </div>
                        <div class="m-login__form-action">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
  })

  Vue.component('login-signin',{
    props: ['login_email'],
    data: function() {
        return {
            account: '',
            username:'',
            password:'',
            remember:'',
            merchantcode:'',           
            showLogin: false,
            showMerchantcode: true,
            showUserInput: false,
            merchantLogin: true,
            uName: 'User Name',
            pwd: 'Password',
            outlet: '',
            outletList: [],
            showOutlets: false,
            showType: true,
            showPin: true,
            showStaffLogin: true,
            showbtnLogin: true,
            emailReadonly: false,
        }
    },
    created:function(){
        var vm =this;
        var remember_email = localStorage.getItem("remember_email");
        var remember_pwd = localStorage.getItem("remember_pwd");
        var remember = localStorage.getItem("remember");
        
        if(remember)
        {
            vm.username = remember_email;
            vm.password = remember_pwd;
            vm.remember = true;
        }                

    },
    watch: {
        'login_email': function() {
            if(this.login_email) {
                this.emailReadonly = true;
                this.username = this.login_email;
            }
        }
    },
    methods: {
        resetData: function() {
            return {                
                account: '',
                username:'',
                password:'',
                remember:'',
                merchantcode:'',
                showLogin: false,
                showMerchantcode: true,
                showUserInput: false,
                merchantLogin: true,
                uName: 'User Name',
                pwd: 'Password',
                outlet: '',
                outletList: [],
                showOutlets: false,
                showStaffLogin: true,
                showbtnLogin: true,
            };
        },
        login: function(e) {
            var form = $('#show_login_form');            
            form.validate({
                rules: {                      
                    account: {
                        required: true
                    }
                }
            });
            e.preventDefault();
            if(!form.valid()) {
                return
            }
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
            if(reg.test(vm.account)) {
                vm.showLogin = true;
                vm.showMerchantcode = false;
                vm.showUserInput = false;
                vm.merchantLogin = true;                
                vm.username = vm.account;
                vm.remember = vm.remember;
                vm.uName = 'User Name';
                vm.pwd = 'Password'
            }
            else {
                vm.showLogin = true;
                vm.showMerchantcode = true;
                vm.showUserInput = true;
                vm.merchantLogin = false;
                vm.merchantcode = vm.account;
                vm.uName = "Staff Code";
                vm.pwd = "Staff Pin"
            }
        },
        merchant: function(e) {
            e.preventDefault();
            this.merchantLogin =  true;
            this.account =  '';
            this.username = '';
            this.remember = '';
            this.password = '';
            this.merchantcode = '';
            this.outlet =  '';
            this.outletList =  [];
            this.showOutlets =  false;
            this.showStaffLogin = false;
            this.showbtnLogin = true;
        },
        customer: function(e) {
            e.preventDefault();
            // $('#emailUser').rules( 'remove' );
            this.merchantLogin =  false;
            this.account =  '';
            this.username = '';
            this.remember = '';
            this.password = '';
            this.merchantcode = '';
            this.outlet =  '';
            this.outletList =  [];
            this.showOutlets =  false;
            this.showStaffLogin = true;
            this.showbtnLogin = true;
        },
        back: function(e) {
            e.preventDefault();
            this.account =  '';
            this.username = '';
            this.remember = '';
            this.password = '';
            this.merchantcode = '';
            this.showLogin =  false;
            this.showMerchantcode =  true;
            this.showUserInput =  false;
            this.merchantLogin =  true;
            this.uName =  'User Name';
            this.pwd =  'Password';
            this.outlet =  '';
            this.outletList =  [];
            this.showOutlets =  false;
            this.showStaffLogin = true;
            this.showbtnLogin = true;
        },
        getOutlets: function(mid,sid) {
            var vm = this;
            this.outletList = [];
            axios.get('/loyalty/staffs/'+mid+'/'+sid+ '/list')
            .then((response) => {
                console.log("Response ", response.data);
                vm.outletList = response.data.outlets;
                vm.showOutlets = true;
                if(vm.outletList.length === 1) {
                    vm.outlet = vm.outletList[0].outlet_id;
                }
                else {
                    this.showbtnLogin = false;
                }
            })
            .catch((error) => {
                console.log("Error ", error);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                vm.showOutlets = false;
            })
        },
        showOutlet: function(e) {
            e.preventDefault();
            this.showStaffLogin = !this.showStaffLogin;
        }
    },
    template:`
        <div class="m-login__signin">           
                        
            <!--<form v-if="!showLogin" class="m-form m-form--fit" id="show_login_form">
                <div v-if="showMerchantcode" class="form-group m-form__group row">
                    <div class="col-xl-12 col-lg-12">
                        <label>NuTick Business Code/ Email</label>
                        <input v-model="account" class="form-control m-input" type="text" required placeholder="Enter NuTick Business Code/ Email" name="account" autocomplete="off">
                    </div>
                </div> 
                <div class="m-login__form-action">
                    <button v-on:click="login($event)"  class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Next</button>
                    &nbsp;&nbsp;<button v-on:click="$emit('loginclicked',$event)" id="m_login_signup" class="btn btn-outline-focus m-btn--pill m-btn--custom m-btn--air">Sign Up</button>
                </div>
            </form>-->
            <form  class="m-form m-form--fit" id="login_signin_form" action="/login" method="post">
                <div class="m-portlet__body">
                    <ul class="nav nav-tabs  m-tabs-line m-tabs-line--2x m-tabs-line--focus" role="tablist">
                        <li class="nav-item m-tabs__item">
                            <a v-on:click="merchant($event)" class="nav-link m-tabs__link active" data-toggle="tab" href="#m_tabs_6_1" role="tab">Merchant Login</a>
                        </li>
                        <li class="nav-item dropdown m-tabs__item">
                            <a v-on:click="customer($event)" class="nav-link m-tabs__link" data-toggle="tab" href="#m_tabs_6_2" role="tab">Staff Login</a>
                        </li>
                    </ul>                        
                    <div class="tab-content">
                        <div class="tab-pane active" id="m_tabs_6_1" role="tabpanel">                             
                            <div class="form-group m-form__group row">
                                <div class="col-xl-12 col-lg-12">
                                    <label>Email</label>                                    
                                    <input v-model="username" :readonly="emailReadonly" class="form-control m-input" id="emailUser" type="text"  placeholder="Enter Username" name="username" autocomplete="off">
                                </div>
                            </div>
                            <div class="row form-group m-form__group">
                                <div class="col-xl-12 col-lg-12">
                                    <label>Password</label>
                                    <div class="input-group">
                                        <input v-model="password" id='pwd' class="form-control m-input m-login__form-input--last" required :type="showType? 'password':'text'" placeholder="Password" name="password">
                                        <div class="input-group-append" v-on:click="showType = !showType"><span class="input-group-text" id="basic-addon2"><i :class="showType? 'fa fa-eye-slash': 'fa fa-eye'"></i></span></div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="row form-group m-form__group">
                                <div class="col m--align-left">
                                    <label class="m-checkbox m-checkbox--focus">
                                        <input type="checkbox" name="remember" value='y' id="remember" v-model='remember'> Remember me
                                        <span></span>
                                    </label>
                                </div>
                                <div class="col m--align-right" v-if="!showUserInput">
                                    <a href="javascript:;" v-on:click="$emit('forgetpasswordclicked',$event)" id="m_login_forget_password" class="m-link">Forget Password ?</a>
                                </div>
                            </div>  
                        </div>
                        <div class="tab-pane" id="m_tabs_6_2" role="tabpanel">
                            <div v-if="showStaffLogin">
                                <div class="form-group m-form__group row">
                                    <div class="col-xl-12 col-lg-12">
                                        <label>Merchant NuTick Business Code</label>
                                        <input v-model="merchantcode" class="form-control m-input" type="text" placeholder="Enter Merchant's NuTick Business Code" name="merchantcode" autocomplete="off">
                                    </div>
                                </div>                             
                                <div class="form-group m-form__group row">
                                    <div class="col-xl-12 col-lg-12">
                                        <label>Staff Code</label>                                    
                                        <input v-model="username" v-on:change="getOutlets(merchantcode, username)" class="form-control m-input" type="text" required placeholder="Enter Staff's Code" name="username" autocomplete="off">
                                    </div>
                                </div>
                                <div class="row form-group m-form__group">
                                    <div class="col-xl-12 col-lg-12">
                                        <label>Staff Pin</label>
                                        <div class="input-group">
                                            <input v-model="password" class="form-control m-input m-login__form-input--last" required :type="showPin? 'password':'text'" placeholder="Password" name="password">
                                            <div class="input-group-append" v-on:click="showPin = !showPin"><span class="input-group-text" id="basic-addon2"><i :class="showPin? 'fa fa-eye-slash': 'fa fa-eye'"></i></span></div>
                                        </div>
                                        
                                        <!-- <input v-model="password" class="form-control m-input m-login__form-input--last" required type="Password" placeholder="Password" name="password"> -->
                                    </div>
                                </div>
                            </div>
                            <div v-if="!showStaffLogin">
                                <div class="row form-group m-form__group" v-if="showOutlets">
                                    <div class="col-xl-12 col-lg-12">
                                        <label>Outlet</label>
                                        <select v-model="outlet" class="form-control m-input" id="selectoutlet" name="selectoutlet">
                                            <option v-for="outlet in outletList" :value="outlet.outlet_id">{{outlet.outlet_name}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>      
                </div>                             
                <div class="m-login__form-action">
                    <button v-if="!showbtnLogin && showStaffLogin" v-on:click="showOutlet($event)" id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Sign In</button>
                    <button v-if="showbtnLogin && showStaffLogin"  v-on:click="$emit('loginsigninclicked',{'merchantLogin': merchantLogin, 'merchantcode': merchantcode, 'username':username, 'password':password,'outlet':outlet, 'event':$event,'remember':remember})" id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Sign In</button>
                    <button v-if="!showStaffLogin"  v-on:click="$emit('loginsigninclicked',{'merchantLogin': merchantLogin, 'merchantcode': merchantcode, 'username':username, 'password':password,'outlet':outlet, 'event':$event,'remember':remember})" id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Sign In</button>
                    &nbsp;&nbsp;<button v-on:click="$emit('loginclicked',$event)" id="m_login_signup" class="btn btn-outline-focus m-btn--pill m-btn--custom m-btn--air">Sign Up</button>
                </div>
            </form>
        </div>
      `
  })

  Vue.component('login-signup',{
    props: ['merchant'],
    data: function() {
        return {
            business_name: '',
            business_id: '',
            email: '',
            password: '',
            confirm_password: '',
            validbusinessid: '',
            isvalidemail: '',
            emailhelp: "Merchant's communication email address Ex. john@gmail.com",
            accounthelp: 'NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.',
            businessid_list: [],
            showPass: true,
            showConfirmPass: true,
            agreeTerm:false,
            merchantData: '',
            nameReadonly: false,
            emailReadonly: false,
        }
    },
    watch: {
       'merchant': function() {
            console.log("new Merchant form shopify ", JSON.parse(this.merchant));
            this.merchantData = JSON.parse(this.merchant);
            if(this.merchant) {
                this.nameReadonly = true;
                this.emailReadonly = true;
                this.business_name = this.merchantData.name;
                this.email = this.merchantData.email;
            }
        },
        'email': function(){
            this.debouncedCheckEmail()
        },
        'business_name': function() {
           this.debouncedGetBussinessId();
        }
    },
    created: function () {
        //this.debouncedCheckBussinessId = _.debounce(this.checkBussinessId, 500);
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        this.debouncedGetBussinessId = _.debounce(this.setBusinessCode, 500);
    },
    methods: {

        makeid:function(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          
            for (var i = 0; i < length; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
          },
        resetData: function() {
            // this.business_name =  '';
            // this.business_id =  '';
            // this.email =  '';
            // this.password =  '';
            // this.confirm_password =  '';            
            // this.isvalidemail =  '';
            // this.emailhelp =  "Merchant's communication email address Ex. john@gmail.com";
            // this.accounthelp =  'NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.';
            this.businessid_list =  [];
            this.showPass =  true;
            this.showConfirmPass =  true;
            setTimeout(() => {
                this.business_id =  '';
                this.isvalidemail =  '';
                this.validbusinessid =  false;
                $(".emailClr > .input-group-text > i,.email_help").css("color","gray");
                this.emailhelp =  "Merchant's communication email address Ex. john@gmail.com";
            }, 15000);
            // this.agreeTerm = false
        },
        clearData: function() {
            var form = $('#signup_form');
            form.clearForm();
            form.validate().resetForm();
            this.business_name =  '';
            this.business_id =  '';
            this.email =  '';
            this.password =  '';
            this.confirm_password =  '';
            this.validbusinessid =  '';
            this.isvalidemail =  '';
            this.emailhelp =  "Merchant's communication email address Ex. john@gmail.com";
            this.accounthelp =  'NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.';
            this.businessid_list =  [];
            this.showPass =  true;
            this.showConfirmPass =  true;
            this.agreeTerm = false
        },
        checkBussinessId: function(id) {
           
            var vm = this;
            var pattern = /^[a-zA-Z1-5]*$/
            if(vm.business_id != null && vm.business_id.length > 0 && vm.business_id.length < 13){
                if(pattern.test(vm.business_id)){
                    vm.validbusinessid = true;
                    vm.checkBusinessRegistered();
                }else{
                  
                    vm.accounthelp = 'Invalid Business ID '+ vm.business_id;
                }
            }else{
                
                vm.accounthelp = "NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.";

            }
        },
        checkBusinessRegistered: function() {

            
            var vm = this;
            
            axios.get('loyalty/merchant/account/'+ vm.business_id + '/exist')
            .then((response) => {
               //console.log("tamil "+response.data.verified);
                vm.validbusinessid = false;
                if(vm.business_id == undefined || vm.business_id == "")
                {
                    $(".m-input-icon .m-input-icon__icon i").css("color","red");
                }
                else
                {
                    if(response.data)
                    {
                       // vm.checkBusinessRegistered();
                       vm.validbusinessid = false;
                       var id = vm.business_id.slice(0,11);
                       vm.business_id = id+vm.makeid(1).toLowerCase();
                       vm.checkBusinessRegistered();
                      
                    }
                    
                }
            })
            .catch((error) => {
                vm.validbusinessid = true;
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                $(".m-input-icon .m-input-icon__icon i").css("color","green");

            })
        },
        setBusinessCode: function(){
            var vm = this;
            var bName = vm.business_name;
            var str = bName.trim();
            var sliceStr= str.split(" ");
            var firstStr = sliceStr[0];
            var lastStr = sliceStr[1];
            if(lastStr == undefined){
                var lastStr = "";
            }
            var strMerge =firstStr+lastStr;
            var lengthStr = strMerge.length;
            var special = strMerge.replace(/[^a-zA-Z ]/g, "");
            if(lengthStr <= 12)
            {
                var bcode = special.toLowerCase();
               
            }
            else
            {
                var bcode = special.slice(0,12).toLowerCase();
            }

            vm.business_id = bcode;
            vm.checkBusinessRegistered();
 
        },
        // getBusinessId: function(name) {
        //     var length = name.length;
        // },
        // createRandomString: function(length) {
    
        //     var str = "";
        //     for ( ; str.length < length; str += Math.random().toString( 36 ).substr( 2 ) );
        //     return str.substr( 0, length );
        // },
        checkEmailRegistered: function(email){
            //console.log("email register"+email);
            var vm = this;
            axios.get('loyalty/merchant/email/'+ vm.email + '/exist')
            .then((response) => {
                //console.log(response.data);
                if(response.data)
                {
                    vm.isvalidemail=false;
                    vm.emailhelp = 'Email '+ vm.email + ' already exists';
                    $(".emailClr > .input-group-text > i,.email_help").css("color","red");
                }
                

            })
            .catch((error) => {
                vm.isvalidemail=true;
                vm.emailhelp = 'Valid Email '+ vm.email;
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                $(".emailClr > .input-group-text > i,.email_help").css("color","green");    
            })            
        },
        checkEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            //console.log('check mail',vm.email);
            if(vm.email != null && vm.email.length > 0){
                if(reg.test(vm.email)){
                    //console.log('Valid email', vm.email)
                    vm.isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.email;
                    $(".emailClr > .input-group-text > i,.email_help").css("color","green");
                    vm.checkEmailRegistered(vm.email);
                }else{
                    vm.isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.email;
                    $(".emailClr > .input-group-text > i,.email_help").css("color","red");
                }
            }else{
                vm.isvalidemail=false;
                vm.emailhelp = "Merchant's communication email address Ex. john@gmail.com";
                $(".emailClr > .input-group-text > i,.email_help").css("color","gray");

            }
        },
    },
  template:`
    <div class="m-login__signup">
        <div class="m-login__head" style="padding-bottom: 10px;">
            <h3 class="m-login__title">Create a Merchant Account</h3>
        </div>
        <form class="m-form m-form--fit" id="signup_form">                                                                       
            <div class="form-group m-form__group">
                <label>Business Name</label>
                <input v-model="business_name" type="text" :readonly="nameReadonly" :maxlength="30" name="business_name" id="business_name" class="form-control m-input" placeholder="Enter Business Name" value="">
                <span class="m-form__help">Your NuTick Business Code: <span class='bussCode'>{{business_id}}</span></span>               
            </div>  
            <!--<div class="form-group m-form__group">
                <label>NuTick Business Code</label>
                <div class="m-input-icon m-input-icon--right">                            
                    <input v-model="business_id" type="text" name="business_id"  id="business_id"  :minlength="5" :maxlength="12" readonly class="form-control m-input" placeholder="Enter NuTick Business Code" value="">
                    <span class="m-input-icon__icon m-input-icon__icon--right"><span>                            
                        <i v-if="validbusinessid" class="la la-check-circle-o"></i>
                        <i v-else class="la la-times-circle-o"></i>
                    </span></span>
                </div>                    
                <span class="m-form__help">{{accounthelp}}</span>
            </div>-->
            <div class="form-group m-form__group">
                <label>Email</label>
                <div class="input-group m-input-icon m-input-icon--right">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                    <input v-model="email" :readonly="emailReadonly" type="email" name="email"  id="email" class="form-control m-input" placeholder="" value="">
                    <div class="input-group-prepend emailClr"> <span class="input-group-text">
                        <i v-if="isvalidemail" class="la la-check-circle-o"></i>
                        <i v-else class="la la-times-circle-o"></i>
                    </span></div>           
                </div>
                <span class="m-form__help email_help">{{emailhelp}}</span>
            </div>
            <div class="form-group m-form__group">
                <label>Password</label>
                <div class="input-group">
                    <input v-model="password" class="form-control m-input m-login__form-input--last" required :type="showPass? 'password':'text'" placeholder="Enter Password" name="password" id="password">
                    <div class="input-group-append" v-on:click="showPass = !showPass"><span class="input-group-text" id="basic-addon2"><i :class="showPass? 'fa fa-eye-slash': 'fa fa-eye'"></i></span></div>
                </div>
                <!--<input v-model="password" class="form-control m-input" type="password" placeholder="Enter Password" name="password"> -->
            </div>
            <div class="form-group m-form__group">
                <label>Confirm Password</label>
                <div class="input-group">
                    <input v-model="confirm_password" class="form-control m-input m-login__form-input--last" required :type="showConfirmPass? 'password':'text'" placeholder="Enter Confirm Password" name="confirm_password" id="confirm_password">
                    <div class="input-group-append" v-on:click="showConfirmPass = !showConfirmPass"><span class="input-group-text" id="basic-addon2"><i :class="showConfirmPass? 'fa fa-eye-slash': 'fa fa-eye'"></i></span></div>
                </div>
                <!-- <input v-model="confirm_password" class="form-control m-input m-login__form-input--last" type="password" placeholder="Enter Confirm Password" name="confirm_password"> -->
            </div>  
            <div class="form-group m-form__group m-login__form-sub">
                <label class="m-checkbox m-checkbox--focus">
                  <input type="checkbox" name="agreeTerm" value='y' id="agreeTerm" v-model='agreeTerm'>I agree to our <a href="http://loyalty.nutick.com/terms.html" target="_blank" class="m-link m-link--focus">terms and conditions</a>.
                    <span></span>
                </label>
                <span class="m-form__help"></span>
            </div>                         
            <div class="m-login__form-action">
            
                <button :disabled="agreeTerm? false:true" v-on:click="$emit('signupsummitclicked',{'validbusinessid': validbusinessid,'business_name':business_name, 'business_id':business_id, 'email':email, 'password':password, 'confirm_password':confirm_password,  'event':$event}); resetData();"  id="m_login_signup_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Sign Up</button>
                <button v-on:click="$emit('signupcancelclicked',$event); clearData();"  id="m_login_signup_cancel" class="btn btn-outline-focus m-btn m-btn--pill m-btn--custom">Cancel</button>
            </div>

        </form>
    </div>
  `
})

  Vue.component('login-forget-password',{
        data: function() {
            return {
                forgot_email: '',
                forgot_business_id: '',
                validbusinessid: '',
                isvalidemail: '',
                emailhelp: "Merchant's communication email address Ex. john@gmail.com",
                accounthelp: 'NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.'
                
            }
        },
        watch: {
            'forgot_business_id': function() {
                this.debouncedCheckBussinessId();
            },
            'forgot_email': function(){
                this.debouncedCheckEmail()
            },
        },
        created: function () {
            this.debouncedCheckBussinessId = _.debounce(this.checkBussinessId, 500);
            this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        },
        methods: {
            checkEmail:  function () {
                var vm = this;
                var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    
                //console.log('check mail',vm.forgot_email);
                if(vm.forgot_email != null && vm.forgot_email.length > 0){
                    if(reg.test(vm.forgot_email)){
                        //console.log('Valid email', vm.forgot_email)
                        vm.isvalidemail=true;
                        vm.emailhelp = 'Valid Email '+ vm.forgot_email;
                    }else{
                        vm.isvalidemail=false;
                        vm.emailhelp = 'Invalid Email '+ vm.forgot_email;
                    }
                }else{
                    vm.isvalidemail=false;
                    vm.emailhelp = "Merchant's communication email address Ex. john@gmail.com";
    
                }
            },
            checkBussinessId: function() {
                var vm = this;
                var pattern = /^[a-zA-Z1-5]*$/
                if(vm.forgot_business_id != null && vm.forgot_business_id.length > 0 && vm.forgot_business_id.length < 13){
                    //console.log("vm.business_id -", vm.forgot_business_id)
                    if(pattern.test(vm.forgot_business_id)){
                        vm.validbusinessid = true;
                        vm.accounthelp = 'Valid Business ID '+ vm.forgot_business_id;
                    }else{
                      
                        vm.accounthelp = 'Invalid Business ID '+ vm.forgot_business_id;
                    }
                }else{
                    
                    vm.accounthelp = "NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.";
    
                }
            },
            clear: function() {
                this.forgot_email= '',
                this.forgot_business_id= '',
                this.validbusinessid= '',
                this.isvalidemail= '',
                this.emailhelp= "Merchant's communication email address Ex. john@gmail.com",
                this.accounthelp= 'NuTick Business Code Must be exactly 12 characters long and consist of a-z characters and digits up until 1-5.'
            }
        },
      template:`
        <div class="m-login__forget-password">
            <div class="m-login__head">
                <h3 class="m-login__title">Forgotten Password ?</h3>
                <div class="m-login__desc">Enter your NuTick Business Code and Email to reset your password:</div>
            </div>
            <br />
            <br />
            <form class="m-form--fit m-form" id="forgot_form" action=""> 
                <div class="form-group m-form__group row">
                    <div class="col-xl-12 col-lg-12">
                        <label>NuTick Business Code</label>
                        <div class="m-input-icon m-input-icon--right">                            
                            <input v-model="forgot_business_id" type="text" name="forgot_business_id" id="forgot_business_id"  class="form-control m-input" placeholder="Enter NuTick Business Code" value="">
                            <span class="m-input-icon__icon m-input-icon__icon--right"><span>                            
                                <i v-if="validbusinessid" class="la la-check-circle-o"></i>
                                <i v-else class="la la-times-circle-o"></i>
                            </span></span>
                        </div>                        
                        <span class="m-form__help">{{accounthelp}}</span>
                    </div>
                </div> 
                <div class="form-group m-form__group row">
                    <div class="col-xl-12 col-lg-12">
                        <label>Email</label>
                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                            <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                            <input v-model="forgot_email" type="email" name="forgot_email"  id="forgot_email" class="form-control m-input" placeholder="" value="">
                            <div class="input-group-prepend"> <span class="input-group-text">
                                <i v-if="isvalidemail" class="la la-check-circle-o"></i>
                                <i v-else class="la la-times-circle-o"></i>
                            </span></div>           
                        </div>
                        <span class="m-form__help">{{emailhelp}}</span>
                    </div>
                </div>               
                <div class="m-login__form-action">
                    <button  v-on:click="$emit('forgetpwdsubmitclicked',{'email': forgot_email,'business_id': forgot_business_id, 'event':$event}); clear();"  id="m_login_forget_password_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">Request</button>
                    <button  v-on:click="$emit('forgetpwdcancelclicked',$event); clear();"  id="m_login_forget_password_cancel" class="btn btn-outline-focus m-btn m-btn--pill m-btn--custom ">Cancel</button>
                </div>
            </form>
        </div>
      `
  })
 
  Vue.component('login-wrapper-2',{
      props: ['merchant', 'login_email'],
    //   data: function() {
    //     //   return {
    //     //       merchant: this.merchant
    //     //   }
    //   },
      template: `
        <div class="m-login__wrapper-2 m-portlet-full-height">
            <div class="m-login__contanier">
                <div class="m-login__logo">
                    <a href="#">
                        <img src="../../../media/img/logos/LoyaltyLogo.png" class="logoLogin">
                    </a>
                    <h1 class="logoHd">NuTick <span>Loyalty</span></h1>
                </div>                
                <login-signin :login_email="login_email"
                    v-on:loginclicked="$emit('loginclicked',$event)"
                    v-on:loginsigninclicked="$emit('loginsigninclicked',$event)"
                    v-on:forgetpasswordclicked="$emit('forgetpasswordclicked',$event)"
                ></login-signin>
                <login-signup :merchant="merchant"
                    v-on:signupsummitclicked="$emit('signupsummitclicked',$event)"
                    v-on:signupcancelclicked="$emit('signupcancelclicked',$event)"
                ></login-signup>
                <login-forget-password 
                    v-on:forgetpwdsubmitclicked="$emit('forgetpwdsubmitclicked',$event)"
                    v-on:forgetpwdcancelclicked="$emit('forgetpwdcancelclicked',$event)"
                ></login-forget-password>
                <div class="m-login__border">
                    <div></div>
                </div>
            </div>
        </div>
      `
  })

  Vue.component('login-main-component',{
      props:["merchant", 'login_email'],
      template:`        
        <div class="m-login m-login--5 m-login--signin" id="m_login" style="background-image: url(../../../assets/app/media/img//bg/bg-3.jpg);">            
            <login-wrapper-2 :merchant="merchant" :login_email="login_email"
                v-on:loginclicked="$emit('loginclicked',$event)"
                v-on:loginsigninclicked="$emit('loginsigninclicked',$event)"
                v-on:signupsummitclicked="$emit('signupsummitclicked',$event)"
                v-on:forgetpasswordclicked="$emit('forgetpasswordclicked',$event)"
                v-on:signupcancelclicked="$emit('signupcancelclicked',$event)"
                v-on:forgetpwdsubmitclicked="$emit('forgetpwdsubmitclicked',$event)"
                v-on:forgetpwdcancelclicked="$emit('forgetpwdcancelclicked',$event)"
            ></login-wrapper-2>
            <!--<login-wrapper-1 ></login-wrapper-1>-->
        </div>
      `
  })
  
  new Vue({
    el: '#login-page',
    data: {
        message: '',
        logintitle:'JOIN OUR GREAT METRO COMMUNITY GET FREE ACCOUNT',
        errors:[],
        postBody: '',
        merchant: '',
        login_email: ''
    },
    created: function() {
        
    },
    methods: {
        addNewTodo: function () {
            this.todos.push({
                id: this.nextTodoId++,
                title: this.newTodoText
            })
            this.newTodoText = ''
        },
        getParams: function() {
            let urlParams = new URLSearchParams(window.location.search);
            let idParam = urlParams.get('id');
            let keyParam = urlParams.get('key');
            let planParam = urlParams.get('plan');
            let newMerchant = urlParams.get('merchant_data');
            let email = urlParams.get('login_email');
            let token = urlParams.get('token');
            // var url = window.location.url;
            sessionStorage.setItem("plan", planParam);
            console.log("Login Url ", idParam, " ", keyParam, " ", planParam);
            if(planParam !== null) {
                console.log("plan ", planParam);
                this.displaySignUpForm();
            }
            if(newMerchant !== null) {
                this.displaySignUpForm();
                this.merchant = newMerchant;
            }
            if(email !== null && token !== null) {
               
            //    window.location.replace('/dashboard');
               this.auto_login_merchant(email, token);
                this.login_email = email;
            }
            if((idParam !== null) && (keyParam !== null)) {
                let data = {
                    verification_code: keyParam
                  }
                axios.put('loyalty/merchant/'+ idParam + '/activate', data)
                .then((response) => {
                    var signInForm = $('.m-login__signin form');
                    this.showErrorMsg(signInForm, 'success', 'Your Account has been Activated');
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response);
                    var signInForm = $('.m-login__signin form');
                    this.showErrorMsg(signInForm, 'danger', error.response.data.error_msg);
                })
            }
        },
        sayNow: function (message, msg2) {
            //alert(message+msg2)
        },
        loginSignup: function(e){
            e.preventDefault();
            this.displaySignUpForm();
        },
        loginSignupCancel: function(e){
            e.preventDefault();
            this.displaySignInForm();
        },
        loginForgetPassword: function(e){
            e.preventDefault();
            this.displayForgetPasswordForm();
        },
        loginForgetPasswordCancel: function(e){
            e.preventDefault();
            this.displaySignInForm();
        },
        displaySignUpForm : function(){
            var login = $('#m_login');
            login.removeClass('m-login--forget-password');
            login.removeClass('m-login--signin');

            login.addClass('m-login--signup');
            mUtil.animateClass(login.find('.m-login__signup')[0], 'flipInX animated');
        },

        displaySignInForm : function() {
            var login = $('#m_login');

            login.removeClass('m-login--forget-password');
            login.removeClass('m-login--signup');

            login.addClass('m-login--signin');
            mUtil.animateClass(login.find('.m-login__signin')[0], 'flipInX animated');
            //login.find('.m-login__signin').animateClass('flipInX animated');
        },
        displayForgetPasswordForm : function() {
            var login = $('#m_login');

            login.removeClass('m-login--signin');
            login.removeClass('m-login--signup');
    
            login.addClass('m-login--forget-password');
            //login.find('.m-login__forget-password').animateClass('flipInX animated');
            mUtil.animateClass(login.find('.m-login__forget-password')[0], 'flipInX animated');

        },
        showErrorMsg: function(form, type, msg) {
            var alert = $('<div id="alertBox" class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button  class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');
    
            form.find('.alert').remove();
            alert.prependTo(form);

            mUtil.animateClass(alert[0], 'fadeIn animated');
            alert.find('span').html(msg);
           
        },
        auto_login_merchant: function(email, token) {
            var form = $('#login_signin_form');
            var self = this;
            axios.post(`/loyalty/merchant/auto/auth`, {
                'login_user': email,
                'token': token
            }).then(response => {
                console.log(response);
                // sessionStorage.setItem("loginid", response.data.staff.loginid);
                if(response.status === 200) {
                    if(remember == true)
                    {
                        localStorage.setItem("remember_email",email);
                        localStorage.setItem("remember_pwd",password);
                        localStorage.setItem("remember",true);
                    }

                    sessionStorage.setItem("merchant_id", response.data.merchant_nutick_account);
                    sessionStorage.setItem("staff_type",'merchant');
                    // form.submit();

                }
                else {
                    self.showErrorMsg(form, 'danger', 'Merchant not found!...'); 
                }
            })
            .catch(e => {
                console.log('failure call:', e)
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                self.showErrorMsg(form, 'danger', e.response.data.error_msg);    
            })
        },
        loginSignInFormSubmit : function(merchantLogin, merchantcode, email, password, outlet, e, remember) {

            //console.log("remember"+remember);
            //return true;
            var form = $('#login_signin_form');
            form.validate({
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                }
            });
            
            if(!merchantLogin) {
                console.log("staff login ",merchantLogin, ' ',  outlet)
                sessionStorage.setItem("staff_outlet", outlet)
                $("#selectoutlet").rules("add", {required:true});
                $('#emailUser').rules( 'remove' );
                
                if (!form.valid()) {
                    return;
                }
            }
            else if(merchantLogin) {
                $('#emailUser').rules('add', {email: true})
                $('#selectoutlet').rules( 'remove' );
                
                if (!form.valid()) {
                    return;
                }    
            }
            
            e.preventDefault();

            var self = this;

            if(merchantLogin) {
                axios.post(`/loyalty/merchant/auth`, {
                    'login_user': email,
                    'login_password': password
                }).then(response => {
                    console.log(response);
                    // sessionStorage.setItem("loginid", response.data.staff.loginid);
                    if(response.status === 200) {
                        if(remember == true)
                        {
                            localStorage.setItem("remember_email",email);
                            localStorage.setItem("remember_pwd",password);
                            localStorage.setItem("remember",true);
                        }

                        sessionStorage.setItem("merchant_id", response.data.merchant_nutick_account);
                        sessionStorage.setItem("staff_type",'merchant');
                        form.submit();

                    }
                    else {
                        self.showErrorMsg(form, 'danger', 'Merchant not found!...'); 
                    }
                })
                .catch(e => {
                    console.log('failure call:', e)
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    self.showErrorMsg(form, 'danger', e.response.data.error_msg);    
                })
            }
            else {
                console.log("Staff Login Clicked")
                var header_param = { headers:{"account-code": merchantcode }};
                axios.post(`/loyalty/staffs/auth` ,{                   
                    'staff_code': email,
                    'staff_pin': password
                }, header_param)
                .then(response => {
                    // JSON responses are automatically parsed.
                    sessionStorage.setItem("staff_type",'staff');
                    sessionStorage.setItem("staff_code",response.data.staff_code);
                    console.log(response.data.credentials);
                    console.log(email, password);
                    axios.get('loyalty/merchant/auth/' + merchantcode)
                    .then((response) => {
                        console.log("Credentials ", response.data);
                    })
                    .catch((error) => {
                        if(error.response.status == 403) {
                            window.location.replace('/login');
                        }
                        console.log("Credentials error ", error);
                    })
                    // window.location.replace('/dashboard');
                    // form.submit();
                    if(response.status === 200) {                       
                        form.submit();

                    }
                    else {
                        self.showErrorMsg(form, 'danger', 'Merchant not found!...'); 
                    }
                })
                .catch(e => {
                    this.errors.push(e)
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log('failure call:', e);
                    self.showErrorMsg(form, 'danger', e.response.data.error_msg);
                })
            }            
            
        },
    
        signupFormSubmit: function(validbusinessid,business_name,business_id,email,password,confirm_password,e) {

            var vm = this;
            var btn = $('#m_login_signup_submit');
            var form = $('#signup_form');
    
                form.validate({
                    rules: {
                       
                        email: {
                            required: true,
                            email: true
                        },
                        password: {
                            required: true
                        },
                        confirm_password: {
                            required: true,
                            equalTo: "#password"
                        },
                       
                        business_id: {
                            required: true
                        },
                        business_name: {
                            required: true
                        }
                    },
                    messages: {
                        business_name: {
                            pattern: "Please enter valid business name",
                        },
                        password: {
                            equalTo: 'Password is incorrect'
                        },
                        confirm_password: {
                            equalTo: 'Confirm password is incorrect'
                        }
                    }
                });
                if (!form.valid()) {
                    return;
                }
                e.preventDefault();
                var planParam = sessionStorage.getItem("plan");
                var data = "";
                                
                if(this.merchant === '') {
                    data = {
                        email: email,
                        merchant_id: business_id,
                        business_name: business_name,
                        password: password
                    }
                }
                else {
                    var parseData = JSON.parse(this.merchant);
                    data = {                        
                        business_name:parseData.name,
                        merchant_id: business_id,
                        email:parseData.email,
                        password: password,
                        mobile:parseData.phone,                         
                        country_code:parseData.country_code,
                        country:parseData.country_name,
                        time_zone:parseData.iana_timezone,
                        ecommerce_id: parseData.ecommerce_id,
                        ecommerce_status: parseData.ecommerce_status,
                        accessToken: parseData.accessToken,
                        verified: Number(1)
                    }
                }
                if(planParam !== "null") {
                    data['price_plan'] = planParam;
                }
                else {
                    data['price_plan'] = 'free_plan';
                }
                console.log("SignUp Data ", data, validbusinessid);
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                if(validbusinessid) {
                    if(password === confirm_password) {
                        $.ajax({
                            url: '/loyalty/merchant',
                            type: 'POST',
                            data: data,
                            success: function(response, status, xhr, $form) {
                                //console.log("Response ", response, status);
                                // similate 2s delay                                                                   
                                    form.clearForm();
                                    form.validate().resetForm();
                                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                    // display signup form
                                    if(vm.merchant !== '') {
                                        var parseData = JSON.parse(vm.merchant);
                                        var shop_data = {
                                            shop_name: parseData.name,
                                            accessToken: parseData.accessToken
                                        };                                       
                                        axios.post(`/loyalty/merchant/auth`, {
                                            'login_user': parseData.email,
                                            'login_password': password
                                        }).then(response => {
                                            console.log(response);
                                            axios.post('/loyalty/merchant/shopify/activation', {
                                                shop_name: parseData.name,                                                
                                                accessToken: parseData.accessToken,
                                                merchant_id: data.merchant_id
                                            }).then(response => {
                                                    console.log("Webhook response ", response.data);
                                                    sessionStorage.setItem("merchant_id", data.merchant_id);
                                                    sessionStorage.setItem("staff_type",'merchant');
                                                })
                                                .catch(err => {
                                                    if(err.response.status == 403) {
                                                        window.location.replace('/login');
                                                    }
                                                    console.log("Webhook Error ", err);
                                                })
                                            window.location.replace('/dashboard');
                                        })
                                        .catch(err => {
                                            if(err.response.status == 403) {
                                                window.location.replace('/login');
                                            }
                                            console.log("Merchant auto login Error ", err);
                                        })
                                    }
                                    else {
                                        vm.displaySignInForm();
                                        var signInForm = $('.m-login__signin form');
                                        signInForm.clearForm();
                                        signInForm.validate().resetForm();
                                        
                                        vm.showErrorMsg(signInForm, 'success', 'Thank you. To complete your registration please check your email.');
                                    }
                                   
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                //console.log("Error ", jqXHR, textStatus, errorThrown);
                                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                var err = JSON.parse(jqXHR.responseText)
                                vm.showErrorMsg(form, 'danger', err.error_msg);
                            }
                        })
                    }
                    else {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        vm.showErrorMsg(form, 'danger', 'Password and Confirm Password is incorrect!..');   
                    }

                }
                else {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    // vm.showErrorMsg(form, 'danger', 'Please enter valid Business Name!..'); 
                }
        },
        forgotFormSubmit: function(businessid, email,e) {

            var vm = this;
            var btn = $('#m_login_forget_password_submit');
            var form = $('#forgot_form');            
            form.validate({
                rules: {
                    forgot_email: {
                        required: true,
                        email: true
                    },
                    forgot_business_id: {
                        required: true
                    }
                }
            });
            if (!form.valid()) {
                
                return;
            }
            e.preventDefault();
            let data = {
                merchant_id: businessid,
                login_email: email
            }
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            $.ajax({
                url: '/loyalty/merchant/password/reset',
                type: 'PUT',
                data: data,
                success: function(response, status, xhr, $form) {
                    console.log("Response ", response, status);
                    // similate 2s delay                               
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        vm.displaySignInForm();
                        var signInForm = $('.m-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        vm.showErrorMsg(signInForm, 'success', 'Thank you. To get your password please check your email.');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Error ", jqXHR, textStatus, errorThrown);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    var err = JSON.parse(jqXHR.responseText)
                    vm.showErrorMsg(form, 'danger', err.error_msg);
                }
            })
        },
        handleForgetPasswordFormSubmit : function() {
            $('#m_login_forget_password_submit').click(function(e) {
                e.preventDefault();
    
                var btn = $(this);
                var form = $(this).closest('form');
    
                form.validate({
                    rules: {
                        email: {
                            required: true,
                            email: true
                        }
                    }
                });
    
                if (!form.valid()) {
                    return;
                }
    
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
    
                form.ajaxSubmit({
                    url: '',
                    success: function(response, status, xhr, $form) { 
                        // similate 2s delay
                        setTimeout(function() {
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false); // remove 
                            form.clearForm(); // clear form
                            form.validate().resetForm(); // reset validation states
    
                            // display signup form
                            displaySignInForm();
                            var signInForm = login.find('.m-login__signin form');
                            signInForm.clearForm();
                            signInForm.validate().resetForm();
    
                            showErrorMsg(signInForm, 'success', 'Cool! Password recovery instruction has been sent to your email.');
                        }, 2000);
                    }
                });
            });
        }
    },
    mounted: function() {
        this.getParams();
    }
  })