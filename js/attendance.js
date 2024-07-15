class Attendance {
    list_table = null;
    list_pin = ["🤍", "🔴", "🧡", "💙", "💜", "💚"];
    list_pin_id = ["none", "check", "alert", "info", "memory", "success"];
    list_total = [200, 350, 400, 450, 500];

    id_table = "pi_work";
    index_cur = 0;
    index_cur_pin = 1;
    length_pi = 500;
    position_btn_add = 'right';
    setting_show_timer = 'show';

    onLoad(){
        $("#menu_info").hide();
        if (localStorage.getItem("pos_btn_add") != null) this.position_btn_add = localStorage.getItem("pos_btn_add");
        if (localStorage.getItem("setting_show_timer") != null) this.setting_show_timer = localStorage.getItem("setting_show_timer");
        a.load_list();
        a.load_pi();
    }

    load_pi() {
        $("#pi").html("");
        if (localStorage.getItem(this.id_table + "_lenth_app") != null)
            this.length_pi = parseInt(localStorage.getItem(this.id_table + "_lenth_app"));
        else
            this.length_pi = 500;

        $("#list_total").val(this.length_pi);

        var html_pi = '';
        var css_col_boy = 'col-11 col-md-11';

        if (this.position_btn_add == 'none') css_col_boy = 'col-12 col-md-12';
        if (this.position_btn_add == 'left') html_pi += '<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="a.add_pi()" oncontextmenu="a.add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';

        html_pi += '<div class="' + css_col_boy + ' col-xs-12 col-sm-12">';
        for (var pi = 1; pi <= this.length_pi; pi++) {
            var s_class = "";
            if (localStorage.getItem(this.id_table + "_pi_" + pi) != null) {
                var index_p = parseInt(localStorage.getItem(this.id_table + "_pi_" + pi));
                s_class = "sel " + this.list_pin_id[index_p];
            }

            html_pi += "<div id='box_" + pi + "' class='box " + s_class + "' index='" + pi + "'><span class='name'>" + pi + "</span>";
            if (this.setting_show_timer == "show") html_pi += "<span id='timer_" + pi + "' class='timer'>None ☢</span>";
            html_pi += "</div>";
        }
        html_pi += '</div>';

        if (this.position_btn_add == 'right') html_pi += '<div id="btn_add_pi_auto" class="col-1 col-md-1 col-xs-12 col-sm-12 text-center" onclick="a.add_pi()" oncontextmenu="a.add_pi_pin();return false;" style="cursor: pointer;text-align: center;background-color: rgb(197, 248, 156);" ></div>';

        $("#pi").html(html_pi);

        if (this.setting_show_timer == "show") {
            for (var pi = 1; pi <= this.length_pi; pi++) {
                const endTime = localStorage.getItem(this.id_table + "_pi_" + pi + "_timer");
                if (endTime) {
                    this.startCountdown(pi, new Date(parseInt(endTime)));
                }
            }
        }

        $(".box").click(function () {
            var index = $(this).attr("index");
            a.click_box_obj(index);
        });

        this.load_info();
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

    set_pin_box(index) {
        $("#box_" + index).addClass("sel " + this.list_pin_id[this.index_cur_pin]);
        localStorage.setItem(this.id_table + "_pi_" + index, this.index_cur_pin);
        this.load_info();
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
        var name_new = prompt("Name new table");
        if (name_new.trim() == "") {
            alert("Name table not nu!!");
            return false;
        }

        this.list_table.push(name_new);
        localStorage.setItem("list_table", JSON.stringify(this.list_table));
        alert("Add table success!!!");
        this.load_list();
    }

    load_list() {
        if (localStorage.getItem("list_table") != null) this.list_table = JSON.parse(localStorage.getItem("list_table"));
        else this.list_table = ["pi_work"];

        $("#list_table").empty();
        $(this.list_table).each(function (index, l) {
            $("#list_table").append(new Option("📟 " + l, l));
        });

        $("#list_table").change(function () {
            var val = $(this).val();
            a.load_table_pi_by_id(val);
        });

        $("#list_total").empty();
        $(this.list_total).each(function (index, c) {
            $("#list_total").append(new Option("🏀 " + c, c));
        });

        $("#list_total").change(function () {
            var val = $(this).val();
            localStorage.setItem(a.id_table + "_lenth_app", val);
            a.length_pi = parseInt(val);
            a.load_pi();
        });

        $("#list_pin").html("");
        $(this.list_pin).each(function (index, p) {
            $("#list_pin").append('<button id="pin_' + index + '" onmouseout="a.out_pin(' + index + ')" onmouseover="a.hover_pi(' + index + ')" class="item_pin btn btn-sm" onclick="a.set_pin(' + index + ')">' + a.list_pin[index] + '</button>');
        });
        this.check_show_sel_pin(this.index_cur_pin);
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
        $(".item_pin").removeClass("sel");
        $("#pin_" + index).addClass("sel");
    }

    load_table_pi_by_id(id) {
        this.id_table = id;
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
        var html = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg><br/><h3>Setting</h3>';
        html += '<div class="row text-left">';
        html += '<div class="col-8 text-left">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-plus-fill" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5m6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5z"/></svg> ';
        html += 'Button to mark the list of objects';
        html += '</div>';
        html += '<div class="col-4">';
        html += '<select id="pos_btn_add" class="form-control">';
        html += '<option value="right" ' + (this.position_btn_add === 'right' ? ' selected' : '') + '>Right</option>';
        html += '<option value="left" ' + (this.position_btn_add === 'left' ? ' selected' : '') + '>Left</option>';
        html += '<option value="none" ' + (this.position_btn_add === 'none' ? ' selected' : '') + '>None</option>';
        html += '</select>';
        html += '</div>';
        html += '</div>';

        html += '<div class="row">';
        html += '<div class="col-8 text-left">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/></svg> Show Timer';
        html += '</div>';
        html += '<div class="col-4">';
        html += '<select id="setting_show_timer" class="form-control">';
        html += '<option value="show" ' + (this.setting_show_timer === 'show' ? ' selected' : '') + '>Show</option>';
        html += '<option value="hide" ' + (this.setting_show_timer === 'hide' ? ' selected' : '') + '>Hide</option>';
        html += '</select>';
        html += '</div>';
        html += '</div>';

        html += '<div class="row">';
        html += '<div class="col-8 text-left">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grid-3x3-gap-fill" viewBox="0 0 16 16"><path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/></svg> Length';
        html += '</div>';
        html += '<div class="col-4">';
        html += '<input class="form-control" id="length_pi" value="' + this.length_pi + '"/>';
        html += '</div>';
        html += '</div>';

        Swal.fire({ html: html, showCancelButton: true }).then((result) => {
            if (result.isConfirmed) {
                a.position_btn_add = $("#pos_btn_add").val();
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

                this.load_list();
                this.load_pi();
            }
        });
    }

    edit_app() {
        var s_val = '';
        if (localStorage.getItem(this.id_table + "_app_id_" + this.index_cur) != null) s_val = localStorage.getItem(this.id_table + "_app_id_" + this.index_cur);

        Swal.fire({
            title: "Enter the app's package id for ("+this.index_cur+")",
            inputValue: s_val,
            input: "text",
            showCancelButton: true,
            preConfirm: async (app_id) => {
                localStorage.setItem(this.id_table + "_app_id_" + this.index_cur, app_id);
                Swal.fire({
                    title: "Save setting!",
                    text: "Update installed successfully app id(" + app_id + ")!",
                    icon: "success"
                });
                a.show_info(this.index_cur);
            }
        })
    }

    show_info(index) {
        var html_info = '';
        html_info += '<li class="nav-item">';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.show_detai_cur();">🥽 ' + this.index_cur + '</button>';
        if (localStorage.getItem(this.id_table + "_app_id_" + index) != null) {
            var intentUrl = "intent://open#Intent;scheme=" + localStorage.getItem(this.id_table + "_app_id_" + index) + ";package=" + localStorage.getItem(this.id_table + "_app_id_" + index) + ";end";
            html_info += '<button class="btn btn-sm  btn-dark" onclick="a.open_app_by_index_cur();">🚀 Open App</button>';
            html_info += '<a href="' + intentUrl + '">🚀 Open App2</a>';
        }
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.set_pin_box(' + index + ');">' + this.list_pin[this.index_cur_pin] + ' Set Pin</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.del_pin_box(' + index + ');">' + this.list_pin[0] + ' Delete Pin</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.edit_app();">👔 Edit App</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="a.delete_cur_time()">❌ Delete Curent Timer</button>';
        html_info += '<button class="btn btn-sm  btn-dark" onclick="$(\'#menu_info\').hide();">🎱 Close</button>';
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
        cr.top();
        cr.show_pp("#pi");
    }

    show_tos(){
        cr.top();
        cr.show_tos("#pi");
    }
}

var a;

$(document).ready(function () {
    a = new Attendance();
    a.onLoad();
    cr.onLoad();
});