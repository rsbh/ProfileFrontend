var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var formData = new FormData();


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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
              modal.style.display = "block";
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
            console.log("clicked")
            uploadCrop.result({
                type: 'blob',
                format: 'jpeg'
            }).then(function(output){
                formData.append("blob",output, "crop.jpg");

                console.log(formData)
                    modal.style.display = "none";
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


function sendData(){
  var request = new XMLHttpRequest();
  formData.append("fname",document.getElementById('fname').value)
  formData.append("lname",document.getElementById('lname').value)
  formData.append("email",document.getElementById('email').value)
  formData.append("contactAddress",document.getElementById('contactAddress').value)
  formData.append("dob",document.getElementById('dob').value)
  formData.append("doj",document.getElementById('doj').value)
  formData.append("idproof",document.getElementById('idproof').value)
  request.open("POST", "http://192.168.42.119:8080/image");
  request.send(formData);
}
document.getElementById("sendButton").addEventListener("click",sendData,false)
