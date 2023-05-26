/*
 * Author:      Marco Kuiper (http://www.marcofolio.net/)
 */
// google.load("jquery", "1.3.1");
// google.load("jqueryui", "1.7.0");
// google.setOnLoadCallback(function()
// {
// ロードされた際に自動で配置するプログラム
$(".polaroid").each(function (i) {
  var tempVal = Math.round(Math.random());
  if (tempVal == 1) {
    var rotDegrees = randomXToY(330, 360); // rotate left
  } else {
    var rotDegrees = randomXToY(0, 30); // rotate right
  }

  // Internet Explorerの場合、実行されないため保険のプログラム
  if (window.innerWidth == undefined) {
    var wiw = 1000;
    var wih = 700;
  } else {
    var wiw = document.getElementsByClassName("modal-content");
    var wih = document.getElementsByClassName("modal-content");
  }

  var cssObj = {
    left: Math.random() * (wiw - 400),
    top: Math.random() * (wih - 400),
    "-webkit-transform": "rotate(" + rotDegrees + "deg)", // safari only
    transform: "rotate(" + rotDegrees + "deg)",
  }; // added in case CSS3 is standard
  $(this).css(cssObj);
});

// ドラックされた際の先頭に表示する機能
var zindexnr = 1;

// ユーザーがドラック下か判断
var dragging = false;

// マウスを離した際の処理
$(".polaroid").mouseup(function (e) {
  if (!dragging) {
    // Bring polaroid to the foreground
    zindexnr++;
    var cssObj = {
      "z-index": zindexnr,
      transform: "rotate(0deg)", // added in case CSS3 is standard
      "-webkit-transform": "rotate(0deg)",
    }; // safari only
    $(this).css(cssObj);
  }
});

// ドラッグした際の処理
$(".polaroid").draggable({
  cursor: "crosshair",
  start: function (event, ui) {
    dragging = true;
    zindexnr++;
    var cssObj = {
      "box-shadow": "#888 5px 10px 10px", // added in case CSS3 is standard
      "-webkit-box-shadow": "#888 5px 10px 10px", // safari only
      "margin-left": "-10px",
      "margin-top": "-10px",
      "z-index": zindexnr,
    };
    $(this).css(cssObj);
  },
  stop: function (event, ui) {
    var tempVal = Math.round(Math.random());
    if (tempVal == 1) {
      var rotDegrees = randomXToY(330, 360); // rotate left
    } else {
      var rotDegrees = randomXToY(0, 30); // rotate right
    }
    var cssObj = {
      "box-shadow": "", // added in case CSS3 is standard
      "-webkit-box-shadow": "", // safari only
      transform: "rotate(" + rotDegrees + "deg)", // added in case CSS3 is standard
      "-webkit-transform": "rotate(" + rotDegrees + "deg)", // safari only
      "margin-left": "0px",
      "margin-top": "0px",
    };
    $(this).css(cssObj);
    dragging = false;
  },
});

// Function to get random number upto m
// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal, maxVal, floatVal) {
  var randVal = minVal + Math.random() * (maxVal - minVal);
  return typeof floatVal == "undefined"
    ? Math.round(randVal)
    : randVal.toFixed(floatVal);
}

// });
