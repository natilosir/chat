<?php 
include('template.php');header('Content-Type: application/json; charset=utf-8');
error_reporting(0);
$dc =file_get_contents('iphost1.php');
// sleep(2);
$date=time();
$un1=$_POST['un1'];
$un2=$_POST['un2'];
$fud=$_POST['fud'];
$text=$_POST['text'];
$upd=$_POST['upd'];
$getchat=$_POST['getchat'];
if($un1 and $un2){
    if($getchat){
    
$stmt = $conn->query("SELECT DISTINCT un2 FROM chat WHERE un1='$un1'")->fetchAll();

foreach ($stmt as $row) {
$pr[] = [
'id'  =>  $row['id'],
'text'  =>  nl2br($row['text']),
'date'  =>  da($row['date']),
'un1'  =>  $row['un1'],
'un2'  =>  $row['un2'],
'stat'  =>  5,
's'  =>  $row['s'],
];
}
if(empty($pr)){$gh=1;}


    }
    elseif($fud){
        $conn->exec("UPDATE chat SET text='$text',s='0' WHERE id='$fud'");
        $show=3;
    }
elseif($text){ 
    $conn->exec("INSERT INTO chat (text, date, un1, un2, s) VALUES ('$text', '$date', '$un1', '$un2', '0')");
    $show=3;}
elseif($upd){
$stmt = $conn->query("SELECT * FROM chat WHERE (un1='$un2' and un2='$un1') and s!=2")->fetchAll();
$conn->query("UPDATE chat SET s='2' WHERE (un1='$un2' and un2='$un1') and s!=2");

$result = $conn->query("SELECT * FROM chat WHERE (un1='$un1' and un2='$un2') and s!=2 limit 1")->fetchAll();
$fv=count($result);

foreach ($stmt as $row) {
$pr[] = [
'id'  =>  $row['id'],
'text'  =>  nl2br($row['text']),
'date'  =>  da($row['date']),
'un1'  =>  $row['un1'],
'un2'  =>  $row['un2'],
'stat'  =>  5,
's'  =>  $row['s'],
];
}
$pr[] = ["stat"=>$fv];

if(empty($pr)){$gh=1;}
}
else{
$stmt = $conn->query("SELECT * FROM chat WHERE (un1='$un1' and un2='$un2') or (un1='$un2' and un2='$un1')
 ORDER BY id DESC limit 999")->fetchAll();
$conn->query("UPDATE chat SET s='2' WHERE (un1='$un2' and un2='$un1') and s!=2");
foreach (array_reverse($stmt) as $row) {

$pr[] = [
'id'  =>  $row['id'],
'text'  =>  nl2br($row['text']),
'date'  =>  da($row['date']),
'un1'  =>  $row['un1'],
'un2'  =>  $row['un2'],
's'  =>  $row['s'],
];

}
if(empty($pr)){$pr=2;}
}
}else{$gh=5;}

if($gh){http_response_code(403);$pr=['Error'];}
if($show==1){$pr['status'] = ok;}
if($show==2){$pr['status'] = no;}
echo json_encode ($pr);