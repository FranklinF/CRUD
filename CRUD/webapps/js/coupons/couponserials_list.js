Vue.component('couponserials-table-header-component', {
    props: ['coupon_name', 'coupon_des'],
    template: `
    <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
            <div class="m-portlet__head-title">            
                <div class="m-widget14" style="padding:0">
                    <div class="m-widget14__header">
                        <h3 class="m-widget14__title">
                            Coupon:&nbsp; <span style="text-transform:uppercase;">{{coupon_name}}</span>
                        </h3>
                        <span class="m-widget14__desc" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 600px;">
                            {{coupon_des}}
                        </span>
                    </div>
                </div>
                <h3 class="m-portlet__head-text">                                         
                </h3>                
            </div> 
        </div>
        <div class="m--align-right" style="margin: 15px 0px 0px 0px;">
            <a href="/coupons" class="btn btn-secondary m-btn m-btn--icon m-btn--wide m-btn--md m--margin-right-10">
                <span>
                    <i class="la la-arrow-left"></i>
                    <span>Back</span>
                </span>
            </a>
            <a href="#" v-on:click="$emit('newcouponserialclicked',$event)" class="btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill">
                <span>
                    <i class="flaticon-shapes"></i>
                    <span> Create Coupon Serial</span>
                </span>
            </a>
        </div>
    </div>
    `
})

Vue.component('couponserials-table-alert-component', {
    template: `
    <div class="m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30" role="alert">
        <div class="m-alert__icon">
            <i class="flaticon-exclamation m--font-brand"></i>
        </div>
        <div class="m-alert__text">
            With server-side processing enabled, all paging, searching, ordering actions that DataTables performs are handed off to a server where an SQL engine (or similar) can perform these actions on the large data set.
            See official documentation <a href="https://datatables.net/examples/data_sources/server_side.html" target="_blank">here</a>.
        </div>
    </div>
    `
})

Vue.component('couponserials-table-search-component', {
    props: ['coupon_code', 'coupon_des', 'coupon_name'],
    data: function() {
        return {
            issueCoupons: [],
            redeemCoupons: [],
            voidCoupons: [],
            createdCoupons: [],
            activeCoupons: [],
            deletedCoupons: [],
            serials: [],
            rewards: [],
            coupon_qty: ''
        }
        
    },
    watch: {
        'coupon_code': function() {
            this.getCouponSerialsActivity(this.coupon_code);
        }
    },
    methods: {
        getCouponSerialsActivity: function(code) {
            var vm  = this;
            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/serials').then(response => {                
                var data = response.data.serials;
                data.map(function(a) {
                    vm.serials.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })
            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/1/serials').then(response => {                
                var data = response.data.serials;
                data.map(function(a) {
                    vm.createdCoupons.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/2/serials').then(response => {                
                var data = response.data.serials;
                data.map(function(a) {
                    vm.activeCoupons.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/0/serials').then(response => {
                this.deletedCoupons = response.data.serials;
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/3/serials').then(response => {                
                var data = response.data.serials;
                data.map(function(a) {
                    vm.issueCoupons.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
                // this.issueCoupons = response.data.serials;
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/4/serials').then(response => {
                // this.redeemCoupons = response.data.serials;
                var data = response.data.serials;
                data.map(function(a) {
                    vm.redeemCoupons.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('/loyalty/coupons/couponserials/'+this.coupon_code +'/5/serials').then(response => {
                // this.voidCoupons = response.data.serials;
                var data = response.data.serials;
                data.map(function(a) {
                    vm.voidCoupons.push({                        
                        merchant_id: a.merchant_id,
                        updated_date: moment(a.updated_date).fromNow(),
                        coupon_code: a.coupon_code,
                        coupon_serial: a.coupon_serial,
                        serial_status: (a.serial_status == 0)? 'Deleted':(a.serial_status == 1)? 'Created':(a.serial_status == 2)? 'Activated':(a.serial_status == 3)? 'Issued' : (a.serial_status == 4)? 'Redeemed': (a.serial_status == 5)? 'Void': 'Temporary',
                        enabled: a.enabled,
                        status: a.serial_status,
                        type: a.type
                    })
                }) 
            }).catch(err => {
                if(err.response.status == 403) {
                    window.location.replace('/login');
                }
            })

            axios.get('loyalty/coupons/'+this.coupon_code+'/rewards').then(response => {
                console.log("Coupon rewards ", response.data);
                var data = response.data.rewards;
                data.map(function(r) {
                    var qty = r.coupon_codes.filter(c => c.coupon_code == vm.coupon_code);
                    vm.rewards.push({
                        merchant_id: r.merchant_id,
                        coupon_codes: r.coupon_codes,
                        coupon_qty: qty[0].coupon_qty,
                        reward_name: r.reward_name,
                        reward_title: r.reward_title,
                        reward_value: r.reward_value,
                        reward_for: r.reward_for,
                        enabled: r.enabled,
                        image_url: response.data.imageurl+r.reward_name
                    })
                })
            })  
            .catch(err => {
                console.log("Error Rewards", err);
            })
        }
    },
    template: `
    <div class="m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30">
   
    <!--Begin::Section-->
    <div class="row">
      <div class="col-xl-6">
        <div class="row">
        <div class="col-xl-12">
        <div class="m-portlet m-portlet--mobile ">
        <div class="m-portlet__head">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <h3 class="m-portlet__head-text">
                        Summary
                    </h3>
                </div>
            </div>
            <div class="m-portlet__head-tools">
                            
            </div>
        </div>
        <div class="m-portlet__body">
            <!--begin: Datatable -->
            <div class="row m-row--full-height">
                <div class="col-sm-12 col-md-12 col-lg-6">
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-info ">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{createdCoupons.length}}
                                    <small>Coupon Serials Created</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m--space-30"></div>
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-brand ">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{issueCoupons.length}}
                                    <small>Coupon Serials Issued</small>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6">
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-accent ">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{activeCoupons.length}}
                                    <small>Coupon Serials Activated</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m--space-30"></div>
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-success ">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{redeemCoupons.length}}
                                    <small>Coupon Serials Redeemed</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6">
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-metal" style="height: auto;">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{voidCoupons.length}}
                                    <small>Coupon Serials Voided</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m--space-30"></div>
                </div>
                <!-- <div class="col-sm-12 col-md-12 col-lg-6">
                    <div class="m-portlet m-portlet--half-height m-portlet--border-bottom-danger" style="height: auto;">
                        <div class="m-portlet__body">
                            <div class="m-widget26">
                                <div class="m-widget26__number">
                                    {{deletedCoupons.length}}
                                    <small>Deleted Coupon Serials</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>   
            <!--end: Datatable -->
        </div>
    </div>
    </div>
    </div>
    <div class="row">
        <div class="col-xl-12">
            <!--begin:: Widgets/Authors Profit-->
            <div class="m-portlet m-portlet--bordered-semi m-portlet--full-height ">
                <div class="m-portlet__head" style="border-bottom: 1px solid #ebedf2;">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h3 class="m-portlet__head-text">
                                <span style="text-transform: uppercase;">{{coupon_name}}</span>&nbsp; Rewards 
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="m-portlet__body">
                    <div class="m-widget4" v-if="rewards.length == 0">
                        <div class="m-widget4__info">
                            <span class="m-widget4__title">
                                No rewards for this coupon 
                            </span>	 
                        </div>
                    </div>
                    <div class="m-widget4" v-for="(reward, i) in rewards">
                        <div class="m-widget4__item">
                            <div class="m-widget4__img m-widget4__img--logo">							 
                                <img :src=reward.image_url style="height: 3.5rem;" alt="">   
                            </div>
                            <div class="m-widget4__info" style="text-overflow: ellipsis;white-space: nowrap;max-width: 1px;overflow: hidden;width: 100%;">
                                <span class="m-widget4__title" style="text-transform:capitalize;">
                                    {{reward.reward_name}}&nbsp; &nbsp;<i class="flaticon-confetti"></i>&nbsp;{{reward.reward_value}}&nbsp;Points
                                </span><br> 
                                <span class="m-widget4__sub">
                                    {{reward.reward_title}}
                                </span>		 
                            </div>
                            <span class="m-widget4__ext">                                
                                <span class="m-widget4__number m--font-brand"> Qty - {{reward.coupon_qty}}</span>
                            </span>	
                        </div>
                    </div>			 
                </div>
            </div>
            <!--end:: Widgets/Authors Profit-->
        </div>
    </div>  
    </div>
      <div class="col-xl-6">
        <!--begin:: Widgets/Audit Log-->
    <div class="m-portlet m-portlet--full-height ">
        <div class="m-portlet__head">
            <div class="m-portlet__head-caption">
                <div class="m-portlet__head-title">
                    <h3 class="m-portlet__head-text">
                        Recent Activity
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
                    <li class="nav-item m-tabs__item">
                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_widget4_tab2_content" role="tab">
                            Created
                        </a>
                    </li>
                    <li class="nav-item m-tabs__item">
                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_widget4_tab3_content" role="tab">
                            Activated
                        </a>
                    </li>
                    <li class="nav-item m-tabs__item">
                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_widget4_tab4_content" role="tab">
                            Issued
                        </a>
                    </li>
                    <li class="nav-item m-tabs__item">
                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_widget4_tab5_content" role="tab">
                            Redeemed
                        </a>
                    </li>
                    <li class="nav-item m-tabs__item">
                        <a class="nav-link m-tabs__link" data-toggle="tab" href="#m_widget4_tab6_content" role="tab">
                            Void
                        </a>
                    </li>                                   
                </ul>
            </div>
        </div>
        <div class="m-portlet__body">
            <div class="tab-content" >
                <div class="tab-pane active" id="m_widget4_tab1_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="serials.length == 0">
                                    Being to create serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in serials" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline__badge--accent': (serial.status == 2),'m-list-timeline__badge--brand': (serial.status == 3),'m-list-timeline__badge--success': (serial.status == 4), 'm-list-timeline__badge--metal': (serial.status == 5), 'm-list-timeline__badge--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="m_widget4_tab2_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="createdCoupons.length == 0">
                                    Being to Create serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in createdCoupons" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline__badge--accent': (serial.status == 2),'m-list-timeline__badge--brand': (serial.status == 3),'m-list-timeline__badge--success': (serial.status == 4), 'm-list-timeline__badge--metal': (serial.status == 5), 'm-list-timeline__badge--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>						 
                </div>
                <div class="tab-pane" id="m_widget4_tab3_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="activeCoupons.length == 0">
                                    Being to Activate serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in activeCoupons" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline__badge--accent': (serial.status == 2),'m-list-timeline__badge--brand': (serial.status == 3),'m-list-timeline__badge--success': (serial.status == 4), 'm-list-timeline__badge--metal': (serial.status == 5), 'm-list-timeline__badge--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>						 
                </div>
                <div class="tab-pane" id="m_widget4_tab4_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="issueCoupons.length == 0">
                                    Being to issue serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in issueCoupons" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline__badge--accent': (serial.status == 2),'m-list-timeline__badge--brand': (serial.status == 3),'m-list-timeline__badge--success': (serial.status == 4), 'm-list-timeline__badge--metal': (serial.status == 5), 'm-list-timeline__badge--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>						 
                </div>
                <div class="tab-pane" id="m_widget4_tab5_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="redeemCoupons.length == 0">
                                    Being to redeem serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in redeemCoupons" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline--accent': (serial.status == 2),'m-list-timeline--brand': (serial.status == 3),'m-list-timeline--success': (serial.status == 4), 'm-list-timeline--metal': (serial.status == 5), 'm-list-timeline--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="m_widget4_tab6_content">
                    <div class="m-scrollable" data-scrollable="true" data-height="400">
                        <div class="m-list-timeline m-list-timeline--skin-light">
                            <div class="m-list-timeline__items" >
                                <div class="m-list-timeline__item" v-if="voidCoupons.length == 0">
                                    Being to void serials
                                </div>
                                <div class="m-list-timeline__item" v-for="(serial, i) in voidCoupons" id="infinite-list">
                                    <span class="m-list-timeline__badge" :class="{ 'm-list-timeline__badge--info': (serial.status == 1), 'm-list-timeline__badge--accent': (serial.status == 2),'m-list-timeline__badge--brand': (serial.status == 3),'m-list-timeline__badge--success': (serial.status == 4), 'm-list-timeline__badge--metal': (serial.status == 5), 'm-list-timeline__badge--danger': (serial.status == 0)}" ></span>
                                    <span class="m-list-timeline__text">{{serial.coupon_serial}}&nbsp;&nbsp;<span :class="{ 'm-badge--info': (serial.status == 1), 'm-badge--accent': (serial.status == 2),'m-badge--brand': (serial.status == 3),'m-badge--success': (serial.status == 4), 'm-badge--metal': (serial.status == 5), 'm-badge--danger': (serial.status == 0)}" class="m-badge  m-badge--wide">{{serial.serial_status}}</span></span>
                                    <span class="m-list-timeline__time">{{serial.updated_date}}</span>
                                </div>                                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--end:: Widgets/Audit Log-->  </div>
    </div>
    <!--End::Section-->   
        <div class="row align-items-center">
            <div class="col-xl-8 order-2 order-xl-1">
                <div class="form-group m-form__group row align-items-center">
                    <!-- <div class="col-md-4">
                        <div class="m-form__group m-form__group--inline">
                            <div class="m-form__label">
                                <label>Status:</label>
                            </div>
                            <div class="m-form__control">
                                <select v-on:change="$emit('onstatuschanged',$event)" class="form-control m-bootstrap-select" id="m_form_status">
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="2">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-md-none m--margin-bottom-10"></div>
                    </div> -->
                    <div class="col-md-6">
                        <div class="m-input-icon m-input-icon--left">
                            <input type="text" class="form-control m-input" placeholder="Search..." id="generalSearch">
                            <span class="m-input-icon__icon m-input-icon__icon--left">
                                <span><i class="la la-search"></i></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-4 order-1 order-xl-2 m--align-right">
                
                <div class="m-separator m-separator--dashed d-xl-none"></div>
            </div>
        </div>
    </div>
    `
})

Vue.component('couponserials-list-component', {
    props: ['coupon_code'],
    data: function() {
        return {
            subheader:{
                title: 'couponserials',
                items :[
                    {id:1, link:'/loyalty/couponserials', icon:'la la-home', name:'' },
                    {id:2, link:'#', icon:'', name:'couponserial List' }                ]
            },
            coupon_name: '',
            coupon_des: '',
            message: 'Coupon Serial',
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message, this.coupon_code)
        
    },
    watch:{
        'coupon_code': function() {
            axios.get('loyalty/coupons/'+ this.coupon_code).then(response => {
                var data = response.data;
                console.log("Response coupon ", data);
                this.coupon_name = data.coupon_name;
                this.coupon_des =  data.coupon_code_desc;
            }).catch(err => {
                console.log("Error ", err.response.data);
            })            
        }
    },
    template: `
    <div class="m-grid__item m-content-couponserial-list" id="m-couponserial-list" >
        <div class="m-content">
            <div class="m-portlet m-portlet--mobile">
                <couponserials-table-header-component 
                @newcouponserialclicked="$emit('newcouponserialclicked',$event)" :coupon_name="coupon_name" :coupon_des="coupon_des" ></couponserials-table-header-component>
                <div class="m-portlet__body">
                    <!--begin: Search Form -->
                    <couponserials-table-search-component :coupon_code="coupon_code" :coupon_des="coupon_des" :coupon_name="coupon_name"
                        v-on:newcouponserialclicked="$emit('newcouponserialclicked',$event)"
                        v-on:onstatuschanged="$emit('onstatuschanged',$event)"
                        v-on:oncouponserialchanged="$emit('oncouponserialchanged',$event)"
                    ></couponserials-table-search-component>
                    <!--end: Search Form -->
                    <!--begin: Datatable -->
                    <div class="m_datatable_couponserial" id="couponserial_data"></div>
                    <!--end: Datatable --> 
                </div>
            </div>
        </div>
    </div>
    `
})