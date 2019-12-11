function create_calendar(){
  switch( calendar["type"] ){
    case "month":
      $(".calendar_month tbody").empty();
      for(var i=0; i<calendar["value"].length; i++){
        $(".calendar_month tbody").append("<tr></tr>")
        $(".calendar_month tbody").append("<tr></tr>")
        for(var j=0; j<7; j++){
          console.log(j)
          if(calendar["value"][i][j] != 0){
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td class='calen_top' id="+this_time["this_year"]+"_"+this_time["this_month"]+"_"+calendar["value"][i][j]+">"+calendar["value"][i][j]+"</td>")
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+2)+")").append("<td class='calen_bottom'></td>")
          }else{
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td class='calen_top'></td>")
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+2)+")").append("<td class='calen_bottom'></td>")
          }
        }
        bottom_height = ($(window).height()-26-56-(27*calendar["value"].length)) / calendar["value"].length
        $(".calen_bottom").css("height",bottom_height)
      }
      break;
    case "day":
      $(".calendar_day tbody").empty();
      $(".calendar_day tbody").append("<tr></tr>")
      for(var j=0; j<7; j++){
        $(".calendar_day tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td>"+calendar["value"][i]+"</td>")
        $(".calendar_day tbody > tr:nth-child("+parseInt(2*i)+")").append("<td></td>")
      }
      break;
  }
}

function display_month(month){
  $(".thisMonth").html(month+" 月")
}

function draw_today(thisYear,thisMonth,thisDate){
  $("#"+thisYear+"_"+thisMonth+"_"+thisDate).css("background-color","#8ffbff")
}

function calendar_move(element){
  data = {
    "thisDate":parseInt(this_time["this_date"]),
    "thisMonth":parseInt(this_time["this_month"]),
    "thisYear":parseInt(this_time["this_year"]),
    "type": element.value,
    "format":calendar["type"]
  }
  console.log(data)
  $.ajax({
      url: "calen/get_calendar",
      data: data,
      type:'POST',
  })
  .then(
      function (data) {
        console.log(data)
        this_time = JSON.parse(data["this_time"])
        calendar = JSON.parse(data["calendar"])
        console.log(this_time)
        console.log(calendar)
        display_month(this_time["this_month"])
        create_calendar();
      },
      function () {
        alert("読み込み失敗");
  });
}
