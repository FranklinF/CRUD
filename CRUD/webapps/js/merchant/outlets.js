Vue.component('outlets-main-component', {
    props: ['outletid'],
    template: `
    <div class="m-grid__item" id="m-outlet-main" >
            <outlets-list-component  
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @onoutletchanged="$emit('onoutletchanged',$event)"
                @newoutletclicked="$emit('newoutletclicked',$event)"
            ></outlets-list-component>
            <outlets-form-component @showtoast="$emit('showtoast', $event)" primaryinput="p" :outletid="outletid"
                @outletformcancel="$emit('outletformcancel',$event)"
                @outletformsave="$emit('outletformsave',$event)"
            ></outlets-form-component>
            <edit-outlets-form-component @showtoast="$emit('showtoast', $event)" primaryinput="p" :outletid="outletid"
                @outletformcancel="$emit('outletformcancel',$event)"
                @outletformsave="$emit('outletformsave',$event)"
            ></edit-outlets-form-component>
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Outlet</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this <strong>{{outletid}}</strong> Outlet?  </p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deleteoutletclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->
        
    </div>
    `
})

new Vue({
    el: '#outlets-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        outletid: '',
        search_key: '',
        outletname: ''
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
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
        displayOutletForm : function(){
            //alert('display form')
            $('#m-outlet-form').removeClass('d-none');
            $('#m-outlet-form-edit').addClass('d-none');
            $('#m-outlet-list').addClass('d-none');
        },
        displayOutletEditForm : function(){
            //alert('display Edit form')
            $('#m-outlet-form').addClass('d-none');
            $('#m-outlet-form-edit').removeClass('d-none');
            $('#m-outlet-list').addClass('d-none');
        },
        displayOutletList : function(){
            //alert('display outlet list')
            $('#m-outlet-form').addClass('d-none');
            $('#m-outlet-form-edit').addClass('d-none');
            $('#m-outlet-list').removeClass('d-none');
            this.datatable.reload();
        },
        initOutletList : function(){
            this.initOutletTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onoutletChange : function(){
            //alert('outlet Changed', )
            this.datatable.search($('#m_form_outlet').val(), 'outlet');
        },        
        editOutletForm: function(outletid) {
            this.displayOutletEditForm();
            this.outletid = outletid;
            console.log("id ", this.outletid);
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
        deleteOutlet(){
            var vm = this;
            var form = $('#m-outlet-list');
            console.log("Delete Outlet ", this.outletid);
            axios.put(`/loyalty/outlets/`+ this.outletid, {
                'outlet_id': this.outletid,
                'outlet_name': this.outletname,
                'status': 0,
            }).then(response => {
                this.datatable.reload();
                vm.showErrorMsg(form, 'success', 'Outlet Delete Success !! ');
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
            })
        },
        initOutletsTable: function() {
            this.datatable = $('.m_datatable_outlet').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/outlets/list',
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
                    width: 20,
                    selector: false,
                    textAlign: 'center',
                    template: function (row, index,datatable) {
                        return  ((datatable.getCurrentPage() -1) *datatable.getPageSize() + index+1) ;
                    }
                  }, 
                  {
                    field: 'outlet_id',
                    title: 'Outlet Id',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{outlet_id}}',
                  },
                  {
                    field: 'outlet_name',
                    title: 'Outlet Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{outlet_name}}',
                  },
                  {
                    field: 'outlet_address',
                    title: 'Address',
                    sortable: 'asc', // default sort
                    width: 150,
                    template: function(row) {
                        if(row.outlet_address != null)
                            return row.outlet_address;
                        else
                            return '';
                    }
                  },
                  {
                    field: 'outlet_email_id',
                    title: 'Email',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 175,
                    // basic templating support for column rendering,
                    template: '{{outlet_email_id}}',
                  },
                  {
                    field: 'outlet_contact',
                    title: 'Contact',
                    template: function(row) {
                        if(row.outlet_contact != null)
                            return row.outlet_contact;
                        else
                            return '';
                    }
            
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
                      if(row.outlet_id !== 'default') {
                        return '\
                                <a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                    <i class="la la-edit"></i>\
                                </a>\
                                <a href="#" data-toggle="modal" data-target="#m_modal_1" id="deleteBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                                    <i class="la la-trash"></i>\
                                </a>\
                            ';
                    }
                    else {
                        return '\
                                <a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                    <i class="la la-edit"></i>\
                                </a>\
                                ';
                    }
                      
                      
                    },
                  }
                ],
              });
          
              $('#m_form_status').on('change', function() {
                datatable.search($(this).val(), 'Status');
              });
          
              $('#m_form_type').on('change', function() {
                datatable.search($(this).val(), 'Type');
              });
              var vm = this;
              $('#generalSearch').on('keyup', function(e) {
                e.preventDefault();
                vm.search_key = e.target.value;
                vm.datatable.setDataSourceParam('headers', {search_key: vm.search_key});
                vm.datatable.reload();
                console.log('generalSearch ' , e.target.value);
              })
                      
              $('#m_form_status, #m_form_type').selectpicker();
              ($(document)).on('click', '#editBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="outlet_id"]').text();
                  this.editOutletForm(id);
              });
              ($(document)).on('click', '#deleteBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="outlet_id"]').text();
                  let name = $(e.target).closest('.m-datatable__row').find('[data-field="outlet_name"]').text();
                  this.outletid = id;
                  this.outletname = name;
              });
            }
    },
    mounted(){
        this.initOutletsTable();
        this.datatable.setDataSourceParam('headers', {search_key: null});
        this.datatable.reload();
    }
})