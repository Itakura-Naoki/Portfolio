$("#send").click(function () {
  if ($("#flipbook").find("canvas").length) {
    $("#flipbook").children().remove();
  }
  const text = editor.getValue();
  console.log(text);
  $.ajax({
    type: "GET",
    url: "./run_java.php",
    data: {
      text: text,
    },
    caches: false,
  })
    .done((data) => {
      console.log("通信成功");
      console.log(data);
      var error_list = [];
      var process = [];
      var variable = [];
      var object_length;
      let jsondata = JSON.parse(data);

      console.log(jsondata);

      error_list = {
        detail: jsondata["error"]["detail"],
        num: jsondata["error"]["num"],
        origin: jsondata["error"]["origin"],
      };
      console.log(error_list);

      for (let i = 0; i < jsondata.process.length; i++) {
        process[i] = {
          process_num: jsondata["process"][i]["process_num"],
          error_num: jsondata["process"][i]["error_num"],
          variable_log_num: jsondata["process"][i]["variable_log_num"],
          math_num: jsondata["process"][i]["math_num"],
          math_result: jsondata["process"][i]["math_result"],
          output: jsondata["process"][i]["output"],
        };
      }
      console.log(process);
      for (let i = 0; i < Object.keys(jsondata.variable).length; i++) {
        variable[i] = {
          name: jsondata["variable"][i]["name"],
          type: jsondata["variable"][i]["type"],
          value_before: jsondata["variable"][i]["value_before"],
          value_after: jsondata["variable"][i]["value_after"],
        };
      }
      var object_length = jsondata.process.length;
      console.log(variable);

      // console.log(object_length);
      // console.log(process);
      // console.log(variable);
      var animation = [];
      var variable_num = 0;
      // var object_length = 0;
      // console.log(variable_num);
      // console.log(variable[variable_num].type);
      // let fruit = ['apple', 'melon', 'peach'];
      // console.log(error_list);
      for (var i = 1; i <= object_length; i++) {
        $("#flipbook").append(
          '<canvas id="myCanvas' + i + '" width="600" height="400"></canvas>'
        );
      }

      // if (error_list['num'] != 0) {
      //     var error = new error_class();
      //     window.addEventListener("load", error.init);
      // }
      // 1.
      // System.out.println("Hello World!!");

      // 2.
      // int number = 2;
      // System.out.println(number);

      // 3.
      // int number1 = 5;
      // double number2 = 2.2;
      // System.out.println(number1 + number2);

      for (var i = 0; i < object_length; i++) {
        // console.log(i);
        if (error_list["num"] != 0 && process[i].error_num != 0) {
          output_order = i + 1;
          animation.push(error);
          break;

          function error() {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            var stage = new createjs.Stage("myCanvas" + output_order);

            // var bg = new createjs.Shape();
            // bg.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
            // bg.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height); // 長方形を描画
            // stage.addChild(bg); // 表示リストに追加

            var bmp = new createjs.Bitmap("img/error2.png");
            // bmp.regX = 100;
            // bmp.regY = 200;
            bmp.scaleX = 0.66;
            bmp.scaleY = 0.8;
            bmp.x = 0;
            bmp.y = 0;
            stage.addChild(bmp);

            var t = new createjs.Text(
              error_list["detail"],
              "24px serif",
              "#f00"
            );
            t.x = stage.canvas.width / 10; // 画面中央から
            t.y = stage.canvas.height / 10 + 50; // 画面中央から
            stage.addChild(t);

            var t2 = new createjs.Text(
              error_list["origin"],
              "24px serif",
              "#f00"
            );
            t2.x = stage.canvas.width / 10; // 画面中央から
            t2.y = stage.canvas.height / 10; // 画面中央から
            stage.addChild(t2);

            createjs.Ticker.addEventListener("tick", stage);
          }
        } else if (process[i].process_num == 5) {
          output_order = i + 1;
          variable_num = i - 1;
          if (variable.length == 0) {
            var stage = new createjs.Stage("myCanvas" + output_order);
            var jsontext = process[i].output;
            // 出力のアニメーション
            // 円：数値型
            // 文字：四角
            // 小数：◇
            // 真偽：不明

            animation.push(output_string);
            // output_string_order = i + 1;
            // console.log(animation);
            function output_string() {
              // Stageオブジェクトを作成。表示リストのルートになります。

              // テキストを作成します

              var t = new createjs.Container();
              t.x = stage.canvas.width / 2;
              t.y = stage.canvas.height / 2;
              t.rotation = 0;
              stage.addChild(t); // 画面に追加
              var circle1 = new createjs.Shape();
              var circlex = 100;
              var circley = 50;
              circle1.graphics.beginFill("DarkRed");
              circle1.graphics.drawRect(0, 0, circlex, circley); //四角形
              circle1.regX = circlex / 2;
              circle1.regY = circley / 2;
              circle1.y = 0;
              var text = new createjs.Text(jsontext, "16px serif", "black");
              text.textAlign = "center";
              text.x = 0;
              text.y = 0;
              t.addChild(circle1);
              t.addChild(text);

              // Stageの描画を更新
              createjs.Ticker.timingMode = createjs.Ticker.RAF;
              createjs.Ticker.addEventListener("tick", handleTick);
              function handleTick() {
                setInterval(alphatext, 0);
                if (t.rotation < 1440) {
                  t.rotation = t.rotation + 8;
                  t.scaleX = t.scaleY = t.scaleX + 0.02;
                }
                stage.update();
              }
              var opacity_result1 = 0;
              function alphatext() {
                t.alpha = opacity_result1 + 0.00001;
                opacity_result1 = opacity_result1 + 0.00001;
              }
            }
          } else if (variable[variable_num].type == "int") {
            console.log('プロセスint');
            animation.push(output_int);

            output_int_order = i + 1;
            var jsontext = process[i].output;
            var variable_name = variable[variable_num].name;

            function output_int() {
              // Stageオブジェクトを作成。表示リストのルートになります。
              var stage = new createjs.Stage("myCanvas" + output_int_order);

              // テキストを作成します

              var t = new createjs.Container();
              t.x = stage.canvas.width / 2;
              t.y = stage.canvas.height / 2;
              t.rotation = 0;
              stage.addChild(t); // 画面に追加
              createjs.Ticker.timingMode = createjs.Ticker.RAF;
              // 1つ目のコンテナを作成
              var circle1 = new createjs.Shape();
              circle1.graphics.beginFill("DarkRed").drawCircle(0, 0, 40);
              circle1.y = 0;

              var text = new createjs.Text(
                variable_name,
                "16px serif",
                "black"
              );
              text.textAlign = "center";
              text.x = 0;
              text.y = -30;
              var text2 = new createjs.Text(jsontext, "32px serif", "black");
              text2.textAlign = "center";
              text2.x = 0;
              text2.y = 0;
              // 2つの円を親に追加
              t.addChild(circle1);
              t.addChild(text);
              t.addChild(text2);
              var angle = 0;
              var centerScale = 2.0;
              var range = 2.0;
              var speed = 0.01;
              // Stageの描画を更新
              createjs.Ticker.timingMode = createjs.Ticker.RAF;
              createjs.Ticker.addEventListener("tick", handleTick);
              function handleTick() {
                setInterval(alphatext, 0);
                if (t.rotation < 1440) {
                  t.rotation = t.rotation + 8;
                  t.scaleX = t.scaleY = t.scaleX + 0.02;
                }
                stage.update();
              }
              var opacity_result1 = 0;
              function alphatext() {
                t.alpha = opacity_result1 + 0.00001;
                opacity_result1 = opacity_result1 + 0.00001;
              }
              
            }
          } else if (variable[variable_num].type == "double") {
            // variable_num++;
            console.log('プロセス5');
            output_double_order = i + 1;
            var jsontext = process[i].output;
            var variable_name = variable[variable_num].name;

            animation.push(output_double);
            function output_double() {
              var stage = new createjs.Stage("myCanvas" + output_double_order);
              output_double_order = i + 1;
              var shapenum = 150;
              var t = new createjs.Container();
              t.x = stage.canvas.width / 2;
              t.y = stage.canvas.height / 2;
              t.rotation = 0;
              stage.addChild(t); // 画面に追加
              createjs.Ticker.timingMode = createjs.Ticker.RAF;
              var obj = new createjs.Shape();
              obj.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
              obj.graphics.moveTo(0, 0); // (0,0)座標から描き始める
              obj.graphics.lineTo(shapenum / 2, -shapenum / 2);
              obj.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
              obj.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
              obj.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
              obj.regX = shapenum / 2;
              obj.regY = 0;
              stage.addChild(obj);

              var text = new createjs.Text(
                variable_name,
                "16px serif",
                "black"
              );
              text.textAlign = "center";
              text.x = 0;
              text.y = -30;
              var text2 = new createjs.Text(jsontext, "32px serif", "black");
              text2.textAlign = "center";
              text2.x = 0;
              text2.y = 0;
              t.addChild(obj);
              t.addChild(text);
              t.addChild(text2);
              var angle = 0;
              var centerScale = 2.0;
              var range = 2.0;
              var speed = 0.01;
              // Stageの描画を更新
              createjs.Ticker.timingMode = createjs.Ticker.RAF;
              createjs.Ticker.addEventListener("tick", handleTick);
              function handleTick() {
                setInterval(alphatext, 0);
                if (t.rotation < 1440) {
                  t.rotation = t.rotation + 8;
                  t.scaleX = t.scaleY = t.scaleX + 0.008;
                }
                stage.update();
              }
              var opacity_result1 = 0;
              function alphatext() {
                t.alpha = opacity_result1 + 0.00001;
                opacity_result1 = opacity_result1 + 0.00001;
              }
            }
          }
        } else if (process[i].process_num == 3 || process[i].process_num == 2) {
          //宣言と代入
          // console.log(i);
          // window.addEventListener("load", assignment);
          createjs.Ticker.timingMode = createjs.Ticker.RAF; //アニメーションを滑らかに24fpsを実質60FPSに
          var a = 0;
          // var b = 1;
          // console.log(process[i].variable_log_num);

          // console.log(animation);
          var k = i + 1;
          // variable_count =  variable_num ;
          if (variable[process[i].variable_log_num].type == "int") {
            animation.push(assignment_int);
            // console.log(variable_num);
            function assignment_int() {
              // console.log("myCanvas" + k);
              var stage = new createjs.Stage("myCanvas" + k);
              var container2 = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container2.x = 0;
              container2.y = 0;

              stage.addChild(container2);
              // var shape2 = new createjs.Shape();
              // shape2.graphics.beginFill("red"); // 赤色で描画するように設定
              // shape2.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              // shape2.x = 300; // X 座標 200px の位置に配置
              // shape2.y = 0; // Y 座標 200px の位置に配置
              // console.log(variable[0].value_after);
              // console.log(variable[1].value_after);
              if (a == 0) {
                // console.log(variable_num);
                var t2 = new createjs.Text(
                  variable[variable_num].value_after,
                  "64px serif",
                  "black"
                );
                t2.textAlign = "center";
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                container2.addChild(t2);
              } else if (a == 1) {
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
                t2.graphics.drawRect(0, 0, 300, 100); // 長方形を描画
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                var t3 = new createjs.Text("4", "48px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2 + 150;
                t3.y = 40;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2 + 150;
                t4.y = 0;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
                container2.regX = 150;
                container2.regY = 50;
              } else if (a == 2) {
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed").drawCircle(0, 0, 60);
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                var t3 = new createjs.Text("4", "64px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2;
                t3.y = -10;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2;
                t4.y = -50;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
              } else if (a == 3) {
                var shapenum = 150;
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
                t2.graphics.moveTo(0, 0); // (0,0)座標から描き始める
                t2.graphics.lineTo(shapenum / 2, -shapenum / 2);
                t2.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
                t2.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
                t2.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
                t2.x = stage.canvas.width / 2;
                t2.regX = shapenum / 2;
                t2.regY = 0;
                var t3 = new createjs.Text("4", "64px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2;
                t3.y = -10;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2;
                t4.y = -50;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
              }

              // container2.addChild(shape2);

              createjs.Tween.get(container2) // ターゲットを指定
                .to({ y: stage.canvas.height / 2, alpha: 0.1 }, 2000)
                .call(circle);

              var container = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container.x = stage.canvas.width / 2;
              container.y = stage.canvas.height / 2;
              stage.addChild(container);
              // if (b[i] == 0) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("red"); // 赤色で描画するように設定
              //     shape.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              //     shape.x = 0; // X 座標 200px の位置に配置
              //     shape.y = 0; // Y 座標 200px の位置に配置
              // }
              // else if (b[i] == 1) {
              var shape = new createjs.Shape();
              shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 100);
              shape.x = 150;
              shape.y = 50;
              // }
              // else if (b[i] == 2) {
              //     var shapenum = 300;
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
              //     shape.graphics.moveTo(0, 0); // (0,0)座標から描き始める
              //     shape.graphics.lineTo(shapenum / 2, -shapenum / 2);
              //     shape.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
              //     shape.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
              //     shape.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
              //     shape.x = 150;
              //     shape.y = 50;
              //     shape.regX = shapenum / 2;
              //     shape.regY = 0;
              // }

              var t = new createjs.Text(
                variable[variable_num].name,
                "48px serif",
                "black"
              ); //文字変更前
              t.textAlign = "center";
              t.x = 150;
              t.y = 10;
              container.regX = 150;
              container.regY = 50;

              container.addChild(shape);
              container.addChild(t);
              // Stageの描画を更新します
              createjs.Ticker.addEventListener("tick", handleTick);

              function handleTick() {
                stage.update();
              }
            }

            function circle() {
              console.log();
              var stage = new createjs.Stage("myCanvas" + k);
              var container = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container.x = stage.canvas.width / 2;
              container.y = stage.canvas.height / 2;
              stage.addChild(container);
              // if (b == 0) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("red"); // 赤色で描画するように設定
              //     shape.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              //     shape.x = 0; // X 座標 200px の位置に配置
              //     shape.y = 0; // Y 座標 200px の位置に配置
              // }
              // else if (b == 1) {
              var shape = new createjs.Shape();
              shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 100);
              shape.x = 150;
              shape.y = 50;
              // }
              // else if (b == 2) {
              //     var shapenum = 300;
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
              //     shape.graphics.moveTo(0, 0); // (0,0)座標から描き始める
              //     shape.graphics.lineTo(shapenum / 2, -shapenum / 2);
              //     shape.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
              //     shape.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
              //     shape.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
              //     shape.x = 150;
              //     shape.y = 50;
              //     shape.regX = shapenum / 2;
              //     shape.regY = 0;
              // }

              var t = new createjs.Text(
                variable[variable_num].name,
                "48px serif",
                "black"
              );
              t.textAlign = "center";
              t.x = 150;
              t.y = 10;

              container.addChild(shape);
              container.addChild(t);
              console.log(variable_num);
              var text = new createjs.Text(
                variable[variable_num].value_after,
                "24px serif",
                "black"
              );
              text.textAlign = "center";
              text.x = stage.canvas.width / 2;
              text.y = stage.canvas.height / 2;

              var angle = 0;
              var centerScale = 1.0;
              var range = 2.0;
              var speed = 0.05;
              stage.addChild(text);

              container.regX = 150;
              container.regY = 50;
              createjs.Ticker.addEventListener("tick", handleTick);
              function handleTick() {
                text.scaleX = text.scaleY =
                  centerScale + Math.sin(angle) * range;
                if (angle <= 1) {
                  angle += speed;
                }

                stage.update();
              }
            }
          } else if (variable[process[i].variable_log_num].type == "double") {
            animation.push(assignment_dob);
            function assignment_dob() {
              // console.log("myCanvas" + k);
              var stage = new createjs.Stage("myCanvas" + k);
              var container2 = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container2.x = 0;
              container2.y = 0;
              console.log(b);

              stage.addChild(container2);
              // var shape2 = new createjs.Shape();
              // shape2.graphics.beginFill("red"); // 赤色で描画するように設定
              // shape2.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              // shape2.x = 300; // X 座標 200px の位置に配置
              // shape2.y = 0; // Y 座標 200px の位置に配置
              // console.log(variable[0].value_after);
              // console.log(variable[1].value_after);
              if (a == 0) {
                // console.log(variable_num);
                var t2 = new createjs.Text(
                  variable[variable_num].value_after,
                  "64px serif",
                  "black"
                );
                t2.textAlign = "center";
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                container2.addChild(t2);
              } else if (a == 1) {
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
                t2.graphics.drawRect(0, 0, 300, 100); // 長方形を描画
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                var t3 = new createjs.Text("4", "48px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2 + 150;
                t3.y = 40;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2 + 150;
                t4.y = 0;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
                container2.regX = 150;
                container2.regY = 50;
              } else if (a == 2) {
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed").drawCircle(0, 0, 60);
                t2.x = stage.canvas.width / 2;
                t2.y = 0;
                var t3 = new createjs.Text("4", "64px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2;
                t3.y = -10;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2;
                t4.y = -50;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
              } else if (a == 3) {
                var shapenum = 150;
                var t2 = new createjs.Shape();
                t2.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
                t2.graphics.moveTo(0, 0); // (0,0)座標から描き始める
                t2.graphics.lineTo(shapenum / 2, -shapenum / 2);
                t2.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
                t2.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
                t2.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
                t2.x = stage.canvas.width / 2;
                t2.regX = shapenum / 2;
                t2.regY = 0;
                var t3 = new createjs.Text("4", "64px serif", "black");
                t3.textAlign = "center";
                t3.x = stage.canvas.width / 2;
                t3.y = -10;
                var t4 = new createjs.Text("string i", "48px serif", "black");
                t4.textAlign = "center";
                t4.x = stage.canvas.width / 2;
                t4.y = -50;
                container2.addChild(t2);
                container2.addChild(t3);
                container2.addChild(t4);
              }

              // container2.addChild(shape2);

              createjs.Tween.get(container2) // ターゲットを指定
                .to({ y: stage.canvas.height / 2, alpha: 0.1 }, 2000)
                .call(circle);

              var container = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container.x = stage.canvas.width / 2;
              container.y = stage.canvas.height / 2;
              stage.addChild(container);
              // if (b[i] == 0) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("red"); // 赤色で描画するように設定
              //     shape.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              //     shape.x = 0; // X 座標 200px の位置に配置
              //     shape.y = 0; // Y 座標 200px の位置に配置
              // }
              // else if (b[i] == 1) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 60);
              //     shape.x = 150;
              //     shape.y = 50;
              // }
              // else if (b == 2) {
              var shapenum = 300;
              var shape = new createjs.Shape();
              shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
              shape.graphics.moveTo(0, 0); // (0,0)座標から描き始める
              shape.graphics.lineTo(shapenum / 2, -shapenum / 2);
              shape.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
              shape.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
              shape.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
              shape.x = 150;
              shape.y = 50;
              shape.regX = shapenum / 2;
              shape.regY = 0;
              // }

              var t = new createjs.Text(
                variable[variable_num].name,
                "48px serif",
                "black"
              ); //文字変更前
              t.textAlign = "center";
              t.x = 150;
              t.y = 10;
              container.regX = 150;
              container.regY = 50;

              container.addChild(shape);
              container.addChild(t);
              // Stageの描画を更新します
              createjs.Ticker.addEventListener("tick", handleTick);

              function handleTick() {
                stage.update();
              }
            }

            function circle() {
              console.log();
              var stage = new createjs.Stage("myCanvas" + k);
              var container = new createjs.Container(); //親となる入れ物(containerインスタンス)を用意
              container.x = stage.canvas.width / 2;
              container.y = stage.canvas.height / 2;
              stage.addChild(container);
              // if (b == 0) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("red"); // 赤色で描画するように設定
              //     shape.graphics.drawRect(0, 0, 300, 100); //半径 100px の円を描画
              //     shape.x = 0; // X 座標 200px の位置に配置
              //     shape.y = 0; // Y 座標 200px の位置に配置
              // }
              // else if (b == 1) {
              //     var shape = new createjs.Shape();
              //     shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 60);
              //     shape.x = 150;
              //     shape.y = 50;
              // }
              // else if (b == 2) {
              var shapenum = 300;
              var shape = new createjs.Shape();
              shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
              shape.graphics.moveTo(0, 0); // (0,0)座標から描き始める
              shape.graphics.lineTo(shapenum / 2, -shapenum / 2);
              shape.graphics.lineTo(shapenum, 0); // (100,0)座標まで辺を描く
              shape.graphics.lineTo(shapenum / 2, shapenum / 2); // (0,100)座標まで辺を描く
              shape.graphics.lineTo(0, 0); // (0,0)座標まで辺を描く
              shape.x = 150;
              shape.y = 50;
              shape.regX = shapenum / 2;
              shape.regY = 0;
              // }

              var t = new createjs.Text(
                variable[variable_num].name,
                "48px serif",
                "black"
              );
              t.textAlign = "center";
              t.x = 150;
              t.y = 10;

              container.addChild(shape);
              container.addChild(t);
              console.log(variable_num);
              var text = new createjs.Text(
                variable[variable_num].value_after,
                "24px serif",
                "black"
              );
              text.textAlign = "center";
              text.x = stage.canvas.width / 2;
              text.y = stage.canvas.height / 2;

              var angle = 0;
              var centerScale = 1.0;
              var range = 2.0;
              var speed = 0.05;
              stage.addChild(text);

              container.regX = 150;
              container.regY = 50;
              createjs.Ticker.addEventListener("tick", handleTick);
              function handleTick() {
                text.scaleX = text.scaleY =
                  centerScale + Math.sin(angle) * range;
                if (angle <= 1) {
                  angle += speed;
                }

                stage.update();
              }

              console.log("double");
            }
          } else {
            var b = 3;
          }
          // variable_num ++;

          // variable_num++;
          // variable_num++;
          // console.log(variable_num);

          // function strWidth(str) {
          //   var canvas = document.getElementById('canvas');
          //   if (canvas.getContext) {
          //     var context = canvas.getContext('2d');
          //     var metrics = context.measureText(str);
          //     return metrics.width;
          //   }
          //   return -1;
          // }
        }
        // if(process[i].math_num == 0){ //計算処理かどうか判定
        //     // その他の処理

        // }
        // else if(process[i].math_num == 1){
        //     // 足し算

        // }
        // else if(process[i].math_num = 2){
        //     // 引き算

        // }
        // else if(process[i].math_num = 3){
        //     // 掛け算

        // }
        // else if(process[i].math_num = 4){
        //     // 割算

        // }
        // else if(process[i].math_num = 5){
        //     // 剰余算

        // }
      }

      $(function () {
        let canvas = $("#flipbook canvas");
        let counter = 0;
        let index = 0;
        variable_num = 0;

        console.log(animation);
        console.log(canvas);
        canvas.eq(index).css("display", "inline");
        // canvas.eq(2).css('background color ', 'yellow');
        animation[0]();
        // output();
        $("#flipbook").turn({
          display: "single",
          width: 600,
          height: 350,
          autoCenter: false,
        });

        $("#prevpage").click(function () {
          // console.log('ok');

          // console.log(animation[index]);

          if (variable_num != 0) {
            variable_num--;
          }
          // console.log(variable_num);
          if (
            animation[index].name == "output_int" ||
            animation[index].name == "error" ||
            animation[index].name == "output_double"
          ) {
            canvas.eq(index).css("display", "none");
          }
          index = index - 1;
          console.log(canvas.eq(index));

          canvas.eq(index).css("display", "inline");
          animation[index]();

          $("#flipbook").turn("previous");
        });

        $("#nextpage").click(function () {
          variable_num++;
          console.log(variable_num);
          canvas.eq(index).css("display", "none");
          index = index + 1;
          console.log(index);
          canvas.eq(index).css("display", "inline");
          $("#flipbook").turn("next");
          // console.log(animation[1]);
          animation[index]();
        });
      });
    })
    .fail(() => {
      console.log("通信失敗");
      console.log(textStatus);
    });
});
