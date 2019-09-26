Vue.component('staffs-form-header', {
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
                        Add staff
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('staffformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button v-on:click="$emit('staffformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('staffs-form-component', {
    props:['primaryinput'],
    data: function() {
        return {
            staff: {
                staff_code: '',
                username: '',
                staff_pin: '',
                staff_name:'',
                staff_email:'',
                contact_no:'',
                status: true,
                staff_country:'IN',
                staff_formatedphone:'',
                staff_phonenofull:'',
                staff_isvalidphone:'',
                staff_isvalidemail:'',
                outlets: []
            },
            outletList: [],
            addOutlets: [],
            phonenohelp:"Enter staff's valid phone in  E.g: +1 5417543010",
            emailhelp:"staff's communication email address Ex. john@gmail.com",
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
            // if(this.primaryinput == 'e'|| this.primaryinput=='b'){
            //     retval = this.staff.staff_isvalidemail
            // }
            if(retval && (this.primaryinput == null || this.primaryinput == 'p'|| this.primaryinput=='b')){
                retval = this.staff.staff_isvalidphone;
            }
            if(this.staff.outlets.length === 0) {
                retval = false;
            }
            return retval;
        }
    },
    watch:{
        // 'staff.loginid': function(){
        //     this.debouncedCheckEmail()
        // },
        'staff.contact_no': function(){
            this.debouncedCheckNumber()
        },
        'staff.status': function(newValue, oldValue) {
            console.log("Active", newValue);
            if(Number(newValue) === 1) {
                $('#active').addClass('active');
                $('#notactive').removeClass('active');
            }
            else {
                $('#notactive').addClass('active');
                $('#active').removeClass('active');
            }
        },

    },
    created: function () {
        console.log('form created')
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
        this.getOutlets();
    },
    methods: {
        resetData: function() {
            this.staff = {
                staff_code: '',
                username: '',
                staff_pin: '',
                staff_name:'',
                staff_email:'',
                contact_no:'',
                status: true,
                staff_country:'IN',
                staff_formatedphone:'',
                staff_phonenofull:'',
                staff_isvalidphone:'',
                staff_isvalidemail:'',
                outlets: []
            },
            this.outletList = [];
            this.addOutlets= [];
            this.phonenohelp="Enter staff's valid phone in  E.g: +1 5417543010";
            this.emailhelp="staff's communication email address Ex. john@gmail.com";
        },
        getOutlets: function() {
            var vm = this;
            vm.outletList = [];
            axios.get('/loyalty/outlets?page=1')
            .then((response) => {
                let data = [];
                data = response.data.outlets;
                console.log("Response outlet ", data);                
                let oid = 'default';                               
                for(var i in data) {                    
                    if(oid == data[i].outlet_id) {                        
                        vm.outletList.push({
                            outlet_id: data[i].outlet_id,
                            outlet_name: data[i].outlet_name,
                            control: data[i].outlet_id,
                            checked: true,
                            disabled: true,
                          }) 
                          vm.changeOptions(data[i].outlet_id, i);                    
                    }
                    else {                        
                        vm.outletList.push({
                            outlet_id: data[i].outlet_id,
                            outlet_name: data[i].outlet_name,
                            control: data[i].outlet_id,
                            checked: false,
                            disabled: false,
                          })
                    } 
                  }
            })
        },
        changeOptions: function(outletid, index) {
            
            if(outletid !== 'default') {
                this.outletList[index].checked = !this.outletList[index].checked;
              }  
            if(this.addOutlets.length === 0) {
                this.addOutlets.push(outletid);
                // this.program[outletid] = '';
            }            
            else {
                let find = this.addOutlets.findIndex(oid => oid === outletid);
                console.log("Find ", find, outletid);
                if(find === -1) {
                this.addOutlets.push(outletid);                
                }
                else {
                this.addOutlets.splice(find, 1);
                }
            }
            console.log("Edit changeOptions ", this.addOutlets);
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

            console.log('check mail',vm.staff.loginid);
            if(vm.staff.loginid != null && vm.staff.loginid.length > 0){
                if(reg.test(vm.staff.loginid)){
                    console.log('Valid email', vm.staff.loginid)
                    vm.staff.staff_isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.staff.loginid;
                    vm.checkEmailRegistered();
                }else{
                    vm.staff.staff_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.staff.loginid;
                }
            }else{
                vm.staff.staff_isvalidemail=false;
                vm.emailhelp = "staff's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.staff.staff_isvalidemail )
            if(vm.staff.staff_isvalidemail){
                vm.staff.staff_isvalidemail = false;
                axios.get(`loyalty/staffs/`+vm.staff.loginid)
                .then(function (response) {
                    vm.answer = response.data.staff_id;
                    vm.staff.staff_name=response.data.staff_name;
                    vm.emailhelp = 'Email '+vm.staff.staff_email+' already registered ';
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response.status);
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.staff.staff_email+' valid to register '
                        vm.staff.staff_isvalidemail = true;
                    }
                })
            }else{
                 vm.staff.staff_isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.staff.loginid;
            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.staff.contact_no != null && vm.staff.contact_no.length > 0){
                axios.get(`generic/phonecheck/`+vm.staff.contact_no)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.staff.staff_name=response.data.staff_name;
                        vm.staff.staff_country=response.data.countrycode;
                        vm.staff.staff_formatedphone = response.data.phonenumberformat;
                        vm.staff.staff_isvalidphone = response.data.isvalidnumber;
                        vm.staff.staff_phonenofull = response.data.phonenumber;
                        if(response.data.isvalidnumber) {
                            vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' valid to register ';
                            vm.staff.staff_isvalidphone = true;
                        }
                        else {
                            vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' Not valid ';
                        }
                        
                        // if(response.data.isvalidnumber)
                        // vm.staff.staff_isvalidphone = true;
                        // vm.checkPhoneRegistered();
                })
                .catch(function (error) {
                    // vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' Not valid ';
                    vm.staff.staff_formatedphone='';
                    vm.staff.staff_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter staff's valid phone in  E.g: +1 5417543010"
                vm.staff.staff_formatedphone='';
                vm.staff.staff_isvalidphone = false;
            }

        },
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.staff.staff_isvalidphone )
            if(vm.staff.staff_isvalidphone){
                vm.staff.staff_isvalidphone = false;
                axios.get(`loyalty/staffs/`+vm.staff.staff_phonenofull)
                .then(function (response) {
                    vm.answer = response.data.staff_id;
                    vm.staff.staff_name=response.data.staff_name;
                    vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.staff.staff_formatedphone+' valid to register '
                        vm.staff.staff_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.staff.staff_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.staff.staff_formatedphone;
            }
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.staff.status = true;
            }
            else {
                this.staff.status = false;
            }
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_staff_new');
            form.validate({
                rules: {
                    staff_code: {
                        required: true,
                    },
                    staff_pin: {
                        required: true,
                    },
                    username: {
                        required: true,
                    },
                    outlets: {
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

            // let arr = []
            // for(var i in this.addOutlets) {
            //     arr.push({
            //         outlet_id: this.addOutlets[i],                    
            //     })
            // }
            var outlets = vm.staff.outlets.map(out => {
                var name = vm.outletList.filter(o => o.outlet_id = out);
                return {
                    outlet_id: out,
                    outlet_name: name[0].outlet_name
                }
            })
            console.log("Outlets ", outlets);

            axios.post(`/loyalty/staffs`, {                
                'staff_code': vm.staff.staff_code,
                'staff_name': vm.staff.username,
                'staff_contact_no': vm.staff.staff_phonenofull,
                'staff_pin':vm.staff.staff_pin,
                'outlets': outlets,
                'status':(vm.staff.status === true)? 1 : 2,
            }).then(response => {
                console.log(response.data.status);
                this.resetData();
                this.$emit('staffformsave',{'staff':this.staff,'event':this.$event})
                this.$emit('showtoast',{'msg':'Staff Add Success','type':'success','event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                // vm.showErrorMsg(form, 'danger', 'staff create failed !! ' + e.response.data.error_msg);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
            })
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('staffformcancel',{'staff':this.staff,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-staff-form d-none" id="m-staff-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <staffs-form-header v-bind:isformvalid="isValidForm"
                            @staffformcancel="cancelForm()"
                            @staffformsave="submitForm()"
                    ></staffs-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_staff_new">
                                <!--begin: Form Body -->
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div class="m-form__section m-form__section--first">
                                                <div class="m-form__heading">
                                                    <h3 class="m-form__heading-title">staff Details</h3>
                                                </div>
                                               <!-- <div v-if="isEmailRequired" class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Login ID:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                                                            <input v-model="staff.loginid" type="email" name="email"  id="loginid" class="form-control m-input" placeholder="" value="">
                                                            <div class="input-group-prepend"> <span class="input-group-text">
                                                                <i v-if="staff.staff_isvalidemail" class="la la-check-circle-o"></i>
                                                                <i v-else class="la la-times-circle-o"></i>
                                                            </span></div>           
                                                        </div>
                                                        <span class="m-form__help">{{emailhelp}}</span>
                                                    </div>
                                                </div> -->                                               
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Staff Name:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="staff.username" type="text" name="username" id="username"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter staff's first and last names</span>
                                                    </div>
                                                </div>                                                
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Staff Code:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="staff.staff_code" type="text" name="staff_code" id="staff_code"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter staff's code</span>
                                                    </div>
                                                </div>                                                 
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Staff Pin</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="staff.staff_pin" type="password" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" :maxlength="6" name="staff_pin" id="staff_pin"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter staff's Pin</span>
                                                    </div>
                                                </div>
                                                <div v-if="isPhoneRequired"class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text">{{staff.staff_country}}</i></span></div>
                                                            <input v-model="staff.contact_no" :maxlength="15" type="text" name="phone" id="contact_no" class="form-control m-input" placeholder="9876543210" value="">                                                            
                                                            <div class="input-group-prepend"> <span class="input-group-text">
                                                                <i v-if="staff.staff_isvalidphone" class="la la-check-circle-o"></i>
                                                                <i v-else class="la la-times-circle-o"></i>
                                                            </span></div>                                                                
                                                        </div>
                                                        <span class="m-form__help">{{phonenohelp}}</span>
                                                        
                                                    </div>
                                                </div>                                           
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Outlets:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                       <!-- <div class="m-checkbox-inline" v-for="(outlet, i) in outletList">
                                                            <label class="m-checkbox">
                                                                <input v-on:change="changeOptions(outlet.outlet_id, i)" :disabled="outlet.disabled" :checked="outlet.checked" type="checkbox"> {{outlet.outlet_name}}
                                                                <span></span>                                                                
                                                            </label>
                                                        </div> -->
                                                        <select ref='newselect' v-model="staff.outlets" class="form-control m-input m-select2" id="m_select2" name="outlets" multiple="multiple">                                                        
                                                            <option v-for="(outlet, i) in outletList" :value="outlet.outlet_id" >{{outlet.outlet_name}}</option>
                                                        </select>                                                  
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Status:</label>
                                                    <div class="col-xl-9 col-lg-9">                                                        
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                            <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                                <label>
                                                                <input type="checkbox" v-model="staff.status" v-on:change="changeStatus($event)"  name="">
                                                                <span></span>
                                                                </label>
                                                            </span>
                                                        </div>                                                                                           
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
    `,
    mounted: function() {
        var vm = this;
        $(this.$refs.newselect)
        .select2({
           
        })       
        .on('change', function () {            
            vm.staff.outlets = $(this).val();
        });
        
    }
})