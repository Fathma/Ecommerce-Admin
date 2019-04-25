$(document).ready(function() {
  var products = [];
  // getting invoice(local purchase) details on basis of selected invoice number
  $("#invoice").change(function(e) {
    var invoice = document.getElementById("invoice");
    if (invoice.value != "0") {
      $.get("/purchase/getProducts/" + invoice.value, {}, function(data) {
        var date = data.date.split("T");
        document.getElementById("supplier").value = data.supplier.cname;
        document.getElementById("date").value = date[0];
        configureDropDownL4(
          document.getElementById("products_invoice"),
          data.products
        );
        products = data.products;
      });
    }
  });

  // creates dropdown for product field
  function configureDropDownL4(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data.length; i++) {
      options +=
        "<option value=\"" +
        data[i].product._id +
        '">' +
        data[i].product.productName;
      ("</>");
    }
    ddl2.innerHTML = options;
  }

  // document.getElementById("new_feat").value = "0";

  // gets product info on the basis of selected product
  $("#products_invoice").change(function(e) {
    var id = document.getElementById("products_invoice").value;
    document.getElementById("subcategory").value = "";

    // creating label and input fields for previous features
    products.map(product => {
      if (product.product._id == id) {
        document.getElementById("unitPrice").value = product.purchasePrice;
        document.getElementById("category").value =
          product.product.category.name;
        if (product.product.subcategory) {
          document.getElementById("subcategory").value =
            product.product.subcategory.name;
        }
        document.getElementById("brand").value = product.product.brand.name;
        document.getElementById("name").value = product.product.name;
        document.getElementById("model").value = product.product.model;
        document.getElementById("quantity").value = product.quantity;
        document.getElementById("pid").value = product.product.pid;
        document.getElementById("weight").value = product.product.weight;
        document.getElementById("warranty").value = product.product.warranty;
        document.getElementById("description").value = product.product.description;
        document.getElementById("shippingInfo").value = product.product.shippingInfo;
        var nums = product.product.features.length;
        alert(product.quantity);
        document.getElementById("new_feat").value = nums;

        var add = document.getElementById("add");
        // removes all child elements
        while (add.firstChild) {
          add.removeChild(add.firstChild);
        }

        // creates the div containing label and one helping input containing label text
        for (var i = 0; i < nums; i++) {
          var label= createLabel("v",i, product.product.features[i].label)
          var input1= createInputfield("hidden","new_feat_", i, product.product.features[i].label)
          var input= createInputfield("text","v", i, product.product.features[i].value)

          var out = create_div("row", "out", nums)
          var outc1 = create_div("col-md-5 col5","outc1r1c1", nums)
          var outc2 = create_div("col-md-6","outc1", nums)

          out.appendChild(outc1)
          out.appendChild(outc2)
         
          outc1.appendChild(label)
          outc2.appendChild(input1)
          outc2.appendChild(input)

          add.appendChild(out);
          add.appendChild(document.createElement("br"));
        }
        
        var space = document.getElementById("space");

        // removes all child elements
        while (space.firstChild) {
          space.removeChild(space.firstChild);
        }
        document.getElementById("new_feat").value = nums;
        if (product.product.serial_availablity) {
          for (var i = 0; i < product.quantity; i++) {
            create_text_fields(i);
          }
        }
      }
    });
  });

  function createLabel(pre,num, text){
    var label = document.createElement("label");
    label.htmlFor = pre + num;
    label.className = "lbl";
    label.innerText = text;
    return label;
  }

  function createInputfield(type,pre,num, value){
    var input = document.createElement("input");
    input.id = pre + num;
    input.name = pre + num;
    input.type = type;
    input.className = "form-control inp";
    input.value = value;
    return input;
  }

  // creates fields for serial number
  function create_text_fields(i) {
    var label= createLabel("v",i, "Serial"+(i+1))
    var input= createInputfield("text","s", i, "")
    
    var out = create_div("row", "out", i)
    var outc1 = create_div("col-md-5 col5","outc1r1c1", i)
    var outc2 = create_div("col-md-6","outc1", i)

    out.appendChild(outc1)
    out.appendChild(outc2)
   
    outc1.appendChild(label)
    outc2.appendChild(input)

    document.getElementById("space").appendChild(out);
    document.getElementById("space").appendChild(document.createElement("br"));
  }

  $("#save_inventory").click(function(e) {
    var pid = document.getElementById("products_invoice").value
    
    var product_attribute = {
      _id: pid,
      name: document.getElementById("name").value,
      weight: document.getElementById("weight").value,
      warranty: document.getElementById("warranty").value,
      description: document.getElementById("description").value,
      shippingInfo: document.getElementById("shippingInfo").value
    };

    var new_feat = parseInt(document.getElementById("new_feat").value);

    // var features = [];
    // for (var i = 0; i < new_feat; i++) {
    //   var obj = {
    //     label: document.getElementById("new_feat_" + i).value,
    //     value: document.getElementById("v" + i).value
    //   };
    //   features.push(obj);
    // }
    product_attribute.features = get_features(new_feat);
    
    // for getting serial numbers
    var quantity =  parseInt(document.getElementById("quantity").value);

    var serials=[]
    for(var i= 0; i<quantity; i++){
      var obj ={
        number: document.getElementById("s"+i).value,
        sid: document.getElementById("model").value + "-" + document.getElementById("s"+i).value,
        lp:  document.getElementById("invoice").value,
        pid: pid
      }
      serials.push(obj)
    }

    $.post("/products/regiSave", { data: product_attribute, serials: serials}, function(data) {
      alert("Done");
    });
  });

  $("#save_inventory_dealer").click(function(e) {
    var product_attribute = {
      _id: document.getElementById("_id").value,
      name: document.getElementById("name").value,
      weight: document.getElementById("weight").value,
      warranty: document.getElementById("warranty").value,
      description: document.getElementById("description").value,
      shippingInfo: document.getElementById("shippingInfo").value
    };

    var new_feat = parseInt(document.getElementById("new_feat").value);
    product_attribute.features = get_features(new_feat);

    $.post("/products/regiSaveDealer", { data: product_attribute}, function(data) {
      alert("Done");
    });
  });

  function get_features(new_feat){
    var features = [];
    for (var i = 0; i < new_feat; i++) {
      var obj = {
        label: document.getElementById("new_feat_" + i).value,
        value: document.getElementById("v" + i).value
      };
      features.push(obj);
    }
    return features
  }
  
  // document.getElementById("new_feat").value=0;
  $("#addNewfeature").click(function(e) {
  var nums = parseInt(document.getElementById("new_feat").value) ;
  if (document.getElementById("new_feat_label").value === "") {
  } else {
    var label= createLabel("v",nums, document.getElementById("new_feat_label").value)
    var input1= createInputfield("hidden","new_feat_", nums, document.getElementById("new_feat_label").value)
    var input= createInputfield("text","v", nums, "")
  
    var out = create_div("row", "out", nums)
    var outc1 = create_div("col-md-5 col5","outc1r1c1",nums)
    var outc2 = create_div("col-md-6","outc1", nums)

    out.appendChild(outc1)
    out.appendChild(outc2)
   
    outc1.appendChild(label)
    outc2.appendChild(input)
    outc2.appendChild(input1)

    document.getElementById("add").appendChild(out);
    document.getElementById("add").appendChild(document.createElement("br"));
    document.getElementById("new_feat_label").value = "";
    document.getElementById("new_feat").value = nums+1;
  }
})
});
