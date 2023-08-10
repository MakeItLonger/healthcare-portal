const fs = require('fs');
const PDFDocument = require('pdfkit-table')

const createReceipt = async (template) => {


    let doc = new PDFDocument({margin: 30, size: "A4"})


    const drugsArray = []

    template.drugs.map(drug => {
        drugsArray.push(Object.values(drug))
    })

    doc.image('~/../pdfLogo.jpg', 30, 30, { height: 50})

   console.log(drugsArray)

    const table = {
        headers: ["Name", "Dosage", "Intakes"],
        rows: drugsArray,
    };

    doc.fontSize(20).text("Drugs", 0, 180, {
        width: doc.page.width,
        align: 'center'
    })

    doc.table(table, {
        x: 30,
        y: 210,
        width: 540,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
        prepareRow: () => doc.fontSize(12)
    });

    doc.fontSize(20).text("Description", 30, 430, {
        width: doc.page.width - 60,
        align: 'center'
    })
    doc.fontSize(12).text(template.description, 30, 470)

    const today = new Date()

    doc.fontSize(12).text("Prescription for: " + template.patient, 30, 150)
    doc.fontSize(12).text("Doctor: " + template.doctor, 30, 700)
    doc.fontSize(12).text(today.toLocaleDateString('en-GB'), 500, 700)
    doc.moveTo(500, 715).lineTo(500 + doc.widthOfString(today.toLocaleDateString('en-GB')), 715).stroke();
    doc.moveTo(30, 715).lineTo(30 + doc.widthOfString("Doctor: " + template.doctor), 715).stroke();




    doc.rect(0, doc.page.height - 100, doc.page.width, 100).fill('#3f51b5');
    doc.fillColor('white').fontSize(60).text('STAY HEALTHY', 0, doc.page.height - 70, {
        width: doc.page.width,
        height: 60,
        verticalAlign: 'center',
        align: 'center',
    });

    doc.pipe(fs.createWriteStream('receipt.pdf'));
    doc.end()
}

module.exports = createReceipt


