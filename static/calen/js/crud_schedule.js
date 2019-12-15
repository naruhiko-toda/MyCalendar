function create_schedule(){
  data = {
    "username"    : username,
    "title"       : $("#title_input").val(),
    "roop_type"   : $("#roop_type_input").val(),
    "start_date"  : $("#start_date_input").val(),
    "start_time"  : $("#start_time_input").val(),
    "finish_date" : $("#finish_date_input").val(),
    "finish_time" : $("#finish_time_input").val(),
    "category"    : $("#category_list").val(),
    "place"       : $("#place_input").val(),
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
      create_calendar();
    },
    function () {
      alert("読み込み失敗");
  });
}

function edit_schedule(schedule){
  data = {
    "schedule_id" : schedule["id"],
    "username"    : username,
    "title"       : $("#title_input").val(),
    "roop_type"   : $("#roop_type_input").val(),
    "start_date"  : $("#start_date_input").val(),
    "start_time"  : $("#start_time_input").val(),
    "finish_date" : $("#finish_date_input").val(),
    "finish_time" : $("#finish_time_input").val(),
    "category"    : $("#category_list").val(),
    "place"       : $("#place_input").val(),
    "description" : $("#description_input").val()
  }
  $.ajax({
    url  : "calen/edit_schedule",
    data : data,
    type :'POST',
  })
  .then(
    function (data) {
      console.log(data);
      schedule["title"]       = $("#title_input").val()
      schedule["roop_type"]   = $("#roop_type_input").val()
      schedule["start_date"]  = $("#start_date_input").val()
      schedule["start_time"]  = $("#start_time_input").val()
      schedule["finish_date"] = $("#finish_date_input").val()
      schedule["finish_time"] = $("#finish_time_input").val()
      schedule["category"]    = $("#category_list").val()
      schedule["place"]       = $("#place_input").val()
      schedule["description"] = $("#description_input").val()
      console.log("変更前",schedules)
      for(var i = 0; i < schedules.length; i++) {
        if(schedules[i]["id"] === schedule["id"]) {
          number = i;
        }
      }
      console.log(number)
      schedules[number] = schedule
      console.log("変更後",schedules)
      create_calendar();
    },
    function () {
      alert("読み込み失敗");
  });
}

function delete_schedule(schedule){
  data = {
    schedule_id : schedule["id"]
  }
  $.ajax({
    url  : "calen/delete_schedule",
    data : data,
    type :'POST',
  })
  .then(
    function (data) {
      console.log(data);
      console.log("変更前",schedules)
      schedules = schedules.filter(n => n["id"] !== schedule["id"])
      console.log("変更後",schedules)
      create_calendar();
    },
    function () {
      alert("読み込み失敗");
  });
}
