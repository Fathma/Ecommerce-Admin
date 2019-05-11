// saving as pdf
function myFunction() {
  document.getElementById("buttonID").style.display = "none";
  document.getElementById("footer").style.display = "none";

  window.print();
  document.getElementById("footer").style.display = "block";
  document.getElementById("buttonID").style.display = "block";
}

// lot edit checking previous serial
function check_org() {
  document.getElementById("msg_err").value = "";
  document.getElementById("msg").innerHTML = "";
  var new_sl = document.getElementById("new_serial").value;
  var string_data = document.getElementById("pre_all_or_serials").value;
  var per = string_data.split(",");

  if (per.includes(new_sl)) {
    document.getElementById("msg_err").value = "exist";
    document.getElementById("msg").innerHTML = "Already exists!";
    document.getElementById("msg").style.color = "red";
  } else {
    document.getElementById("msg_err").value = "No";
    document.getElementById("msg").innerHTML = "";
  }
}

// lot edit checking previous serial
function check_org_replace() {
  document.getElementById("msg_err1").value = "";
  document.getElementById("msg1").innerHTML = "";
  var new_sl = document.getElementById("replace_serial").value;
  var string_data = document.getElementById("pre_all_or_serials").value;
  var per = string_data.split(",");

  if (per.includes(new_sl)) {
    document.getElementById("msg_err1").value = "exist";
    document.getElementById("msg1").innerHTML = "Already exists!";
    document.getElementById("msg1").style.color = "red";
  } else {
    document.getElementById("msg_err1").value = "No";
    document.getElementById("msg1").innerHTML = "";
  }
}

// not implemented yet
function calculate_discount_price() {
  var dis = document.getElementById("discount123").value;
  var price = document.getElementById("selling_price").value;
  document.getElementById("price_discount").value = price - (dis / 100) * price;
}

// not implemented yet
function calculate_discount_percentage() {
  var dis = document.getElementById("price_discount").value;
  var price = document.getElementById("selling_price").value;
  document.getElementById("discount123").value = ((price - dis) / price) * 100;
}

// adds a new feature
function addnew() {
  var feat = document.getElementById("feat").value;
  if (document.getElementById("feats").value === "") {
    document.getElementById("feat").value = "";
    document.getElementById("feats").value = feat;
  } else {
    document.getElementById("feat").value = "";
    document.getElementById("feats").value =
    document.getElementById("feats").value + "," + feat;
  }
}

function set_var() {
  document.getElementById("check").value = "0";
}

function check_all_purchase_price() {
  // alert(document.getElementById("all_pp").value);
  var highest_pp = parseInt(document.getElementById("all_pp").value);
  var input = parseInt(document.getElementById("unit_price").value);

  if (input < highest_pp) {
    document.getElementById("msg").innerHTML =
      "Enter a number greater than " + highest_pp;
    document.getElementById("msg").style.color = "red";
  } else {
    document.getElementById("msg").innerHTML = "";
  }
}

// change the image on selecting a new image
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $("#image").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    readImageFile();
  }
}

$(document).ready(function() {
  // saving the pdf
  var doc = new jsPDF();
  var specialElementHandlers = {
    "#editor": function(element, renderer) {
      return true;
    }
  };
  // saving the pdf
  $("#cmd").click(function() {
    doc.fromHTML($("#content").html(), 15, 15, {
      width: 1000,
      elementHandlers: specialElementHandlers
    });
    doc.save("sample-file.pdf");
  });

  // on product model change this function get all the previous serial numbers
  // and adds to a hidden textfield
  // $("#model").change(function(e) {
  //   $.get(
  //     // here model is the product_id
  //     "/products/check_availablity/" + document.getElementById("model").value,
  //     {}, function(data) {
  //       document.getElementById("pre_serial").value = JSON.stringify(data.data);
  //     }
  //   );
  // });

  // // onload
  // notificationCheck();

  // window.setInterval(function() {

  //   notificationCheck();
  // }, 10000);

  // gets the notifications
  function notificationCheck() {
    $.get("/products/dashboard", {}, function(data_string) {
      if (data_string.count != 0) {
        document.getElementById("notification").textContent = JSON.stringify(
          data_string.count
        );
      }

      document.getElementById("lowLive").textContent = JSON.stringify(
        data_string.quantity
      );

      if (data_string.quantity === 0) {
        document.getElementById("set_href").href = "#";
      } else {
        document.getElementById("set_href").href = "/products/viewLowLive";
      }
    });
  }
  
  function checkValidityy() {
    var arr = document.getElementById("serial").value.split(",");
    var arr2 = ArrNoDupe(arr);
    document.getElementById("serial").value = arr2;
    document.getElementById("quantity").value = arr2.length;
  }

// on selection of a serial number it makes the color black and returns an unique array to the serial Text Box
// Seems like the selected serail number is disabled after first click
function set_disable(id) {
  var all = [];
  if (document.getElementById("serial").value != "") {
    var val =
      document.getElementById("serial").value +
      "," +
      parseInt(document.getElementById(id).innerHTML);
    var values = ArrNoDupe(val.split(","));

    document.getElementById("serial").value = values;
    document.getElementById("quantity").value = values.length;
    document.getElementById(id).style.color = "#041126";
  } else {
    all.push(parseInt(document.getElementById(id).innerHTML));
    document.getElementById("serial").value = all[0];
    document.getElementById("quantity").value = "1";
    document.getElementById(id).style.color = "#041126";
  }
}

function set_disableNoSerial(id) {
  var all = [];
  if (document.getElementById("serial").value != "") {
    var val =
      document.getElementById("serial").value +
      "," +
      document.getElementById(id).innerHTML.trim();
    var values = ArrNoDupe(val.split(","));

    document.getElementById("serial").value = values;
    document.getElementById("quantity").value = values.length;
    document.getElementById(id).style.color = "#041126";
  } else {
    all.push(document.getElementById(id).innerHTML.trim());
    document.getElementById("serial").value = all[0];
    document.getElementById("quantity").value = "1";
    document.getElementById(id).style.color = "#041126";
  }
}

// saving Inventory with serial numbers
$("form").submit(function(e) {
  // this is to prevent double submit
  if (document.getElementById("val").value === "0") {
    var check = parseInt(document.getElementById("check").value);
    var data_string = "";
    for (var i = 1; i <= check; i++) {
      if (document.getElementById("v" + i).value != "") {
        data_string += document.getElementById("v" + i).value;
        if (check != i) {
          data_string += ",";
        }
      }
    }

    if (
      document.getElementById("check").value === "0" ||
      document.getElementById("check").value !=
      document.getElementById("quantity").value
    ) {
      createtextfields();
      e.preventDefault();
    } else {
      if (data_string === "") {
      } else {
        if (
          data_string.split(",").length !=
          ArrNoDupe(data_string.split(",")).length
        ) {
          alert("Serial numbers have to be unique!");
          e.preventDefault();
        } else {
          var string_data = document.getElementById("pre_serial").value;
          var per = string_data.split(",");

          // the first value as "123... here removing the "
          var fi = "";
          for (var j = 1; j < per[0].length; j++) {
            fi += per[0][j];
          }

          // the first value as 123"... here removing the "
          var la = "";
          for (var j = 0; j < per[per.length - 1].length - 1; j++) {
            la += per[per.length - 1][j];
          }
          per.push(la);
          per.push(fi);

          var new_arr = data_string.split(",");
          var exists = "";

          for (var i = 0; i < new_arr.length + 1; i++) {
            if (per.includes(new_arr[i])) {
              exists += new_arr[i] + " ";
            }
          }

          if (exists.length === 0) {
            $.post(
              "/products/SaveInventory",
              {
                serial: data_string,
                model: document.getElementById("model").value,
                purchase_price: parseInt(
                  document.getElementById("purchase_price").value
                ),
                quantity: document.getElementById("quantity").value
              },
              function(data_string) {
                alert(JSON.stringify(data_string));
              }
            );
            alert("successful");
            document.getElementById("val").value = "1";
          } else {
            alert(exists + "already exists!");
            e.preventDefault();
          }
        }
      }
    }
  }
});
});


// // creating new textField inside a div
// function create_text_fields(i) {
//   var label = document.createElement("label");
//   label.textContent = "Serial " + i;
//   var div = document.createElement("div");
//   var breakk = document.createElement("br");
//   div.id = "d" + i;

//   var input = document.createElement("input");
//   input.id = "v" + i;
//   input.name = "v" + i;
//   input.type = "Number";
//   input.className = "form-control";
//   input.required = true;
//   div.appendChild(label);
//   div.appendChild(input);
//   div.appendChild(breakk);
//   document.getElementById("space").appendChild(div);
// }


// function tableCreate() {
//   var tbl = document.createElement('table');
//   tbl.style.width = '100%';
//   // tbl.setAttribute('border', '1');
//   var tbdy = document.createElement('tbody');
//   for (var i = 0; i < 3; i++) {
//     var tr = document.createElement('tr');
//     for (var j = 0; j < 2; j++) {
//     //   if (i == 2 && j == 1) {
//     //     break
//     //   } else {
//         var td = document.createElement('td');
//         td.innerHTML="sdfjhsdkjfhkjh";
//         tr.appendChild(td)
//       // }
//     }
//     tbdy.appendChild(tr);
//   }
//   tbl.appendChild(tbdy);
//   document.getElementById("tab").appendChild(tbl)
// }
// tableCreate();

// checking during selecting serial number for ordered products
// function set_serial_last() {
//   var product_serial = document.getElementById("Serial");

//   if (document.getElementById("selected").value === "0") {
//   } else {
//     if (product_serial.value === "") {
//       product_serial.value = document.getElementById("selected").value;
//       document.getElementById("new_msg").innerHTML ="You have to select " + document.getElementById("quantity").value;
//     } else {
//       if (product_serial.value.split(",").length === parseInt(document.getElementById("quantity").value)
//       ) {
//         document.getElementById("new_msg").innerHTML = "";
//         alert("Quantity of the product is satisfied");
//       }
//       else {
//         document.getElementById("new_msg").innerHTML ="You have to select " + document.getElementById("quantity").value;
//         product_serial.value = product_serial.value +"," + document.getElementById("selected").value;
//       }
//     }
//     var srr = ArrNoDupe(product_serial.value.split(","));
//     product_serial.value = srr;
//   }
// }

// // creating text fields on quantity input
// function createtextfields() {
//   // alert(document.getElementById("check").value)
//   var check = parseInt(document.getElementById("check").value); // keep track of the previously created fields
//   var quantity = parseInt(document.getElementById("quantity").value); // given quantity

//   if (check === 0) {
//     for (var i = 1; i <= quantity; i++) {
//       create_text_fields(i);
//     }
//     document.getElementById("check").value = quantity;
//   } else if (check > 0 && check < quantity) {
//     for (var j = check + 1; j <= quantity; j++) {
//       create_text_fields(j);
//     }
//     document.getElementById("check").value = quantity;
//   } else if (check > 0 && check > quantity) {
//     for (var k = quantity + 1; k <= check; k++) {
//       document.getElementById("d" + k).remove();
//     }
//     document.getElementById("check").value = quantity;
//   } else if (check === quantity) {
//   } else {
//     alert("error");
//   }
// }
