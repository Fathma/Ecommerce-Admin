$(document).ready(function() {

  // save new category
  $(function() {
    $("#myForm1").on("click", function(e) {
      e.preventDefault();
      var cat = document.getElementById("cat").value;
      $.post("/category/addCategory", { cat: cat }, function(data) {
        location.reload(true);
      });
    });

    $("#save_sub").on("click", function(e) {
      e.preventDefault();
      var cate = document.getElementById("cate").value;
      var subCat = document.getElementById("subCat").value;
      $.post( "/category/addSubCategory", { cate: cate, subCat: subCat }, function(data) {
          location.reload(true);
        }
      );
    });

    $("#save_brand").on("click", function(e) {
      e.preventDefault();
      var brand = document.getElementById("brand").value;
      $.post("/category/addBrand", { brand: brand }, function(data) {
        location.reload(true);
      });
    });
  });

  // setting brand dropdown values on the besis of selected subcategory
  // $("#subCategg").change(function() {
  //   if (document.getElementById("subCategg").value != null) {
  //     var subcat_id = document.getElementById("subCategg").value.split(",");
  //     $.get("/category/getBrands/" + subcat_id[0], {}, function(data) {
  //       configureDropDownL2(document.getElementById("brandg"), data);
  //     });
  //   }
  // });
  
  // // setting brand dropdown values on the besis of selected subcategory
  // $("#subNn").change(function() {
  //   if (document.getElementById("subNn").value != null) {
  //     var subcat_id = document.getElementById("subNn").value;
  //     $.get("/category/getBrands/" + subcat_id, {}, function(data) {
  //       configureDropDownL2(document.getElementById("brandNs"), data);
  //     });
  //   }
  // });

  // // creating subcategory and brand on the basis of selected category
  // $("#categg").change(function() {
  //   if (document.getElementById("categg").value != null) {
  //     var cat_id = document.getElementById("categg").value.split(",");
  //     $.get("/category/getSub/" + cat_id[0], {}, function(data) {
  //       configureDropDownL(document.getElementById("subCategg"), data);
  //       // configureDropDownL2(document.getElementById("brandg"), data);
  //     });
  //   }
  // });

  // creating subcategory and brand on the basis of selected category
  $("#supplier").change(function() {
    if (document.getElementById("supplier").value != "0") {
      var cat_id = document.getElementById("supplier").value;
      $.get("/Purchase/getContactPerson/" + cat_id, {}, function(data) {
        
        configureDropDownL3(document.getElementById("contt"), data);
      });
    }
  });
  // creates dropdown
  function configureDropDownL3(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data.contactPerson.length; i++) {
      options +=
        "<option onClick='getAllSerials()'value=\"" +
        data.contactPerson[i].contactName +","+ data.contactPerson[i].mobile+
        '">' +
        data.contactPerson[i].contactName
        "</>";
    }
    ddl2.innerHTML = options;
  }


  // creating subcategory and brand on the basis of selected category
  $("#cattN").change(function() {
    if (document.getElementById("cattN").value != null) {
      var cat_id = document.getElementById("cattN").value;
      $.get("/category/getSub2/" + cat_id, {}, function(data) {
        configureDropDownL(document.getElementById("subNns"), data);
        // $.get("/category/getBrands2/" + cat_id, {}, function(data2) {
        //   configureDropDownL2(document.getElementById("brandNs"), data2);
        // });
      });
    }
  });

  // creates dropdown
  function configureDropDownL(ddl2, data) {
    var options="";
    for (i = 0; i < data[0].subCategories.length; i++) {
      options += "<option value=\"" + data[0].subCategories[i].name + '">' ;
    }
    ddl2.innerHTML = options;
  }

  // creates dropdown
  function configureDropDownL2(ddl2, data) {
    var options="";
    for (i = 0; i < data[0].brands.length; i++) {
      options += "<option value=\"" +
        data[0].brands[i].name +
        '">' ;
    }
    ddl2.innerHTML = options;
  }
});
