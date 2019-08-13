<?php 

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = $_POST['name'] ? $_POST['name'] : '';
$phone = $_POST['phone'] ? $_POST['phone'] : '';
$email = $_POST['email'] ? $_POST['email'] : '';
$info = $_POST['info'] ? $_POST['info'] : '';

// $name = "Alex";
// $phone = "240655";
// $email = 'some@gmail.com';
//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  																							// Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'aeolian.mail@gmail.com'; // Ваш логин от почты с которой будут отправляться письма
$mail->Password = 'XerhbQ156354789'; // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587; // TCP port to connect to / этот порт может отличаться у других провайдеров

$mail->setFrom('aeolian.mail@gmail.com'); // от кого будет уходить письмо?
$mail->addAddress('chukriy@gmail.com');     // Кому будет уходить письмо 
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

ob_start();        
include('email-template.php');
$body = ob_get_clean();

echo $contactStr;

$mail->Subject = 'Письмо от нового клиента!';
$mail->Body    = $body;
$mail->AltBody = '';

if(!$mail->send()) {
    echo 'Error';
} else {
    header('location: /');
}
?>