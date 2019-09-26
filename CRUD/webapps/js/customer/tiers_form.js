Vue.component('tiers-form-header', {
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
                        Add Tier
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('tierformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button id="tier_submit" v-on:click="$emit('tierformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('tiers-form-component', {
    props:['primaryinput'],
    data: function() {
        return {
            tier: {
                tier_name:'',
                tier_description: '',
                sequence: '',
                status: true,
                tier_email:'',
                tier_phone:'',
                tier_country:'IN',
                tier_formatedphone:'',
                tier_phonenofull:'',
                tier_isvalidphone:'',
                tier_isvalidemail:''
            },
            phonenohelp:"Enter tier's valid phone in  E.g: +1 5417543010",
            emailhelp:"tier's communication email address Ex. john@gmail.com",
            namehelp:"tier's Name Ex. Gold",
            deschelp:"tier's Description Ex. Gold Tier used for reqular customers",
        }
    },
    computed: {
        
        isEmailRequired() {
          return (this.primaryinput == 'e'|| this.primaryinput=='b')
        },
        isPhoneRequired() {
            return (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')
        },
        isValidForm(){
            var retval = true;
            if(this.primaryinput == 'e'|| this.primaryinput=='b'){
                retval = this.tier.tier_name;
            }
            if(retval && (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')){
                retval = this.tier.tier_name;
            }
            return retval;
        }
    },
    watch:{
        'tier.tier_email': function(){
            this.debouncedCheckEmail()
        },
        'tier.tier_phone': function(){
            this.debouncedCheckNumber()
        },
        'tier.status': function(newValue, oldValue) {
            console.log(newValue);
        }
        

    },
    created: function () {
        console.log('form created')
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
    },
    methods: {
        resetData: function() {
            return {
                tier_name:'',
                tier_description: '',
                sequence: '',
                status: true,
                tier_email:'',
                tier_phone:'',
                tier_country:'IN',
                tier_formatedphone:'',
                tier_phonenofull:'',
                tier_isvalidphone:'',
                tier_isvalidemail:''
            };
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

            console.log('check mail',vm.tier.tier_email);
            if(vm.tier.tier_email != null && vm.tier.tier_email.length > 0){
                if(reg.test(vm.tier.tier_email)){
                    console.log('Valid email', vm.tier.tier_email)
                    vm.tier.tier_isvalidemail=true;
                    vm.checkEmailRegistered();
                }else{
                    vm.tier.tier_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.tier.tier_email;
                }
            }else{
                vm.tier.tier_isvalidemail=false;
                vm.emailhelp = "tier's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.tier.tier_isvalidemail )
            if(vm.tier.tier_isvalidemail){
                vm.tier.tier_isvalidemail = false;
                axios.get(`loyalty/tiers/`+vm.tier.tier_email)
                .then(function (response) {
                    vm.answer = response.data.tier_id;
                    vm.tier.tier_name=response.data.tier_name;
                    vm.emailhelp = 'Email '+vm.tier.tier_email+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.tier.tier_email+' valid to register '
                        vm.tier.tier_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.tier.tier_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.tier.tier_formatedphone;
            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.tier.tier_phone != null && vm.tier.tier_phone.length > 0){
                axios.get(`generic/phonecheck/`+vm.tier.tier_phone)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.tier.tier_name=response.data.tier_name;
                        vm.tier.tier_country=response.data.countrycode;
                        vm.tier.tier_formatedphone = response.data.phonenumberformat;
                        vm.tier.tier_isvalidphone = response.data.isvalidnumber;
                        vm.tier.tier_phonenofull = response.data.phonenumber;
                        vm.checkPhoneRegistered();
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.tier.tier_formatedphone='';
                    vm.tier.tier_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter tier's valid phone in  E.g: +1 5417543010"
                vm.tier.tier_formatedphone='';
                vm.tier.tier_isvalidphone = false;
            }

        },
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.tier.tier_isvalidphone )
            if(vm.tier.tier_isvalidphone){
                vm.tier.tier_isvalidphone = false;
                axios.get(`loyalty/tiers/`+vm.tier.tier_phonenofull)
                .then(function (response) {
                    vm.answer = response.data.tier_id;
                    vm.tier.tier_name=response.data.tier_name;
                    vm.phonenohelp = 'Phone Number '+vm.tier.tier_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.tier.tier_formatedphone+' valid to register '
                        vm.tier.tier_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.tier.tier_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.tier.tier_formatedphone;
            }
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.tier.status = true;
            }
            else {
                this.tier.status = false;
            }
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_tier_new');
            var btn = $('#tier_submit');
            // var form = $('#login_signin_form');
            form.validate({
                rules: {
                    tier_name: {
                        required: true,
                    },
                    sequence: {
                        required: true,
                    },
                    status: {
                        required: true,
                    }
                }
            });
            if (!form.valid()) {
                return;
            }
            console.log("Form Values ", vm);
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            axios.post(`/loyalty/tiers`, {
                'tier_id': vm.tier.tier_name,
                'tier_name': vm.tier.tier_name.toUpperCase(),
                'tier_description': vm.tier.tier_description,
                'sequence': Number(vm.tier.sequence),
                'status': (vm.tier.status === true)? 1:2,
            }).then(response => {
                console.log(response.data.status);
                this.resetData();
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Tier has been added','type':'success','event':this.$event})
                this.$emit('tierformsave',{'tier':this.tier,'event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                // vm.showErrorMsg(form, 'danger', 'tier create failed !! ' + e.response.data.error_msg);
            })
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('tierformcancel',{'tier':this.tier,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-tier-form d-none" id="m-tier-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <tiers-form-header v-bind:isformvalid="isValidForm"
                            @tierformcancel="cancelForm()"
                            @tierformsave="submitForm()"
                    ></tiers-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_tier_new">
                                <!--begin: Form Body -->
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div class="m-form__section m-form__section--first">
                                                <div class="m-form__heading">
                                                    <h3 class="m-form__heading-title">Tier Details</h3>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                            
                                                            <input v-model="tier.tier_name" type="text" name="name" v-on:input="tier.tier_name = $event.target.value.toUpperCase()" id="tier_name" class="form-control m-input" placeholder="" value="">                                                                    
                                                        </div>
                                                        <span class="m-form__help">{{namehelp}}</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Description:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                            
                                                            <input v-model="tier.tier_description" type="text" name="desc"  id="tier_description" class="form-control m-input" placeholder="" value="">                                                                    
                                                        </div>
                                                        <span class="m-form__help">{{deschelp}}</span>
                                                    </div>
                                                </div> 
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Sequence:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                            
                                                            <input v-model="tier.sequence" type="number" name="sequence" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57"  id="sequence" class="form-control m-input" placeholder="" value="">                                                                    
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Status:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                            <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                                <label>
                                                                <input type="checkbox" v-model="tier.status" v-on:change="changeStatus($event)" checked="checked" name="">
                                                                <span></span>
                                                                </label>
                                                            </span>
                                                        </div>
                                                       <!-- <div class="input-group m-input-icon m-input-icon--left m-input-icon--right"> 
                                                            <div class="btn-group btn-group-toggle">
                                                                <label class="btn btn-success active">
                                                                    <input type="radio" name="options" v-model="tier.status" id="option1" autocomplete="off" value="1"> Active
                                                                </label>
                                                                <label class="btn btn-success">
                                                                    <input type="radio" name="options" v-model="tier.status" id="option2" autocomplete="off" value="2"> Inactive
                                                                </label>
                                                                <br>
                                                            </div>
                                                        </div> -->
                                                        
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