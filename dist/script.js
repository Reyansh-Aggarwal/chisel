"use strict";
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false, false];
// 0- name; 1-primary color; 2- secondary color; 3- image;
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
        const chImgButton = document.getElementById("changeImage");
        const remImgButton = document.getElementById("remImage");
        const prevDiv = document.getElementById("imagePreviewDiv");
        const changeOverlay = document.getElementById("changeOverlay");
        const imgTemplate = document.getElementById("imageTemplate");
        const imgPreview = document.getElementById("imagePreview");
        //inputs
        const nameInput = document.getElementById("name");
        const primaryColorInput = document.getElementById("primaryColor");
        const secondaryColorInput = document.getElementById("secondaryColor");
        const imgInput = document.getElementById("imageInput");
        //fill stored values
        if (nameValue) {
            nameBrand = nameValue;
            nameInput.value = nameValue;
            makeGradient(submitButton, true);
            isFilled[0] = true;
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
                //console.log("Form submission detected");
                const formData = new FormData(form);
                //get form data
                nameBrand = formData.get("name") || nameBrand;
                primaryColor = formData.get("primaryColor") || primaryColor;
                secondaryColor = formData.get("secondaryColor") || secondaryColor;
                const logoImage = imgPreview.src;
                //image handling
                if (logoImage) {
                    localStorage.setItem("logoImage", logoImage);
                    //console.log("Uploaded successfully");
                }
                //handling window changes seperately
                if (!imgPreview.src) {
                    window.location.href = "";
                    console.log("no image");
                }
                else {
                    window.location.href = "../pages/logoPage.html";
                    console.log('yes image');
                }
                // Store the values in localStorage
                localStorage.setItem("nameBrand", nameBrand);
                localStorage.setItem("primaryColor", primaryColor);
                localStorage.setItem("secondaryColor", secondaryColor);
                //console.log(`Primary Color: ${primaryColor}, Secondary Color: ${secondaryColor}, Name: ${nameBrand}]`);
            }
        });
        imgDiv.addEventListener('click', () => {
            if (!imgPreview.src) {
                imgInput.click();
            }
        });
        chImgButton.addEventListener("click", () => {
            imgInput.click();
            console.log("clicked");
        });
        remImgButton.addEventListener("click", () => {
            imgPreview.src = "";
            imgInput.src = "";
            localStorage.removeItem("logoImage");
            prevDiv.classList.add('absolute');
            imgInput.classList.remove('hidden');
            prevDiv.classList.add('hidden');
            changeOverlay.classList.add('hidden');
            imgTemplate.classList.remove('hidden');
            imgDiv.classList.remove('bg-transparent');
        });
    }
});
//cant put in main if statement (DOMContentLoader)
function previewImage(logoUrl) {
    console.log("image previewed");
    const prevDiv = document.getElementById("imagePreviewDiv");
    const imgPreview = document.getElementById("imagePreview");
    const imgTemplate = document.getElementById("imageTemplate");
    const imgDiv = document.getElementById("imageDiv");
    const changeOverlay = document.getElementById("changeOverlay");
    const imgInput = document.getElementById("imageInput");
    //settinbg values
    imgPreview.src = logoUrl;
    localStorage.setItem("logoImage", logoUrl);
    //changing classes (tailwind) of divs for styling
    prevDiv.classList.remove('absolute');
    imgInput.classList.add('hidden');
    prevDiv.classList.remove('hidden');
    changeOverlay.classList.remove('hidden');
    imgTemplate.classList.add('hidden');
    imgDiv.classList.add('bg-transparent');
}
function imageChange() {
    const imgInput = document.getElementById("imageInput");
    const imgFile = imgInput.files ? imgInput.files[0] : null;
    if (imgFile) {
        if (imgFile === null || imgFile === void 0 ? void 0 : imgFile.type.includes('png')) {
            const reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.getElementById('imgCanvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    let transparentPixelFound = false;
                    canvas.width = img.width;
                    canvas.height = img.height;
                    console.log("img loaded");
                    if (ctx) {
                        console.log("yay ctx");
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        for (let i = 3; i < imageData.length; i += 4) {
                            if (imageData[i] === 0) { // Alpha channel is 0 (fully transparent)
                                transparentPixelFound = true;
                                console.log("transparecny");
                                break;
                            }
                            else {
                                console.log("not found");
                            }
                        }
                    }
                    if (transparentPixelFound) {
                        previewImage(img.src);
                    }
                    else {
                        console.log("none");
                    }
                };
            };
            isFilled[3] = true;
        }
        else {
            console.log("no png");
        }
    }
    //emptying <input> so that the user can upload a new image later
    imgInput.value = "";
}
function checkRequired(event) {
    const input = event.target;
    const data = input.value;
    const submitButton = document.getElementById("submitButton");
    if (data != "") {
        if (input.id == "name") {
            isFilled[0] = true;
            //console.log("name filled");   
        }
        else if (input.id == "primaryColor" || input.id == "secondaryColor") {
            isFilled[1] = true;
            //console.log("color filled"); 
        }
        //console.log(isFilled);
        makeGradient(submitButton, true);
    }
    else if (!data) {
        if (input.id == "name") {
            isFilled[0] = false;
            //console.log("name not filled"); 
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
