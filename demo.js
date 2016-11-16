var Demo = (function() {

    function blobTobuffer(blob,cb)
    {
        var myReader = new FileReader();
        myReader.readAsArrayBuffer(blob)
        
        myReader.addEventListener("loadend", function(e)
        {
            var buffer = myReader.result;//arraybuffer object
            cb(buffer)
        });
    }

    function demoUpload() {
        console.log("demoUpload called")
        
        var uploadButton = document.getElementById("imgUpload")
        uploadButton.addEventListener("change", function () { readFile(this); })

        var croppieContainer = document.getElementById("upload-demo")
        var uploadCrop = new Croppie(croppieContainer, {
            viewport: {
                width: 200,
                height: 200,
                type: 'square'
            },
            enableExif: true,
            showZoomer: false
        })

        function readFile(input){
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {

                    uploadCrop.bind({
                        url: e.target.result
                    }).then(function(){
                        console.log("croppie bind completed")
                    })  
                }
                
                reader.readAsDataURL(input.files[0]);
            }
            else {
                console.log("Sorry - you're browser doesn't support the FileReader API");
            }
        }

        var cropButton = document.getElementById("cropUpload")
        cropButton.addEventListener("click", function (ev) {
            uploadCrop.result({
                type: 'blob',
                format: 'jpeg'
            }).then(function(output){

                var formData = new FormData();
                formData.append("blob",output, "crop.jpg");


                var request = new XMLHttpRequest();
                request.open("POST", "http://192.168.42.119:8080/image");
                request.send(formData);
                // blobTobuffer(output, function(buf){
                //     console.log(buf)
                // })
            })
        })

    }

    return {
        init: demoUpload
    };
})();