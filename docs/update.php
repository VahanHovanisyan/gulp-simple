<? php

  require_once 'config/connect.php';
  $product_id = $_GET['id'];
  $product = mysqli_query ($connect, «SELECT * FROM `products` WHERE `id` = '$product_id'»);
  $product = mysqli_fetch_assoc ($product);
? >

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>update</title>
  <style>
    .form {
      max-width: 400px;
    }
    .form__label {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  </style>
</head>
<body>
<form action="vendor/update.php" method="post" class="form">
  <input type="hidden" name="id" value="<?= $product['id'] ?>«>
    <label class="form__label">
      Title
      <input type="text" name="title" value="<?= $product['title'] ?>» class="input-reset form__input">
    </label>
    <label class="form__label">
      Description
      <textarea name="descr"><? = $product['descr']? ></textarea>
    </label>
    <label class="form__label">
      Price
      <input type="number" name="price" value="<?= $product['price'] ?>» class="input-reset form__input">
    </label>
    <button class="btn-reset form__btn">update</button>
  </form>
</body>
</html>