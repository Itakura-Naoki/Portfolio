

// var error_list = [];
// var process = [];
// var variable = [];
// var object_length;
// $.getJSON((data) => {
//     // JSONデータを受信した後に実行する処理
//     // console.log(data['error'][0]['num']);
//     error_list = {
//         detail: data['error']['detail'],
//         num: data['error']['num'],
//         origin: data['error']['origin']
//     }
    
//     for (let i = 0; i < Object.keys(data.process).length; i++) {
//         process[i] = {
//             process_num: data['process'][i]['process_num'],
//             error_num: data['process'][i]['error_num'],
//             variable_log_num: data['process'][i]['variable_log_num'],
//             math_num: data['process'][i]['math_num'],
//             math_result: data['process'][i]['math_result'],
//             output: data['process'][i]['output']
//         }
//     }
//     // console.log(process);
//     for (let i = 0; i < Object.keys(data.variable).length; i++) {
//         variable[i] = {
//             name: data['variable'][i]['name'],
//             type: data['variable'][i]['type'],
//             value_before: data['variable'][i]['value_before'],
//             value_after: data['variable'][i]['value_after']
//         }
//     }
//     object_length =  Object.keys(data.process).length;
//     // console.log(variable);
// });

