
Vue.component('theme-footer-component', {
    template: `
    <footer class="m-grid__item		m-footer ">
        <div class="m-container m-container--fluid m-container--full-height m-page__container">
            <div class="m-stack m-stack--flex-tablet-and-mobile m-stack--ver m-stack--desktop">
                <div class="m-stack__item m-stack__item--right m-stack__item--middle m-stack__item--last">
                    <span class="m-footer__copyright">
                        2019 &copy; NuTick Loaylty by <a href="https://www.nutick.com" class="m-link">NuTick Inc</a>
                    </span>
                </div>
            </div>
        </div>
    </footer>
    `
})

new Vue({
    el: '#theme-footer-section',
    data: {
        message: '',
        logintitle: 'JOIN OUR GREAT METRO COMMUNITY GET FREE ACCOUNT',
        errors: [],
        postBody: ''
    },
    methods: {
        sayNow: function (msg1, msg2) {
            //alert(msg1, msg2)
        }
    }
})