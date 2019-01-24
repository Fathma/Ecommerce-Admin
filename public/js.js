
function setvisible(){
    var nums=parseInt(document.getElementById("new_feat").value)+1
    document.getElementById("new_feat").value= nums;

    if(document.getElementById("new_feat_label").value === ""){

    }else{
        var div= document.createElement("div");

        var label = document.createElement("label");
        label.htmlFor="v"+nums;
        label.innerText=document.getElementById("new_feat_label").value;
      
        var input1= document.createElement("input");
        input1.type="hidden";
        input1.className="form-control";
        input1.name="new_feat_"+nums;
        input1.value = document.getElementById("new_feat_label").value  ;

        var input = document.createElement("input");
        input.id="v"+nums;
        input.name= "v"+nums;
        input.type="text";
        input.className="form-control";

        div.appendChild(input1);
        div.appendChild(label);
        div.appendChild(input);

        document.getElementById("add").appendChild(div);
        document.getElementById("new_feat_label").value = "";
    }
}

// $( document ).ready(function() {
//     document.getElementById("new_feat").value=0;
// });

function calculate_discount_price(){
    var dis=document.getElementById('discount123').value;
    var price=document.getElementById('selling_price').value;
    document.getElementById('price_discount').value =price-(dis/100)*price;
}
function calculate_discount_percentage(){
    var dis=document.getElementById('price_discount').value;
    var price=document.getElementById('selling_price').value;
    document.getElementById('discount123').value =((price-dis)/price)*100;
}
function addnew(){
    var feat=document.getElementById('feat').value;
    
    if(document.getElementById('feats').value === ""){
        document.getElementById('feat').value =""
        document.getElementById('feats').value =feat;
    }else{
        document.getElementById('feat').value=""
        document.getElementById('feats').value = document.getElementById('feats').value +","+feat;
    }
   
}

$(document).ready(
                
    function() {
        
       
        $( "#categg" ).change(function() {
            var cat_id = (document.getElementById('categg').value).split(",");
            $.get("/category/getSub/"+cat_id[0], {
                cat_id: cat_id
            }, function(data) {
                configureDropDownL(document.getElementById('subCategg'),data);
            });
            });
        
        function configureDropDownL(ddl2,data) {
            var options;
            options += '<option value="0">Select One</>';
            for (i = 0; i < data[0].subCategories.length; i++) {
                options += '<option value="'+data[0].subCategories[i]._id+'">' + data[0].subCategories[i].name
                        + '</>';
            }
            document.getElementById('subCategg').innerHTML = options;

        }

    });
    function ArrNoDupe(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    }
    
    function checkValidityy(){
        var arr = (document.getElementById("serial").value).split(",");
        var arr2 = ArrNoDupe(arr);
        document.getElementById("serial").value=arr2;
        document.getElementById("quantity").value=arr2.length;
    }

function set_disable(id){
    var all=[];
    if(document.getElementById("serial").value != ""){
        
        var val=document.getElementById("serial").value+","+parseInt(document.getElementById(id).innerHTML);
        
        var values =ArrNoDupe(val.split(","));
     
        document.getElementById("serial").value =values
        document.getElementById("quantity").value =values.length
        document.getElementById(id).style.color= '#041126';
    }else{
        all.push(parseInt(document.getElementById(id).innerHTML));
        document.getElementById("serial").value =all[0];
        document.getElementById("quantity").value ='1';
        document.getElementById(id).style.color= '#041126';
    }
    
}

