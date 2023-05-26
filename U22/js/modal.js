// ボタンをクリックしたらモーダルを表示
const modalBtn = document.getElementById("modalBtn");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

modalBtn.onclick = function() {
    modal.style.display = "block";
}

// モーダル外側をクリックしたらモーダルを閉じる
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
if (event.target == modal2) {
    modal2.style.display = "none";
}
}

// 閉じるボタンをクリックしたらモーダルを閉じる
closeBtn.onclick = function() {
    modal.style.display = "none";
}


// -------------------------------------------------------------------------
// ボタンをクリックしたらモーダルを表示
const modalBtn2 = document.getElementById("modalBtn2");
const modal2 = document.getElementById("myModal2");
const closeBtn2 = document.getElementsByClassName("close2")[0];

modalBtn2.onclick = function() {
    modal2.style.display = "block";
}

// モーダル外側をクリックしたらモーダルを閉じる
// window.onclick = function(event) {
//     if (event.target == modal2) {
//         modal2.style.display = "none";
//     }
// }

// 閉じるボタンをクリックしたらモーダルを閉じる
closeBtn2.onclick = function() {
    modal2.style.display = "none";
}
