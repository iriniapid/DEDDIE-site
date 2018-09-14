
$(document).ready(function () {

  var my_ip="http://ba3e0fd8.ngrok.io";
     
  var container = document.getElementById('example1');
  var autosaveNotification;
  var hot;

  var tableConstractor= function(data,div){

    var container = document.getElementById(div);
    var tmpData;

    function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.fontWeight = 'bold';
      td.style.color = 'black';
      td.style.background = '#CEC';
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
        /*if (change != null) {
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
       }*/
      }      
    });

    hot.loadData(data);
  }

//add titles to data
    var titles= ["ef","producer","flag_energos_ef","flag_energos_producer","afm_producer","ef_address","ef_tk","area","tel1","tel2","tel3","ef_email","ef_email2","ef_email3","person","date_contract","date_reg" ]
    var mydata = JSON.parse(localStorage.getItem("InputData"));
    mydata["data"].unshift(titles);

    console.log(mydata);

    var MonthResults=mydata;

    //create the table initially

      tableConstractor(mydata["data"],"example1");
    
      //add data to return object if the table is changed 
      $('#example1 tr td').on("DOMSubtreeModified", function(){
          MonthResults["data"]=hot.getData();
      });
         
            
    $("#save_changes").on("click",function(){

      MonthResults["data"].shift();

      var postdata= JSON.stringify(MonthResults);
      console.log(postdata);
      $.get( my_ip+"/mavenproject2/webresources/generic/sendepilogi5", {data:postdata}).done(function(data){

        if(data="ok"){
          alert(data);
          //window.location="index.html"; 
        }
        else {
          alert(data);
        }
        
      });
     
   
      return false;
    });

    
});