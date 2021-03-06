Vue.component('customers-table-header-component', {
    template: `
    <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">
                <h3 class="m-portlet__head-text">
                   Customer List
                </h3>
            </div>
        </div>
    </div>
    `
})

Vue.component('customers-table-alert-component', {
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

Vue.component('customers-table-search-component', {
    data: function() {
        return {
            tiers: ''
        }
    },
    methods: {
        getTiers: function() {
            var vm = this;
            axios.get("/loyalty/tiers?page=1")
            .then(response => {
                vm.tiers = response.data.tiers;
            })
        }
    },
    template: `
    <div class="m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30">
        <div class="row align-items-center">
            <div class="col-xl-8 order-2 order-xl-1">
                <div class="form-group m-form__group row align-items-center">
                <!-- <div class="col-md-4">
                        <div class="m-form__group m-form__group--inline">
                            <div class="m-form__label">
                                <label>Status:</label>
                            </div>
                            <div class="m-form__control">
                                <select v-on:change="$emit('onstatuschanged',$event)" class="form-control m-bootstrap-select" id="m_form_status">
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="2">Not active</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-md-none m--margin-bottom-10"></div>
                    </div> -->
                    <div class="col-md-4">
                        <div class="m-form__group m-form__group--inline">
                            <div class="m-form__label">
                                <label class="m-label m-label--single">Tier:</label>
                            </div>
                            <div class="m-form__control">
                                <select v-on:change="$emit('ontierchanged',$event)" class="form-control m-bootstrap-select" id="m_form_tier">
                                    <option value="">All</option>
                                    <option v-for="tier in tiers" :value="tier.tier_id">{{tier.tier_id}}</option>                                    
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
                <a href="#" v-on:click="$emit('newcustomerclicked',$event)" class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill">
                    <span>
                        <i class="flaticon-user-add"></i>
                        <span> New Customer</span>
                    </span>
                </a>
                <div class="m-separator m-separator--dashed d-xl-none"></div>
            </div>
        </div>
    </div>
    `,
    mounted: function() {
        this.getTiers();
    }
})

Vue.component('customers-list-component', {
    data: function() {
        return {
            subheader:{
                title: 'Customers',
                items :[
                    {id:1, link:'/loyalty/customers', icon:'la la-home', name:'' },
                    {id:2, link:'#', icon:'', name:'Customer List' }                ]
            }
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
    },
    template: `
    <div class="m-grid__item m-content-customer-list" id="m-customer-list" >
        <div class="m-content">
            <div class="m-portlet m-portlet--mobile">
                <customers-table-header-component></customers-table-header-component>
                <div class="m-portlet__body">
                    <!--begin: Search Form -->
                    <customers-table-search-component 
                        v-on:newcustomerclicked="$emit('newcustomerclicked',$event)"
                        v-on:onstatuschanged="$emit('onstatuschanged',$event)"
                        v-on:ontierchanged="$emit('ontierchanged',$event)"
                        
                    ></customers-table-search-component>
                    <!--end: Search Form -->

                    <!--begin: Datatable -->
                    <div class="m_datatable_customer" id="customer_data"></div>
                    <!--end: Datatable -->
                </div>
            </div>
        </div>
    </div>
    `
})