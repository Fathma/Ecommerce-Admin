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
function saveSerials(){
 
 
  
 
}
// creating new textField inside a div
function create_text_fields(i) {
  var div = document.createElement("div");
  var breakk= document.createElement("br");
  div.id = "d"+i;
  
  var input = document.createElement("input");
  input.id = "v" + i;
  input.name = "v" + i;
  input.type = "Number";
  input.className = "form-control";
  input.required = true;
  div.appendChild(input);
  div.appendChild(breakk);
  document.getElementById("space").appendChild(div);
}

document.getElementById("check").value = "0";

// creating text fields on quantity input
function createtextfields() {

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
    
  } else if(check > 0 && check > quantity){
   
    for (var k = quantity + 1; k <= check; k++) {
      document.getElementById("d"+k).remove();
    }
    document.getElementById("check").value = quantity;
  }else if(check===quantity){

  }
  else{
    alert("error")
  }
}


$(document).ready(function() {

  $("form").submit(function(e){
    if(document.getElementById("check").value === "0"){
      createtextfields();
      e.preventDefault();
    }else{
     
      var check =parseInt(document.getElementById("check").value);
      var data= "";
      for(var i= 1; i<=check; i++){
        data += document.getElementById("v"+i).value;
        if(check != i){
          data +=",";
        }
      }
      if((data.split(",")).length != ArrNoDupe((data.split(","))).length){
        alert("Serial numbers have to be unique!");
        e.preventDefault();
      }else{

        $.post("/products/SaveInventory",
        {
          serial: data,
          model: document.getElementById("model").value,
          purchase_price: parseInt(document.getElementById("purchase_price").value),
          quantity: document.getElementById("quantity").value
        },
        function(data) {
        });
        alert("Successful")
      }
      
    }
    
});
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

  function configureDropDownL(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data[0].subCategories.length; i++) {
      options +=
        '<option value="' +
        data[0].subCategories[i]._id +
        '">' +
        data[0].subCategories[i].name +
        "</>";
    }
    document.getElementById("subCategg").innerHTML = options;
  }
});

function ArrNoDupe(a) {
  var temp = {};
  for (var i = 0; i < a.length; i++) temp[a[i]] = true;
  var r = [];
  for (var k in temp) r.push(k);
  return r;
}


function checkValidityy() {
  var arr = document.getElementById("serial").value.split(",");
  var arr2 = ArrNoDupe(arr);
  document.getElementById("serial").value = arr2;
  document.getElementById("quantity").value = arr2.length;
}

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
