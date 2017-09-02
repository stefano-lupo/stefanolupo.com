<?php

$postArray=$_POST['posted'];

$fn=$postArray[0];
$ln=$postArray[1];
$phone=$postArray[2];
$emailAddress=$postArray[3];
$message=$postArray[4];


$to='info@stefanolupo.tech';
$subject='Mail from stefanolupo.tech';

$headers='MIME-Version: 1.0'."\r\n";
$headers.='Content-type: text/html; charset=iso-8859-1'."\r\n";
$headers.='From: '.$fn.' '.$ln.' <'.$emailAddress.'>'."\r\n";

/*$message = str_replace("\r\n", "<br>", $message);*/

$email='
<html>
<head>
  <title>Website Mail</title>
</head>

<body>
<h3>Email from '.$fn." ".$ln.'</h3>
<h4>Phone Number: '.$phone.'</h4>
<h4>Email: '.$emailAddress.'</h4>

<p>'.$message.'</p>
</body>
</html>
';

//send mail to me
mail($to,$subject,$email,$headers);

//send mail to client for address book
$headers2='MIME-Version: 1.0'."\r\n";
$headers2.='Content-type: text/html; charset=iso-8859-1'."\r\n";
$headers2.='From: Stefano Lupo Web Design <info@stefanolupo.tech>'."\r\n";


mail($emailAddress,"Stefano Lupo Web Design Confirmation","Your message has been successfully sent.<br>Please add this contact to your address book to ensure the response will not be marked as junkmail.<br><br> Thank you!
<br>
------------------------------
<br>
Lupo Web Design
<br>
Phone: 086 1727 160
<br>
Email: info@stefanolupo.tech
<br>
Website: www.stefanolupo.tech
<br>
Facebook: https://www.facebook.com/StefanoLupoWebDesign/", $headers2);


?>
