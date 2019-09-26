Vue.component('customers-form-header', {
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
                        Add Customer
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('customerformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button id="customer_submit" v-on:click="$emit('customerformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('customers-form-component', {
    props:['primaryinput', 'customerkey'],
    data: function() {
        return {
            customer: {
                customer_name:'',
                customer_id: '',
                customer_code: '',
                customer_email:'',
                customer_phone:'',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            },
            phonenohelp:"Enter customer's valid phone in  E.g: +1 5417543010",
            emailhelp:"Customer's communication email address Ex. john@gmail.com",
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
        },
        isValidForm(){
            var retval = true;
            // if(this.primaryinput == 'e'|| this.primaryinput=='b'){
            //     retval = this.customer.customer_isvalidemail
            // }
            // if(retval && (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')){
            //     retval = this.customer.customer_isvalidphone;
            // }
            if(this.customerkey === 'E') {
                retval = this.customer.customer_isvalidemail;
            }
            if(retval && (this.customerkey === 'M')) {
                retval = this.customer.customer_isvalidphone;
            }
            if(retval && (this.customerkey === 'C')) {
                retval = true;
            }
            if(retval && (this.customerkey === 'N')) {
                retval = true;
            }
            return retval;
        }
    },
    watch:{
        'customer.customer_email': function(){
            this.debouncedCheckEmail()
        },
        'customer.customer_phone': function(){
            this.debouncedCheckNumber()
        }

    },
    created: function () {
        console.log('form created')
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
    },
    methods: {
        resetData: function() {
            this.customer = {
                customer_name:'',
                customer_id: '',
                customer_code: '',
                customer_email:'',
                customer_phone:'',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            };
            this.phonenohelp = "Enter customer's valid phone in  E.g: +1 5417543010";
            this.emailhelp = "Customer's communication email address Ex. john@gmail.com";
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
        checkEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            console.log('check mail',vm.customer.customer_email);
            if(vm.customer.customer_email != null && vm.customer.customer_email.length > 0){
                if(reg.test(vm.customer.customer_email)){
                    console.log('Valid email', vm.customer.customer_email)
                    vm.customer.customer_isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.customer.customer_email;
                    // vm.checkEmailRegistered();
                }else{
                    vm.customer.customer_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.customer.customer_email;
                }
            }else{
                vm.customer.customer_isvalidemail=false;
                vm.emailhelp = "Customer's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.customer.customer_isvalidemail )
            if(vm.customer.customer_isvalidemail){
                vm.customer.customer_isvalidemail = false;
                axios.get(`loyalty/customers/`+vm.customer.customer_email)
                .then(function (response) {
                    vm.answer = response.data.customer_id;
                    // vm.customer.customer_name=response.data.customer_name;
                    vm.emailhelp = 'Email '+vm.customer.customer_email+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.customer.customer_email+' valid to register '
                        vm.customer.customer_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.customer.customer_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.customer.customer_formatedphone;
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
                        // vm.customer.customer_name=response.data.customer_name;
                        vm.customer.customer_country=response.data.countrycode;
                        vm.customer.customer_formatedphone = response.data.phonenumberformat;
                        vm.customer.customer_isvalidphone = response.data.isvalidnumber;
                        vm.customer.customer_phonenofull = response.data.phonenumber;
                        vm.checkPhoneRegistered();
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
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.customer.customer_isvalidphone )
            if(vm.customer.customer_isvalidphone){
                vm.customer.customer_isvalidphone = false;
                axios.get(`loyalty/customers/`+vm.customer.customer_phonenofull)
                .then(function (response) {
                    vm.answer = response.data.customer_id;
                    // vm.customer.customer_name=response.data.customer_name;
                    vm.phonenohelp = 'Phone Number '+vm.customer.customer_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response.status);
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.customer.customer_formatedphone+' valid to register '
                        vm.customer.customer_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.customer.customer_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.customer.customer_formatedphone;
            }
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_customer_new');
            var btn = $('#customer_submit');
            form.validate({
                rules: {
                    customer_name: {
                        required: true,
                    },
                }
            });
            if (!form.valid()) {
                return;
            }
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            axios.post(`/loyalty/merchant/addcustomer`, {
                'customer_mobile': vm.customer.customer_phonenofull,
                'customer_email': vm.customer.customer_email,
                'customer_name': vm.customer.customer_name,
                'customer_nutick_account': vm.customer.customer_id,
                'customer_code': vm.customer.customer_code,
            }).then(response => {
                console.log(response.data.status);
                this.resetData();
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Customer has been Added success','type':'success','event':this.$event})
                this.$emit('customerformsave',{'customer':this.customer,'event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event});                                
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                
                // vm.showErrorMsg(form, 'danger', 'Customer create failed !! ' + e.response.data.error_msg);
            })
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('customerformcancel',{'customer':this.customer,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-customer-form d-none" id="m-customer-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <customers-form-header v-bind:isformvalid="isValidForm"
                            @customerformcancel="cancelForm()"
                            @customerformsave="submitForm()"
                    ></customers-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_customer_new">
                                <!--begin: Form Body -->
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div class="m-form__section m-form__section--first">
                                                <div class="m-form__heading">
                                                    <h3 class="m-form__heading-title">Customer Details</h3>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Email:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                                                            <input v-model="customer.customer_email" type="email" name="email"  id="customer_email" class="form-control m-input" placeholder="" value="">
                                                            <div class="input-group-prepend"> <span class="input-group-text">
                                                                <i v-if="customer.customer_isvalidemail" class="la la-check-circle-o"></i>
                                                                <i v-else class="la la-times-circle-o"></i>
                                                            </span></div>           
                                                        </div>
                                                        <span class="m-form__help">{{emailhelp}}</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text">{{customer.customer_country}}</i></span></div>
                                                            <input v-model="customer.customer_phone" type="text" name="phone" id="customer_phone" class="form-control m-input" placeholder="9876543210" value="">                                                            
                                                            <div class="input-group-prepend"> <span class="input-group-text">
                                                                <i v-if="customer.customer_isvalidphone" class="la la-check-circle-o"></i>
                                                                <i v-else class="la la-times-circle-o"></i>
                                                            </span></div>                                                                
                                                        </div>
                                                        <span class="m-form__help">{{phonenohelp}}</span>
                                                        
                                                    </div>
                                                </div>
                                                <div v-if="isCustomerCodeRequired" class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Customer Code:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <input v-model="customer.customer_code" type="text" name="customer_code" id="customer_code"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter customer's code</span>
                                                    </div>
                                                </div>
                                                <div v-if="isNutickIdRequired" class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> NuTick ID:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <input v-model="customer.customer_id" type="text" name="customer_id" id="customer_id"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter customer's nutick id</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <input v-model="customer.customer_name" type="text" name="customer_name" id="customer_name"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter customer's first and last names</span>
                                                    </div>
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
    `
})