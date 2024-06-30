<? php

require_once './config/connect.php';

$id = $_POST['id'];
$title = $_POST['title'];
$descr = $_POST['descr'];
$price = $_POST['price'];

mysqli_query ($connect, «UPDATE `products` SET `title` = '$title', `price` = '$price', `descr` = '$descr' WHERE `products`.`id` = '$id'»);

header ('Location: /');