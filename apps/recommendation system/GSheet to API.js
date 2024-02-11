function doget(req) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName('Exported_file');
  var values = sheet.getDataRange().getValues();


  var output = [];
  for(var i=0; i<values.length; i++)
  {
    var row = {};
    row['User'] = values[i][0];
    row['Artist1'] = values[i][1];
    row['Artist2'] = values[i][2];
    row['Artist3'] = values[i][3];
    row['Artist4'] = values[i][4];
    row['Artist5'] = values[i][5];
    output.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify({data:output})).setMimeType(ContentService.MimeType.JSON);
}