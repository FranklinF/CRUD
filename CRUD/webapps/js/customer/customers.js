Vue.component('customers-main-component', {
    props: ['customerkey', 'customercode'],
    template: `
    <div  class="m-grid__item" id="m-customer-main" >
            <customers-list-component                
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @ontierchanged="$emit('ontierchanged',$event)"
                @newcustomerclicked="$emit('newcustomerclicked',$event)"
            ></customers-list-component>
            <customers-form-component @showtoast="$emit('showtoast', $event)" primaryinput="p" :customerkey="customerkey" :customercode="customercode"
                @customerformcancel="$emit('customerformcancel',$event)"
                @customerformsave="$emit('customerformsave',$event)"
            ></customers-form-component>
            <customers-form-component-edit @showtoast="$emit('showtoast', $event)" primaryinput="p" :customerkey="customerkey" :customercode="customercode"
                @customerformcancel="$emit('customerformcancel',$event)"
                @customerformsave="$emit('customerformsave',$event)"
            ></customers-form-component-edit>

            <customers-details-component @showtoast="$emit('showtoast', $event)" primaryinput="p"  :customerkey="customerkey" :customercode="customercode"
                @customerformcancel="$emit('customerformcancel',$event)"
            ></customers-details-component>
        
    </div>
    `
})
//@hook:mounted="childMounted"
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
    el: '#customers-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        datatable:'',
        customerkey: '',
        tiers: [],
        customercode: '',
        tierid: '',
        search_key: ''
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
    },
    methods: {
        sayNow: function (msg1, msg2) {
            // //alert(msg1, msg2)
        },
        getSettings: function() {
            var vm = this;
            axios.get('loyalty/tiers?page=1')
            .then((response) => {
                this.tiers = response.data.tiers;
                this.initCustomerList();
                this.datatable.setDataSourceParam('headers', {search_key: ''});
                this.datatable.reload();
            }).catch((error) => {
                console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },
        displayCustomerForm : function(){
            // alert('display customer form')
            $('#m-customer-form').removeClass('d-none');
            $('#m-customer-list').addClass('d-none');
            $('#m-customer-form-edit').addClass('d-none');
            $('#m-customer-details').addClass('d-none');
        },
        displayCustomerList : function(){
            //alert('display customer list')
            $('#m-customer-form').addClass('d-none');
            $('#m-customer-form-edit').addClass('d-none');
            $('#m-customer-list').removeClass('d-none');
            $('#m-customer-details').addClass('d-none');
            this.datatable.reload();
            axios.get('/loyalty/merchant/list/customers').then({

            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },
        displayCustomerFormEdit: function() {

            $('#m-customer-form').addClass('d-none');
            $('#m-customer-form-edit').removeClass('d-none');
            $('#m-customer-list').addClass('d-none');
            $('#m-customer-details').addClass('d-none');
        },
        displayCustomerDetails: function() {
            $('#m-customer-form').addClass('d-none');
            $('#m-customer-form-edit').addClass('d-none');
            $('#m-customer-list').addClass('d-none');
            $('#m-customer-details').removeClass('d-none');
        },
        initCustomerList : function(){
            this.initCustomerTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onTierChange : function(){
            //alert('Tier Changed', )
            this.datatable.search($('#m_form_tier').val(), 'Tier');
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
              this.datatable.reload();
              toastr[type](msg);
        },
        editCustomerForm: function(customercode) {
            this.displayCustomerFormEdit();
            this.customercode = customercode;
        },
        showCustomerDetails: function(customercode) {
            this.displayCustomerDetails();
            this.customercode = customercode;
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
        onChangeTier: function() {
            //alert("tier changed")
        },
        
        initCustomerTable: function() {
            console.log("Tiers ", this.tiers);
            var timezone = sessionStorage.getItem("timezone");
            this.datatable = $('.m_datatable_customer').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/merchant/list/customers',
                      method: 'POST',
                      params : { search_key: this.search_key},
                      map: function(raw) {
                        var dataSet = raw;
                        console.log("customers page",raw);
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                          
                          var len =dataSet.length;
                          if(len>0)
                          {
                            for(i=0;i<len;i++)
                            {
                              if(dataSet[i].customer_email == undefined)
                              {
                                dataSet[i].customer_email = "";
                              }
                              
                              if(dataSet[i].customer_code == undefined)
                              {
                                dataSet[i].customer_code = "";
                              }

                              if(dataSet[i].customer_mobile == undefined)
                              {
                                dataSet[i].customer_mobile = "";
                              }                              

                            }
                          }

                          
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
                    field: 'customer_name',
                    title: 'Customer Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_name}}',
                  },
                  {
                    field: 'customer_email',
                    title: 'Customer Email',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_email}}',
                  },
                  {
                    field: 'customer_mobile',
                    title: 'Customer Mobile',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_mobile}}',
                  },
                  {
                    field: 'customer_code',
                    title: 'Customer Code',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{customer_code}}',
                  },
                  {
                    field: 'nutick_customer_id',
                    title: 'NuTick ID',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{customer_nutick_account}}',
                  },
                  {
                    field: 'joined_date',
                    title: 'Membership Date',
                    textAlign: 'center',
                    template: function(row){
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        return (timezone)? moment(row.membership_date).format("YYYY-MM-DD HH:mm:ss"):moment(row.membership_date).format("YYYY-MM-DD HH:mm:ss"); //moment.tz(row.membership_date, "America/New_York").format("YYYY-MM-DD HH:mm:ss"); //row.membership_date.replace(pattern,'$3-$2-$1');
                      }
            
                  },
                  {
                    field: 'tier_name',
                    title: 'Tier',
                    sortable: 'asc', // default sort
                    template: '{{tier_name}}',                                      
                  },
                  {
                    field: 'status',
                    title: 'Status',
                    // callback function support for column rendering
                    template: function(row) {
                        var statusvals = {
                            1: {'title': 'Active', 'class': ' m-badge--success'},
                            2: {'title': 'Not Active', 'class': ' m-badge--primary'},
                            3: {'title': 'Pending', 'class': 'm-badge--brand'},
                            4: {'title': 'Delivered', 'class': ' m-badge--metal'},
                            5: {'title': 'Info', 'class': ' m-badge--info'},
                            6: {'title': 'Danger', 'class': ' m-badge--danger'},
                            7: {'title': 'Warning', 'class': ' m-badge--warning'},              
                        };
                        return '<span class="m-badge ' + statusvals[row.status].class + ' m-badge--wide">' + statusvals[row.status].title + '</span>';
                    },
                  },
                  {
                    field: 'Actions',
                    width: 110,
                    title: 'Actions',
                    sortable: false,
                    overflow: 'visible',
                    template: function (row, index, datatable) {
                      var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                      return '\<a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                      <i class="la la-edit"></i>\
                                  </a>\
                                  \<a href="#" id="detailsBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Show details">\
                                      <i class="la la-eye"></i>\
                                  </a>\
                              ';
                    },
                  }
                  
                ],
            });
            $('#m_form_status, #m_form_tier').selectpicker();
            var vm = this;
            $('#generalSearch').on('keyup', function(e) {
                e.preventDefault();
                vm.search_key = e.target.value;
                vm.datatable.setDataSourceParam('headers', {search_key: vm.search_key});
                vm.datatable.reload();
                console.log('generalSearch ' , e.target.value);
            })

            $('#m_form_status').on('change', function() {
                vm.datatable.setDataSourceParam('headers', {search_key: $(this).val()});
                vm.datatable.reload();
            });
        
            $('#m_form_tier').on('change', function() {
                vm.datatable.setDataSourceParam('headers', {search_key: $(this).val()});
                vm.datatable.reload();
            });
            console.log("this.customerkey ", this.customerkey);
            ($(document)).on('click', '#editBtn', (e) => {  
                e.preventDefault();
                let id = '';
                if(this.customerkey === 'E') {
                    id = $(e.target).closest('.m-datatable__row').find('[data-field="customer_email"]').text();
                    this.editCustomerForm(id);
                }
                else if(this.customerkey === 'M') {
                    id = $(e.target).closest('.m-datatable__row').find('[data-field="customer_mobile"]').text();
                    this.editCustomerForm(id);
                }
                else if(this.customerkey === 'C') {
                    id = $(e.target).closest('.m-datatable__row').find('[data-field="customer_code"]').text();
                    this.editCustomerForm(id);
                }
                else if(this.customerkey === 'N') {
                    id = $(e.target).closest('.m-datatable__row').find('[data-field="nutick_customer_id"]').text();
                    this.editCustomerForm(id);
                }
                                
                
            });
            ($(document)).on('click', '#detailsBtn', (e) => {  
                e.preventDefault();
                id = $(e.target).closest('.m-datatable__row').find('[data-field="nutick_customer_id"]').text();
                    this.showCustomerDetails(id);
            })

            if(this.customerkey === 'E') {
                this.datatable.hideColumn('customer_mobile');
                this.datatable.hideColumn('customer_code');
            }
            else if(this.customerkey === 'M') {
                this.datatable.hideColumn('customer_email');
                this.datatable.hideColumn('customer_code');
            }
            else if(this.customerkey === 'C') {
                this.datatable.hideColumn('customer_email');
                this.datatable.hideColumn('customer_mobile');
            }
            else if(this.customerkey === 'N') {
                this.datatable.hideColumn('customer_email');
                this.datatable.hideColumn('customer_mobile');
                this.datatable.hideColumn('customer_code');
            }
            
        }
    },
    mounted(){
        var vm = this;
        axios.get('/loyalty/merchant/settings/details')
        .then((response) => {
            vm.newSetting = false;				
            var settings = response.data.loyalty;
            vm.customerkey = settings.customer_key;
            console.log("Settings Response ", vm.customerkey);
            this.getSettings();
            
        })
        .catch((error) => {
            console.log("Error ", error.response);
            if(error.response.status == 403) {
                window.location.replace('/login');
            }
        })
        
        // this.initCustomerList();
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