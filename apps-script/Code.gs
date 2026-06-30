// ── Atelier Prestige Luxembourg — Google Apps Script
// Deployment: Extensions → Apps Script → Deploy → New deployment (type: Web app)
// Execute as: Me | Who has access: Anyone
// Copy the URL and set APPS_SCRIPT_URL in boutique.astro

const SHEET_NAME_ORDERS   = 'Orders';
const SHEET_NAME_PRODUCTS = 'Products';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure Orders sheet exists
    let sheet = ss.getSheetByName(SHEET_NAME_ORDERS);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_ORDERS);
      sheet.getRange('A1:J1').setValues([[
        'Order ID','Timestamp','Name','Email','Phone','Items','Total €','Notes','Status','Created'
      ]]);
      sheet.getRange('A1:J1').setFontWeight('bold');
    }

    sheet.appendRow([
      data.order_id, data.timestamp, data.name, data.email,
      data.phone || '', data.items, parseFloat(data.total),
      data.notes || '', 'NEW', new Date().toLocaleString('fr-LU')
    ]);

    // Optional: Send confirmation email
    // MailApp.sendEmail(data.email, 'Commande reçue - Atelier Prestige',
    //   `Merci ${data.name} ! Votre commande ${data.order_id} a été reçue. Nous vous contacterons sous 24h.`);

    return ContentService
      .createTextOutput(JSON.stringify({status:'ok', order_id: data.order_id}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status:'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok', message:'Atelier Prestige Orders API'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once to create the Products sheet with sample data
function setupProductsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME_PRODUCTS);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME_PRODUCTS); }
  sheet.clearContents();
  sheet.getRange('A1:G1').setValues([['id','name','cat','price','img','desc','machine']]);
  sheet.getRange('A1:G1').setFontWeight('bold');
  // Add the 24 products manually in the sheet, or import from boutique.astro catalogue
  SpreadsheetApp.getUi().alert('Products sheet created! Add your products in the "Products" tab.');
}
