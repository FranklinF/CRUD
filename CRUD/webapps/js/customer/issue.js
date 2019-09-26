
Vue.component('issue-loyalty-main-component', {
    props: ['customerkey', 'rewardmethod'],   
    template: `
    <div  class="m-grid__item" id="m-issue-main" >
        <div class="m-grid__item m-content-issue-form" id="m-issue-form" >
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
                                                Issue Loyalty
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m-portlet__body">
                                <issue-loyalty-component @showtoast="$emit('showtoast', $event)" @reloaddata="$emit('reloaddata', $event)" :customerkey="customerkey" :rewardmethod="rewardmethod"></issue-loyalty-component>                               
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
    el: '#issue-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        datatable:'',
        customerkey: '',
        rewardmethod: '',
        datatable: '',

    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message);
        this.getSettings();
    },
    methods: {
        sayNow: function (msg1, msg2) {
           // alert(msg1, msg2)
        },
        reloadData: function(e) {
            console.log("event ", $('#issue_trans_data').mDatatable());
            this.initIssueTable();
            // this.datatable.reload();
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

        initIssueTable: function() {            
            this.datatable = $('.m_datatable_issue').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/merchant/list/transactions/issue',
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
                    field: 'customer_account',
                    title: 'Customer Account',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_account}}',
                  },
                  {
                    field: 'issuer',
                    title: 'Staff Code',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{staff_code}}',
                  },
                  {
                    field: 'loyalty_points',
                    title: 'Issued Points',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{loyalty_points}}',
                  },
                  {
                    field: 'issued_on',
                    title: 'Issued Date',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return moment(row.issued_on._now).format("YYYY-MM-DD HH:mm:ss A"); //moment(row.issued_on).tz('Europe/Berlin').format("YYYY-MM-DD HH:mm:ss A") //moment.tz(row.issued_on, "Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss A"); //row.membership_date.replace(pattern,'$3-$2-$1');
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
            
        },
    },
    mounted(){
        // this.initIssueTable();
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