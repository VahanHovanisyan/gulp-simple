<?php
require_once "config/connect.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>products</title>
  <style>
    th,td {
      padding: 10px;
      color: #fff;
    }
    th {
      background-color: #606060;

    }
    td {
      background-color: gray;
    }
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

<h1>gulp php</h1>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <?php $products = mysqli_query($connect, "SELECT * FROM `products`");
        $products = mysqli_fetch_all($products);
        foreach($products as $product) {
      ?>

      <tr>
        <td><?= $product[0] ?></td>
        <td><?= $product[1] ?></td>
        <td><?= $product[3] ?></td>
        <td><?= $product[2] ?></td>
        <td><a href="product.php?id=<?= $product[0] ?>">view</a></td>
        <td><a href="update.php?id=<?= $product[0] ?>">update</a></td>
        <td><a style="color: red;" href="vendor/delete.php?id=<?= $product[0] ?>">delete</a></td>
      </tr>

      <?php
        }
      ?>

    </tbody>
  </table>

  <form action="vendor/create.php" method="post" class="form">
    <label class="form__label">
      Title
      <input type="text" name="title" class="input-reset form__input">
    </label>
    <label class="form__label">
      Description
      <textarea name="descr" ></textarea>
    </label>
    <label class="form__label">
      Price
      <input type="number" name="price" class="input-reset form__input">
    </label>
    <button class="btn-reset form__btn">add new product</button>
  </form>

</body>

</html>