var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.requestAnimationFrame;

function connectHandler(e) {
    addGamepad(e.gamepad);
}
function addGamepad(gamepad) {
    // gamepadのArrayを作成
    controllers[gamepad.index] = gamepad;
    // HTMLへ接続されたGamepad毎の要素を追加（複数のgamepadにも対応）
    var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);//idはpadの番号がついた形式
    var t = document.createElement("h2");
    t.appendChild(document.createTextNode("接続Gamepad情報: "));
    d.appendChild(t);
    var info = document.createElement("h1");
    info.appendChild(document.createTextNode(gamepad.id));
    d.appendChild(info);

    //Gamepadコントロール要素（ボタンなど）表示部分
    var b = document.createElement("div");
    b.className = "buttons";
    var t = document.createElement("h2");
    t.appendChild(document.createTextNode("ボタンコントロール情報: "));
    b.appendChild(t);
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        //e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }
    d.appendChild(b);

    //Gamepadコントロール要素（アナログジョイなど）表示部分
    var a = document.createElement("div");
    a.className = "axes";
    var t = document.createElement("h2");
    t.appendChild(document.createTextNode("アナログコントロール情報: "));
    a.appendChild(t);
    for (i = 0; i < gamepad.axes.length; i++) {
        c = document.createElement("h3");
        c.appendChild(document.createTextNode("axis" + i));
        a.appendChild(c);
        e = document.createElement("meter");
        e.className = "axis";
        //e.id = "a" + i;
        e.setAttribute("min", "-1");
        e.setAttribute("max", "1");
        e.setAttribute("value", "0");
        e.innerHTML = i;
        a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById("start").style.display = "none";
    document.body.appendChild(d);
    rAF(updateStatus);
}

function disconnectHandler(e) {
    removeGamepad(e.gamepad);
}

function removeGamepad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
}

function updateStatus() {
    scanGamepads();
    for (j in controllers) {
        var controller = controllers[j];
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");

        //ボタン情報の状態取得
        for (var i = 0; i < controller.buttons.length; i++) {
            var b = buttons[i];
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof (val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }
            var pct = Math.round(val * 100) + "%";
            b.style.backgroundSize = pct + " " + pct;
            if (pressed) {
                b.className = "button pressed";
            } else {
                b.className = "button";
            }
        }

        //アナログコントロール情報の状態取得
        var axes = d.getElementsByClassName("axis");
        for (var i = 0; i < controller.axes.length; i++) {
            var a = axes[i];
            a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
            a.setAttribute("value", controller.axes[i]);
        }
    }
    rAF(updateStatus);
}

function scanGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (!(gamepads[i].index in controllers)) {
                addGamepad(gamepads[i]);
                console.log("a");
            } else {
                controllers[gamepads[i].index] = gamepads[i];
                //console.log("b");
            }
        }
    }
}

if (haveEvents) {
    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);
} else {
    setInterval(scanGamepads, 500);
}
