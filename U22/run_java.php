<?php
require_once './function/split.php';
require_once './function/variable.php';
require_once './function/error.php';

// 予約語リスト
if(isset($_GET['text'])){
    date_default_timezone_set('Asia/Tokyo');
    $day_time = date("YmdHis");
    $java_code = $_GET['text'];



    // 単語分割
    //改行コードで分割
    $indention_List = create_space_array($java_code);

    // 改行コードで分割した後、1文字ずつ分割
    $var_List = create_var_array($indention_List);

    // 一文字ずつ分割したものを単語ごとにくっつける
    $word_List = create_word_array($var_List);

    // 空白を削除する処理
    $new_word_List = [];
    foreach($word_List as $key => $row){
        foreach($row as $val){
            if($val != ' '){
                $new_word_List[$key][] = $val;
            }
        }
    }


// --------------------------------------------------------------------------

    $variable_Word = ['String' , 'int' , 'double' , 'System'];
    $process_List = [];
    $error_List = [];
    $variable_log = [];
    // ----------エラーチェック開始
    $num = 0;

    foreach($new_word_List as $key => $row){
        $process_row = [];
        $hantei = 'search_reserve';
        //処理の種類が決定するまで繰り返し
        while(!is_numeric($hantei) && !is_bool($hantei)){
            $hantei = $hantei($row);
        }

        //エラーがあるかの判定
        $error = ['num' => 0 , 'detail' => null , 'origin' => null];
        if($row[count($row) - 1] == ';'){//1
            switch($hantei){
                case 1:
                    if(array_search($row[0] , $variable_Word) !== false){
                        $error = error_naming_variable($row[1] , $variable_Word);//2-1-1 false -> 1
                        if($error['num'] == 0){//処理続行
                            $error = number_name_first($row[1]);//2-1-1 false -> 1
                            if($error['num'] == 0){
                                $error = redev_variable($row[1] , $variable_log);//2-1-2 false -> 4
                            }
                        }
                    }
                    else{
                        $error = ['num' => 1 , 'detail' => '予約語又は変数が見つかりません' , 'origin' => 'シンボルを見つけられません'];
                    }
                    break;
                case 2:
                    $error = call_non_variable($row[0] , $variable_log);//2-2-1 false -> 3
                    if($error['num'] == 0){
                        if($row[2] == '"' && $row[4] == '"'){//2-2-2 false -> 2
                            $error = assign_def_type($row[0] , $row[3] , $variable_log);
                        }
                        elseif(strpos($row[2] , '.') !== false){
                            $error = assign_def_type($row[0] , $row[3] , $variable_log);
                        }
                        elseif(is_numeric($row[2])){
                            $error = assign_def_type($row[0] , $row[3] , $variable_log);
                        }
                    }
                    break;
                case 3:
                    $error = error_naming_variable($row[1] , $variable_Word);//2-3-1 false -> 1
                    if($error['num'] == 0){
                        $error = number_name_first($row[1]);//2-3-1 false -> 1
                        if($error['num'] == 0){
                            $error = redev_variable($row[1] , $variable_log);//2-3-2 false -> 4
                            if($error['num'] == 0){
                                $error = dec_assign_deftype($row[0] , $row[3]);//2-3-3 false -> 2
                            }
                        }
                    }
                    break;
                case 4:
                    $error = call_non_variable($row[0] , $variable_log);//2-4-1 false -> 3
                    if($error['num'] == 0){
                        if($row[5] == '"' || is_numeric($row[5])){//キャスト先が定数の時
                            $error = assign_def_type($row[0] , $row[3] , $variable_log);//2-4-2-1 false -> 2
                        }
                        else{//キャスト先が変数の時
                            $error = call_non_variable($row[5]);//2-4-2-1 false -> 3
                            if($error['num'] == 0){
                                $error = assign_def_type($row[0] , $row[3] , $variable_log);//2-4-2-2 false -> 2
                            }
                        }
                    }
                    break;
                case 5:
                    $error = sqelling_System($row[2] , $row[4]);//2-5-1 false -> 1
                    if($error['num'] == 0){
                        if($row[6] == '"' && $row[8] == '"' && $row[9] == '+'){//("aaaa"+変数名)
                            $error = call_non_variable($row[7] , $variable_log);//2-5-2 false -> 3
                        }
                        elseif($row[7] == '+'){//(a+b) 追記3/3
                            $error = call_non_variable($row[6] , $variable_log);//2-5-2 false -> 3
                            $error2 = call_non_variable($row[8] , $variable_log);//2-5-2 false -> 3
                            if($error['num'] == 0){
                                if($error2['num'] == 0){
                                    $flg1 = false;
                                    $flg2 = false;
                                    foreach($variable_log as $line){
                                        if($line['name'] == $row[6]){
                                            $flg1 = true;
                                            $log1 = $line['value_after'];
                                        }
                                        elseif($line['name'] == $row[8]){
                                            $flg2 = true;
                                            $log2 = $line['value_after'];
                                        }
                                    }
                                    if($flg1 === true && $flg2 === true){
                                        $process_row['output'] = $log1 + $log2;
                                    }
                                }
                                else{
                                    $error = $error2;
                                }
                            }
                        }
                        elseif($row[6] == '"' && $row[8] == '"' && $row[9] == ')'){//("aaaaaaabc")
                            // 変数を用いない出力の際
                            $error = ['num' => 0 , 'detail' => null , 'origin' => null];
                            $process_row['output'] = $row[7];
                        }
                        else{//(a)
                            $error = call_non_variable($row[6] , $variable_log);//2-5-2 false -> 3
                            foreach($variable_log as $line){
                                if($line['name'] == $row[6]){
                                    $process_row['output'] = $line['value_after'];
                                }
                            }
                        }
                    }
                    break;
            }
        }
        else{
            $error = ['num' => 1 , 'detail' => ';がありません' , 'origin' => ';がありません'];
        }

        //変数ログリストを変更
        if($error['num'] == 0){
            switch($hantei){
                case 1:
                    $variable_log[] = [
                        'name' => $row[1],
                        'type' => $row[0],
                        'value_before' => null,
                        'value_after' => null
                    ];
                    break;
                case 2:
                    foreach($variable_log as $log_value){
                        if($log_value['name'] == $row[0]){
                            $variable_log[$num]['type'] = $log_value['type'];
                            $variable_log[$num]['value_before'] = $log_value['value_after'];
                        }
                    }
                    $variable_log[$num]['name'] = $row[0];
                    $variable_log[$num]['value_after'] = $row[2];
                    break;
                case 3:
                    $variable_log[] = [
                        'name' => $row[1],
                        'type' => $row[0],
                        'value_before' => null,
                        'value_after' => $row[3]
                    ];
                    break;
                case 4:
                    $variable_log[$num]['name'] = $row[0];
                    $variable_log[$num]['type'] = $row[3];
                    foreach($variable_log as $log_value){
                        if($log_value['name'] == $row[0]){
                            $variable_log[$num]['value_before'] = $log_value['value_after'];
                        }
                    }
                    $variable_log[$num]['value_after'] = $row[5];
                    break;
            }
        }

        


        //処理リストに配列を挿入
        $process_row['process_num'] = $hantei;
        $process_row['error_num'] = $error['num'];

        if($hantei != 5 && $hantei != 6){//変数関連の処理がない場合null
            $process_row['variable_log_num'] = $num;
        }
        else{
            $process_row['variable_log_num'] = null;
        }

        if($math = array_search('+' , $row)){
            $process_row['math_num'] = 1;
            if(!is_numeric($row[$math - 1])){
                foreach($variable_log as $log_value){
                    if($log_value['name'] == $row[$math - 1]){
                        $number1 = $log_value['value_after'];
                    }
                }
                if(!isset($number1)){
                    $error = ['num' => 3 , 'detail' => $row[$math - 1].'は宣言されていません' , 'origin' => 'シンボルを見つけられません'];
                    goto end;
                }
            }
            else{
                $number1 = $row[$math - 1];
            }
            if(!is_numeric($row[$math + 1])){
                foreach($variable_log as $log_value){
                    if($log_value['name'] == $row[$math + 1]){
                        $number2 = $log_value['value_after'];
                    }
                }
                if(!isset($number2)){
                    $error = ['num' => 3 , 'detail' => $row[$math + 1].'は宣言されていません' , 'origin' => 'シンボルを見つけられません'];
                    goto end;
                }
            }
            else{
                $number2 = $row[$math + 1];
            }
            $process_row['math_result'] = $number1 + $number2;
        }
        elseif($math = array_search('-' , $row)){
            $process_row['math_num'] = 2;
            foreach($variable_log as $log_value){
                if($log_value['name'] == $row[$math - 1]){
                    $number1 = $log_value['value_after'];
                }
                if($log_value['name'] == $row[$math + 1]){
                    $number2 = $log_value['value_after'];
                }
            }
            $process_row['math_result'] = $number1 - $number2;
        }
        elseif($math = array_search('*' , $row)){
            $process_row['math_num'] = 3;
            foreach($variable_log as $log_value){
                if($log_value['name'] == $row[$math - 1]){
                    $number1 = $log_value['value_after'];
                }
                if($log_value['name'] == $row[$math + 1]){
                    $number2 = $log_value['value_after'];
                }
            }
            $process_row['math_result'] = $number1 * $number2;
        }
        elseif($math = array_search('/' , $row)){
            $process_row['math_num'] = 4;
            foreach($variable_log as $log_value){
                if($log_value['name'] == $row[$math - 1]){
                    $number1 = $log_value['value_after'];
                }
                if($log_value['name'] == $row[$math + 1]){
                    $number2 = $log_value['value_after'];
                }
            }
            $process_row['math_result'] = $number1 / $number2;
        }
        elseif($math = array_search('%' , $row)){
            $process_row['math_num'] = 5;
            foreach($variable_log as $log_value){
                if($log_value['name'] == $row[$math - 1]){
                    $number1 = $log_value['value_after'];
                }
                if($log_value['name'] == $row[$math + 1]){
                    $number2 = $log_value['value_after'];
                }
            }
            $process_row['math_result'] = $number1 % $number2;
        }
        else{
            $process_row['math_num'] = 0;
            $process_row['math_result'] = null;
        }

        // 出力処理の追加
        if($hantei != 5){
            $process_row['output'] = null;
        }
        
        //行数の更新
        $num++;
        end:
        if(!isset($process_row['math_result'])){
            $process_row['math_result'] = null;
        }
        $process_row['error_num'] = $error['num'];
        // エラーリストに詳細を書き込む
        $error_List = $error;

        $process_List[] = $process_row;
        if($error['num'] !== 0){
            $all_List = ['process' => $process_List , 'variable' => $variable_log, 'error' => $error_List];
            // $json = json_encode($all_List , JSON_PRETTY_PRINT , JSON_UNESCAPED_UNICODE);
            // header('Content-Type: application/json');
            // echo $json;
            break;
        }
    }
    $all_List = ['process' => $process_List , 'variable' => $variable_log, 'error' => $error_List];
    $json = json_encode($all_List , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    // header('Content-Type: application/json');
    echo $json;
}
?>