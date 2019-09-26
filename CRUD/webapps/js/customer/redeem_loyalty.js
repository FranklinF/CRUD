
Vue.component('redeem-loyalty-component', {
    props: ['customerkey', 'rewardmethod'],
    data: function() {
        return {
            searchType: 'CC',
            showcc: true,
            showce: false,
            showcm: false,
            showSearch: true,
            loyalty: '',
            phonenohelp:"Enter customer's valid phone in  E.g: +1 5417543010",
            emailhelp:"Customer's communication email address Ex. john@gmail.com",
            customer: {
                customer_id: '',
                customer_code: '',
                customer_email: '',
                customer_phone: '',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            },
            customerDetails: '',
            showCustomerDetails: false,
            showNewCustomerForm: false,
            newcustomer: {
                customer_code:'',
                customer_email:'',
                customer_phone:'',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            },
            customerimg: '../assets/app/media/img/users/user4.png',
            customerBalance: '',
            tokenName: '',
            programtype: 'points',
            invoice_amt: '0',
            invoice_no: '0',
            points:'0',
            showReceipt:false,
            datatable: ''
        }
    },
    computed: {
        isEmailRequired() {
        //   return (this.primaryinput == 'e'|| this.primaryinput=='b')
            return (this.customerkey === 'E')
        },
        isPhoneRequired() {
            // return (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')
            return (this.customerkey === 'M')
        },
        isCustomerCodeRequired() {
            return (this.customerkey === 'C')
        },
        isNutickIdRequired() {
            return (this.customerkey === 'N')
        }
    },
    watch:{
        'customer.customer_email': function(){
            this.debouncedCheckEmail()
        },
        'customer.customer_phone': function(){
            this.debouncedCheckNumber()
        },
        'newcustomer.customer_email': function() {
            this.debouncedCheckNewEmail()
        },
        'newcustomer.customer_phone': function() {
            this.debouncedCheckNewNumber()
        },
        'rewardmethod': function() {
            if(this.rewardmethod === 'M') {
                this.programtype = 'points';
            }
            else {
                this.programtype = 'invoice';
            }
        }

    },
    created: function () {
        console.log('form created');
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
        this.getTokens();
    },
    methods: {
        showErrorMsg: function(form, type, msg) {
            var alert = $('<div id="alertBox" style="text-align:left;" class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
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
		getTokens: function() {
			var vm = this;
            axios.get('/loyalty/tokens')
            .then((response) => {
				console.log("Token Response ", response.data);
				let tokenData = [];
				tokenData = response.data.tokens;
				if(tokenData.length > 0) {
                    vm.tokenName = tokenData[0].symbol;
				}
				else {
				}
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            })
		},
        changeType: function(event) {
            console.log("Change Val ", event.target.value);
            let val = event.target.value;
            if(val === 'CC') {
                this.showcc = true;
                this.showce = false;
                this.showcm = false;
            }
            else if(val === 'CE') {
                this.showcc = false;
                this.showce = true;
                this.showcm = false;
            }
            else {
                this.showcc = false;
                this.showce = false;
                this.showcm = true;

            }
        },
        checkEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            console.log('check mail',vm.customer.customer_email);
            if(vm.customer.customer_email != null && vm.customer.customer_email.length > 0){
                if(reg.test(vm.customer.customer_email)){
                    console.log('Valid email', vm.customer.customer_email)
                    vm.customer.customer_isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.customer.customer_email;
                    vm.searchByEmail()
                }else{
                    vm.customer.customer_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.customer.customer_email;
                }
            }else{
                vm.customer.customer_isvalidemail=false;
                vm.emailhelp = "Customer's communication email address Ex. john@gmail.com";

            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.customer.customer_phone != null && vm.customer.customer_phone.length > 0){
                axios.get(`generic/phonecheck/`+vm.customer.customer_phone)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.customer.customer_name=response.data.customer_name;
                        vm.customer.customer_country=response.data.countrycode;
                        vm.customer.customer_formatedphone = response.data.phonenumberformat;
                        vm.customer.customer_isvalidphone = response.data.isvalidnumber;
                        vm.customer.customer_phonenofull = response.data.phonenumber;
                        if(vm.customer.customer_isvalidphone){
                            vm.searchByMobile();
                        }
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.customer.customer_formatedphone='';
                    vm.customer.customer_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter customer's valid phone in  E.g: +1 5417543010"
                vm.customer.customer_formatedphone='';
                vm.customer.customer_isvalidphone = false;
            }

        },
        getBalance: function(customerid) {
            var vm = this;
            axios.get('loyalty/balance/'+ customerid)
                .then((response) => {
                    console.log("Balance ", response.data);
                    let data = response.data.loyalties;
                    if(response.data.loyalties.length > 0) {
                        for(var i in data) {
                            if(vm.tokenName === data[i].token) {
                                vm.customerBalance = (data[i].count)?data[i].count: '0';
                            }
                            else {
                                vm.customerBalance = '0';
                            }
                        }
                    }
                    else {
                        vm.customerBalance = '0';
                    }
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                    vm.customerBalance = '0';
                })
        },
        searchByCode: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            console.log("Customer Code ", this.customer.customer_code);
            if(this.customer.customer_code !== '') {
                axios.get('loyalty/merchant/customers/C/' + this.customer.customer_code)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        this.showCustomerDetails = true;
                        this.showNewCustomerForm = false;
                        this.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        this.showCustomerDetails = false;
                        this.showNewCustomerForm = true;
                        this.showSearch = false;
                        vm.showReceipt = false;
                        this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
                    }
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                    this.showCustomerDetails = false;
                    this.showNewCustomerForm = true;
                    this.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchById: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            console.log("Customer id ", this.customer.customer_id);
            if(this.customer.customer_id !== '') {
                axios.get('loyalty/merchant/customers/N/' + this.customer.customer_id)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        this.showCustomerDetails = true;
                        this.showNewCustomerForm = false;
                        this.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        this.showCustomerDetails = false;
                        this.showNewCustomerForm = true;
                        this.showSearch = false;
                        vm.showReceipt = false;
                        this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
                    }
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                    this.showCustomerDetails = false;
                    this.showNewCustomerForm = true;
                    this.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchByEmail: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            if(this.customer.customer_email !== '') {
                axios.get('loyalty/merchant/customers/E/' + vm.customer.customer_email)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        this.showCustomerDetails = true;
                        this.showNewCustomerForm = false;
                        this.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        this.showCustomerDetails = false;
                        this.showNewCustomerForm = true;
                        this.showSearch = false;
                        vm.showReceipt = false;
                        this.showErrorMsg(form, 'danger', 'Enter Valid customer Email ');
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.newcustomer.customer_email = vm.customer.customer_email;
                    vm.showCustomerDetails = false;
                    vm.showNewCustomerForm = true;
                    vm.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Email ');
            }
        },
        searchByMobile: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            if(this.customer.customer_phone !== '') {
                axios.get('loyalty/merchant/customers/M/' + vm.customer.customer_phonenofull)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        this.showCustomerDetails = true;
                        this.showNewCustomerForm = false;
                        this.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        this.showCustomerDetails = false;
                        this.showNewCustomerForm = true;
                        this.showSearch = false;
                        vm.showReceipt = false;
                        this.showErrorMsg(form, 'danger', 'Enter Valid customer Phone ');
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.newcustomer.customer_phone = vm.customer.customer_phone;
                    vm.showCustomerDetails = false;
                    vm.showNewCustomerForm = true;
                    vm.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Phone ');
            }
        },
        createredeem: function() {
            var form = $('#m_redeem');
            var btn = $('#redeem_submit');
            var vm = this;
            var loginid = sessionStorage.getItem("loginid");
            form.validate({
                rules: {
                    loyalty: {
                        required: true,
                    }
                }
            });
            if (!form.valid()) {
                return;
            }
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            // let data = {
            //     customer_id: vm.customerDetails.customer_nutick_account,
            //     loyaltydetail: {
            //       loyalty: {
            //         token: vm.customerDetails.loyalty[0].token,
            //         count: vm.loyalty
            //       },
            //     },
            //     staff_code: (loginid !== null)?loginid: 'admin'
            
            //   }
            var outlet = sessionStorage.getItem('staff_outlet');
            var data = {
                customer_id:vm.customerDetails.customer_nutick_account,
                staff_code:(loginid !== null)?loginid: 'admin',
                outlet_id: (outlet !== null)? outlet: 'default',
                loyalty_points:vm.loyalty,
                loyalty_token:vm.customerDetails.loyalty[0].token,
            }
            console.log("Data redeem ", data);
            axios.post(`/loyalty/redeem`, data).then(response => {
                console.log("Redeem ", response.data);
                this.customerData = response.data;
                var redeemed_on = moment(response.data.redeemed_on.toString()).format("YYYY-MM-DD");
                this.customerData.redeemed_on = redeemed_on;
                this.showCustomerDetails = false;
                this.showNewCustomerForm = false;
                this.showSearch = false;
                vm.showReceipt = true;
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Redeemed Success','type':'success','event':this.$event})
                // vm.showErrorMsg(form, 'success', 'redeem success !! ');
                
            })
            .catch(e => {
                console.log('failure call:', e);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                // vm.showErrorMsg(form, 'danger', 'redeem failed !! ' + e.response.data.error_msg);
            })
        },
        cancelForm: function() {
            this.showCustomerDetails = false;
            this.showNewCustomerForm = false;
            this.showSearch = true;
            this.showReceipt = false;
        },
    },
    template: `    
        <form  v-if="showSearch" class="m-form m-form--fit m-form--label-align-right" id="m_issue_loyalty">             
            <div v-if="isEmailRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Email:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                        <input v-model="customer.customer_email" type="email" name="customer.customer_email"  id="customer.customer_email" class="form-control m-input" placeholder="" value="">
                        <!-- <div class="input-group-append">
                            <button :disabled="!customer.customer_isvalidemail" v-on:click="searchByEmail()" class="btn btn-secondary" type="button">Search!</button>
                        </div> -->      
                    </div>
                    <span class="m-form__help">{{emailhelp}}</span>
                </div>
            </div>
            <div v-if="isPhoneRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text">{{customer.customer_country}}</i></span></div>
                        <input v-model="customer.customer_phone" type="text" name="customer.customer_phone" id="customer.customer_phone" class="form-control m-input" placeholder="9876543210" value="">
                        <!-- <div class="input-group-append">
                            <button :disabled="!customer.customer_isvalidphone" v-on:click="searchByMobile()" class="btn btn-secondary" type="button">Search!</button>
                        </div> -->                                                                
                    </div>
                    <span class="m-form__help">{{phonenohelp}}</span>
                    
                </div>
            </div> 
            <div v-if="isCustomerCodeRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> Customer Code:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="customer.customer_code" name="customer.customer_code" id="customer.customer_code"  class="form-control m-input" placeholder="" value="">
                        <div class="input-group-append">
                            <button class="btn btn-secondary" v-on:click="searchByCode()" type="button">Search!</button>
                        </div>
                    </div>                    
                    <span class="m-form__help">Please enter customer's code</span>
                </div>
            </div>
            <div v-if="isNutickIdRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">Customer Nutick ID:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="customer.customer_id" name="customer.customer_id" id="customer.customer_id"  class="form-control m-input" placeholder="" value="">
                        <div class="input-group-append">
                            <button class="btn btn-secondary" v-on:click="searchById()" type="button">Search!</button>
                        </div>
                    </div>                    
                    <span class="m-form__help">Please enter customer's Nutick ID</span>
                </div>
            </div> 
            <redeem-loyalty-table></redeem-loyalty-table>          
        </form>
        <form  v-else-if="showNewCustomerForm" class="m-form m-form--fit m-form--label-align-right" id="m_create_cutomer">                           
            <div class="alert alert-warning" role="alert">
                    <strong>Not Found!</strong> customer not found try to create new customer account.
            </div>
            <div class="m-portlet__foot m-portlet__foot--fit">
                <div class="m-form__actions">
                    <div class="row">
                        <div class="col-3">
                        </div>
                        <div class="col-9">
                            <a href="#" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                <span>
                                    <i class="la la-arrow-left"></i>
                                    <span>Back</span>
                                </span>
                            </a>                            
                        </div>
                    </div>
                </div>
            </div>           
        </form>
        <form  v-else-if="showCustomerDetails" class="m-form m-form--fit m-form--label-align-right" id="m_redeem" >                                       
           <!-- <div class="form-group m-form__group row">
                <div class="col-12" >
                    <span class="m-topbar__userpic">
                        <img :src="customerimg" style="width: 150px;" class="m--img-rounded m--marginless" alt="" />
                    </span>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary">{{(customerDetails.customer_name)? customerDetails.customer_name: (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}</h4>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary">{{customerDetails.loyalty[0].count}} &nbsp; {{customerDetails.loyalty[0].token}}</h4>
                </div>
            </div> 
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary"> Tier: {{customerDetails.tier_id}}</h4>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary"> MemberShip Date: {{customerDetails.membership_date}}</h4>
                </div>
            </div>  -->
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"></label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="m-portlet" style="border-radius:5;">
                        <div class="m-portlet__body">
                            <div class="m-widget5">
                                <div class="m-widget5__item" style="margin-bottom:0;padding-bottom:0;">
                                    <div class="m-widget5__content">
                                        <div class="m-widget5__pic"> 
                                            <img class="m-widget7__img" :src="customerimg" alt="">  
                                        </div>
                                        <div class="m-widget5__section">
                                            <h3 class="m-widget5__title">
                                                {{(customerDetails.customer_name)? customerDetails.customer_name.toUpperCase() : (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}
                                            </h3>                                            
                                            <span class="m-widget5__desc">
                                                <h6><i class="fa fa-address-card"></i> {{customerDetails.customer_nutick_account.toUpperCase()}}</h6>
                                                <h6><i class="fa fa-handshake"></i> {{customerDetails.membership_date}} </h6>                                                
                                                <h6><i class="fa fa-shopping-basket"></i> {{customerDetails.last_txn_date}}</h6>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="m-widget5__content">	                                        
                                        <div class="m-widget5__stats1">                                            
                                            <span class="m-widget5__number">{{customerDetails.loyalty[0].count}} &nbsp; {{customerDetails.loyalty[0].token}}</span><br>                                            
                                            <h6><i class="flaticon-map"></i> {{customerDetails.tier_id}}</h6>
                                        </div>                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="form-group m-form__group row" style="text-align: left;">
                <label class="col-xl-3 col-lg-3 col-form-label"> Redeem loyalty Points :</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="loyalty" name="loyalty" id="loyalty"  class="form-control m-input" placeholder="" value="">                        
                    </div>                    
                    <span class="m-form__help">Please enter points</span>
                </div>
            </div>
            <div class="m-portlet__foot m-portlet__foot--fit" style="text-align: center;">
                <div class="m-form__actions">
                    <div class="row">
                        <div class="col-12">
                            <a href="#" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                <span>
                                    <i class="la la-arrow-left"></i>
                                    <span>Back</span>
                                </span>
                            </a>
                            <button type="reset" v-on:click="createredeem()" id="redeem_submit" class="btn btn-accent m-btn m-btn--air m-btn--custom">Redeem Loyalty</button>
                        </div>
                    </div>
                </div>
            </div>           
        </form>
        <!--begin:: Widgets/Company Summary-->
        <div class="m-portlet m-portlet--full-height" v-else-if="showReceipt">
            <div class="m-portlet__head">
                <div class="m-portlet__head-caption">
                    <div class="m-portlet__head-title">
                        <h3 class="m-portlet__head-text">
                            Receipt
                        </h3>
                    </div>
                </div>
            </div>
            <div class="m-portlet__body">
                <div class="m-widget13">
                    <div class="m-widget13__item">
                        <span class="m-widget13__desc m--align-right">
                            Transaction ID
                        </span>
                        <span class="m-widget13__text m-widget13__text-bolder">
                        {{customerData.redeemed_txn_id}}					 
                        </span>
                    </div>
                    <div class="m-widget13__item">
                        <span class="m-widget13__desc m--align-right">
                        Token:
                        </span>
                        <span class="m-widget13__text m-widget13__text-bolder">
                        {{customerDetails.loyalty[0].token}}					 
                        </span>
                    </div>
                    <div class="m-widget13__item">
                        <span class="m-widget13__desc m--align-right">
                        Customer 
                        </span>
                        <span class="m-widget13__text m-widget13__text-bolder">
                        {{(customerDetails.customer_name)? customerDetails.customer_name: (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}					 
                        </span>
                    </div> 
                    <div class="m-widget13__item">
                        <span class="m-widget13__desc m--align-right">
                        Redeemed Points 
                        </span>
                        <span class="m-widget13__text m-widget13__text-bolder">
                        {{customerData.loyalty_points}}					 
                        </span>
                    </div>
                    <div class="m-widget13__item">
                        <span class="m-widget13__desc m--align-right">
                        Redeem Date:
                        </span>
                        <span class="m-widget13__text m-widget13__text-bolder">
                        {{customerData.redeemed_on}}					 
                        </span>
                    </div>
                    <div class="m-widget13__action m--align-right">
                        <a href="#" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                            <span>
                                <i class="la la-arrow-left"></i>
                                <span>Go to Redeem</span>
                            </span>
                        </a>						 					 
                    </div>			
                </div>		 
            </div>
        </div>
        <!--end:: Widgets/Company Summary--> 
    `,
})

