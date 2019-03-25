$(document).ready(function() {
  $(function() {
    $("#supplierReg").on("click", function(e) {
      // getting all addresses in an array
      var address_array = [];
      var total_address = parseInt(document.getElementById("num_address").value);
      for(var i=0; i < total_address; i++){
        var add=document.getElementById("address"+i).value;
        var contact=document.getElementById("contact"+i).value;
        var zip=document.getElementById("zip"+i).value;
        var addresss = {
          address:add,
          contact: contact,
          zip: zip
        }
        if(add === '' && contact === "" && zip === ""){}
        else{
          address_array.push(addresss)
        }
      }

      // getting all addresses in an array
      var contacts_array = [];
      var total_contacts = parseInt(document.getElementById("total_contacts").value);

      for(var i=0; i < total_contacts; i++){
        var contactName = document.getElementById("contactName"+i).value;
        var companyPosition = document.getElementById("companyPosition"+i).value;
        var email = document.getElementById("email"+i).value;
        var mobile = document.getElementById("mobile"+i).value;
        var telephone = document.getElementById("telephone"+i).value;
        var extention = document.getElementById("extention"+i).value;

        var obj = {
          contactName: contactName,
          companyPosition: companyPosition,
          email: email,
          mobile: mobile,
          telephone: telephone,
          extention: extention
        }
        contacts_array.push(obj)
      }

      var obj = {
        cname: document.getElementById('cname').value,
        cemail: document.getElementById('cemail').value,
        country: document.getElementById('country').value,
        address: address_array,
        industry: document.getElementById('industry').value,
        registration_no: document.getElementById('registration_no').value,
        productType: document.getElementById('productType').value,
        contactPerson: contacts_array,
        additionalInfo: document.getElementById('additionalInfo').value,
      }

      $.post( "/purchase/SupplierSave", { obj: obj }, function(data) {
          location.reload(true);
        }
      );
    });
  });

  $(function() {
    $("#edit_supplier").on("click", function(e) {
      // getting all addresses in an array
      var address_array = [];
      var total_address = parseInt(document.getElementById("num_address1").value);

      for(var i=0; i < total_address; i++){
        var add=document.getElementById("address"+i).value;
        var contact=document.getElementById("contact"+i).value;
        var zip=document.getElementById("zip"+i).value;
        var addresss = {
          address:add,
          contact: contact,
          zip: zip
        }
        if(add === '' && contact === "" && zip === ""){}
        else{
          address_array.push(addresss)
        }
      }

      // getting all addresses in an array
      var contacts_array = [];
      var total_contacts = parseInt(document.getElementById("total_contacts1").value);

      for(var i=0; i < total_contacts; i++){
        var contactName = document.getElementById("contactName"+i).value;
        var companyPosition = document.getElementById("companyPosition"+i).value;
        var email = document.getElementById("email"+i).value;
        var mobile = document.getElementById("mobile"+i).value;
        var telephone = document.getElementById("telephone"+i).value;
        var extention = document.getElementById("extention"+i).value;
        
        if(contactName === "" && companyPosition === "" && email === "" && mobile === "" && telephone === "" && extention === ""){

        }else{
          var obj = {
            contactName: contactName,
            companyPosition: companyPosition,
            email: email,
            mobile: mobile,
            telephone: telephone,
            extention: extention
          }
          contacts_array.push(obj)
        }
      }

      var obj = {
        cname: document.getElementById('cname').value,
        cemail: document.getElementById('cemail').value,
        country: document.getElementById('country').value,
        address: address_array,
        industry: document.getElementById('industry').value,
        registration_no: document.getElementById('registration_no').value,
        productType: document.getElementById('productType').value,
        contactPerson: contacts_array,
        additionalInfo: document.getElementById('additionalInfo').value
      }
     
      var id = document.getElementById('id').value
      $.post( "/purchase/Edit/"+id, { obj: obj }, function(data) {
          location.reload(true);
        }
      );
    });
  });
});

document.getElementById("num_address").value = 1;
document.getElementById("num_contacts").value = 1;

function addAddressEdit(){ 
  var nums = parseInt(document.getElementById("num_address1").value) + 1;
  var hr = document.createElement("hr")
  var br = document.createElement("br")
  
  var label1 = create_label("Company Address:")
  var input1 = create_textArea("address",nums, "text")
  var label2 = create_label("Phone Number:")
  var input2 = create_input("contact",nums , "text")
  
  var out = make_Section( input1, label1, input2, label2, nums);
  document.getElementById("addresses").appendChild(hr)
  document.getElementById("addresses").appendChild(out)

  out = create_div("row", "out", nums)
  outc1 = create_div("col-md-6","outc1", nums)
  outc1r1 = create_div("row", "outc1r1", nums)
  outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  outc2 = create_div("col-md-6","outc2", nums)
  outc2r1 = create_div("row", "outc2r1", nums)
  outc2r1c1 = create_div("col-md-5","outc2r1c1", nums)
  outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  label = create_label("Zip:")
  input = create_input("zip",nums, "text")
  outc1r1c1.appendChild(label)
  outc1r1c2.appendChild(input)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  document.getElementById("addresses").appendChild(br)
  document.getElementById("addresses").appendChild(out)
  
  document.getElementById("num_address1").value = parseInt(document.getElementById("num_address1").value) + 1
}

function addAddress(){
  var nums = parseInt(document.getElementById("num_address").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")

  // First row
  var label1 = create_label("Company Address:")
  var input1 = create_textArea("address",nums, "text")
  var label2 = create_label("Phone Number:")
  var input2 = create_input("contact",nums , "text")
  var out = make_Section( input1, label1, input2, label2, nums)
  document.getElementById("addresses").appendChild(hr)
  document.getElementById("addresses").appendChild(out)

  out = create_div("row", "out", nums)
  outc1 = create_div("col-md-6","outc1", nums)
  outc1r1 = create_div("row", "outc1r1", nums)
  outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  outc2 = create_div("col-md-6","outc2", nums)
  outc2r1 = create_div("row", "outc2r1", nums)
  outc2r1c1 = create_div("col-md-5 col5","outc2r1c1", nums)
  outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  label = create_label("Zip:")
  input = create_input("zip",nums, "text")
  outc1r1c1.appendChild(label)
  outc1r1c2.appendChild(input)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  document.getElementById("addresses").appendChild(br)
  document.getElementById("addresses").appendChild(out)
  document.getElementById("num_address").value = parseInt(document.getElementById("num_address").value) + 1
  
}

function addContacts1(){
  var nums = parseInt(document.getElementById("total_contacts").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")
  // first row 
  var label1 = create_label("Contact Name:")
  var input1 = create_input("contactName",nums, "text")
  var label2 = create_label("Company Designation:")
  var input2 = create_input("companyPosition",nums , "text")
 
  var out = make_Section( input1, label1, input2, label2, nums)
  document.getElementById("contacts").appendChild(hr)
  document.getElementById("contacts").appendChild(out)
 
  // second row
  label1 = create_label("Email:")
  input1 = create_input("email",nums , "email")
  label2 = create_label("Mobile:")
  input2 = create_input("mobile",nums , "tel")

  out = make_Section( input1, label1, input2, label2, nums);
  document.getElementById("contacts").appendChild(br)
  document.getElementById("contacts").appendChild(out)

  // 3rd row
  label1 = create_label("Telephone:")
  input1 = create_input("telephone",nums , "tel")
  input2 = create_input("extention",nums , "text")
  
  out = make_tel_ext(input1, label1, input2, nums)
  document.getElementById("contacts").appendChild(br)
  document.getElementById("contacts").appendChild(out)
  
  document.getElementById("total_contacts").value = parseInt(document.getElementById("total_contacts").value) + 1
  document.getElementById("contacts").appendChild(br)
}

function addContacts1Edit(){
  var nums = parseInt(document.getElementById("total_contacts1").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")
  
  // first row
  var label1 = create_label("Contact Name:")
  var input1 = create_input("contactName",nums, "text")
  var label2 = create_label("Company Position:")
  var input2 = create_input("companyPosition",nums , "text")

  var out = make_Section(input1, label1, input2, label2, nums);
  
  document.getElementById("contacts").appendChild(hr)
  document.getElementById("contacts").appendChild(out)
  document.getElementById("contacts").appendChild(br)

  // second row
  label1 = create_label("Email:")
  input1 = create_input("email",nums , "email")
  label2 = create_label("Mobile:")
  input2 = create_input("mobile",nums , "tel")

  out = make_Section(input1, label1, input2, label2, nums);
  document.getElementById("contacts").appendChild(out)
 
  // 3rd row
  label1 = create_label("Telephone:")
  input1 = create_input("telephone",nums , "tel")
  input2 = create_input("extention",nums , "text")
 
  out = make_tel_ext(input1, label1, input2, nums)
  document.getElementById("contacts").appendChild(br)
  document.getElementById("contacts").appendChild(out)
  
  document.getElementById("total_contacts1").value = parseInt(document.getElementById("total_contacts1").value) + 1
  document.getElementById("contacts").appendChild(br)
}

function make_tel_ext(input1, label1, input2, nums){
  var out = create_div("row", "out", nums)
  var outc1 = create_div("col-md-6","outc1", nums)
  var outc1r1 = create_div("row", "outc1r1", nums)

  var outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  var outc1r1c2 = create_div("col-md-6 md1","outc1r1c2", nums)

  var outc1r1c2c1 = create_div("col-md-3 md2","outc1r1c2c1", nums)
  var outc1r1c2c2 = create_div("col-md-1 ","outc1r1c2c2", nums)
  var outc1r1c2c3 = create_div("col-md-2 md3","outc1r1c2c3", nums)
  
  outc1r1c2.appendChild(outc1r1c2c1)
  outc1r1c2.appendChild(outc1r1c2c2)
  outc1r1c2.appendChild(outc1r1c2c3)

  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  outc1r1c2c1.appendChild(input1)
  outc1r1c1.appendChild(label1)
  var p = document.createElement('p');
  p.innerHTML = "Ext:";
  outc1r1c2c2.appendChild(p)
  outc1r1c2c3.appendChild(input2)
 
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  return out;
}

function make_Section(input1, label1, input2, label2, nums){
  var p1 = document.createElement('p')
  var out = create_div("row", "out", nums)

  var outc1 = create_div("col-md-6","outc1", nums)
  var outc1r1 = create_div("row", "outc1r1", nums)
  var outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  var outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  var outc2 = create_div("col-md-6","outc2", nums)
  var outc2r1 = create_div("row", "outc2r1", nums)
  var outc2r1c1 = create_div("col-md-5 col5","outc2r1c1", nums)
  var outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)

  outc1r1c1.appendChild(label1)
  outc1r1c2.appendChild(input1)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)

  out.appendChild(outc2)
  outc2.appendChild(outc2r1)

  outc2r1c1.appendChild(label2)
  outc2r1c2.appendChild(input2)
  outc2r1.appendChild(outc2r1c1)
  outc2r1c1.appendChild(p1)
  outc2r1.appendChild(outc2r1c2)
  return out;
} 

function create_input(prefix,nums, typee){
  var input = document.createElement("input");
  input.id = prefix + (nums-1);
  input.name = prefix + (nums-1);
  input.type = typee;
  input.className = "form-control inp";
  return input;
}

function create_textArea(prefix,nums, typee){
  var textarea = document.createElement("textarea");
  textarea.id = prefix + (nums-1);
  textarea.name = prefix + (nums-1);
  textarea.type = typee;
  textarea.className = "form-control inp";
  return textarea;
}

function create_label(txt){
  var label = document.createElement("label");
  label.innerHTML = txt;
  label.className = "lbl";
  return label;
}

function create_div(classname,prefix, nums){
  var div = document.createElement("div");
  div.id = prefix + (nums-1);
  div.name = prefix + (nums-1);
  div.className = classname;
  return div;
}


