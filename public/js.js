function setvisible() {
  var nums = parseInt(document.getElementById("new_feat").value) + 1;
  document.getElementById("new_feat").value = nums;

  if (document.getElementById("new_feat_label").value === "") {
  } else {
    var div = document.createElement("div");

    var label = document.createElement("label");
    label.htmlFor = "v" + nums;
    label.innerText = document.getElementById("new_feat_label").value;

    var input1 = document.createElement("input");
    input1.type = "hidden";
    input1.className = "form-control";
    input1.name = "new_feat_" + nums;
    input1.value = document.getElementById("new_feat_label").value;

    var input = document.createElement("input");
    input.id = "v" + nums;
    input.name = "v" + nums;
    input.type = "text";
    input.required = true;
    input.className = "form-control";

    div.appendChild(input1);
    div.appendChild(label);
    div.appendChild(input);

    document.getElementById("add").appendChild(div);
    document.getElementById("new_feat_label").value = "";
  }
}

function calculate_discount_price() {
  var dis = document.getElementById("discount123").value;
  var price = document.getElementById("selling_price").value;
  document.getElementById("price_discount").value = price - (dis / 100) * price;
}

function calculate_discount_percentage() {
  var dis = document.getElementById("price_discount").value;
  var price = document.getElementById("selling_price").value;
  document.getElementById("discount123").value = ((price - dis) / price) * 100;
}

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
function saveSerials() {}
// creating new textField inside a div
function create_text_fields(i) {
  var label = document.createElement("label");
  label.textContent = "Serial " + i;
  var div = document.createElement("div");
  var breakk = document.createElement("br");
  div.id = "d" + i;

  var input = document.createElement("input");
  input.id = "v" + i;
  input.name = "v" + i;
  input.type = "Number";
  input.className = "form-control";
  input.required = true;
  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(breakk);
  document.getElementById("space").appendChild(div);
}
function set_var() {
  document.getElementById("check").value = "0";
}
function check_all_purchase_price(){
  // alert(document.getElementById("all_pp").value);
  var highest_pp= parseInt(document.getElementById("all_pp").value);
  var input= parseInt(document.getElementById("unit_price").value);
  
  if(input < highest_pp){
    document.getElementById("msg").innerHTML = "Enter a number greater than " + highest_pp;
    document.getElementById("msg").style.color = "red";
  }else{
    document.getElementById("msg").innerHTML = "";
  }
  
 
}

// creating text fields on quantity input
function createtextfields() {
  // alert(document.getElementById("check").value)
  var check = parseInt(document.getElementById("check").value); // keep track of the previously created fields
  var quantity = parseInt(document.getElementById("quantity").value); // given quantity

  if (check === 0) {
    for (var i = 1; i <= quantity; i++) {
      create_text_fields(i);
    }
    document.getElementById("check").value = quantity;
  } else if (check > 0 && check < quantity) {
    for (var j = check + 1; j <= quantity; j++) {
      create_text_fields(j);
    }
    document.getElementById("check").value = quantity;
  } else if (check > 0 && check > quantity) {
    for (var k = quantity + 1; k <= check; k++) {
      document.getElementById("d" + k).remove();
    }
    document.getElementById("check").value = quantity;
  } else if (check === quantity) {
  } else {
    alert("error");
  }
}

$(document).ready(function() {
  $("#model").change(function(e) {
    $.get(
      "/products/check_availablity/" + document.getElementById("model").value,
      {},
      function(data) {
        document.getElementById("pre_serial").value = JSON.stringify(data.data);
      }
    );
  });

  // onload
  // notificationCheck();


  // window.setInterval(function() {
  //   notificationCheck();
  // }, 5000);

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
              alert("in")
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

  // creating subcategory on the basis of selected category
  $("#categg").change(function() {
    var cat_id = document.getElementById("categg").value.split(",");
    $.get(
      "/category/getSub/" + cat_id[0],
      {
        cat_id: cat_id
      },
      function(data) {
        configureDropDownL(document.getElementById("subCategg"), data);
      }
    );
  });

  // creates dropdown
  function configureDropDownL(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data[0].subCategories.length; i++) {
      options +=
        "<option onClick='getAllSerials()'value=\"" +
        data[0].subCategories[i]._id +
        '">' +
        data[0].subCategories[i].name +
        "</>";
    }
    ddl2.innerHTML = options;
  }

});

// makes an array unique
function ArrNoDupe(a) {
  var temp = {};
  for (var i = 0; i < a.length; i++) temp[a[i]] = true;
  var r = [];
  for (var k in temp) r.push(k);
  return r;
}

// function checkValidityy() {
//   var arr = document.getElementById("serial").value.split(",");
//   var arr2 = ArrNoDupe(arr);
//   document.getElementById("serial").value = arr2;
//   document.getElementById("quantity").value = arr2.length;
// }

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


