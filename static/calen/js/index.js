function create_calendar(){
  switch( calendar["type"] ){
    case "month":
      $(".calendar_month tbody").empty();
      for(var i=0; i<calendar["value"].length; i++){
        $(".calendar_month tbody").append("<tr></tr>")
        for(var j=0; j<7; j++){
          if(calendar["value"][i][j] != 0){
            $(".calendar_month tbody > tr:nth-child("+parseInt(i+1)+")").append("\
              <td class='calendar has_day'\
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
      for(var i=0; i<50; i++){
        $(".calendar_day tbody").append("<tr class='daily_calendar_row'></tr>");
        $(".calendar_day tbody tr:nth-child("+parseInt(i+1)+")").append("<td class='calendar'><div class='timeline'></div></td>");
      }
      for(var i=1; i<24; i++){
        $(".calendar_day tbody > tr:nth-child("+parseInt(2*i+1)+") .timeline").html(i+":00")
      }
      break;
  }
  display_calen_title(display_time["display_year"], display_time["display_month"], display_time["display_date"], calendar["type"]);
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

function insert_data_for_edit(schedule){
  console.log(schedule)
  $("#title_input").val(schedule["title"]);
  $("#category_list").val(schedule["category_name"]);
  $(".start_date").val(schedule["start_date"]);
  $(".start_time").val(schedule["start_time"]);
  $(".finish_date").val(schedule["finish_date"]);
  $(".finish_time").val(schedule["finish_time"]);
  $("#description_input").val(schedule["description"]);
  $('#register_schedule_button').off('click',create_schedule );
  $('#register_schedule_button').on('click',function(){
    edit_schedule(schedule);
  });
  $('#delete_schedule_button').show();
  $('#delete_schedule_button').on('click',function(){
    delete_schedule(schedule);
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
  switch (calendar["type"]) {
    case "month":
    console.log(schedules);
      for(var i=0; i < schedules.length; i++){
        if(schedules[i]["roop_type"] == "ev_day"){
          $(".has_day").append("\
          <li class='schedule_month'>"+schedules[i]["title"]+"</li>\
          ");
        }else if(schedules[i]["roop_type"] == "ev_week"){
          console.log("毎週のやつ")
          this_day_order = new Date(schedules[i]["start_date"]).getDay()
          console.log(this_day_order)
          for(var j=0; j<calendar["value"].length; j++){
            if(calendar["value"][j][this_day_order] != 0){
              $(".calendar_month tbody tr:nth-child("+j+") td:nth-child("+parseInt(this_day_order+1)+")").append(
                "<li class='schedule_month'>"+schedules[i]["title"]+"</li>"
              )
            }
          }
        }else{
          // console.log("そのほかのやつ")
          $("#"+schedules[i]["start_date"]).append("\
            <li class='schedule_month'>"+schedules[i]["title"]+"</li>\
          ");
        }
      }
      break;

    case "day":
      display_schedules = [];
      for(var i=0; i < schedules.length; i++){
        if(schedules[i]["roop_type"] == "ev_day"){
          display_schedules.push(schedules[i])
        }else if(schedules[i]["roop_type"] == "ev_week"){
          schedule_day_order = new Date(schedules[i]["start_date"]).getDay()
          displyay_day_order = new Date(
            display_time["display_year"]+"-"+display_time["display_month"]+"-"+display_time["display_date"]
          ).getDay()
          if(schedule_day_order == displyay_day_order){
            display_schedules.push(schedules[i])
          }
        }else{
          this_day_schedules = schedules.filter(
            s => s["start_date"] === display_time["display_year"]+"-"+display_time["display_month"]+"-"+display_time["display_date"]
          )
          for(var j=0; j < this_day_schedules.length; j++){
            display_schedules.push(this_day_schedules[j])
          }
        }
      }
      for(var i=0; i < display_schedules.length; i++){
        calc_position(display_schedules[i]["start_time"], display_schedules[i]["finish_time"]);
        period = finish_position - start_position
        $(".calendar_day tbody").append("<div id='schedule_"+i+"' class='schedule_day' onclick='insert_data_for_edit("+JSON.stringify(display_schedules[i])+");' data-toggle='modal' data-target='#schedule_modal'>"+display_schedules[i]["title"]+"</div>")
        $("#schedule_"+i).css("top",(start_position) * 30 + 56);
        $("#schedule_"+i).css("height",period * 29);
      }
      break;
  }
}

function calc_position(start_time,finish_time){
  // 予定が始まる時間
  start_time_list   = start_time.split(":")
  start_hour        = start_time_list[0]
  start_minute      = start_time_list[1]
  start_position    = start_hour * 2 + Math.ceil(start_minute / 30)

  // 予定が終わる時間
  finish_time_list  = finish_time.split(":")
  finish_hour       = finish_time_list[0]
  finish_minute     = finish_time_list[1]
  finish_position   = finish_hour * 2 + Math.ceil(finish_minute / 30)
}

function select_day(element){
  console.log(element);
  selected_date_list   = element.id.split("-");
  selected_year 　　　  = selected_date_list[0];
  selected_month       = selected_date_list[1];
  selected_date        = selected_date_list[2];
  console.log(selected_date)
  to_day_calendar(selected_year, selected_month, selected_date);
}

function check_password(){
  $("#id_password1").on('change',function () {
    value = $("#id_password1").val()
    if(value.length < 8){
      alert("パスワードは8文字以上にしてください。")
      $("#id_password1").addClass("error_input")
      $("#sign_up_complete_button").prop("disabled", true);
    }else if(value.match(/^([1-9]\d*|0)$/)){
      alert("数字だけのパスワードは不可です。")
      $("#id_password1").addClass("error_input")
      $("#sign_up_complete_button").prop("disabled", true);
    }else{
      $("#id_password1").removeClass("error_input")
      $("#sign_up_complete_button").prop("disabled", false);
    }
  });
  $("#id_password2").on('change',function () {
    value = $("#id_password2").val()
    if(value != $("#id_password1").val()){
      alert("異なるパスワードが入力されています")
      $("#id_password2").addClass("error_input")
      $("#sign_up_complete_button").prop("disabled", true);
    }
  });
}
