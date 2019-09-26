Vue.component('customers-details-header', {
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
                        Customer Details
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('customerformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>                
            </div>
        </div>
    </div>
    `
})

Vue.component('customers-details-component', {
    props:['primaryinput', 'customerkey', 'customercode'],
    data: function() {
        return {
            imageurl: '',
            customer: '',
            totalPoints: '',
            issuedatatable:'',
            redeemdatatable: '',
            coupondatatable: ''
        }
    },
    computed: {       
        isValidForm(){
            var retval = true;                      
            return retval;
        }
    },
    watch:{
       'customercode': function() {
            this.getCustomer(this.customercode);
       }

    },
    created: function () {
        console.log('Customer Details created')
    },
    methods: { 
        getCustomer: function(customercode) {
            var vm = this;
            console.log("Customer code ", customercode, this.customerkey);
            axios.get('loyalty/merchant/customers/' + this.customerkey + '/' + customercode)
            .then((response) => {
                console.log("Customer ", response.data); 
                  vm.customer = response.data; 
                  vm.totalPoints = vm.customer.loyalty[0].count;
                  vm.customerTransactionTable();           
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                
            })
        },
        customerTransactionTable: function() {
            this.issuedatatable = $('.m_datatable_customer_issue').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: `/loyalty/merchant/customers/${this.customercode}/loyaltyissue/transactions`,
                      method: 'POST',
                      params : { search_key: this.search_key},
                      map: function(raw) {
                        var dataSet = raw;
                        console.log("customers page",raw);
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                        }
                        return dataSet;
                      },
                    },
                  },
                  pageSize: 10,
                  serverPaging: true,
                  serverFiltering: false,
                  serverSorting: true,
                },
          
                // layout definition
                layout: {
                  scroll: false,
                  footer: false
                },

                // column sorting
                sortable: true,
                pagination: true,
                toolbar: {
                  // toolbar items
                  items: {
                    // pagination
                    pagination: {
                      // page size select
                      pageSizeSelect: [10],
                    },
                  },
                },
          
                search: {
                  input: $('#generalSearch'),
                },
          
                // columns definition
                columns: [
                  {
                    field: '',
                    title: '#',
                    sortable: false, // disable sort for this column
                    width: 40,
                    selector: false,
                    textAlign: 'center',
                    template: function (row, index,datatable) {
                        return  ((datatable.getCurrentPage() -1) *datatable.getPageSize() + index+1) ;
                    }
                  },
                  {
                    field: 'loyalty_token',
                    title: 'Token',
                    sortable: 'asc', // default sort
                    template: '{{loyalty_token}}',                                      
                  },
                  {
                    field: 'issued_on',
                    title: 'Issued Date',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.issued_on).format("YYYY-MM-DD HH:mm:ss");
                      }
            
                  },
                  {
                    field: 'loyalty_points',
                    title: 'Issued Points',
                    textAlign: 'center',
                    template: '{{loyalty_points}}'
            
                  },                  
                  {
                    field: 'loyalty_expiry',
                    title: 'Expiry Date',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.loyalty_expiry, 'YYYYMMDD').format("YYYY-MM-DD");
                      }
            
                  },
                  
                ],
            });
            this.redeemdatatable = $('.m_datatable_customer_redeem').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: `/loyalty/merchant/customers/${this.customercode}/status/4`,
                      method: 'POST',
                      params : { search_key: this.search_key},
                      map: function(raw) {
                        var dataSet = raw;
                        console.log("customers page",raw);
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                        }
                        return dataSet;
                      },
                    },
                  },
                  pageSize: 10,
                  serverPaging: true,
                  serverFiltering: false,
                  serverSorting: true,
                },
          
                // layout definition
                layout: {
                  scroll: false,
                  footer: false
                },

                // column sorting
                sortable: true,
                pagination: true,
                toolbar: {
                  // toolbar items
                  items: {
                    // pagination
                    pagination: {
                      // page size select
                      pageSizeSelect: [10],
                    },
                  },
                },
          
                search: {
                  input: $('#generalSearch'),
                },
          
                // columns definition
                columns: [
                  
                  {
                    field: 'coupon_code',
                    title: 'Coupon Code',
                    sortable: 'asc', // default sort
                    template: '{{coupon_code}}',                                      
                  },
                  {
                    field: 'coupon_serial',
                    title: 'Coupon Serial',
                    template: '{{coupon_serial}}',                                      
                  },
                  {
                    field: 'coupon_value',
                    title: 'Coupon Value',
                    template: '{{coupon_value}}',                                      
                  },
                  {
                    field: 'validity_begin',
                    title: 'Validity Start',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.validity_begin, 'YYYYMMDD').format("YYYY-MM-DD");
                      }
            
                  },
                  {
                    field: 'validity_end',
                    title: 'Validity End',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.validity_end, 'YYYYMMDD').format("YYYY-MM-DD");
                      }
            
                  },
                  
                ],
            });

            this.coupondatatable = $('.m_datatable_customer_coupon').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: `/loyalty/merchant/customers/${this.customercode}/status/3`,
                      method: 'POST',
                      params : { search_key: this.search_key},
                      map: function(raw) {
                        var dataSet = raw;
                        console.log("customers page",raw);
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                        }
                        return dataSet;
                      },
                    },
                  },
                  pageSize: 10,
                  serverPaging: true,
                  serverFiltering: false,
                  serverSorting: true,
                },
          
                // layout definition
                layout: {
                  scroll: false,
                  footer: false
                },

                // column sorting
                sortable: true,
                pagination: true,
                toolbar: {
                  // toolbar items
                  items: {
                    // pagination
                    pagination: {
                      // page size select
                      pageSizeSelect: [10],
                    },
                  },
                },
          
                search: {
                  input: $('#generalSearch'),
                },
          
                // columns definition
                columns: [
                 
                  {
                    field: 'coupon_code',
                    title: 'Coupon Code',
                    sortable: 'asc', // default sort
                    textAlign: 'center',
                    template: '{{coupon_code}}',                                      
                  },
                  {
                    field: 'coupon_serial',
                    title: 'Coupon Serial',
                    textAlign: 'center',
                    template: '{{coupon_serial}}',                                      
                  },
                  {
                    field: 'coupon_value',
                    title: 'Coupon Value',
                    textAlign: 'center',
                    template: '{{coupon_value}}',                                      
                  },
                  {
                    field: 'validity_begin',
                    title: 'Validity Start',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.validity_begin, 'YYYYMMDD').format("YYYY-MM-DD");
                      }
            
                  },
                  {
                    field: 'validity_end',
                    title: 'Validity End',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.validity_end, 'YYYYMMDD').format("YYYY-MM-DD");
                      }
            
                  },
                  
                ],
            });
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
        cancelForm:function(){
            this.$emit('customerformcancel',{'customer':this.customer,'event':this.$event})
        
        }
    },
    template: `
    <div class="m-grid__item m-content-customer-form d-none" id="m-customer-details" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <customers-details-header v-bind:isformvalid="isValidForm"
                            @customerformcancel="cancelForm()"
                    ></customers-details-header>
                        <div class="m-portlet__body">
                            <div class="row">
                                <div class="col-xl-3 col-lg-4">
                                    <div class="m-portlet ">
                                        <div class="m-portlet__body">
                                            <div class="m-card-profile">
                                                <div class="m-card-profile__title m--hide">
                                                    Customer Profile
                                                </div>
                                                <div class="m-card-profile__pic">
                                                    <div class="m-card-profile__pic-wrapper">	
                                                        <img :src="customer.imageurl" onError="this.src ='../assets/app/media/img/users/user4.png'" alt=""/>
                                                    </div>
                                                </div>
                                                <div class="m-card-profile__details">
                                                    <span class="m-card-profile__name">{{customer.customer_name}}</span>
                                                    <a href="" class="m-card-profile__email m-link">{{customer.customer_email}}</a>
                                                </div>
                                            </div>
                                            <div class="m-portlet__body-separator"></div>

                                           <!-- <div class="m-widget1 m-widget1--paddingless">
                                                <div class="m-widget1__item">
                                                    <div class="row m-row--no-padding align-items-center">
                                                        <div class="col">
                                                            <h3 class="m-widget1__title">Loyalty Points</h3>
                                                            <span class="m-widget1__desc">Total points</span>
                                                        </div>
                                                        <div class="col m--align-right">
                                                            <span class="m-widget1__number m--font-brand">+ {{totalPoints}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>	-->				
                                        </div>			
                                    </div>	
                                </div>
                                <div class="col-xl-9 col-lg-8">
                                    <div class="row">
                                        <div class="col-sm-12 col-md-12 col-lg-6">
                                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-brand" style="height: auto;">
                                                <div class="m-portlet__body">
                                                    <div class="m-widget26">
                                                        <div class="m-widget26__number">
                                                            {{totalPoints}}
                                                            <small>Current Balance</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="m--space-30"></div>
                                        </div>
                                        <div class="col-sm-12 col-md-12 col-lg-6">
                                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-success" style="height: auto;">
                                                <div class="m-portlet__body">
                                                    <div class="m-widget26">
                                                        <div class="m-widget26__number">
                                                            0
                                                            <small>Redeem Processed</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="m--space-30"></div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xl-12 col-lg-12">
                                            <div class="m-portlet m-portlet--full-height m-portlet--tabs  ">
                                                <div class="m-portlet__head">
                                                    <div class="m-portlet__head-tools">
                                                        <ul class="nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary" role="tablist">
                                                            <li class="nav-item m-tabs__item">
                                                                <a class="nav-link m-tabs__link active" data-toggle="tab" href="#m_customer_tab_1" role="tab">                                                                    
                                                                    Loyalty Points
                                                                </a>
                                                            </li>
                                                            <li class="nav-item m-tabs__item">
                                                                <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_customer_tab_3" role="tab">
                                                                    Coupon Points
                                                                </a>
                                                            </li>
                                                            <li class="nav-item m-tabs__item">
                                                                <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_customer_tab_2" role="tab">
                                                                    Redeemed
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>                                                           
                                                </div>
                                                <div class="tab-content">
                                                    <div class="tab-pane active" id="m_customer_tab_1">
                                                        <div class="m-content">
                                                            <div class="">
                                                                <div class="">
                                                                    <div class="m_datatable_customer_issue" id="customer_issue_data"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane" id="m_customer_tab_2">
                                                        <div class="m-content">
                                                            <div class="">
                                                                <div class="">
                                                                    <div class="m_datatable_customer_redeem" id="customer_redeem_data"></div>
                                                                </div>
                                                            </div>
                                                        </div>                                                        
                                                    </div>
                                                    <div class="tab-pane " id="m_customer_tab_3">
                                                        <div class="m-content">
                                                            <div class="">
                                                                <div class="">
                                                                    <div class="m_datatable_customer_coupon" id="customer_coupon_data"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>											
                    </div>
                    <!--end::Portlet-->
                </div>
            </div>
        </div>
    </div>
    `
})