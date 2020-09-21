/* 
What to implemetenation
-thumbnail
-search
*/
//Help function for converting byte to human readable format
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

var loadedImage = requirelib("imagelib");
if (!loadedImage) {
    console.log("Failed to load lib imagelib, terminated.");
}

var loadedFile = requirelib("filelib");
if (!loadedFile) {
    console.log("Failed to load lib filelib, terminated.");
}

//Get all the files filesize on desktop
//folder = "user:/Photo/Photo/uploads/"
folder = JSON.parse(POST_data)["folder"];
//console.log("Folder name:" + folder);
var fileList = glob(folder + "*.*");
var results = [];
for (var i = 0; i < fileList.length; i++) {
    if (!isDir(fileList[i])) { //Well I don't had isFile, then use !isDir have same effect.
        var subFilename = fileList[i].split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "gif", "png"].indexOf(subFilename) >= 0) {
            //imagelib.resizeImage(src, dest, width, height)
            var filename = fileList[i].split("/").pop();
            var fileSize = filesize(fileList[i]);
            var dimension = imagelib.getImageDimension(folder + filename);
            var fileMD5Hash = filelib.md5(fileList[i]);
            var thumbnailsPath = "user:/Photo/Photo/thumbnails/" + fileMD5Hash + "." + subFilename;

            if (!fileExists(thumbnailsPath)) {
                var success = imagelib.resizeImage(fileList[i], thumbnailsPath, 200, 0);
                if (success) {
                    sendResp("OK")
                } else {
                    sendResp("Failed to resize image");
                }
            }


            results.push({
                URL: folder + filename,
                Filename: filename,
                Size: bytesToSize(fileSize),
                CacheURL: thumbnailsPath,
                Height: dimension[1],
                Width: dimension[0]
            });
        }
    }
}
sendJSONResp(JSON.stringify(results));