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
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td class='calen_top' id="+display_time["display_year"]+"_"+display_time["display_month"]+"_"+calendar["value"][i][j]+">"+calendar["value"][i][j]+"</td>")
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+2)+")").append("<td class='calen_bottom' id="+display_time["display_year"]+"_"+display_time["display_month"]+"_"+calendar["value"][i][j]+" onclick='create_schedule(this);'></td>")
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

function draw_today(this_year,this_month,this_date){
  $("#"+this_year+"_"+this_month+"_"+this_date).css("background-color","#8ffbff")
}

function calendar_move(element){
  data = {
    "display_date":parseInt(display_time["display_date"]),
    "display_month":parseInt(display_time["display_month"]),
    "display_year":parseInt(display_time["display_year"]),
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
        display_time = JSON.parse(data["display_time"])
        calendar = JSON.parse(data["calendar"])
        console.log(display_time)
        console.log(calendar)
        display_month(display_time["display_month"])
        create_calendar();
      },
      function () {
        alert("読み込み失敗");
  });
}


function create_schedule(element){
  selected_id = element.id
  selected_date_list = selected_id.split("_")
  selected_year = selected_date_list[0]
  selected_month = selected_date_list[1]
  selected_date = selected_date_list[2]
  console.log(selected_year)
  console.log(selected_month)
  console.log(selected_date)
}
