class Attendance {
    list_table = null;
    list_pin = ["🤍", "🔴", "🧡", "💙", "💜", "💚"];
    list_pin_color=["#bedfff","#f70000","#f77200","#075ddf","#681bff","#22a900"];
    list_pin_id = ["none", "check", "alert", "info", "memory", "success"];
    list_total = [200, 350, 400, 450, 500];

    id_table = "work";
    index_cur = 0;
    index_cur_pin = 1;
    length_pi = 500;
    position_btn_add = 'right';
    setting_show_timer = 'show';
    fnc_click_box = 'timer_pin';
    menu_cur='';

    onLoad(){
        $("#menu_info").hide();
        if (localStorage.getItem("pos_btn_add") != null) this.position_btn_add = localStorage.getItem("pos_btn_add");
        if (localStorage.getItem("setting_show_timer") != null) this.setting_show_timer = localStorage.getItem("setting_show_timer");
        if (localStorage.getItem("id_table") != null) this.id_table = localStorage.getItem("id_table");
        a.load_list();
        a.load_pi();
    }

    act_menu(id){
        $(".m-menu").removeClass("active");
        $("#"+id).addClass("active");
        this.menu_cur=id;
    }

    load_pi() {
        $("#pi").html("");
        $("#id_table").html(a.id_table);
        $("#length_item_table").html(a.length_pi);
        if (localStorage.getItem(this.id_table + "_lenth_app") != null)
            this.length_pi = parseInt(localStorage.getItem(this.id_table + "_lenth_app"));
        else
            this.length_pi = 500;

        $("#list_total").val(this.length_pi);

        var html_pi = '';
        var css_col_boy = 'col-11 col-md-11';

        if (this.position_btn_add == 'none') css_col_boy = 'col-12 col-md-12';
        if (this.position_btn_add == 'left') html_pi += '<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="a.add_pi()" oncontextmenu="a.add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';
        html_pi += '<div class="' + css_col_boy + ' col-xs-12 col-sm-12" id="all_item"></div>';
        if (this.position_btn_add == 'right') html_pi += '<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="a.add_pi()" oncontextmenu="a.add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';

        $("#pi").html(html_pi);

        for (let pi = 1; pi <= this.length_pi; pi++) {
            var item_box=this.box_item(pi);
            $(item_box).click(()=>{
                a.click_box_obj(pi);
                return false;
            });
            $("#all_item").append(item_box);
        }
       
        if (this.setting_show_timer == "show") {
            for (var pi = 1; pi <= this.length_pi; pi++) {
                const endTime = localStorage.getItem(this.id_table + "_pi_" + pi + "_timer");
                if (endTime) {
                    this.startCountdown(pi, new Date(parseInt(endTime)));
                }
            }
        }
        this.load_info();
    }

    box_item(pi){
        var html='';
        var s_class="";
        let s_tip='';
        let name_object=localStorage.getItem(a.id_table+"_name_"+pi);
        if(name_object!=null) s_tip+='title="'+name_object+'"';
        if (localStorage.getItem(this.id_table + "_pi_" + pi) != null) {
                var index_p = parseInt(localStorage.getItem(this.id_table + "_pi_" + pi));
                s_class = "sel " + this.list_pin_id[index_p];
        }

        html+="<div id='box_" + pi + "' "+s_tip+" class='box " + s_class + "' index='" + pi + "'>";
        html+='<span class="name">'+pi+'</span>';
        if (this.setting_show_timer == "show") html += "<span id='timer_" + pi + "' class='timer'>None ☢</span>";
        if(localStorage.getItem(a.id_table+"_link_"+pi)!=null){
            var link_web=localStorage.getItem(a.id_table+"_link_"+pi);
            html+='<i class="fas fa-link m-1" style="font-size:8px" title="'+link_web+'"></i>';
        }
        for(let i=0;i<a.list_pin.length;i++){
            if(localStorage.getItem(a.id_table + "_pi_" + pi+"_"+i) != null) html+='<i class="fas fa-thumbtack fa-rotate-by m-1" style="--fa-rotate-angle: 40deg;font-size:8px"></i>';
        }
        html+="</div>";
        return $(html);
    }

    click_box_obj(index) {
        if (this.index_cur_pin == 0) {
            $("#box_" + index).removeClass("sel");
            localStorage.removeItem(this.id_table + "_pi_" + index);
        } else {
            if ($("#box_" + index).hasClass("sel")) {
                $("#box_" + index).removeClass("sel");
                localStorage.removeItem(this.id_table + "_pi_" + index);
            } else {
                $("#box_" + index).addClass("sel " + this.list_pin_id[this.index_cur_pin]);
                localStorage.setItem(this.id_table + "_pi_" + index, this.index_cur_pin);
            }

            if (!$("#box_" + index).hasClass("blink")) {
                this.startCountdown(index);
            } else {
                $("#box_" + index).removeClass("blink");
                this.startCountdown(index);
            }
        }
        this.index_cur = index;
        this.show_info(index);
        this.load_info();
    }

    del_pin_box(index) {
        $("#box_" + index).removeClass("sel");
        localStorage.removeItem(this.id_table + "_pi_" + index);
        this.load_info();
    }

    set_pin_box(index_pin) {
        $("#box_" + a.index_cur).addClass("sel " + a.list_pin_id[index_pin]);
        localStorage.setItem(a.id_table + "_pi_" + a.index_cur+"_"+index_pin,1);
        a.load_info();
    }

    delete_all() {
        this.index_cur = 0;
        for (var i = 1; i <= 500; i++) {
            localStorage.removeItem(this.id_table + "_pi_" + i);
            localStorage.removeItem(this.id_table + "_pi_pin_" + i);
        }
        this.load_pi();
    }

    delete_all_time() {
        for (var i = 1; i <= 500; i++) {
            localStorage.removeItem(this.id_table + "_pi_" + i + "_timer");
        }
        this.load_pi();
    }

    delete_cur_time() {
        localStorage.removeItem(this.id_table + "_pi_" + this.index_cur + "_timer");
        this.load_pi();
    }

    add_pi() {
        this.index_cur++;
        if (this.index_cur_pin == 0) {
            localStorage.removeItem(this.id_table + "_pi_" + this.index_cur);
        } else {
            localStorage.setItem(this.id_table + "_pi_" + this.index_cur, this.index_cur_pin);
        }
        this.load_pi();
    }

    add_pi_pin() {
        this.index_cur++;
        localStorage.setItem(this.id_table + "_pi_pin_" + this.index_cur, "1");
        this.load_pi();
    }

    load_info() {
        var count_ready = 0;
        var count_pin = 0;
        for (var pi = 1; pi <= this.length_pi; pi++) {
            if (localStorage.getItem(this.id_table + "_pi_" + pi) != null) count_ready++;
        }
        $("#info").html("🎯:" + this.index_cur + " 💎:" + count_ready + " 👒:" + (this.length_pi - count_ready) + " 📌:" + count_pin);
    }

    add_list() {
        cr.input("Add table","Name new table",(val)=>{
            a.list_table.push(val);
            localStorage.setItem("list_table", JSON.stringify(this.list_table));
            cr.msg("Add table success!!!","New Table","success");
            a.load_list();
        });
    }

    load_list() {
        if (localStorage.getItem("list_table") != null) this.list_table = JSON.parse(localStorage.getItem("list_table"));
        else this.list_table = ["work"];

        $("#list_table").empty();
        $(this.list_table).each(function (index, l) {
            let item_list_table=$('<a class="dropdown-item item_table" href="#"  onclick="a.load_table_pi_by_id(\'' + l + '\');return false;"><i class="fas fa-table"></i> '+l+'</a>');
            $("#list_table").append(item_list_table);
        });
        let item_add_table=$('<a class="dropdown-item" href="#"><i class="fas fa-plus-square"></i> Add Table</a>');
        $(item_add_table).click(function(){ a.add_list();});
        $("#list_table").append(item_add_table);

        $("#list_total").empty();
        $(this.list_total).each(function (index, c) {
            let item_list_amount=$('<a class="dropdown-item item_table" href="#"  onclick="a.change_amount(\''+c+'\');return false;"><i class="fas fa-border-all"></i> '+c+'</a>');
            $("#list_total").append(item_list_amount);
        });
        let item_add_amount=$('<a class="dropdown-item" href="#"><i class="fas fa-plus-square"></i> Add Amount</a>');
        $(item_add_amount).click(a.show_change_amount);
        $("#list_total").append(item_add_amount);

        $("#list_pin").html("");
        $(this.list_pin).each(function (index, p) {
            let item_list_pin=$('<a id="pin_' + index + '" onmouseout="a.out_pin(' + index + ')" class="dropdown-item item_pin" href="#"  onclick="a.set_pin(' + index + ');return false;"><i class="fas fa-thumbtack" style="color:'+a.list_pin_color[index]+'"></i> Pin '+(index+1)+'</a>');
            $("#list_pin").append(item_list_pin);
        });
        this.check_show_sel_pin(this.index_cur_pin);
    }

    show_change_amount(){
        cr.input("Number of elements","Enter the number of elements you want to contain in the table",(val)=>{
            a.change_amount(val);
        });
    }

    change_amount(val){
        localStorage.setItem(a.id_table + "_lenth_app", val);
        a.length_pi = parseInt(val);
        a.load_pi();
    }

    hover_pi(index) {
        var s_class = this.list_pin_id[index];
        $("." + s_class).addClass("call");
        $("#info").html("🔆 Pin : " + this.list_pin[index] + " " + $("." + s_class).length);
    }

    out_pin(index) {
        var s_class = this.list_pin_id[index];
        $("." + s_class).removeClass("call");
        this.load_info();
    }

    set_pin(index) {
        this.index_cur_pin = index;
        this.check_show_sel_pin(index);
    }

    check_show_sel_pin(index) {
        $(".item_pin").removeClass("active");
        $("#pin_" + index).addClass("active");
        $("#icon_pin_sel").css("color",a.list_pin_color[index]);
    }

    load_table_pi_by_id(id) {
        this.id_table = id;
        localStorage.setItem("id_table",id);
        document.title = id;
        this.load_pi();
    }

    export_data() {
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

    import_data() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
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

    startCountdown(index, existingEndTime = null) {
        let interval = null;
        let countDownTime;

        if (existingEndTime) {
            countDownTime = existingEndTime.getTime();
        } else {
            if (interval != null) clearInterval(interval);
            const now = new Date().getTime();
            countDownTime = now + (24 * 60 * 60 * 1000);
            localStorage.setItem(this.id_table + "_pi_" + index + "_timer", countDownTime);
        }
        let countdownDiv = $("#timer_" + index);

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countDownTime - now;

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval);
                $(countdownDiv).html("✅Exploit");
                $("#box_" + index).addClass("blink");
            } else {
                $(countdownDiv).html(`${hours}:${minutes}:${seconds}`);
            }
        }
        interval = setInterval(updateCountdown, 1000);
    }

    show_setting() {
        var html = '';

        html+='<div class="form-group">';
            html+='<label for="setting_show_timer"><i class="fas fa-mouse"></i> Set Click method</label>';
            html += '<select id="fnc_click_box" class="form-control">';
            html += '<option value="timer_pin" ' + (this.fnc_click_box === 'timer_pin' ? ' selected' : '') + '>Set pin and run timer</option>';
            html += '<option value="pin" ' + (this.fnc_click_box === 'pin' ? ' selected' : '') + '>Pin only</option>';
            html += '<option value="timer" ' + (this.fnc_click_box === 'timer' ? ' selected' : '') + '>Run countdown timer</option>';
            html += '<option value="none" ' + (this.fnc_click_box === 'none' ? ' selected' : '') + '>Do nothing</option>';
            html += '</select>';
            html+='<small class="form-text text-muted">Function when clicking on an item in the table</small>';
        html+='</div>';

        html+='<div class="form-group">';
            html+='<label for="setting_show_timer"><i class="fas fa-calendar-plus"></i> Button to mark the list of objects</label>';
            html += '<select id="pos_btn_add" class="form-control">';
            html += '<option value="right" ' + (this.position_btn_add === 'right' ? ' selected' : '') + '>Right</option>';
            html += '<option value="left" ' + (this.position_btn_add === 'left' ? ' selected' : '') + '>Left</option>';
            html += '<option value="none" ' + (this.position_btn_add === 'none' ? ' selected' : '') + '>None</option>';
            html += '</select>';
            html+='<small class="form-text text-muted">Turn countdown timer on or off</small>';
        html+='</div>';
    
        html+='<div class="form-group">';
            html+='<label for="setting_show_timer"><i class="fas fa-stopwatch"></i> Show Timer</label>';
            html += '<select id="setting_show_timer" class="form-control">';
            html += '<option value="show" ' + (this.setting_show_timer === 'show' ? ' selected' : '') + '>Show</option>';
            html += '<option value="hide" ' + (this.setting_show_timer === 'hide' ? ' selected' : '') + '>Hide</option>';
            html += '</select>';
            html+='<small class="form-text text-muted">Turn countdown timer on or off</small>';
        html+='</div>';

        html+='<div class="form-group">';
            html+='<label for="length_pi"><i class="fas fa-table"></i> Number of elements</label>';
            html+='<input class="form-control" id="length_pi" value="' + this.length_pi + '"/>';
            html+='<small class="form-text text-muted">Enter the number of elements you want to contain in the table</small>';
        html+='</div>';

        cr.show_setting((setting)=>{
            a.position_btn_add = $("#pos_btn_add").val();
            a.fnc_click_box=$("#fnc_click_box").val();
            a.setting_show_timer = $("#setting_show_timer").val();
            a.length_pi = parseInt($("#length_pi").val());

            localStorage.setItem('pos_btn_add', a.position_btn_add);
            localStorage.setItem("setting_show_timer", a.setting_show_timer);
            localStorage.setItem(a.id_table + "_lenth_app", a.length_pi);

            Swal.fire({
                title: "Save setting!",
                text: "Update installed successfully!",
                icon: "success"
            });

            if(a.menu_cur=="m-pp") a.show_pp();
            else if(a.menu_cur=="m-tos") a.show_tos();
            else{
                a.load_list();
                a.load_pi();
            }

        },html)
    }

    edit_object() {
        var s_val = '';
        if (localStorage.getItem(this.id_table + "_app_id_" + this.index_cur) != null) s_val = localStorage.getItem(this.id_table + "_app_id_" + this.index_cur);
        cr.input("Edit Object","Enter the name of a person, event, or object here. ("+this.index_cur+")",(o_name)=>{
            localStorage.setItem(this.id_table + "_name_" + this.index_cur, o_name);
            cr.msg("Update object successfully (" + o_name + ")!", "Save Object!","success");
            a.show_info(this.index_cur);
            a.load_pi();
        });
    }

    edit_app() {
        var s_val = '';
        if (localStorage.getItem(this.id_table + "_app_id_" + this.index_cur) != null) s_val = localStorage.getItem(this.id_table + "_app_id_" + this.index_cur);
        cr.input("Edit App","Enter the app's package id for ("+this.index_cur+")",(app_id)=>{
            localStorage.setItem(this.id_table + "_app_id_" + this.index_cur, app_id);
            cr.msg("Update installed successfully app id(" + app_id + ")!", "Save setting!","success");
            a.show_info(this.index_cur);
            a.load_pi();
        });
    }

    edit_link(){
        var s_val = '';
        if (localStorage.getItem(this.id_table + "_link_" + this.index_cur) != null) s_val = localStorage.getItem(this.id_table + "_link_" + this.index_cur);
        cr.input("Edit Link","Enter the link corresponding to the object ("+this.index_cur+")",(link_obj)=>{
            localStorage.setItem(a.id_table + "_link_" + a.index_cur, link_obj);
            cr.msg("Link updated successfully!","Update Link","success");
            a.show_info(a.index_cur);
            a.load_pi();
        },s_val);
    }

    show_info(index) {
        var html_info = '';
        html_info += '<li class="nav-item">';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.show_detai_cur();"><i class="fas fa-info-circle"></i> Info(' + this.index_cur + ')</button>';
        if (localStorage.getItem(this.id_table + "_app_id_" + index) != null) {
            var intentUrl = "intent://open#Intent;scheme=" + localStorage.getItem(this.id_table + "_app_id_" + index) + ";package=" + localStorage.getItem(this.id_table + "_app_id_" + index) + ";end";
            html_info += '<button class="btn btn-sm  btn-dark" onclick="a.open_app_by_index_cur();"><i class="fas fa-rocket"></i> Open App</button>';
            html_info += '<a href="' + intentUrl + '"><i class="fas fa-rocket"></i> Open App2</a>';
        }
        for(let i=0;i<a.list_pin.length;i++){
            let s_class="";
            if(localStorage.getItem(a.id_table + "_pi_" + index+"_"+i) != null) s_class="active";
            html_info += '<button class="btn btn-sm '+s_class+' btn-dark" onclick="a.set_pin_box(' + i + ');return false;"><i class="fas fa-thumbtack" style="color:'+a.list_pin_color[i]+'"></i></button>';
        }

        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.del_pin_box('+index+');"><i class="fas fa-backspace"></i> Delete Pin</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.edit_link();"><i class="fas fa-link"></i> Edit Link</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.edit_app();"><i class="fas fa-rocket"></i> Edit App</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.edit_object();"><i class="fas fa-user-edit"></i> Edit Object</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.delete_cur_time()"><i class="fas fa-calendar-times"></i> Delete Curent Timer</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="$(\'#menu_info\').hide();"><i class="fas fa-times-circle"></i> Close</button>';
        html_info += '</li>';
        $("#menu_info").show();
        $("#menu_info").html(html_info);
    }

    open_app_by_index_cur() {
        var intentUrl = "intent://open#Intent;scheme=blockchainvaulu;package=com.blockchainvaulu;end";
        alert(intentUrl);
    }

    show_detai_cur() {
        var html = '';
        html += this.index_cur;
        Swal.fire({ title: "🐟 " + a.index_cur, html: html });
    }

    show_pp(){
        this.act_menu("m-pp");
        cr.top();
        cr.show_pp("#pi");
    }

    show_tos(){
        this.act_menu("m-tos");
        cr.top();
        cr.show_tos("#pi");
    }
}

var a;

$(document).ready(function () {
    a = new Attendance();
    a.onLoad();
    cr.onLoad();
    cr.setSiteName("Attendance");
    cr.setColor("#715cf1");
    cr.add_btn_top();
    cr.setSiteUrl("https://attendance-orpin-five.vercel.app");
});