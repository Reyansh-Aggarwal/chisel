"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false, false];
// 0- name; 1-primary color; 2- secondary color; 3- image;
var filter = ["", "", "", ""];
/* todo
- define logo coords for diff materials
- draw
*/
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
        const logo = new Image();
        logo.src = localStorage.getItem("logoImage") || "";
        textbox.oninput = hueSlider.oninput = saturSlider.oninput = img.onload = () => { render(parseInt(feedNum), postNum, canvas.id, img.id, logo); };
        downloadButton.onclick = () => { downloadThis(canvas.toDataURL("image/png"), `post${postNum}.png`); };
    }
    if (document.body.getAttribute('id') == "feeds" || document.body.getAttribute("id") == "postPage") {
        const hueSlider = document.getElementById("hue");
        const saturSlider = document.getElementById("saturation");
        const textbox = document.getElementById("textbox");
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
        //setup
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
        textbox.value = localStorage.getItem("nameBrand") || "404";
        //loading feed at first
        loadFeed(feedNum, true);
        //Event listeners
        hueSlider.addEventListener("input", () => {
            filter[0] = hueSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("hue:", filter[0]);
            if (document.body.id == "feeds") {
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        saturSlider.addEventListener("input", () => {
            filter[1] = saturSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            if (document.body.id == "feeds") {
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        textbox.addEventListener("input", () => {
            //applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            if (document.body.id == "feeds") {
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => {
            filter[2] = "360";
            filter[3] = "200";
            hueSlider.value = filter[2];
            saturSlider.value = filter[3];
            if (document.body.id == "feeds") {
                console.log("loading");
                loadFeed(feedNum);
            }
            console.log(filter[2], filter[3]);
        });
        downloadButton.onclick = () => {
            if (document.body.id == "feeds") {
                downloadFeed();
            }
        };
    }
    if (document.body.getAttribute('id') == "branding") {
        const container = document.getElementById("scrollContainer");
        const circles = container.querySelectorAll('div');
        const markerCircle = document.getElementById("marker");
        let circlesPos = [];
        let cAngle = [0, 0, 0, 0, 0];
        const circleCount = 5; // Dynamically get the number of circles
        let radius = 150; // Adjusted radius for better visibility
        let markerAngle = 180;
        let xOffset = 0;
        let activeCircleNum = 2;
        var startAngle = 180;
        var endAngle = 360;
        if (window.matchMedia("(min-width: 500px)").matches) {
            radius = 200;
        }
        if (window.matchMedia("(min-width: 800px)").matches) {
            console.log("matched");
            radius = 300;
            startAngle -= 90;
            endAngle -= 90;
            xOffset = 25;
        }
        let feedNum = localStorage.getItem("feed-number");
        if (!feedNum) {
            feedNum = "3";
        }
        const matNames = ["Carry Bag", "Case", "Business Card", "Cloth", "Cleaning Spray"];
        const matAlias = ["bag", "case", "bns-card", "cloth", "spray"];
        const downPath = ["bns-card/bns-card-front.png", "bns-card/bns-card-back.png", "texture.png"];
        const matLabel = document.getElementById("matLabel");
        const dwnldButton = document.getElementById("downloadButton");
        const img = document.getElementById("matImg");
        const logoTextCanvas = document.createElement("canvas"); //need to be availabe for dwnld function
        const canvas = document.getElementById("matCanvas");
        function positionCircles(startAngle, endAngle) {
            const angleStep = (endAngle - startAngle) / (circleCount - 1);
            circles.forEach((circle, index) => {
                const angle = startAngle + index * angleStep;
                const angleRad = angle * (Math.PI / 180); // Convert degrees to radians
                const x = Math.cos(angleRad) * radius - xOffset;
                const y = Math.sin(angleRad) * radius;
                circlesPos[index] = [x, y];
                cAngle[index] = angle;
                // Since we want the LEFT semicircle, mirror the X to negative
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
            //initial pos of marker as well
            positionMarker(2);
            console.log("main circle", activeCircleNum);
            //console.log(circlesPos); //debug
        }
        function positionMarker(cNum) {
            const markerParent = markerCircle.parentElement;
            const circle = circles[cNum];
            const circleRect = circle.getBoundingClientRect();
            const parentRect = markerParent.getBoundingClientRect();
            const relativeX = circleRect.left - parentRect.left + circleRect.width / 2;
            const relativeY = circleRect.top - parentRect.top + circleRect.height / 2;
            // Set position and center the marker using translate
            markerCircle.style.left = `${relativeX}px`;
            markerCircle.style.top = `${relativeY}px`;
            markerCircle.style.transform = `translate(-50%, -50%)`;
            activeCircleNum = cNum;
            changeMaterial();
        }
        function changeMaterial() {
            return __awaiter(this, arguments, void 0, function* (cNum = activeCircleNum) {
                if (matLabel) {
                    matLabel.textContent = matNames[activeCircleNum];
                    img.src = `../assets/branding-materials/${feedNum}/display/${matAlias[cNum]}.png`;
                    img.onload = () => {
                        renderMaterial();
                    };
                }
            });
        }
        function renderMaterial() {
            return __awaiter(this, void 0, void 0, function* () {
                const ctx = canvas.getContext("2d");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                console.log(canvas.width, canvas.height);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                //drawing logo
                let textColor = "black";
                if (feedNum == "1") {
                    textColor = "#3b82f6";
                }
                else if (feedNum == "2") {
                    textColor = "white";
                }
                else if (feedNum == "3") {
                    if (activeCircleNum == 2) {
                        textColor = "white";
                    }
                    else {
                        textColor = "#834e00";
                    }
                }
                console.log("feed ", feedNum);
                yield drawLogoText(textColor);
                var logoCoords = [[1000, 1600], [350, 1025], [1000, 1320], [350, 2300], [1200, 1625]];
                let scale = 0.3;
                if (activeCircleNum == 4) {
                    scale = 0.2;
                }
                const ltfinalWidth = logoTextCanvas.width * scale;
                const ltfinalHeight = logoTextCanvas.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(logoTextCanvas, logoCoords[activeCircleNum][0], logoCoords[activeCircleNum][1], ltfinalWidth, ltfinalHeight);
                console.log("rendered");
            });
        }
        ;
        function drawLogoText(txtColor) {
            return __awaiter(this, void 0, void 0, function* () {
                const logo = new Image();
                logo.src = localStorage.getItem("logoImage") || "";
                yield new Promise((resolve) => {
                    logo.onload = () => {
                        const caption = localStorage.getItem("nameBrand") || "hello world";
                        const logoTextCtx = logoTextCanvas.getContext("2d");
                        const logoWidth = 1000;
                        const logoHeight = 1000;
                        const padding = 80;
                        const fontSize = 700;
                        let mainFont = "helvetica-bold";
                        if (feedNum == "2") {
                            mainFont = "phagspa";
                        }
                        else if (feedNum == "3") {
                            mainFont = "Times New Roman";
                        }
                        logoTextCtx.font = `${fontSize}px ${mainFont}, Arial, sans-serif`;
                        const textWidth = caption ? logoTextCtx.measureText(caption).width : 0;
                        logoTextCanvas.width = logoWidth + padding + textWidth + padding * 2;
                        logoTextCanvas.height = logoHeight + padding * 2;
                        // Draw logo with color overlay
                        const offCanvas = document.createElement("canvas");
                        offCanvas.width = logoWidth;
                        offCanvas.height = logoHeight;
                        const offCtx = offCanvas.getContext("2d");
                        offCtx.drawImage(logo, 0, 0, logoWidth, logoHeight);
                        offCtx.globalCompositeOperation = "source-in";
                        offCtx.fillStyle = txtColor;
                        offCtx.fillRect(0, 0, logoWidth, logoHeight);
                        offCtx.globalCompositeOperation = "source-over";
                        logoTextCtx.clearRect(0, 0, logoTextCanvas.width, logoTextCanvas.height);
                        logoTextCtx.drawImage(offCanvas, padding, padding, logoWidth, logoHeight);
                        // Draw text
                        logoTextCtx.font = `${fontSize}px ${mainFont}, Arial, sans-serif`;
                        logoTextCtx.fillStyle = txtColor;
                        console.log("font", logoTextCtx.font, "fill", logoTextCtx.fillStyle);
                        logoTextCtx.textBaseline = "middle";
                        logoTextCtx.textAlign = "left";
                        logoTextCtx.fillText(caption, padding + logoWidth, padding + logoHeight / 2);
                        console.log("Drawn");
                        resolve(); // ✅ now we say this part is done!
                    };
                    logo.onerror = () => {
                        console.error("Failed to load logo image.");
                        resolve(); // or reject, depending on your preference
                    };
                });
            });
        }
        function downloadMaterials() {
            return __awaiter(this, void 0, void 0, function* () {
                const zip = new JSZip();
                var res, blob, canvasBlob;
                //canvas files
                if (feedNum == "3") {
                    yield drawLogoText("#834e00");
                    canvasBlob = yield new Promise(resolve => logoTextCanvas.toBlob(resolve, "image/png"));
                    zip.file("logoText2.png", canvasBlob);
                    yield drawLogoText("#ffffff");
                }
                else {
                    canvasBlob = yield new Promise(resolve => logoTextCanvas.toBlob(resolve, "image/png"));
                }
                canvasBlob = yield new Promise(resolve => logoTextCanvas.toBlob(resolve, "image/png"));
                zip.file("logoText.png", canvasBlob);
                //getting texture and bns-card files
                for (let i = 0; i < 3; i++) {
                    res = yield fetch(`../assets/branding-materials/${feedNum}/download/${downPath[i]}`);
                    blob = yield res.blob();
                    zip.file(downPath[i], blob);
                }
                //Downloading zip
                const zipBlob = yield zip.generateAsync({ type: "blob" });
                saveAs(zipBlob, "branding-materials.zip");
            });
        }
        dwnldButton.onclick = downloadMaterials;
        //event listeners
        circles.forEach((circle, index) => {
            circle.onclick = () => {
                positionMarker(index);
                console.log(index);
            };
        });
        //we dont need this but I spent an hour on it so im keeping it 
        /*
        container.addEventListener("wheel", (event) => {
            event.preventDefault(); // prevent actual scroll

            const delta = event.deltaY > 0 ? 10 : -10;
            // DeltaY is positive for scroll down, negative for scroll up
            if (event.deltaY > 0) {
                console.log("Scroll down");
                markerAngle += delta;
            } else {
                console.log("Scroll up");
                markerAngle += delta;
            }

            //limiting values
            if (markerAngle < 90){
                markerAngle = 90;
            } else if (markerAngle > 270){
                markerAngle = 270;
            }

            console.log(markerAngle);
            positionMarker();
        
        }, { passive: false });*/
        // Initial positioning of circles
        positionCircles(startAngle, endAngle);
    }
});
//cant put in main if statement (DOMContentLoader)
function downloadFeed() {
    var canvas;
    for (let i = 1; i <= 9; i++) {
        canvas = document.getElementById(`cvs${i}`);
        downloadThis(canvas.toDataURL("image/png"), `post${i}.png`);
    }
    const urlParam = new URLSearchParams(window.location.search).get("feed");
    if (urlParam) {
        localStorage.setItem("feed-number", urlParam);
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
    const logo = new Image();
    logo.src = localStorage.getItem("logoImage") || "";
    for (let i = 1; i <= 9; i++) {
        var tile = document.getElementById(i.toString());
        if (first) {
            tile.src = `../assets/social-media-${feedNum}/${i}.png`;
        }
        render(feedNum, i.toString(), `cvs${i}`, tile.id, logo);
    }
}
function render(feedNum_1) {
    return __awaiter(this, arguments, void 0, function* (feedNum, postNum = "1", canvasID = "imgCanvas", imgID = "postImg", logo) {
        const canvas = document.getElementById(canvasID);
        const ctx = canvas.getContext("2d");
        const img = document.getElementById(imgID);
        var logoCoords = [0, 0];
        //console.log(feedNum, postNum, canvasID, imgID);
        const hueSlider = document.getElementById("hue");
        const satSlider = document.getElementById("saturation");
        const captionInput = document.getElementById("textbox");
        const hue = parseInt(hueSlider.value);
        const saturate = parseInt(satSlider.value);
        const caption = captionInput.value;
        var loaded = false;
        console.log("waiting");
        yield new Promise((resolve) => {
            if (img.complete) {
                console.log("complete");
                loaded = true;
                resolve();
            }
            else {
                img.onload = () => {
                    console.log("jsload");
                    loaded = true;
                    resolve();
                };
            }
        });
        if (loaded) {
            console.log("loaded");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (feedNum == 1) {
                ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%)`;
                filter[0] = hue.toString();
                filter[1] = saturate.toString();
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            localStorage.setItem(`filter1`, JSON.stringify(filter));
            if (logo.complete) {
                logoCoords = getLogoPos(postNum, feedNum, canvas.height, canvas.width);
                ctx.drawImage(logo, logoCoords[0], logoCoords[1], 200, 200);
            }
            if (caption && feedNum == 1) {
                ctx.font = `200px helvetica-roman`;
                ctx.fillStyle = "white";
                ctx.fillText(caption, 200, canvas.height - 30);
                console.log(caption, "caption");
            }
            console.log("rendered");
        }
    });
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
        case 3:
            if (postNum == "1" || postNum == "2" || postNum == "3" || postNum == "8") {
                logoPos = [0, 0];
            }
            else if (postNum == "7") {
                logoPos = [0, height - 275];
            }
            else {
                logoPos = [width - 275, 0];
            }
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
        mainSection.classList.add("animate-swipe-left");
    }
    setTimeout(() => {
        window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
    }, 700);
}
