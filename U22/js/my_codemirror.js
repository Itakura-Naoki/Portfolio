// var json_code = <?php echo isset($json)?$json : 'aaa'; ?>;
// console.log(json_code);
var textarea = document.getElementById("codeArea");
var editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: "java"
});

// textarea.value = 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, world.");\n    }\n}'; // textarea要素にコードをセットする
// editor.setValue(textarea.value); // CodeMirrorにコードを反映する

// 指定した行番号の背景色を変更する
// var targetLine = <?php echo isset($error_Line)?$error_Line : 0; ?>;//何行目か
// var targetLine = 3;//何行目か
// editor.addLineClass(0 - 1, "background", "cm-highlight");
$("#send").click(function () {
    const text = editor.getValue();
    console.log(text);
    $.ajax({
        type: 'GET',
        url: './run_java.php',
        data: {
            text : text,
        },
        caches: false
    })
    .done((data) => {
        console.log('通信成功');
        console.log(data);
    })
    .fail(() => {
        console.log('通信失敗');
        console.log(textStatus);
    })
});