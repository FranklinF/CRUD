Vue.component('outlets-edit-form-header', {
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
                        Edit Outlet
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('outletformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button id="outlet_update_submit" v-on:click="$emit('outletformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('edit-outlets-form-component', {
    props:['primaryinput', 'outletid'],
    data: function() {
        return {
            outlet: {
                outlet_name: '',
                outlet_address: '',
                outlet_latitude: '',
                outlet_longitude: '',
                outlet_location: '',
                outlet_contact: '',
                outlet_desc: '',
                outlet_email_id: '',
                status: true,
                outlet_state: '',
                outlet_country: '',
                outlet_country_code:'IN',
                outlet_contactnofull:'',
                outlet_isvalidphone: '',
                outlet_isvalidemail: ''
            },
            countries: [],
            phonenohelp:"Enter outlet's valid phone in  E.g: +1 5417543010",
            emailhelp:"outlet's communication email address Ex. john@gmail.com",
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
                retval = this.outlet.outlet_isvalidemail
            }
            if(retval && (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')){
                retval = this.outlet.outlet_isvalidphone;
            }
            return retval;
        }
    },
    watch:{
        'outlet.outlet_email_id': function(){
            this.debouncedCheckEmail()
        },
        'outlet.outlet_contact': function(){
            this.debouncedCheckNumber()
        },
        'outletid': function() {
            console.log(this.outletid);
            this.getOutlet(this.outletid);
        },
        'outlet.status': function(newValue, oldValue) {
            console.log("Active", Number(newValue));
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
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
        this.getCountries();
    },
    methods: {
        resetData: function() {
            return {                
                outlet_name: '',
                outlet_address: '',
                outlet_latitude: '',
                outlet_longitude: '',
                outlet_location: '',
                outlet_contact: '',
                outlet_open_time: '',
                outlet_close_time: '',
                outlet_desc: '',
                outlet_email_id: '',
                status: true,
                outlet_state: '',
                outlet_country: '',
                outlet_country_code:'IN',
                outlet_contactnofull:'',
                outlet_isvalidphone: ''
            };
        },
        getCountries: function() {
            var vm = this;
            axios.get('loyalty/utils/COUNTRY')
            .then(response => {
                console.log("Countries ", response);
                vm.countries = response.data.details;
            })
            .catch(e => {
                console.log("Error ", e);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },
        getOutlet: function(outletid){
            var vm = this;
            axios.get('loyalty/outlets/'+outletid)
            .then((response) => {
                console.log("Response ", response.data);
                let data = response.data;
                vm.outlet.outlet_id = data.outlet_id;
                vm.outlet.outlet_name = data.outlet_name;
                vm.outlet.outlet_address = data.outlet_address;
                vm.outlet.outlet_latitude = data.outlet_latitude;
                vm.outlet.outlet_longitude = data.outlet_longitude;
                vm.outlet.outlet_location = data.outlet_location;
                vm.outlet.outlet_contact = data.outlet_contact;
                vm.outlet.outlet_desc = data.outlet_desc;
                vm.outlet.outlet_email_id = data.outlet_email_id;
                if(data.status === 1 ) {
                    vm.outlet.status = true;
                }
                else {
                    vm.outlet.status = false;
                }
                var outlet_hrs = data.outlet_business_hrs.split('-');
                var opentime = outlet_hrs[0];
                var closetime = outlet_hrs[1];
                vm.outlet.outlet_open_time = opentime;
                vm.outlet.outlet_close_time = closetime;
                vm.outlet.outlet_state = data.outlet_state;
                vm.outlet.outlet_country = data.outlet_country;
                if(data.status === 1) {
                    console.log("Staff ", 'active');
                    $('#active').addClass('active');
                    $('#notactive').removeClass('active');
                }
                else {
                    $('#notactive').addClass('active');
                    $('#active').removeClass('active');
                }
            })
            .catch((error) => {
                console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            }) 
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

            console.log('check mail',vm.outlet.outlet_email_id);
            if(vm.outlet.outlet_email_id != null && vm.outlet.outlet_email_id.length > 0){
                if(reg.test(vm.outlet.outlet_email_id)){
                    console.log('Valid email', vm.outlet.outlet_email_id)
                    vm.outlet.outlet_isvalidemail=true;
                    vm.checkEmailRegistered();
                }else{
                    vm.outlet.outlet_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.outlet.outlet_email_id;
                }
            }else{
                vm.outlet.outlet_isvalidemail=false;
                vm.emailhelp = "outlet's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.outlet.outlet_isvalidemail )
            if(vm.outlet.outlet_isvalidemail){
                vm.outlet.outlet_isvalidemail = false;
                axios.get(`loyalty/outlets/`+vm.outlet.outlet_email_id)
                .then(function (response) {
                    vm.answer = response.data.outlet_id;
                    // vm.outlet.outlet_name=response.data.outlet_name;
                    vm.emailhelp = 'Email '+vm.outlet.outlet_email_id+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.outlet.outlet_email_id+' valid to register '
                        vm.outlet.outlet_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.outlet.outlet_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.outlet.outlet_formatedphone;
            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.outlet.outlet_contact != null && vm.outlet.outlet_contact.length > 0){
                axios.get(`generic/phonecheck/`+vm.outlet.outlet_contact)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        // vm.outlet.outlet_name=response.data.outlet_name;
                        // vm.outlet.outlet_country=response.data.countrycode;
                        vm.outlet.outlet_formatedphone = response.data.phonenumberformat;
                        vm.outlet.outlet_isvalidphone = response.data.isvalidnumber;
                        vm.outlet.outlet_contactnofull = response.data.phonenumber;
                        vm.checkPhoneRegistered();
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.outlet.outlet_formatedphone='';
                    vm.outlet.outlet_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter outlet's valid phone in  E.g: +1 5417543010"
                vm.outlet.outlet_formatedphone='';
                vm.outlet.outlet_isvalidphone = false;
            }

        },
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.outlet.outlet_isvalidphone )
            if(vm.outlet.outlet_isvalidphone){
                vm.outlet.outlet_isvalidphone = false;
                axios.get(`loyalty/outlets/`+vm.outlet.outlet_contactnofull)
                .then(function (response) {
                    vm.answer = response.data.outlet_id;
                    vm.outlet.outlet_name=response.data.outlet_name;
                    vm.phonenohelp = 'Phone Number '+vm.outlet.outlet_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response.status);
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.outlet.outlet_formatedphone+' valid to register '
                        vm.outlet.outlet_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.outlet.outlet_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.outlet.outlet_formatedphone;
            }
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.outlet.status = true;
            }
            else {
                this.outlet.status = false;
            }
        },
        submitForm:function(){
            var vm = this;
            var btn = $('#outlet_update_submit');
            var form = $('#m_form_outlet_edit');
            form.validate({
                rules: {
                    outlet_name: {
                        required: true,
                    },
                    outlet_address: {
                        required: true,
                    },
                    outlet_contact: {
                        required: true,
                    },
                    outlet_email_id: {
                        required: true,
                    },
                    outlet_close_time: {
                        required: true,
                    },
                    outlet_open_time: {
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
            console.log(vm.outlet);
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            axios.put(`/loyalty/outlets/`+ this.outletid, { 
                outlet_id: this.outletid,                              
                outlet_name: vm.outlet.outlet_name,
                outlet_address: vm.outlet.outlet_address,
                outlet_latitude: vm.outlet.outlet_latitude,
                outlet_longitude: vm.outlet.outlet_longitude,
                outlet_location: vm.outlet.outlet_location,
                outlet_contact: vm.outlet.outlet_contact,
                outlet_desc: vm.outlet.outlet_desc,
                outlet_email_id: vm.outlet.outlet_email_id,
                status: (vm.outlet.status === true)? 1 : 2,
                outlet_state: vm.outlet.outlet_state,
                outlet_business_hrs: vm.outlet.outlet_open_time + '-' + vm.outlet.outlet_close_time,
                outlet_country: vm.outlet.outlet_country,
            }).then(response => {
                console.log(response.data.status);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Outlet has been updated','type':'success','event':this.$event})
                this.resetData();
                this.$emit('outletformsave',{'outlet':this.outlet,'event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                // vm.showErrorMsg(form, 'danger', 'outlet create failed !! ' + e.response.data.error_msg);
            })
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('outletformcancel',{'outlet':this.outlet,'event':this.$event})
        
        },
        openTime: function(time) {
            console.log("Open   Time ", time);
            this.outlet.outlet_open_time = $('#m_timepicker_open_edit').val();
            
        },
        closeTime: function(time) {
            this.outlet.outlet_close_time = $('#m_timepicker_close_edit').val();
        }
    },
    template: `
    <div class="m-grid__item m-content-outlet-form d-none" id="m-outlet-form-edit" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <outlets-edit-form-header v-bind:isformvalid="isValidForm"
                            @outletformcancel="cancelForm()"
                            @outletformsave="submitForm()"
                    ></outlets-edit-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_outlet_edit">
                                <!--begin: Form Body -->
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div class="m-form__section m-form__section--first">
                                                <div class="m-form__heading">
                                                    <h3 class="m-form__heading-title">Outlet Details</h3>
                                                </div>                                               
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_name" type="text" name="name" id="outlet_name"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's name</span>
                                                    </div>
                                                </div>                                              
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Description:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_desc" type="text" name="name" id="outlet_desc"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's description</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Email:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                                                            <input v-model="outlet.outlet_email_id" type="email" name="email"  id="outlet_email_id" class="form-control m-input" placeholder="" value="">
                                                            <div class="input-group-prepend"> <span class="input-group-text">
                                                                <i v-if="outlet.outlet_isvalidemail" class="la la-check-circle-o"></i>
                                                                <i v-else class="la la-times-circle-o"></i>
                                                            </span></div>           
                                                        </div>
                                                        <span class="m-form__help">{{emailhelp}}</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                            <div class="input-group-prepend"><span class="input-group-text">{{outlet.outlet_country_code}}</i></span></div>
                                                            <input v-model="outlet.outlet_contact" type="text" name="phone" id="outlet_contact" class="form-control m-input" placeholder="9876543210" value="">                                                            
                                                            <div class="input-group-prepend"> 
                                                                <span class="input-group-text">
                                                                    <i v-if="outlet.outlet_isvalidphone" class="la la-check-circle-o"></i>
                                                                    <i v-else class="la la-times-circle-o"></i>
                                                                </span>
                                                            </div>                                                                
                                                        </div>
                                                        <span class="m-form__help">{{phonenohelp}}</span>
                                                        
                                                    </div>
                                                </div>  
                                                <div class="form-group m-form__group row">
                                                    <label class="col-form-label col-lg-3 col-sm-12">Outlet Timing</label>
                                                    <div class="col-lg-4 col-md-9 col-sm-12">
                                                        <input class="form-control opentime"  name="outlet_open_time"  v-model="outlet.outlet_open_time" id="m_timepicker_open_edit" readonly placeholder="Open time" type="text"/>
                                                    </div>
                                                    <div class="col-lg-4 col-md-9 col-sm-12">
                                                        <input class="form-control"  name="outlet_close_time" v-model="outlet.outlet_close_time" id="m_timepicker_close_edit" readonly placeholder="Close time" type="text"/>
                                                    </div>
                                                </div>                                                   
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Area:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_location" ref="autocomplete"  onfocus="value = ''" type="text" name="name" id="outlet_location"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's location</span>
                                                    </div>
                                                </div>                                                
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Address:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_address" type="text" name="name" id="outlet_address"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's address line 1</span>
                                                    </div>
                                                </div>                                                                                                
                                                <!--  <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Address 2:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_address2" type="text" name="name" id="outlet_address"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's address line 2</span>
                                                    </div>
                                                </div>                                               
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Latitude:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_latitude" type="text" name="name" id="outlet_latitude"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's latitude</span>
                                                    </div>
                                                </div>                                               
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Longitude:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_longitude" type="text" name="name" id="outlet_longitude"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's longitude</span>
                                                    </div>
                                                </div>     -->                                         
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> State:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <input v-model="outlet.outlet_state" type="text" name="name" id="outlet_state"  class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please enter outlet's state</span>
                                                    </div>
                                                </div>                                               
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Country:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <select class="form-control m-input" v-model="outlet.outlet_country" id="outletselect">
                                                            <option v-for="country in countries" v-bind:value="country.lookup_name">
                                                                {{ country.lookup_name }}
                                                            </option>
                                                        </select>
                                                        <span class="m-form__help">Please select outlet's country</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">Status:</label>
                                                    <div class="col-xl-9 col-lg-9">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                            <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                                <label>
                                                                <input type="checkbox" v-model="outlet.status" v-on:change="changeStatus($event)"  name="">
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
    mounted() {
        this.autocomplete = new google.maps.places.Autocomplete(
          (this.$refs.autocomplete),
          {types: ['geocode']}
        );
        var vm = this;
        $('#m_timepicker_open_edit').timepicker({
            defaultTime: '',
            showInputs: false
        }).on('change', function(){
             vm.outlet.outlet_open_time = $(this).val();
          });
        $('#m_timepicker_close_edit').timepicker({
            defaultTime: '',
            showInputs: false
        }).on('change', function(){
             vm.outlet.outlet_close_time = $(this).val();
          });
        // $('#m_timepicker_open_edit').timepicker();
        // $('#m_timepicker_open_edit').on('change', function(){
        //      vm.outlet.outlet_open_time = $(this).val();
        //   });
        //   $('#m_timepicker_close_edit').timepicker();
        // $('#m_timepicker_close_edit').on('change', function(){
        //      vm.outlet.outlet_close_time = $(this).val();
        //   });
        this.autocomplete.addListener('place_changed', () => {
            let place = this.autocomplete.getPlace();

            let ac = place.address_components;
            let lat = place.geometry.location.lat();
            let lon = place.geometry.location.lng();
            let city = ac[0]["short_name"];
            this.outlet.outlet_latitude = lat;
            this.outlet.outlet_longitude = lon;
            this.outlet.outlet_location = city;
            console.log(`The user picked ${JSON.stringify(ac)} with the coordinates ${lat}, ${lon}`);
          });
      }
})