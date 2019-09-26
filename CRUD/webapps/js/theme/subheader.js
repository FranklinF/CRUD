Vue.component('subheader-component', {
    props: ['subheader'],
    template: `
    <!-- BEGIN: Subheader -->
    <div class="m-subheader ">
        <div class="d-flex align-items-center">
            <div class="mr-auto">
                <h3 class="m-subheader__title m-subheader__title--separator">{{subheader.title}}</h3>
                <ul class="m-subheader__breadcrumbs m-nav m-nav--inline">
                    <template v-for="(item,index) in subheader.items">
                        <li class="m-nav__item m-nav__item--home">
                            <a :href="item.link" class="m-nav__link m-nav__link--icon">
                                <i v-if="item.icon" class="m-nav__link-icon" :class="item.icon"></i>
                                <span v-if="item.name"  class="m-nav__link-text">{{item.name}}</span>
                            </a>
                        </li>
                        <li v-if="index != subheader.items.length - 1" class="m-nav__separator">-</li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
    <!-- END: Subheader -->
    `
})

