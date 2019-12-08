function create_calendar(){
  switch( calendar["type"] ){
    case "month":
      for(var i=0; i<calendar["value"].length; i++){
        $(".calendar_month tbody").append("<tr></tr>")
        for(var j=0; j<7; j++){
          $(".calendar_month tbody > tr:nth-child("+parseInt(i+1)+")").append("<td>"+calendar["value"][i][j]+"</td>")
        }
      }
      break;
  }
}
