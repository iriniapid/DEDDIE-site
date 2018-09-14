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
var mydata=JSON.parse(localStorage.getItem("ResultsEpl_1"));

    hot.loadData(mydata.data);
});
