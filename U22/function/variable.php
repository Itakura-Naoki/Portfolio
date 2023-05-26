<?php
/*
予約語があるかどうかを判定する関数
存在する　 → 予約語の種類を判定する関数に飛ばす（戻り値に予約語の種類の判定の関数名）
存在しない → 予約語がない状態で"="があるかの判定する関数に飛ばす（戻り値に予約語がない状態で"="があるかの判定の関数名）
*/
function search_reserve($list){
    $variable_Word = ['String' , 'int' , 'double' , 'System'];
    if(array_search($list[0],$variable_Word) !== false){
        return "judge_reserve";
    }
    else{
        return "search_equal_nondec";
    }
}

/*
予約語の種類の判定
予約語がint,double,String → "="があるか判定する関数に飛ばす（戻り値に「=」があるかの判定の関数名）
予約語がSystem → 処理の種類を「出力」にする（戻り値に5）
*/
function judge_reserve($list){
    if($list[0] == "int" || $list[0] == "double" || $list[0] == "String"){
        return "search_equal_dec";
    }
    elseif($list[0] == "System"){
        return 5;
    }
}

/*
予約語がある状態で"="があるかの判定
"="がある → 処理の種類を「宣言と代入」にする（戻り値に3）
"="がない → 処理の種類を「宣言」にする（戻り値に1）
*/
function search_equal_dec($list){
    if(array_search("=",$list)){
        return 3;
    }
    else{
        return 1;
    }
}

/*
予約語がない状態で"="があるかの判定
"="がある → キャストか代入を判定する関数に飛ばす（戻り値はキャストかどうかを判定する関数名）
"="がない → エラーにする（戻り値は検討中）
*/
function search_equal_nondec($list){
    if($list[1] == '='){
        return 2;
    }
    return "judge_comment";
}

/*
変数の代入かキャストかを判定
代入である → 処理の種類を「代入」にする（戻り値は2）
キャストである → 処理の種類を「キャストにする」（戻り値は4）
*/
function judge_cast($list){
    $word = ["int","double","String"];
    if(array_search($list[3],$word)){
        return 4;
    }
    return 2;
}

/*
コメントアウトの判定
コメントアウトである → 処理の種類を「コメントアウト」にする（戻り値は検討中）
コメントアウトでない → エラーにする（戻り値は検討中）
*/
function judge_comment($list){
    foreach($list as $val){
        if(is_numeric(mb_strpos($val , '//'))){
            return 6;
        }
    }
    return 1;
}
?>