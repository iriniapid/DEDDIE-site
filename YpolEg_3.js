$(document).ready(function () {
     
  var container = document.getElementById('example1');
  var autosaveNotification;
  var hot;
  var CurrentMonth = new Date().getMonth()+1;
  var Months = {1:"Ιανουάριος",2:"Φεβρουάριος",3:"Μάρτιος",4:"Απρίλιος",5:"Μάιος",6:"Ιούνιος",
          7:"Ιούλιος",8:"Αύγουστος",9:"Σεπτέμβριος",10:"Οκτώβριος",11:"Νοέμβριος",12:"Δεκέμβριος"} ;
  
  if (CurrentMonth >= 4 && CurrentMonth <= 9 ){
    $("#anafora").text("B");   
  }
  else {
    $("#anafora").text("A");  
  }
  
  $("#month").text(Months[CurrentMonth]);

  $("#year").text(new Date().getFullYear());
  
  var anafora=$("#anafora").text();
  
  if (anafora == "A") {
    var antistoixia = { 10:"month-1",11:"month-2",12:"month-3",1:"month-4",2:"month-5",3:"month-6" };
    var active_month = antistoixia[CurrentMonth];
    $("#"+active_month).addClass('clicked');
  }

  $("button.btn.btn-primary").on("click",function(){
      $("button.btn.btn-primary").removeClass('clicked');
      $(this).toggleClass('clicked');   
  });
   
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
      if (row === 0 || this.instance.getData()[row][col] === 'readOnly') {
        cellProperties.readOnly = true; // make cell read-only if it is first row or the text reads 'readOnly'
      }
      if (row === 0) {
        cellProperties.renderer = firstRowRenderer; // uses function directly
      }
      else {
        cellProperties.renderer = negativeValueRenderer; // uses lookup map
      }

      return cellProperties;
    }

  });
  
//test(hot);
    var mydata={"data": [
    [ "ΕΦ", "ΗΣ" ,"ΚΕ","TΚΕ","ΧΕΦ1" ,"XEΦ2","Αντ. ΥΚΩ_m1", "Αντ. ΥΚΩ_m2" ,
"ΧΕΦ_m2",  "Αντάλλαγμα ΥΚΩ_m1" , "Αντάλλαγμα ΥΚΩ_m2" , "YE" , "TYE" ,"ΠΕΦ_m1",
"ΠΕΦ_m2" ],
    ["Α", 101,135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486,44,444],
    //    ["B", 200, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //    ["C", 300, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["D", 200, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["E", 202, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["F", 203,  135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["G", 204, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["H", 205,  135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["I", 206,  135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["J", 208, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["AI", 206,135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["IA", 206, 135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["IB", 206,135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["IV", 206,135.237 , 857.041, 102.341,6091,39.153,1.237,5,25,19.8486],
    //        ["ID", 206, 11, -14, 13,23,44,5],
    //        ["II", 206, 11, -14, 13,23,44,5],
    //        ["UI", 206, 11, -14, 13,23,44,5],
    //        ["IU", 206, 11, -14, 13,23,44,5],
    //        ["XI", 206, 11, -14, 13,23,44,5],
    //        ["IX", 206, 11, -14, 13,23,44,5],
    //        ["XX", 206, 11, -14, 13,23,44,5],
    //        ["R", 206, 11, -14, 13,23,44,5]
  ]}

    hot.loadData(mydata.data);
});
