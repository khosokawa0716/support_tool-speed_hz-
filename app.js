<script type="text/javascript">
$(document).ready(function(){
// 変数の定義
// isValidの意味は「正しい値かどうか」
var timeStatus = "sec"; // 速度が秒か分か　初期値はmm/sなので秒
var isValidResolution = true;
var isValidRatioGearMotor = true;
var isValidRatioTransmission = true;
var isValidSpeedInput = false;
var isValidDistancePerRotation = false;

// シリーズを選択して、分解能の値を表示させる
$(".js-seriesSelect").change(function () {
    var series = $("input[name=series-radio]:checked").val();
    var rs = "";
    switch( series ) {
        case "AR":
        case "AZ":
            isValidResolution = true;
            $(".js-err-resolution").text("");
            $(".js-resolution").prop("readonly", true);
            rs = 1000;
            break;
        case "RK2":
        case "CRK":
            isValidResolution = true;
            $(".js-err-resolution").text("");
            $(".js-resolution").prop("readonly", true);
            rs = 500;
            break;
        case "other":
            isValidResolution = false;
            $(".js-err-resolution").text("モーターの分解能を入力してください。");
            $(".js-resolution").prop("readonly", false);
            rs = "";
            break;
    }
    $(".js-resolution").val( rs ).change();
});

// 単位の表示およびtimeStatusの変更
$("input[name=unit-radio]").change(function(){
    // 選択された単位を変数に格納
    var unitSpeedInput = $("input[name=unit-radio]:checked").val();
    // 回転速度の単位は選択された単位そのもの
    $(".js-unit-speed_input").text("["+unitSpeedInput+"]");

    var unitDisPerRotation ="";
    switch( unitSpeedInput ) {
        case "mm/s":
                timeStatus = "sec";
                isValidDistancePerRotation = false;
                var unitDisPerRotation = "mm";
                $(".js-distance_per_rotation").val("");
                $(".js-distance_per_rotation").prop("readonly", false);
                break;
        case "m/min":
                timeStatus = "min";
                isValidDistancePerRotation = false;
                var unitDisPerRotation = "m";
                $(".js-distance_per_rotation").val("");
                $(".js-distance_per_rotation").prop("readonly", false);
                break;
        case "deg/s":
                timeStatus = "sec";
                isValidDistancePerRotation = true;
                var unitDisPerRotation = "deg";
                $(".js-distance_per_rotation").val(360);
                $(".js-distance_per_rotation").prop("readonly", true);
                break;
        case "r/min":
                timeStatus = "min";
                isValidDistancePerRotation = true;
                var unitDisPerRotation = "rev";
                $(".js-distance_per_rotation").val(1);
                $(".js-distance_per_rotation").prop("readonly", true);
                break;
    }
    $(".js-unit-distance_per_rotation").text("["+unitDisPerRotation+"]");

    // 単位が変更されたとき、1回転あたりの移動量は必ず正常になる。
    // そのためエラーメッセージをクリアする。
    $(".js-err-distance_per_rotation").text("");

});

// 「ギヤードモーターを使用」入力欄活性・非活性の切り替え
$("input[name=geardMotor-radio]").change( function () {
    if($("input[name=geardMotor-radio]:checked").val() === "geardMotorNo") {
        $(".js-ratioGeardMotor").prop("readonly", true);
        $(".js-ratioGeardMotor").val(1).change();
    } else {
        $(".js-ratioGeardMotor").prop("readonly", false);
    }
});

// 「外部減速機を使用」入力欄活性・非活性の切り替え
$("input[name=externalGear-radio]").change( function () {
    if($("input[name=externalGear-radio]:checked").val() === "transmissionNo") {
        $(".js-ratioTransmission").prop("readonly", true);
        $(".js-ratioTransmission").val(1).change();
    } else {
        $(".js-ratioTransmission").prop("readonly", false);
    }
});

// 計算ボタン　活性と非活性の切り替え　および計算結果のクリア
$(".js-input").on("input change", function() {
    $(".js-pulse").val("");
    // すべてのinputの値が正しければ、ボタンを活性にする
   if (isValidRatioGearMotor && isValidRatioTransmission && isValidSpeedInput && isValidDistancePerRotation && isValidResolution) {
       $('.js-calc').prop("disabled", false);
   } else {
       $('.js-calc').prop("disabled", true);
   }
});

// 計算ボタンが押されたら、パルス速度を計算する
$('.js-calc').on('click', function() {
    // 計算に使う値を取得
    var rs = $(".js-resolution").val(); // 製品の分解能
    var im = $(".js-ratioGeardMotor").val(); // ギヤードモーターの減速比
    var ie = $(".js-ratioTransmission").val(); // 外部減速機の減速比
    var lead = $(".js-distance_per_rotation").val(); // 1回転あたりの移動量
    var speedInput = $(".js-speed_input").val(); // 速度
    if(timeStatus === "min"){
        speedInput = speedInput / 60;
    }
    // parseIntで文字列を数値に変換
    rs = parseFloat(rs);
    im = parseFloat(im);
    ie = parseFloat(ie);
    lead = parseFloat(lead);
    speedInput = parseFloat(speedInput);

    // パルス速度を計算
    var pulse = Math.round(speedInput / lead * rs * im * ie);
    $(".js-pulse").val( pulse );
});

 // 分解能　入力チェック
$(".js-resolution").on("input", function(){
    var res = $(this).val(); // 入力された分解能の値
    var check = $.isNumeric(res);
    if(check === true){
        if(res > 0){
            $(".js-err-resolution").text("");
            isValidResolution = true;
        } else {
            $(".js-err-resolution").text("0より大きい値を入力してください。");
            isValidResolution = false;
        }} else {
            $(".js-err-resolution").text("半角の数値を入力してください。");
            isValidResolution = false;
        }
});

 // ギヤモーターの減速比　入力チェック
$(".js-ratioGeardMotor,input[name=geardMotor-radio]").on("input change", function(){
    var ratioGM = $(".js-ratioGeardMotor").val(); // ギヤモーターの減速比
    var check = $.isNumeric(ratioGM);
    if(check === true){
        if(ratioGM > 0){
            $(".js-err-ratioGM").text("");
            isValidRatioGearMotor = true;
        } else {
            $(".js-err-ratioGM").text("0より大きい値を入力してください。");
            isValidRatioGearMotor = false;
        }} else {
            $(".js-err-ratioGM").text("半角の数値を入力してください。");
            isValidRatioGearMotor = false;
        }
});

 // 外部減速機の減速比　入力チェック
$(".js-ratioTransmission,input[name=externalGear-radio]").on("input change", function(){
    var ratioTr = $(".js-ratioTransmission").val(); // 外部減速機の減速比
    var check = $.isNumeric(ratioTr);
    if(check === true){
        if(ratioTr > 0){
            $(".js-err-ratioTr").text("");
            isValidRatioTransmission = true;
        } else {
            $(".js-err-ratioTr").text("0より大きい値を入力してください。");
            isValidRatioTransmission = false;
        }} else {
            $(".js-err-ratioTr").text("半角の数値を入力してください。");
            isValidRatioTransmission = false;
        }
});

 // 1回転あたりの移動量　入力チェック
$(".js-distance_per_rotation").on("input", function(){
    var disPerRot = $(".js-distance_per_rotation").val(); // 1回転あたりの移動量
    var check = $.isNumeric(disPerRot);
    if(check === true){
        if(disPerRot > 0){
            $(".js-err-distance_per_rotation").text("");
            isValidDistancePerRotation = true;
        } else {
            $(".js-err-distance_per_rotation").text("0より大きい値を入力してください。");
            isValidDistancePerRotation = false;
        }} else {
            $(".js-err-distance_per_rotation").text("半角の数値を入力してください。");
            isValidDistancePerRotation = false;
        }
});

 // 速度　入力チェック
$(".js-speed_input").on("input", function(){
    var speedInput = $(".js-speed_input").val(); // 速度
    var check = $.isNumeric(speedInput);
    if(check === true){
        if(speedInput > 0){
            $(".js-err-speed_input").text("");
            isValidSpeedInput = true;
        } else {
            $(".js-err-speed_input").text("0より大きい値を入力してください。");
            isValidSpeedInput = false;
        }} else {
            $(".js-err-speed_input").text("半角の数値を入力してください。");
            isValidSpeedInput = false;
        }
});
});

</script>
