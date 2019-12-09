function create_calendar(){
  switch( calendar["type"] ){
    case "month":
      for(var i=0; i<calendar["value"].length; i++){
        $(".calendar_month tbody").append("<tr></tr>")
        $(".calendar_month tbody").append("<tr></tr>")
        for(var j=0; j<7; j++){
          if(calendar["value"][i][j] != 0){
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td class='calen_top' id="+thisYear+"_"+thisMonth+"_"+calendar["value"][i][j]+">"+calendar["value"][i][j]+"</td>")
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i)+")").append("<td class='clean_bottom'></td>")
          }else{
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td class='calen_top'></td>")
            $(".calendar_month tbody > tr:nth-child("+parseInt(2*i)+")").append("<td class='clean_bottom'></td>")
          }
        }
      }
      break;
    case "week":
      $(".calendar_week tbody").append("<tr></tr>")
      $(".calendar_week tbody").append("<tr></tr>")
      for(var j=0; j<7; j++){
        $(".calendar_month tbody > tr:nth-child("+parseInt(2*i+1)+")").append("<td>"+calendar["value"][i]+"</td>")
        $(".calendar_month tbody > tr:nth-child("+parseInt(2*i)+")").append("<td></td>")
      }
      break;
  }
}

function display_month(month){
  $(".thisMonth").html(month+" 月")
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
      // 1つめは通信成功時のコールバック
      function (data) {
        console.log(data)
        res = JSON.parse(data)
        console.log(res)
        this_time = res["this_time"]
        calendar = res["calendar"]
      },
      // 2つめは通信失敗時のコールバック
      function () {
        alert("読み込み失敗");
  });
}
