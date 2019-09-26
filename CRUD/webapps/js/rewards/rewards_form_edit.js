Vue.component('rewards-form-header-edit', {
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
                        Edit Reward
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

Vue.component('rewards-form-edit-component', {
    props:['primaryinput', 'rewardid'],
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
            newRewardImg: false,
            couponList: [],
            coupon_value: '',
            coupon_code: '',
            addCouponList: [],
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            
            return retval;
        }
    },
    watch:{
        'rewardid': function() {
            console.log(this.rewardid);
            this.getReward(this.rewardid);
        },
    },
    created: function () {
        console.log('form created')
        // this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
    },
    methods: {
        resetData: function() {
            return {
                merchant_id: '',
                reward_name: '',
                reward_title: '',
                reward_value: '',
                enabled: true,
                reward_for: 'NUTICK',
                rewardurl: '',
                newRewardImg: false,
                imageData: ''
            };
        },
        getReward(id) {
            var vm = this;
            axios.get("/loyalty/coupons")
            .then(response => {
                
                vm.couponList = response.data.coupons;
                console.log("Coupons List ", vm.couponList);
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Coupons Err ", err);
            })
            axios.get('loyalty/rewards/'+id).then(response => {
                console.log("Reward Res ", response);
                var reward = response.data;
                this.rewards.merchant_id = reward.merchant_id;
                this.rewards.reward_name = reward.reward_name;
                this.rewards.reward_title = reward.reward_title;
                this.rewards.reward_value = reward.reward_value;
                this.rewards.reward_for = reward.reward_for;
                this.addCouponList = reward.coupon_codes;
                this.rewardurl = reward.imageurl
                var image = new Image();
                image.src = this.rewardurl;
                let vm = this;
                image.onerror = function() {
                    console.log("error ", vm.newRewardImg);
                    vm.newRewardImg = true;
                }
                image.onload = function() { console.log("success ", vm.newRewardImg); vm.newRewardImg = false; };
                // $('#coupon_expires_start').datepicker('setValue', moment(reward.coupon_expires_start, "YYYYMMDD").format("YYYY-MM-DD")).datepicker('update');
                // $('#coupon_expires_end').datepicker('setValue', moment(reward.coupon_expires_end, "YYYYMMDD").format("YYYY-MM-DD")).datepicker('update');
                if(reward.enabled === 1) {
                    this.rewards.enabled = true;
                }
                else {
                    this.rewards.enabled = false;
                }
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Get reward Error ", err);
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
        addCoupon: function(couponcode, qty) {
            var form = $("#m_form_reward_edit");
            console.log("Add coupon ");
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
            
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_reward_edit');   
            // var start = $('#coupon_expires_start_edit').val();
            // var end = $('#coupon_expires_end_edit').val();        
            // console.log("Date ", start, end);            
            
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
                    
                    // start: {
                    //     required: true
                    // },
                    // end: {
                    //     required: true
                    // }
                }
            });
            // $('#coupon_value').rules( 'remove' );
            if(!form.valid()) {
                return;
            }
            // var startDate = moment(start).format("YYYYMMDD");
            // var endDate = moment(end).format("YYYYMMDD");
            // this.rewards.coupon_expires_start = startDate;
            // this.rewards.coupon_expires_end = endDate;
            this.rewards['coupon_codes'] = this.addCouponList;
            this.rewards.enabled = (this.rewards.enabled)? 1: 2;
            console.log("Form Submit ", this.rewards);
            axios.put('loyalty/rewards/'+this.rewardid,this.rewards)
            .then(response => {
                console.log("Response ", response);
                this.$emit('showtoast',{'msg':'Reward has been Updated Success','type':'success','event':this.$event});
                if(vm.imageData) {
                    const reader = new FileReader();
                    reader.readAsDataURL(vm.imageData);
                    reader.onload = e =>{
                        var rewardurl = e.target.result;
                        let rawData =  rewardurl.split("base64,");
                        if (rawData.length > 1) {
                            rawData = rawData[1];
                            let data = {
                                filename: vm.imageData.name,
                                b64data: rawData,
                                mimetype: vm.imageData.type
                            }
                            
                            axios.put('/loyalty/rewards/images/'+this.rewardid, data)
                            .then((response) => {
                                btn.removeClass('m-loader m-loader--brand');
                                this.$emit('showtoast',{'msg':'Reward Image Updated Success','type':'success','event':this.$event})
                                // vm.showErrorMsg(form, 'success', 'Reward update Success!! ');
                            })
                            .catch((error) => {	
                                if(error.response.status == 403) {
                                    window.location.replace('/login');
                                }
                                else {
                                    axios.post('/loyalty/rewards/images/'+this.rewardid, data)
                                    .then((response) => {
                                        btn.removeClass('m-loader m-loader--brand');
                                        this.$emit('showtoast',{'msg':'Reward Image Updated Success','type':'success','event':this.$event});
                                        // vm.showErrorMsg(form, 'success', 'Reward update Success!! ');
                                    }).catch (err => {
                                        this.$emit('showtoast',{'msg':'Reward Image Uploaded Faild','type':'error','event':this.$event});
                                    })
                                }	
                                
                            })
                            
                        }
                    }
                }
                
                this.resetData();
                this.$emit('rewardformsave',{'reward':this.reward,'event':this.$event})
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                this.$emit('showtoast',{'msg': err.response.data.error_msg,'type':'error','event':this.$event})
            })
           
        },
        uploadRewardImage: function(event) {
            let vm = this;
            var form = $('#profile_picture_update_form');
            var btn = $('#banner_image_submit');
            const image = event.target.files[0];
            this.imageData = image;
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
					
				}
			}

        },
        cancelForm:function(){
            this.resetData();
            this.$emit('rewardformcancel',{'reward':this.reward,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-reward-form d-none" id="m-reward-form-edit" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <rewards-form-header-edit v-bind:isformvalid="isValidForm"
                            @rewardformcancel="cancelForm()"
                            @rewardformsave="submitForm()"
                    ></rewards-form-header-edit>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" id="m_form_reward_edit">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input v-model="rewards.reward_name" type="text" name="reward_name" readonly id="reward_name" class="form-control m-input" placeholder="" value="">                                                    
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
                                                    <div class="input-daterange input-group">
                                                        <input type="text" v-model="rewards.coupon_expires_start" data-provide="datepicker" data-date-start-date="d" data-date-format="mm/dd/yyyy" id="coupon_expires_start_edit" class="form-control m-input" name="start" />
                                                        <div class="input-group-append">
                                                            <span class="input-group-text"><i class="la la-ellipsis-h"></i></span>
                                                        </div>  
                                                        <input type="text" v-model="rewards.coupon_expires_end" data-provide="datepicker" data-date-start-date="d" data-date-format="mm/dd/yyyy" id="coupon_expires_end_edit" class="form-control" name="end" />
                                                    </div>
                                                    <span class="m-form__help">Please select Reward's Expiry Date Range(MM/DD/YYYY)</span>
                                                </div>
                                            </div> -->
                                            <div class="form-group m-form__group row">
                                                <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Reward Image</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <input class="form-control m-input" id="banner_image_submit" type="file" v-on:change="uploadRewardImage($event)">
                                                </div>          
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12"></label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">   
                                                    <img :src="rewardurl" style="width:100%"  alt="">
                                                   
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
    `   
})