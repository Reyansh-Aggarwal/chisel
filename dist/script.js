"use strict";
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false], logoUrl = "";
document.addEventListener("DOMContentLoaded", function () {
    //need always
    const nameValue = localStorage.getItem("nameBrand");
    const primaryColorValue = localStorage.getItem("primaryColor");
    const secondaryColorValue = localStorage.getItem("secondaryColor");
    const logoImageValue = localStorage.getItem("logoImage");
    if (document.body.getAttribute('id') == "setupPage") {
        const form = document.getElementById("details");
        const imgButton = document.getElementById("imageTemplate");
        const submitButton = document.getElementById("submitButton");
        //inputs
        const nameInput = document.getElementById("name");
        const primaryColorInput = document.getElementById("primaryColor");
        const secondaryColorInput = document.getElementById("secondaryColor");
        const imgPreview = document.getElementById("imagePreview");
        //fill stored values
        console.log("page loaded");
        if (nameValue) {
            nameBrand = nameValue;
            nameInput.value = nameValue;
            makeGradient(submitButton, true);
        }
        if (primaryColorValue) {
            primaryColor = primaryColorValue;
            primaryColorInput.value = primaryColorValue;
            isFilled[1] = true;
        }
        if (secondaryColorValue) {
            secondaryColor = secondaryColorValue;
            secondaryColorInput.value = secondaryColorValue;
            isFilled[2] = true;
        }
        if (logoImageValue) {
            logoUrl = logoImageValue;
            previewImage(logoImageValue);
            isFilled[3] = true;
        }
        //-===
        //submit
        form.addEventListener('submit', (event) => {
            if (nameValue && primaryColorValue || secondaryColorValue) {
                event.preventDefault();
                console.log("Form submission detected");
                const formData = new FormData(form);
                //get form data
                nameBrand = formData.get("name") || nameBrand;
                primaryColor = formData.get("primaryColor") || primaryColor;
                secondaryColor = formData.get("secondaryColor") || secondaryColor;
                const logoImage = formData.get("logo") || logoUrl;
                //image handling
                if (logoImage) {
                    localStorage.setItem("logoImage", logoUrl);
                    console.log("Uploaded successfully");
                }
                //handling window changes seperately
                if (imgPreview.src != "") {
                    window.location.href = "../pages/logoPage.html";
                }
                else if (imgPreview.src == "") {
                    window.location.href = "";
                }
                // Store the values in localStorage
                localStorage.setItem("nameBrand", nameBrand);
                localStorage.setItem("primaryColor", primaryColor);
                localStorage.setItem("secondaryColor", secondaryColor);
                console.log(`Primary Color: ${primaryColor}, Secondary Color: ${secondaryColor}, Name: ${nameBrand}]`);
            }
        });
        imgButton.addEventListener('onchange', () => {
            const imgInput = document.getElementById("imageInput");
            const imgFile = imgInput.files ? imgInput.files[0] : null;
            if (imgFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imgFile);
                reader.onload = () => {
                    previewImage(reader.result);
                };
            }
            //emptying <input> so that the user can upload a new image
            imgInput.value = "";
        });
        function previewImage(logoUrl) {
            //telling that the image has been uploaded
            isFilled[3] = true;
            const prevDiv = document.getElementById("imagePreviewDiv");
            const imgPreview = document.getElementById("imagePreview");
            const imgTemplate = document.getElementById("imageTemplate");
            const imgDiv = document.getElementById("imageDiv");
            imgPreview.src = logoUrl;
            //changing classes (tailwind) of divs for styling
            prevDiv.classList.remove('absolute');
            imgPreview.classList.remove('hidden');
            imgTemplate.classList.add('hidden');
            imgPreview.classList.add('block');
            imgDiv.classList.add('bg-transparent');
        }
    }
    if (document.body.getAttribute('id') == "logoPage") {
    }
});
//cant put in main if statement because of some reason??
function checkRequired(event) {
    const input = event.target;
    const data = input.value;
    const submitButton = document.getElementById("submitButton");
    if (data != "") {
        if (input.id == "name") {
            isFilled[0] = true;
            console.log("name filled");
        }
        else if (input.id == "primaryColor" || input.id == "secondaryColor") {
            isFilled[1] = true;
            console.log("color filled");
        }
        console.log(isFilled);
        makeGradient(submitButton, true);
    }
    else if (!data) {
        if (input.id == "name") {
            isFilled[0] = false;
            console.log("name not filled");
            makeGradient(submitButton, false);
        } //others not needed because color cant be empty?? 
    }
}
function makeGradient(item, bool) {
    if (bool) {
        item.classList.remove('bg-my-gray');
        item.classList.add("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
    }
    else {
        item.classList.add('bg-my-gray');
        item.classList.remove("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
    }
}
