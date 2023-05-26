$("#reset").click(function () {
  if (confirm("本当に削除してもよろしいですか？")) {
    editor.setValue("");
    alert("全てクリアしました");
  } else {
    // alert("削除をキャンセルしました");
  }
});
