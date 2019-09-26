Vue.component('redeemcoupons-form-header', {
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
                        Redeem Coupon
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools"> 
                <a href="#" v-on:click="$emit('redeemcouponformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>                  
                <button v-on:click="$emit('redeemcouponformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" id="saveBtn" :disabled="isDisabled">Redeem Coupon</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('redeemcoupons-form-component', {
    props:['primaryinput'],
    data: function() {
        return {
            couponList: [],
            coupon_code: '',
            serials_count: '',
            coupon_notes: '',
            serials: [],
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
       
    },
    watch:{       
        serials () {
            this.blockRemoval = this.serials.length <= 1
          }
    },
    created: function () {
        console.log('form created')     
    },
    methods: {
        resetData: function() {
            this.coupon_code = '';
            this.serials_count = '';
            this.enabled = true;
            this.status = true;
            this.activate = true;
            $('#m_select2_1').val('').trigger('change');
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
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_redeemcoupon_new');
            var btn = $('#saveBtn');
            console.log("Serials ", this.serials, this.serialval);
            form.validate({
                rules: {
                    coupon_code: {
                        required: true
                    },
                    serials_key: {
                        required: true
                    },
                    coupon_notes: {
                        required: true
                    }
                }
            })
            if(!form.valid()) {
                return;
            }
            // btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            var serialsData = [];
            for(var i in this.serialval) {
                serialsData.push({
                    coupon_serial: this.serialval[i]
                })
            }

            var data = {
                // coupon_code : vm.coupon_code,
                serials: serialsData,
                serial_notes: vm.coupon_notes
            }
            console.log("Serials Data ", data);

            axios.put('/loyalty/coupons/serials/redeem', data)
                .then(response => {
                    console.log("redeem Serials ", response);
                    this.resetData();
                    this.serials = [];
                    this.getSerials();
                    this.$emit('showtoast',{'msg':'Redeemed Success','type':'success','event':this.$event})
                    this.$emit('redeemcouponformsave',{'redeemcoupon':this.redeemcoupon,'event':this.$event})
                })
                .catch(err => {
                    if(err.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("error ", err);
                    this.$emit('showtoast',{'msg':'Redeem Failed '+ err.response.data.error_msg,'type':'error','event':this.$event})
                })
           
           
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('redeemcouponformcancel',{'redeemcoupon':this.redeemcoupon,'event':this.$event})
        
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
    <div class="m-grid__item m-content-redeemcoupon-form d-none" id="m-redeemcoupon-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <redeemcoupons-form-header v-bind:isformvalid="isValidForm"
                            @redeemcouponformcancel="cancelForm()"
                            @redeemcouponformsave="submitForm()"
                    ></redeemcoupons-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_redeemcoupon_new">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-12">                                            
                                           <!-- <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupon Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                <select v-model="coupon_code" ref="select" class="form-control m-input" id="m_select2_1" name="coupon_code">
                                                    <option value="">Select Coupon Code</option>
                                                    <option v-for="coupon in couponList" :value="coupon.coupon_code">{{coupon.coupon_name}}</option>
                                                </select>
                                                </div>
                                            </div> -->
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Notes:</label>
                                                <div class="col-lg-6 col-md-7 col-sm-12">                                                       
                                                    <input type="text" v-model="coupon_notes"  name="coupon_notes" class="form-control m-input">
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row" v-for="(serial, i) in serials">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serials Key:</label>
                                                <div class="col-lg-6 col-md-7 col-sm-12">                                                       
                                                    <input type="text" v-model="serialval[i]"  name="serials_key" class="form-control m-input">
                                                </div>
                                                <div class="col-lg-2 col-md-4 col-sm-12">
                                                    <a href="#" v-if="serials.length >= 2 && i >= 1" v-on:click="removeSerial($event, i)" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only">
                                                        <i class="fa fa-minus"></i>
                                                    </a>                                                      
                                                    <a href="#" v-if="serials.length >= 1 && i == 0" v-on:click="addSerial($event)" class="btn btn-outline-success m-btn m-btn--icon m-btn--icon-only">
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