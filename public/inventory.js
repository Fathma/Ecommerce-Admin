

$(document).ready(function() {
  var products = [];
  var byId = function( id ) { return document.getElementById( id ); };
 
  // getting invoice(local purchase) details on basis of selected invoice number
  $("#invoice").change(function(e) {
    byId("img_number").value = "0"
    var invoice = byId("invoice");

    if (invoice.value != "0") {
      $.get("/purchase/getProducts/" + invoice.value, {}, function(data) {
        var date = data.date.split("T");
        byId("supplier").value = data.supplier.cname;
        byId("date").value = date[0];
        configureDropDownL4( byId("products_invoice"), data.products );
        products = data.products;
      });
    }
  });

  // creates dropdown for product field
  function configureDropDownL4(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data.length; i++) {
      options += '<option value="' +data[i].product._id +
        '">' + data[i].product.productName + "</>";
    }
    ddl2.innerHTML = options;
  }

  $("#imagePath").on("change", function() {
    var pre = parseInt(byId("img_number").value);
    if($("#imagePath")[0].files.length + pre > 5) {
      alert("Warning !!! You can't select more than 5 images");
      byId("save_img").disabled = true;
    } 
    else byId("save_img").disabled = false;
  });

  var remove_child = (div)=>{
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  // gets product info on the basis of selected product
  $("#products_invoice").change(function(e) {
    var id = byId("products_invoice").value;
    byId("subcategory").value = "";

    // creating label and input fields for previous features
    var product = products.filter(product=> product.product._id == id)
    const {_id, name, productName, pid, category,subcategory,brand, model, weight, warranty, description, image }= product[0].product
    const { shippingInfo, serial_availablity, features}= product[0].product;
    const {quantity,purchasePrice}= product[0];

    byId("pname").value = productName
    byId("pid").value = _id
    byId("img_number").value = image.length

    if(image.length >= 5){
      byId("save_img").disabled = true;
    }
   
    // create space for image
    remove_child(byId("all_img"))
    // image.map(image=>{
    //   var col = create_div("col-md-2", "outc1r1c1", 1);
    //   var img = document.createElement("img");
    //   img.style.width= '100px';
    //   img.style.height= '100px';
    //   img.src = "/photos/"+image;
      
    //   var row = create_div("row", "row1", 1);
    //   var col1 = create_div("col-md-12", "col1", 1);
    //   var col2 = create_div("col-md-12", "col1", 1);
    //   var btn = document.createElement("button");
    //   btn.innerHTML="x";

    //   col1.appendChild(img)
    //   col2.appendChild(btn)
    //   row.appendChild(col1)
    //   row.appendChild(col2)
    //   col.appendChild(row)

    //   byId("all_img").appendChild(col);
    // })
  
    byId( 'unitPrice' ).value = purchasePrice;
    byId("category").value = category.name;

    if (subcategory) {
      byId("subcategory").value = subcategory.name;
    }
    byId("brand").value = brand.name;
    byId("name").value = name;
    byId("model").value = model;
    byId("quantity").value =quantity;
    byId("weight").value = weight;
    byId("warranty").value = warranty;
    byId("description").value = description;
    byId("shippingInfo").value = shippingInfo;
    byId("serial").value = serial_availablity;

    var nums = features.length;
    byId("new_feat").value = nums;

    remove_child(byId("add"))

    // creates the div containing label and one helping input containing label text
    for (var i = 0; i < nums; i++) {
      var label = createLabel("v", i, features[i].label);
      var input1 = createInputfield("hidden","new_feat_",i, features[i].label);
      var input = createInputfield("text","v",i, features[i].value);

      create_row_feature(nums,label, input, input1)
    }

    remove_child(byId("space"))

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = `${yyyy}-${mm}-${dd}` ;

    byId("new_feat").value = nums;
  
    for (var i = 0; i < quantity; i++) {
      var label1 = createLabel("pid", i, "PID" + (i + 1));
      var input1 = createInputfield("text", "pid", i, `${pid}-${today}-${randomString(4)}`);
      create_row(i, label1, input1);

      if (serial_availablity) {
        var label = createLabel("v", i, "Serial" + (i + 1));
        var input = createInputfield("text", "s", i, "");
        create_row(i, label, input);
      }
    }
  });
  
  // byId("new_feat").value=0;
  $("#addNewfeature").click(function(e) {
    var nums = parseInt(byId("new_feat").value);

    if (byId("new_feat_label").value != "") {
      var label = createLabel( "v", nums, byId("new_feat_label").value );
      var input1 = createInputfield( "hidden","new_feat_", nums, byId("new_feat_label").value );
      var input = createInputfield("text", "v", nums, "");
      create_row_feature(nums,label, input, input1)

      byId("new_feat_label").value = "";
      byId("new_feat").value = nums + 1;
    }
  });

  // creates fields for serial number
  function create_row_feature(i, label, input, input1) {
    var out = create_div("row", "out", i);
    var outc1 = create_div("col-md-5 col5", "outc1r1c1", i);
    var outc2 = create_div("col-md-6", "outc1", i);

    out.appendChild(outc1);
    out.appendChild(outc2);

    outc1.appendChild(label);
    outc2.appendChild(input1);
    outc2.appendChild(input);

    byId("add").appendChild(out);
    byId("add").appendChild(document.createElement("br"));
  }

  // creates fields for serial number
  function create_row(i, label, input) {
    var out = create_div("row", "out", i);
    var outc1 = create_div("col-md-5 col5", "outc1r1c1", i);
    var outc2 = create_div("col-md-6", "outc1", i);

    out.appendChild(outc1);
    out.appendChild(outc2);

    outc1.appendChild(label);
    outc2.appendChild(input);

    byId("space").appendChild(out);
    byId("space").appendChild(document.createElement("br"));
  }

  function createLabel(pre, num, text) {
    var label = document.createElement("label");
    label.htmlFor = pre + num;
    label.className = "lbl";
    label.innerText = text;
    return label;
  }

  function createInputfield(type, pre, num, value) {
    var input = document.createElement("input");
    input.id = pre + num;
    input.name = pre + num;
    input.type = type;
    input.className = "form-control inp";
    input.value = value;
    return input;
  }
  
  function randomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function get_json(a){
    var obj = '{'
    for(var i=0; i<a.length; i++){
      obj += '"'+ a[i].id +'":"'+a[i].value+'"';
      if(i !=a.length-1){
        obj += ','
      }
    }
    obj += '}'
    return(JSON.parse(obj))
  }

  $("#save_inventory").click(function(e) {
    var pre = parseInt(byId("img_number").value);
    if(pre === 0 && $("#imagePath")[0].files.length === 0) {
      alert("please select image!")
      window.location.href="#image_sec1";
    }
    else{
    var a = $('input:not(form input)');
    form_data = get_json(a);
    var {serial, quantity, invoice, name, weight, warranty, sellingPrice} = form_data;

    // for getting serial numbers
    var pid = byId("products_invoice").value
    var serials = [];
    var serial_array = [];

    for (var i = 0; i < parseInt(quantity); i++) {
      var obj = {
        sid: byId("pid"+i).value,
        lp: invoice,
        pid:pid,
        status: "In Stock"
      };
      
      if(serial === "true"){
        serial_array.push(byId("s" + i).value);
        obj.number= byId("s" + i).value
      }
      serials.push(obj);
    }

    if (ArrNoDupe(serial_array).length != serial_array.length) alert("serial numbers has to be unique!"); 
    else {
      $.post("/products/checkSerials", { serial_array, pid:pid }, (data)=> {
          if (data.exists.length > 0){
            alert(data.exists + " are already exists");
          } 
          else {
            var product_attribute = { _id: pid, name, weight, warranty,
              description: byId("description").value,
              shippingInfo: byId("shippingInfo").value
            };
            var new_feat = parseInt(byId("new_feat").value);
            product_attribute.features = get_features(new_feat);
  
            $.post("/products/regiSave",{ data: product_attribute, serials: serials }, function(data) {
              alert("Now Submit the image")
              window.location.href="#image_sec1";
            });
          }
        }
      );
    }
  }
  });

  // makes an array unique
  function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++) temp[a[i]] = true;
    var r = [];
    for (var k in temp) {
      r.push(k);
    }
    return r;
  }

  $("#save_inventory_dealer").click(function(e) {
    // alert("Now Submit the image")
    //     window.location.href="#image_sec";
    if( $("#imagePath")[0].files.length === 0) {
      alert("please select image!")
      window.location.href="#image_sec";
      document.getElementsByName("image_sec").style.border = "red solid"
    }
    else{
      var product_attribute = {
        _id: byId("_id").value,
        name: byId("name").value,
        weight: byId("weight").value,
        warranty: byId("warranty").value,
        description: byId("description").value,
        shippingInfo: byId("shippingInfo").value
      };

      var new_feat = parseInt(byId("new_feat").value);
      product_attribute.features = get_features(new_feat);

      $.post("/products/regiSaveDealer", { data: product_attribute }, (data)=> {
        alert("Now Submit the image")
        window.location.href="#image_sec";
      });
    }
  });

  function get_features(new_feat) {
    var features = [];
    for (var i = 0; i < new_feat; i++) {
      console.log(i);
      var obj = {
        label: byId("new_feat_" + i).value,
        value: byId("v" + i).value
      };
      features.push(obj);
    }
    return features;
  }

  // update product info
  $("#update_product").click(function(e) {
    // alert("Now Submit the image")
    //     window.location.href="#image_sec";
    // if( $("#imagePath")[0].files.length === 0) {
    //   alert("please select image!")
    //   window.location.href="#image_sec";
    //   document.getElementsByName("image_sec").style.border = "red solid"
    // }
    // else{
      var product_attribute = {
        _id: byId("_id").value,
        name: byId("name").value,
        model: byId("model").value,
        weight: byId("weight").value,
        warranty: byId("warranty").value,
        description: byId("description").value,
        shippingInfo: byId("shippingInfo").value
      };

      var new_feat = parseInt(byId("new_feat").value);
      console.log(new_feat)
      product_attribute.features = get_features(new_feat);
      console.log(product_attribute)
      $.post("/products/regiSaveDealer", { data: product_attribute }, (data)=> {
        alert("Now Submit the image")
        window.location.href="#image_sec";
      });
    // }
  });
});