Vue.component('issuecoupons-form-header', {
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
                        Issue Coupon
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">    
                <a href="#" v-on:click="$emit('issuecouponformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>            
                <button v-on:click="$emit('issuecouponformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" id="saveBtn" :disabled="isDisabled">Issue Coupon</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('issuecoupons-form-component', {
    props:['primaryinput'],
    data: function() {
        return {
            couponList: [],
            coupon_code: '',
            serials_count: '',
            enabled: true,
            status: '',
            activate: true,
            customerkey: '',
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
            serials: [],
            showSerials: 'serial',
            showCustomerDetails: false,
            blockRemoval: true,
            serialval: []
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            if(retval && (this.serials_count != '') && (this.coupon_code != '')) {
                retval = true;
            }
            return retval;
        },
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
        serials () {
            this.blockRemoval = this.serials.length <= 1
          }
    },
    created: function () {
        console.log('form created')
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)       
    },
    methods: {
        resetData: function() {
            this.serials_count = '';
            this.phonenohelp ="Enter customer's valid phone in  E.g : +1 5417543010";
            this.emailhelp ="Customer's communication email address Ex. john@gmail.com";
            this.customer = {
                customer_id: '',
                customer_code: '',
                customer_email: '',
                customer_phone: '',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            };
            this.customerDetails = '';
            this.showCustomerDetails = false;
            this.blockRemoval = true;
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
        changeActiveStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.activate = true;
            }
            else {
                this.activate = false;
            }
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.enabled = true;
            }
            else {
                this.enabled = false;
            }
        }, 
        getSettings: function() {
            var vm = this;
            axios.get('/loyalty/merchant/settings/details')
            .then((response) => {
				this.newSetting = false;
				var settings = response.data.loyalty;
                vm.customerkey = settings.customer_key;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
            })
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
                    vm.searchByEmail();
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
            if(vm.customer.customer_phone != null && vm.customer.customer_phone.length > 4){
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
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
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
        searchByCode: function() {
            var form = $('#m_form_issuecoupon_new');
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
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                    }
                    else {                        
                        vm.showCustomerDetails = false;
                        vm.showErrorMsg(form, 'danger', 'Customer Not Found');
                    }
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                    this.showCustomerDetails = false;
                    this.showErrorMsg(form, 'danger', error.response.data.error_msg);
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchById: function() {
            var form = $('#m_form_issuecoupon_new');
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
                        vm.showCustomerDetails = true;
                    }
                    else {                        
                        vm.showCustomerDetails = false;
                        vm.showErrorMsg(form, 'danger', 'Customer Not Found');
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    this.showCustomerDetails = false;
                    this.showErrorMsg(form, 'danger', error.response.data.error_msg);
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchByEmail: function() {
            var form = $('#m_form_issuecoupon_new');
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
                        vm.showCustomerDetails = true;
                    }
                    else {                       
                        vm.showCustomerDetails = false;
                        vm.showErrorMsg(form, 'danger', 'Customer Not Found');
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.showCustomerDetails = false;
                    vm.showErrorMsg(form, 'danger', error.response.data.error_msg);
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Email ');
            }
        },
        searchByMobile: function() {
            var form = $('#m_form_issuecoupon_new');
            var vm = this;
            if(this.customer.customer_phone !== '') {
                axios.get('loyalty/merchant/customers/M/' + vm.customer.customer_phonenofull)
                .then((response) => {
                    console.log("Customer ", response);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                    }
                    else {                        
                        vm.showCustomerDetails = false;
                        vm.showErrorMsg(form, 'danger', 'Customer Not Found');
                    }                    
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.showCustomerDetails = false;
                    this.showErrorMsg(form, 'danger', error.response.data.error_msg);
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Phone ');
            }
        }, 
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_issuecoupon_new');
            var btn = $('#saveBtn');
            console.log("Serials ", this.serials, this.serialval);
            if(vm.showSerials === 'serial') {
                form.validate({
                    rules: {
                        serials_key: {
                            required: true,
                        }
                    }
                })

                if(!form.valid()) {
                    return;
                }
            }
            else {
                form.validate({
                    rules: {
                        serials_count: {
                            required: true,
                        }
                    }
                })

                if(!form.valid()) {
                    return;
                }
            }
            // btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            var serialsData = [];
            if(this.serialval.length > 0) {
                for(var i in this.serialval) {
                    serialsData.push({
                        coupon_serial: this.serialval[i]
                    })
                }
            }           

            var data = {
                coupon_code : vm.coupon_code,
                serials: serialsData,
                serials_count: vm.serials_count,                
                issue_to : vm.customerDetails.customer_nutick_account
            }
            console.log("Serials Data ", data);
            if(vm.customerDetails.customer_nutick_account) {
                axios.put('/loyalty/coupons/serials/issue', data)
                    .then(response => {
                        console.log("Issue Serials ", response);
                        this.resetData();
                        this.serials = [];
                        this.getSerials();
                        this.$emit('showtoast',{'msg':'Issued Success','type':'success','event':this.$event})
                        this.$emit('issuecouponformsave',{'issuecoupon':this.redeemcoupon,'event':this.$event})
                    })
                    .catch(err => {
                        if(err.response.status == 403) {
                            window.location.replace('/login');
                        }
                        console.log("error ", err);
                        this.$emit('showtoast',{'msg':'Issued Failed '+err.response.data.error_msg,'type':'error','event':this.$event})
                    })
            }
            else {
                this.$emit('showtoast',{'msg':'Add customer Before issue serial','type':'error','event':this.$event})
            }
            
           
           
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('issuecouponformcancel',{'issuecoupon':this.issuecoupon,'event':this.$event})
        
        },
        getSerials: function() {
            if(this.serials.length === 0) {
                this.serials.push({
                    model: ''
                })
            }
        },
        addSerial: function(e) {
            e.preventDefault();
            this.serials.push({
               model: '' 
            })
        },
        removeSerial: function(e, i) {
            e.preventDefault();
            if (!this.blockRemoval) this.serials.splice(i, 1)
        }
    },
    template: `
    <div class="m-grid__item m-content-issuecoupon-form d-none" id="m-issuecoupon-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <issuecoupons-form-header v-bind:isformvalid="isValidForm"
                            @issuecouponformcancel="cancelForm()"
                            @issuecouponformsave="submitForm()"
                    ></issuecoupons-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_issuecoupon_new">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-12">
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
                                                        </div>     -->                                                            
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
                                            <div v-if="showCustomerDetails" class="form-group m-form__group row">
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
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupon Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                <select v-model="coupon_code" ref="select" class="form-control m-input" id="m_select2_1" name="coupon_code">
                                                    <option value="">Select Coupon Code</option>
                                                    <option v-for="coupon in couponList" :value="coupon.coupon_code">{{coupon.coupon_name}}</option>
                                                </select>
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serial Issue Type:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                            <input v-model="showSerials"  value="serial" type="radio"> Serials
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                            <input v-model="showSerials"  value="count" type="radio"> Serials Count
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                </div>                                                
                                            </div>
                                            <div  class="form-group m-form__group row" v-if="showSerials == 'count'">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serials Count:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input type="text" v-model="serials_count" :maxlength="30" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="serials_count" class="form-control m-input">
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row" v-if="showSerials == 'serial'" v-for="(serial, i) in serials">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serials Key:</label>
                                                <div class="col-lg-6 col-md-7 col-sm-12">                                                       
                                                    <input type="text" v-model="serialval[i]"  name="serials_key" class="form-control m-input">
                                                </div>
                                                <div class="col-lg-2 col-md-4 col-sm-12">
                                                    <a href="#" v-if="i >= 1" v-on:click="removeSerial($event, i)" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only">
                                                        <i class="fa fa-minus"></i>
                                                    </a>                                                      
                                                    <a href="#" v-if="(i + 1 === serials.length) && (serials.length <= 10)" v-on:click="addSerial($event)" class="btn btn-outline-success m-btn m-btn--icon m-btn--icon-only">
                                                        <i class="fa fa-plus"></i>
                                                    </a>
                                                </div>
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
    `,
    mounted: function() {
        var vm = this;
        vm.getSettings();
        vm.getSerials();
        axios.get('/loyalty/coupons')
        .then(response => {
            vm.couponList = response.data.coupons;
        })
        .catch(error => {
            if(error.response.status == 403) {
                window.location.replace('/login');
            }
            console.log("Coupon list error ", error);
        })

        $(this.$refs.select)
        .select2({
           
        })       
        .on('change', function () {            
            vm.coupon_code = $(this).val();
            console.log("coupon_code", vm.coupon_code)
        });
        
    }
})