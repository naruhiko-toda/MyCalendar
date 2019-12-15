function create_calendar(){
  switch( calendar["type"] ){
    case "month":
      $(".calendar_month tbody").empty();
      for(var i=0; i<calendar["value"].length; i++){
        $(".calendar_month tbody").append("<tr></tr>")
        for(var j=0; j<7; j++){
          if(calendar["value"][i][j] != 0){
            $(".calendar_month tbody > tr:nth-child("+parseInt(i+1)+")").append("\
              <td class='calendar'\
              id="+display_time["display_year"]+"-"+display_time["display_month"]+"-"+calendar["value"][i][j]+"\
              onclick='select_day(this);'>\
              "+calendar["value"][i][j]+"</td>"
            )
          }else{
            $(".calendar_month tbody > tr:nth-child("+parseInt(i+1)+")").append("\
              <td class='calendar'></td>"
            )
          }
        }
        bottom_height = ($(window).height()-56-24-56) / week_cnt
        $(".calendar").css("height",bottom_height)
      }
      draw_today(this_year,this_month,this_date);
      break;
    case "day":
      $(".calendar_day tbody").empty();
      for(var j=0; j<7; j++){
        $(".calendar_day tbody tr").append("\
          <td>"+calendar["value"][i]+"</td>"
        )
      }
      break;
  }
  display_calen_title(this_year, this_month, this_date, calendar["type"]);
  display_schedule(schedules);
}

function display_calen_title(year,month,date,type){
  switch (type) {
    case "month":
      $(".calen_title").html(year+"年"+month+" 月")
      break;
    case "day":
      $(".calen_title").html(year+"年"+month+" 月"+date+" 日")
  }
}

function draw_today(this_year,this_month,this_date){
  $("#"+this_year+"-"+this_month+"-"+this_date).css("background-color","#8ffbff")
}

function calendar_move(element){
  data = {
    "display_year"  : parseInt(display_time["display_year"]),
    "display_month" : parseInt(display_time["display_month"]),
    "display_date"  : parseInt(display_time["display_date"]),
    "type"          : element.value,
    "format"        : calendar["type"]
  }
  console.log(data)
  $.ajax({
      url : "calen/get_calendar",
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
        display_calen_title(
          display_time["display_year"],
          display_time["display_month"],
          display_time["display_date"],
          calendar["type"]
        )
        create_calendar();
        draw_today(this_year,this_month,this_date);
      },
      function () {
        alert("読み込み失敗");
        location.reload();
  });
}

function create_schedule(){
  data = {
    "username"    : username,
    "title"       : $("#title_input").val(),
    "start_date"  : $("#start_date_input").val(),
    "start_time"  : $("#start_time_input").val(),
    "finish_date" : $("#finish_date_input").val(),
    "finish_time" : $("#finish_time_input").val(),
    "category"    : $("#category_list").val(),
    "description" : $("#description_input").val()
  }
  $.ajax({
      url  : "calen/create_schedule",
      data : data,
      type :'POST',
  })
  .then(
      function (data) {
        console.log(data);
        alert(data["message"])
      },
      function () {
        alert("読み込み失敗");
  });
}

function display_time_picker(){
  $(".start_date").datepicker();
  console.log(this_hour)
  if(this_hour==23){
    $(".start_date").val(this_year+'/'+this_month+'/'+parseInt(this_date+1));
    start_default = this_hour - 23
  }else{
    start_default = this_hour + 1
    $(".start_date").val(this_year+'/'+this_month+'/'+this_date);
  }
  $(".finish_date").datepicker();
  if(this_hour>=22){
    finish_default = this_hour - 22
    $(".finish_date").val(this_year+'/'+this_month+'/'+parseInt(this_date+1));
  }else{
    finish_default = this_hour + 2
    $(".finish_date").val(this_year+'/'+this_month+'/'+this_date);
  }
  $('.start_time').timepicker({
    timeFormat    : 'H:mm',
    interval      : 60,
    minTime       : '0:00',
    maxTime       : '23:00',
    defaultTime   : start_default+":00",
    startTime     : '0:00',
    dynamic       : false,
    dropdown      : true,
    scrollbar     : true,
    zindex        : 1100
  });
  $('.finish_time').timepicker({
    timeFormat    : 'H:mm',
    interval      : 60,
    minTime       : '0:00',
    maxTime       : '23:00',
    defaultTime   : finish_default+":00",
    startTime     : '0:00',
    dynamic       : false,
    dropdown      : true,
    scrollbar     : true,
    zindex        : 1100
  });
}

function check_time(){
  // 予定が始まる日付
  start_date_list   = $(".start_date").val().split("/")
  start_year 　　　  = start_date_list[0]
  start_month       = start_date_list[1]
  start_date        = start_date_list[2]

  // 予定が始まる時間
  start_time_list   = $(".start_time").val().split(":")
  start_hour        = start_time_list[0]
  start_minute      = start_time_list[1]

  start             = new　Date(start_year,start_month,start_date,start_hour,start_minute,0)

  // 予定が終わる日付
  finish_date_list  = $(".finish_date").val().split("/")
  finish_year       = finish_date_list[0]
  finish_month      = finish_date_list[1]
  finish_date       = finish_date_list[2]

  // 予定が終わる時間
  finish_time_list  = $(".finish_time").val().split(":")
  finish_hour       = finish_time_list[0]
  finish_minute     = finish_time_list[1]

  finish            = new　Date(finish_year,finish_month,finish_date,finish_hour,finish_minute,0)
  console.log(start);
  console.log(finish);
  if(start > finish){
    $("#register_schedule_button").prop("disabled", true);
    $(".finish_date").addClass("error_input")
    $(".finish_time").addClass("error_input")
    alert("不適切な時間です。開始時間より終了時間が後になるようにしてください！")
  }else{
    $("#register_schedule_button").prop("disabled", false);
    $(".finish_date").removeClass("error_input")
    $(".finish_time").removeClass("error_input")
  }
}

function check_user_login_statement(){
  if(login){
    $('.js-modal').fadeOut();
  }else{
    $('.js-modal').fadeIn();
  }
};

function display_schedule(schedules){
  console.log(schedules);
  for(var i=0; i < schedules.length; i++){
    console.log(schedules[i]);
    $("#"+schedules[i]["start_date"]).append("\
      <li class='schedule'>"+schedules[i]["title"]+"</li>\
    ")
  }
}

function switch_calendar(){
  element = $("#switch_button");
  format = $("#switch_button").val();
  console.log(format)
  switch (format) {
    case "day":
      to_day_calendar(this_year, this_month, this_date);
      break;
    case "month":
      to_month_calendar(this_year, this_month, this_date);
      break;
  };
}

function select_day(element){
  console.log(element);
  selected_date_list   = element.id.split("-");
  selected_year 　　　  = start_date_list[0];
  selected_month       = start_date_list[1];
  selected_date        = start_date_list[2];
  to_day_calendar(selected_year, selected_month, selected_date);
}

function to_day_calendar(year, month, date){
  console.log(year,month,date)
  data = {
    "display_year"  : year,
    "display_month" : month,
    "display_date"  : date,
    "type"          : "switch",
    "format"        : "day"
  }
  console.log(data)
  $.ajax({
      url : "calen/get_calendar",
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
        $(".calendar_day").show();
        $(".calendar_month").hide();
        $("#switch_button").val("month");
        $("#switch_button").html("month");
        create_calendar();
      },
      function () {
        alert("読み込み失敗");
        location.reload();
  });
}

function to_month_calendar(year, month, date){
  console.log(year,month,date)
  data = {
    "display_year"  : year,
    "display_month" : month,
    "display_date"  : date,
    "type"          : "switch",
    "format"        : "month"
  }
  console.log(data)
  $.ajax({
      url : "calen/get_calendar",
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
        $(".calendar_day").hide();
        $(".calendar_month").show();
        $("#switch_button").val("day");
        $("#switch_button").html("day");
        create_calendar();
      },
      function () {
        alert("読み込み失敗");
        location.reload();
  });
}

// ログインmodalにonchange属性を付与する
$(document).on('change', 'input[name=password]', function () {

});
