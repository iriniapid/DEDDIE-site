$(document).ready(function () {

  var my_ip="http://197b574e.ngrok.io/";

  Array.prototype.getDuplicates = function () {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
        if(duplicates.hasOwnProperty(this[i])) {
            duplicates[this[i]].push(i);
        } else if (this.lastIndexOf(this[i]) !== i) {
            duplicates[this[i]] = [i];
        }
    }

    return duplicates;
};
  
  function assign(obj, keyPath, value) {
   lastKeyIndex = keyPath.length-1;
   for (var i = 0; i < lastKeyIndex; ++ i) {
     key = keyPath[i];
     if (!(key in obj))
       obj[key] = {}
     obj = obj[key];
   }
   obj[keyPath[lastKeyIndex]] = value;
}
  
  var hot;
  var date= { "month": 2, "year": 2017 };
  
  $("#date").text(date["month"] + "/" + date["year"] );

  var CurrentMonth = date["month"];

  var Months_names = {1:"Ιανουάριος",2:"Φεβρουάριος",3:"Μάρτιος",4:"Απρίλιος",5:"Μάιος",6:"Ιούνιος",
          7:"Ιούλιος",8:"Αύγουστος",9:"Σεπτέμβριος",10:"Οκτώβριος",11:"Νοέμβριος",12:"Δεκέμβριος"} ;
  
  if (CurrentMonth == 2){
    $("#anafora").text("B");   
  }
  else if (CurrentMonth == 8) {
    $("#anafora").text("A");  
  }
    
  var anafora=$("#anafora").text();

  var antistoixiaA = {"month-1":10,"month-2":11,"month-3":12,"month-4":1,"month-5":2,"month-6":3 };

  var antistoixiaB = {"month-1":4,"month-2":5,"month-3":6,"month-4":7,"month-5":8,"month-6":9 };
  
  var antistoixia = { 10:"month-1",11:"month-2",12:"month-3",1:"month-4",2:"month-5",3:"month-6" }; 

  var active_month;

  active_month= "month-1";

  if (anafora=="A") {
    $("#month").text(Months_names[antistoixiaA[active_month]]);
  }
  else {
    $("#month").text(Months_names[antistoixiaB[active_month]]);    
  }

  $("#"+active_month).addClass('clicked');
  


  $("button.my_btn").on("click",function(){
    $("button.my_btn").removeClass('clicked');
    $(this).toggleClass('clicked');
    active_month = $(this).attr("id");
    if (anafora=="A") {
      $("#month").text(Months_names[antistoixiaA[active_month]]);
    }
    else {
      $("#month").text(Months_names[antistoixiaB[active_month]]);    
    }       
  });

  var SameHl_rows;

  var tableConstractor= function(data,div){

    var container = document.getElementById(div);
    var tmpData;

    function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.fontWeight = 'bold';
      td.style.color = 'black';
      td.style.background = 'rgba(216, 125, 45,0.7)';
    }

    function negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);

      // if row contains negative number
      if (parseInt(value) < 0) {
        // add class "negative"
        td.style.color = 'red';
      
      }
    }
      
    hot = new Handsontable(container, {
      rowHeaders: false,
      colHeaders: false,
      contextMenu: false,
      stretchH:"all",
      afterSelection: function (row, col, row2, col2) {
        var meta = this.getCellMeta(row2, col2);
        if (meta.readOnly) {
          this.updateSettings({fillHandle: false});
        }
        else {
          this.updateSettings({fillHandle: true});
        }
      },
      cells: function (row, col, prop) {
        var cellProperties = {};
       if (row === 0 || col === 23 || col === 24 ) {
          cellProperties.readOnly = true; // make cell read-only if it is first row or colums 16-17 
        }
        if (row === 0) {
          cellProperties.renderer = firstRowRenderer; // uses function directly
        }
        else {
          cellProperties.renderer = negativeValueRenderer; // uses lookup map
        }

        return cellProperties;
      },

      afterChange: function (change) { //update values of that change per HL not per HL,EF
        var cellchanges= {};
        if (change != null) {
          if (change[0][1]==9 || change[0][1]==10 || change[0][1]==11 || change[0][1]==12 || change[0][1]==13 || change[0][1]==14 || change[0][1]==15 || change[0][1]==16 || change[0][1]==18 || change[0][1]==19 || change[0][1]==20 ){
            for (var i = 0; i < Object.values(SameHl_rows).length; i++) {
              if (Object.values(SameHl_rows)[i].indexOf(change[0][0])>=0) {
                for (var j = 0; j < Object.values(SameHl_rows)[i].length; j++) {
                  assign(cellchanges, [Object.values(SameHl_rows)[i][j],change[0][1]],change[0][3]);
                  for (var k = 0; k < Object.keys(cellchanges).length; k++) {
                    if (change[0][1] != Object.keys(cellchanges)[k]) {
                      hot.setDataAtCell(Object.keys(cellchanges)[k],change[0][1],cellchanges[Object.keys(cellchanges)[k]][change[0][1]]);
                    }
                  }
                }              
              }
            }
          }
       }
      }      
    });

    hot.loadData(data);

    //find all the HL that appear in several EF
    Handsontable.hooks.add('afterRender', function() {
    var d = this;
    var col1 = d.getDataAtCol(1);
    SameHl_rows=col1.getDuplicates();
    }); 
  }

//add titles to data
    var titles=  [ "ΕΦ" , "ΗΣ","Ενέργεια", "ΕΤΜΕΑΡ", "ΧΧΣ", "ΧΧΔ", "ΥΚΩ πελάτη", "ΜΤΑ_Θερμ" ,"ΜΤΑ_απε", "ΜΠΚΠ", "ΜΜΚ", "Q_ΣΜ", "Q_ΑΠΕ", "Q_ΦΒΣ"];
    var rawdata={ "data": { "month-1" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
    "month-2" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
    "month-3" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
    "month-4" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
    "month-5" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
    "month-6" :[
    ["Α", 101,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
    ["B", 103,3359883.3333 , 0.07, 3557.06,6091.3021,666.811,59806.67,19.8486],
      ],
     }
    };
    var mydata = rawdata.data;
    for (var i = 0; i < Object.values(mydata).length; i++) {
      Object.values(mydata)[i].unshift(titles);
    }

    var all_HL= ["All"];
    var hl_extr = [];
    for (var i = 1; i < mydata["month-1"].length; i++) {
      hl_extr.push(mydata["month-1"][i][1]);
    };
    var hl_extr_uniq = [];
    $.each(hl_extr, function(i, el){
    if($.inArray(el, hl_extr_uniq) === -1) hl_extr_uniq.push(el);
    });
    var HL_S =all_HL.concat(hl_extr_uniq);
     

    // create HL option list 
    var select_HL_lst = [];
    for (var i = 0; i < HL_S.length; i++) {
      select_HL_lst.push("<option value=" +HL_S[i] + ">" + HL_S[i] + "</option>");
      $("#HL").html(select_HL_lst);
    }

    console.log(mydata);

    var MonthResults=mydata;
    var Hl_data= {};

    // filter data per HL,EF
    for (var i = 0; i < HL_S.length; i++) {
      for (var j = 0; j < Object.keys(mydata).length; j++) {
          for (var k = 1; k < Object.values(mydata)[j].length; k++) {
           if(HL_S[i]==Object.values(mydata)[j][k][1]){
             assign(Hl_data, [HL_S[i]+","+Object.values(mydata)[j][k][0],Object.keys(mydata)[j]],Object.values(mydata)[j][k]);
           }
          }
      }
    }

    var months_keys=["month-1","month-2","month-3","month-4","month-5","month-6" ];


    //create the table initially

      tableConstractor(mydata[active_month],"example1");
    
      //add data to return object if the table is changed 
      $('#example1 tr td').on("DOMSubtreeModified", function(){
          var clicked_month = $("button.my_btn.clicked").attr("id");
          MonthResults[clicked_month]=hot.getData();
      });
      
      //create the table at month click
      $("button.my_btn").on("click",function(){
        $("#example1").empty();
        var id= $(this).attr("id");
        tableConstractor(mydata[id],"example1");

      //add data to return object if the table is changed
        $('#example1 tr td').on("DOMSubtreeModified", function(){
          var clicked_month = $("button.my_btn.clicked").attr("id");
          MonthResults[clicked_month]=hot.getData();
        });
        return false;
      });


    $("#display_HL").on("click",function(){
      if($("#HL").val() == "All"){
        $("button.my_btn").removeClass('clicked');
        $("#month-1").addClass('clicked');
        $("#example1").empty();

        //create the table initially
        tableConstractor(mydata["month-1"],"example1");
      
        //add data to return object if the table is changed 
        $('#example1 tr td').on("DOMSubtreeModified", function(){
            var clicked_month = $("button.my_btn.clicked").attr("id");
            MonthResults[clicked_month]=hot.getData();
        });
        
        //create the table at month click
        $("button.my_btn").on("click",function(){
          $("#example1").empty();
          var id= $(this).attr("id");
          tableConstractor(mydata[id],"example1");

        //add data to return object if the table is changed
          $('#example1 tr td').on("DOMSubtreeModified", function(){
            var clicked_month = $("button.my_btn.clicked").attr("id");
            MonthResults[clicked_month]=hot.getData();
          });
          return false;
        }); 
    }
    
    else {
      
      var my_HL_data_obj={};
      for (var j = 0; j < months_keys.length; j++) {
        var temp_lst=[];
        temp_lst.push(titles);
        for (var i = 0; i < Object.keys(Hl_data).length; i++) {
          if($("#HL").val() == Object.keys(Hl_data)[i].split(",")[0]){
            //console.log(Hl_data[Object.keys(Hl_data)[i]]);          
            temp_lst.push(Hl_data[Object.keys(Hl_data)[i]][months_keys[j]]);
            my_HL_data_obj[months_keys[j]]=temp_lst;          
          }
        } 
      }
      if (my_HL_data_obj!=={}) {
        $("button.my_btn").removeClass('clicked');
        $("#month-1").addClass('clicked');
        $("#example1").empty();

        //create the table initially
        tableConstractor(my_HL_data_obj["month-1"],"example1");
      
        //add data to return object if the table is changed 
        $('#example1 tr td').on("DOMSubtreeModified", function(){
            var clicked_month = $("button.my_btn.clicked").attr("id");
            for (var i = 0; i < MonthResults[clicked_month].length; i++) {
              if(MonthResults[clicked_month][i][1]==$("#HL").val()){
                MonthResults[clicked_month][i]=hot.getData().pop();
              }
            }
        });
        
        //create the table at month click
        $("button.my_btn").on("click",function(){
          $("#example1").empty();
          var id= $(this).attr("id");
          tableConstractor(my_HL_data_obj[id],"example1");

        //add data to return object if the table is changed
          $('#example1 tr td').on("DOMSubtreeModified", function(){
            var clicked_month = $("button.my_btn.clicked").attr("id");
            for (var i = 0; i < MonthResults[clicked_month].length; i++) {
              if(MonthResults[clicked_month][i][1]==$("#HL").val()){
                MonthResults[clicked_month][i]=hot.getData().pop();
              }
            }
            
          });
          return false;
        }); 
      }

    }
    return false;
    });    
            
    $("#Ypol_eg").on("click",function(){

      for (var i = 0; i < Object.keys(MonthResults).length; i++) {
        MonthResults[Object.keys(MonthResults)[i]].shift();
      }
      var temp={};
      temp["data"] = MonthResults;
      var postdata= JSON.stringify(temp);
      console.log(postdata);

      $.get( my_ip+"/mavenproject2/webresources/generic/sendepilogi2", {data:postdata}).done(function(data){
        console.log(data);
        var re_data=JSON.stringify(data);
        localStorage.setItem("ResultsEpl_1",re_data);
        //window.location="YpolEg_1.html";
      }); 

      return false;
    });

    
});
