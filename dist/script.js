"use strict";
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false];
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute('id') == "setupPage") {
        //need always
        const nameValue = localStorage.getItem("nameBrand");
        const primaryColorValue = localStorage.getItem("primaryColor");
        const secondaryColorValue = localStorage.getItem("secondaryColor");
        const logoImageValue = localStorage.getItem("logoImage");
        const imgDiv = document.getElementById("imageDiv");
        const form = document.getElementById("details");
        const submitButton = document.getElementById("submitButton");
        //inputs
        const nameInput = document.getElementById("name");
        const primaryColorInput = document.getElementById("primaryColor");
        const secondaryColorInput = document.getElementById("secondaryColor");
        const imgInput = document.getElementById("imageInput");
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
            previewImage(logoImageValue);
            isFilled[3] = true;
        }
        //===================================================================
        form.addEventListener('submit', (event) => {
            if (nameValue && primaryColorValue || secondaryColorValue) {
                event.preventDefault();
                console.log("Form submission detected");
                const formData = new FormData(form);
                const reader = new FileReader();
                //get form data
                nameBrand = formData.get("name") || nameBrand;
                primaryColor = formData.get("primaryColor") || primaryColor;
                secondaryColor = formData.get("secondaryColor") || secondaryColor;
                const logoImage = imgPreview.src;
                //image handling
                if (logoImage) {
                    localStorage.setItem("logoImage", logoImage);
                    console.log("Uploaded successfully");
                }
                //handling window changes seperately
                if (imgPreview.src != "") {
                    window.location.href = "";
                }
                else if (imgPreview.src == "") {
                    window.location.href = "../pages/logoPage.html";
                }
                // Store the values in localStorage
                localStorage.setItem("nameBrand", nameBrand);
                localStorage.setItem("primaryColor", primaryColor);
                localStorage.setItem("secondaryColor", secondaryColor);
                console.log(`Primary Color: ${primaryColor}, Secondary Color: ${secondaryColor}, Name: ${nameBrand}]`);
            }
        });
        imgDiv.addEventListener('click', () => {
            if (!imgPreview.src) {
                imgInput.click();
                console.log("hello");
            }
            else {
                imgInput.click();
                console.log("hello3");
            }
            console.log("hello2");
        });
    }
});
//cant put in main if statement (DOMContentLoader)
function previewImage(logoUrl) {
    //telling that the image has been uploaded
    console.log("image previewed");
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
function imageInputChange() {
    const imgInput = document.getElementById("imageInput");
    const imgFile = imgInput.files ? imgInput.files[0] : null;
    if (imgFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onload = () => {
            previewImage(reader.result);
        };
    }
    console.log("hello");
    //emptying <input> so that the user can upload a new image
    imgInput.value = "";
}
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
        } //others not needed because color cant be empty?
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
