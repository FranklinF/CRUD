Vue.component('cards-table-header-component', {
    template: `
    <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">
                <h3 class="m-portlet__head-text">
                   Card List
                </h3>
            </div>
        </div>
    </div>
    `
})

Vue.component('cards-table-alert-component', {
    template: `
    <div class="m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30" role="alert">
        <div class="m-alert__icon">
            <i class="flaticon-exclamation m--font-brand"></i>
        </div>
        <div class="m-alert__text">
            With server-side processing enabled, all paging, searching, ordering actions that DataTables performs are handed off to a server where an SQL engine (or similar) can perform these actions on the large data set.
            See official documentation <a href="https://datatables.net/examples/data_sources/server_side.html" target="_blank">here</a>.
        </div>
    </div>
    `
})

Vue.component('cards-table-search-component', {
    template: `   
    <div class="m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30">
        <div class="row align-items-center">
            <div class="col-xl-8 order-2 order-xl-1">
                <div class="form-group m-form__group row align-items-center">
                    <div class="col-md-4">
                        <div class="m-form__group m-form__group--inline">
                            <div class="m-form__label">
                                <label>Status:</label>
                            </div>
                            <div class="m-form__control">
                                <select v-on:change="$emit('onstatuschanged',$event)" class="form-control m-bootstrap-select" id="m_form_status">
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="2">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-md-none m--margin-bottom-10"></div>
                    </div>
                    <div class="col-md-4">
                        <div class="m-form__group m-form__group--inline">
                            <div class="m-form__label">
                                <label class="m-label m-label--single">Tier:</label>
                            </div>
                            <div class="m-form__control">
                                <select v-on:change="$emit('ontierchanged',$event)" class="form-control m-bootstrap-select" id="m_form_tier">
                                    <option value="">All</option>
                                    <option value="1">Default</option>
                                    <option value="2">premium</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-md-none m--margin-bottom-10"></div>
                    </div>
                    <div class="col-md-4">
                        <div class="m-input-icon m-input-icon--left">
                            <input type="text" class="form-control m-input" placeholder="Search..." id="generalSearch">
                            <span class="m-input-icon__icon m-input-icon__icon--left">
                                <span><i class="la la-search"></i></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="col-xl-4 order-1 order-xl-2 m--align-right">
                <a href="#" data-toggle="modal" data-target="#m_modal_plan"  class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill">
                    <span>
                        <i class="flaticon-user-add"></i>
                        <span> Upgrade Plan</span>
                    </span>
                </a>
                <div class="m-separator m-separator--dashed d-xl-none"></div>
            </div>          
        </div>
    </div>
    `
})

Vue.component('cards-list-component', {
    data: function() {
        return {
            subheader:{
                title: 'cards',
                items :[
                    {id:1, link:'/loyalty/merchant/list/cards', icon:'la la-home', name:'' },
                    {id:2, link:'#', icon:'', name:'cards List' }                ]
            },
            plans: [],
            plan_id:''
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.getPlanList();
    },
    methods: {
        getPlanList: function() {
            axios.get('/loyalty/merchant/plans/list')
              .then(response => {
                  console.log("Response ", response.data);
                  this.plans = response.data.subscription_plans;
              })
          },       
          upgradeplan: function(e) {
              e.preventDefault();
              var vm = this;
            var modal = $('#m_modal_plan');
            
            var form = $("#form_plan");
            form.validate({
                rules: {
                    plan_id: {
                        required: true
                    }
                }
            })

            if(!form.valid()) {
                return;
            }
            else {
                modal.modal("hide");
            }

            console.log("Plan Id ", vm.plan_id)
            var data = {
                plan_id: vm.plan_id
            }
            axios.put('/loyalty/merchant/upgrade/plan', data)
                .then(response => {
                    vm.$emit('showtoast',{'msg':'Plan has been updated success','type':'success','event':vm.$event})
                })

          },
    },
    template: `
    <div class="m-grid__item m-content-payment-list" id="m-payment-list" >
        <div class="m-content">
        <!--begin::Modal-->
        <div class="modal fade" id="m_modal_plan" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Upgrade Plan</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="m-form" id="form_plan">
                            <div class="m-form__group form-group">
                                <label for="">Default Radios</label>
                                <div v-for="plan in plans" class="m-radio-list">
                                    <label class="m-radio">
                                    <input type="radio" name="example_1" :value="plan.product_name"> {{plan.product_name}}
                                    <span></span>
                                        <div v-for="option in plan.subscription_interval" class="m-radio-list">
                                            <input type="radio" name="plan_id" v-model="plan_id" :value="option.plan_id"> {{option.duration}}
                                            <span></span>
                                        </div>
                                    </label>                                    
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" v-on:click="upgradeplan($event)" class="btn btn-primary">Upgrade</button>
                    </div>
                </div>
            </div>
        </div>
        <!--end::Modal-->
            <div class="m-portlet m-portlet--mobile">
                <cards-table-header-component></cards-table-header-component>
                <div class="m-portlet__body">
                <!--begin: Search Form -->
                <!--<cards-table-search-component></cards-table-search-component>-->
                    <!--end: Search Form -->

                    <!--begin: Datatable -->
                    <div class="m_datatable_cards" id="card_data"></div>
                    <!--end: Datatable -->
                </div>
            </div>
        </div>
    </div>
    `
})