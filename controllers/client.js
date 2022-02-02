const csvToJSON = require('csvtojson');
const csv = require('fast-csv');
const fs = require('fs');
const multer = require('multer');

const CSV = require('../models/csv');
const Content = require('../models/contents');
const catchAsync = require('../utils/catchAsync')

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        try {
            cb(null, "./uploads");
        }
        catch (e) {
            console.log(e);
        }    
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})

module.exports.upload = multer({ storage: storage });

module.exports.fileUpload = async(req, res) => {
    try{
            if(req.file == undefined){
                res.json({msg:"error Please upload a csv file"});
            }
            const csv = await new CSV({ filePath: req.file.path, fileName: req.file.filename })
            await csv.save();
            csvToJSON()
            .fromFile(csv.filePath)
            .then(catchAsync(async(jsonObj)=>{
                headers = Object.keys(jsonObj[0]);
                csv.headers = headers;
                await csv.save();
                jsonObj.map((obj) => {
                    obj.file = csv._id;
                })
                await Content.insertMany(jsonObj);
                fs.unlink(csv.filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            res.json({msg: "success File uploaded and data saved to DB successfully"});
        }));

    } catch(error) {
        console.log("catch error-", error);
        res.json({msg: "error Could not upload the file"});
    }
}

// View All data
module.exports.viewFileContents = async (req, res) => {
    const { fileId } = req.params;  
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    const data = await Content.find({ file: csv._id });
    var contents = JSON.parse(JSON.stringify(data));
    res.json({ contents, headers, fileId });
}

//header data present in DB
module.exports.renderNewEntryForm = async (req, res) => {
    const { fileId } = req.params;
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    res.json({ headers, fileId });
}

//Create new data entry
module.exports.saveNewEntry = async (req, res) => {
    const { fileId } = req.params;
    const values = req.body;
    const csv = await CSV.findById(fileId);
    const data = await new Content(values);
    await data.save();
    await Content.findByIdAndUpdate(data._id, {file: csv._id});
    res.json({msg: 'success Successfully added a data entry'});
}

//Update perticular data entry
module.exports.updateEntry = async (req, res) => {
    const { fileId, id } = req.params;
    const values = req.body;
    const data = await Content.findByIdAndUpdate(id, values);
    res.json({values});
}

//delete perticular data entry
module.exports.deleteEntry = async(req, res) => {
    const { fileId, id } = req.params;
    await Content.findByIdAndDelete(id);
    res.json({msg:'success, Data entry successfully deleted'});
}