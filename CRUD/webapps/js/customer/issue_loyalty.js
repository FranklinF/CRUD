
Vue.component('issue-loyalty-component', {
    props: ['customerkey', 'rewardmethod'],
    data: function() {
        return {
            searchType: 'CC',
            showcc: true,
            showce: false,
            showcm: false,
            showSearch: true,
            phonenohelp:"Enter customer's valid phone in  E.g: +1 5417543010",
            emailhelp:"Customer's communication email address Ex. john@gmail.com",
            customer: {
                customer_id: '',
                customer_code: '',
                customer_email: '',
                customer_phone: '',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            },
            customerDetails: '',
            showCustomerDetails: false,
            showNewCustomerForm: false,
            showReceipt: false,
            newcustomer: {
                customer_code:'',
                customer_email:'',
                customer_phone:'',
                customer_country:'IN',
                customer_formatedphone:'',
                customer_phonenofull:'',
                customer_isvalidphone:'',
                customer_isvalidemail:''
            },
            customerimg: '../assets/app/media/img/users/user4.png',
            customerBalance: '',
            tokenName: '',
            programtype: 'points',
            receipt_amt: '',
            receipt_no: '',
            points:'',
            customerData: '',
            datatable: ''
        }
    },
    computed: {
        isEmailRequired() {
        //   return (this.primaryinput == 'e'|| this.primaryinput=='b')
            return (this.customerkey === 'E')
        },
        isPhoneRequired() {
            // return (this.primaryinput == null|| this.primaryinput == 'p'|| this.primaryinput=='b')
            return (this.customerkey === 'M')
        },
        isCustomerCodeRequired() {
            return (this.customerkey === 'C')
        },
        isNutickIdRequired() {
            return (this.customerkey === 'N')
        }
    },
    watch:{
        'customer.customer_email': function(){
            this.debouncedCheckEmail()
        },
        'customer.customer_phone': function(){
            this.debouncedCheckNumber()
        },
        'newcustomer.customer_email': function() {
            this.debouncedCheckNewEmail()
        },
        'newcustomer.customer_phone': function() {
            this.debouncedCheckNewNumber()
        },
        'rewardmethod': function() {
            if(this.rewardmethod === 'M') {
                this.programtype = 'POINTS';
            }
            else {
                this.programtype = 'RECEIPT';
            }
        },
        'showSearch': function() {
           
            if(this.showSearch) {
               
            }
        }

    },
    created: function () {
        console.log('form created');
        this.debouncedCheckEmail = _.debounce(this.checkEmail, 500)
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500)
        this.debouncedCheckNewEmail = _.debounce(this.checknewEmail, 500)
        this.debouncedCheckNewNumber = _.debounce(this.checknewPhone, 500)
        // this.getTokens();
        // this.initIssueTable();
    },
    methods: {
        showErrorMsg: function(form, type, msg) {
            var alert = $('<div id="alertBox" style="text-align:left;" class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');
    
            form.find('.alert').remove();
            alert.prependTo(form);

            mUtil.animateClass(alert[0], 'fadeIn animated');
            alert.find('span').html(msg);
            setTimeout(() => {
                $('#alertBox').addClass('d-none');
            }, 5000);
        },
		getTokens: function() {
            var vm = this;            
            axios.get('/loyalty/tokens')
            .then((response) => {
				console.log("Token Response ", response.data);
				let tokenData = [];
				tokenData = response.data.tokens;
				if(tokenData.length > 0) {
                    vm.tokenName = tokenData[0].symbol;
				}
				else {
				}
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
            })
        },
        initIssueTable: function() {
            var timezone = sessionStorage.getItem("timezone");
            this.datatable = $('#issue_trans_data').mDatatable({
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
            
        },
        checkEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            console.log('check mail',vm.customer.customer_email);
            if(vm.customer.customer_email != null && vm.customer.customer_email.length > 0){
                if(reg.test(vm.customer.customer_email)){
                    console.log('Valid email', vm.customer.customer_email)
                    vm.customer.customer_isvalidemail=true;
                    vm.emailhelp = 'Valid Email '+ vm.customer.customer_email;
                    vm.searchByEmail();
                }else{
                    vm.customer.customer_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.customer.customer_email;
                }
            }else{
                vm.customer.customer_isvalidemail=false;
                vm.emailhelp = "Customer's communication email address Ex. john@gmail.com";

            }
        },
        checkPhone:  function () {
            var vm = this;
            if(vm.customer.customer_phone != null && vm.customer.customer_phone.length > 4){
                axios.get(`generic/phonecheck/`+vm.customer.customer_phone)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.customer.customer_name=response.data.customer_name;
                        vm.customer.customer_country=response.data.countrycode;
                        vm.customer.customer_formatedphone = response.data.phonenumberformat;
                        vm.customer.customer_isvalidphone = response.data.isvalidnumber;
                        vm.customer.customer_phonenofull = response.data.phonenumber;
                        if(vm.customer.customer_isvalidphone){
                            vm.searchByMobile();
                        }
                        
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.customer.customer_formatedphone='';
                    vm.customer.customer_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter customer's valid phone in  E.g: +1 5417543010"
                vm.customer.customer_formatedphone='';
                vm.customer.customer_isvalidphone = false;
            }

        },
        checknewEmail:  function () {
            var vm = this;
            var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

            console.log('check mail',vm.newcustomer.customer_email);
            if(vm.newcustomer.customer_email != null && vm.newcustomer.customer_email.length > 0){
                if(reg.test(vm.newcustomer.customer_email)){
                    console.log('Valid email', vm.newcustomer.customer_email)
                    vm.newcustomer.customer_isvalidemail=true;
                    // vm.checkEmailRegistered();
                    vm.emailhelp = 'Valid Email '+ vm.newcustomer.customer_email;
                }else{
                    vm.newcustomer.customer_isvalidemail=false;
                    vm.emailhelp = 'Invalid Email '+ vm.newcustomer.customer_email;
                }
            }else{
                vm.newcustomer.customer_isvalidemail=false;
                vm.emailhelp = "Customer's communication email address Ex. john@gmail.com";

            }
        },
        checkEmailRegistered:function(){
            var vm = this;
            console.log('valid email',vm.newcustomer.customer_isvalidemail )
            if(vm.newcustomer.customer_isvalidemail){
                vm.newcustomer.customer_isvalidemail = false;
                axios.get(`loyalty/customers/`+vm.newcustomer.customer_email)
                .then(function (response) {
                    vm.answer = response.data.customer_id;
                    vm.newcustomer.customer_name=response.data.customer_name;
                    vm.emailhelp = 'Email '+vm.newcustomer.customer_email+' already registered ';
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    if(error.response.status == 404){
                        vm.emailhelp = 'Email '+vm.newcustomer.customer_email+' valid to register '
                        vm.customer.customer_isvalidemail = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.newcustomer.customer_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.newcustomer.customer_formatedphone;
            }
        },
        checknewPhone:  function () {
            var vm = this;
            if(vm.newcustomer.customer_phone != null && vm.newcustomer.customer_phone.length > 0){
                axios.get(`generic/phonecheck/`+vm.newcustomer.customer_phone)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.newcustomer.customer_name=response.data.customer_name;
                        vm.newcustomer.customer_country=response.data.countrycode;
                        vm.newcustomer.customer_formatedphone = response.data.phonenumberformat;
                        vm.newcustomer.customer_isvalidphone = response.data.isvalidnumber;
                        vm.newcustomer.customer_phonenofull = response.data.phonenumber;
                        vm.checkPhoneRegistered();
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.newcustomer.customer_formatedphone='';
                    vm.newcustomer.customer_isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter customer's valid phone in  E.g: +1 5417543010"
                vm.newcustomer.customer_formatedphone='';
                vm.newcustomer.customer_isvalidphone = false;
            }

        },
        checkPhoneRegistered:function(){
            var vm = this;
            console.log('valid phone',vm.newcustomer.customer_isvalidphone )
            if(vm.newcustomer.customer_isvalidphone){
                vm.newcustomer.customer_isvalidphone = false;
                axios.get(`loyalty/customers/`+vm.newcustomer.customer_phonenofull)
                .then(function (response) {
                    vm.answer = response.data.customer_id;
                    vm.newcustomer.customer_name=response.data.customer_name;
                    vm.phonenohelp = 'Phone Number '+vm.newcustomer.customer_formatedphone+' already registered ';
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log(error.response.status);
                    if(error.response.status == 404){
                        vm.phonenohelp = 'Phone Number '+vm.newcustomer.customer_formatedphone+' valid to register '
                        vm.newcustomer.customer_isvalidphone = true;
                    }
                })
            }else{
                console.log('Invalid '+ vm.newcustomer.customer_formatedphone)
                vm.phonenohelp = 'Invalid Phone Number '+ vm.newcustomer.customer_formatedphone;
            }
        },
        getBalance: function(customerid) {
            var vm = this;
            axios.get('loyalty/balance/'+ customerid)
                .then((response) => {
                    console.log("Balance ", response.data);
                    let data = response.data.loyalties;
                    if(response.data.loyalties.length > 0) {
                        for(var i in data) {
                            if(vm.tokenName === data[i].token) {
                                vm.customerBalance = (data[i].count)?data[i].count: '0';
                            }
                            else {
                                vm.customerBalance = '0';
                            }
                        }
                    }
                    else {
                        vm.customerBalance = '0';
                    }
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                    vm.customerBalance = '0';
                })
        },
        searchByCode: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            console.log("Customer Code ", this.customer.customer_code);
            if(this.customer.customer_code !== '') {
                axios.get('loyalty/merchant/customers/C/' + this.customer.customer_code)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                        vm.showNewCustomerForm = false;
                        vm.showReceipt = false; 
                        vm.showSearch = false;
                    }
                    else {
                        vm.newcustomer.customer_phone = vm.customer.customer_phone;
                        vm.showCustomerDetails = false;
                        vm.showNewCustomerForm = true;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    this.showCustomerDetails = false;
                    this.showNewCustomerForm = true;
                    this.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchById: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            console.log("Customer id ", this.customer.customer_id);
            if(this.customer.customer_id !== '') {
                axios.get('loyalty/merchant/customers/N/' + this.customer.customer_id)
                .then((response) => {
                    console.log("Customer ", response.data);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                        vm.showNewCustomerForm = false;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        vm.newcustomer.customer_phone = vm.customer.customer_phone;
                        vm.showCustomerDetails = false;
                        vm.showNewCustomerForm = true;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    this.showCustomerDetails = false;
                    this.showNewCustomerForm = true;
                    this.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer id ');
            }
        },
        searchByEmail: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            if(this.customer.customer_email !== '') {
                axios.get('loyalty/merchant/customers/E/' + vm.customer.customer_email)
                .then((response) => {
                    console.log("Customer ", response.data);                    
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                        vm.showNewCustomerForm = false;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        vm.newcustomer.customer_phone = vm.customer.customer_phone;
                        vm.showCustomerDetails = false;
                        vm.showNewCustomerForm = true;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.newcustomer.customer_email = vm.customer.customer_email;
                    vm.showCustomerDetails = false;
                    vm.showNewCustomerForm = true;
                    vm.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Email ');
            }
        },
        searchByMobile: function() {
            var form = $('#m_issue_loyalty');
            var vm = this;
            if(this.customer.customer_phone !== '') {
                axios.get('loyalty/merchant/customers/M/' + vm.customer.customer_phonenofull)
                .then((response) => {
                    console.log("Customer ", response);
                    if(response.status === 200) {
                        vm.customerDetails = response.data;
                        var txn_date = moment(response.data.last_txn_date).format("YYYY-MM-DD");
                        vm.customerDetails.last_txn_date = txn_date;
                        var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                        vm.customerDetails.membership_date = mdate;
                        // vm.getBalance(vm.customerDetails.customer_eos_account);
                        vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                        vm.showCustomerDetails = true;
                        vm.showNewCustomerForm = false;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }
                    else {
                        vm.newcustomer.customer_phone = vm.customer.customer_phone;
                        vm.showCustomerDetails = false;
                        vm.showNewCustomerForm = true;
                        vm.showSearch = false;
                        vm.showReceipt = false;
                    }                    
                })
                .catch((error) => {
                    console.log("Error ", error);
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    vm.newcustomer.customer_phone = vm.customer.customer_phone;
                    vm.showCustomerDetails = false;
                    vm.showNewCustomerForm = true;
                    vm.showSearch = false;
                    vm.showReceipt = false;
                })
            }
            else {
                this.showErrorMsg(form, 'danger', 'Enter Valid customer Phone ');
            }
        },
        createCustomer: function() {
            var form = $('#m_create_cutomer');
            var btn = $('#customer_submit');
            var vm = this;
            form.validate({
                rules: {
                    
                    customer_name: {
                        required: true,
                    }
                }
            });
            if (!form.valid()) {
                return;
            }
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            axios.post(`/loyalty/merchant/addcustomer`, {
                'customer_mobile': vm.customer.customer_phonenofull,
                'customer_email': vm.customer.customer_email,
                'customer_name': vm.customer.customer_name,
                'customer_nutick_account': vm.customer.customer_id,
                'customer_code': vm.customer.customer_code,
            }).then(response => {
                console.log("New Customer ", response.data);
                vm.customerDetails = response.data;
                var mdate = moment(response.data.membership_date).format("YYYY-MM-DD");                        
                vm.customerDetails.membership_date = mdate;
                vm.customerimg = (vm.customerDetails.imageurl)? vm.customerDetails.imageurl : '../assets/app/media/img/users/user4.png';
                this.showCustomerDetails = true;
                this.showNewCustomerForm = false;
                this.showSearch = false;
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Customer has been Added success','type':'success','event':this.$event})
                
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                // vm.showErrorMsg(form, 'danger', 'Customer create failed !! ' + e.response.data.error_msg);
            })

        },
        createIssue: function() {
            var form = $('#m_issue');
            var btn = $('#issue_submit');
            var vm = this;
            var loginid = sessionStorage.getItem("loginid");            
            if(vm.programtype === 'POINTS') {
                console.log("Points to issue validation")
                form.validate({
                    rules: {
                        receipt_no: {
                            required: true,
                        },
                        receipt_amt: {
                            required: true,
                            min: 1,
                            number: true
                        },                       
                        points: {
                            required: true,
                            min: 1,
                            number: true
                        }
                    }
                });
                if (!form.valid()) {
                    return;
                }
            }
            else {
                form.validate({
                    rules: {
                        receipt_no: {
                            required: true,
                        },
                        receipt_amt: {
                            required: true,
                            min: 1,
                            number: true
                        }
                    }
                });
                if (!form.valid()) {
                    return;
                }
            }
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            var outlet = sessionStorage.getItem('staff_outlet');
            let data = {
                customer_id: vm.customerDetails.customer_nutick_account,
                program_id: vm.programtype,
                loyalty_points: (vm.programtype === 'POINTS')? parseInt(vm.points): '',
                staff_code: (loginid == null)? 'admin': loginid,
                outlet_id: (outlet !== null)? outlet: 'default',
                // token_id: vm.customerDetails.loyalty[0].token,
                receipt_amt: vm.receipt_amt,
                receipt_no: vm.receipt_no
            }
            console.log("Data Issue ", data);
            axios.post(`/loyalty/issue`, data).then(response => {
                console.log("Issue  ", response.data);
                this.customerData = response.data;
                if(this.customerData.expirydate !== 0) {
                    var expiry_date = moment(response.data.expirydate.toString()).format("YYYY-MM-DD"); //moment().tz(response.data.expirydate, timezone).format("YYYY-MM-DD HH:mm:ss");// 
                    this.customerData.expirydate = expiry_date;
                }
                else {
                    this.customerData.expirydate = 'No Expiry';
                }
                
                this.showCustomerDetails = false;
                this.showNewCustomerForm = false;
                this.showSearch = false;
                vm.showReceipt = true;
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':'Loyalty issued success','type':'success','event':this.$event})
                // vm.showErrorMsg(form, 'success', 'Issue success !! ');
                
            })
            .catch(e => {
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log('failure call:', e.response.data.error_msg);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                // vm.showErrorMsg(form, 'danger', 'Issue failed !! ' + e.response.data.error_msg);
            })
        },
        cancelForm: function() {
            this.showCustomerDetails = false;
            this.showNewCustomerForm = false;
            this.showSearch = true;
            this.showReceipt = false;
            // this.$emit('reloaddata',{'event':this.$event})
            // this.datatable.reload();
            // window.location.reload();
        }
            
    },
    template: `
        <div v-if="showSearch">    
            <form  class="m-form m-form--fit m-form--label-align-right" id="m_issue_loyalty">            
                <div v-if="isEmailRequired" class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">* Email:</label>
                    <div class="col-lg-6 col-md-9 col-sm-12">
                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                            <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                            <input v-model="customer.customer_email" type="email" name="customer.customer_email"  id="customer.customer_email" class="form-control m-input" placeholder="" value="">
                            <!-- <div class="input-group-append">
                                <button :disabled="!customer.customer_isvalidemail" v-on:click="searchByEmail()" class="btn btn-secondary" type="button">Search!</button>
                            </div> -->
                        </div>
                        <span class="m-form__help">{{emailhelp}}</span>
                    </div>
                </div>
                <div v-if="isPhoneRequired" class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                    <div class="col-lg-6 col-md-9 col-sm-12">
                        <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                            <div class="input-group-prepend"><span class="input-group-text">{{customer.customer_country}}</i></span></div>
                            <input v-model="customer.customer_phone" type="text" name="customer.customer_phone" id="customer.customer_phone" class="form-control m-input" placeholder="9876543210" value="">
                            <!-- <div class="input-group-append">
                                <button :disabled="!customer.customer_isvalidphone" v-on:click="searchByMobile()" class="btn btn-secondary" type="button">Search!</button>
                            </div>     -->                                                            
                        </div>
                        <span class="m-form__help">{{phonenohelp}}</span>
                        
                    </div>
                </div> 
                <div v-if="isCustomerCodeRequired" class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label"> Customer Code:</label>
                    <div class="col-lg-6 col-md-9 col-sm-12">
                        <div class="input-group">
                            <input type="text" v-model="customer.customer_code" name="customer.customer_code" id="customer.customer_code"  class="form-control m-input" placeholder="" value="">
                            <div class="input-group-append">
                                <button class="btn btn-secondary" v-on:click="searchByCode()" type="button">Search!</button>
                            </div>
                        </div>                    
                        <span class="m-form__help">Please enter customer's code</span>
                    </div>
                </div>
                <div v-if="isNutickIdRequired" class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">Customer Nutick ID:</label>
                    <div class="col-lg-6 col-md-9 col-sm-12">
                        <div class="input-group">
                            <input type="text" v-model="customer.customer_id" name="customer.customer_id" id="customer.customer_id"  class="form-control m-input" placeholder="" value="">
                            <div class="input-group-append">
                                <button class="btn btn-secondary" v-on:click="searchById()" type="button">Search!</button>
                            </div>
                        </div>                    
                        <span class="m-form__help">Please enter customer's Nutick ID</span>
                    </div>
                </div>                
            </form>
            <issue-loyalty-table></issue-loyalty-table>
        </div>
        <form  v-else-if="showNewCustomerForm" class="m-form m-form--fit m-form--label-align-right" id="m_create_cutomer">                           
            <div class="alert alert-warning" role="alert">
                    <strong>Not Found!</strong> Try to create new customer account.
            </div>
            <div class="m-form__heading">
                <h3 class="m-form__heading-title">Customer Details</h3>
            </div>
            <div v-if="isEmailRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Email:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text"><i class="la flaticon-email"></i></span></div>
                        <input v-model="customer.customer_email" type="email" name="email"  id="customer_email" class="form-control m-input" placeholder="" value="">
                        <div class="input-group-prepend"> <span class="input-group-text">
                            <i v-if="customer.customer_isvalidemail" class="la la-check-circle-o"></i>
                            <i v-else class="la la-times-circle-o"></i>
                        </span></div>           
                    </div>
                    <span class="m-form__help">{{emailhelp}}</span>
                </div>
            </div>
            <div v-if="isPhoneRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label">* Phone</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">
                        <div class="input-group-prepend"><span class="input-group-text">{{customer.customer_country}}</i></span></div>
                        <input v-model="customer.customer_phone" type="text" name="phone" id="customer_phone" class="form-control m-input" placeholder="9876543210" value="">                                                            
                        <div class="input-group-prepend"> <span class="input-group-text">
                            <i v-if="customer.customer_isvalidphone" class="la la-check-circle-o"></i>
                            <i v-else class="la la-times-circle-o"></i>
                        </span></div>                                                                
                    </div>
                    <span class="m-form__help">{{phonenohelp}}</span>
                    
                </div>
            </div>
            <div v-if="isCustomerCodeRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> Customer Code:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <input v-model="customer.customer_code" type="text" name="customer_code" id="customer_code"  class="form-control m-input" placeholder="" value="">
                    <span class="m-form__help">Please enter customer's code</span>
                </div>
            </div>
            <div v-if="isNutickIdRequired" class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> NuTick ID:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <input v-model="customer.customer_id" type="text" name="customer_id" id="customer_id"  class="form-control m-input" placeholder="" value="">
                    <span class="m-form__help">Please enter customer's nutick id</span>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"> Name:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <input v-model="customer.customer_name" type="text" name="customer_name" id="customer_name"  class="form-control m-input" placeholder="" value="">
                    <span class="m-form__help">Please enter customer's first and last names</span>
                </div>
            </div>
            <div class="m-portlet__foot m-portlet__foot--fit">
                <div class="m-form__actions">
                    <div class="row">
                        <div class="col-3">
                        </div>
                        <div class="col-9">
                            <button v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                <span>
                                    <i class="la la-arrow-left"></i>
                                    <span>Back</span>
                                </span>
                            </button>
                            <button type="submit" id="customer_submit" v-on:click="createCustomer()"  class="btn btn-accent m-btn m-btn--air m-btn--custom">Add Customer</button>
                        </div>
                    </div>
                </div>
            </div>           
        </form>
        <form  v-else-if="showCustomerDetails" class="m-form m-form--fit m-form--label-align-right" id="m_issue">
            <div class="form-group m-form__group row">
                <label class="col-xl-3 col-lg-3 col-form-label"></label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="m-portlet" style="border-radius:5;">
                        <div class="m-portlet__body">
                            <div class="m-widget5">
                                <div class="m-widget5__item" style="margin-bottom:0;padding-bottom:0;">
                                    <div class="m-widget5__content">
                                        <div class="m-widget5__pic"> 
                                            <img class="m-widget7__img" :src="customerimg" alt="">  
                                        </div>
                                        <div class="m-widget5__section">
                                            <h3 class="m-widget5__title">
                                                {{(customerDetails.customer_name)? customerDetails.customer_name.toUpperCase() : (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}
                                            </h3>                                            
                                            <span class="m-widget5__desc">
                                                <h6><i class="fa fa-address-card"></i> {{customerDetails.customer_nutick_account.toUpperCase()}}</h6>
                                                <h6><i class="fa fa-handshake"></i> {{customerDetails.membership_date}} </h6>                                                
                                                <h6><i class="fa fa-shopping-basket"></i> {{customerDetails.last_txn_date}}</h6>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="m-widget5__content">	                                        
                                        <div class="m-widget5__stats1">                                            
                                            <span class="m-widget5__number">{{customerDetails.loyalty[0].count}} &nbsp; {{customerDetails.loyalty[0].token}}</span><br>                                            
                                            <h6><i class="flaticon-map"></i> {{customerDetails.tier_id}}</h6>
                                        </div>                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>                                     
            <!-- <div class="form-group m-form__group row">
                <div class="col-12" >
                    <span class="m-topbar__userpic">
                        <img :src="customerimg" style="width: 150px;" class="m--img-rounded m--marginless" alt="" />
                    </span>
                </div>
            </div> 
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary">{{(customerDetails.customer_name)? customerDetails.customer_name: (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}</h4>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary">{{customerDetails.loyalty[0].count}} &nbsp; {{customerDetails.loyalty[0].token}}</h4>
                </div>
            </div> 
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary"> Tier: {{customerDetails.tier_id}}</h4>
                </div>
            </div>
            <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary"> MemberShip Date: {{customerDetails.membership_date}}</h4>
                </div>
            </div> -->
            <!-- <div class="form-group m-form__group row">
                <div class="col-12">
                    <h4 class="m--font-primary"> Last Transaction Date: {{customerDetails.last_txn_date}}</h4>
                </div>
            </div>
            <div class="form-group m-form__group row" style="text-align: left;">
                <label class="col-xl-3 col-lg-3 col-form-label"> Select Program Type:</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="m-radio-inline">
                        <label class="m-radio">
                        <input v-model="programtype" value="points" type="radio"> Manual Program
                        <span></span>
                        </label>
                        <label class="m-radio">
                        <input v-model="programtype" value="invoice" type="radio"> Automatic Program
                        <span></span>
                        </label>
                    </div>                
                </div>
            </div> -->
            <div class="form-group m-form__group row" style="text-align: left;" v-if="programtype === 'POINTS'">
                <label class="col-xl-3 col-lg-3 col-form-label"> Issue Loyalty Points :</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="points" name="points" id="points"  class="form-control m-input" placeholder="" value="">                        
                    </div>                    
                    <span class="m-form__help">Please enter points</span>
                </div>
            </div>
            <div class="form-group m-form__group row" style="text-align: left;">
                <label class="col-xl-3 col-lg-3 col-form-label"> Receipt Amount :</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="receipt_amt" :maxlength="8" name="receipt_amt" id="receipt_amt"  class="form-control m-input" placeholder="" value="">                        
                    </div>                    
                    <span class="m-form__help">Please enter Receipt Amount</span>
                </div>
            </div>
            <div class="form-group m-form__group row" style="text-align: left;">
                <label class="col-xl-3 col-lg-3 col-form-label"> Receipt Number :</label>
                <div class="col-lg-6 col-md-9 col-sm-12">
                    <div class="input-group">
                        <input type="text" v-model="receipt_no" :maxlength="10" name="receipt_no" id="receipt_no"  class="form-control m-input" placeholder="" value="">                        
                    </div>                    
                    <span class="m-form__help">Please enter Receipt Number</span>
                </div>
            </div>
            <div class="m-portlet__foot m-portlet__foot--fit" style="text-align:center;">
                <div class="m-form__actions">
                    <div class="row">
                        <div class="col-12">
                            <button type="button" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                <span>
                                    <i class="la la-arrow-left"></i>
                                    <span>Back</span>
                                </span>
                            </button>
                            <button type="submit" id="issue_submit" v-on:click="createIssue()"  class="btn btn-accent m-btn m-btn--air m-btn--custom">Issue Loyalty</button>
                        </div>
                    </div>
                </div>
            </div>           
        </form>
        <!--begin:: Widgets/Company Summary-->
<div class="m-portlet m-portlet--full-height" v-else-if="showReceipt">
	<div class="m-portlet__head">
		<div class="m-portlet__head-caption">
			<div class="m-portlet__head-title">
				<h3 class="m-portlet__head-text">
					Receipt
				</h3>
			</div>
		</div>
	</div>
	<div class="m-portlet__body">
        <div class="m-widget13">
            <div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
                    Transaction ID
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{customerData.txnid}}					 
				</span>
			</div>
			<div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Token:
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{customerDetails.loyalty[0].token}}					 
				</span>
            </div>
			<div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Customer 
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{(customerDetails.customer_name)? customerDetails.customer_name: (customerDetails.customer_email)? customerDetails.customer_email: customerDetails.customer_mobile}}					 
				</span>
            </div>
            <div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Loyalty Points:
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{customerData.loyalty_points}}						 
				</span>
			</div>
			<div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Receipt Amount:
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{receipt_amt}}						 
				</span>
			</div>
			<div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Receipt Number:
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{receipt_no}}					 
				</span>
            </div>
			<div class="m-widget13__item">
				<span class="m-widget13__desc m--align-right">
				Expiry Date:
				</span>
				<span class="m-widget13__text m-widget13__text-bolder">
				{{customerData.expirydate}}					 
				</span>
            </div>
            <div class="m-widget13__action m--align-right">
                <button v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Go to Issue</span>
                    </span>
                </button>						 					 
            </div>			
		</div>		 
	</div>
</div>
<!--end:: Widgets/Company Summary--> 
    `,
    mounted(){
        this.initIssueTable();
    }
})

