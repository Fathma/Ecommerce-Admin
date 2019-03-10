$(document).ready(function() {

  // save new category
  $(function() {
    $("#myForm1").on("click", function(e) {
      e.preventDefault();
      var cat = document.getElementById("cat").value;
      $.post("/category/addCategory", { cat: cat }, function(data) {
        // window.location = "/category/entry";
        location.reload(true);
      });
    });

    $("#save_sub").on("click", function(e) {
      e.preventDefault();
      var cate = document.getElementById("cate").value;
      var subCat = document.getElementById("subCat").value;
      $.post( "/category/addSubCategory", { cate: cate, subCat: subCat }, function(data) {
          window.location = "/category/entry";
        }
      );
    });

    $("#save_brand").on("click", function(e) {
      e.preventDefault();
      var brand = document.getElementById("brand").value;
      $.post("/category/addBrand", { brand: brand }, function(data) {
        window.location = "/category/entry";
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

  // creating subcategory and brand on the basis of selected category
  $("#categg").change(function() {
    if (document.getElementById("categg").value != null) {
      var cat_id = document.getElementById("categg").value.split(",");
      $.get("/category/getSub/" + cat_id[0], {}, function(data) {
        configureDropDownL(document.getElementById("subCategg"), data);
        // configureDropDownL2(document.getElementById("brandg"), data);
      });
    }
  });

  // creates dropdown
  function configureDropDownL(ddl2, data) {
    var options;
    options += '<option value="null">Select One</>';
    for (i = 0; i < data[0].subCategories.length; i++) {
      options += "<option onClick='getAllSerials()'value=\"" +
        data[0].subCategories[i]._id +
        "," +
        data[0].subCategories[i].name +
        '">' +
        data[0].subCategories[i].name;
      ("</>");
    }
    ddl2.innerHTML = options;
  }

  // creates dropdown
  function configureDropDownL2(ddl2, data) {
    var options;
    options += '<option value="null">Select One</>';
    for (i = 0; i < data[0].brands.length; i++) {
      options += "<option onClick='getAllSerials()'value=\"" +
        data[0].brands[i]._id +
        "," +
        data[0].brands[i].name +
        '">' +
        data[0].brands[i].name;
      ("</>");
    }
    ddl2.innerHTML = options;
  }

});
