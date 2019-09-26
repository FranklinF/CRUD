Vue.component('plans-header-component', {
    template: `
    <!--   <div class="m-portlet__head">
     <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">
                <h3 class="m-portlet__head-text">
                   Change Plan
                </h3>
            </div>
        </div>
    </div>-->
    `
})

Vue.component('plans-confirm-component', {
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
            choose_plan_details:'',
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.choosePlanList();
        this.getPlanList();
        
    },
    methods: {
        getParams: function() {
            let urlParams = new URLSearchParams(window.location.search);
            let planParam = urlParams.get('id');
            this.plan_id = planParam;
            console.log("Plan id ", this.plan_id);
            sessionStorage.setItem("plan", planParam);
        },
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
            axios.get('/loyalty/merchant/profile/details')
            .then((response) => {               
                vm.listplans = {
                    free_plan:'Free Plan',
                    small_monthly:'Small Monthly',
                    small_yearly:'Small Yearly',
                    medium_monthly:'Medium Monthly',
                    medium_yearly:'Medium Yearly',
                    large_monthly:'Large Monthly',
                    large_yearly:'Large Yearly',
                };
                vm.profiledata= response.data;
                vm.price_plan =vm.listplans[response.data.price_plan];

                axios.get('/loyalty/merchant/plans/'+ response.data.price_plan + '/details')
                    .then(response => {
                        console.log("Plan details ", response);
                        vm.plan_details = response.data;
                    })
                              
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				//console.log("Error ", error.response);
            })
          }, 
          choosePlanList:function(){
           // alert("sdfdfd");
            var vm = this; 
            vm.listplans = {
                free_plan:'Free Plan',
                small_monthly:'Small Monthly',
                small_yearly:'Small Yearly',
                medium_monthly:'Medium Monthly',
                medium_yearly:'Medium Yearly',
                large_monthly:'Large Monthly',
                large_yearly:'Large Yearly',
            };           
            var url_string = window.location.href;
            var url = new URL(url_string);
            var planId = url.searchParams.get("id");
            vm.select_price_plan =vm.listplans[planId];
                         
            axios.get('/loyalty/merchant/plans/'+ planId + '/details')
                .then(response => {
                    
                    vm.choose_plan_details = response.data;
                    console.log("TM Plan details ", vm.choose_plan_details);
                })
          },
          setPlanId: function(planid) {
            var modal = $('#m_modal_plan');
            
              if(this.price_plan === this.listplans[planid]) {
                console.log("plan id ", planid);
                this.$emit('showtoast',{'msg':'Your current plan is '+ this.price_plan,'type':'error','event':''})
              }
              else {
                // this.plan_id = planid;
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
                .catch(e => {
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.$emit('showtoast',{'msg': e.response.data.error_msg,'type':'error','event':''})
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
                       Are you sure want to select this plan <strong>{{plan_id}}</strong>?
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
                
                    <div class="row">

                        <div class="col-xl-12">
                             

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
                                            <!--<h4 class="m-portlet__head-text">{{'$'+plan_details.price}} USD</h4>-->
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-xl-4">
                            <div class="m-portlet__body">
                                <div class="m-widget13">
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Price: 
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                        {{'$'+plan_details.price}} 	 
                                        </span>
                                    </div>                                 
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Customers
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{plan_details.customers}}		 
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Tiers:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{plan_details.tier}}	 
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Outlets:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                        {{plan_details.outlet}}
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Staffs:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{plan_details.staff}}
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Plan Duration:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{plan_details.duration}}
                                        </span>
                                    </div>                                        
                                                
                                </div>		 
                            </div>
                            </div>
                        </div>

                        <div class="col-xl-12">


                            <div class="m-portlet__head">
                                <div class="m-portlet__head-caption">
                                    <div class="m-portlet__head-title">
                                        <h3 class="m-portlet__head-text">
                                            Selected Plan - {{select_price_plan}}
                                        </h3>
                                    </div>
                                </div> 
                                <div class="m-portlet__head-tools">
                                    <ul class="m-portlet__nav">
                                        <li class="m-portlet__nav-item">
                                            <!--<h4 class="m-portlet__head-text">{{'$'+choose_plan_details.price}} USD</h4>-->
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-xl-4">
                            <div class="m-portlet__body">
                                <div class="m-widget13">
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Price: 
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                        {{'$'+choose_plan_details.price}} 	 
                                        </span>
                                    </div>                                
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Customers
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{choose_plan_details.customers}}		 
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Tiers:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{choose_plan_details.tier}}	 
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Outlets:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                        {{choose_plan_details.outlet}}
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Staffs:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{choose_plan_details.staff}}
                                        </span>
                                    </div>
                                    <div class="m-widget13__item">
                                        <span class="m-widget13__desc m--align-right">
                                            Plan Duration:
                                        </span>
                                        <span class="m-widget13__text m-widget13__text-bolder">
                                            {{choose_plan_details.duration}}
                                        </span>
                                    </div>                                      
                                                
                                </div>
                                </div>		 
                            </div>
                        
                        </div>     
                        
                        
                        <div class="col-xl-12 cplanbox">
                            <a href="/plans" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10"><span><i class="la la-arrow-left"></i> <span>Back</span></span></a><button id="tier_submit" type="button" v-on:click="setPlanId()" class="btn btn-primary m-btn m-btn--custom">Confirm</button>
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
                                                {{listplans[plan.plan_id]}}
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
    `,
    mounted: function() {
        this.getParams();
    }
})