Vue.component('couponserials-form-header', {
    props:['isformvalid', "coupon_name"],
    computed: {
        isDisabled() {
          return this.isformvalid == false;
        }
    },
    template:`
    <div class="m-portlet__head">
        <div class="m-portlet__head-progress">
            <!-- here can place a progress bar-->
        </div>
        <div class="m-portlet__head-wrapper">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <h3 class="m-portlet__head-text">
                        Create Coupon Serial for&nbsp; <span style="text-transform: uppercase;">{{coupon_name}}</span>
                    </h3>
                </div>
            </div>
           <!-- <div class="m-portlet__head-tools">
                <a href="#" v-on:click="$emit('couponserialformcancel',$event)" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                    <span>
                        <i class="la la-arrow-left"></i>
                        <span>Back</span>
                    </span>
                </a>
                <button v-on:click="$emit('couponserialformsave',$event)" type="button" class="btn btn-primary m-btn m-btn--custom" id="saveBtn" :disabled="isDisabled">Allocate</button>
            </div>-->
        </div>
    </div>
    `
})

Vue.component('couponserials-form-component', {
    props:['primaryinput', 'coupon_code'],
    data: function() {
        return {
            couponList: [],
            serials_count: '',
            coupon_code_new: '',
            enabled: true,
            status: true,
            showCount: 'count',
            activate: true,
            serials_file: '',
            showConfirmBox: false,
            progressValue: 0,
            base64file: '',
            totalPages: '',
            allocation_code: '',
            coupon_name: ''
        };
    },
    computed: {
        isValidForm(){
            var retval = true;
            if(retval && (this.serials_count != '')) {
                retval = true;
            }
            return retval;
        }
    },
    watch:{
        'coupon_code': function() {
            console.log("couponserials Form coupon_code", this.coupon_code)
            this.coupon_code_new = this.coupon_code;
            $(this.$refs.select).val(this.coupon_code).trigger('change');
            axios.get('loyalty/coupons/'+ this.coupon_code).then(response => {
                var data = response.data;
                console.log("Response coupon ", data);
                this.coupon_name = data.coupon_name;
            }).catch(err => {
                console.log("Error ", err.response.data);
            })
        }
    },
    created: function () {
        console.log('form created')
        // this.debouncedCheckEmail = _.debounce(this.checkEmail, 500);
        // this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
    },
    methods: {
        resetData: function() {
            this.serials_count = '';
            this.enabled = true;
            this.status = true;
            this.activate = true;
            this.showCount = 'count';
            this.serials_file = '';
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
        changeActiveStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.activate = true;
            }
            else {
                this.activate = false;
            }
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.enabled = true;
            }
            else {
                this.enabled = false;
            }
        },   
        displaycouponserialList : function(){
            // alert('display Add couponserial form')
            $('#m-couponserial-form').removeClass('d-none');
            $('#m-couponserial-list').addClass('d-none');
            $('#m-couponserial-form-edit').addClass('d-none');
        },   
        uploadfile: function(event) {           
            const file = event.target.files[0];
            this.serials_file = file;
            var vm = this;
            const reader =  new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e =>{
                var imageurl = e.target.result;
                let rawData = imageurl.split("base64,");
                if (rawData.length > 1) {
                    rawData = rawData[1];
                    let data = {
                        filename: file.name,
                        b64data: rawData,
                        mimetype: file.type
                    }
                    vm.base64file = data;
                }
            }
        },

        initcouponserialsTable: function(coupon_code, allocation_code) {
            this.allocation_code = allocation_code;
            console.log("get Serials table");
            var vm = this;
            this.datatable = $('.m_datatable_couponserialfile').mDatatable({
                // datasource definition
                data: {
                  type: 'remote',
                  source: {
                    read: {
                      url: '/loyalty/coupons/couponserials/'+coupon_code+'/allocation/'+ allocation_code,
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
                        vm.totalPages = datatable.getTotalRows();
                        return  ((datatable.getCurrentPage() -1) * datatable.getPageSize() + index+1) ;
                    }
                  },
                  {
                    field: 'couponserial',
                    title: 'Coupon Serial',
                    sortable: 'asc', // default sort
                    width: 150,
                    template: '{{coupon_serial}}'
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
                    // basic templating support for column rendering,
                    template: '{{coupon_code}}'
                  },
                                              
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
                  let name = $(e.target).closest('.m-datatable__row').find('[data-field="allocationcode"]').text();
                  this.couponserialid = id;
                  this.couponserialname = name;
              });
        },
        submitForm:function(){
            var vm = this;
            var form = $('#m_form_couponserial_new');
            var btn = $('#saveBtn');
            form.validate({
                rules: {
                    coupon_code: {
                        required: true
                    },
                    serials_count: {
                        required: {
                            demands: function(e) {
                                if(vm.showCount === 'count') {
                                    return true
                                }
                                else {
                                    return false
                                }
                            }
                        }
                    },
                    serials_file: {
                        required: {
                            demands: function(e) {
                                if(vm.showCount === 'file') {
                                    return true
                                }
                                else {
                                    return false
                                }
                            },                        
                        },
                        accept: "csv",
                    }
                },
                messages: {
                    serials_file: {
                        accept: "Please Upload CSV file"
                    }
                }
            })

            if(!form.valid()) {
                return;
            }
            var serialData = {
                coupon_code: vm.coupon_code,
                serials_count: (vm.serials_count)? vm.serials_count: '',
                serial_status: (vm.status)? 2 : 1,
            };         
            const reader = new FileReader();
            if(vm.serials_file) {
                var formData = new FormData();
                formData.append("coupon_code", vm.coupon_code);
                formData.append("csv_file", vm.serials_file);
                if(vm.serials_file.size > 3048576) //do something if file size more than 1 mb (1048576)
                {
                    this.$emit('showtoast',{'msg':'upload file size with less than 3MB','type':'error','event':this.$event})
                    return;
                }
                else {
                    vm.showConfirmBox = true;
                    reader.readAsText(vm.serials_file);
                    reader.onload = e =>{
                        var result = e.target.result;
                        console.log("file reader ", e);
                        var split = result.split('\n');
                        for(var i in split) {
                            vm.progressValue = ((i/split.length)*100);
                        }
                        
                        console.log("Read csv ", split);
                        
                    };                    
                    console.log("Form Data ", vm.base64file);
                    var serialFormData = {
                        coupon_code: vm.coupon_code,
                        csv_file: vm.base64file
                    };
                    axios.post('loyalty/coupons/couponserials/file_upload',formData)
                    .then(response => {
                        var data = response.data;
                        this.initcouponserialsTable(vm.coupon_code, data.allocation_code);
                    })
                    .catch(err => {
                        if(err.response.status == 403) {
                            window.location.replace('/login');
                        }
                        console.log("Error ", err);
                    })
                   

                }
            }
            else {
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                console.info("File Data ", vm.serials_file);
                axios.post('/loyalty/coupons/couponserials', serialData)
                .then(response => {
                    console.log("Serial Added ", response.data);
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    vm.showConfirmBox = false;
                    vm.$emit('showtoast',{'msg':'coupon serials has been created','type':'success','event':vm.$event})
                    vm.resetData();
                    vm.$emit('couponserialformsave',{'couponserial':'','event':vm.$event})
                    
                })
                .catch(err => {
                    if(err.response.status == 403) {
                        window.location.replace('/login');
                    }
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    vm.$emit('showtoast',{'msg':err.response.data.error_msg,'type':'error','event':vm.$event})
                })

            }
           
        },
        cancelForm:function(){
            this.resetData();
            this.showConfirmBox = false;
            this.$emit('couponserialformcancel',{'couponserial':this.couponserial,'event':this.$event})
        
        },
        submitSerials: function() {
            var vm  = this;
            var btn = $('#confirmBtn');
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            axios.get('loyalty/coupons/serials/'+ vm.coupon_code +'/allocation/' + vm.allocation_code+ '?page=1')
                .then(response => {
                    var data = response.data.serials;
                    var totalpages = response.data.total_pages;
                    var serials = [];
                    for(var i in data) {
                        serials.push({
                            coupon_serial:data[i].coupon_serial
                        });
                    }
                    if(totalpages > 1) {
                        for(var j= 2; j <= totalpages; j++) {
                            axios.get('loyalty/coupons/serials/'+ vm.coupon_code +'/allocation/' + vm.allocation_code+ '?page='+j)
                            .then(response => {
                                serials = [];
                                var data = response.serials;
                                for(var i in data) {
                                    serials.push({
                                        coupon_serial:data[i].coupon_serial
                                    });
                                }
                                console.log("Serials confirm ", serials);
                                var serialData = {
                                    coupon_code: vm.coupon_code,
                                    serials: serials,
                                    serial_status: (vm.status)? 2 : 1,
                                }; 
                                console.log("Serials confirm ", serialData)
                                axios.post('loyalty/coupons/allocations/serials_list', serialData)
                                    .then(response => {
                                        if(totalpages == j) {
                                            vm.resetData();
                                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                            vm.$emit('showtoast',{'msg':'coupon serials has been created','type':'success','event':vm.$event})
                                            vm.$emit('couponserialformsave',{'couponserial':'','event':vm.$event});
                                        }                                        
                                        
                                    })
                                    .catch(err => {
                                        if(err.response.status == 403) {
                                            window.location.replace('/login');
                                        }
                                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                        vm.$emit('showtoast',{'msg':err.response.data.error_msg,'type':'error','event':vm.$event})
                                    })
                            })
                        }                        
                    }
                    else {
                        var serialData = {
                            coupon_code: vm.coupon_code,
                            serials: serials,
                            serial_status: (vm.status)? 2 : 1,
                        }; 
                        console.log("Serials confirm ", serialData)
                        axios.post('loyalty/coupons/allocations/serials_list', serialData)
                            .then(response => {
                                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                vm.resetData();
                                vm.$emit('couponserialformsave',{'couponserial':'','event':vm.$event})
                                vm.$emit('showtoast',{'msg':'coupon serials has been created','type':'success','event':vm.$event})
                            })
                            .catch(err => {
                                if(err.response.status == 403) {
                                    window.location.replace('/login');
                                }
                                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                                vm.$emit('showtoast',{'msg':err.response.data.error_msg,'type':'error','event':vm.$event})
                            })
                    }                   
                })
            
            
        }
    },
    template: `
    <div class="m-grid__item m-content-couponserial-form d-none" id="m-couponserial-form" >
        <div class="m-content">
            <div class="row">
                <div class="col-lg-12">
                    <!--begin::Portlet-->
                    <div class="m-portlet m-portlet--last m-portlet--head-lg m-portlet--responsive-mobile" id="main_portlet">
                    <couponserials-form-header v-bind:isformvalid="isValidForm" :coupon_name="coupon_name"
                            @couponserialformcancel="cancelForm()"
                            @couponserialformsave="submitForm()"
                    ></couponserials-form-header>
                        <div class="m-portlet__body">
                            <form class="m-form m-form--fit m-form--label-align-right" v-if="!showConfirmBox" id="m_form_couponserial_new">
                                <div class="m-portlet__body">
                                    <div class="row">
                                        <div class="col-xl-8">
                                            <!-- <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Coupon Name:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                <select readonly v-model="coupon_code_new" ref="select" class="form-control m-input" id="m_select2_1">
                                                    <option value="">Select Coupon Code</option>
                                                    <option v-for="coupon in couponList" :value="coupon.coupon_code">{{coupon.coupon_name}}</option>
                                                </select>
                                                </div>
                                            </div> 
                                            <div  class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serials Generate Type:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                            <input v-model="showCount"  value="count" type="radio"> Serials Count
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                    <div class="m-radio-inline">
                                                        <label class="m-radio">
                                                            <input v-model="showCount"  value="file" type="radio"> Serials File Upload
                                                        <span></span>
                                                        </label>
                                                    </div>
                                                </div>                                                
                                            </div> -->
                                            <div  class="form-group m-form__group row" v-if="showCount == 'count'">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Serials Count:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">                                                       
                                                    <input type="text" v-model="serials_count" :maxlength="7" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="serials_count" class="form-control m-input">
                                                </div>
                                            </div> 
                                            <div  class="form-group m-form__group row" v-if="showCount == 'file'">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Upload Serials:</label>
                                                <div class="col-lg-6 col-md-9 col-sm-12">  
                                               
                                                    <input type="file" name="serials_file" v-on:change="uploadfile($event)" class="form-control m-input">
                                                </div>
                                            </div>                                    
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label">* Activate:</label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <div class="input-group m-input-icon m-input-icon--left m-input-icon--right">                                                             
                                                        <span class="m-switch m-switch--outline m-switch--icon m-switch--primary">
                                                            <label>
                                                            <input type="checkbox" v-model="status" v-on:change="changeActiveStatus($event)"  name="">
                                                            <span></span>
                                                            </label>
                                                        </span>
                                                    </div>                                                        
                                                </div>
                                            </div>
                                            <div class="form-group m-form__group row">
                                                <label class="col-xl-3 col-lg-3 col-form-label"></label>
                                                <div class="col-xl-9 col-lg-9">
                                                    <a href="#" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                                        <span>
                                                            <i class="la la-arrow-left"></i>
                                                            <span>Back</span>
                                                        </span>
                                                    </a>
                                                    <button v-on:click="submitForm()" type="button" class="btn btn-primary m-btn m-btn--custom" id="saveBtn">Create {{(status)? '& Activate': ''}}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div v-else>
                                <div class="form-group m-form__group row">
                                    <div class="col-xl-12 col-lg-12">
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated " role="progressbar" :aria-valuenow="progressValue" aria-valuemin="0" aria-valuemax="100" :style="'width:' + progressValue +'%'"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group m-form__group row">
                                    <div class="col-xl-12 col-lg-12">
                                        <div class="m_datatable_couponserialfile" id="couponserial_file_data"></div>
                                    </div>
                                </div>
                                <div class="form-group m-form__group row">
                                    <label class="col-xl-3 col-lg-3 col-form-label"></label>
                                    <div class="col-xl-9 col-lg-9">
                                        <a href="#" v-on:click="cancelForm()" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                                            <span>
                                                <i class="la la-arrow-left"></i>
                                                <span>Back</span>
                                            </span>
                                        </a>
                                        <button v-on:click="submitSerials()" type="button" class="btn btn-primary m-btn m-btn--custom" id="confirmBtn">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>											
                    </div>                    
                    <!--end::Portlet-->
                </div>
            </div>
        </div>
    </div>
    `,
    mounted: function() {
        var vm = this;
        
        axios.get('/loyalty/coupons')
        .then(response => {
            vm.couponList = response.data.coupons;
        })
        .catch(error => {
            if(error.response.status == 403) {
                window.location.replace('/login');
            }
            console.log("Coupon list error ", error);
        })

        $(this.$refs.select)
        .select2({
           
        })       
        .on('change', function () {            
            vm.coupon_code_new = $(this).val();
            console.log("coupon code ", $(this).val());
            
        });
        
    }
})