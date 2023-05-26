$("#tutorial").click(function () {
  introJs()
    .setOptions({
      showProgress: true,
      disableInteraction: true,
      nextLabel: "次へ",
      prevLabel: "前へ",
      // skipLabel: "✘",
      doneLabel: "終了",
      tooltipPosition: "スキップ",
      steps: [
        {
          title: "ようこそ",
          intro: "これから使い方を説明します",
        },
        {
          title: "Step 1",
          tooltipClass: "type-code",
          element: document.querySelector("#form-area"),
          intro: "こちらにJavaコードを入力します",
        },
        {
          title: "Step 2",
          element: document.querySelector("#reset"),
          intro: "コードを削除する際は</br>こちらを押してください",
        },
        {
          title: "Step 3",
          element: document.querySelector("#send"),
          intro: "コードの入力が完了したら</br>【実行】をクリックします",
        },
        {
          title: "Step 4",
          element: document.querySelector("#flipbook"),
          intro:
            "実行されるとこちらのエリアに</br>アニメーションが再生されます",
        },
        {
          title: "完了",
          // element: document.querySelector(".card__image"),
          intro: "これですべてのステップを</br>完了しました！",
        },
        // {
        //   title: "Farewell!",
        //   element: document.querySelector(".card__image"),
        //   intro: "And this is our final step!",
        // },
      ],
    })
    // .onbeforechange(async () => {
    //   return new Promise((resolve) => {
    //     setInterval(resolve, 100);
    //     $(function () {
    //       console.log("チュートリアルの実行を受け取りました。");
    //       $(".introjs-prevbutton").click(function () {
    //         console.log("前ヘを受け取りました");
    //       });
    //       $(".introjs-nextbutton").click(function () {
    //         console.log("次ヘを受け取りました");
    //       });
    //     });
    //   });
    // })
    .onexit(function () {
      $(".type-wrap").hide();
    })
    .start();
  console.log("チュートリアル開始");
});

$(document).on(
  "click",
  ".introjs-prevbutton, .introjs-nextbutton",
  function () {
    setTimeout(function () {
      if ($(".type-code").length) {
        // console.log("type-codeが生成されました");
        $(".type-wrap").show();
      } else {
        $(".type-wrap").hide();
        // console.log("type-codeが存在しません");
      }
    }, 350);
  }
);
