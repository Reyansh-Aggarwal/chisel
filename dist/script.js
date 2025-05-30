"use strict";
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false, false];
// 0- name; 1-primary color; 2- secondary color; 3- image;
var filter = ["", "", "", ""];
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
            if (isFilled[0] && isFilled[3]) {
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
                    console.log("Uploaded successfully");
                }
                //handling window changes seperately
                if (imgPreview.src) {
                    window.location.href = "../social-media/intro.html";
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
            prevDiv.classList.add('hidden');
            changeOverlay.classList.add('hidden');
            imgTemplate.classList.remove('hidden');
            imgDiv.classList.remove('bg-transparent');
        });
    }
    if (document.body.getAttribute('id') == "postPage") {
        const params = new URLSearchParams(window.location.search);
        const postNum = params.get("post") || "1"; // Default fallback
        const feedNum = params.get("feed") || "1"; // Default fallback
        const img = document.getElementById("postImg");
        const canvas = document.getElementById("imgCanvas");
        const downloadButton = document.getElementById("download");
        const hueSlider = document.getElementById("hue");
        const saturSlider = document.getElementById("saturation");
        if (img && postNum && feedNum) {
            const parsedPostNum = parseInt(postNum, 10);
            const parsedFeedNum = parseInt(feedNum, 10);
            if (!isNaN(parsedPostNum) && !isNaN(parsedFeedNum)) {
                img.src = `../assets/social-media-${parsedFeedNum}/${parsedPostNum}.png`;
            }
        }
        const textbox = document.getElementById("textbox");
        textbox.oninput = hueSlider.oninput = saturSlider.oninput = img.onload = () => { render(parseInt(feedNum), postNum); };
        downloadButton.onclick = () => { downloadThis(canvas.toDataURL("image/png"), `post${postNum}.png`); };
    }
    if (document.body.getAttribute('id') == "feeds" || document.body.getAttribute("id") == "postPage") {
        const hueSlider = document.getElementById("hue");
        const saturSlider = document.getElementById("saturation");
        const tilesDiv = document.getElementById("tiles");
        const trackerDiv = document.getElementById("trackers");
        const resetButton = document.getElementById("reset");
        const settingDiv = document.getElementById("colorSettings");
        const downloadButton = document.getElementById("download");
        const urlParam = new URLSearchParams(window.location.search).get("feed");
        var feedNum = 1;
        var storedFilter;
        //getting feed number
        if (urlParam) {
            feedNum = parseInt(urlParam);
        }
        else {
            window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
        }
        if (document.body.getAttribute('id') == "feeds") {
            //setting trackers
            const allTrackers = trackerDiv.querySelectorAll('span');
            var trackerNum = 1;
            allTrackers.forEach((tracker) => {
                tracker.classList.add("opacity-50");
                tracker.classList.remove("text-blue-500");
                trackerNum++;
            });
            allTrackers[feedNum - 1].classList.add("text-blue-500");
            allTrackers[feedNum - 1].classList.remove("opacity-50");
        }
        if (feedNum) {
            if (!storedFilter) {
                filter = ["209", "100", "209", "100"]; //[currHue, currSatur, defHue, defSatur]
                storedFilter = localStorage.getItem(`filter${feedNum}`);
            }
            if (feedNum == 2 || feedNum == 3) {
                settingDiv.classList.add("hidden");
            }
        }
        if (storedFilter) {
            filter = JSON.parse(storedFilter);
            //setting apt slider values
            hueSlider.value = filter[0];
            saturSlider.value = filter[1];
        }
        //loading feed at first
        loadFeed(feedNum, true);
        //Event listeners
        hueSlider.addEventListener("input", () => {
            filter[0] = hueSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("hue:", filter[0]);
            if (document.body.id == "feeds") {
                loadFeed(feedNum);
            }
        });
        saturSlider.addEventListener("input", () => {
            filter[1] = saturSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            if (document.body.id == "feeds") {
                loadFeed(feedNum);
            }
        });
        resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => {
            hueSlider.value = filter[2];
            saturSlider.value = filter[3];
            applyFilters(tilesDiv, filter, true);
            console.log(filter[2], filter[3]);
        });
        downloadButton.onclick = () => {
            if (document.body.id == "feeds") {
                downloadFeed();
            }
        };
    }
});
//cant put in main if statement (DOMContentLoader)
function applyFilters(div, filter, reset = false) {
    const allPosts = div.querySelectorAll('img');
    const urlParam = new URLSearchParams(window.location.search).get("feed");
    var feedNum = 1;
    if (urlParam) {
        feedNum = parseInt(urlParam);
    }
    else {
        feedNum = 1;
    }
    var hue = parseInt(filter[2]);
    var satur = parseInt(filter[3]);
    if (!reset) {
        hue = parseInt(filter[0]);
        satur = parseInt(filter[1]);
    }
    else if (reset) {
        filter[0] = filter[2];
        filter[1] = filter[3];
    }
    allPosts.forEach((post) => {
        post.style.filter = `
            hue-rotate(${hue - 209}deg)
            saturate(${satur / 100})
        `;
    });
    localStorage.setItem(`filter${feedNum}`, JSON.stringify(filter));
    console.log("applied");
}
function downloadFeed() {
    var canvas;
    for (let i = 1; i <= 9; i++) {
        canvas = document.getElementById(`cvs${i}`);
        downloadThis(canvas.toDataURL("image/png"), `post${i}.png`);
    }
}
function downloadThis(dataURL, filename) {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
}
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
    prevDiv.classList.remove('hidden');
    changeOverlay.classList.remove('hidden');
    imgTemplate.classList.add('hidden');
    imgDiv.classList.add('bg-transparent');
}
function loadFeed(feedNum, first = false) {
    for (let i = 1; i <= 9; i++) {
        var tile = document.getElementById(i.toString());
        if (first) {
            tile.src = `../assets/social-media-${feedNum}/${i}.png`;
        }
        render(feedNum, i.toString(), `cvs${i}`, tile.id);
    }
}
function render(feedNum, postNum = "1", canvasID = "imgCanvas", imgID = "postImg") {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext("2d");
    const img = document.getElementById(imgID);
    const logo = new Image();
    logo.src = localStorage.getItem("logoImage") || "";
    var logoCoords = [0, 0];
    console.log(feedNum, postNum, canvasID, imgID);
    const hueSlider = document.getElementById("hue");
    const satSlider = document.getElementById("saturation");
    const captionInput = document.getElementById("textbox");
    const hue = parseInt(hueSlider.value);
    const saturate = parseInt(satSlider.value);
    const caption = captionInput.value;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Apply filter before drawing image
    if (feedNum == 1) {
        ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%)`;
        filter[0] = hue.toString();
        filter[1] = saturate.toString();
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    localStorage.setItem(`filter1`, JSON.stringify(filter));
    //draw logo
    if (logo.complete) {
        logoCoords = getLogoPos(postNum, feedNum, canvas.height, canvas.width);
        ctx.drawImage(logo, logoCoords[0], logoCoords[1], 250, 250);
    }
    if (caption) {
        ctx.font = "30px helvetica-roman";
        ctx.fillStyle = "green";
        ctx.fillText(caption, 200, canvas.height - 30);
        console.log(caption, "caption");
    }
    console.log("rendered");
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
                                //console.log("transparecny");
                                break;
                            }
                            else {
                                //console.log("not found");
                            }
                        }
                    }
                    if (transparentPixelFound) {
                        previewImage(img.src);
                    }
                    else {
                        alert("The Image does NOT have a transparent background.");
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
        else if (input.id == "imageInput") {
            isFilled[3] = true;
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
function getLogoPos(postNum, feedNum, height, width) {
    var logoPos = [0, 0];
    switch (feedNum) {
        case 1:
            if (postNum == "1" || postNum == "3" || postNum == "4" || postNum == "5" || postNum == "8") {
                logoPos = [0, 0];
            }
            else if (postNum == "2" || postNum == "7" || postNum == "9") {
                logoPos = [0, height - 275];
            }
            break;
        case 2:
            if (postNum == "1" || postNum == "4") {
                logoPos = [0, height - 275];
            }
            else if (postNum == "6" || postNum == "7" || postNum == "9") {
                logoPos = [width - 275, 0];
            }
            else if (postNum == "5" || postNum == "8") {
                logoPos = [width - 275, height - 275];
            }
            else if (postNum == "2" || postNum == "3") {
                logoPos = [0, 0];
            }
            break;
    }
    return logoPos;
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
function redirectPage(dest) {
    window.location.href = dest;
}
function redirectPost(postNum) {
    const urlParam = new URLSearchParams(window.location.search).get("feed");
    var feedNum = 1;
    if (urlParam) {
        feedNum = parseInt(urlParam);
    }
    window.location.href = `../social-media/postPage.html?feed=${feedNum}&post=${postNum}`;
    console.log(postNum, "rideiredt");
}
function changeFeed(feedNum) {
    //getting feed number
    var currfeedNum = 1;
    const mainSection = document.getElementById("mainSec");
    const urlParam = new URLSearchParams(window.location.search).get("feed");
    if (urlParam) {
        currfeedNum = parseInt(urlParam);
    }
    if (feedNum < currfeedNum) {
        mainSection.classList.add("animate-swipe-right");
    }
    else if (feedNum > currfeedNum) {
        console.log("test");
        //mainSection.classList.add("animate-swipe-left");    
    }
    setTimeout(() => {
        window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
    }, 700);
}
