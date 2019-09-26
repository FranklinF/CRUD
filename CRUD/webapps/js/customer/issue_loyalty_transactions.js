Vue.component('issue-loyalty-table', {
    props: ['customerkey', 'rewardmethod'],   
    template: `
    <div class="form-group m-form__group row">
        <div class="col-xl-12 col-lg-12">
            <h3>Recent Transactions:</h3> 
            <div class="m_datatable_issue" id="issue_trans_data"></div>
        </div>
    </div>
    `,
    mounted() {
        $('.m_datatable_issue').mDatatable({
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
            pagination: false,
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
                    // return row.issued_on
                    return moment(row.issued_on).format("YYYY-MM-DD HH:mm:ss");
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
    
    }
})