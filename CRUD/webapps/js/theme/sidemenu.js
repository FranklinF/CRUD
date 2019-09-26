
Vue.component('menu-component', {
    props: ['menu', 'activemenu'],
    template:`
    <li  v-if="menu.level" class="m-menu__item  m-menu__item--submenu" aria-haspopup="true" m-menu-submenu-toggle="hover">        
        <a href="javascript:;" class="m-menu__link m-menu__toggle">
            <i class="m-menu__link-icon" :class="menu.icon" ></i>
            <span class="m-menu__link-text">{{menu.title}}</span>
            <span class="selected"></span>
            <i class="m-menu__ver-arrow la la-angle-right"></i>
        </a>
        <div class="m-menu__submenu "><span class="m-menu__arrow"></span>
            <ul class="m-menu__subnav">
                <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true">
                    <span class="m-menu__link">
                        <span class="m-menu__link-text">{{menu.title}}</span>
                        <span class="selected"></span>
                    </span>
                </li>
                <template v-for="submenu in menu.submenus">
                    <li  v-if="submenu.sublevel" class="m-menu__item  m-menu__item--submenu" aria-haspopup="true" m-menu-submenu-toggle="hover">
                        <a href="javascript:;" class="m-menu__link m-menu__toggle">
                            <i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i>
                            <span class="m-menu__link-text">{{submenu.title}}</span>
                            <span class="selected"></span>
                            <i class="m-menu__ver-arrow la la-angle-right"></i>
                        </a>
                        <div class="m-menu__submenu "><span class="m-menu__arrow"></span>
                            <ul class="m-menu__subnav">
                                <li  v-for="levelmenu in submenu.levelmenus" class="m-menu__item " aria-haspopup="true">
                                    <a v-bind:href="levelmenu.link" class="m-menu__link ">
                                        <i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i>
                                        <span class="m-menu__link-text">{{levelmenu.title}}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li  v-else class="m-menu__item " aria-haspopup="true">
                        <a v-bind:href="submenu.link" class="m-menu__link ">
                            <i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i>
                            <span class="m-menu__link-text">{{submenu.title}}</span>
                        </a>
                    </li> 
                </template>
            </ul>
        </div>
    </li>
    <li v-else class="m-menu__item m-menu__item--submenu" :class="{'m-menu__item--active': menu.name === activemenu}"  aria-haspopup="true" m-menu-submenu-toggle="hover">
        <a :href="menu.link" class="m-menu__link m-menu__toggle">
            <span class="m-menu__item-here"></span>
            <i class="m-menu__link-icon" :class="menu.icon"></i>
            <span class="m-menu__link-text">{{menu.title}}</span>
            <span class="selected"></span>

        </a>
    </li>
    `
})



Vue.component('side-menu-component', {
    props: ['activemenu'],
    created: function () {

		this.getProfile();
    },       
    methods: {
        getProfile: function() {
            var vm = this;
            let urlParams = new URLSearchParams(window.location.search);
            let token = urlParams.get('token');
            if(token == null) {
                axios.get('/loyalty/merchant/profile/details')
                    .then((response) => {
                    
                        vm.listplans = {
                            free_plan:'Free Plan',
                            monthly_plan:'Monthly Plan',
                            yearly_plan:'Yearly Plan',
                        };

                        vm.profiledata= response.data;
                        vm.price_plan =vm.listplans[response.data.price_plan];
                        
                    // console.log("plans neww ", vm.price_plan );  
                        vm.planmenu ={
                            name: 'plans',
                            title: vm.price_plan, 
                            icon: 'flaticon-list', 
                            level: false,
                            link: '/accounts'
                        };   
                    })
                    .catch((error) => {
                        if(error.response.status == 403) {
                            window.location.replace('/login');
                        }
                        //console.log("Error ", error.response);
                    })
            }
            else {
                axios.get('/loyalty/merchant/profile/details/'+ token)
                .then((response) => {
                    vm.listplans = {
                        free_plan:'Free Plan',
                        monthly_plan:'Monthly Plan',
                        yearly_plan:'Yearly Plan',
                    };

                    vm.profiledata= response.data;
                    vm.price_plan =vm.listplans[response.data.price_plan];
                    
                // console.log("plans neww ", vm.price_plan );  
                    vm.planmenu ={
                        name: 'plans',
                        title: vm.price_plan, 
                        icon: 'flaticon-list', 
                        level: false,
                        link: '/accounts'
                    }; 
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                })
            }
            
           
        }
    },       
    data:function (){
        return {
            price_plan:'',
            listplans:'',
            dashboardmenu:{
                name: 'dashboard',
                title: 'Dashboard',
                icon: 'flaticon-dashboard',
                level: false,
                link: '/dashboard'
            },
            // loyaltymenu:{
            //     name: 'loyalty',
            //     title: 'Loyalty Transaction',
            //     icon: 'flaticon-gift',
            //     level:true,
            //     submenus:[
            //         {id: 1, link: '/issueloyalty', title:'Issue Loyalty'},
            //         {id: 2, link: '/redeemrequest', title:'Redeem Loyalty'}
            //     ]
            // },
            loyaltyissuemenu: {
                name: 'issueloyalty',
                title: 'Issue Loyalty', 
                icon: 'flaticon-coins', 
                level: false,
                link: '/issueloyalty'
            },
            loyaltyredeemmenu: {
                name: 'redeemloyalty',
                title: 'Redeem Loyalty', 
                icon: 'flaticon-paper-plane', 
                level: false,
                link: '/redeemrequest'
            },
            loyaltyprogramsmenu: {
                name: 'programs',
                title: 'Programs', 
                icon: 'flaticon-layers', 
                level: false,
                link: '/programs'
            },
            customersmenu: {
                name: 'customers',
                title: 'Customers', 
                icon: 'flaticon-customer', 
                active: ' m-menu__item--active',
                level: false,
                link: '/customers'
            },
            tiersmenu: {
                name: 'tiers',
                title: 'Customer Tiers', 
                icon: 'flaticon-map', 
                level: false,
                link: '/tiers'
            },
           
            staffmenu: {
                name: 'staffs',
                title: 'Staffs', 
                icon: 'flaticon-network', 
                level: false,
                link: '/staffs'
            },
            planmenu: {
                name: 'plans',
                title: 'plans', 
                icon: 'flaticon-list', 
                level: false,
                link: '/accounts'
            },            
            outletmenu: {
                name: 'outlets',
                title: 'Outlets', 
                icon: 'flaticon-map-location', 
                level: false,
                link: '/outlets'
            },
            accountmenu: {
                name: 'accounts',
                title: 'Account', 
                icon: 'flaticon-piggy-bank', 
                level: false,
                link: '/accounts'
            },
            rewardmenu: {
                name: 'rewards',
                title: 'Rewards', 
                icon: 'flaticon-confetti', 
                level: false,
                link: '/rewards'
            },           
            couponmenu: {
                name: 'coupons',
                title: 'Coupons', 
                icon: 'flaticon-gift', 
                level: false,
                link: '/coupons'
            },
            couponserialmenu: {
                name: 'couponserials',
                title: 'Coupon Serials', 
                icon: 'flaticon-shapes', 
                level: false,
                link: '/couponserials'
            },
            issuecouponmenu: {
                name: 'issuecoupons',
                title: 'Issue Coupon', 
                icon: 'flaticon-rocket', 
                level: false,
                link: '/issuecoupon'
            },
            redeemcouponmenu: {
                name: 'redeemcoupons',
                title: 'Redeem Coupon', 
                icon: 'flaticon-piggy-bank', 
                level: false,
                link: '/redeemcoupon'
            },
            voidcouponmenu: {
                name: 'voidcoupons',
                title: 'Void Coupon', 
                icon: 'flaticon-bag', 
                level: false,
                link: '/voidcoupon'
            },
            settingsmenu: {
                name: 'settings',
                title: 'Settings', 
                icon: 'flaticon-cogwheel', 
                level: false,
                link: '/settings'
            },
            tokensmenu: {
                name: 'tokens',
                title: 'Brand Token', 
                icon: 'flaticon-lifebuoy', 
                level: false,
                link: '/tokens'
            },
            portletmenu:{
                title: 'Portlets',
                icon: 'flaticon-interface-1',
                level:true,
                submenus:[
                    {id: 1, link: '/components/portlets/base.html', title:'Base Portlets'},
                    {id: 2, link: 'components/portlets/advanced.html', title:'Advanced Portlets'},
                    {id: 3, link: ';', title:'Tabs', 
                        sublevel:true, 
                        levelmenus:[
                            {id: 1, link: '/components/base/tabs/bootstrap.html', title:'Bootstrap Tabs'},
                            {id: 2, link: '/components/base/tabs/line.html', title:'Line Tabs'}
                        ]
                    },
                    {id: 4, link: '/components/base/accordions.html', title:'Accordions'},
                    {id: 5, link: '/components/base/navs.html', title:'Navs'},
                    {id: 5, link: '/components/portlets/draggable.html', title:'Draggable Portlets'},
                    {id: 6, link: '/components/portlets/tools.html', title:'Portlet tools'},
                    {id: 7, link: '/components/portlets/sticky-head.html', title:'Sticky Head Portlets'}
                ]
            }

        }
    },  
    template:`
    <div>
        <button class="m-aside-left-close  m-aside-left-close--skin-dark " id="m_aside_left_close_btn"><i class="la la-close"></i></button>
        <div id="m_aside_left" class="m-grid__item	m-aside-left  m-aside-left--skin-dark ">
            <!-- BEGIN: Aside Menu -->
            <div id="m_ver_menu" class="m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark " m-menu-vertical="1" m-menu-scrollable="1" m-menu-dropdown-timeout="500" style="position: relative;">
                <ul class="m-menu__nav  m-menu__nav--dropdown-submenu-arrow ">
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="dashboardmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">Customer</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>                    
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="customersmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="tiersmenu"></menu-component>
                   
                    <!-- <menu-component v-bind:activemenu="activemenu" v-bind:menu="accountmenu"></menu-component> 
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="couponserialmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="loyaltyredeemmenu"></menu-component>
                    -->
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">LOYALTY</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="loyaltyissuemenu"></menu-component>                    
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="loyaltyprogramsmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">REWARDS</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="rewardmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">TOKENS</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="tokensmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">COUPONS</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="couponmenu"></menu-component>                    
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="issuecouponmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="redeemcouponmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="voidcouponmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">Business</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>

                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="staffmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="outletmenu"></menu-component>
                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="settingsmenu"></menu-component>
                    <li class="m-menu__section ">
                        <h4 class="m-menu__section-text">CURRENT PLAN</h4>
                        <i class="m-menu__section-icon flaticon-more-v2"></i>
                    </li>

                    <menu-component v-bind:activemenu="activemenu" v-bind:menu="planmenu"></menu-component>
                </ul>
            </div>
            <!-- END: Aside Menu -->
        </div>
    </div>
    `
})

new Vue({
    el: '#theme-side-menu-section',
    data: {
        message: '',
        logintitle: 'JOIN OUR GREAT METRO COMMUNITY GET FREE ACCOUNT',
        errors: [],
        postBody: '',
        price_plan:'',

    },         
    methods: {
        sayNow: function (msg1, msg2) {
            alert(msg1, msg2)
        }
    }
})