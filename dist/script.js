"use strict";
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false];
//Check if the user submits/is filling the form (for event listeners)
if (document.body.getAttribute('id') == "setupPage") {
    const form = document.getElementById("details");
    const imgButton = document.getElementById("imageTemplate");
    form.addEventListener('submit', (event) => {
        if (isFilled[0] && isFilled[1] && isFilled[2]) {
            event.preventDefault();
            console.log(localStorage.getItem("nameBrand"));
            console.log("Form submission detected");
            const formData = new FormData(form);
            //get form data
            nameBrand = formData.get("name") || nameBrand;
            primaryColor = formData.get("primaryColor") || primaryColor;
            secondaryColor = formData.get("secondaryColor") || secondaryColor;
            // Store the values in localStorage
            localStorage.setItem("nameBrand", nameBrand);
            localStorage.setItem("primaryColor", primaryColor);
            localStorage.setItem("secondaryColor", secondaryColor);
            console.log(`Primary Color: ${primaryColor}, Secondary Color: ${secondaryColor}, Name: ${nameBrand}`);
        }
    });
    imgButton.addEventListener('click', () => {
        const imgInput = document.getElementById("imageInput");
        imgInput.click();
    });
}
function previewImage(event) {
    const input = event.target;
    const imgFile = input.files ? input.files[0] : null;
    if (imgFile) {
        const reader = new FileReader();
        const prevDiv = document.getElementById("imagePreviewDiv");
        const imgPreview = document.getElementById("imagePreview");
        const imgTemplate = document.getElementById("imageTemplate");
        const imgDiv = document.getElementById("imageDiv");
        reader.readAsDataURL(imgFile);
        reader.onload = () => {
            imgPreview.src = reader.result;
            console.log(imgPreview.src);
            prevDiv.classList.remove('absolute');
            imgPreview.classList.remove('hidden');
            imgTemplate.classList.add('hidden');
            imgPreview.classList.add('block');
            imgDiv.classList.add('bg-transparent');
            input.value = "";
        };
    }
}
function checkRequired(event) {
    const input = event.target;
    const data = input.value;
    const submitButton = document.getElementById("submitButton");
    const submitGlow = document.getElementById("submitGlow");
    if (data != "") {
        if (input.id == "name") {
            isFilled[0] = true;
            console.log("name filled");
        }
        else if (input.id == "primaryColor") {
            isFilled[1] = true;
            console.log("c1 filled");
        }
        else if (input.id == "secondaryColor") {
            isFilled[2] = true;
            console.log("c2 filled");
        }
        console.log(isFilled);
        if (isFilled[0] && (isFilled[1] || isFilled[2])) {
            submitButton.classList.remove('bg-my-gray');
            submitButton.classList.add("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
            submitGlow.classList.remove('hidden');
        }
        else {
            if (!submitButton.classList.contains("bg-my-gray")) {
                submitButton.classList.remove('bg-gradient-to-r from-[#524dee] via-[#0be1f7] to-[#524dee]');
                submitButton.classList.add('bg-my-gray');
                submitGlow.classList.add('hidden');
            }
        }
    }
}
