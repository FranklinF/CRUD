Vue.component('issuecoupons-main-component', {
    props: ['issuecouponid', 'issuecouponname'],
    template: `
    <div class="m-grid__item" id="m-issuecoupon-main" >
        <issuecoupon-list-component 
            @onstatuschanged="$emit('onstatuschanged',$event)"
            @showtoast="$emit('showtoast', $event)"
            @onissuecouponchanged="$emit('onissuecouponchanged',$event)"
            @newissuecouponclicked="$emit('newissuecouponclicked',$event)"
            @deleteissuecouponclicked="$emit('deleteissuecouponclicked',$event)"
        ></issuecoupon-list-component>
        <issuecoupons-form-component  primaryinput="b"
            @issuecouponformcancel="$emit('issuecouponformcancel',$event)"
            @showtoast="$emit('showtoast', $event)"
            @issuecouponformsave="$emit('issuecouponformsave',$event)"
        ></issuecoupons-form-component>
    </div>
    `
})

new Vue({
    el: '#issuecoupons-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        issuecouponid: '',
        issuecouponname: ''
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
      displayForm : function(){
          // alert('display Add couponissue form');
          $('#m-issuecoupon-form').removeClass('d-none');
          $('#m-issuecoupon-list').addClass('d-none');
          $('#m-issuecoupon-form-edit').addClass('d-none');
      },
      displayissuecouponList : function(){
          //alert('display issuecoupon list')
          $('#m-issuecoupon-list').removeClass('d-none');
          $('#m-issuecoupon-form').addClass('d-none');
          $('#m-issuecoupon-form-edit').addClass('d-none');
          this.datatable.reload();
      },
      displayissuecouponFormEdit: function() {
          //alert('display form')
          $('#m-issuecoupon-form').addClass('d-none');
          $('#m-issuecoupon-list').addClass('d-none');
          $('#m-issuecoupon-form-edit').removeClass('d-none');
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
        initissuecouponsTable: function(code) {
            this.datatable = $('.m_datatable_couponserial_issue').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/coupons/status/3/serials',
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
       
    },
    mounted(){
        this.initissuecouponsTable();
    }
})

