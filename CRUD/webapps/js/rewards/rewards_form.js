Vue.component('rewards-form-header', {
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
                        Add Reward
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('rewardformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button v-on:click="$emit('rewardformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" :disabled="isDisabled">Save</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('rewards-form-component', {
    props:['primaryinput'],
    data: function() {
        return {
            rewards: {
                merchant_id: '',
                reward_name: '',
                reward_title: '',
                reward_value: '',
                enabled: true,
                reward_for: 'NUTICK'
            },
            rewardurl: '',
            rewardImageEvent: '',
            newRewardImg: false,
            reward_name: '',
            couponList: [],
            coupon_value: '',
            coupon_code: '',
            addCouponList: [],
            beforeAddCouponList: [],
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            
            return retval;
        }
    },
    watch:{

    },
    created: function () {
        console.log('form created')
        // this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
    },
    methods: {
        resetData: function() {
            this.rewards = {
                reward_name: '',
                reward_title: '',
                reward_value: '',
                enabled: true,
                reward_for: 'NUTICK'
            };
            this.rewardurl = '';
            this.rewardImageEvent = '';
            this.newRewardImg = false;
            this.reward_name = '';
            this.addCouponList = [];
            this.beforeAddCouponList = [];
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
                this.rewards.enabled = true;
            }
            else {
                this.rewards.enabled = false;
            }
        },
        imageEvent: function(event) {
            let vm = this;
            this.rewardImageEvent = event;
            const image = event.target.files[0];
            const reader = new FileReader();
			var fileType = image.type;
			var validImageTypes = ["image/jpeg", "image/png"];
			if ($.inArray(fileType, validImageTypes) < 0) {
				this.$emit('showtoast',{'msg':'Upload only Images ','type':'error','event':this.$event})
			   }
			else {
				reader.readAsDataURL(image);
				reader.onload = e =>{
                    vm.rewardurl = e.target.result;
                }
            }
        },
        uploadRewardImage: function(event, name) {
            let vm = this;
            var form = $('#profile_picture_update_form');
            var btn = $('#banner_image_submit');
			const image = event.target.files[0];
            btn.addClass('m-loader m-loader--brand');
			const reader = new FileReader();
			var fileType = image.type;
			var validImageTypes = ["image/jpeg", "image/png"];
			if ($.inArray(fileType, validImageTypes) < 0) {
				this.$emit('showtoast',{'msg':'Upload only Images ','type':'error','event':this.$event})
			   }
			else {
				reader.readAsDataURL(image);
				reader.onload = e =>{
					vm.rewardurl = e.target.result;
					let rawData = vm.rewardurl.split("base64,");
					if (rawData.length > 1) {
						rawData = rawData[1];
						let data = {
							filename: image.name,
							b64data: rawData,
							mimetype: image.type
                        }
                        axios.post('/loyalty/rewards/images/'+name, data)
                        .then((response) => {
                            btn.removeClass('m-loader m-loader--brand');
                            vm.$emit('showtoast',{'msg':'Reward Image Uploaded Success','type':'success','event':vm.$event})
                            // vm.showErrorMsg(form, 'success', 'Reward update Success!! ');
                        })
                        .catch((error) => {	
                            if(error.response.status == 403) {
                                window.location.replace('/login');
                            }							
                            vm.$emit('showtoast',{'msg':'Reward Image Uploaded Faild','type':'error','event':vm.$event})
                        })
                        
					}
				}
			}

        },
        onChangeDate: function(event) {
            console.log("Event ", event);
        },
        changeCoupon: function(code, index) {
            console.log("changeCoupon ", code, index);
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_reward_new');
            // $('#coupon_value').rules('remove')
            form.validate({ // initialize the plugin
                rules: {
                    reward_name: {
                        required: true
                    },
                    reward_title: {
                        required: true
                    },
                    reward_value: {
                        required: true
                    },                   
                }
            });
            if(!form.valid()) {
                return;
            }
            if(this.addCouponList.length === 0) {
                this.$emit('showtoast',{'msg': 'Add coupon before submit','type':'error','event':this.$event})
                return;
            }
            else {
                this.rewards['coupon_codes'] = this.addCouponList;
                this.rewards.enabled = (this.rewards.enabled)? 1: 2;
                console.log("Form Submit ", this.rewards);
                axios.post('loyalty/rewards',this.rewards)
                .then(response => {
                    console.log("Response ", response);
                    vm.reward_name = response.data.reward_name;
                    if(vm.rewardImageEvent !== '') {
                        vm.uploadRewardImage(vm.rewardImageEvent, vm.reward_name);
                    }                
                    this.$emit('showtoast',{'msg':'Reward has been added','type':'success','event':this.$event})
                    this.resetData();
                    this.$emit('rewardformsave',{'reward':this.reward,'event':this.$event})
                })
                .catch(err => {
                    if(err.response.status == 403) {
                        window.location.replace('/login');
                    }
                    this.$emit('showtoast',{'msg': err.response.data.error_msg,'type':'error','event':this.$event})
                })
            }
            
           
        },
        cancelForm:function(){
            this.resetData();
            this.$emit('rewardformcancel',{'reward':this.reward,'event':this.$event})
        
        },
        tableInit: function() {
            this.datatable = $(".m_datatable").mDatatable({
                data:
                {
                    saveState:
                    {
                        cookie:!1
                    }
                },
                search: {
                    input:$("#generalSearch")
                },
                columns: [
                    {
                        field:"DepositPaid",
                        type:"number"
                    },
                    {
                        field:"OrderDate",
                        type:"date",
                        format:"YYYY-MM-DD"
                    },
                    {
                        field:"Status",
                        title:"Status",
                        template:function(e) { 
                            var t=
                            {
                                1:{title:"Pending",class:"m-badge--brand"},
                                2:{title:"Delivered",class:" m-badge--metal"},
                                3:{title:"Canceled",class:" m-badge--primary"},
                                4:{title:"Success",class:" m-badge--success"},
                                5:{title:"Info",class:" m-badge--info"},
                                6:{title:"Danger",class:" m-badge--danger"},
                                7:{title:"Warning",class:" m-badge--warning"}
                            };
                            return'<span class="m-badge '+t[e.Status].class+' m-badge--wide">'+t[e.Status].title+"</span>"
                        }
                    },
                    {
                        field:"Type",
                        title:"Type",
                        template:function(e){
                            var t= {
                                1:{title:"Online",state:"danger"},
                                2:{title:"Retail",state:"primary"},
                                3:{title:"Direct",state:"accent"}
                            };
                            return'<span class="m-badge m-badge--'+t[e.Type].state+' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-'+t[e.Type].state+'">'+t[e.Type].title+"</span>"
                        }
                    }
                ]
            })
        },       
        addCoupon: function(couponcode, qty) {                        
            var form = $('#m_form_reward_new');
            var vm = this;
            console.log("Quantity ", qty);
            if(couponcode !== '') {
                if(qty === '') {
                    vm.showErrorMsg(form, 'danger', 'Please enter quantity');
                }
                else {
                    if(Number(qty) === 0) {
                        vm.showErrorMsg(form, 'danger', 'Please enter valid quantity');
                    }
                    else {
                        var coupons = this.beforeAddCouponList;
                        var resultData = coupons.map(c => {
                            if(c.coupon_code === couponcode) {
                                return {
                                    coupon_code: c.coupon_code,
                                    coupon_name: c.coupon_name,
                                    coupon_qty: qty
                                }
                            }
                            else {
                                return {
                                    coupon_code: c.coupon_code,
                                    coupon_name: c.coupon_name,
                                    coupon_qty: c.coupon_qty
                                }
                            }
                        });
                        this.addCouponList = resultData;
                        this.beforeAddCouponList = resultData;
                        $('#m_select2_1').val('').trigger('change');
                        console.log("this.addCouponList ", this.addCouponList);                       
                        this.coupon_value = '';
                    }
                }
            }
            else {
                vm.showErrorMsg(form, 'danger', 'Please select coupon');
            }
           
           
        }
    },
    template: `
    <div class="m-grid__item m-content-reward-form d-none" id="m-reward-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <rewards-form-header v-bind:isformvalid="isValidForm"
                            @rewardformcancel="cancelForm()"
                            @rewardformsave="submitForm()"
                    ></rewards-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_reward_new">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="rewards.reward_name" type="text" name="reward_name"  id="reward_name" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter Rewards's Name</span>
                                                </div>
                                            </div>
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Description:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <textarea v-model="rewards.reward_title" type="text" name="reward_title"  id="reward_title" class="form-control m-input" placeholder="" value=""></textarea>
                                                    <span class="m-form__help">Please Enter Rewards's Title</span>
                                                </div>
                                            </div>
                                           <!-- <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Code:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="rewards.coupon_code" type="text" name="coupon_code"  id="coupon_code" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter Rewards's code</span>
                                                </div>
                                            </div> 
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Reward Type:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                        <input v-model="rewards.coupon_value_type" value="Fixed" type="radio"> Fixed 
                                                        <span></span>
                                                        </label> 
                                                        <label class="m-radio">
                                                        <input v-model="rewards.coupon_value_type" value="Percentage" type="radio"> Percentage 
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                    <span class="m-form__help">Please Select Reward's Type</span>
                                                </div>
                                            </div> -->
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Rewards Points</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                           
                                                    <input v-model="rewards.reward_value" :maxLength="12" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" type="text" name="reward_value" id="reward_value" class="form-control m-input" placeholder="" value="">
                                                    <span class="m-form__help">Please Enter Reward's points Limit</span>                                                        
                                                </div>
                                            </div>                                                                                       
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Add Coupon Code:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="row">
                                                        <div class="col-lg-6">
                                                            <select class="form-control m-input m_select2" v-model="coupon_code" ref="select" id="m_select2_1" name="param">
                                                                <option value="">Select</option>
                                                                <option v-for="(coupon, i) in couponList" :value="coupon.coupon_code">{{coupon.coupon_name}}</option>                                                            
                                                            </select> 
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <input v-model="coupon_value" name="coupon_value" id="coupon_value" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" type="text" class="form-control m-input" placeholder="" value="">
                                                        </div>                                                      
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 col-md-3 col-sm-3">
                                                    <button  type="button" v-on:click="addCoupon(coupon_code,coupon_value)" class="btn btn-primary m-btn m-btn--custom">Add</button>
                                                </div>
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupon List:</label>
                                                <div class="col-lg-9 col-md-12 col-sm-12">
                                                    <div class="m-portlet m-portlet--mobile">
                                                        <div class="m-portlet__head-tools">
                                                            <div class="m_datatable m-datatable--default m-datatable--brand m-datatable--loaded">
                                                                <table  id="html_table" width="100%">
                                                                    <thead>
                                                                        <tr>
                                                                            <th title="Field #1" data-field="OrderID">Coupon Code</th>
                                                                            <th title="Field #2" data-field="Owner">Coupon Name</th>
                                                                            <th title="Field #3" data-field="Contact">Qty</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr v-if="addCouponList.length === 0">
                                                                            <td></td>
                                                                            <td>no coupon added</td>
                                                                            <td></td>
                                                                        </tr>
                                                                        <tr v-if="addCouponList.length > 0" v-for="coupon in addCouponList">
                                                                            <td>{{coupon.coupon_code}}</td>
                                                                            <td>{{coupon.coupon_name}}</td>
                                                                            <td>{{coupon.coupon_qty}}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- <div class="form-group m-form__group row">
                                                <label class="col-form-label col-lg-3 col-sm-12">* Rewards Expiry</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="input-daterange input-group" id="m_datepicker_5">
                                                        <input type="text" v-model="rewards.coupon_expires_start" v-on:change="onChangeDate($event)" id="coupon_expires_start" class="form-control m-input" name="start" />
                                                        <div class="input-group-append">
                                                            <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                                        </div>
                                                        <input type="text" v-model="rewards.coupon_expires_end" id="coupon_expires_end" class="form-control" name="end" />
                                                    </div>
                                                    <span class="m-form__help">Please select Reward's Expiry Date Range(MM/DD/YYYY)</span>
                                                </div>
                                            </div> -->
                                            <div class="form-group m-form__group row">
                                                <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Reward Image</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <input class="form-control m-input" id="banner_image_submit" type="file" v-on:change="imageEvent($event)">
                                                </div>          
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12"></label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">   
                                                    <img :src="rewardurl" style="width:100%" alt="">                                                   
                                                </div>
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Enabled:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                        <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                            <label>
                                                            <input type="checkbox" v-model="rewards.enabled" v-on:change="changeStatus($event)"  name="">
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
        axios.get("/loyalty/coupons")
            .then(response => {
                console.log("Coupons List ", response);
                vm.couponList = response.data.coupons;
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Coupons Err ", err);
            })
            $(this.$refs.select)
        .select2({
           
        })       
        .on('change', function () {                                    
            var couponcode = $(this).val();
            vm.coupon_code = couponcode;
            console.log("Onchange", vm.coupon_code, vm.beforeAddCouponList)
            var couponData = vm.couponList.filter(c => c.coupon_code === couponcode);
            if(vm.beforeAddCouponList.length === 0) {
                vm.beforeAddCouponList.push({
                    coupon_code: couponData[0].coupon_code,
                    coupon_name: couponData[0].coupon_name
                })
            }
            else {
                let find = vm.beforeAddCouponList.findIndex(c => c.coupon_code === couponcode);
                console.log("Find ", couponcode);
                if(find === -1 && couponcode !== '') {
                    vm.beforeAddCouponList.push({
                        coupon_code: couponData[0].coupon_code,
                        coupon_name: couponData[0].coupon_name
                    })                
                }               
            }

            console.log("Onchange", vm.beforeAddCouponList)
        });
        this.tableInit();
        // $(document).ready(function() {
        //     $('#coupon_expires_start').datepicker({
        //         format: "yyyy-mm-dd",
        //     })
        //     //Listen for the change even on the input
            
        //     .on('changeDate', function(e) {
        //         console.log("Change Date ", e);
        //         vm.rewards.coupon_expires_start = e.target.value;
        //     });

        //     $('#coupon_expires_end').datepicker({
        //         format: "yyyy-mm-dd",
        //     })
        //     //Listen for the change even on the input
            
        //     .on('changeDate', function(e) {
        //         console.log("Change Date ", e);
        //         vm.rewards.coupon_expires_end = e.target.value;
        //     });
        // });
        
    }
})