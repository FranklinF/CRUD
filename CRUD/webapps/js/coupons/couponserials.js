Vue.component('couponserials-main-component', {
    props: ['couponserialid', 'couponserialname', 'coupon_code'],
    template: `
    <div class="m-grid__item" id="m-couponserial-main" >
        <couponserials-list-component  :couponserialname="couponserialname" :coupon_code="coupon_code"
            @onstatuschanged="$emit('onstatuschanged',$event)"
            @showtoast="$emit('showtoast', $event)"
            @oncouponserialchanged="$emit('oncouponserialchanged',$event)"
            @newcouponserialclicked="$emit('newcouponserialclicked',$event)"
            @deletecouponserialclicked="$emit('deletecouponserialclicked',$event)"
        ></couponserials-list-component>
        <couponserials-form-component  primaryinput="b" :coupon_code="coupon_code"
            @couponserialformcancel="$emit('couponserialformcancel',$event)"
            @showtoast="$emit('showtoast', $event)"
            @couponserialformsave="$emit('couponserialformsave',$event)"
        ></couponserials-form-component>
        <couponserials-form-edit-component  primaryinput="b" :couponserialid="couponserialid"
            @couponserialformcancel="$emit('couponserialformcancel',$event)"
            @showtoast="$emit('showtoast', $event)"
            @couponserialformsave="$emit('couponserialformsave',$event)"
        ></couponserials-form-edit-component>
        <!--begin::Modal-->
        <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete couponserial</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                <p>Are You Sure want to delete this coupon serial allocation<strong>{{couponserialname}} ?</strong></p>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" v-on:click="$emit('deletecouponserialclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                </div>
            </div>
            </div>
        </div>
        <!--end::Modal-->        
    </div>
    `
})

new Vue({
    el: '#couponserials-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        couponserialid: '',
        couponserialname: '',
        coupon_code: ''
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
        displaycouponserialForm : function(){
            // alert('display Add couponserial form')
            $('#m-couponserial-form').removeClass('d-none');
            $('#m-couponserial-list').addClass('d-none');
            $('#m-couponserial-form-edit').addClass('d-none');
        },
        displaycouponserialList : function(){
            //alert('display couponserial list')
            $('#m-couponserial-list').removeClass('d-none');
            $('#m-couponserial-form').addClass('d-none');
            $('#m-couponserial-form-edit').addClass('d-none');
            window.location.reload();
        },
        displaycouponserialFormEdit: function() {
            //alert('display form')
            $('#m-couponserial-form').addClass('d-none');
            $('#m-couponserial-list').addClass('d-none');
            $('#m-couponserial-form-edit').removeClass('d-none');
        },
        initcouponserialList : function(){
            this.initcouponserialTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        oncouponserialChange : function(){
            //alert('couponserial Changed', )
            this.datatable.search($('#m_form_couponserial').val(), 'couponserial');
        },
        editcouponserialForm: function(couponserialid) {
            this.displaycouponserialFormEdit();
            this.couponserialid = couponserialid;
            console.log("id ", this.couponserialid);
        },
        deletecouponserial(){
            var vm = this;
            var form = $('#m-couponserial-list');
            console.log("Delete couponserial ", this.couponserialid);
            axios.get('loyalty/couponserials/'+this.couponserialid).then(response => {
                console.log("couponserial Res ", response);
                var couponserial = response.data;
                axios.delete(`/loyalty/couponserials/${this.couponserialid}/${couponserial.merchant_id}`).then(response => {
                    this.datatable.reload();
                    vm.showToast('couponserial Delete Success', 'success');             
                    // vm.showErrorMsg(form, 'success', 'couponserial Delete Success !! ');
                })
                .catch(e => {
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log('failure call:', e);
                    vm.showToast('couponserial Delete failed', 'error');                
                    // vm.showErrorMsg(form, 'danger', 'couponserial Delete failed !! ');
                })
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e);
                vm.showToast('couponserial Delete failed', 'error');                
                // vm.showErrorMsg(form, 'danger', 'couponserial Delete failed !! ');
            })
            
        },
        getSerials: function(aid, cid) {
            console.log("Serials ", aid, cid);
            var vm = this;
            var serials = [];
           axios.get(`/loyalty/coupons/serials/${cid}/allocation/${aid}?page=1`).then(async res => {
                var totalPage = res.data.pagination.total_pages;
                console.log("Total pages ", totalPage);                                
                var filename;
                for(var i = 0; i < totalPage; i++) {                    
                    await axios.get(`/loyalty/coupons/serials/${cid}/allocation/${aid}?page=${i+1}`)
                    .then(response => {
                        console.log("Serials Response ", response.data);
                        var data = response.data.serials;
                        filename = data[0].allocation_code;
                        if(data.length > 0) {                                                  
                            for(var j in data) {
                                 serials.push(data[j].coupon_serial);
                            }                                                   
                        }                        
                                        
                    })
                    .catch(err => {
                        if(err.response.status == 403) {
                            window.location.replace('/login');
                        }
                        console.log("Error ", err);
                    })
                }
                var csv = "data:text/csv;charset=utf-8,serials\n";
                csv += serials.join(",\n");
                const data = encodeURI(csv);
                const link = document.createElement("a");
                link.setAttribute('href', data);
                link.setAttribute("download", aid+'.csv');
                link.click();
                
                
            })
            .catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", err);
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
        initcouponserialsTable: function(code) {
            this.datatable = $('.m_datatable_couponserial').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/coupons/couponserials/list/'+code,
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
                    field: 'allocationcode',
                    title: 'Allocation Code',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 150,
                    // basic templating support for column rendering,
                    template: '{{allocation_code}}',
                  }, 
                  {
                    field: 'couponcode',
                    title: 'Coupon Code',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    responsive:  {
                        hidden: true
                        },
                    // basic templating support for column rendering,
                    template: '{{coupon_code}}'
                  },
                  {
                    field: 'serialscount',
                    title: 'Serials Count',
                    sortable: 'asc', // default sort
                    width: 150,
                    template: '{{serials_count}}'
                  },                                                   
                  {
                    field: 'status',
                    title: 'Status',
                    // callback function support for column rendering
                    template: function(row) {
                        var statusvals = {
                            2: {'title': 'Activated', 'class': ' m-badge--success'},
                            1: {'title': 'Created', 'class': ' m-badge--info'},
                            3: {'title': 'Pending', 'class': 'm-badge--brand'},
                            4: {'title': 'Delivered', 'class': ' m-badge--metal'},
                            5: {'title': 'Info', 'class': ' m-badge--info'},
                            0: {'title': 'Deleted', 'class': ' m-badge--danger'},
                            7: {'title': 'Warning', 'class': ' m-badge--warning'},              
                        };
                        if(row.serial_status == undefined) row.serial_status = 1;
                        return '<span class="m-badge ' + statusvals[row.serial_status].class + ' m-badge--wide">' + statusvals[row.serial_status].title + '</span>';
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
                            // if(row.serial_status === 1) {
                            //     return '\<a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                            //                 <i class="la la-download"></i>\
                            //             </a>\
                            //             <a href="#" id="deleteBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                            //                 <i class="la la-edit"></i>\
                            //             </a>\
                            //         ';
                            // }
                            // else {
                                return '\<a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                        <i class="la la-download"></i>\
                                    </a>\
                                ';
                            // }
                        
                        }
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
          
              $('#m_form_status, #m_form_type').selectpicker();
              ($(document)).on('click', '#editBtn', (e) => {  
                  e.preventDefault();
                //   console.log("Selected value ", $(e.target).closest('.m-datatable__row').val());
                //   console.log( vm.datatable.row( this ).getData() );
                  let aid = $(e.target).closest('.m-datatable__row').find('[data-field="allocationcode"]').text();
                  let cid = $(e.target).closest('.m-datatable__row').find('[data-field="couponcode"]').text();
                  vm.getSerials(aid, cid);
                //   this.editcouponserialForm(id);
              });
              ($(document)).on('click', '#deleteBtn', (e) => {  
                  e.preventDefault();
                  let id = $(e.target).closest('.m-datatable__row').find('[data-field="allocationcode"]').text();
                  this.editcouponserialForm(id);
              });
            },
            initissueTable: function(code) {
                this.datatable = $('.m_datatable_couponserial_issue').mDatatable({
                    // datasource definition
                    data: {
                      type: 'remote',
                      source: {
                        read: {
                          url: '/loyalty/coupons/couponserials/'+code +'/3/serials',
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
                        width: 20,
                        selector: false,
                        textAlign: 'center',
                        template: function (row, index,datatable) {
                            return  ((datatable.getCurrentPage() -1) *datatable.getPageSize() + index+1) ;
                        }
                      },
                      {
                        field: 'couponserial',
                        title: 'Coupon Serial',
                        // sortable: 'asc', // default sort
                        filterable: false, // disable or enable filtering
                        width: 150,
                        // basic templating support for column rendering,
                        template: '{{coupon_serial}}',
                      }, 
                      {
                        field: 'couponcode',
                        title: 'Coupon Code',
                        sortable: 'asc', // default sort
                        filterable: false, // disable or enable filtering
                        width: 100,
                        // basic templating support for column rendering,
                        template: '{{coupon_code}}'
                      },                                                                    
                      {
                        field: 'status',
                        title: 'Status',
                        // callback function support for column rendering
                        template: function(row) {
                            var statusvals = {
                                2: {'title': 'Activated', 'class': ' m-badge--success'},
                                1: {'title': 'Created', 'class': ' m-badge--primary'},
                                3: {'title': 'Issued', 'class': 'm-badge--brand'},
                                4: {'title': 'Redeemed', 'class': ' m-badge--metal'},
                                5: {'title': 'Void', 'class': ' m-badge--info'},
                                0: {'title': 'Deleted', 'class': ' m-badge--danger'},
                                6: {'title': 'Temporary', 'class': ' m-badge--warning'},              
                            };
                            if(row.serial_status == undefined) row.serial_status = 1;
                            return '<span class="m-badge ' + statusvals[row.serial_status].class + ' m-badge--wide">' + statusvals[row.serial_status].title + '</span>';
                        },
                      },                                     
                    ],
                  });
            },
            getParams: function() {
                let urlParams = new URLSearchParams(window.location.search);
                let code = urlParams.get('code');
                console.log("code ", code);
                this.coupon_code = code;
                this.initcouponserialsTable(this.coupon_code);
                this.initissueTable(this.coupon_code);
                // this.initredeemTable(this.coupon_code);
                // this.initvoidTable(this.coupon_code);
            },
    },
    mounted(){
        this.getParams();
    }
})

