Vue.component('tiers-main-component', {
    props: ['tierid'],
    template: `
    <div class="m-grid__item" id="m-tier-main" >
            <tiers-list-component  
                @onstatuschanged="$emit('onstatuschanged',$event)"
                @ontierchanged="$emit('ontierchanged',$event)"
                @newtierclicked="$emit('newtierclicked',$event)"
                @edittierclicked="$emit('edittierclicked',$event)"
                @deletetierclicked="$emit('deletetierclicked',$event)"
            ></tiers-list-component>
            <tiers-form-component @showtoast="$emit('showtoast', $event)" primaryinput="p"
                @tierformcancel="$emit('tierformcancel',$event)"
                @tierformsave="$emit('tierformsave',$event)"
            ></tiers-form-component>
            <tiers-form-edit-component @showtoast="$emit('showtoast', $event)" primaryinput="p" :tierid="tierid"
                @tierformcancel="$emit('tierformcancel',$event)"
                @tierformsave="$emit('tierformsave',$event)"
            ></tiers-form-edit-component>
            <!--begin::Modal-->
            <div class="modal fade" id="m_modal_1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Tier</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <p>Are You Sure want to delete this <span style="font-weight:bold;">{{tierid}}</span> tier?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" v-on:click="$emit('deletetierclicked',$event)" data-dismiss="modal" class="btn btn-primary">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Modal-->
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
    el: '#tiers-page',
    data: {
        message: 'Init Message',
        errors: [],
        postBody: '',
        datatable:'',
        tierid: ''
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Init Message is: ' + this.message)
    },
    methods: {
        sayNow: function (msg1, msg2) {
            //alert(msg1, msg2)
        },
        displaytierForm : function(){
            //alert('display form')
            $('#m-tier-form').removeClass('d-none');
            $('#m-tier-form-edit').addClass('d-none');
            $('#m-tier-list').addClass('d-none');
        },
        displaytierList : function(){
            //alert('display tier list')
            $('#m-tier-form').addClass('d-none');
            $('#m-tier-form-edit').addClass('d-none');
            $('#m-tier-list').removeClass('d-none');
            // this.datatable.reload();
            var table = $("#m_table_tier").DataTable();
            table.clear().draw();
            // this.initTierTable();
        },
        displaytierFormEdit : function(){
            //alert('display Edit form')
            $('#m-tier-form').addClass('d-none');
            $('#m-tier-form-edit').removeClass('d-none');
            $('#m-tier-list').addClass('d-none');
        },
        initTierList : function(){
            this.initTierTable();
        },
        onStatusChange : function(){
            //alert('Status Changed', )
            this.datatable.search($('#m_form_status').val(), 'Status');
        },
        onTierChange : function(){
            //alert('Tier Changed', )
            this.datatable.search($('#m_form_tier').val(), 'Tier');
        },
        deleteTier(){
            var vm = this;
            var form = $('#tier_data');
            console.log("Delete Tier ", this.tierid);
            axios.put(`/loyalty/tiers/`+ this.tierid, {
                'tier_id': this.tierid,
                'status': 0,
            }).then(response => {
                $('#m_table_tier').DataTable().ajax.reload();
                vm.showErrorMsg(form, 'success', 'Tier Delete Success !! ');
            })
            .catch(e => {
                console.log('failure call:', e);
                if(e.response.status == 403) {
                    window.location.replace('/login');
                }
                vm.showErrorMsg(form, 'danger', e.response.data.error_msg);
            })
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
        editForm: function(tierid) {
            this.displaytierFormEdit();
            this.tierid = tierid;
            console.log("id ", this.tierid);
        },
        initTierTable: function() {
            var table = $("#m_table_tier").DataTable({
                responsive:!0,
                searchDelay:500,
                processing: true,
                serverSide: true,
                searching: false,
                paging:   false,
                info:     false,
                // ajax:"/loyalty/tiers/list",
                ajax: {
                    url: "/loyalty/tiers/list/details",
                    type: "POST",
                    dataSrc: function ( raw ) {
                        console.log("Data ", raw);
                        var dataSet = raw;
                        return dataSet.data;
                      }
                },
                columns: [
                    { data: "#"},
                    { data: "sequence" },
                    { data: "tier_id" },
                    { data: "tier_name" },
                    { data: "tier_description" },
                    { data: "status" },
                    { data: "actions"}
                ],
                rowReorder: {
                    dataSrc: 'tier_id',
                    selector: 'td:nth-child(2)'
                },
                columnDefs:[
                    {
                        targets: 0,
                        title: '#',
                        orderable:!1,
                        render:function(a,e,t,n){
                            // console.log("a,e,t,n", a,e,t,n)
                            return  (n.row+1) ;
                        }
                    },
                    {
                        targets: 4,
                        title: 'Tier Descriptions',
                        orderable:!1,
                        className: 'tier-desc',
                        render:function(a,e,t,n){
                            // console.log("a,e,t,n", a,e,t,n)
                            return  '<span class="test">' + t.tier_description + '</span>' ;
                        }
                    },
                    {
                        targets:-1,
                        title:"Actions",
                        orderable:!1,
                        render:function(a,e,t,n){
                            if(t.tier_id !== 'DEFAULT') {
                                return '\
                                        <a href="#" id="editBtn" class="edit_btn m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                            <i class="la la-edit"></i>\
                                        </a>\
                                        <a href="#" data-toggle="modal" data-target="#m_modal_1" id="deleteBtn" class="delete_btn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                                            <i class="la la-trash"></i>\
                                        </a>\
                                    ';
                            }
                            else {
                                return '\
                                        <a href="#" id="editBtn" class="edit_btn m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                                            <i class="la la-edit"></i>\
                                        </a>\
                                        ';
                            }
                        }
                    },
                    {
                        targets:5,
                        render:function(a,e,t,n) {
                            var s=
                            {
                                1:{title:"Active",class:"m-badge--brand"},
                                2:{title:"Not Active",class:" m-badge--metal"},
                                3:{title:"Canceled",class:" m-badge--primary"},
                                4:{title:"Success",class:" m-badge--success"},
                                5:{title:"Info",class:" m-badge--info"},
                                6:{title:"Danger",class:" m-badge--danger"},
                                7:{title:"Warning",class:" m-badge--warning"}
                            };
                            return void 0===s[a]?a:'<span class="m-badge '+s[a].class+' m-badge--wide">'+s[a].title+"</span>"}
                        },
                        
                ]
            
        });
        this.datatable = table;
        table.on( 'row-reorder', function ( e, diff, edit ) {
            console.log('row-reorder',  diff)
            var result = 'Reorder started on row: '+edit.triggerRow.data()[1]+'<br>';
     
            for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
                var position =  diff[i].newPosition;
                var id = diff[i].oldData;                 
                let updateTier = {
                    sequence: position
                }
                axios.put('loyalty/tiers/'+ id, updateTier)
                .then((response) => {
                    console.log("Response ", response);
                    table.clear().draw();
                })
                .catch((error) => {
                    if(error.response.status == 403) {
                        window.location.replace('/login');
                    }
                    console.log("Error ", error);
                })                
            }
            
            $('#result').html( 'Event result:<br>'+result );
        } );
            // $('.m_datatable_tier').mDatatable({
            //     // datasource definition
            //     data: {
            //       type: 'remote',
            //       source: {
            //         read: {
            //           url: '/loyalty/tiers/list',
            //           map: function(raw) {
            //             var dataSet = raw;
            //             if (typeof raw.data !== 'undefined') {
            //               dataSet = raw.data;
            //             }
            //             console.log("Data set ", dataSet);
            //             return dataSet;
            //           },
            //         },
            //       },
            //       pageSize: 10,
            //       serverPaging: true,
            //       serverFiltering: true,
            //       serverSorting: true,
            //     },
            //     // layout definition
            //     layout: {
            //       scroll: false,
            //       footer: false
            //     },

            //     // column sorting
            //     sortable: true,
            //     pagination: true,
            //     toolbar: {
            //       // toolbar items
            //       items: {
            //         // pagination
            //         pagination: {
            //           // page size select
            //           pageSizeSelect: [10, 20, 30, 50, 100],
            //         },
            //       },
            //     },
          
            //     search: {
            //       input: $('#generalSearch'),
            //     },
          
            //     // columns definition
            //     columns: [
            //       {
            //         field: '',
            //         title: '#',
            //         sortable: false, // disable sort for this column
            //         width: 40,
            //         selector: false,
            //         textAlign: 'center',
                    // template: function (row, index,datatable) {
                    //     return  ((datatable.getCurrentPage() -1) *datatable.getPageSize() + index+1) ;
                    // }
            //       },
            //        {
            //         field: 'tier_id',
            //         title: 'Tier Code',
            //         sortable: 'asc', // default sort
            //         filterable: false, // disable or enable filtering
            //         width: 100,
            //         // basic templating support for column rendering,
            //         template: '{{tier_id}}',
            //       },
            //       {
            //         field: 'tier_name',
            //         title: 'Tier Name',
            //         sortable: 'asc', // default sort
            //         filterable: false, // disable or enable filtering
            //         width: 100,
            //         // basic templating support for column rendering,
            //         template: '{{tier_name}}',
            //       },
            //       {
            //         field: 'tier_desc',
            //         title: 'Tier Description',
            //         sortable: 'asc', // default sort
            //         filterable: false, // disable or enable filtering
            //         width: 200,
            //         // basic templating support for column rendering,
            //         template: '{{tier_description}}',
            //       },
            //       {
            //         field: 'sequence',
            //         title: 'Sequence',
            //         sortable: 'asc', // default sort
            //         textAlign: 'center',
            //         filterable: false, // disable or enable filtering
            //         template: '{{sequence}}',
            //       },
            //       {
            //         field: 'status',
            //         title: 'Status',
            //         // callback function support for column rendering
            //         template: function(row) {
            //             var statusvals = {
            //                 1: {'title': 'Active', 'class': ' m-badge--success'},
            //                 2: {'title': 'Not Active', 'class': ' m-badge--primary'},
            //                 3: {'title': 'Pending', 'class': 'm-badge--brand'},
            //                 4: {'title': 'Delivered', 'class': ' m-badge--metal'},
            //                 5: {'title': 'Info', 'class': ' m-badge--info'},
            //                 6: {'title': 'Danger', 'class': ' m-badge--danger'},
            //                 7: {'title': 'Warning', 'class': ' m-badge--warning'},              
            //             };
            //             return '<span class="m-badge ' + statusvals[row.status].class + ' m-badge--wide">' + statusvals[row.status].title + '</span>';
            //         },
            //       },
            //       {
            //         field: 'Actions',
            //         width: 110,
            //         title: 'Actions',
            //         sortable: false,
            //         overflow: 'visible',
            //         template: function (row, index, datatable) {
            //           var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            //           if(row.tier_id.toLowerCase() !== 'default') {
                        // return '\
                        //     <a href="#" id="editBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                        //         <i class="la la-edit"></i>\
                        //     </a>\
                        //     <a href="#"  data-toggle="modal" data-target="#m_modal_1" id="deleteBtn" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
                        //         <i class="la la-trash"></i>\
                        //     </a>\
            //             ';
            //           }
            //           else {
            //               return '';
            //           }
                     
            //         },
            //       }
            //     ],
            //     rowReorder: {
            //         selector: 'tr'
            //     },
            // });
            var t = table;
            var vm = this;
            $('#m_form_status').selectpicker();
            $('#m_table_tier').on('click', 'tbody .edit_btn', function (e) {
                e.preventDefault();
                var data = table.row($(this).closest('tr')).data();                
                console.log("DATA ", table.row($(this).closest('tr')).data(), table.row($(this)).data());
                if(data) {
                    vm.editForm(data.tier_id);
                }
                else {
                    data = table.row($(this)).data();
                    vm.editForm(data.tier_id);    
                }
                
            });
            $('#m_table_tier').on('click', 'tbody .delete_btn', function (e) {
                e.preventDefault();
                var data = table.row($(this).closest('tr')).data();
                console.log("DATA ", data.tier_id);
                vm.tierid = data.tier_id;
            });
            // ($(document)).on('click', '#editBtn', (e) => {  
            //     e.preventDefault();
            //     let id = $(e.target).closest('.m-datatable__row').find('[data-field="tier_id"]').text();
            //     this.editForm(id);
            // });
            // ($(document)).on('click', '#deleteBtn', (e) => {  
            //     e.preventDefault();
            //     let id = $(e.target).closest('.m-datatable__row').find('[data-field="tier_id"]').text();
            //     this.tierid = id;
            // });
        }
    },
    mounted(){
        this.initTierTable();
    }

})