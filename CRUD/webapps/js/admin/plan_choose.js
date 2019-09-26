Vue.component('plans-header-component', {
    template: `
    <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">
                <h3 class="m-portlet__head-text">
                   Upgrade Plan
                </h3>
            </div>
        </div>
    </div>
    `
})

Vue.component('plans-choose-component', {
    data: function() {
        return {
            subheader:{
                title: 'cards',
                items :[
                    {id:1, link:'/loyalty/merchant/list/cards', icon:'la la-home', name:'' },
                    {id:2, link:'#', icon:'', name:'cards List' }                ]
            },
            plans: [],
            listplans: '',
            plan_id:'',
            showPlan:'yearly_plan',
            price_plan: '',
            plan_details: '',
            totalCustomers: '',
            totalTiers: '',
            totalOutlets: '',
            totalStaffs: '',
            listplanstitle:'',
            plan_limits:'',
            tierCount: '',
            outletCount: '',
            staffCount: '',
            price: '',
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        // this.getPlanList();
    },
    methods: {
        getPlanList: function() {
            var vm = this;
            axios.get('/loyalty/merchant/list/customers?page=1')
            .then(response => {
                console.log("Plans Response ", response.data);
                vm.totalCustomers = response.data.pagination.total_rows;
            })
            axios.get('/loyalty/tiers?page=1')
            .then(response => {
                
                vm.totalTiers = response.data.pagination.total_rows;
            })
            axios.get('/loyalty/outlets?page=1')
            .then(response => {
                
                vm.totalOutlets = response.data.pagination.total_rows;
            })
            axios.get('/loyalty/staffs?page=1')
            .then(response => {
                
                vm.totalStaffs = response.data.pagination.total_rows;
            })
            axios.get('/loyalty/merchant/plans/list')
            .then(response => {
                console.log("Plans Response ", response.data);
                vm.plans = response.data.subscription_plans[0].subscription_interval;
            })
            axios.get('/loyalty/merchant/plans/current_usage/details')
            .then(response => {
                console.log("Plan details ", response);
                vm.plan_details = response.data;
            })
            axios.get('/loyalty/merchant/plans/usage/limits')
            .then(response => {
                vm.plan_limits = response.data.merchants_plan;
            })           
            // axios.get('/loyalty/merchant/profile/details')
            // .then((response) => {               
            //     vm.listplans = {
            //         free_plan:'Free Plan',
            //         monthly_plan:'Monthly Plan',
            //         yearly_plan:'Yearly Plan',
            //     };

            //     vm.listplanstitle = {
            //         free_plan:'Free',
            //         monthly_plan:'Monthly',
            //         yearly_plan:'Yearly',
            //     };

            //     vm.profiledata= response.data;
            //     vm.price_plan =vm.listplans[response.data.price_plan];
            //     //vm.titlePlan = listplanstitle[response.data.price_plan];

            //     axios.get('/loyalty/merchant/plans/'+ response.data.price_plan + '/details')
            //         .then(response => {
            //             console.log("Plan details ", response);
            //             vm.plan_details = response.data;
            //         })
                              
            // })
            // .catch((error) => {
			// 	//console.log("Error ", error.response);
            // })
          }, 
          
          showPlanBox:function(){
            var vm = this;
            var modal = $('#m_modal_plan');    
            modal.modal("show");        
          },
          setPlanId: function(planid) {
            var modal = $('#m_modal_plan');
            
              if(this.price_plan === this.listplans[planid]) {
                //console.log("plan id ", planid);
                this.$emit('showtoast',{'msg':'Your current plan is '+ this.price_plan,'type':'error','event':''})
              }
              else {
                this.plan_id = planid;
                modal.modal("show");
              }
          },
          upgradeplan: function() {
              var vm = this;
             //console.log("testing plan id "+vm.planId);
            var modal = $('#m_modal_plan');
            //console.log("Plan Id ", vm.plan_id)
            var data = {
                plan_id: vm.plan_id
            }
            axios.put('/loyalty/merchant/upgrade/plan', data)
                .then(response => {
                    window.location.reload();
                    modal.modal("hide");
                    vm.$emit('showtoast',{'msg':'Plan has been updated success','type':'success','event':vm.$event})
                })

          },
          changePlans:function(plan){
              var vm =this;
              vm.showPlan = plan;
              console.log("plan ", vm.showPlan);
              if(vm.showPlan === 'monthly_plan') {
                vm.price = 49;
            }
            else {
                vm.price = 39;
            }
            var slider = document.getElementById('m_nouislider_1');
            slider.noUiSlider.reset();            
          },
          sendPlanId:function(id){
            console.log("this is test"+id);
            window.location = "choosePlans?id="+id;
        },
        upgradePlan: function() {
            var vm = this;
            var data = {
                plan_id: vm.showPlan,
                customers: vm.totalCustomers
            }
            console.log(data);
            axios.put('/loyalty/merchant/upgrade/plan', data)
                .then(response => {
                    window.location.replace('/accounts');
                    modal.modal("hide");
                    vm.$emit('showtoast',{'msg':'Plan has been updated success','type':'success','event':vm.$event})
                })
        }
    },
    template: `
    <div class="m-grid__item m-content-payment-list" id="m-payment-list" >
            <div class="m-portlet m-portlet--mobile">
                <plans-header-component></plans-header-component>
                <div class="m-portlet__body"> 
                    <div class="row">
                        <div class="col-xl-12">
                        <div class="m-pricing-table-2">
                        <div class="m-pricing-table-2__head">                            
                            <div class="btn-group nav m-btn-group m-btn-group--pill m-btn-group--air" role="group">
                                <button  type="button" v-on:click="changePlans('yearly_plan')"  class="btn m-btn--pill  active m-btn--wide m-btn--uppercase m-btn--bolder" data-toggle="tab" href="#m-pricing-table_content1" role="tab" aria-expanded="true">
                                    Annual Plan
                                </button>                 
                                <button type="button" v-on:click="changePlans('monthly_plan')" class="btn m-btn--pill  m-btn--wide m-btn--uppercase m-btn--bolder" data-toggle="tab" href="#m-pricing-table_content2" role="tab" aria-expanded="false">
                                    Monthly Plan
                                </button>
                            </div>
                        </div>
                        </div>       
                        </div>
                    </div>
                    <form class="m-form m-form--label-align-left- m-form--state-" id="m_form">
                        <div class="form-group m-form__group row">
                            <label class="col-form-label col-lg-3 col-sm-12">Customer Count</label>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="row align-items-center">
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <input type="text" class="form-control"  onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57"  id="m_nouislider_1_input"  placeholder="Quantity">
                                    </div>
                                    <div class="col-lg-8 col-md-12 col-sm-12">
                                        <div id="m_nouislider_1" class="m-nouislider--drag-danger"></div>
                                    </div> 
                                </div>
                                <span class="m-form__help">Enter Customer's count</span>
                            </div>
                        </div>
                        <div class="form-group m-form__group row">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="m-portlet m-portlet--full-height ">
                                    <div class="m-portlet__head">
                                        <div class="m-portlet__head-caption">
                                            <div class="m-portlet__head-title">
                                                <h3 class="m-portlet__head-text">
                                                    Compare with existing plan
                                                </h3>
                                            </div>
                                        </div>                                    
                                    </div>
                                    <div class="m-portlet__body">
                                        <!--Begin::Tab Content-->
                                        <div class="tab-content">
                                            <!--begin::tab 1 content-->
                                            <div class="tab-pane active" id="m_widget11_tab1_content">
                                                <!--begin::Widget 11--> 
                                                <div class="m-widget11">
                                                    <div class="table-responsive">
                                                        <!--begin::Table-->								 
                                                        <table class="table">
                                                            <!--begin::Thead-->
                                                            <thead>
                                                                <tr>                                                                   
                                                                    <td class="m-widget11__app">Name</td>
                                                                    <td class="m-widget11__price">Current Plan</td>
                                                                    <td class="m-widget11__sales">New Plan</td>
                                                                    <td class="m-widget11__total">Total</td>
                                                                </tr>
                                                            </thead>
                                                            <!--end::Thead-->
                                                            <!--begin::Tbody-->
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <span class="m-widget11__title">Customers</span>                                                                    
                                                                    </td>
                                                                    <td>{{plan_limits.allowed_customers}}</td>
                                                                    <td>{{totalCustomers}}</td>
                                                                    <td class=" m--font-brand"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <span class="m-widget11__title">Tiers</span>                                                                    
                                                                    </td>
                                                                    <td>{{plan_limits.allowed_tiers}}</td>
                                                                    <td>{{tierCount}}</td>
                                                                    <td class=" m--font-brand"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <span class="m-widget11__title">Outlets</span>
                                                                        
                                                                    </td>
                                                                    <td>{{plan_limits.allowed_outlets}}</td>
                                                                    <td>{{outletCount}}</td>
                                                                    <td class=" m--font-brand"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <span class="m-widget11__title">Staffs</span>                                                                    
                                                                    </td>
                                                                    <td>{{plan_limits.allowed_staffs}}</td>
                                                                    <td>{{staffCount}}</td>
                                                                    <td class=" m--font-brand"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                                                                                        
                                                                    </td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td class=" m--font-brand"><label style="font-size: 32px;"><strong>$ {{price}}</strong></label></td>
                                                                </tr>
                                                            </tbody>
                                                            <!--end::Tbody-->										     
                                                        </table>
                                                        <!--end::Table-->
                                                    </div>
                                                    <div class="m-widget11__action m--align-right">
                                                        <button type="button" v-on:click="upgradePlan()" class="btn m-btn--pill btn-outline-brand m-btn m-btn--custom">Upgrade Plan</button>
                                                    </div>
                                                </div>
                                                <!--end::Widget 11--> 						             
                                            </div>
                                            <!--end::tab 1 content-->                                       
                                        </div>
                                        <!--End::Tab Content-->
                                    </div>
                                </div>
                            </div>
                            </div>
                            <!-- <div class="col-lg-6 col-md-12 col-sm-12">
                                <h4>Upgrade Plan</h4>
                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Tiers</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{tierCount}}</strong></label>
                                    </div>
                                </div>
                            
                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Outlets</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{outletCount}}</strong></label>
                                    </div>
                                </div>

                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Staffs</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{staffCount}}</strong></label>
                                    </div>
                                </div>

                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Price</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>$ {{price}}</strong></label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12 col-sm-12">
                                <h4>Current Plan</h4>
                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Customers</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{plan_limits.allowed_customers}}</strong></label>
                                    </div>
                                </div>
                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Tiers</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{plan_limits.allowed_tiers}}</strong></label>
                                    </div>
                                </div>
                            
                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Outlets</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{plan_limits.allowed_outlets}}</strong></label>
                                    </div>
                                </div>

                                <div class="form-group m-form__group row">
                                    <label class="col-form-label col-lg-3 col-sm-12">Staffs</label>
                                    <div class="col-lg-4 col-md-12 col-sm-12">
                                        <label><strong>{{plan_limits.allowed_staffs}}</strong></label>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                        <div class="form-group m-form__group row">
                            <button id="tier_submit" type="button" v-on:click="upgradePlan()" class="btn btn-primary m-btn m-btn--custom">Upgrade Plan</button>
                        </div> -->
                    </form> 
                </div>
            </div>
    </div>
    `,
    mounted: function() {
        this.getPlanList();
        var customer = 2000;
        var vm = this;
        if(vm.showPlan === 'monthly_plan') {
            vm.price = 49;
        }
        else {
            vm.price = 39;
        }
        axios.get('loyalty/estimate/'+ customer)
        .then(response => {
            console.log("estimate Response ", response);
            var data = response.data;
            vm.totalCustomers = data.allowed_customers;
            vm.tierCount = data.allowed_tiers;
            vm.outletCount = data.allowed_outlets;
            vm.staffCount = data.allowed_staffs;
        })

        var slider = document.getElementById('m_nouislider_1');        

        noUiSlider.create(slider, {
            start: 2000,
            range: {
                min: 2000,
                max: 25000
            },
            step: 500,
            pips: {
                mode: 'values',
                values: [2000, 5000, 10000, 15000, 20000, 25000],
                density: 10
            },
            format: wNumb({
                decimals: 0 
            })
        });

        var sliderInput = document.getElementById('m_nouislider_1_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
            var customer_count =  values[handle] - 2000;
            vm.totalCustomers = values[handle];
            console.log("update ", values[handle]);

            if(vm.showPlan === 'monthly_plan') {
                vm.price = (((customer_count/500)* 12) + 49).toFixed(2);
                console.log("Silder Value ", (parseInt(customer_count/500)* 12));         
            }
            else {
                vm.price = (((customer_count/500)* 10) + 39).toFixed(2);
            }

            axios.get('loyalty/estimate/'+ values[handle])
            .then(response => {
                console.log("estimate Response ", response);
                var data = response.data;
                vm.totalCustomers = data.allowed_customers;
                vm.tierCount = data.allowed_tiers;
                vm.outletCount = data.allowed_outlets;
                vm.staffCount = data.allowed_staffs;
            })
        });

        sliderInput.addEventListener('change', function(){
            // console.log("Silder Value ", this.value);
            // var customer_count = this.value - 2000;
            
            // if(vm.showPlan === 'monthly_plan') {
            //     vm.price = ((customer_count/500)* 12) + 49;
            //     console.log("Silder Value ", (parseInt(customer_count/500)* 12));         
            // }
            // else {
            //     vm.price = ((customer_count/500)* 10) + 39;
            // }
            
            slider.noUiSlider.set(this.value);
            vm.totalCustomers = this.value;
            
        });

        slider.noUiSlider.on('change', function ( values, handle ) {
            // console.log("silder change ", values[handle]);
            // var customer_count =  values[handle] - 2000;
            // vm.totalCustomers = values[handle];
            // console.log("update ", values[handle]);

            // if(vm.showPlan === 'monthly_plan') {
            //     vm.price = ((customer_count/500)* 5) + 49;
            //     console.log("Silder Value ", (parseInt(customer_count/500)* 12));         
            // }
            // else {
            //     vm.price = ((customer_count/500)* 4) + 39;
            // }
        });
    }
})