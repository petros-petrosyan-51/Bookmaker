function appendResult(data){
let url = ""    
if (!data[0].StartTime){
  url =  "https://www.novibet.com/live-betting?event="+data[0].BetContextId
}else{
  url = "https://www.novibet.com/sports/"+data[0].Path+"/e"+data[0].BetContextId;  
}
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
  }
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
 copyToClipboard(url)
}
function events(){
    if ($(".search").val()){
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
             if (data.LiveNow.length !== 0){
             appendResult(data.LiveNow)
             }
             if (data.LiveSchedule.length !== 0){
             appendResult(data.LiveSchedule)
             }
            },
            error: function(){
              console.clear();  
              $(".result").empty();
              $(".result").append(' <div class="main">Not Found</div>')
            }
        })
       }
}
$(document).on('paste', function(e){
    $(".search").val('');
    $(".result").empty();
    $(".result").append(' <div class="main">Loading...</div>');
    $(".search").focus();
    setTimeout(function(){
       events()
         }, 500);
 })
$( document ).ready(function(){
    $(".search").focus();
     $(document).click(function(e){
        $(".search").focus();
    });
    $(".search").on('keypress',function(e) {
        if(e.which == 13) {
            events();
        }
    });
});
