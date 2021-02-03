const express = require('express')
const path = require('path')
const axios = require('axios')
const app = express();
const port = 3000;
const dirname = path.resolve();
function search(data,param){
    return data.Competitor1.toLowerCase().includes(param.toLowerCase()) || data.Competitor2.toLowerCase().includes(param.toLowerCase())
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
app.post('/:search',async (req,res)=>{
    try{
        let LiveSchedule = await axios.get('https://www.novibet.com/api/marketviews/location/16/450145?lang=en-US&oddsR=1&timeZ=Romance%20Standard%20Time&usrGrp=null&timestamp='+new Date().getTime());
        let LiveNow = await axios.get('https://www.novibet.com/api/marketviews/location/16/450144?lang=en-US&oddsR=1&timeZ=Romance%20Standard%20Time&usrGrp=null&timestamp='+new Date().getTime());
        LiveSchedule = LiveSchedule.data[0].BetViews.map(({Events})=>{ 
            return Events.filter(({AdditionalCaptions})=>{
                return search(AdditionalCaptions,req.params.search)
            })
          })
        LiveNow  =  LiveNow.data[0].BetViews.map(({Competitions})=>{
            return Competitions.map(({Events})=>{
                 return Events.filter(({AdditionalCaptions})=>{
                    return search(AdditionalCaptions,req.params.search)
                 })
             })
         })
         LiveSchedule = LiveSchedule.reduce(function(a, b) { return a.concat(b)});
         LiveNow = LiveNow.reduce(function(a, b) {return a.concat(b)});
         if (LiveNow[0].length == 0){
             LiveNow = []
         }
               res.json({
             "LiveSchedule": LiveSchedule,
             "LiveNow": LiveNow
         })
    }catch(err){
        res.json({"error": err})
    }
})
app.listen(port, () => {
  console.log('Server Runing on port '+port+'!')
});