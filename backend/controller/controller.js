const mongoose = require('mongoose')

async function validity(doc) {
    var current_date = Date()
    var doc_date = doc.doc_Date
    var model = await mongoose.model('VendorData', vendorschema)
    var countermodel = await mongoose.model('InvalidInvoice', invalidschema)

    if (Date.parse(doc_date) > Date.parse(current_date) || doc.vendor_name == null) {
        //console.log("Date is in future for doc id " + doc.invoice_number);
        //console.log(doc.vendor_name);
        model.find(doc).remove((err) => {
            //console.log("Record deleted for future date");
        })
    }

    model.find({
        invoice_number: doc.invoice_number
    }, (err, resp) => {
        if (resp.length > 1) {
            var i
            for (i = 1; i < resp.length; i++) {
                model.find(resp[i]).remove((err) => {
                    console.log("Error occured " + err);
                })
            }
            console.log("Deleted " + i + " same records.");
        }

    })



    //console.log(model);
    console.log('%s has been saved', doc._id);

}

module.exports = validity