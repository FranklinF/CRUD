Vue.component('plans-header-component', {
    template: `
    <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">
                <h3 class="m-portlet__head-text">
                   Account Info
                </h3>
            </div>
        </div>
    </div>
    `
})

Vue.component('plans-component', {
    props: ['reload'],
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
            price_plan: '',
            plan_details: '',
            totalCustomers: '',
            totalTiers: '',
            totalOutlets: '',
            totalStaffs: '',
            plan_limits: '',
            price: ''
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.getPlanList();
    },
    methods: {
        getPlanList: function() {
            var vm = this;
            axios.get('/loyalty/merchant/profile/details')
            .then(response => {
                var listplans = {
                    free_plan:'Free Plan',
                    monthly_plan:'Monthly Plan',
                    yearly_plan:'Yearly Plan',
                };
                var planid = response.data.price_plan;
                vm.price_plan = listplans[response.data.price_plan]  
            
                axios.get('/loyalty/merchant/plans/current_usage/details')
                    .then(response => {
                        console.log("Plan details ", response);
                        vm.plan_details = response.data;
                    })
                axios.get('/loyalty/merchant/plans/usage/limits')
                .then(response => {
                    vm.plan_limits = response.data.merchants_plan;
                    var customer_count = vm.plan_limits.allowed_customers - 2000;
                    if(planid === 'monthly_plan') {
                        vm.price = ((customer_count/500)* 12) + 49;
                        console.log("Silder Value ", (parseInt(customer_count/200)* 5));         
                    }
                    else if(planid === 'yearly_plan') {
                        vm.price = ((customer_count/500)* 10) + 39;
                    }
                    else {
                        vm.price = 0;
                    }
                })
            })
          }, 
          setPlanId: function(planid) {
            var modal = $('#m_modal_plan');
            
              if(this.price_plan === this.listplans[planid]) {
                console.log("plan id ", planid);
                this.$emit('showtoast',{'msg':'Your current plan is '+ this.price_plan,'type':'error','event':''})
              }
              else {
                this.plan_id = planid;
                modal.modal("show");
              }
          },
          upgradeplan: function() {
              var vm = this;
            var modal = $('#m_modal_plan');
            console.log("Plan Id ", vm.plan_id)
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
    },
    template: `
    <div class="m-grid__item m-content-payment-list" id="m-payment-list" >
        <div class="m-content">
        <!--begin::Modal-->
        <div class="modal fade" id="m_modal_plan" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Upgrade Plan</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                       Are you sure want to select this plan?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" v-on:click="upgradeplan()" class="btn btn-primary">Ok</button>
                    </div>
                </div>
            </div>
        </div>
        <!--end::Modal-->
            <div class="m-portlet m-portlet--mobile">
                <plans-header-component></plans-header-component>
                <div class="m-portlet__body"> 
                    <div class="row">

                        <div class="col-xl-6 m-content">
                            <div class="m-portlet m-portlet--full-height ">
                                <div class="m-portlet__head">
                                    <div class="m-portlet__head-caption">
                                        <div class="m-portlet__head-title">
                                            <h3 class="m-portlet__head-text">
                                                Current Plan - {{price_plan}}
                                            </h3>
                                        </div>
                                    </div> 
                                    <div class="m-portlet__head-tools">
                                        <ul class="m-portlet__nav">
                                            <li class="m-portlet__nav-item">
                                                <h4 class="m-portlet__head-text">{{'$'+price}} USD</h4>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="m-portlet__body">
                                    <h4 class="m-section__heading">Usage</h4>
                                    <div class="col-xl-6 m-content cplanbox">
                                        <div class="col-xl-12 box">
                                            <i class="m-menu__link-icon flaticon-customer"></i>
                                         <h4>{{plan_details.customers}}	 / {{plan_limits.allowed_customers}}</h4>
                                         <p> Customers</p>
                                        </div>                                        
                                    </div>

                                    <div class="col-xl-6 m-content cplanbox">
                                        <div class="col-xl-12 box">
                                        <i class="m-menu__link-icon flaticon-map"></i>
                                         <h4>{{plan_details.tiers}} / {{plan_limits.allowed_tiers}}</h4>
                                         <p> Tiers</p>
                                        </div>                                        
                                    </div>

                                    <div class="col-xl-6 m-content cplanbox">
                                        <div class="col-xl-12 box">
                                            <i class="m-menu__link-icon flaticon-map-location"></i>
                                         <h4>{{plan_details.outlets}} / {{plan_limits.allowed_outlets}}</h4>
                                         <p> Outlets</p>
                                        </div>                                        
                                    </div>
                                    
                                    <div class="col-xl-6 m-content cplanbox">
                                        <div class="col-xl-12 box">
                                            <i class="m-menu__link-icon flaticon-network"></i>
                                         <h4>{{plan_details.staffs}} / {{plan_limits.allowed_staffs}}</h4>
                                         <p> Staffs</p>
                                        </div>                                        
                                    </div>                                    

                                    <div class="col-xl-12 m-content cplanbox">

                                        <a href="/plans" class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill"><span><i class="m-menu__link-icon flaticon-list"></i> <span>Change Plan</span></span></a>                                       
                                    </div>   		 
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-6">
                            <cards-list-component @showtoast="$emit('showtoast', $event)" :reload="reload"></cards-list-component>
                        </div>                        
                       
                    </div>   
                    
                    <!--<div class="row" v-for="plan in plans">
                        <div class="col-xl-2"></div>
                        <div class="col-xl-8" >
                            <div class="m-portlet m-portlet--full-height ">
                                <div class="m-portlet__head">
                                    <div class="m-portlet__head-caption">
                                        <div class="m-portlet__head-title">
                                            <h3 class="m-portlet__head-text">
                                                {{price_plan}}
                                            </h3>
                                        </div>
                                    </div> 
                                    <div class="m-portlet__head-tools">
                                        <ul class="m-portlet__nav">
                                            <li class="m-portlet__nav-item">
                                                <h4 class="m-portlet__head-text">{{'$'+plan.price}} USD</h4>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="m-portlet__body">
                                    <div class="m-widget13">
                                        <div class="m-widget13__item">
                                            <span class="m-widget13__desc m--align-right">
                                                Customers
                                            </span>
                                            <span class="m-widget13__text m-widget13__text-bolder">
                                                {{plan.customers}}						 
                                            </span>
                                        </div>
                                        <div class="m-widget13__item">
                                            <span class="m-widget13__desc m--align-right">
                                                Tiers:
                                            </span>
                                            <span class="m-widget13__text m-widget13__text-bolder">
                                                {{plan.tier}}						 
                                            </span>
                                        </div>
                                        <div class="m-widget13__item">
                                            <span class="m-widget13__desc m--align-right">
                                                Outlets:
                                            </span>
                                            <span class="m-widget13__text m-widget13__text-bolder">
                                                {{plan.outlet}}
                                            </span>
                                        </div>
                                        <div class="m-widget13__item">
                                            <span class="m-widget13__desc m--align-right">
                                                Staffs:
                                            </span>
                                            <span class="m-widget13__text m-widget13__text-bolder">
                                                {{plan.staff}}
                                            </span>
                                        </div>
                                        <div class="m-widget13__item">
                                            <span class="m-widget13__desc m--align-right">
                                                Plan Duration:
                                            </span>
                                            <span class="m-widget13__text m-widget13__text-bolder">
                                                {{plan.duration}}
                                            </span>
                                        </div>                                        
                                        <div class="m-widget13__action m--align-right">
                                            <button type="button" v-on:click="setPlanId(plan.plan_id)" class="m-widget__detalis  btn m-btn--pill  btn-accent">Select Plan</button>		 					 
                                        </div>
                                    </div>		 
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2"></div>
                    </div> -->
                    
                    
                </div>
            </div>
        </div>
    </div>
    `
})