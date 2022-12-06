const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCart-tableList");

let productData = [];
let cartData = [];

//初始化
function init() {
  getProductList();
  getCartList();
}
init();

//使用ES6 MODULE功能，記得先在 HTML 的JS script中加入type="module" <重要!!!!>
import * as api from "./api.js";

//api.js 檔中，export 時的箭頭涵式為回傳初始化的 axios Promise (axios.get)，所以這裡只需要用 .then() 接上
function getProductList() {
  api.apiGetProduct().then(function (response) {
    productData = response.data.products;
    renderProductList()
  })
}


//產品HTML結構
function productHTML(item) {
  return `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src=${item.images}
      alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`
}


//產品列表
function renderProductList() {
  let str = "";
  productData.forEach(function (item) {
    str += productHTML(item);
  })
  productList.innerHTML = str;
}


//產品篩選器
productSelect.addEventListener("change", function (e) {
  const category = e.target.value;
  if (category == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (category == item.category) {
      str += productHTML(item);
    }
  })
  productList.innerHTML = str;
})


//加入購物車按鈕
//這邊監聽 productList 而不選擇監聽addCardBtn的原因是，後者因為變成要監聽很多個dom會拖慢速度，所以會選擇監聽外層的ul而不是裡面的li
productList.addEventListener("click", function (e) {
  e.preventDefault(); //取消預設轉址，原本a連結，按下後頁面會往上跳到頁首
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "addCardBtn") {
    return
  }
  let productId = e.target.getAttribute("data-id");
  console.log(productId);

  let numCheck = 1;
  cartData.forEach(function (item) {
    if (item.product.id === productId) {
      numCheck = (item.quantity) += 1;
    }
  })

  api.apiPostCartList({
    "data": {
      "productId": productId,
      "quantity": numCheck
    }
  }).then(function (response) {
    alert("成功加入購物車");
    getCartList();
  }).catch(function (error) {
    console.log(error);
  })
});


//購物車列表渲染
function getCartList() {
  api.apiGetCartList().then(function (response) {

    //購物車 - 總金額
    const finalTotal = document.querySelector(".js-finalTotal");
    finalTotal.textContent = response.data.finalTotal;

    cartData = response.data.carts;
    console.log(cartData);
    renderCartList()
  })
}


//購物車列表字串
function renderCartList() {
  let str = "";
  cartData.forEach(function (item) {
    str +=
      `<tr>
        <td>
          <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
          </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
          <a href="#" class="material-icons" data-cartId="${item.id}">
            clear
          </a>
        </td>
        </tr>
      `;
  });
  cartList.innerHTML = str;
};


//購物車 - 刪除單筆
cartList.addEventListener("click", function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-cartId");
  if (cartId == null) {
    return;
  };

  api.apiDeleteCartList(cartId).then(function (response) {
    getCartList();
  })
})


//購物車 - 刪除全部
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  api.apiDeleteAllCartList().then(function (response) {
    alert('您已刪除購物車內所有商品');
    getCartList();
  })
})


//送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (cartData.length == 0) {
    alert('您的購物車內沒有商品');
    return
  } else {
    alert('買起來~~');
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const tradeWay = document.querySelector("#tradeWay").value;

  if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || tradeWay == "") {
    alert('欄位均為必填');
  }
  api.apiPostOrder({
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": tradeWay
      }
    }
  }).then(function (response) {
    alert('訂單建立成功');
    const orderInfoForm = document.querySelector(".orderInfo-form");
    orderInfoForm.reset();
    getCartList(); 
  })
})

