Vue.component('plans-main-component', {
    props: ['reload'],
    template: `
    <div  class="m-grid__item m-grid__item--fluid m-wrapper" id="m-accounts-main">
    
      <div class="m-content">
        <plans-choose-component @showtoast="$emit('showtoast', $event)" :reload="reload"></plans-choose-component>

      </div>
    </div>

    `
})
const tierdata = new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--
    }
  })

new Vue({
    el: '#plans-page',
    data: {
        message: '',
        logintitle: 'JOIN OUR GREAT METRO COMMUNITY GET FREE ACCOUNT',
        errors: [],
        postBody: '',
        datatable:'',
        cardtable: '',
        reload: '',
        handler: '',
        plans: []
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
    },
    methods: {
        sayNow: function (msg1, msg2) {
            // alert(msg1, msg2)
        },
        dataReload: function(event) {
          this.datatable.reload();
        },
        pay() {
          this.handler.open({
            name: 'NuTick.com',
            description: 'Buy NuTick Credits',
            zipCode: false
          });
        },
        checkout: function() {
            var vm = this;
            axios.get('loyalty/balance')
            .then((response) => {
                console.log("Balance ", response.data);
                var balanceDetails = response.data.loyalties[0];
                vm.token = balanceDetails.token;
                vm.balance = balanceDetails.count;
            })
            .catch((error) => {
              if(error.response.status == 403) {
                  window.location.replace('/login');
              }
                console.log("Balance Error ", error.response);
            })
            
            axios.get('/loyalty/merchant/payment/secret_key')
            .then((response) => {                
                vm.secretKey = response.data.stripe_config.config.publishable_stripe_key;
                console.log("Secret Key ", vm.secretKey);
                vm.handler = StripeCheckout.configure({
                    key: vm.secretKey, //'pk_test_t8ef4MFuLskfEs1V5zmujMLh',
                    image: '/media/img/logos/LoyaltyLogo.png',
                    locale: 'auto',
                    token: function(token) {
                      console.log("Token ", token)
                      let data = {
                        source: token.id
                      }
                    axios.post('/loyalty/merchant/buy/token/payments', data)
                    .then((response) => {
                        console.log("Payment ", response.data); 
                        vm.datatable.reload();                       
                        vm.$emit('reload', {'event': vm.$event})
                        vm.$emit('showtoast',{'msg':'Card has been Add success','type':'success','event':vm.$event})                        
                        
                    })
                    .catch((error) => {
                        var e = error;
                        if(e.response.status == 403) {
                            window.location.replace('/login');
                        }
                        console.log("Payment Error ", error);
                        vm.$emit('showtoast',{'msg':'Card has been Add Failed','type':'error','event':vm.$event})
                    })
                    }
                })
            })
            .catch((error) => {
                console.log("Error ", error);

                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },
        showToast: function(msg, type) {
          this.initPaymentTable();
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
        initPaymentList : function(){
            this.initPaymentTable();
            this.initCards();
            this.checkout();
            var vm = this;
            axios.get("/loyalty/merchant/profile/details").then(response => {
              var profile = response.data;
              if(profile.price_plan !== 'free_plan') {
                axios.get('/loyalty/merchant/cards/details').then(response => {
                  var cards = response.data.cards;
                  console.log("CARDS ", cards);
                  if(cards.length === 0) {
                    vm.pay();
                  } 
                })
                .catch(error => {
                  if(error.response.status == 403) {
                      window.location.replace('/login');
                  }
                  console.log("Card details Error ", error);
                })
              }
            })
            .catch(err => {
              if(err.response.status == 403) {
                  window.location.replace('/login');
              }
              console.log("Error get profile ", err);
            }) 
            // this.getPlanList();
        },
        initPaymentTable: function() {
            this.datatable = $('.m_datatable_payment').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/merchant/payments/list?page=1',
                      map: function(raw) {
                        var dataSet = raw;
                        if (typeof raw.data !== 'undefined') {
                          dataSet = raw.data;
                        }
                        console.log("Data set ", dataSet);
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
                  }, {
                    field: 'payment_date',
                    title: 'Transaction Date&Time',
                    sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 200,
                    // basic templating support for column rendering,
                    template: '{{payment_date}}',
                  },
                  {
                    field: 'txn_id',
                    title: 'Transaction ID',
                    // sortable: 'asc', // default sort
                    filterable: false, // disable or enable filtering
                    width: 100,
                    // basic templating support for column rendering,
                    template: '{{txn_id}}',
                  },
                  {
                    field: 'credits',
                    title: 'Credits',
                    sortable: 'asc', // default sort
                    template: '{{credits}}',
                  },
                  {
                    field: 'amount',
                    title: 'Amount(usd)',
                    sortable: 'asc', // default sortamount
                    template: '{{amount}}',
                  },
                  {
                    field: 'Actions',
                    width: 110,
                    title: 'View Payment',
                    sortable: false,
                    overflow: 'visible',
                    template: function (row, index, datatable) {
                      return '\
                                <a id="editBtn" href="' + row.invoice_url + '" target="_blank" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                      <i class="la la-eye"></i>\
                                </a>\
                              ';
                    },
                  }
                  
                ],
            });
            $('#m_form_status, #m_form_tier').selectpicker();
        },
        initCards: function() {

          this.cardtable = $('.m_datatable_cards').mDatatable({
            // datasource definition
            data: {
              type: 'remote',
              source: {
                read: {
                  url: '/loyalty/merchant/list/cards/details',
                  map: function(raw) {
                    var dataSet = raw;
                    if (typeof raw.data !== 'undefined') {
                      dataSet = raw.data;
                    }
                    console.log("Data set ", dataSet);
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
              }, {
                field: 'name',
                title: 'Card Holder Name',
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering
                width: 200,
                // basic templating support for column rendering,
                template: '{{name}}',
              },
              {
                field: 'last4',
                title: 'Card Number',
                // sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering
                width: 100,
                // basic templating support for column rendering,
                template: function (row, index,datatable) {
                  return  'XXXX XXXX XXXX '+ row.last4;
                }
              },
              {
                field: 'expiry',
                title: 'Expiry',
                sortable: 'asc', // default sort
                template: function (row, index,datatable) {                  
                  return  row.exp_month+'/'+row.exp_year;
                
                }
              },               
              // {
              //   field: 'Actions',
              //   width: 110,
              //   title: 'View Payment',
              //   sortable: false,
              //   overflow: 'visible',
              //   template: function (row, index, datatable) {
              //     return '\
              //               <a id="editBtn" href="' + row.invoice_url + '" target="_blank" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
              //                     <i class="la la-eye"></i>\
              //               </a>\
              //             ';
              //   },
              // }
              
            ],
          });
          axios.get("/loyalty/merchant/profile/details").then(response => {
            var profile = response.data;
            if(profile.price_plan !== 'free_plan') {
                axios.get('/loyalty/merchant/cards/details').then(response => {
                    var cards = response.data.cards;
                    if(cards.length === 0) {
                      this.pay();
                    }
                })
                .catch(error => {
                  if(error.response.status == 403) {
                      window.location.replace('/login');
                  }
                    console.log("Card details Error ", error);
                })
            }
        })
        .catch(err => {
          if(err.response.status == 403) {
              window.location.replace('/login');
          }
            console.log("Error get profile ", err);
        }) 
        $('#m_form_status, #m_form_tier').selectpicker();
      }
    },
    mounted(){
        this.initPaymentList();
    }    
})