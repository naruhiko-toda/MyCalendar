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
