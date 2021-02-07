const express = require('express')
const path = require('path')
const axios = require('axios')
const app = express();
const port = 3000;
const dirname = path.resolve();
let array = [];
let result = [];
function search(data,param){
    return data.Competitor1.toLowerCase().includes(param.toLowerCase()) || data.Competitor2.toLowerCase().includes(param.toLowerCase())
}
function getItem(data,param){
  array=[];  
  data = data.data[0].BetViews.map(({Competitions})=>Competitions.map(({Events})=>{
        return Events.filter(({AdditionalCaptions})=>{
            return search(AdditionalCaptions,param)
        })
    }))
    for (let i=0;i<data.length;i++){
        if(data[i].length !==0){
            for (let j=0;j<data[i].length;j++){
                 if(data[i][j].length !==0){
                    array.push(data[i][j])
                 }
            }
        }
    }
    return array;
}
function pushItem(data){
    for (let i=0;i<data.length;i++){
        for (let j=0;j<data[i].length;j++){
           if (!result.some(item => item.BetContextId ===data[i][j].BetContextId )){
               result.push(data[i][j])
           }
        }
    }
}
app.get('/',(_, res) => {
 res.sendFile(path.join(dirname+'/index.html'));
});
app.get('/js/script.js',function(_,res){
    res.sendFile(path.join(dirname + '/js/script.js')); 
});
app.get('/js/jquery-3.5.1.min.js',function(_,res){
    res.sendFile(path.join(dirname + '/js/jquery-3.5.1.min.js')); 
});
app.get('/css/style.css',function(_,res){
    res.sendFile(path.join(dirname + '/css/style.css')); 
});
app.post('/:search/:time',async (req,res)=>{
    try{ 
       const param = req.params.search
       let LiveNow = await axios.get('https://www.novibet.com/api/marketviews/location/16/450144?lang=en-US&oddsR=1&timeZ=Romance%20Standard%20Time&usrGrp=null&timestamp='+req.params.time);
       let params = '';
       result=[]
        if (param.length > 1){
          pushItem(getItem(LiveNow,param))  
          if (!result.length){
            for (let i = 0;i<param.length;i++){
                if (param.length-1 !== i){
                  params=''
                  for (let k=i+1;k<param.length;k++){
                      params = params +param[k]
                 } 
                if (params.length > 1){
                  pushItem(getItem(LiveNow,params))  
                }
               }          
             }
          }
        }else{
            pushItem(getItem(LiveNow,param))  
        }
        if (result.length){
            for (let i = 0;i<result.length;i++){
                result[i].type=result[i].Path.split('/')[0].toLowerCase();
            }
            if (result.length > 1){
                array = result.filter(({AdditionalCaptions})=>search(AdditionalCaptions,req.params.search));
                if (array.length){
                    result = array
                }
            }
            res.json(result[0])
        }else{
            res.json({"error":[]})
        }
    }catch(err){
        res.json({"error": err})
    }
})
app.listen(port, () => {
  console.log('Server Runing on port '+port+'!')
});