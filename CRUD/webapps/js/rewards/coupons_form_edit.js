Vue.component('coupons-form-header-edit', {
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
                        Edit coupon
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('couponformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button v-on:click="$emit('couponformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('coupons-form-edit-component', {
    props:['primaryinput', 'couponid'],
    data: function() {
        return {
            coupons: {
                merchant_id: '',
                coupon_name: '',
                coupon_code_desc: '',
                coupon_code: '',
                coupon_valid_from_date: '',
                coupon_valid_to_date: '',
                coupon_valid_from_days: '',
                coupon_valid_to_days: '',
                enabled: true,
                coupon_type: 1,
                coupon_value: ''
            },
            couponurl: '',
            couponImageEvent: '',
            newcouponImg: false,
            coupon_name: '',
            startvalidity: 'date',
            endvalidity: 'date',
            maxLen: 13
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            
            if(retval && (this.coupons.coupon_name === '' || this.coupons.coupon_code_desc === ''))  {
                retval = false;
            }
            return retval;
        }
    },
    watch:{
        'couponid': function() {
            console.log("edit ",this.couponid);
            this.getcoupon(this.couponid);
        },
        'coupons.coupon_type': function() {
            console.log("Coupon Type ", this.coupons.coupon_type);
            if(this.coupons.coupon_type == 1) {
                this.maxLen = 13;
            }
            else {
                this.maxLen = 4
            }
        }
    },
    created: function () {
        console.log('form created')
        // this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
    },
    methods: {
        resetData: function() {
                this.coupons = {
                    merchant_id: '',
                    coupon_name: '',
                    coupon_code_desc: '',
                    coupon_code: '',
                    coupon_valid_from_date: '',
                    coupon_valid_to_date: '',
                    coupon_valid_from_days: '',
                    coupon_valid_to_days: '',
                    enabled: true,
                    coupon_type: 1,
                    coupon_value: ''
                };
                this.couponurl = '';
                this.couponImageEvent = '';
                this.newcouponImg = false;
                this.coupon_name = '';
        },
        getcoupon(id) {
            axios.get('loyalty/coupons/'+id).then(response => {
                console.log("coupon Res ", response);
                var coupon = response.data;
                this.coupons.merchant_id = coupon.merchant_id;
                this.coupons.coupon_name = coupon.coupon_name;
                this.coupons.coupon_code_desc = coupon.coupon_code_desc;
                this.coupons.coupon_code = coupon.coupon_code;
                this.coupons.coupon_type = coupon.coupon_type;
                this.coupons.coupon_value = coupon.coupon_value;
                $('#m_select_edit').val(coupon.coupon_type).trigger('change');
                if(coupon.coupon_valid_from_date) {
                    this.coupons.coupon_valid_from_date = moment(coupon.coupon_valid_from_date, "YYYYMMDD").format("MM/DD/YYYY");
                    this.startvalidity = 'date'
                }
                if(coupon.coupon_valid_to_date) {
                    this.coupons.coupon_valid_to_date = moment(coupon.coupon_valid_to_date, "YYYYMMDD").format("MM/DD/YYYY");
                    this.endvalidity = 'date'
                }

                if(coupon.coupon_valid_from_days) {
                    this.coupons.coupon_valid_from_days = coupon.coupon_valid_from_days;
                    this.startvalidity = 'days'
                }
                if(coupon.coupon_valid_to_days) {
                    this.coupons.coupon_valid_to_days = coupon.coupon_valid_to_days;
                    this.endvalidity = 'days'
                }
               
                if(coupon.enabled === 1) {
                    this.coupons.enabled = true;
                }
                else {
                    this.coupons.enabled = false;
                }
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Get coupon Error ", err);
            })
        },
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
            }, 3000);
        },

        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.coupons.enabled = true;
            }
            else {
                this.coupons.enabled = false;
            }
        },
        onChangeStartValidityType: function(e) {
            var val = e.target.value;
            if(val === 'date') {
                this.coupons.coupon_valid_from_days = "";
            }
            if(val === 'days') {
                this.coupons.coupon_valid_from_date = "";
                $('#beginDate').val("").trigger('change');
            }
        },
        onChangeEndValidityType: function(e) {
            var val = e.target.value;
            if(val === 'date') {
                this.coupons.coupon_valid_to_days = "";
            }
            if(val === 'days') {
                this.coupons.coupon_valid_to_date = "";
                $('#endDate').val("").trigger('change');
            }
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_coupon_edit');  
            form.validate({ // initialize the plugin
                rules: {
                    coupon_name: {
                        required: true
                    },
                    coupon_type: {
                        required: true
                    },
                    coupon_value: {
                        required: {
                            depends: function(element) {
                            if(vm.coupons.coupon_name !== 3) {
                                return true;
                            }
                            else {
                                return false
                            }
                          }
                        }
                    },
                    coupon_code_desc: {
                        required: true
                    },
                    start: {
                        required : {
                            depends: function(element) {
                            if(vm.startvalidity === 'date') {
                                return true;
                            }
                            else {
                                return false
                            }
                          }
                        }
                    },
                    coupon_valid_from_days: {
                        required: {
                            depends: function(element) {
                                if(vm.startvalidity === 'days') {
                                    return true;
                                }
                                else {
                                    return false
                                }
                              }
                        }
                        
                    },
                    end: {
                        required : {
                            depends: function(element) {
                            if(vm.endvalidity === 'date') {
                                return true;
                            }
                            else {
                                return false
                            }
                          }
                        }
                    },
                    coupon_valid_to_days: {
                        required: {
                            depends: function(element) {
                                if(vm.endvalidity === 'days') {
                                    return true;
                                }
                                else {
                                    return false
                                }
                              }
                        }
                        
                    }
                }
            })
            if(!form.valid()) {
                return;
            }
            var coupons = this.coupons;
            if(vm.startvalidity === 'date') {
                
                var start = this.$refs.startDate.value;
                if(this.$refs.startDate.value) {
                    var startDate = moment(start, "MM/DD/YYYY").format("YYYYMMDD");
                    // this.coupons.coupon_valid_from_date = startDate;
                }
                
                console.log("Start Date ", start);                
            }
                  

            if(vm.endvalidity === 'date') {
                var end = this.$refs.endDate.value;
                if(this.$refs.endDate.value) {
                    var endDate = moment(end, "MM/DD/YYYY").format("YYYYMMDD");            
                    // this.coupons.coupon_valid_to_date = endDate;
                } 
                   
                console.log("End Date ", end);                
            }  
                        
            coupons.enabled = (this.coupons.enabled)? 1: 2;  
            var start = this.$refs.startDate.value;
            var end = this.$refs.endDate.value;          
            console.log("Form Submit ", this.coupons);
            var couponDetails = {
                coupon_name: coupons.coupon_name,
                coupon_code: coupons.coupon_code,
                coupon_type: coupons.coupon_type,
                coupon_value: coupons.coupon_value,
                coupon_code_desc: coupons.coupon_code_desc,
                coupon_valid_from_days: coupons.coupon_valid_from_days,
                coupon_valid_to_days: coupons.coupon_valid_to_days,
                enabled: coupons.enabled,
                coupon_valid_from_date: (start)?moment(start, "MM/DD/YYYY").format("YYYYMMDD"): '',
                coupon_valid_to_date: (end)?moment(end, "MM/DD/YYYY").format("YYYYMMDD"): ''

            }

            axios.put('loyalty/coupons', couponDetails)
            .then(response => {
                console.log("Response ", response);
                this.$emit('showtoast',{'msg':'coupon has been Updated Success','type':'success','event':this.$event})
                // this.resetData();
                // form.trigger("reset");
                this.$emit('couponformsave',{'coupon':this.coupon,'event':this.$event})
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                this.$emit('showtoast',{'msg': err.response.data.error_msg,'type':'error','event':this.$event})
            })
           
        },
        cancelForm:function(){
            // this.resetData();
            var form = $('#m_form_coupon_edit');
            form.trigger("reset");
            this.$emit('couponformcancel',{'coupon':this.coupon,'event':this.$event})
        
        },
        checkStartValidity: function() {
            console.log("checkStartValidity")
            var form = $('#m_form_coupon_edit');
            var vm = this;
            if(this.startvalidity === 'date') {
                vm.showErrorMsg(form, 'danger', 'Days not allowed! please change selection as days');
                vm.coupons.coupon_valid_from_days = '';
                return null;
            }
        },
        checkEndValidity: function() {
            var form = $('#m_form_coupon_edit');
            var vm = this;
            if(this.endvalidity === 'date') {
                vm.showErrorMsg(form, 'danger', 'Days not allowed! please change selection as days');
                vm.coupons.coupon_valid_to_days = '';
                return null;
            }
        }
    },
    template: `
    <div class="m-grid__item m-content-coupon-form d-none" id="m-coupon-form-edit" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <coupons-form-header-edit v-bind:isformvalid="isValidForm"
                            @couponformcancel="cancelForm()"
                            @couponformsave="submitForm()"
                    ></coupons-form-header-edit>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_coupon_edit">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="coupons.coupon_name" type="text" name="coupon_name"  id="coupon_name" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter coupons's Name</span>
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Description:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <textarea v-model="coupons.coupon_code_desc" type="text" name="coupon_code_desc"  id="coupon_code_desc" class="form-control m-input" placeholder="" value=""></textarea>
                                                    <span class="m-form__help">Please Enter coupons's Title</span>
                                                </div>
                                            </div>
                                           <!-- <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Code:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="coupons.coupon_code" type="text" name="coupon_code"  id="coupon_code" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter coupons's code</span>
                                                </div>
                                            </div> -->
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupon Type:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <select v-model="coupons.coupon_type" ref="editselect" class="form-control m-input" id="m_select_edit" name="coupon_type">
                                                        <option value="">Select Coupon Type</option>
                                                        <option value="1">Cash Vocher</option>
                                                        <option value="2">Discount Coupon</option>
                                                        <option value="3">Free Shipping Coupon</option>
                                                    </select>
                                                    <span class="m-form__help">Please Select Coupons's Type</span>
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row" v-if="coupons.coupon_type !== 3">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* {{(coupons.coupon_type == 1)? 'Voucher Value': 'Discount Percentage'}}:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="coupons.coupon_value" type="text" name="coupon_value" :maxLength="maxLen" id="coupon_value" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter Coupons's {{(coupons.coupon_type == 1)? 'Voucher Value': 'Discount Percentage'}}.&nbsp; Value should be negative integer's. Ex: -10</span>
                                                </div>
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupons Validity Start:</label>                                               
                                                <div class="col-lg-3 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                        <input v-model="startvalidity" v-on:change="onChangeStartValidityType($event)" value="date" type="radio"> Date
                                                        <span></span>
                                                        </label>
                                                    </div>                                                    
                                                    <input type="text" v-model="coupons.coupon_valid_from_date" ref="startDate" id="beginDate"  class="form-control m-input" name="start" />
                                                </div>
                                                <div class="col-lg-3 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                        <input v-model="startvalidity" v-on:change="onChangeStartValidityType($event)" value="days" type="radio"> Days
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                    <input type="text" v-model="coupons.coupon_valid_from_days" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" id="coupon_valid_from_days" name="coupon_valid_from_days" v-on:keyup="checkStartValidity" class="form-control m-input" />
                                                </div>
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* coupons Validity End:</label>
                                                <div class="col-lg-3 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                        <input v-model="endvalidity" v-on:change="onChangeEndValidityType($event)" value="date" type="radio"> Date
                                                        <span></span>
                                                        </label>
                                                    </div>                                                    
                                                    <input type="text" v-model="coupons.coupon_valid_to_date" ref="endDate"  id="endDate" class="form-control m-input" name="end" />
                                                </div>
                                                <div class="col-lg-3 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                        <input v-model="endvalidity" v-on:change="onChangeEndValidityType($event)" value="days" type="radio"> Days
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                    <input type="text" v-model="coupons.coupon_valid_to_days" id="coupon_valid_to_days" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="coupon_valid_to_days" v-on:keyup="checkEndValidity" class="form-control m-input" />
                                                </div>
                                            </div> 
                                            <!-- <div class="form-group m-form__group row" v-if="coupons.coupon_expiry_type == 'Fixed'">
                                                <label class="col-form-label col-lg-3 col-sm-12">* coupons Expiry</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="input-daterange input-group" id="m_datepicker_5">
                                                        <input type="text" v-model="coupons.coupon_valid_from_date" v-on:change="onChangeDate($event)" id="coupon_valid_from_date" class="form-control m-input" name="start" />
                                                        <div class="input-group-append">
                                                            <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                                        </div>
                                                        <input type="text" v-model="coupons.coupon_valid_to_date" id="coupon_valid_to_date" class="form-control" name="end" />
                                                    </div>
                                                    <span class="m-form__help">Please select coupon's Expiry Date Range(MM/DD/YYYY)</span>
                                                </div>
                                            </div>      -->                                     
                                            <div class="form-group m-form__group row" :class="{'d-none' : coupons.enabled}">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Enabled:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                        <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                            <label>
                                                            <input type="checkbox" v-model="coupons.enabled" v-on:change="changeStatus($event)"  name="">
                                                            <span></span>
                                                            </label>
                                                        </span>
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
        console.log("this.couponid ", this.couponid);
        this.getcoupon(this.couponid);
        $(this.$refs.startDate).datepicker()
            .on('changeDate', function(e) {
                console.log("Change Date ", e);
                vm.coupons.coupon_valid_from_date = e.target.value;
            })  
            
            $(this.$refs.endDate).datepicker()
            .on('changeDate', function(e) {
                console.log("Change Date ", e);
                vm.coupons.coupon_valid_to_date = e.target.value;
            })                  
        
        $(this.$refs.editselect)
        .select2({
           
        })       
        .on('change', function () {            
            vm.coupons.coupon_type = Number($(this).val());
            console.log("coupon_type", vm.coupons.coupon_type, $(this).val());
        });
        
    }
})