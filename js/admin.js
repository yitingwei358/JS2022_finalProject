import * as api from "./api.js";

//預設 JS 開始-------
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
})

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}
//預設 JS 結束------



let orderData = [];
const orderList = document.querySelector(".js-orderList");

function init() {
  getOrderList()
}
init()


//C3圖表
function renderC3() {
  let total = {};
  orderData.forEach(function (item) {
    item.products.forEach(function (productItem) {
      console.log(productItem.category);
      if (total[productItem.category] == undefined) {
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    })
  })

  //做資料關聯，C3格式需要 [['Louvre 雙人床架', 11340],['Antony 雙人床架', 3980]]
  let categoryAry = Object.keys(total);
  let newData = [];
  categoryAry.forEach(function (item) {
    newData.push([item, total[item]]);
  })

  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
    },
  });
};


//訂單列表
function getOrderList() {
  api.apiGetOrder()
    .then(function (response) {
      orderData = response.data.orders;
      let str = "";

      //訂單表格字串
      orderData.forEach(function (item) {
        //組時間字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;
        console.log(orderTime);

        //組產品字串
        let productStr = "";
        item.products.forEach(function (productItem) {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
        })

        //判斷訂單處理狀態
        let orderStatus = "";
        if (item.paid === true) {
          orderStatus = "已處理";
        } else {
          orderStatus = "未處理";
        }

        //組字串
        str +=
          `<tr>
          <td>${item.id}</td>
          <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
          </td>
          <td>${item.user.address}</td>
          <td>${item.user.email}</td>
          <td>
            <p>${productStr}</p>
          </td>
          <td>${orderTime}</td>
          <td class="orderStatus">
            <a href="#" class="js-orderStatus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
          </td>
          <td>
            <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
          </td>
        </tr>`
      })
      orderList.innerHTML = str;
      renderC3()
    })
}


//互動按鈕
orderList.addEventListener("click", function (e) {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  let id = e.target.getAttribute("data-id");

  //刪除按鈕
  if (targetClass == "delSingleOrder-Btn js-orderDelete") {
    deleteOrder(id);
    return
  }

  //修改訂單狀態
  if (targetClass == "js-orderStatus") {
    let status = e.target.getAttribute("data-status");
    changeOrderStatus(status, id);
    return
  }
})


//互動按鈕函式 - 刪除按鈕
function deleteOrder(id) {
  api.apiDeleteOrder(id).then(function (response) {
    console.log(response);
    alert(`刪除成功`);
    getOrderList()
  })
}


//互動按鈕函式 - 修改訂單狀態
function changeOrderStatus(status, id) {
  let newStatus;
  if (status == "true") {
    newStatus = false;
  } else {
    newStatus = true;
  }
  api.apiPutOrder({
    "data": {
      "id": id,
      "paid": newStatus
    }
  }).then(function (response) {
    alert(`訂單狀態修改成功`);
    getOrderList()
  })
}


//清除全部訂單按鈕
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  api.apiDeleteAllOrder().then(function (response) {
    console.log(response);
    alert("訂單已全部刪除");
    getOrderList();
  })
})