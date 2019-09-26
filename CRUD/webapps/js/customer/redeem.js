
Vue.component('redeem-loyalty-main-component', {
    props: ['customerkey', 'rewardmethod'],
    template: `
    <div  class="m-grid__item" id="m-redeem-main" >
        <div class="m-grid__item m-content-redeem-form" id="m-redeem-form" >
            <div class="m-content">
                <div class="row">
                    <div class="col-lg-12">
                        <!--begin::Portlet-->
                        <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">                        
                            <div class="m-portlet__head">
                                <div class="m-portlet__head-progress">
                                    <!-- here can place a progress bar-->
                                </div>
                                <div class="m-portlet__head-wrapper">
                                    <div class="m-portlet__head-caption">
                                        <div class="m-portlet__head-title">
                                            <h3 class="m-portlet__head-text">
                                                Redeem Loyalty
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body">
                                <redeem-loyalty-component @showtoast="$emit('showtoast', $event)" :customerkey="customerkey" :rewardmethod="rewardmethod"></redeem-loyalty-component>
                            </div>											
                        </div>
                        <!--end::Portlet-->
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    `
})

const customerdata = new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--
    }
  })

new Vue({
    el: '#redeem-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        datatable:'',
        customerkey: '',
        rewardmethod: ''

    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
        this.getSettings();
    },
    methods: {
        sayNow: function (msg1, msg2) {
            //alert(msg1, msg2)
        },
        showToast: function(msg, type) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              };              
              toastr[type](msg);
        },
        getSettings: function() {
            var vm = this;
            axios.get('/loyalty/merchant/settings/details')
            .then((response) => {
				this.newSetting = false;
				var settings = response.data.loyalty;
                vm.customerkey = settings.customer_key;
                vm.rewardmethod = settings.reward_method;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
            })
        },
        initRedeemTable: function() {
            var timezone = sessionStorage.getItem("timezone");
            this.datatable = $('.m_datatable_redeem').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/merchant/list/redeemtransaction',
                      map: function(raw) {
                        var dataSet = raw;
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                        }
                        return dataSet;
                      },
                    },
                  },
                  pageSize: 10,
                  serverPaging: true,
                  serverFiltering: true,
                  serverSorting: true,
                },
          
                // layout definition
                layout: {
                  scroll: false,
                  footer: false
                },
    
                // column sorting
                sortable: true,
                pagination: false,
                toolbar: {
                  // toolbar items
                  items: {
                    // pagination
                    pagination: {
                      // page size select
                      pageSizeSelect: [10, 20, 30, 50, 100],
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
                    field: 'customer_account',
                    title: 'Customer Account',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_account}}',
                  },
                  {
                    field: 'loyalty_points',
                    title: 'Redeemed Points',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{loyalty_points}}',
                  },
                  {
                    field: 'redeemed_on',
                    title: 'Redeemed Date',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        // return row.issued_on
                        return moment(row.redeemed_on).tz(timezone).format("YYYY-MM-DD HH:mm:ss");
                      }
            
                  },
                //   {
                //     field: 'Actions',
                //     width: 110,
                //     title: 'Actions',
                //     sortable: false,
                //     overflow: 'visible',
                //     template: function (row, index, datatable) {
                //       var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                //       return '\<a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                //                       <i class="la la-edit"></i>\
                //                   </a>\
                //               ';
                //     },
                //   }
                  
                ],
            });
            $('#m_form_status, #m_form_tier').selectpicker();           
            // ($(document)).on('click', '#editBtn', (e) => {  
            //     e.preventDefault();
            //     let id = '';
            // });
            
        },

    },
    mounted(){
        // this.initRedeemTable();
    }

})

// {
//     field: 'Actions',
//     width: 110,
//     title: 'Actions',
//     sortable: false,
//     overflow: 'visible',
//     template: function (row, index, datatable) {
//       var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
//       return '\
//                   <div class="dropdown ' + dropup + '">\
//                       <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
//                           <i class="la la-ellipsis-h"></i>\
//                       </a>\
//                         <div class="dropdown-menu dropdown-menu-right">\
//                           <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
//                           <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
//                           <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
//                         </div>\
//                   </div>\
//                   <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
//                       <i class="la la-edit"></i>\
//                   </a>\
//                   <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
//                       <i class="la la-trash"></i>\
//                   </a>\
//               ';
//     },
//   }