Vue.component('programs-main-component', {  
    props: ['programid']  ,
    template: `
    <div class="m-grid__item" id="m-program-main" >
            <programs-list-component  
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @onprogramchanged="$emit('onprogramchanged',$event)"
                @newprogramclicked="$emit('newprogramclicked',$event)"
                @editprogramclicked="$emit('editprogramclicked',$event)"
                @deleteprogramclicked="$emit('deleteprogramclicked',$event)"
            ></programs-list-component>
            <programs-form-edit-component :programid='programid' @showtoast="$emit('showtoast', $event)" primaryinput="p" 
                @programformcancel="$emit('programformcancel',$event)"
                @programformsave="$emit('programformsave',$event)"
            ></programs-form-edit-component>
           
        
    </div>
    `
})

{/* :programid="programid" <programs-list-component  
@onstatuschanged="$emit('onstatuschanged',$event)"
@onprogramchanged="$emit('onprogramchanged',$event)"
@newprogramclicked="$emit('newprogramclicked',$event)"
@editprogramclicked="$emit('editprogramclicked',$event)"
@deleteprogramclicked="$emit('deleteprogramclicked',$event)"
></programs-list-component>
<programs-form-component  primaryinput="p"
@programformcancel="$emit('programformcancel',$event)"
@programformsave="$emit('programformsave',$event)"
></programs-form-component> 
 <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Program</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this {{programid}} </p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deleteprogramclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->*/}

new Vue({
    el: '#programs-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        datatable:'',
        programid: ''
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
    },
    methods: {
        sayNow: function (msg1, msg2) {
            //alert(msg1, msg2)
        },
        displayprogramForm : function(){
            //alert('display form')
            $('#m-program-form').removeClass('d-none');
            $('#m-program-list').addClass('d-none');
            $('#m-program-form-edit').addClass('d-none');
        },
        displayprogramList : function(){
            //alert('display program list')
            $('#m-program-form').addClass('d-none');
            $('#m-program-list').removeClass('d-none');
            $('#m-program-form-edit').addClass('d-none');
            this.datatable.reload();
        },
        displayprogramFormEdit: function() {
            $('#m-program-form').addClass('d-none');
            $('#m-program-list').addClass('d-none');
            $('#m-program-form-edit').removeClass('d-none');
        },
        initprogramList : function(){
            this.initprogramTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onTypeChange : function(){
            //alert('program Changed', )
            this.datatable.search($('#m_form_type').val(), 'Type');
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
        deleteProgram(){
            var vm = this;
            var form = $('#program_data');
            console.log("Delete Program ", this.programid);
            axios.put(`/loyalty/programs/`+ this.programid, {
                'program_id': this.programid,
                'status': 0,
            }).then(response => {
                this.datatable.reload();
                vm.showErrorMsg(form, 'success', 'Tier Delete Success !! ');
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                vm.showErrorMsg(form, 'danger', 'Tier Delete failed !! ');
            })
        },
        editProgramForm: function(programid) {
            this.displayprogramFormEdit();
            this.programid = programid;
        },
        initprogramTable: function() {
            this.datatable = $('.m_datatable_program').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/programs/list',
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
                    //   pageSizeSelect: [10, 20, 30, 50, 100],
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
                    field: 'program_id',
                    title: 'Program Id',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 120,
                    // basic templating support for column rendering,
                    template: '{{program_id}}',
                  },
                  {
                    field: 'program_name',
                    title: 'Program Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{program_name}}',
                  },
                //   {
                //     field: 'token_id',
                //     title: 'Token',
                //     sortable: 'asc', // default sort
                //     filterable: false, // disable or enable filtering
                //     width: 100,
                //     // basic templating support for column rendering,
                //     template: '{{token_id}}',
                //   },
                  {
                    field: 'program_type',
                    title: 'Program Type',
                    // callback function support for column rendering
                    template: function(row) {
                        var typevals = {
                            'N': {'title': 'FIXED POINTS', 'class': ' m-badge--brand'},
                            'P': {'title': 'PERCENTAGE', 'class': ' m-badge--info'},
                            'F': {'title': 'FIXED POINTS', 'class': ' m-badge--info'}           
                        };
                        return '<span class="m-badge ' + typevals[row.program_type].class + ' m-badge--wide">' + typevals[row.program_type].title + '</span>';
                    },
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
                      return '\
                                <a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                      <i class="la la-edit"></i>\
                                </a>';
                    },
                  }
                ],
            });
            $('#m_form_status, #m_form_type').selectpicker();
            ($(document)).on('click', '#editBtn', (e) => {  
                e.preventDefault();
                let id = $(e.target).closest('.m-datatable__row').find('[data-field="program_id"]').text();
                this.editProgramForm(id);
            });
            ($(document)).on('click', '#deleteBtn', (e) => {  
                e.preventDefault();
                let id = $(e.target).closest('.m-datatable__row').find('[data-field="program_id"]').text();                
                // this.progarmid = id;
                console.log("id", this.progarmid);
            });
        }
    },
    mounted(){
        this.initprogramList();
        // this.displayprogramFormEdit();
    }

})