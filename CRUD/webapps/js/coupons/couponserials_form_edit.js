Vue.component('couponserials-form-header-edit', {
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
                        Create Coupon Serial
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('couponserialformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button v-on:click="$emit('couponserialformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" id="saveBtn" :disabled="isDisabled">Update</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('couponserials-form-edit-component', {
    props:['primaryinput', 'couponserialid'],
    data: function() {
        return {
            couponList: [],
            coupon_code: '',
            serials_count: '',
            enabled: true,
            status: true,
            activate: true,
            mid:'',
            allocation_code: ''
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            if(retval && (this.serials_count != '') && (this.coupon_code != '')) {
                retval = true;
            }
            return retval;
        }
    },
    watch:{
        'couponserialid': function() {
            console.log(this.couponserialid);
            this.getcouponserial(this.couponserialid);
        },
    },
    created: function () {
        console.log('form created')
        // this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
    },
    methods: {
        resetData: function() {
            this.coupon_code = '',
            this.serials_count = '',
            this.enabled = true,
            this.status = true,
            this.activate = true
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
        getcouponserial: function(id) {
            axios.get('loyalty/coupons/couponserials/'+ id)
            .then(response => {
                
                var data = response.data;
                this.coupon_code = data.coupon_code;
                this.serials_count = data.serials_count;
                if(data.serial_status === 2) {
                    this.status = true;
                }
                else {
                    this.status = false;
                }                
                this.mid = data.merchant_id;
                this.allocation_code = data.allocation_code;
                console.log("get serial ", response.data, this.coupon_code );
                
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("error ", err);
            })
        },
        changeActiveStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.status = true;
            }
            else {
                this.status = false;
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
        displaycouponserialList : function(){
            // alert('display Add couponserial form')
            $('#m-couponserial-form').removeClass('d-none');
            $('#m-couponserial-list').addClass('d-none');
            $('#m-couponserial-form-edit').addClass('d-none');
        },   
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_couponserial_new');
            var btn = $('#saveBtn');

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
           
            var serialData = {
                allocation_code: vm.allocation_code,
                coupon_code: vm.coupon_code,
                serials_count: vm.serials_count,
                merchant_id: vm.mid,
                serial_status: (vm.status)? 2 : 1,
            };         
            axios.put('/loyalty/coupons/couponserials', serialData)
            .then(response => {
                console.log("Serial Update ", response.data);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'coupon serials has been updated','type':'success','event':this.$event})
                this.resetData();
                this.$emit('couponserialformsave',{'couponserial':'','event':this.$event})
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':err.response.data.error_msg,'type':'error','event':this.$event})
            })
           
           
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('couponserialformcancel',{'couponserial':this.couponserial,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-couponserial-form d-none" id="m-couponserial-form-edit" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <couponserials-form-header-edit v-bind:isformvalid="isValidForm"
                            @couponserialformcancel="cancelForm()"
                            @couponserialformsave="submitForm()"
                    ></couponserials-form-header-edit>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_couponserial_edit">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">                                                                            
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Status:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                        <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                            <label>
                                                            <input type="checkbox" v-model="status" v-on:change="changeActiveStatus($event)"  name="">
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
        $('#m_select2_1').select2('val', this.coupon_code);
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

        // $(this.$refs.select)
        // .select2({
           
        // })       
        // .on('change', function () {            
        //     // vm.coupon_code = $(this).val();
        //     // console.log("coupon_code", vm.coupon_code)
        // });
        
    }
})