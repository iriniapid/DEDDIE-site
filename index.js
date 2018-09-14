$(document).ready(function () {

	var my_ip="http://4f42425e.ngrok.io/"; 
	$(".buttons a").on("click",function(){
		var epilogi = $(this).attr("id");
		
		$.ajax({
     		url:my_ip+"mavenproject2/webresources/generic/"+epilogi,
     		dataType: 'json',
        headers:{ 'Access-Control-Allow-Orgin':'*'
               },
     		success:function(data){
               if (data !== false) {
                    re_data=JSON.stringify(data);
                    localStorage.setItem("InputData",re_data);
                    window.location=epilogi+".html";    
                }
     		},
     		error:function(){
        	 	alert("Error");
     		}
		});
	});

});
