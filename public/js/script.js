console.log("script is active");
function addFoodToBasket(rdid,did, dname, dprice, dimage) {
  cart = localStorage.getItem("cart");
  if (cart == null) {
    products = [];
    product = {
      rid:rdid,
      id: did,
      name: dname,
      price: dprice,
      image: dimage,
      quantity: 1,
    };
    products.push(product);
    localStorage.setItem("cart", JSON.stringify(products));
    swal.fire({
      toast: "true",
      background: "#A82c48",
      html: "<h6 class='text-light text-small px-1'>Your fisrt food added to basket</h6>",
      position: "bottom",
      showConfirmButton: false,
      timer: "2000",
      timerProgressBar: true,
    });
  } else {
    pcart = JSON.parse(cart);
    oldcart = pcart.find((item) => item.id == did);
    if (oldcart) {
      pcart.map((item) => {
        if (item.id == oldcart.id) {
          item.quantity++;
        }
      });

      localStorage.setItem("cart", JSON.stringify(pcart));

      swal.fire({
        toast: "true",
        background: "#A82c48",
        html: "<h6 class='text-light text-small px-1'>Food Quantity increased...</h6>",
        position: "bottom",
        showConfirmButton: false,
        timer: "2000",
        timerProgressBar: true,
      });
    } else {
      p = {
        rid:rdid,
        id: did,
        name: dname,
        price: dprice,
        image: dimage,
        quantity: 1,
      };
      pcart.push(p);
      localStorage.setItem("cart", JSON.stringify(pcart));

      swal.fire({
        toast: "true",
        background: "#A82c48",
        html: "<h6 class='text-light text-small px-1'>New Food added to basket</h6>",
        position: "bottom",

        showConfirmButton: false,
        timer: "2000",
        timerProgressBar: true,
      });
    }
  }
  updateCart();
}

function updateCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart == null || cart.length == 0) {
    $(".cart-num").html("( 0 )");
    $(".cart-body").html("Your cart is empty...");
    $(".order-btn").addClass("disabled");
  } else {
    $(".cart-num").html(`( ${cart.length} )`);
    $(".order-btn").removeClass("disabled");

    let table = `
       <table class="table table-hover">
           <tr class="text-style">
               <th>Pic</th>
               <th>Name</th>
               <th>Price</th>
               <th>Quantity</th>
               <th>Total</th>
               <th>Action</th>
           </tr>
       `;

    let totalPrice = 0;
    cart.forEach((item, index) => {
      table += `
               <tr>
                   <td> <img style='width:50px;height:50px;border-radius:50%' src='/static/image/img/${item.image}'/> </td>
                   <td><small>${item.name}</small></td>
                   <td><small>${item.price}</small></td>
                   <td>
                       <button class="btn btn-sm btn-danger" onclick="decrementQuantity(${index})">-</button> <small>${item.quantity}</small> <button class="btn btn-sm btn-success" onclick="incrementQuantity(${index})">+</button>
                   </td>
                   <td><small>${item.price * item.quantity}</small></td>
                   <td>
                       <button class="btn btn-danger btn-sm" onclick="removeBook(${index})">Remove</button>
                   </td>
               </tr>
           `;
      totalPrice += item.price * item.quantity;
    });

    table += `
               <tr>
                   <td colspan='5' class='text-right'>Total Price: ${totalPrice}</td>
               </tr>
               </table>
       `;
    $(".cart-body").html(table);
  }
}

function incrementQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function decrementQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function removeBook(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);  // Remove the item at the specified index

  if (cart.length === 0) {
    localStorage.removeItem("cart");
  } else {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCart();
  
  Swal.fire({
    toast: true,
    background: "#fecc0f",
    html: "<h6 class='text-dark text-small px-1'>Food removed from cart!!</h6>",
    position: "bottom",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });
}

$(document).ready(function () {
  updateCart();
});
