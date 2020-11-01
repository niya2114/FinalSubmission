const mongoose = require('mongoose')

let invalidschema = mongoose.Schema({
    seq: {
        prop: 'invalid_invoice_uploaded',
        type: Number,
        default: 0
    }
})

let vendorschema = mongoose.Schema({
    invoice_number: {
        prop: 'invoice_numbers',
        type: Number,
    },
    document_number: {
        prop: 'documentNumber',
        type: Number
    },
    type: {
        prop: 'type',
        type: String
    },
    net_due_dt: {
        prop: 'net_due_date',
        type: Date
    },
    doc_Date: {
        prop: 'doc_date',
        type: Date
    },

    posting_date: {
        prop: 'posting_date',
        type: Date
    },
    amt_in_loc_cur: {
        prop: 'amount_in_local_currency',
        type: Number
    },
    vendor_code: {
        prop: 'vendor_code',
        type: String
    },
    vendor_name: {
        prop: 'vendor_name',
        type: String,
        default: null
    },
    vendor_type: {
        prop: 'vendor_type',
        type: String
    },
})


vendorschema.pre('save', function (next) {
    try {
        //await checkDataValidity(this)
    }
    catch (e) {
        console.log(e);
    }

    console.log("Pre function called");
    next()
})

vendorschema.post('save', async function (doc) {
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
})

function checkDataValidity(vendor) {
    var current_date = Date()
    var due_date = vendor.doc_Date
    console.log(due_date);
    // if(Date.parse(due_date) < Date.parse(current_date) ){
    //     //TODO  Increase the amount of invalid invoices
    //     try {
    //         var data = await model.find(vendor)
    //         console.log("This doc contains future date" + data); 
    //     } catch(e){
    //         console.log("Error occured " + e);
    //     }
    // }
    // else {
    //     console.log("This doc does not contain future date" + model.find(vendor)); 
    // }
    // if(vendor.amt_in_loc_cur < 0 ){
    //     vendor.invalid_invoice = true
    // }
}

module.exports = mongoose.model('VendorData', vendorschema)