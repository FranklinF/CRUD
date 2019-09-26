new Vue({
    el: '#page',
    data: {
      id:'',
      name:'',
      rollnumber:'',
      myData:[],
      count:'0'
    },
    watch: {
       'name':function(){
           console.log("Name: ", this.name);
       }
    },
    methods:{
            submitdata:function(e){
            e.preventDefault();
            var obj ={
                _id:this._id,
                id:this.id,
                name: this.name,
                rollnumber:this.rollnumber
            }
            var vm = this;
            console.log("Object: ", obj);
            if(this.count==0)
            {
            axios.post('/api/getData/ModuleMainData',obj).then(response=>{
               vm.getData();
              
            })
            .catch(e=>
            {
                console.log("error")
            })
            }
            else
            {
                    axios.put('/api/getData/ModuleMainData/'+this._id,obj).then(
                    response=>{
                        alert(JSON.stringify(response.data))
                    this.getData();

                    })
                    .catch(e=>
                    {
                    console.log("error")    
                    })
            }
            vm.cleardata();
        },
        getData: function() {
            axios.get('/api/getData/ModuleMainData').then(
            response=>{
            this.myData=response.data;
            })
            .catch(e=>
            {
            console.log("error")
            })
        },
        cleardata: function()
        {
            this.id='';
            this._id='';
            this.name='';
            this.rollnumber='';
            this.count=0;
        },
        deleteRecord:function(val){
            axios.delete('/api/getData/ModuleMainData/'+val).then(
                response=>{
                this.getData();
                })
                .catch(e=>
                {
                console.log("error")    
                })
        },
        editRecord:function(val,count)
        {
            this.id=val.id;
            this.name=val.name;
            this.rollnumber=val.rollnumber;
            this._id=val._id;
            this.count=count;
        }
    
    },
    mounted() {
    this.getData();
    }
})