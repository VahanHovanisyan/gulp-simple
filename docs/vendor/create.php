<? php

require_once './config/connect.php';

$title = $_POST['title'];
$descr = $_POST['descr'];
$price = $_POST['price'];

mysqli_query ($connect,"INSERT INTO `products` (`id`, `title`, `price`, `descr`) VALUES (NULL, '$title', '$price', '$descr')»);

header ('Location: /');