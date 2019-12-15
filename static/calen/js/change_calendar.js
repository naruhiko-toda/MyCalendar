function switch_calendar(){
  element = $("#switch_button");
  format = $("#switch_button").val();
  switch (format) {
    case "day":
      to_day_calendar(this_year, this_month, this_date);
      break;
    case "month":
      to_month_calendar(this_year, this_month, this_date);
      break;
  };
}

function to_day_calendar(year, month, date){
  data = {
    "display_year"  : year,
    "display_month" : month,
    "display_date"  : date,
    "type"          : "switch",
    "format"        : "day"
  }
  $.ajax({
      url : "calen/get_calendar",
      data: data,
      type:'POST',
  })
  .then(
    function (data) {
      display_time = JSON.parse(data["display_time"])
      calendar = JSON.parse(data["calendar"])
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
  data = {
    "display_year"  : year,
    "display_month" : month,
    "display_date"  : date,
    "type"          : "switch",
    "format"        : "month"
  }
  $.ajax({
      url : "calen/get_calendar",
      data: data,
      type:'POST',
  })
  .then(
    function (data) {
      display_time = JSON.parse(data["display_time"])
      calendar = JSON.parse(data["calendar"])
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

function calendar_move(element){
  data = {
    "display_year"  : parseInt(display_time["display_year"]),
    "display_month" : parseInt(display_time["display_month"]),
    "display_date"  : parseInt(display_time["display_date"]),
    "type"          : element.value,
    "format"        : calendar["type"]
  }
  $.ajax({
    url : "calen/get_calendar",
    data: data,
    type:'POST',
  })
  .then(
    function (data) {
      display_time = JSON.parse(data["display_time"])
      calendar = JSON.parse(data["calendar"])
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
