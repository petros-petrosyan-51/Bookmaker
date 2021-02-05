Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
function copyToClipboard(text) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(text).select();
  document.execCommand("copy");
  $temp.remove();
}
function appendResult(data){  
  
  const url =  "https://www.novibet.com/live-betting?event="+data.BetContextId
 data.Path = "htps://www.novibet.com/live-betting?event="+data.BetContextId
 data.name = data.AdditionalCaptions.Competitor1
 data.name = data.name + " - "+data.AdditionalCaptions.Competitor2
 data.text = ''
 $(".result").empty();
 if (data.Markets.length !== 0){
     if (parseInt(data.Markets[0].BetItems[0].Caption)){
         for (let i =0;i<data.Markets[0].BetItems.length;i++){
             data.text = data.text + " " + "P"+parseInt(i+1)+" - "+data.Markets[0].BetItems[i].OddsText
         }
     }else {
         for (let i = 0;i<data.Markets[0].BetItems.length;i++){
             data.text = data.text + " " + data.Markets[0].BetItems[i].Caption + " - "+data.Markets[0].BetItems[i].OddsText
         }
     }
  $(".result").append('<div class="main"><div><p>'+data.name+'</p><p>'+data.text+'</p></div><a target="_blank" href="'+data.Path+'">Link</a></div>')
  copyToClipboard(url)
 }
}
function events(){
    if ($(".search").val()){
      $(".result").empty();
      $(".result").append(' <div class="main">Loading...</div>');
        $.ajax({
            url: window.location.pathname+$(".search").val()+"/"+new Date().getTime(),
            method: "POST",
            success: function(data){
               if (data.error){
                $(".result").empty();
                $(".result").append(' <div class="main">No Result</div>')
               }else{
                $(".result").empty(); 
                appendResult(data)
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
    $(document).on('keypress',function(e){
      if(e.which == 13) {
        $(".search").focus();
      }
    })
    $(".search").on('keypress',function(e) {
        if(e.which == 13) {
            events();
        }
    });
   

   
});
