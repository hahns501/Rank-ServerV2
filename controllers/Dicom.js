import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: "AKIARZIG7UBYCFUND2MU",
    secretAccessKey: "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"
});

let s3 = new AWS.S3();

export const getImages = async (req,res) => {
    console.log("getImages")
    let params = {
        Bucket: 'imagerankerdicomtest',
        Prefix: 'foldertest1/',
    };

    try{
        s3.listObjectsV2(params, function(err, data) {
            if (err){
                console.log(err, err.stack);
                res.status(404).json({message: err.message})
            } // an error occurred
            else {
                res.status(200).json(data);
                console.log(data)
                const {Contents} = data;
                const images = Contents.map(element => element.Key);
                console.log(images);
            }
        });
    }catch(err){
        console.log(err);
    }
}

export const getFolders = async (req,res) => {
    console.log("getFolders")
    let params = {
        Bucket: 'imagerankerdicomtest',
        Delimiter: '/'
    };

    try{
        s3.listObjectsV2(params, function(err, data) {
            if (err){
                console.log(err, err.stack);
                res.status(404).json({message: err.message})
            } // an error occurred
            else {
                res.status(200).json(data);
                const {CommonPrefixes} = data;
                const folders = CommonPrefixes.map(element => element.Prefix);
                console.log(folders);
            }
        });
    }catch(err){
        console.log(err);
    }
}

