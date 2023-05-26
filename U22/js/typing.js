$(".type-wrap").hide();
var typed5 = new Typed("#typing", {
  strings: [
    "//サンプルコード <br> System.out.println('Hello World!!');^2000",
    "//サンプルコード <br> int number = 2; <br> System.out.println(number);^2000",
    "//サンプルコード <br> int number1 = 5; <br> double number2 = 2.2; <br> System.out.println(number1 + number2);^2000",
  ],
  typeSpeed: 40,
  backSpeed: 10,
  //   smartBackspace: true,
  fadeOut: true,
  loop: true,
});
// $(".CodeMirror").on("click", function () {
//   //   console.log("エリア内を選択しました。");
//   $(".type-wrap").hide();
// });
