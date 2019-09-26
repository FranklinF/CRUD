Vue.component('staffs-main-component', {
    props: ['staffid', 'staffname'],
    template: `
    <div class="m-grid__item" id="m-staff-main" >
            <staffs-list-component  :staffname="staffname"
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @showtoast="$emit('showtoast', $event)"
                @onstaffchanged="$emit('onstaffchanged',$event)"
                @newstaffclicked="$emit('newstaffclicked',$event)"
                @deletestaffclicked="$emit('deletestaffclicked',$event)"
            ></staffs-list-component>
            <staffs-form-component  primaryinput="b"
                @staffformcancel="$emit('staffformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @staffformsave="$emit('staffformsave',$event)"
            ></staffs-form-component>
            <staffs-form-edit-component  primaryinput="b" :staffid="staffid"
                @staffformcancel="$emit('staffformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @staffformsave="$emit('staffformsave',$event)"
            ></staffs-form-edit-component>
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Staff</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this Staff <strong>{{staffname}} ?</strong></p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deletestaffclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->
        
    </div>
    `
})

new Vue({
    el: '#staffs-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        staffid: '',
        staffname: '',
        search_key:''
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
        displayStaffForm : function(){
            // alert('display Add staff form')
            $('#m-staff-form').removeClass('d-none');
            $('#m-staff-list').addClass('d-none');
            $('#m-staff-form-edit').addClass('d-none');
        },
        displayStaffList : function(){
            //alert('display staff list')
            $('#m-staff-list').removeClass('d-none');
            $('#m-staff-form').addClass('d-none');
            $('#m-staff-form-edit').addClass('d-none');
            this.datatable.reload();
        },
        displayStaffFormEdit: function() {
            //alert('display form')
            $('#m-staff-form').addClass('d-none');
            $('#m-staff-list').addClass('d-none');
            $('#m-staff-form-edit').removeClass('d-none');
        },
        initStaffList : function(){
            this.initStaffTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onstaffChange : function(){
            //alert('staff Changed', )
            this.datatable.search($('#m_form_staff').val(), 'staff');
        },
        editStaffForm: function(staffid) {
            this.displayStaffFormEdit();
            this.staffid = staffid;
            console.log("id ", this.staffid);
        },
        deleteStaff(){
            var vm = this;
            var form = $('#m-staff-list');
            console.log("Delete Staff ", this.staffid);
            axios.put(`/loyalty/staffs/`+ this.staffid, {
                'staff_code': this.staffid,
                'status': 0,
            }).then(response => {
                this.datatable.reload();
                vm.showToast('Staff Delete Success', 'success');             
                // vm.showErrorMsg(form, 'success', 'Staff Delete Success !! ');
            })
            .catch(e => {
                console.log('failure call:', e);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                vm.showToast('Staff Delete failed', 'error');                
                // vm.showErrorMsg(form, 'danger', 'Staff Delete failed !! ');
            })
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
        initStaffsTable: function() {
            this.datatable = $('.m_datatable_staff').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/staffs/list',
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
                    field: 'staffname',
                    title: 'Staff Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: function(row) {
                        if(row.staff_name != null)
                            return row.staff_name;
                        else
                            return 'Admin';
                    }
                  },
                  {
                    field: 'contact_no',
                    title: 'Contact',
                    sortable: 'asc', // default sort
                    width: 150,
                    template: function(row) {
                        if(row.staff_contact_no != null)
                            return row.staff_contact_no;
                        else
                            return '';
                    }
                  },
                  {
                    field: 'staffcode',
                    title: 'Staff Code',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 150,
                    // basic templating support for column rendering,
                    template: '{{staff_code}}',
                  },
                  {
                    field: 'staff_type',
                    title: 'Type',
                    // callback function support for column rendering
                    template: function(row) {
                        var typevals = {
                            1: {title: 'Admin', class: ' m-badge--brand'},
                            2: {title: 'Staff', class: ' m-badge--metal'}             
                        };
                        if(row.staff_type == undefined) row.staff_type = 1;
                        return '<span class="m-badge ' + typevals[row.staff_type].class + ' m-badge--wide">' + typevals[row.staff_type].title + '</span>';
                        // return row.staff_type
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
                        if(row.status == undefined) row.status = 1;
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
                            if(row.staff_code !== 'admin') {
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
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="staffcode"]').text();
                  this.editStaffForm(id);
              });
              ($(document)).on('click', '#deleteBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="staffcode"]').text();
                  let name = $(e.target).closest('.m-datatable__row').find('[data-field="staffname"]').text();
                  this.staffid = id;
                  this.staffname = name;
              });
            }
    },
    mounted(){
        this.initStaffsTable();
        this.datatable.setDataSourceParam('headers', {search_key: null});
        this.datatable.reload();
    }
})

