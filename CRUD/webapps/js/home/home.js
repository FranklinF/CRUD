Vue.component('home-main-component', {
    data: function() {
        return {
            total_issued: '',
            total_redeemed: '',
            total_coupons: '',
            total_customers: '',
            brand: {
				token_name: '',
				symbol: '',
				brand_desc: '',
				brand_url: ''
            },
            brandimg: '',
			updateBrandImg: false,
            readSymbol: false,
            programid: '',
            program: {              
                program_name: '',
                program_description: '',
                program_expiry: '',
                status: '1',
                program_type: 'N',
                program_expiry_type: '0',
                program_expiry_date:'',
                program_ceiling: '',
                program_tiers: '',
                token_id: '',
                tiers: []
            },
            // programid: '',
            phonenohelp:"Enter program's valid phone in  E.g: +1 5417543010",
            emailhelp:"program's communication email address Ex. john@gmail.com",
            showExpiry: false,
            tierList: [],
            addTiers: [],
            newProgram: true,
            checked: true,
            auditLogs: [],
            business_name: '',
			business_type: '',
			registration_no: '',
			contact_person: '',
			contact_no: '',
			business_desc: '',
			business_url: '',
			business_address: '',
			eos_account_name: '',
			earning_mechanics: '',
			email: '',
			mobile: '',
			city: '',
			country: '',
			country_code: 'IN',
			time_zone: '',
            formatedphone:'',
            phonenofull:'',
            isvalidphone:'',
            phonenohelp:"Enter merchant's valid phone in  E.g: +1 5417543010",
            contact_country_code: 'IN',
            formatedcontact:'',
            contactnofull:'',
            isvalidcontact:'',
            contacthelp:"Enter merchant's valid phone in  E.g: +1 5417543010",
            countryList : '',
			bannerurl: '',
			newBannerImage: '',
			showEditProfile: false,
			industryList: [],
            timeZoneList: [],
            brandImageData: ''
        }
    },
    watch:{        
        'program.program_expiry_type': function() {
            this.checkExpiryType()
        },
        'programid': function() {
            console.log('Program ID:', this.programid);
            // this.getProgram(this.programid);
            this.getTiers();
        },
        'mobile': function(){
            this.debouncedCheckNumber()
        }, 
        // 'contact_no': function(){
        // this.debouncedCheckContactNumber()
        // },

    },
    created: function() {
        this.getDashboardData();
        this.getCustomers();
        this.getStaffs();
        this.debouncedCheckNumber = _.debounce(this.checkPhone, 500);
        this.debouncedCheckContactNumber = _.debounce(this.checkContact, 500);
    },
    methods: {
        checkExpiryType: function() {
            console.log(typeof this.program.program_expiry_type)
            if(Number(this.program.program_expiry_type) === 1) {
                this.showExpiry = true;
                console.log("if", this.program.program_expiry_type)
            }
            else if(Number(this.program.program_expiry_type) === 2) {
                this.showExpiry = true;
            }
            else if(Number(this.program.program_expiry_type) === 3) {
                this.showExpiry = true;
            }
            else {
                console.log("else", this.program.program_expiry_type)
                this.showExpiry = false;
            }
        }, 
        checkContact:  function () {
            var vm = this;
            if(vm.contact_no != null && vm.contact_no.length > 4){
                axios.get(`generic/phonecheck/`+vm.contact_no)
                .then(function (response) {
                        console.log(response.data);
                        console.log(response.data.contactnofull)
                        vm.answer=response.data.countrycode;
                        vm.formatedcontact = response.data.phonenumberformat;
                        vm.isvalidcontact = response.data.isvalidnumber;
                        vm.contactnofull = response.data.phonenumber;
                })
                .catch(function (error) {
                    vm.contacthelp = 'Error! Could not reach the API. ' + error
                    vm.formatedcontact='';
                    vm.isvalidcontact = false;
                })
            }else{
                vm.contacthelp = "Enter merchant's valid phone in  E.g: +1 5417543010"
                vm.formatedcontact='';
                vm.isvalidcontact = false;
            }

        },
        checkPhone:  function () {
            var vm = this;
            if(vm.mobile != null && vm.mobile.length > 0){
                axios.get(`generic/phonecheck/`+vm.mobile)
                .then(function (response) {
                        console.log(response.data.isvalidnumber);
                        console.log(response.data.phonenumberformat)
                        vm.answer=response.data.countrycode;
                        vm.formatedphone = response.data.phonenumberformat;
                        vm.isvalidphone = response.data.isvalidnumber;
                        vm.phonenofull = response.data.phonenumber;
                })
                .catch(function (error) {
                    vm.phonenohelp = 'Error! Could not reach the API. ' + error
                    vm.formatedphone='';
                    vm.isvalidphone = false;
                })
            }else{
                vm.phonenohelp = "Enter merchant's valid phone in  E.g: +1 5417543010"
                vm.formatedphone='';
                vm.isvalidphone = false;
            }

        },       
        getDashboardData: function() {
            var vm = this;
            
            axios.get('/loyalty/tokens/total_balance')
            .then((response) => {
                let total = response.data.stats[0];
                console.log(total)
                vm.total_issued = total.issued;
                vm.total_redeemed = total.redeemed;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/status/4/serials')
            .then((response) => {
                let total = response.data.serials;                
                vm.total_redeemed = total.length;
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },     
        getCustomers: function() {
            var vm = this;
            axios.get('/loyalty/merchant/list/customers?page=1')
            .then((response) => {
                vm.total_customers = response.data.pagination.total_rows
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                
            })
        },
		uploadBrandImage: function(event) {
			//console.log("Event ", event.target.files[0], this.updateBrandImg);
			let vm = this;
            var form = $('#m_form_setting_brand');
            const image = event.target.files[0];
            vm.brandImageData = image;
			const reader = new FileReader();
			var fileType = image.type;
			var validImageTypes = ["image/jpeg", "image/png"];
			if ($.inArray(fileType, validImageTypes) < 0) {
				vm.$emit('showtoast',{'msg':'Upload only Images ','type':'error','event':this.$event})
			   }
			else {
				reader.readAsDataURL(image);
				reader.onload = e =>{
					vm.brandimg = e.target.result;
					let rawData = vm.brandimg.split("base64,");
					if (rawData.length > 1) {
						rawData = rawData[1];
						let data = {
							filename: image.name,
							b64data: rawData,
							mimetype: image.type
						}						
					}
					
				};
			}
			
        },
        getTiers: function() {
            var vm = this;
            vm.tierList = [];
            axios.get('loyalty/tiers?page=1')
            .then((response) => {
                let data = [];
                data = response.data.tiers;
                console.log("Response tier ", data);                
                let tid = 'DEFAULT';                               
                for(var i in data) {                    
                    if(tid == data[i].tier_id) {                        
                        vm.tierList.push({
                            tier_id: data[i].tier_id,
                            tier_name: data[i].tier_name,
                            control: data[i].tier_id,
                            checked: true,
                            disabled: true,
                            placeholder: data[i].tier_name + ' Loyalty Points'
                          })
                        //   if(vm.newProgram) {
                        //     vm.changeOptions(data[i].tier_id, i); 
                        //   }                        
                    }
                    else {                        
                        vm.tierList.push({
                            tier_id: data[i].tier_id,
                            tier_name: data[i].tier_name,
                            control: data[i].tier_id,
                            checked: false,
                            disabled: false,
                            placeholder: data[i].tier_name + ' Loyalty Points'
                          })
                    } 
                  }
                  vm.getProgram(vm.programid);      
            })
            .catch((error) => {
                console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            }) 
            
        },
		submitForm:function(){
            var vm = this;
            var btn = $('#brand_submit');
			btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			let tokenDetails = { 
				token_name: vm.brand.token_name,
				symbol: vm.brand.symbol.toUpperCase(),
				brand_url: vm.brand.brand_url,
				brand_desc: vm.brand.brand_desc
             };

             console.log('vm.brandImageData :', vm.brandImageData);
             axios.post(`/loyalty/tokens`, tokenDetails).then(response => {
                if(response.status === 200) {
                    vm.getProgram('POINTS');
                    vm.programid = 'POINTS';
                    var tokenName = vm.brand.symbol.toUpperCase(); //response.data.symbol;
                    console.log('tokenName1 :', response.data.symbol);
                    if(vm.brandImageData) {
                        const reader = new FileReader();
                        reader.readAsDataURL(vm.brandImageData);
                        reader.onload = e =>{
                            var brandimg = e.target.result;
                            console.log("token image upload call ", brandimg.split("base64,"));
                            let rawData = brandimg.split("base64,");
                            if (rawData.length > 1) {
                                rawData = rawData[1];
                                let data = {
                                    filename: vm.brandImageData.name,
                                    b64data: rawData,
                                    mimetype: vm.brandImageData.type
                                }
                                console.log('tokenName2 :', tokenName, data);
                                axios.post('/loyalty/tokens/'+ tokenName + '/images/token', data).then(response => {
                                    console.log(response.data.status);
                                    // this.$emit('showtoast',{'msg':'Brand Image upload Success','type':'success','event':this.$event})
                                    // vm.showErrorMsg(form, 'success', 'brand image update Success!! ');
                                })
                                .catch(e => {
                                    if(e.response.status == 403) {
                                        window.location.replace('/login');
                                    }
                                    console.log('failure call:', e.response.data.error_msg);
                                    // this.$emit('showtoast',{'msg':'Brand Image upload Failed','type':'error','event':this.$event})
                                    // vm.showErrorMsg(form, 'danger', 'brand Image Upload failed !! ' + e.response.data.error_msg);
                                })					
                            }
                            
                        }; 
                    }                    
                }
                                              

            })
            .catch(e => {
                console.log('failure call:', e.response);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                vm.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                new mWizard('m_wizard', {
                    startStep: 1
                }).goTo(1);
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
   
            })
			 
            
        },
        getProgram: function(programid) {
            console.log('Program ID:', programid);
            var vm = this;
            axios.get('loyalty/programs/'+programid)
            .then((response) => {
                let data = response.data;
                vm.newProgram = false;
                vm.program.program_name = data.program_name;
                vm.program.program_description = data.program_description;
                vm.program.program_expiry = data.program_expiry;
                vm.program.status = data.status;
                if(data.status === 1) {
                    vm.checked = true;
                }
                else {
                    vm.checked = false;
                }
                vm.program.program_type = data.program_type;
                vm.program.program_expiry_type = data.program_expiry_type.toString();
                vm.program.program_ceiling = data.program_ceiling;
                vm.program.token_id = data.token_id;                
                
                if(data.program_expiry_type === 4) {
                    vm.program.program_expiry_date = moment(data.program_expiry, "YYYYMMDD").format("YYYY-MM-DD");
                }
                let tiers = data.program_tiers;
                console.log("Tier length", tiers.length);
                if(tiers.length === 0) {
                    vm.changeOptions('DEFAULT', 0); 
                }
                else {
                    for(var i in tiers) {
                        console.log("Response ", tiers[i]);
                        let loyalty = tiers[i].tier_loyalty;
                        let tierid = tiers[i].tier_id;
                        for(var j in vm.tierList) {  
                            console.log("vm.tierList[j] ");                      
                            if(vm.tierList[j].tier_id === tierid) {
                                vm.tierList[j].control = loyalty;
                                vm.program.tiers[tierid] = loyalty;
                                vm.changeOptions(vm.tierList[j].tier_id, j);
                                // this.tierList[j].checked = true;
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                console.log("Error ", error.response);
                vm.newProgram = true;
                vm.changeOptions('DEFAULT', 0); 
                // vm.getTokens();
            }) 

        },
        getToken: function() {
			var vm = this;
            axios.get('/loyalty/tokens')
            .then((response) => {
                //console.log("Token Response ttttttttttt", response.data.tokens.length);
                var modal = $('#m_modal_plan');
                // modal.modal("show");                
                if(response.data.tokens.length == 0)
                {
                    modal.modal("show");
                }
                else{
                    axios.get('loyalty/programs/RECEIPT')
                    .then((response) => {
                        let data = response.data;
                        vm.getProgram("POINTS");
                        console.log("Response prgm ", data.program_tiers)
                        if(data.program_tiers.length === 0 || data.program_tiers[0].tier_loyalty === undefined) {
                            modal.modal("show");
                            wizard = new mWizard('m_wizard', {
                                startStep: 1
                            }).goTo(3);
                        }
                        else {
                            axios.get('/loyalty/merchant/profile/details')
                            .then((response) => {	
                                vm.getProgram("RECEIPT");
                                var data = response.data;
                                if(!data.country || !data.time_zone) {
                                    modal.modal("show");
                                    wizard = new mWizard('m_wizard', {
                                        startStep: 1
                                    }).goTo(4);
                                }
                                else {
                                    // modal.modal("show");
                                    // wizard = new mWizard('m_wizard', {
                                    //     startStep: 1
                                    // }).goTo(4);
                                    modal.modal("hide");
                                }
                            })
                        }
                        
                    })
                }
            })
            .catch((error) => {
                // var modal = $('#m_modal_plan');
                // modal.modal("show");
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })           
		},      
        getStaffs: function() {
            var vm = this;
            axios.get('/loyalty/coupons?page=1')
            .then((response) => {
                vm.total_coupons = response.data.pagination.total_rows
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
                
            })
        },
        submitProgramForm:function(){
            var vm = this;                       
            var date = '';            
            if(vm.program.program_expiry_type === '4') {
                $("#program_expiry_date").rules("add", {required:true});
                
                let d = $('#program_expiry_date').val().split('-'); // vm.program.program_expiry_date.split('-');
                date = d[0]+d[1]+d[2];
            }
            else if(vm.program.program_expiry_type !== '0') {
                $("#program_expiry").rules("add", {required:true});
            }
           

            let arr = []
            for(var i in this.addTiers) {
                arr.push({
                    tier_id: this.addTiers[i],
                    tier_loyalty: vm.program.tiers[this.addTiers[i]]
                })
            }
            console.log("submitProgramForm", this.addTiers);
            
            let data = {      
            program_name: vm.program.program_name,
            program_description: vm.program.program_description,
            program_expiry: (vm.program.program_expiry_type === '4' )? date : vm.program.program_expiry,            
            program_type: vm.program.program_type,
            program_expiry_type: Number(vm.program.program_expiry_type),
            program_ceiling: vm.program.program_ceiling,
            program_loyalty: vm.program.program_loyalty,
            program_tiers: arr,
            token_id: vm.program.token_id
            }
            console.log("program ", data, vm.newProgram);
                console.log("PUT");
                axios.put(`/loyalty/programs/`+ this.programid, data).then(response => {
                    console.log(response.data.status);
                    this.$emit('programformsave',{'program':this.program,'event':this.$event})
                    // if(vm.programid === 'RECEIPT') {
                        // var modal = $('#m_modal_plan');
                        // modal.modal("hide");
                    // }
                    this.$emit('showtoast',{'msg':'Program has been update success','type':'success','event':this.$event})
                    // vm.showErrorMsg(form, 'success', 'program update success !! ');
                
                })
                .catch(e => {
                    if(e.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log('failure call:', e.response.data.error_msg);
                    // this.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
                    // vm.showErrorMsg(form, 'danger', 'program update failed !! ' + e.response.data.error_msg);
                })           
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
              evt.preventDefault();
            } else {
              return true;
            }
          },
          isAlphabate: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (!((charCode == 8) || (charCode == 32) || (charCode == 46) || (charCode >= 35 && charCode <= 40) || (charCode >= 65 && charCode <= 90))) {
                evt.preventDefault();
            } else {
                return true;
            }
            // if (e.shiftKey || e.ctrlKey || e.altKey) {
            //     e.preventDefault();
            //   } else {
            //     var key = e.keyCode;
            //     if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
            //       e.preventDefault();
            //     }
            //     else {
            //         return true;
            //     }
            //   }
          },
          changeOptions: function(tierid, index) {
            
            if(tierid !== 'DEFAULT') {
                this.tierList[index].checked = !this.tierList[index].checked;
              }  
            if(this.addTiers.length === 0) {
                this.addTiers.push(tierid);
                // this.program[tierid] = '';
            }            
            else {
                let find = this.addTiers.findIndex(tid => tid === tierid);
                console.log("Find ", find, tierid);
                if(find === -1) {
                this.addTiers.push(tierid);                
                }
                else {
                    if(tierid !== 'DEFAULT') {
                        this.addTiers.splice(find, 1);
                        delete this.program.tierid
                    }
                }
            }
            console.log("Edit changeOptions ", this.addTiers);
        },
        changeTierLoyalty: function(event, tierid) {
            
            this.program.tiers[tierid] = event.target.value;
        },
        changeStatus: function(event) {
            console.log("Status Event ", event);
            let checked = event.target.checked;
            if(checked) {
                this.program.status = 1;
            }
            else {
                this.program.status = 2;
            }
        },
        getUtils: function() {
			var vm = this;
            axios.get('/loyalty/utils/COUNTRY')
            .then((response) => {
                var data = response.data;
                this.countryList = data.details;

			})
			
			axios.get('/loyalty/utils/INDUSTRY')
            .then((response) => {
                var data = response.data;
                this.industryList = data.details;

			})

			axios.get('/loyalty/utils/TIMEZONE')
            .then((response) => {
                var data = response.data.details;
                // for(var i in data) {
                //     vm.timeZoneList.push({
                //         id: i,
                //         text: timezone.lookup_name
                //     })
                // }
				data.forEach(timezone => {
					vm.timeZoneList.push({
						lookup_name: timezone.lookup_name,
						lookup_display_name: timezone.lookup_display_name[0]
					})
				})
                

            })
            vm.getProfile();
        },
        getProfile: function() {
			var vm = this;
            axios.get('/loyalty/merchant/profile/details')
            .then((response) => {
				
				var data = response.data;
				vm.business_name = data.business_name;
				vm.business_type = data.business_type;
				vm.registration_no = data.registration_no;
				vm.contact_person = data.contact_person;
				vm.contact_no = data.contact_no;
				vm.country_code = vm.country_code;
				vm.business_desc = data.business_desc;
				vm.business_url = data.business_url;
				vm.business_address = data.business_address;
				vm.eos_account_name = data.eos_account_name;
				vm.earning_mechanics = data.earning_mechanics;
				vm.email = data.email;
				vm.mobile = data.mobile;
				vm.city = data.city;
				vm.country = data.country;
				vm.time_zone = data.time_zone;
				vm.contactnofull = data.contact_no;
				vm.phonenofull = data.mobile;
				vm.bannerurl = data.bannerurl; 				
            })
            .catch((error) => {
				console.log("Error ", error.response);
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
            })
        },
        updateProfile: function() {
			var form = $('m_profile_form');
            var btn = $('#profile_submit');
            var vm = this;
            
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
			var profileData = {
				business_name: vm.business_name,
				business_type: vm.business_type,
				registration_no: vm.registration_no,
				contact_person: vm.contact_person,
				contact_no: vm.contactnofull,
				business_desc: vm.business_desc,
				business_url: vm.business_url,
				earning_mechanics: vm.earning_mechanics,
				business_address: vm.business_address,
				eos_account_name: vm.eos_account_name,
				email: vm.email,
				time_zone: vm.time_zone,
				mobile: vm.phonenofull,
				country_code: vm.country_code,
				city: vm.city,
				country: vm.country
            };
            
            console.log("Profile Data ", profileData);

			axios.put('loyalty/merchant', profileData)
			.then((response) => {
                console.log("Profile Response ", response);
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                vm.$emit('showtoast',{'msg':'Profile Updated Success','type':'success','event':this.$event})
                // vm.showErrorMsg(form, 'success', 'profile update success!..');
                var modal = $('#m_modal_plan');
                modal.modal("hide");
			})
			.catch((error) => {
				var e = error;
                console.log("profile Error ", error);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                vm.$emit('showtoast',{'msg':e.response.data.error_msg,'type':'error','event':this.$event})
				// vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
			})
        },
        getActivityLog: function(page) {
            for(var i = 1; i <= page; i++) {
                axios.get('/loyalty/audit/log/list?page=' + i)
                .then(response => {                
                    var data = response.data.auditlog;
                   data.map(function(a) {
                        vm.auditLogs.push({                        
                            merchant_id: a.merchant_id,
                            datetime: moment(a.datetime).fromNow(),
                            module: a.module,
                            event_type: a.event_type,
                            type: a.type
                        })
                    })                    
                })
            }
        }		
        
    },
    template: `
    <div class="m-grid__item m-grid__item--fluid m-wrapper">

        <!-- BEGIN: Subheader -->
        <div class="m-subheader ">
            <div class="d-flex align-items-center">
                <div class="mr-auto">
                    <h3 class="m-subheader__title ">Dashboard</h3>
                </div>
                <div>
                    <!-- <span class="m-subheader__daterange" id="m_dashboard_daterangepicker">
                        <span class="m-subheader__daterange-label">
                            <span class="m-subheader__daterange-title"></span>
                            <span class="m-subheader__daterange-date m--font-brand"></span>
                        </span>
                        <a href="#" class="btn btn-sm btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--square">
                            <i class="la la-angle-down"></i>
                        </a>
                    </span> -->
                </div>
            </div>
        </div>

        <!-- END: Subheader -->
        <div class="m-content">

            <!--begin:: Widgets/Stats-->
           <!-- <div class="m-portlet  m-portlet--unair">
                <div class="m-portlet__body  m-portlet__body--no-padding">
                    <div class="row m-row--no-padding m-row--col-separator-xl">
                        <div class="col-md-12 col-lg-6 col-xl-3">
                            <div class="m-widget24">
                                <div class="m-widget24__item">
                                    <h4 class="m-widget24__title">
                                        Total Issued
                                    </h4><br>
                                    <span class="m-widget24__desc">
                                        loyalty points Issued
                                    </span>
                                    <span class="m-widget24__stats m--font-brand">
                                        {{total_issued}}
                                    </span>
                                    <div class="m--space-10"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-6 col-xl-3">
                        <div class="m-widget24">
                            <div class="m-widget24__item">
                                <h4 class="m-widget24__title">
                                    Coupons
                                </h4><br>
                                <span class="m-widget24__desc">
                                    
                                </span>
                                <span class="m-widget24__stats m--font-brand">
                                    {{total_coupons}}
                                </span>
                                <div class="m--space-10"></div>                                   
                            </div>
                        </div>
                            
                        </div>
                        <div class="col-md-12 col-lg-6 col-xl-3">
                            <div class="m-widget24">
                                <div class="m-widget24__item">
                                    <h4 class="m-widget24__title">
                                    Total Redeemed Coupon
                                    </h4><br>
                                    <span class="m-widget24__desc">
                                        Redeemed Coupon
                                    </span>
                                    <span class="m-widget24__stats m--font-brand">
                                        {{total_redeemed}}
                                    </span>
                                    <div class="m--space-10"></div>                                   
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-6 col-xl-3">
                            <div class="m-widget24">
                                <div class="m-widget24__item">
                                    <h4 class="m-widget24__title">
                                        Customers
                                    </h4><br>
                                    <span class="m-widget24__desc">
                                        Total Customers
                                    </span>
                                    <span class="m-widget24__stats m--font-brand">
                                        {{total_customers}}
                                    </span>
                                    <div class="m--space-10"></div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

            <!--end:: Widgets/Stats-->

            
            <!--Begin::Section-->
            <div class="row">
                <div class="col-xl-6">
                    <div class="row m-row--full-height">
                        <div class="col-sm-12 col-md-12 col-lg-6">
                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-brand ">
                                <div class="m-portlet__body">
                                    <div class="m-widget26">
                                        <div class="m-widget26__number">
                                            {{total_issued}}
                                            <small>loyalty issued</small>
                                        </div>
                                        <div class="m-widget26__chart" style="height:90px; width: 220px;text-align: center;color: #716aca;">
                                            <i class="flaticon-coins" style="font-size:56px"></i>
                                            <!-- <canvas id="m_chart_quick_stats_1"></canvas> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m--space-30"></div>
                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-success">
                                <div class="m-portlet__body">
                                    <div class="m-widget26">
                                        <div class="m-widget26__number">
                                            {{total_coupons}}
                                            <small>Total Coupons</small>
                                        </div>
                                        <div class="m-widget26__chart" style="height:90px; width: 220px;text-align: center;color: #34bfa3;">
                                            <i class="flaticon-gift" style="font-size:56px"></i>                                            
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12 col-lg-6">
                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-danger">
                            <div class="m-portlet__body">
                                    <div class="m-widget26">
                                        <div class="m-widget26__number">
                                            {{total_redeemed}}
                                            <small>Rewards processed</small>
                                        </div>
                                        <div class="m-widget26__chart" style="height:90px; width: 220px;text-align: center;color: #f4516c;">
                                            <i class="flaticon-paper-plane" style="font-size:56px"></i>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m--space-30"></div>
                            <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-accent">
                                <div class="m-portlet__body">
                                    <div class="m-widget26">
                                        <div class="m-widget26__number">
                                            {{total_customers}}
                                            <small>Total Customers</small>
                                        </div>
                                        <div class="m-widget26__chart" style="height:90px; width: 220px;text-align: center;color: #00c5dc;">
                                            <i class="flaticon-customer" style="font-size:56px"></i>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">

                    <!--begin:: Widgets/Audit Log-->
                    <div class="m-portlet m-portlet--full-height  m-portlet--unair">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-caption">
                                <div class="m-portlet__head-title">
                                    <h3 class="m-portlet__head-text">
                                        Activity Log
                                    </h3>
                                </div>
                            </div>
                            <div class="m-portlet__head-tools">
                                <ul class="nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm" role="tablist">
                                    <li class="nav-item m-tabs__item">
                                        <a class="nav-link m-tabs__link active" data-toggle="tab" href="#m_widget4_tab1_content" role="tab">
                                            Recent
                                        </a>
                                    </li>                                   
                                </ul>
                            </div>
                        </div>
                        <div class="m-portlet__body">
                            <div class="tab-content">
                                <div class="tab-pane active" id="m_widget4_tab1_content">
                                    <div class="m-scrollable" data-scrollable="true" data-height="400" style="height: 400px; overflow: hidden;">
                                        <div class="m-list-timeline m-list-timeline--skin-light">
                                            <div class="m-list-timeline__items" >
                                                <div class="m-list-timeline__item" v-if="auditLogs.length == 0">
                                                    Not yet created logs
                                                </div>
                                                <div class="m-list-timeline__item" v-for="(audit, i) in auditLogs" id="infinite-list">
                                                    <span class="m-list-timeline__badge" :class="{'m-list-timeline__badge--success': i % 2 === 0, 'm-list-timeline__badge--info': i % 2 !== 0 }"></span>
                                                    <span class="m-list-timeline__text">{{audit.event_type}}</span>
                                                    <span class="m-list-timeline__time">{{audit.datetime}}</span>
                                                </div>                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    </div>

                    <!--end:: Widgets/Audit Log-->
                </div>
            </div>
            <div class="row">
                <div class="col-xl-12">        
                <!--begin::Modal-->
                <div class="modal fade" id="m_modal_plan" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Basic Setup</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>                            
                            <div class="modal-body" style="padding:0">                                   
                                <!--begin: Form Wizard-->
                                <div class="m-wizard m-wizard--2 m-wizard--success" id="m_wizard">
                                    <!--begin: Message container -->
                                    <div class="m-portlet__padding-x">
                                        <!-- Here you can put a message or alert -->
                                    </div>
                                    <!--end: Message container -->
                                    <!--begin: Form Wizard Head -->
                                    <div class="m-wizard__head m-portlet__padding-x" style="margin: 3rem 0 0 0;">
                                        <!--begin: Form Wizard Progress -->         
                                        <div class="m-wizard__progress">
                                            <div class="progress">
                                                <div class="progress-bar" role="progressbar"  aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                        <!--end: Form Wizard Progress -->  
                                        <!--begin: Form Wizard Nav -->
                                        <div class="m-wizard__nav">
                                            <div class="m-wizard__steps">
                                                <div class="m-wizard__step m-wizard__step--current"  m-wizard-target="m_wizard_form_step_1">
                                                    <div  class="m-wizard__step-number">
                                                        <span><i class="fa  flaticon-coins"></i></span> 
                                                    </div>
                                                    <div class="m-wizard__step-info">
                                                        <div class="m-wizard__step-title">
                                                            1. Token Setup
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="m-wizard__step" m-wizard-target="m_wizard_form_step_2">
                                                    <div class="m-wizard__step-number">
                                                        <span><i class="fa flaticon-paper-plane"></i></span> 
                                                    </div>
                                                    <div class="m-wizard__step-info">
                                                        <div class="m-wizard__step-title">
                                                            2. Direct Points Issue Setup
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="m-wizard__step" m-wizard-target="m_wizard_form_step_3">
                                                    <div class="m-wizard__step-number">
                                                        <span><i class="fa  flaticon-interface-11"></i></span> 
                                                    </div>
                                                    <div class="m-wizard__step-info">
                                                        <div class="m-wizard__step-title">
                                                            3. Receipt Based Issue Setup
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="m-wizard__step" m-wizard-target="m_wizard_form_step_4">
                                                    <div class="m-wizard__step-number">
                                                        <span><i class="fa  flaticon-interface-11"></i></span> 
                                                    </div>
                                                    <div class="m-wizard__step-info">
                                                        <div class="m-wizard__step-title">
                                                            4. Profile Setup
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--end: Form Wizard Nav -->
                                    </div>
                                    <!--end: Form Wizard Head -->  
                                    <!--begin: Form Wizard Form-->
                                    <div class="m-wizard__form">
                                        <!--
                                            1) Use m-form--label-align-left class to alight the form input lables to the right
                                            2) Use m-form--state class to highlight input control borders on form validation
                                            -->
                                        <form class="m-form m-form--label-align-left- m-form--state-" id="m_form">
                                            <!--begin: Form Body -->
                                            <div class="m-portlet__body">
                                                <!--begin: Form Wizard Step 1-->
                                                <div class="m-wizard__form-step m-wizard__form-step--current" id="m_wizard_form_step_1">
                                                    <div class="row">
                                                        <div class="col-xl-8 offset-xl-2">
                                                            <div class="m-form__section m-form__section--first">
                                                                <div class="m-form__heading">
                                                                    <h3 class="m-form__heading-title">Token Setup Details</h3>
                                                                </div>
                                                            </div>                                
                                                                <div class="form-group m-form__group row">
                                                                    <label for="example-text-input" class="col-xl-3 col-lg-3 col-form-label">Token Name </label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input v-model="brand.token_name" name="token_name" id="token_name" class="form-control m-input" type="text" value="">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Code </label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input class="form-control m-input txtOnly" type="text" name="symbol" id="symbol" :maxlength="5" :minlength="3" value="" v-model="brand.symbol" v-on:input="brand.symbol = $event.target.value.toUpperCase()">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Description</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input class="form-control m-input" type="text" value="" v-model="brand.brand_desc" >
                                                                    </div>
                                                                </div>                           
                                                                <div class="form-group m-form__group row">
                                                                    <label for="example-text-input" class="col-form-label col-lg-3 col-sm-12">Token Logo</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input class="form-control m-input" type="file" v-on:change="uploadBrandImage($event)">
                                                                    </div>
                                                                    <div class="offset-3 col-xl-9 col-lg-9">
                                                                        <div class="m-portlet ">
                                                                            <div class="m-portlet__body">
                                                                                <div class="m-card-profile">
                                                                                    <div class="m-card-profile__pic">
                                                                                        <div class="m-card-profile__pic-wrapper">	
                                                                                            <img :src="brandimg" alt=""/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>					
                                                                            </div>			
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end: Form Wizard Step 1-->
                                                <!--begin: Form Wizard Step 2-->
                                                <div class="m-wizard__form-step" id="m_wizard_form_step_2">
                                                    <div class="row">
                                                        <div class="col-xl-8 offset-xl-2">
                                                            <div class="m-form__section m-form__section--first">
                                                                <div class="m-form__heading">
                                                                    <h3 class="m-form__heading-title">Issue Manual Setup</h3>
                                                                </div>
                                                                <div  class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                       
                                                                        <input v-model="program.program_name" type="text" name="name"  id="program_name" class="form-control m-input" placeholder="" value="">
                                                                        <span class="m-form__help">Please Enter Program's Name</span>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Description</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                          
                                                                        <textarea v-model="program.program_description" type="text" name="description" id="program_description" class="form-control m-input" placeholder="" value=""></textarea>
                                                                        <span class="m-form__help">Please Enter Program's Descriptions</span>
                                                                        
                                                                    </div>
                                                                </div>                                                
                                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Issue Type:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="m-radio-inline">
                                                                            <label class="m-radio">
                                                                            <input v-model="program.program_type" value="N" type="radio"> Fixed Loyalty
                                                                            <span></span>
                                                                            </label> 
                                                                            <label class="m-radio">
                                                                            <input v-model="program.program_type" value="P" type="radio"> Percentage of Receipt Amount
                                                                            <span></span>
                                                                            </label>
                                                                        </div>
                                                                        <span class="m-form__help">Please select program's type</span>
                                                                    </div>
                                                                </div>                                            
                                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* {{(program.program_type === 'P')? 'Percentage of Loyalty By Tiers':'Fixed Loyalty By Tiers'}}:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="m-checkbox-inline" v-for="(tier, i) in tierList">
                                                                            <label class="m-checkbox">
                                                                                <input v-on:change="changeOptions(tier.tier_id, i)" :disabled="tier.disabled" :checked="tier.checked" type="checkbox"> {{tier.tier_name}}
                                                                                <span></span>                                                                
                                                                            </label>
                                                                            <br />                                                            
                                                                            <input v-model="program.tiers[tier.tier_id]" v-on:keypress="isNumber($event)"  v-on:change="changeTierLoyalty($event,tier.tier_id)" type="text" name="expiry" class="form-control m-input" placeholder="">
                                                                        </div>                                                       
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row" v-if="program.program_type === 'P'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Maximum Loyalty Limit</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                           
                                                                        <input v-model="program.program_ceiling" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" type="text" name="ceiling" id="program_ceiling" class="form-control m-input" placeholder="" value="">
                                                                        <span class="m-form__help">Please Enter Program's Maximum Loyalty Limit</span>                                                        
                                                                    </div>
                                                                </div>                                                 
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <select class="form-control m-input m_select2" v-model="program.program_expiry_type" id="m_select2_1" name="param">
                                                                            <option value="0">No Expiry</option>
                                                                            <option value="1">Expiry in Days</option>
                                                                            <option value="2">Expiry in Weeks</option>
                                                                            <option value="3">Expiry in Months</option>
                                                                        </select> 
                                                                        <span class="m-form__help">Please select Program's Expiry Type</span>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row" v-if="showExpiry">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term Value</label>                                                   
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="input-group">
                                                                            <input v-model="program.program_expiry" type="text" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="program_expiry" id="program_expiry" class="form-control m-input" placeholder="" value="">
                                                                            <div class="input-group-append"><span class="input-group-text" id="basic-addon2">{{(program.program_expiry_type == 1)? 'Days' :(program.program_expiry_type == 2)? 'Weeks': 'Months'}}</span></div>
                                                                        </div>                                                                                                                  
                                                                        <span class="m-form__help">Please Enter Loyalty Expiry Term Value</span>                                                        
                                                                    </div>
                                                                </div> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end: Form Wizard Step 2--> 
                                                <!--begin: Form Wizard Step 2-->
                                                <div class="m-wizard__form-step" id="m_wizard_form_step_3">
                                                    <div class="row">
                                                        <div class="col-xl-8 offset-xl-2">
                                                            <div class="m-form__section m-form__section--first">
                                                                <div class="m-form__heading">
                                                                    <h3 class="m-form__heading-title">Issue Receipt Setup</h3>
                                                                </div>
                                                                <div  class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Name:</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                       
                                                                        <input v-model="program.program_name" type="text" name="name"  id="program_name" class="form-control m-input" placeholder="" value="">
                                                                        <span class="m-form__help">Please Enter Program's Name</span>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Description</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                          
                                                                        <textarea v-model="program.program_description" type="text" name="description" id="program_description" class="form-control m-input" placeholder="" value=""></textarea>
                                                                        <span class="m-form__help">Please Enter Program's Descriptions</span>
                                                                        
                                                                    </div>
                                                                </div>                                                
                                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Issue Type:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="m-radio-inline">
                                                                            <label class="m-radio">
                                                                            <input v-model="program.program_type" value="N" type="radio"> Fixed Loyalty
                                                                            <span></span>
                                                                            </label> 
                                                                            <label class="m-radio">
                                                                            <input v-model="program.program_type" value="P" type="radio"> Percentage of Receipt Amount
                                                                            <span></span>
                                                                            </label>
                                                                        </div>
                                                                        <span class="m-form__help">Please select program's type</span>
                                                                    </div>
                                                                </div>                                            
                                                                <div class="form-group m-form__group row" v-if="programid === 'RECEIPT'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* {{(program.program_type === 'P')? 'Percentage of Loyalty By Tiers':'Fixed Loyalty By Tiers'}}:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="m-checkbox-inline" v-for="(tier, i) in tierList">
                                                                            <label class="m-checkbox">
                                                                                <input v-on:change="changeOptions(tier.tier_id, i)" :disabled="tier.disabled" :checked="tier.checked" type="checkbox"> {{tier.tier_name}}
                                                                                <span></span>                                                                
                                                                            </label>
                                                                            <br />                                                            
                                                                            <input v-model="program.tiers[tier.tier_id]" v-on:keypress="isNumber($event)"  v-on:change="changeTierLoyalty($event,tier.tier_id)" type="text" name="expiry" class="form-control m-input" placeholder="">
                                                                        </div>                                                       
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row" v-if="program.program_type === 'P'">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Maximum Loyalty Limit</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                           
                                                                        <input v-model="program.program_ceiling" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" type="text" name="ceiling" id="program_ceiling" class="form-control m-input" placeholder="" value="">
                                                                        <span class="m-form__help">Please Enter Program's Maximum Loyalty Limit</span>                                                        
                                                                    </div>
                                                                </div>                                                 
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term:</label>
                                                                    <div class="col-xl-9 col-lg-9">                                                                        
                                                                    <select class="form-control m-input m_select2" v-model="program.program_expiry_type" id="m_select2_1" name="param">
                                                                            <option value="0">No Expiry</option>
                                                                            <option value="1">Expiry in Days</option>
                                                                            <option value="2">Expiry in Weeks</option>
                                                                            <option value="3">Expiry in Months</option>
                                                                        </select> 
                                                                        <span class="m-form__help">Please select Program's Expiry Type</span>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row" v-if="showExpiry">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">* Loyalty Expiry Term Value</label>                                                   
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <div class="input-group">
                                                                            <input v-model="program.program_expiry" type="text" onkeypress="return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57" name="program_expiry" id="program_expiry" class="form-control m-input" placeholder="" value="">
                                                                            <div class="input-group-append"><span class="input-group-text" id="basic-addon2">{{(program.program_expiry_type == 1)? 'Days' :(program.program_expiry_type == 2)? 'Weeks': 'Months'}}</span></div>
                                                                        </div>                                                                                                                  
                                                                        <span class="m-form__help">Please Enter Loyalty Expiry Term Value</span>                                                        
                                                                    </div>
                                                                </div>                                                            
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--end: Form Wizard Step 2--> 
                                                <!--begin: Form Wizard Step 3-->
                                                <div class="m-wizard__form-step" id="m_wizard_form_step_4">
                                                    <div class="row">
                                                        <div class="col-xl-8 offset-xl-2">                                                 
                                                            <div class="m-portlet__body">
                                                                <div class="form-group m-form__group m--margin-top-10 m--hide">
                                                                    <div class="alert m-alert m-alert--default" role="alert">
                                                                        The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <div class="col-10">
                                                                        <h3 class="m-form__section">1. Business Details</h3>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Business Name:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <input type="text" :maxlength="30" v-model="business_name" name="business_name" class="form-control m-input">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Business Industry Type:</label>
                                                                    <div class="col-xl-9 col-lg-9">                
                                                                        <select v-model="business_type" class="form-control m-input" id="m_select2_1" name="business_type">
                                                                            <option v-for="industry in industryList" :value="industry.lookup_name">{{industry.lookup_name}}</option>
                                                                        </select>	
                                                                        <!-- <input type="text" v-model="business_type" name="business_type" class="form-control m-input"> -->
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Business Earning Mechanics:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <input type="text" v-model="earning_mechanics" name="earning_mechanics" class="form-control m-input">
                                                                    <span class="m-form__help">Points earnings methods for customer's</span>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Business Description:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <textarea type="text" :maxlength="256" v-model="business_desc" name="business_desc" class="form-control m-input"></textarea>
                                                                    </div>
                                                                </div>
                                                    
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Business Time Zone:</label>
                                                                    <div class="col-xl-9 col-lg-9">					               
                                                                        <select v-model="time_zone" ref="timezone" class="form-control m-input" id="" name="time_zone">
                                                                            <option v-for="time in timeZoneList" :value="time.lookup_display_name">{{time.lookup_name}}</option>                                                                    
                                                                        </select>	
                                                                    </div>
                                                                </div>                         
                                                                
                                                                <div class="form-group m-form__group row">
                                                                    <div class="col-10">
                                                                        <h3 class="m-form__section">2. Business Contact Details</h3>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label for="example-text-input" class="col-xl-3 col-lg-3 col-form-label">Website </label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input class="form-control m-input" type="url"  value="" name="business_url" id="business_url" v-model="business_url">
                                                                        <span class="m-form__help">Please Enter Valid URL Ex: http://example.com</span>
                                                                    </div>
                                                                </div> 			
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Email:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <input type="text" v-model="email" readonly name="email" class="form-control m-input">
                                                                    </div>
                                                                </div> 
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Contact Person:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <input type="text" v-model="contact_person" name="contact_person" class="form-control m-input">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label"> Contact Number</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                        <input type="text" v-model="contact_no" name="contact_no" class="form-control m-input"> 
                                                                        <span class="m-form__help">{{contacthelp}}</span>                    
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <div class="col-10">
                                                                        <h3 class="m-form__section">3. Business Communication Address Details</h3>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Address:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <textarea type="text" v-model="business_address" name="business_address" class="form-control m-input"></textarea>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">City:</label>
                                                                    <div class="col-xl-9 col-lg-9">
                                                                    <input type="text" v-model="city" name="city" class="form-control m-input">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group m-form__group row">
                                                                    <label class="col-xl-3 col-lg-3 col-form-label">Country:</label>
                                                                    <div class="col-xl-9 col-lg-9">                
                                                                        <select v-model="country" class="form-control m-input" id="m_select2_1" name="country">
                                                                            <option v-for="country in countryList" :value="country.lookup_name">{{country.lookup_name}}</option>
                                                                        </select>				
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>                   
                                            </div>
                                            <!--end: Form Body -->
                                            <!--begin: Form Actions -->
                                            <div class="m-portlet__foot m-portlet__foot--fit m--margin-top-40">
                                                <div class="m-form__actions">
                                                    <div class="row">
                                                        <div class="col-lg-2"></div>
                                                    <!-- <div class="col-lg-4 m--align-left">
                                                            <a href="#" class="btn btn-secondary m-btn m-btn--custom m-btn--icon" data-wizard-action="prev">
                                                            <span>
                                                            <i class="la la-arrow-left"></i>&nbsp;&nbsp;
                                                            <span>Back</span>
                                                            </span>
                                                            </a>
                                                        </div> -->
                                                        <div class="col-lg-4 m--align-right">
                                                            <a href="#" class="btn btn-primary m-btn m-btn--custom m-btn--icon" data-wizard-action="submit">
                                                            <span>
                                                            <i class="la la-check"></i>&nbsp;&nbsp;
                                                            <span>Finish</span>
                                                            </span>
                                                            </a>
                                                            <a href="#" class="btn btn-warning m-btn m-btn--custom m-btn--icon" data-wizard-action="next">
                                                            <span>
                                                            <span>Save & Continue</span>&nbsp;&nbsp;
                                                            <i class="la la-arrow-right"></i>
                                                            </span>
                                                            </a>
                                                        </div>
                                                        <div class="col-lg-2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--end: Form Actions -->
                                        </form>
                                    </div>
                                    <!--end: Form Wizard Form-->
                                </div>
                                <!--end: Form Wizard-->
                            </div>
                        </div>
                    </div>
                <!--end::Modal-->
                </div>
            </div>
            <!--End::Section-->
        </div>
        </div>
    </div>
    `,
    mounted: function() {
        vm = this;
        var formEl = $('#m_form');
        var btn = formEl.find('[data-wizard-action="submit"]');
        validator = formEl.validate({
            //== Validate only visible fields
            ignore: ":hidden",

            //== Validation rules
            rules: {
                //=== Client Information(step 1)
                //== Client details
                token_name: {
                    required: true 
                },
                symbol: {
                    required: true
                },
                program_name: {
                    required: true,
                },
                program_expiry_type: {
                    required: true,
                },
                time_zone: {
                    required: true,
                },
                country: {
                    required: true,
                },
                status: {
                    required: true,
                }
            }
        })

        wizard = new mWizard('m_wizard', {
            startStep: 1,
        });
                

        //== Validation before going to next page
        wizard.on('beforeNext', function(wizardObj) {
            console.log(wizardObj)           
            if (validator.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            }
        })

        //== Change event
        wizard.on('change', function(wizard) {
            mUtil.scrollTop();            
        });

        //== Change event
        wizard.on('change', function(wizard) {
            console.log("Steps ", wizard.getStep())
            if (wizard.getStep() === 2) {
                vm.submitForm();
                setTimeout(() => {
                    vm.programid = 'POINTS';
                    vm.getProgram("POINTS");
                }, 1000);
            }
            else if (wizard.getStep() === 3) { 
                vm.getProgram("POINTS");               
                vm.submitProgramForm();
                setTimeout(() => {
                    vm.programid = 'RECEIPT';
                    vm.getProgram("RECEIPT");
                }, 1000);
            }
            else if (wizard.getStep() === 4) {                
                vm.submitProgramForm();
                setTimeout(() => {
                    vm.getUtils(); 
                }, 1000);
                              
            }
                 
        });
        $('.txtOnly').keypress(function (e) {
			var regex = new RegExp("^[a-zA-Z]+$");
			var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
			if (regex.test(str)) {
				return true;
			}
			else
			{
			e.preventDefault();
			$('.error').show();
			$('.error').text('Please Enter Alphabate');
			return false;
			}
		});

        btn.on('click', function(e) {
            e.preventDefault();

            if (validator.form()) {
                vm.updateProfile();
            }
        });        
        $('#timezone').select2({
            placeholder: "Select Timezone",
            searchInputPlaceholder: 'My custom placeholder...',
            data: vm.timeZoneList
        });
       
        let urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        if(token !== null) {
            axios.get('/loyalty/merchant/profile/details/' +token)
            .then((response) => {
                sessionStorage.setItem("merchant_id", response.data.merchant_nutick_account);
                sessionStorage.setItem("staff_type",'merchant');
                axios.get('/loyalty/audit/log/list?page=1')
                .then(response => {
                    vm.auditLogs = [];
                    var pages = response.data.pagination.total_pages;
                    console.log("vm.auditLogs ", pages);
                    vm.getActivityLog(pages);
                    
                })

                vm.getToken();
            })
            .catch((error) => {
                if(error.response.status == 403) {
                    window.location.replace('/login');
                }
				console.log("Error ", error.response);
            })
        }
        else {
            axios.get('/loyalty/audit/log/list?page=1')
            .then(response => {
                vm.auditLogs = [];
                var pages = response.data.pagination.total_pages;
                console.log("vm.auditLogs ", pages);
                vm.getActivityLog(pages);
                
            })

            vm.getToken();
        }
        
        
    }
})

new Vue({
    el: '#dashboard-page',
    data: {
        message: '',
        logintitle: 'JOIN OUR GREAT METRO COMMUNITY GET FREE ACCOUNT',
        errors: [],
        postBody: ''
    },
    mounted:function(){
        // this.getToken();
        
    
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
		
    }
})