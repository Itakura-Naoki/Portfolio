<?php
/**
 * 改行コードで分割し1次元配列で返す
 * 
 * @param string $code 入力されたコード
 * @return array $indention_List 改行コードで分割されたコード
 */
function create_space_array($code){
    $indention_code = str_replace(array("\r\n", "\r", "\n"), "\n", $code);
    $indention_List = explode("\n", $indention_code);
    return $indention_List;
}



/**
 * 改行コードで分割した後、1文字ずつ分割
 * 
 * @param array $indention_List 渡された配列
 * @return array $var_List 1文字ずつ分割された配列
 */
function create_var_array($indention_List){
    foreach($indention_List as $row){
        $var_List[] = preg_split("//u", $row, -1, PREG_SPLIT_NO_EMPTY);//一文字ずつ配列に
    }
    return $var_List;
}




/**
 * 字句(トークン)ごとに分割し、二次元配列にして返す
 * 
 * @param array $var_List 改行コードで分割されたコード
 * @var string $Link 字句を繋げる変数
 * @var bool $flg 文字判定された時 true
 * @var bool $comment_flg コメント時 true
 * @return array $word_List トークンで分割された二次元配列
 */
function create_word_array($var_List){

    // 事前準備
    $word_List = [];
    $Link = '';
    $flg = false;
    $comment_flg = false;


    foreach($var_List as $line_num => $row){
        $line_List = [];
        foreach($row as $key => $val){
            if($val == ' ' && $comment_flg === false){
                if($flg){//文字判定された時の処理
                    $Link = $Link . $val;
                }
                else{
                    if(!empty($Link)){//$Link が空白だったら入れない処理s
                        $line_List[] = $Link;
                    }
                    $line_List[] = $val;
                    $Link = '';
                }
            }
            elseif($val == ';'){
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif($val == '.'){
                if(!is_numeric($row[$key - 1]) || !is_numeric($row[$key + 1])){
                    if(!empty($Link)){
                        $line_List[] = $Link;
                    }
                    $line_List[] = $val;
                    $Link = '';
                }
                else{
                    $Link = $Link . $val;
                }
            }
            elseif($val == '('){
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif($val == ')'){
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif($val == '{'){
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif($val == '}'){
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif($val == '"'){
                if($flg){
                    $flg = false;
                }
                else{
                    $flg = true;
                }
                if(!empty($Link)){//$Link が空白だったら入れない処理
                    $line_List[] = $Link;
                    $Link = '';//入れたら初期化
                }
                $line_List[] = $val;
            }
            elseif(($val == '/' && $row[$key + 1] == '/') || $comment_flg == true){
                $comment_flg = true;
                $Link = $Link . $val;
                // コメント最終文字
                if(count($row) == $key + 1){
                    $line_List[] = $Link;
                    $Link = '';
                    $comment_flg = false;
                }
            }
            else{
                $Link = $Link . $val;
                //配列の最後の要素の時、$word_Listに入れる
                if(count($row) == $key + 1){
                    $line_List[] = $Link;
                    $Link = '';
                }
            }
        }//------2番目foreach終了
        // var_dump($row);
        $word_List[] = $line_List;
    }//---------1番目foreach終了
    return $word_List;
}
?>