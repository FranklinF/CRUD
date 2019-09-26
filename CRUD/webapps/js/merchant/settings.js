Vue.component('settings-main-component', {
    props:['brandid'],
    template: `
    <div class="m-grid__item" id="m-settings-main" >
             <settings-component @showtoast="$emit('showtoast', $event)" @profileupdate = "$emit('profileupdate', $event)"></settings-component>    
        
    </div>
    `
})
new Vue({
    el: '#settings-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        brandid: '',
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
        // this.showToast('test', 'success');
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
    },
    mounted(){
        // this.initOutletsTable();
    }
})