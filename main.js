var list_table=null;
var list_pin=["🤍","🔴","🧡","💙","💜","💚"];
var list_pin_id=["none","check","alert","info","memory","success"];
var list_total=[200,350,400,450,500];

var id_table="pi_work";
var index_cur=0;
var index_cur_pin=1;
var length_pi=500;
var position_btn_add='right';

$(document).ready(function(){
    $("#menu_info").hide();
    if(localStorage.getItem("pos_btn_add")!=null) position_btn_add=localStorage.getItem("pos_btn_add");
    load_list();
    load_pi();
});

function load_pi(){
    $("#pi").html("");
    if(localStorage.getItem(id_table+"_lenth_app")!=null)
        length_pi=parseInt(localStorage.getItem(id_table+"_lenth_app"));
    else
        length_pi=500;

    $("#list_total").val(length_pi);

    var html_pi='';
    var css_col_boy='col-11 col-md-11';

    if(position_btn_add=='none') css_col_boy='col-12 col-md-12';
    if(position_btn_add=='left') html_pi+='<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="add_pi()" oncontextmenu="add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';

    html_pi+='<div class="'+css_col_boy+' col-xs-12 col-sm-12">';
    for(var pi=1;pi<=length_pi;pi++){
        var s_class="";
        if(localStorage.getItem(id_table+"_pi_"+pi)!=null){
            var index_p=parseInt(localStorage.getItem(id_table+"_pi_"+pi));
            s_class="sel "+list_pin_id[index_p];
        }

        html_pi+="<div class='box "+s_class+"' index='"+pi+"'><span class='name'>"+pi+"</span> <span id='timer_"+pi+"' class='timer'>None ☢</span></div>";
        const endTime = localStorage.getItem(id_table+"_pi_"+pi+"_timer");
        if (endTime){
            startCountdown(pi,new Date(parseInt(endTime)));
        }
    }
    html_pi+='</div>';

    if(position_btn_add=='right') html_pi+='<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="add_pi()" oncontextmenu="add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';

    $("#pi").html(html_pi);

    $(".box").click(function(){
        var index=$(this).attr("index");
        $("#menu_info").show(200);
        if(index_cur_pin==0){
            $(this).removeClass("sel");
            localStorage.removeItem(id_table+"_pi_"+index);
        }else{
            if ($(this).hasClass("sel")){
                $(this).removeClass("sel");
                localStorage.removeItem(id_table+"_pi_"+index);
            } else {
                $(this).addClass("sel "+list_pin_id[index_cur_pin]);
                localStorage.setItem(id_table+"_pi_"+index,index_cur_pin);
            }
            startCountdown(index);
        }
       
        index_cur=index;
        load_info();
    });

    load_info();
}

function delete_all(){
    index_cur=0;
    for(var i=1;i<=500;i++){
        localStorage.removeItem(id_table+"_pi_"+i);
        localStorage.removeItem(id_table+"_pi_pin_"+i);
    }
    load_pi();
}

function delete_all_time(){
    for(var i=1;i<=500;i++){
        localStorage.removeItem(id_table+"_pi_"+i+"_timer");
    }
    load_pi();
}

function delete_cur_time(){
    localStorage.removeItem(id_table+"_pi_"+index_cur+"_timer");
    load_pi();
}

function add_pi(){
    index_cur++;
    if(index_cur_pin==0){
        localStorage.removeItem(id_table+"_pi_"+index_cur);
    }else{
        localStorage.setItem(id_table+"_pi_"+index_cur,index_cur_pin);
    }
    load_pi();
}

function add_pi_pin(){
    index_cur++;
    localStorage.setItem(id_table+"_pi_pin_"+index_cur,"1");
    load_pi();
}

function load_info(){
    var count_ready=0;
    var count_pin=0;
    for(var pi=1;pi<=length_pi;pi++){
        if(localStorage.getItem(id_table+"_pi_"+pi)!=null){
            count_ready++;
        }
    }
    $("#info").html("🎯:"+index_cur+" 💎:"+count_ready+" 👒:"+(length_pi-count_ready)+" 📌:"+count_pin);
}

function add_list(){
    var name_new=prompt("Name new table");
    if(name_new.trim()==""){
        alert("Name table not nu!!");
        return false;
    }

    list_table.push(name_new);
    localStorage.setItem("list_table",JSON.stringify(list_table));
    alert("Add table success!!!");
    load_list();
}

function load_list(){
    if(localStorage.getItem("list_table")!=null) list_table=JSON.parse(localStorage.getItem("list_table"));
    else list_table=["pi_work"];

    $("#list_table").empty();
    $(list_table).each(function(index,l){
        $("#list_table").append(new Option("📟 "+l,l));
    });

    $("#list_table").change(function(){
        var val=$(this).val();
        load_table_pi_by_id(val);
    });

    $("#list_total").empty();
    $(list_total).each(function(index,c){
        $("#list_total").append(new Option("🏀 "+c,c));
    });

    $("#list_total").change(function(){
        var val=$(this).val();
        localStorage.setItem(id_table+"_lenth_app",val);
        length_pi=parseInt(val);
        load_pi();
    });

    $("#list_pin").html("");
    $(list_pin).each(function(index,p){
        $("#list_pin").append('<button id="pin_'+index+'" onmouseout="out_pin('+index+')" onmouseover="hover_pi('+index+')" class="item_pin btn btn-sm" onclick="set_pin('+index+')">'+list_pin[index]+'</button>');
    });
    check_show_sel_pin(index_cur_pin);
}

function hover_pi(index){
    var s_class=list_pin_id[index];
    $("."+s_class).addClass("call");
    $("#info").html("🔆 Pin : "+list_pin[index]+" "+$("."+s_class).length);
}

function out_pin(index){
    var s_class=list_pin_id[index];
    $("."+s_class).removeClass("call");
    load_info();
}

function set_pin(index){
    index_cur_pin=index;
    check_show_sel_pin(index);
}

function check_show_sel_pin(index){
    $(".item_pin").removeClass("sel");
    $("#pin_"+index).addClass("sel");
}

function load_table_pi_by_id(id){
    id_table=id;
    document.title=id;
    load_pi();
}

function export_data(){
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage.json';
    a.click();
    URL.revokeObjectURL(url);
}

function import_data(){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
            alert('Local Storage has been imported.');
        };
        reader.readAsText(file);
    };
    input.click();
}

function startCountdown(index, existingEndTime = null) {
    let interval=null;
    let countDownTime;

    if (existingEndTime) {
    countDownTime = existingEndTime.getTime();
    } else {
    if(interval!=null) clearInterval(interval);
    const now = new Date().getTime();
    countDownTime = now + (24 * 60 * 60 * 1000);
    localStorage.setItem(id_table+"_pi_"+index+"_timer", countDownTime);
    }
    let countdownDiv = $("#timer_"+index);

    function updateCountdown() {
    const now = new Date().getTime();
    const distance = countDownTime - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        clearInterval(interval);
        $(countdownDiv).html("✅Exploit");
    }else{
        $(countdownDiv).html(`${hours}:${minutes}:${seconds}`);
    }
    }

    interval = setInterval(updateCountdown, 1000);
}

function show_setting(){
    var html='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg><br/><h3>Setting</h3>';
    html+='<div class="row">';
        html+='<div class="col-8">Button to mark the list of objects</div>';
        html+='<div class="col-4">';
            html+='<select id="pos_btn_add" class="form-control">';
                html+='<option value="right" '+(position_btn_add==='right' ? ' selected' : '') +'>Right</option>';
                html+='<option value="left" '+(position_btn_add==='left' ? ' selected' : '') +'>Left</option>';
                html+='<option value="none" '+(position_btn_add==='none' ? ' selected' : '') +'>None</option>';
            html+='</select>';
        html+='</div>';
    html+='</div>';
    Swal.fire({html:html,showCancelButton: true}).then((result) => {
        if (result.isConfirmed) {
            position_btn_add=$("#pos_btn_add").val();
            localStorage.setItem('pos_btn_add',position_btn_add);
            
            Swal.fire({
                title: "Save setting!",
                text: "Update installed successfully!",
                icon: "success"
            });

            load_list();
            load_pi();
        }
    });
}

