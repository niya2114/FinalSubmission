const express = require('express')
const router = express.Router()
const readXlsxFile = require("read-excel-file")
const mongoose = require('mongoose')
const db = mongoose.connection
const vendor = require('../model/VendorSchema')

var invoice_object = {
    'Invoice Numbers': Number,
    'Document Number': Number,
    'Type': String,
    'Net Due dt': Date,
    'Doc. Date': Date,
    'Pstng Date': Date,
    'Amt in loc.cur.': Number,
    'Vendor Code': String,
    'Vendor Name': String,
    'Vendor Type': String
}

// Checking if data already exists
function checkIfExists(invoicenumber, invoice) {
    try {
        vendor.find({
            invoice_number :  invoicenumber
        }, (err, doc) => {
            // if(doc.length == 0){
            //     vendor.create(invoice)
            //     console.log("New invoice");   
            // }
            // else {
            //     console.log("Already exists");
            // }
            vendor.create(invoice)
            console.log("New invoice");   
        })
    } catch(err) {
        console.log(err);
    } 
}

// Post request to upload file
router.post("/upload", async (request, response) => {
    //    const FILE_TYPE_PREFFERED = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    try {
        if (!request.files) {
            response.send({
                status: false,
                message: "No file uploaded"
            })
        }
        else {
            let vendorfile = request.files.uploadedfile

            // Read the excel file
            readXlsxFile(vendorfile.data).then((rows) => {
                for (var i = 1; i <= rows.length; i++) {
                    let record = {
                        invoice_number: rows[i][0],
                        document_number: rows[i][1],
                        type: rows[i][2],
                        net_due_dt: rows[i][3],
                        doc_Date: rows[i][4],
                        posting_date: rows[i][5],
                        amt_in_loc_cur: rows[i][6],
                        vendor_code: rows[i][7],
                        vendor_name: rows[i][8],
                        vendor_type: rows[i][9]
                    }
                    checkIfExists(record.invoice_number, record)
                    // Check whether the record is present or not
                    console.log(db.collection('invoices').length);
                }

            }).catch((onrejectionhandled) => {
                console.log(onrejectionhandled);
            })

            var data = vendorfile.data.toString("utf-8")
            response.send({
                status: true,
                message: "File is uploaded",
                data: {
                    name: vendorfile.name,
                    mimetype: vendorfile.mimetype,
                    size: vendorfile.size,
                }
            })
        }
    } catch (err) {
        response.status(500)
        console.log(err);
    }
})

router.get("/detail", async (req, res) => {
    var result
    var amount = 0
    var unique_vendors
    var invalid_invoices = 0
    try {
        result = await vendor.find()
        for(var i = 0 ; i < result.length; i++){
            // Dont add negative values
            amount += result[i].amt_in_loc_cur
        }

        unique_vendors = await vendor.find().distinct('vendor_name', (err, ids) => {
            console.log(ids);
            unique_vendors = ids
        })

        console.log("Total records are : " + result.length);
    }
    catch(e){
        console.log(e);
    }

    // Respone send
    res.send({
        status : "OK",
        invoices_uploaded : result.length,
        amount_total : amount,
        vendor_unique : unique_vendors,
        invalid_invoice :  invalid_invoices
    })
})

module.exports = router