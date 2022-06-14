const firebase = require("../firebase");
const storageRef = require("../firebase")
global.XMLHttpRequest = require("xhr2")
const addImage = async (avatar) => {
    try {
        console.log("avatar", avatar) 
        // Grab the file  
        const file = avatar;
        // Format the filename
        const timestamp = Date.now();
        console.log(avatar.split('.'))
        const name = file.split(".")[0];
        const type = file.split(".")[1]; 
        const fileName = `${name}_${timestamp}.${type}`;
        console.log(fileName)
         // Step 1. Create reference for file name in cloud storage 
        const imageRef = storageRef.child(fileName, file);
        // Step 2. Upload the file in the bucket storage
        const snapshot = await imageRef.put(file.buffer);
        // Step 3. Grab the public url
        const downloadURL = await snapshot.ref.getDownloadURL(fileName);
        // Step 4. Send the url back to the client
        console.log("downloadURL", downloadURL)

        //next() 
        // next(downloadURL);
     }  catch (error) {
        console.log (error,"error")
        res.status(400).json({error});
    }
}
module.exports =  addImage
