Vue.component('programs-form-header', {
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
                        Program
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('programformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>               
                <button v-on:click="$emit('programformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('programs-form-edit-component', {
    props:['primaryinput', 'programid'],
    data: function() {
        return {
            program: {              
                program_name: '',
                program_description: '',
                program_expiry: '',
                status: '1',
                program_type: 'N',
                program_expiry_type: '0',
                program_expiry_date:'',
                program_ceiling: '',
                program_tiers: '',
                token_id: '',
                tiers: []
            },
            // programid: '',
            phonenohelp:"Enter program's valid phone in  E.g: +1 5417543010",
            emailhelp:"program's communication email address Ex. john@gmail.com",
            showExpiry: false,
            tierList: [],
            addTiers: [],
            newProgram: true,
            checked: true,
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
                retval = this.program.program_name
            }
            if(retval && (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')){
                retval = this.program.program_name;
            }
            return retval;
        }
    },
    watch:{
        'program.program_email': function(){
            this.debouncedCheckEmail()
        },
        'program.program_phone': function(){
            this.debouncedCheckNumber()
        },
        'program.program_expiry_type': function() {
            this.checkExpiryType()
        },
        'programid': function() {
            console.log('Program ID:', this.programid);
            // this.getProgram(this.programid);
            this.getTiers();
        }

    },
    created: function () {
        console.log('Edit form created')
        console.log('program is: ' + this.programid);
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
    },
    methods: {
        resetData: function() {
            return {
                program_name: '',
                program_description: '',
                program_expiry: '',
                status: '1',
                program_type: 'N',
                program_expiry_type: '0',
                program_expiry_date:'',
                program_ceiling: '',
                program_tiers: '',
                token_id: ''
            };
        },
        getTiers: function() {
            var vm = this;
            vm.tierList = [];
            axios.get('loyalty/tiers?page=1')
            .then((response) => {
                let data = [];
                data = response.data.tiers;
                console.log("Response tier ", data);                
                let tid = 'DEFAULT';                               
                for(var i in data) {                    
                    if(tid == data[i].tier_id) {                        
                        vm.tierList.push({
                            tier_id: data[i].tier_id,
                            tier_name: data[i].tier_name,
                            control: data[i].tier_id,
                            checked: true,
                            disabled: true,
                            placeholder: data[i].tier_name + ' Loyalty Points'
                          })
                        //   if(vm.newProgram) {
                        //     vm.changeOptions(data[i].tier_id, i); 
                        //   }                        
                    }
                    else {                        
                        vm.tierList.push({
                            tier_id: data[i].tier_id,
                            tier_name: data[i].tier_name,
                            control: data[i].tier_id,
                            checked: false,
                            disabled: false,
                            placeholder: data[i].tier_name + ' Loyalty Points'
                          })
                    } 
                  }
                  vm.getProgram(vm.programid);      
            })
            .catch((error) => {
                if(eror.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            }) 
            
        },
        programChange: function(e) {
            this.programid = e.target.value;
        },
        getPrograms: function() {
            axios.get('loyalty/programs?page=1')
            .then((response) => {
                let programs = response.data.programs;
                if(programs.length > 0) {
                    this.programid = programs[0].program_id;
                    this.newProgram = false;
                    this.getTiers();
                    this.getProgram(this.programid);
                }
                else {
                    this.newProgram = true;
                }
            })
            .catch((error) => {
                this.newProgram = true;
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            }) 
        },
        getProgram: function(programid) {
            console.log('Program ID:', programid);
            var vm = this;
            axios.get('loyalty/programs/'+programid)
            .then((response) => {
                let data = response.data;
                vm.newProgram = false;
                vm.program.program_name = data.program_name;
                vm.program.program_description = data.program_description;
                vm.program.program_expiry = data.program_expiry;
                vm.program.status = data.status;
                if(data.status === 1) {
                    vm.checked = true;
                }
                else {
                    vm.checked = false;
                }
                vm.program.program_type = data.program_type;
                vm.program.program_expiry_type = data.program_expiry_type.toString();
                vm.program.program_ceiling = data.program_ceiling;
                vm.program.token_id = data.token_id;                
                
                if(data.program_expiry_type === 4) {
                    vm.program.program_expiry_date = moment(data.program_expiry, "YYYYMMDD").format("YYYY-MM-DD");
                }
                let tiers = data.program_tiers;
                console.log("Tier length", tiers.length);
                if(tiers.length === 0) {
                    vm.changeOptions('DEFAULT', 0); 
                }
                else {
                    for(var i in tiers) {
                        console.log("Response ", tiers[i]);
                        let loyalty = tiers[i].tier_loyalty;
                        let tierid = tiers[i].tier_id;
                        for(var j in vm.tierList) {  
                            console.log("vm.tierList[j] ");                      
                            if(vm.tierList[j].tier_id === tierid) {
                                vm.tierList[j].control = loyalty;
                                vm.program.tiers[tierid] = loyalty;
                                vm.changeOptions(vm.tierList[j].tier_id, j);
                                // this.tierList[j].checked = true;
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                this.newProgram = true;
                vm.changeOptions('DEFAULT', 0); 
                this.getTokens();
            }) 

        },
        checkExpiryType: function() {
            console.log(typeof this.program.program_expiry_type)
            if(Number(this.program.program_expiry_type) === 1) {
                this.showExpiry = true;
                console.log("if", this.program.program_expiry_type)
            }
            else if(Number(this.program.program_expiry_type) === 2) {
                this.showExpiry = true;
            }
            else if(Number(this.program.program_expiry_type) === 3) {
                this.showExpiry = true;
            }
            else {
                console.log("else", this.program.program_expiry_type)
                this.showExpiry = false;
            }
        },
        // getTokens: function() {
        //     var vm = this;
        //     axios.get('loyalty/tokens')
        //     .then((response) => {
        //         let data = [];
        //         data = response.data.tokens;
        //         console.log("Token ", data);                
        //         let tokenid = data[0].symbol;
        //         vm.program.token_id = tokenid; 
        //     })
        //     .catch((error) => {
        //         console.log("Error ", error.response);
        //     }) 
        // },
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
        checkEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            console.log('check mail',vm.program.program_email);
            if(vm.program.program_email != null && vm.program.program_email.length > 0){
                if(reg.test(vm.program.program_email)){
                    console.log('Valid email', vm.program.program_email)
                    vm.program.program_isvalidemail=true;
                    vm.checkEmailRegistered();
                }else{
                    vm.program.program_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.program.program_email;
                }
            }else{
                vm.program.program_isvalidemail=false;
                vm.emailhelp = "program's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.program.program_isvalidemail )
            if(vm.program.program_isvalidemail){
                vm.program.program_isvalidemail = false;
                axios.get(`loyalty/programs/`+vm.program.program_email)
                .then(function (response) {
                    vm.answer = response.data.program_id;
                    vm.program.program_name=response.data.program_name;
                    vm.emailhelp = 'Email '+vm.program.program_email+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.program.program_email+' valid to register '
                        vm.program.program_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.program.program_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.program.program_formatedphone;
            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.program.program_phone != null && vm.program.program_phone.length > 0){
                axios.get(`generic/phonecheck/`+vm.program.program_phone)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.program.program_name=response.data.program_name;
                        vm.program.program_country=response.data.countrycode;
                        vm.program.program_formatedphone = response.data.phonenumberformat;
                        vm.program.program_isvalidphone = response.data.isvalidnumber;
                        vm.program.program_phonenofull = response.data.phonenumber;
                        vm.checkPhoneRegistered();
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.program.program_formatedphone='';
                    vm.program.program_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter program's valid phone in  E.g: +1 5417543010"
                vm.program.program_formatedphone='';
                vm.program.program_isvalidphone = false;
            }

        },
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.program.program_isvalidphone )
            if(vm.program.program_isvalidphone){
                vm.program.program_isvalidphone = false;
                axios.get(`loyalty/programs/`+vm.program.program_phonenofull)
                .then(function (response) {
                    vm.answer = response.data.program_id;
                    vm.program.program_name=response.data.program_name;
                    vm.phonenohelp = 'Phone Number '+vm.program.program_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.program.program_formatedphone+' valid to register '
                        vm.program.program_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.program.program_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.program.program_formatedphone;
            }
        },
        changeOptions: function(tierid, index) {
            
            if(tierid !== 'DEFAULT') {
                this.tierList[index].checked = !this.tierList[index].checked;
              }  
            if(this.addTiers.length === 0) {
                this.addTiers.push(tierid);
                // this.program[tierid] = '';
            }            
            else {
                let find = this.addTiers.findIndex(tid => tid === tierid);
                console.log("Find ", find, tierid);
                if(find === -1) {
                this.addTiers.push(tierid);                
                }
                else {
                this.addTiers.splice(find, 1);
                delete this.program.tierid
                }
            }
            console.log("Edit changeOptions ", this.addTiers);
        },
        changeTierLoyalty: function(event, tierid) {
            
            this.program.tiers[tierid] = event.target.value;
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.program.status = 1;
            }
            else {
                this.program.status = 2;
            }
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_program_edit');
            form.validate({
                rules: {
                    program_name: {
                        required: true,
                    },
                    program_expiry_type: {
                        required: true,
                    },
                    status: {
                        required: true,
                    }
                }
            });
            $('.expiry').each(function() {
                $(this).rules("add", 
                    {
                        required: true,
                        min: 1,
                        number: true
                    });
            });
            var date = '';
            if(vm.program.program_expiry_type === '4') {
                $("#program_expiry_date").rules("add", {required:true});
                
                let d = $('#program_expiry_date').val().split('-'); // vm.program.program_expiry_date.split('-');
                date = d[0]+d[1]+d[2];
            }
            else if(vm.program.program_expiry_type !== '0') {
                $("#program_expiry").rules("add", {required:true});
            }
            if (!form.valid()) {
                return;
            }

            let arr = []
            for(var i in this.addTiers) {
                arr.push({
                    tier_id: this.addTiers[i],
                    tier_loyalty: vm.program.tiers[this.addTiers[i]]
                })
            }
            
            let data = {      
            program_name: vm.program.program_name,
            program_description: vm.program.program_description,
            program_expiry: (vm.program.program_expiry_type === '4' )? date : vm.program.program_expiry,
            // status: (vm.program.status === true)? 1:2,
            program_type: vm.program.program_type,
            program_expiry_type: Number(vm.program.program_expiry_type),
            program_ceiling: vm.program.program_ceiling,
            program_loyalty: vm.program.program_loyalty,
            program_tiers: arr,
            token_id: vm.program.token_id
            }
            console.log("program ", data, vm.newProgram);
            // if(vm.newProgram) {
            //     console.log("Post");
            //     axios.post(`/loyalty/programs`, data).then(response => {
            //         console.log(response.data.status);
            //         this.$emit('showtoast',{'msg':'Program has been Added success','type':'success','event':this.$event})
            //         // vm.showErrorMsg(form, 'success', 'program create success !! ');
            //     })
            //     .catch(e => {
            //         console.log('failure call:', e.response.data.error_msg);
            //         this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
            //         // vm.showErrorMsg(form, 'danger', 'program create failed !! ' + e.response.data.error_msg);
            //     })
            // }
            // else {
                console.log("PUT");
                axios.put(`/loyalty/programs/`+ this.programid, data).then(response => {
                    console.log(response.data.status);
                    this.$emit('programformsave',{'program':this.program,'event':this.$event})
                    this.$emit('showtoast',{'msg':'Program has been update success','type':'success','event':this.$event})
                    // vm.showErrorMsg(form, 'success', 'program update success !! ');
                
                })
                .catch(e => {
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log('failure call:', e.response.data.error_msg);
                    this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                    // vm.showErrorMsg(form, 'danger', 'program update failed !! ' + e.response.data.error_msg);
                })
            // }                
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('programformcancel',{'program':this.program,'event':this.$event})
        
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
              evt.preventDefault();;
            } else {
              return true;
            }
          }
    },
    template: `
    <div class="m-grid__item m-content-program-form d-none" id="m-program-form-edit" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <programs-form-header v-bind:isformvalid="isValidForm" 
                            @programformcancel="cancelForm()"                          
                            @programformsave="submitForm()"
                    ></programs-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_program_edit">
                                <!--begin: Form Body -->
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div class="m-form__section m-form__section--first">
                                                <div class="m-form__heading">
                                                    <h3 class="m-form__heading-title">{{programid}} Program Details</h3>
                                                </div>
                                                <div  class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                        <input v-model="program.program_name" type="text" name="name"  id="program_name" class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please Enter Program's Name</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Description</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">                                                          
                                                        <textarea v-model="program.program_description" type="text" name="description" id="program_description" class="form-control m-input" placeholder="" value=""></textarea>
                                                        <span class="m-form__help">Please Enter Program's Descriptions</span>
                                                        
                                                    </div>
                                                </div>                                                
                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Issue Type:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="m-radio-inline">
                                                            <label class="m-radio">
                                                            <input v-model="program.program_type" value="F" type="radio"> Fixed Loyalty
                                                            <span></span>
                                                            </label> 
                                                            <label class="m-radio">
                                                            <input v-model="program.program_type" value="P" type="radio"> Percentage of Receipt Amount
                                                            <span></span>
                                                            </label>
                                                        </div>
                                                        <span class="m-form__help">Please select program's type</span>
                                                    </div>
                                                </div>                                            
                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* {{(program.program_type === 'P')? 'Percentage of Loyalty By Tiers':'Fixed Loyalty By Tiers'}}:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="m-checkbox-inline" v-for="(tier, i) in tierList">
                                                            <label class="m-checkbox">
                                                                <input v-on:change="changeOptions(tier.tier_id, i)" :disabled="tier.disabled" :checked="tier.checked" type="checkbox"> {{tier.tier_name}}
                                                                <span></span>                                                                
                                                            </label>
                                                            <br />                                                            
                                                            <input v-model="program.tiers[tier.tier_id]" v-on:keypress="isNumber($event)"  v-on:change="changeTierLoyalty($event,tier.tier_id)" type="text" name="expiry" class="expiry form-control m-input" placeholder="">
                                                        </div>                                                       
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row" v-if="program.program_type === 'P'">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Maximum Loyalty Limit</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">                                                           
                                                        <input v-model="program.program_ceiling" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" type="text" name="ceiling" id="program_ceiling" class="form-control m-input" placeholder="" value="">
                                                        <span class="m-form__help">Please Enter Program's Maximum Loyalty Limit</span>                                                        
                                                    </div>
                                                </div>                                                 
                                                <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <!--<div class="m-radio-inline">
                                                            <label class="m-radio">
                                                            <input v-model="program.program_expiry_type" value="0" type="radio"> No Expiry
                                                            <span></span>
                                                            </label>
                                                            <label class="m-radio">
                                                            <input v-model="program.program_expiry_type" value="1" type="radio"> Expiry in Days
                                                            <span></span>
                                                            </label>
                                                            <label class="m-radio">
                                                            <input v-model="program.program_expiry_type" value="2" type="radio"> Expiry in Weeks
                                                            <span></span>
                                                            </label>
                                                            <label class="m-radio">
                                                            <input v-model="program.program_expiry_type" value="3" type="radio"> Expiry in Months
                                                            <span></span>
                                                            </label>
                                                        </div> -->
                                                       <select class="form-control m-input m_select2" v-model="program.program_expiry_type" id="m_select2_1" name="param">
                                                            <option value="0">No Expiry</option>
                                                            <option value="1">Expiry in Days</option>
                                                            <option value="2">Expiry in Weeks</option>
                                                            <option value="3">Expiry in Months</option>
                                                        </select> 
                                                        <span class="m-form__help">Please select Program's Expiry Type</span>
                                                    </div>
                                                </div>
                                                <div class="form-group m-form__group row" v-if="showExpiry">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term Value</label>                                                   
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="input-group">
                                                            <input v-model="program.program_expiry" type="text" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="program_expiry" id="program_expiry" class="form-control m-input" placeholder="" value="">
                                                            <div class="input-group-append"><span class="input-group-text" id="basic-addon2">{{(program.program_expiry_type == 1)? 'Days' :(program.program_expiry_type == 2)? 'Weeks': 'Months'}}</span></div>
                                                        </div>                                                                                                                  
                                                        <span class="m-form__help">Please Enter Loyalty Expiry Term Value</span>                                                        
                                                    </div>
                                                </div> 
                                                <!-- <div class="form-group m-form__group row" v-if="program.program_expiry_type === '4'">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Program Expiry Date</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">     
                                                        <input type="text" v-model="program.program_expiry_date" name="program_expiry_date" id="program_expiry_date" data-provide="datepicker" data-date-start-date="d" data-date-format="yyyy-mm-dd" class="form-control m-input" readonly placeholder="YYYY-MM-DD"/>
                                                        <span class="m-form__help">Please Specify Program Expiry Date</span>                                                        
                                                    </div>
                                                </div>    --> 
                                                <!-- <div class="form-group m-form__group row">
                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Status:</label>
                                                    <div class="col-lg-6 col-md-9 col-sm-12">
                                                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                            <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                                <label>
                                                                <input type="checkbox" v-model="program.status" v-on:change="changeStatus($event)" checked="checked" name="">
                                                                <span></span>
                                                                </label>
                                                            </span>
                                                        </div>
                                                        
                                                    </div>
                                                </div> -->  
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
})