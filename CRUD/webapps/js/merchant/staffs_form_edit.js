Vue.component('staffs-form-header-edit', {
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
                        Edit staff
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

Vue.component('staffs-form-edit-component', {
    props:['primaryinput', 'staffid'],
    data: function() {
        return {
            staff: {
                edit_staff_code: '',
                edit_username: '',
                edit_staff_pin: '',
                staff_name:'',
                staff_email:'',
                edit_contact_no:'',
                new_staff_pin: '',
                confirm_new_staff_pin: '',
                status: true,
                staff_country:'IN',
                staff_formatedphone:'',
                staff_phonenofull:'',
                staff_isvalidphone:'',
                staff_isvalidemail:'',
                outlets:[]
            },
            outlet: {
                staff_id: '',
                outlet_id: '',
                outlet_name: ''
            },
            newStaff: true,
            outletList: [],
            addOutlets: [],
            phonenohelp:"Enter staff's valid phone in  E.g: +1 5417543010",
            emailhelp:"staff's communication email address Ex. john@gmail.com",
        }
    },
    computed: {
        // isEmailRequired() {
        //   return (this.primaryinput == 'e'|| this.primaryinput=='b')
        // },
        // isPhoneRequired() {
        //     return (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')
        // },
        isValidForm(){
            var retval = true;
            // if(this.primaryinput == 'e'|| this.primaryinput=='b'){
            //     retval = this.staff.staff_isvalidemail
            // }
            if(retval && (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')){
                retval = this.staff.staff_isvalidphone;
            }
            if(this.staff.outlets.length === 0) {
                retval = false;
            }
            return retval;
        }
    },
    watch:{
        'staff.loginid': function(){
            this.debouncedCheckEmail()
        },
        'staff.edit_contact_no': function(){
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
        'staffid': function() {
            console.log(this.staffid);
            // this.getStaff(this.staffid);
            this.getOutlets();
        },

    },
    created: function () {
        console.log('edit form created')
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
        this.getOutlets(1);
        //   $("#outletselect").append("<option value='1'>test</option>");
    },
    methods: {
        resetData: function() {
            this.staff = {
                edit_staff_code: '',
                edit_username: '',
                edit_staff_pin: '',
                staff_name:'',
                staff_email:'',
                edit_contact_no:'',
                new_staff_pin: '',
                confirm_new_staff_pin: '',
                status: true,
                staff_country:'IN',
                staff_formatedphone:'',
                staff_phonenofull:'',
                staff_isvalidphone:'',
                staff_isvalidemail:'',
                outlets:[]
            },
            this.outlet= {
                staff_id: '',
                outlet_id: '',
                outlet_name: ''
            },
            this.newStaff= true;
            this.outletList= [];
            this.addOutlets= [];
            this.phonenohelp="Enter staff's valid phone in  E.g: +1 5417543010";
            this.emailhelp="staff's communication email address Ex. john@gmail.com";
        },
        
        getOutlets: function() {
            var vm = this;
            vm.outletList = [];
            if(this.staffid) {
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
                    vm.getStaff(this.staffid);
                })
            }
        },
        getStaff: function(staffid) {
            console.log('Tier ID:', staffid);
            var vm = this;
            axios.get('loyalty/staffs/'+staffid)
            .then((response) => {
                let data = response.data;
                vm.staff.edit_staff_code = data.staff_code;
                vm.staff.edit_username = data.staff_name;
                vm.staff.edit_staff_pin = data.staff_pin;
                vm.staff.edit_contact_no = data.staff_contact_no;
                // vm.staff.status = data.status;
                let outlets = data.outlets;
                data.outlets.map(out => {
                    vm.staff.outlets.push(out.outlet_id);
                })
                console.log('outlets ', data);
                //.val(vm.staff.outlets);
                // $('#m_select2_3').find(':selected').data(vm.staff.outlets);
                for(var i in outlets) {                    
                    let outletid = outlets[i].outlet_id;
                    for(var j in vm.outletList) {                     
                        if(vm.outletList[j].outlet_id === outletid) {                            
                            vm.changeOptions(vm.outletList[j].outlet_id, j, '');
                            // this.tierList[j].checked = true;
                        }
                    }
                }
                console.log("Response ", vm.staff.outlets);
                // $("#m_select2_3").select2('val', vm.staff.outlets);
                $('#m_select2_3').val(vm.staff.outlets).trigger("change");
                if(data.status === 1 ) {
                    vm.staff.status = true;
                }
                else {
                    vm.staff.status = false;
                }
                vm.getStaffOutlet(data.edit_staff_code);
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
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            })   
        },
        changeOptions: function(outletid, index, e) {
            if(e !== '') {
                console.log("Event ", e);
                if(e.target.checked) {
                    axios.post(`/loyalty/staffs/addoutlet/${this.staffid}`, {
                        'outlets': [{'outlet_id': outletid}],
                        }).then(response => {                            
                            this.$emit('showtoast',{'msg':'Outlet Add Success','type':'success','event':this.$event})
                        })
                        .catch(e => {
                            if(e.response.status == 403) {
                                window.location.replace('/login');
                            }
                            this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                        })
                }
                if(!e.target.checked) {
                    axios.delete(`/loyalty/staffs/addoutlet/${this.staffid}`, {
                        'outlets': [{'outlet_id': outletid}],
                        }).then(response => {                           
                            this.$emit('showtoast',{'msg':'Outlet Delete Success','type':'success','event':this.$event})
                        })
                        .catch(e => {
                            if(e.response.status == 403) {
                                window.location.replace('/login');
                            }
                            this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                        })
                }
            }
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
        // getStaffOutlet: function(staffid) {
        //     var vm = this;
        //     axios.get('loyalty/staffs/'+ staffid+ '/outlet')
        //     .then((response) => {
        //         console.log("Staff Outlet Response ", response.data);
        //         vm.newStaff = false;
        //         let data = response.data;
        //         vm.outlet.staff_id = data.staff_id;
        //         vm.outlet.outlet_id = data.outlet_id;
        //         vm.outlet.outlet_name = data.outlet_name;
        //         vm.staff.outlet_id = data.outlet_id;
        //     })
        //     .catch((error) => {
        //         console.log("Staff Outlet Error ", error.response);
        //         vm.newStaff = true;
        //     })  
        // },
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
                    vm.staff.staff_isvalidemail = true;
                    vm.emailhelp = 'Email '+vm.staff.staff_email+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.staff.staff_email+' valid to register ';
                        vm.staff.staff_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.staff.staff_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.staff.staff_formatedphone;
            }
        },
        checkPhone:  function () {
            var vm = this;
            console.log("length ", vm.staff.edit_contact_no.length);
            if(vm.staff.edit_contact_no != null && vm.staff.edit_contact_no.length > 0){
                axios.get(`generic/phonecheck/`+vm.staff.edit_contact_no)
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
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
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
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response.status);
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
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_staff_edit');
            form.validate({
                rules: {
                    edit_staff_code: {
                        required: true,
                    },
                    edit_staff_pin: {
                        required: true,
                    },
                    edit_username: {
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
            let arr = []
            for(var i in this.addOutlets) {
                arr.push({
                    outlet_id: this.addOutlets[i],                    
                })
            }
            
            var outlets = vm.staff.outlets.map(out => {
                var name = vm.outletList.filter(o => o.outlet_id = out);
                return {
                    outlet_id: out,
                    outlet_name: name[0].outlet_name
                }
            })
            console.log("Outlets ", outlets);
            axios.put(`/loyalty/staffs/`+ vm.staff.edit_staff_code, {
                'staff_code': vm.staff.edit_staff_code,
                'staff_name': vm.staff.edit_username,
                'staff_contact_no': vm.staff.staff_phonenofull,
                'outlets': outlets,
                'status':(vm.staff.status === true)? 1 : 2,
            }).then(response => {
                console.log(response.data.status);
                // this.resetData();
                this.$emit('staffformsave',{'staff':this.staff,'event':this.$event})
                this.$emit('showtoast',{'msg':'Staff Update Success','type':'success','event':this.$event})
               
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                this.$emit('showtoast',{'msg':'Staff Add Failed','type':'error','event':this.$event})              
            })

        },
        cancelForm:function(){
            this.resetData();
            this.$emit('staffformcancel',{'staff':this.staff,'event':this.$event})
        
        },
        onOutletChange: function(event) {
            console.log(event.target.value);
            var outid = event.target.value;
            var outletDetails = this.outlets.filter(o => o.outlet_id === outid);
            this.outlet.outlet_id = outid;
            this.outlet.outlet_name = outletDetails[0].outlet_name;
            console.log("Outlet Details ", this.outlet);
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
        createStaffOutlet(staffcode) {
            var vm = this;
            var form = $('#m_form_staff_edit');
            axios.post('/loyalty/staffs/'+ staffcode + '/outlet', {
                'outlet_id': vm.outlet.outlet_id,
            }).then(response => {

                this.resetData();
                this.$emit('staffformsave',{'staff':this.staff,'event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                vm.showErrorMsg(form, 'danger', 'staff outlet update failed !! ' + e.response.data.error_msg);
            })
        },
        updateStaffOutlet(staffcode) {
            var vm = this;
            var form = $('#m_form_staff_edit');
            axios.put('/loyalty/staffs/'+ staffcode + '/outlet', {
                'outlet_id': vm.outlet.outlet_id,
            }).then(response => {

                this.resetData();
                this.$emit('staffformsave',{'staff':this.staff,'event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                vm.showErrorMsg(form, 'danger', 'staff outlet update failed !! ' + e.response.data.error_msg);
            })
        },
        resetPassword: function() {
            console.log("Reset Password")
            var vm = this;
            var form = $('#m_form_staff_reset_password');
            var modal = $('#m_modal_reset');
            form.validate({
                rules: {
                    new_staff_pin: {
                        required: true,
                    },
                    confirm_new_staff_pin:{
                        required: true,
                        equalTo: "#new_staff_pin"
                    }
                }
            });
            if(!form.valid()) {
                return;
            }
            axios.put('/loyalty/staffs/'+ this.staffid + '/pin/reset', {
                'new_staff_pin': vm.staff.new_staff_pin,
            }).then(response => {

                this.resetData();
                modal.modal("hide");
                this.$emit('showtoast',{'msg':'Staff Pin Update Success','type':'success','event':this.$event})
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                this.$emit('showtoast',{'msg':'Staff Pin Update Failed','type':'error','event':this.$event})
            })
        }
    },
    template: `
    <div class="m-grid__item m-content-staff-form d-none" id="m-staff-form-edit" >
        <div class="m-content">
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_reset" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Reset Staff Pin</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_staff_reset_password">
                                <div class="form-group m-form__group row">
                                    <label class="col-xl-3 col-lg-3 col-form-label"> New Staff Pin:</label>
                                    <div class="col-xl-9 col-lg-9">
                                        <input v-model="staff.new_staff_pin" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" :maxlength="6" type="password" name="new_staff_pin" id="new_staff_pin"  class="form-control m-input" placeholder="" value="">
                                        <span class="m-form__help">Please enter staff's pin</span>
                                    </div>
                                </div>
                                <div class="form-group m-form__group row">
                                    <label class="col-xl-3 col-lg-3 col-form-label"> Confirm Staff Pin:</label>
                                    <div class="col-xl-9 col-lg-9">
                                        <input v-model="staff.confirm_new_staff_pin" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" :maxlength="6" type="password" name="confirm_new_staff_pin" id="confirm_new_staff_pin"  class="form-control m-input" placeholder="" value="">
                                        <span class="m-form__help">Please confirm staff's pin</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" v-on:click="resetPassword()" class="btn btn-primary">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--end::Modal-->
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <staffs-form-header-edit v-bind:isformvalid="isValidForm"
                            @staffformcancel="cancelForm()"
                            @staffformsave="submitForm()"
                    ></staffs-form-header-edit>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_staff_edit">
                            <!--begin: Form Body -->
                            <div class="m-portlet__body">
                                <div class="row">
                                    <div class="col-xl-8">
                                        <div class="m-form__section m-form__section--first">
                                            <div class="m-form__heading">
                                                <h3 class="m-form__heading-title">staff Details</h3>
                                            </div>                                            
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label"> Staff Name:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <input v-model="staff.edit_username" type="text" name="edit_username" id="edit_username"  class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please enter staff's first and last names</span>
                                                </div>
                                            </div>                                                
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label"> Staff Code:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <input v-model="staff.edit_staff_code" readonly type="text" name="edit_staff_code" id="edit_staff_code"  class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please enter staff's code</span>
                                                </div>
                                            </div>                                                
                                            <!-- <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label"> Staff Pin:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <input v-model="staff.edit_staff_pin"  type="password" name="edit_staff_pin" id="edit_staff_pin"  class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please enter staff's pin</span>
                                                </div>
                                            </div> -->
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                                                        <div class="input-group-prepend"><span class="input-group-text">{{staff.staff_country}}</i></span></div>
                                                        <input v-model="staff.edit_contact_no" type="text" name="phone" id="edit_contact_no" class="form-control m-input" placeholder="9876543210" value="">                                                            
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
                                                            <input v-on:change="changeOptions(outlet.outlet_id, i, $event)" :disabled="outlet.disabled" :checked="outlet.checked" type="checkbox"> {{outlet.outlet_name}}
                                                            <span></span>                                                                
                                                        </label>
                                                    </div>     -->
                                                    
                                                    <select ref='select' v-model="staff.outlets" class="form-control m-input m-select2" id="m_select2_3" name="param" multiple="multiple">                                                        
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
                                            <div class="form-group m-form__group row">
                                                <div class="offset-3 col-xl-9 col-lg-9"> 
                                                    <a href="#" data-toggle="modal" data-target="#m_modal_reset" class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill">
                                                        <span>                                                        
                                                            <span> Reset Staff Pin</span>
                                                        </span>
                                                    </a>
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
        $(this.$refs.select)
        .select2({
           
        })
        // .on('select2:select', function (e) {
        //     var data = e.params.data.element.value;
        //     console.log("new Selected value ", data);
        //     axios.post(`/loyalty/staffs/addoutlet/${vm.staffid}`, {
        //         'outlets': [{outlet_id:data}],
        //         }).then(response => {                            
        //             vm.$emit('showtoast',{'msg':'Outlet Add Success','type':'success','event':vm.$event})
        //         })
        //         .catch(e => {
        //             vm.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':vm.$event})
        //         })
        // })
        .on('change', function () {
            // self.$emit('input', $(this).val());
            vm.staff.outlets = $(this).val();
        });
        // .on('select2:unselect', function (e) {
        //     var deleteVal = e.params.data.element.value;
            
        //     deleteData =  {
        //         'outlets': [{"outlet_id": deleteVal}]
        //         }
        //         console.log("Delete Selected value ", deleteData);
        //     axios.delete(`/loyalty/staffs/addoutlet/${vm.staffid}/${deleteVal}`).then(response => {                           
        //             vm.$emit('showtoast',{'msg':'Outlet Delete Success','type':'success','event':vm.$event})
        //         })
        //         .catch(e => {
        //             vm.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':vm.$event})
        //         })
        // });
        
    }
})