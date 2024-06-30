<? php

require_once 'config/connect.php';
$product_id = $_GET['id'];
$product = mysqli_query ($connect, «SELECT * FROM `products` WHERE `id` = '$product_id'»);
$product = mysqli_fetch_assoc ($product);

$comments = mysqli_query ($connect, «SELECT * FROM `comments` WHERE `product_id` = '$product_id'»);

$comments = mysqli_fetch_all ();
? >

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product</title>
</head>

<body>
  <h1>Title: <? = $product['title']? ></h1>
  <h2>Price: <? = $product['price']? ></h2>
  <h2>Description: <? = $product['descr']? ></h2>

  <form action="vendor/create_comment.php" method="post" class="form">
    <input type="hidden" name="id" value="<?= $product['id'] ?>«>
    <textarea name="body"></textarea>
    <button class="btn-reset form__btn">add comment</button>
  </form>

  <h2>Comments</h2>

  <ul>

    <? php

    foreach ($comments as $comment) {
   ? >
      <li>
        <? = $comment? >
      </li>
    <? php
    }
   ? >
  </ul>
</body>

</html>