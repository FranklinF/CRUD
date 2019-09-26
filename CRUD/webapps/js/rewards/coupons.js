Vue.component('coupons-main-component', {
    props: ['couponid', 'couponname'],
    template: `
    <div class="m-grid__item" id="m-coupon-main" >
            <coupons-list-component  :couponname="couponname"
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @showtoast="$emit('showtoast', $event)"
                @oncouponchanged="$emit('oncouponchanged',$event)"
                @newcouponclicked="$emit('newcouponclicked',$event)"
                @deletecouponclicked="$emit('deletecouponclicked',$event)"
            ></coupons-list-component>
            <coupons-form-component  primaryinput="b"
                @couponformcancel="$emit('couponformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @couponformsave="$emit('couponformsave',$event)"
            ></coupons-form-component>
            <coupons-form-edit-component  primaryinput="b" :couponid="couponid"
                @couponformcancel="$emit('couponformcancel',$event)"
                @showtoast="$emit('showtoast', $event)"
                @couponformsave="$emit('couponformsave',$event)"
            ></coupons-form-edit-component>
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete coupon</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this coupon <strong>{{couponname}} ?</strong></p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deletecouponclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->
        
    </div>
    `
})

new Vue({
    el: '#coupons-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        couponid: '',
        couponname: ''
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
        displaycouponForm : function(){
            // alert('display Add coupon form')
            $('#m-coupon-form').removeClass('d-none');
            $('#m-coupon-list').addClass('d-none');
            $('#m-coupon-form-edit').addClass('d-none');
        },
        displaycouponList : function(){
            //alert('display coupon list')
            this.couponid = '';
            $('#m-coupon-list').removeClass('d-none');
            $('#m-coupon-form').addClass('d-none');
            $('#m-coupon-form-edit').addClass('d-none');
            this.datatable.reload();
        },
        displaycouponFormEdit: function() {
            //alert('display form')
            $('#m-coupon-form').addClass('d-none');
            $('#m-coupon-list').addClass('d-none');
            $('#m-coupon-form-edit').removeClass('d-none');
        },
        initcouponList : function(){
            this.initcouponTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        oncouponChange : function(){
            //alert('coupon Changed', )
            this.datatable.search($('#m_form_coupon').val(), 'coupon');
        },
        editcouponForm: function(couponid) {
            this.displaycouponFormEdit();
            this.couponid = couponid;
            console.log("id ", this.couponid);
        },
        deletecoupon(){
            var vm = this;
            var form = $('#m-coupon-list');
            console.log("Delete coupon ", this.couponid);
            axios.get('loyalty/coupons/'+this.couponid).then(response => {
                console.log("coupon Res ", response);
                var coupon = response.data;
                axios.delete(`/loyalty/coupons/${this.couponid}/${coupon.merchant_id}`).then(response => {
                    this.datatable.reload();
                    vm.showToast('coupon Delete Success', 'success');             
                    // vm.showErrorMsg(form, 'success', 'coupon Delete Success !! ');
                })
                .catch(e => {
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log('failure call:', e);
                    vm.showToast('coupon Delete failed', 'error');                
                    // vm.showErrorMsg(form, 'danger', 'coupon Delete failed !! ');
                })
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                vm.showToast('coupon Delete failed', 'error');                
                // vm.showErrorMsg(form, 'danger', 'coupon Delete failed !! ');
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
        initcouponsTable: function() {
            this.datatable = $('.m_datatable_coupon').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/coupons/list',
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
                    field: 'couponcode',
                    title: 'Coupon Code',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 150,
                    // basic templating support for column rendering,
                    template: function (row, index, datatable) {
                        //'{{coupon_code}}',
                        return '\
                                <a href="#" id="gotoSerialsBtn"  title="coupon serials">\
                                    '+ row.coupon_code +'\
                                </a>\
                                ';
                    }
                  }, 
                  {
                    field: 'couponname',
                    title: 'Name',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{coupon_name}}'
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
                            if(row.coupon_code !== 'admin') {
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
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="couponcode"]').text();
                  this.editcouponForm(id.trim());
              });
              ($(document)).on('click', '#gotoSerialsBtn', (e) => {  
                e.preventDefault();
                let id = $(e.target).closest('.m-datatable__row').find('[data-field="couponcode"]').text();
                let name = $(e.target).closest('.m-datatable__row').find('[data-field="couponname"]').text();
                this.couponid = id.trim();
                window.location.replace('/couponserials?code='+ this.couponid);
              });
              ($(document)).on('click', '#deleteBtn', (e) => {  
                  e.preventDefault();
                  this.couponid = '';
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="couponcode"]').text();
                  let name = $(e.target).closest('.m-datatable__row').find('[data-field="couponname"]').text();
                  this.couponid = id.trim();
                  this.couponname = name.trim();
              });
            }
    },
    mounted(){
        this.initcouponsTable();
    }
})

