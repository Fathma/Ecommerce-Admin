// $(function(){
// alert("hey");
//  $.ajax({
//                 method: 'get',
//                 url: '/products/Edit/5c2c6215ec41c81bbcc06cf1/5c357854918bbf1a64bd3b7c',
//                 dataType: 'json',
//                 success: function(json){
//                     // var data = json.hits.hits.map(function(hit){
//                     //     return hit;
//                     // });
//                 }
//             })})
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
    }
}

$( document ).ready(function() {
    document.getElementById("new_feat").value=0;
});

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

// $(function(){
    
//     $("#c").click(function(){
//         // var a=document.getElementById(a).value;
//         alert("dfgsdfg")
//         $.ajax({
//             method: 'get',
//             url: '/products/delete/5c3583de8e8fb41e70d6d073',
//             data: {},
//             dataType: 'json',
//             success: function(json){
//                 // var data = json.hits.hits.map(function(hit){
//                 //     return hit;
//                 // });
//                 console.log(json);
 
//                 // $('#searchResults').empty();
//                 // for( var i=0; i < data.length; i++){
//                 //     var html = "";
//                 //     html += '<div class="col-md-4">';
//                 //     html += '<a href="/product/' + data[i]._source._id + '">';
//                 //     html += '<div class="thumbnail">';
//                 //     html += '<img src="' + data[i]._source.image + '">';
//                 //     html += '<div class="caption">';
//                 //     html += '<h3>' + data[i]._source.name + '</h3>';
//                 //     // html += '<p>' + data[i]._source.category.name + '</p>';
//                 //     html += '<p>$' + data[i]._source.price  + '.00</p>';
//                 //     html += '</div>';
//                 //     html += '</div>';
//                 //     html += '</a>';
//                 //     html += '</div>';
 
//                 //     $('#searchResults').append(html);
//                 // }
//             },
//             error: function(err){
 
//                 $('#searchResults').empty();
 
//                 var html = "'<p>Noting Found</p>'";
 
//                 $('#searchResults').append(html);
 
//                 console.log(err);
//             }
//         });
//     });
//  });