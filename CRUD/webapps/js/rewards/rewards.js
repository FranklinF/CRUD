Vue.component('rewards-main-component', {
    props: ['rewardid', 'rewardname'],
    template: `
    <div class="m-grid__item" id="m-reward-main" >
            <rewards-list-component  :rewardname="rewardname"
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @showtoast="$emit('showtoast', $event)"
                @onrewardchanged="$emit('onrewardchanged',$event)"
                @newrewardclicked="$emit('newrewardclicked',$event)"
                @deleterewardclicked="$emit('deleterewardclicked',$event)"
            ></rewards-list-component>
            <rewards-form-component  primaryinput="b"
                @rewardformcancel="$emit('rewardformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @rewardformsave="$emit('rewardformsave',$event)"
            ></rewards-form-component>
            <rewards-form-edit-component  primaryinput="b" :rewardid="rewardid"
                @rewardformcancel="$emit('rewardformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @rewardformsave="$emit('rewardformsave',$event)"
            ></rewards-form-edit-component>
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete reward</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this reward <strong>{{rewardname}} ?</strong></p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deleterewardclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->
        
    </div>
    `
})

new Vue({
    el: '#rewards-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        rewardid: '',
        rewardname: ''
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
        displayrewardForm : function(){
            // alert('display Add reward form')
            $('#m-reward-form').removeClass('d-none');
            $('#m-reward-list').addClass('d-none');
            $('#m-reward-form-edit').addClass('d-none');
        },
        displayrewardList : function(){
            //alert('display reward list')
            $('#m-reward-list').removeClass('d-none');
            $('#m-reward-form').addClass('d-none');
            $('#m-reward-form-edit').addClass('d-none');
            this.datatable.reload();
        },
        displayrewardFormEdit: function() {
            //alert('display form')
            $('#m-reward-form').addClass('d-none');
            $('#m-reward-list').addClass('d-none');
            $('#m-reward-form-edit').removeClass('d-none');
        },
        initrewardList : function(){
            this.initrewardTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onrewardChange : function(){
            //alert('reward Changed', )
            this.datatable.search($('#m_form_reward').val(), 'reward');
        },
        editrewardForm: function(rewardid) {
            this.displayrewardFormEdit();
            this.rewardid = rewardid;
            console.log("id ", this.rewardid);
        },
        deletereward(){
            var vm = this;
            var form = $('#m-reward-list');
            console.log("Delete reward ", this.rewardid);
            axios.put(`/loyalty/rewards/`+ this.rewardid, {
                'reward_name': this.rewardid,
                'enabled': 0,
            }).then(response => {
                this.datatable.reload();
                vm.showToast('reward Delete Success', 'success');             
                // vm.showErrorMsg(form, 'success', 'reward Delete Success !! ');
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                vm.showToast('reward Delete failed', 'error');                
                // vm.showErrorMsg(form, 'danger', 'reward Delete failed !! ');
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
        initrewardsTable: function() {
            this.datatable = $('.m_datatable_reward').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/rewards/list',
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
                    width: 20,
                    selector: false,
                    textAlign: 'center',
                    template: function (row, index,datatable) {
                        return  ((datatable.getCurrentPage() -1) *datatable.getPageSize() + index+1) ;
                    }
                  }, 
                  {
                    field: 'rewardname',
                    title: 'Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{reward_name}}'
                  },                               
                  {
                    field: 'rewardfor',
                    title: 'Reward For',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 150,
                    // basic templating support for column rendering,
                    template: '{{reward_for}}',
                  },                  
                  {
                    field: 'status',
                    title: 'Status',
                    // callback function support for column rendering
                    template: function(row) {
                        var enabledvals = {
                            1: {'title': 'Active', 'class': ' m-badge--success'},
                            2: {'title': 'Not Active', 'class': ' m-badge--primary'},
                            3: {'title': 'Pending', 'class': 'm-badge--brand'},
                            4: {'title': 'Delivered', 'class': ' m-badge--metal'},
                            5: {'title': 'Info', 'class': ' m-badge--info'},
                            0: {'title': 'Deleted', 'class': ' m-badge--danger'},
                            7: {'title': 'Warning', 'class': ' m-badge--warning'},              
                        };
                        if(row.enabled == undefined) row.enabled = 1;
                        return '<span class="m-badge ' + enabledvals[row.enabled].class + ' m-badge--wide">' + enabledvals[row.enabled].title + '</span>';
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
                            if(row.reward_code !== 'admin') {
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
          
              $('#m_form_status, #m_form_type').selectpicker();
              ($(document)).on('click', '#editBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="rewardname"]').text();
                  this.editrewardForm(id);
              });
              ($(document)).on('click', '#deleteBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="rewardname"]').text();
                  let name = $(e.target).closest('.m-datatable__row').find('[data-field="rewardname"]').text();
                  this.rewardid = id;
                  this.rewardname = name;
              });
            }
    },
    mounted(){
        this.initrewardsTable();
    }
})

