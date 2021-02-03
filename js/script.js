function appendResult(data){
data.map(({Path,BetContextId,AdditionalCaptions,StartTime,name})=>{
     name = AdditionalCaptions.Competitor1
     if (!StartTime){
       StartTime = 'Now';
       Path = "https://www.novibet.com/live-betting?event="+BetContextId
     }else{
        Path = "https://www.novibet.com/sports/"+Path+"/e"+BetContextId;
     }
     name = name + " - "+AdditionalCaptions.Competitor2
     $(".result").append('<div class="main"><div><p>'+name+'</p><p class="time">'+StartTime+'</p></div><a href="'+Path+'">Link</a></div>')
 })
}
function events(){
    if ($(".search").val()){
        $(".result").empty();
        $(".result").append(' <div class="main">Loading...</div>')
        $.ajax({
            url: window.location.pathname+$(".search").val(),
            method: "POST",
            success: function(data){
                data.LiveNow = $.map(data.LiveNow, function(n){
                    return n;
                 });
             $(".result").empty(); 
             if (data.LiveNow.length==0 && data.LiveSchedule.length == 0){
                $(".result").empty();
                $(".result").append(' <div class="main">No Result</div>')
             }  
             appendResult(data.LiveNow);
             appendResult(data.LiveSchedule);
            }
        })
       }
}
$( document ).ready(function() {
   $("#novibet").click(function(){
     $(".novibet").toggle(500)
   })   
   $(".search").on('keypress',function(e) {
    if(e.which == 13) {
        events();
    }
});
   $('#search').click(function(){
       events();
   })
});