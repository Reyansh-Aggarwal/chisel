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
let primaryColor = "#ff0000", secondaryColor = "#ff0000", nameBrand = "basic", isFilled = [false, false, false, false], storedProg = localStorage.getItem("progress"), isDone = [false, false]; //[brandmats,streetbanner]
if (storedProg) {
    isDone = JSON.parse(storedProg);
}
var filter;
const fxCanvas = fx.canvas();
let texture;
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu");
    const dropdownMenu = document.getElementById("dropdownMenu");
    menuButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
    });
    //close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!menuButton.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.classList.add("hidden");
        }
    });
    if (document.body.getAttribute('id') == "setupPage") {
        //need always
        const nameValue = localStorage.getItem("nameBrand");
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
        const imgInput = document.getElementById("imageInput");
        //fill stored values
        if (nameValue) {
            nameBrand = nameValue;
            nameInput.value = nameValue;
            makeGradient(submitButton, true);
            isFilled[0] = true;
        }
        if (logoImageValue) {
            previewImage(logoImageValue);
            isFilled[3] = true;
        }
        //===================================================================
        form.addEventListener('submit', (event) => {
            if (isFilled[0]) {
                event.preventDefault();
                const formData = new FormData(form);
                //get form data
                nameBrand = formData.get("name") || nameBrand;
                const logoImage = imgPreview.src;
                //image handling
                if (logoImage) {
                    localStorage.setItem("logoImage", logoImage);
                }
                else {
                    localStorage.setItem("logoImage", "");
                }
                //handling window changes seperately
                if (imgPreview.src) {
                    window.location.href = "../social-media/intro.html";
                }
                // Store the values in localStorage
                const cleaned = nameBrand.replace(/\bopticals?\b/gi, "");
                localStorage.setItem("nameBrand", cleaned);
            }
        });
        imgDiv.addEventListener('click', () => {
            if (!imgPreview.src) {
                imgInput.click();
            }
        });
        chImgButton.addEventListener("click", () => {
            imgInput.click();
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
        const leftArrow = document.getElementById("leftArrow");
        const rightArrow = document.getElementById("rightArrow");
        const params = new URLSearchParams(window.location.search);
        const postNum = params.get("post") || "1"; // Default fallback
        const feedNum = params.get("feed") || "2"; // Default fallback
        const img = document.getElementById("postImg");
        const canvas = document.getElementById("imgCanvas");
        const downloadButton = document.getElementById("download");
        const hueSlider = document.getElementById("hue");
        const saturSlider = document.getElementById("saturation");
        const resetButton = document.getElementById("reset");
        if (img && postNum && feedNum) {
            const parsedPostNum = parseInt(postNum, 10);
            const parsedFeedNum = parseInt(feedNum, 10);
            if (!isNaN(parsedPostNum) && !isNaN(parsedFeedNum)) {
                img.src = `../assets/social-media-${parsedFeedNum}/download/${parsedPostNum}.png`;
            }
        }
        if (parseInt(postNum) == 1) {
            leftArrow.classList.add("hidden");
        }
        else if (parseInt(postNum) == 9) {
            rightArrow.classList.add("hidden");
        }
        const logo = new Image();
        logo.src = localStorage.getItem("logoImage") || "";
        hueSlider.oninput = saturSlider.oninput = img.onload = () => { render(parseInt(feedNum), postNum, canvas.id, img.id, true); };
        downloadButton.onclick = () => { downloadThis(canvas.toDataURL("image/png"), `post${postNum}.png`); };
        resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => {
            hueSlider.value = "180";
            saturSlider.value = "100";
            render(parseInt(feedNum), postNum, canvas.id, img.id, true);
        });
    }
    if (document.body.getAttribute('id') == "feeds" || document.body.getAttribute("id") == "postPage") {
        const hueSlider = document.getElementById("hue");
        const saturSlider = document.getElementById("saturation");
        const leftArrow = document.getElementById("leftArrow");
        const rightArrow = document.getElementById("rightArrow");
        const trackerDiv = document.getElementById("trackers");
        const resetButton = document.getElementById("reset");
        const settingDiv = document.getElementById("colorSettings");
        const downloadButton = document.getElementById("download");
        const hNextButton = document.getElementById("headNext");
        const urlParam = new URLSearchParams(window.location.search).get("feed");
        filter = ["360", "123"];
        var feedNum = 1;
        let storedFilter;
        //getting feed number
        if (urlParam) {
            feedNum = parseInt(urlParam);
        }
        else {
            window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
        }
        if (document.body.getAttribute('id') == "feeds") {
            if (feedNum == 1) {
                leftArrow.classList.add("hidden");
            }
            else if (feedNum == 3) {
                rightArrow.classList.add("hidden");
            }
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
            storedFilter = localStorage.getItem(`filter`);
            if (storedFilter) {
                filter = JSON.parse(storedFilter);
            }
            if (feedNum == 2 || feedNum == 3) {
                settingDiv.classList.add("hidden");
                resetButton === null || resetButton === void 0 ? void 0 : resetButton.classList.add("hidden");
            }
        }
        if (storedFilter) {
            filter = JSON.parse(storedFilter);
            //setting apt slider values
            hueSlider.value = filter[0];
            saturSlider.value = filter[1];
        }
        //loading feed at first
        if (document.body.getAttribute("id") == "feeds") {
            loadFeed(feedNum, true);
        }
        //Event listeners
        hueSlider.addEventListener("input", () => {
            filter[0] = hueSlider.value;
            //applyFilters(tilesDiv, filter);
            if (document.body.id == "feeds") {
                if (parseInt(filter[0]) % 2 == 0) {
                    //add buffer
                    loadFeed(feedNum);
                }
            }
        });
        saturSlider.addEventListener("input", () => {
            filter[1] = saturSlider.value;
            //applyFilters(tilesDiv, filter);
            if (document.body.id == "feeds") {
                if (parseInt(filter[0]) % 2 == 0) {
                    //add buffer
                    loadFeed(feedNum);
                }
            }
        });
        resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => {
            hueSlider.value = "180";
            saturSlider.value = "100";
            if (document.body.id == "feeds") {
                loadFeed(feedNum);
            }
        });
        downloadButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
            if (document.body.id == "feeds") {
                hNextButton.classList.remove('hidden');
                setTimeout(() => {
                    hNextButton.classList.remove('translate-y-[-100%]');
                }, 25);
                //hNextButton.classList.add('translate-y-0');
                yield downloadFeed();
            }
        });
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
            radius = 300;
            startAngle -= 90;
            endAngle -= 90;
            xOffset = 25;
        }
        let feedNum = localStorage.getItem("feed-num") || "1";
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
                    yield new Promise((resolve) => {
                        img.onload = () => {
                            renderMaterial();
                        };
                    });
                }
            });
        }
        function renderMaterial() {
            return __awaiter(this, void 0, void 0, function* () {
                const ctx = canvas.getContext("2d");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                //drawing logo
                let textColor = "black";
                if (feedNum == "1") {
                    textColor = "#3b82f6";
                }
                else if (feedNum == "3") {
                    textColor = "white";
                }
                else if (feedNum == "2") {
                    if (activeCircleNum == 2) {
                        textColor = "white";
                    }
                    else {
                        textColor = "#834e00";
                    }
                }
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
            });
        }
        ;
        function drawLogoText(txtColor) {
            return __awaiter(this, void 0, void 0, function* () {
                const logo = new Image();
                logo.src = localStorage.getItem("logoImage") || "";
                const caption = localStorage.getItem("nameBrand") || "hello world";
                const logoTextCtx = logoTextCanvas.getContext("2d");
                const logoWidth = 1000;
                const logoHeight = 1000;
                const padding = 80;
                var fontSize = 700;
                var captCoords = [padding + logoWidth, padding + logoHeight / 2];
                let mainFont = "helvetica-bold";
                if (feedNum == "2") {
                    mainFont = "phagspa";
                }
                else if (feedNum == "3") {
                    mainFont = "Times New Roman";
                }
                logoTextCtx.font = `${fontSize}px ${mainFont}, Arial, sans-serif`;
                for (var i = fontSize; i > 0; i--) {
                    logoTextCtx.font = `${i}px helvetica-bold`;
                    if (!(logoTextCtx.measureText(caption.toUpperCase()).width > 2000)) {
                        fontSize = i;
                        captCoords[1] += (fontSize - 120) / 2;
                        break;
                    }
                }
                captCoords = [2 * padding + logoWidth, padding + logoHeight / 2 + 30];
                const textWidth = caption ? logoTextCtx.measureText(caption).width : 0;
                logoTextCanvas.width = logoWidth + padding + textWidth + padding * 2;
                logoTextCanvas.height = logoHeight + padding * 2;
                if (logo) {
                    yield new Promise((resolve) => {
                        logo.onload = () => {
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
                            resolve(); // ✅ now we say this part is done!
                        };
                        logo.onerror = () => {
                            console.error("Failed to load logo image.");
                            resolve(); // or reject, depending on your preference
                        };
                    });
                }
                //eee
                // Draw text
                logoTextCtx.font = `${fontSize}px ${mainFont}, Arial, sans-serif`;
                logoTextCtx.fillStyle = txtColor;
                logoTextCtx.textBaseline = "middle";
                logoTextCtx.textAlign = "left";
                logoTextCtx.fillText(caption, captCoords[0], captCoords[1]);
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
                if (isDone[1]) {
                    window.location.href = "../pages/end.html";
                    isDone[1] = false;
                }
                else {
                    isDone[0] = true;
                }
                localStorage.setItem("progress", JSON.stringify(isDone));
            });
        }
        dwnldButton.onclick = () => {
            downloadMaterials();
        };
        //event listeners
        circles.forEach((circle, index) => {
            circle.onclick = () => {
                positionMarker(index);
            };
        });
        // Initial positioning of circles
        positionCircles(startAngle, endAngle);
    }
    if (document.body.getAttribute('id') == "street-banner") {
        const leftArrow = document.getElementById("leftArrow");
        const rightArrow = document.getElementById("rightArrow");
        const img = document.getElementById("bannerImg");
        const feedNum = localStorage.getItem("feed-num") || "1";
        const canvas = document.getElementById("imgCanvas");
        const popUp = document.getElementById("donePop");
        const dwnldButton = document.getElementById("download");
        const mainSection = document.getElementById("mainSec");
        let storedFilter = localStorage.getItem("filter");
        const urlParam = new URLSearchParams(window.location.search).get("num");
        var bannerNum = 1;
        if (urlParam) {
            bannerNum = parseInt(urlParam);
        }
        else {
            window.location.href = `../pages/street-banner.html?num=${bannerNum}`;
        }
        if (bannerNum == 2) {
            mainSection.classList.remove("md:flex-row");
            mainSection.classList.add("md:flex-col");
        }
        if (bannerNum == 1) {
            leftArrow.classList.add("hidden");
        }
        else if (bannerNum == 2) {
            rightArrow.classList.add("hidden");
        }
        const trackerDiv = document.getElementById("trackers");
        const allTrackers = trackerDiv.querySelectorAll('span');
        var trackerNum = 1;
        allTrackers.forEach((tracker) => {
            tracker.classList.add("opacity-50");
            tracker.classList.remove("text-blue-500");
            trackerNum++;
        });
        allTrackers[bannerNum - 1].classList.add("text-blue-500");
        allTrackers[bannerNum - 1].classList.remove("opacity-50");
        let filter;
        if (storedFilter) {
            filter = JSON.parse(storedFilter);
        }
        else {
            filter = ["360", "200"];
        }
        if (img) {
            img.src = `../assets/banner/${feedNum}-${bannerNum}.png` || "";
        }
        function renderBanner() {
            return __awaiter(this, void 0, void 0, function* () {
                const ctx = canvas.getContext('2d');
                var caption = localStorage.getItem("nameBrand");
                var hue = filter[0], saturate = filter[1];
                var fontSize;
                var captCoords;
                var maxWidth = 1850;
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (feedNum == "1") {
                    ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%)`;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                localStorage.setItem(`filter`, JSON.stringify(filter));
                if (caption) {
                    ctx.fillStyle = "white";
                    if (feedNum == "2") {
                        ctx.fillStyle = "#4b200f";
                    }
                    captCoords = [canvas.width / 2, 2216];
                    fontSize = 220;
                    if (bannerNum == 2) {
                        maxWidth = 1975;
                        fontSize = 440;
                        captCoords = [canvas.width / 2 + 1200, canvas.height / 2 + 600];
                    }
                    ctx.font = `${fontSize}px helvetica-bold`;
                    ctx.textAlign = "center";
                    ctx.fillText(caption.toUpperCase(), captCoords[0], captCoords[1], maxWidth);
                }
            });
        }
        dwnldButton.onclick = () => {
            localStorage.setItem("banner-num", bannerNum.toString());
            popUp.classList.remove('hidden');
            setTimeout(() => {
                popUp.classList.remove('translate-y-[-100%]');
            }, 25);
            downloadThis(canvas.toDataURL("image/png"), "banner.png");
            setTimeout(() => {
                popUp.classList.add('translate-y-[-100%]');
                setTimeout(() => {
                    popUp.classList.add('hidden');
                }, 400);
            }, 3000);
            if (isDone[0]) {
                window.location.href = "../pages/end.html";
                isDone[0] = false;
            }
            else {
                isDone[1] = true;
                localStorage.setItem("progress", JSON.stringify(isDone));
            }
        };
        if (img.complete) {
            renderBanner();
        }
        else {
            img.onload = renderBanner;
        }
    }
});
function handleArrow(dir) {
    const bodyID = document.body.getAttribute("id");
    if (bodyID === "feeds") {
        const feedParam = new URLSearchParams(window.location.search).get("feed");
        let feedNum = feedParam ? parseInt(feedParam, 10) : 1;
        if (dir === "right" && feedNum < 3) {
            window.location.href = `../social-media/feeds.html?feed=${feedNum + 1}`;
        }
        else if (dir === "left" && feedNum > 1) {
            window.location.href = `../social-media/feeds.html?feed=${feedNum - 1}`;
        }
    }
    else if (bodyID === "postPage") {
        const feedParam = new URLSearchParams(window.location.search).get("feed");
        let feedNum = feedParam ? parseInt(feedParam, 10) : 1;
        const postParam = new URLSearchParams(window.location.search).get("post");
        let postNum = postParam ? parseInt(postParam, 10) : 1;
        if (dir === "right" && postNum < 9) {
            window.location.href = `../social-media/postPage.html?feed=${feedNum}&post=${postNum + 1}`;
        }
        else if (dir === "left" && postNum > 1) {
            window.location.href = `../social-media/postPage.html?feed=${feedNum}&post=${postNum - 1}`;
        }
    }
    else if (bodyID === "street-banner") {
        if (dir === "right") {
            window.location.href = `../pages/street-banner.html?num=2`;
        }
        else if (dir === "left") {
            window.location.href = `../pages/street-banner.html?num=1`;
        }
    }
}
function downloadFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParam = new URLSearchParams(window.location.search).get("feed");
        var feedNum = 1;
        if (urlParam) {
            localStorage.setItem("feed-num", urlParam); //updating stored feed num
            feedNum = parseInt(urlParam);
        }
        const zip = new JSZip();
        var canvas, canvasBlob;
        for (let i = 1; i <= 9; i++) {
            yield render(feedNum, i.toString(), `cvs${i}`, "", true);
            canvas = document.getElementById(`cvs${i}`);
            canvasBlob = yield new Promise(resolve => canvas.toBlob(resolve, "image/png"));
            zip.file(`post-${i}.png`, canvasBlob);
        }
        //Downloading zip
        const zipBlob = yield zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "socialMediaFeed.zip");
    });
}
function downloadThis(dataURL, filename) {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
}
function previewImage(logoUrl) {
    const prevDiv = document.getElementById("imagePreviewDiv");
    const imgPreview = document.getElementById("imagePreview");
    const imgTemplate = document.getElementById("imageTemplate");
    const imgDiv = document.getElementById("imageDiv");
    const changeOverlay = document.getElementById("changeOverlay");
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
function loadFeed(feedNum_1) {
    return __awaiter(this, arguments, void 0, function* (feedNum, first = false) {
        for (let i = 1; i <= 9; i++) {
            var tile = document.getElementById(i.toString());
            if (first) {
                tile.src = `../assets/social-media-${feedNum}/display/${i}.png`;
                yield new Promise((resolve) => {
                    tile.onload = () => {
                        render(feedNum, i.toString(), `cvs${i}`, tile.id);
                        resolve();
                    };
                });
            }
            else {
                render(feedNum, i.toString(), `cvs${i}`, tile.id);
            }
        }
    });
}
function render(feedNum_1) {
    return __awaiter(this, arguments, void 0, function* (feedNum, postNum = "1", canvasID = "imgCanvas", imgID = "postImg", newImg = false) {
        const canvas = document.getElementById(canvasID);
        const ctx = canvas.getContext("2d");
        let img;
        if (newImg) {
            img = new Image();
            img.src = `../assets/social-media-${feedNum}/download/${postNum}.png`;
            img.crossOrigin = "anonymous";
        }
        else {
            img = document.getElementById(imgID);
        }
        const logo = new Image();
        logo.src = localStorage.getItem("logoImage") || "";
        const hueSlider = document.getElementById("hue");
        const satSlider = document.getElementById("saturation");
        const hue = (parseInt(hueSlider.value) - 180) / 180; // -1 to 1
        const saturate = (parseInt(satSlider.value) - 100) / 100; // -1 to 1
        const caption = localStorage.getItem("nameBrand") || "";
        let fontSize = 150;
        let maxtextWidth = 800;
        let logoSize;
        let logoCoords = [0, 0];
        let captCoords = [0, 0];
        yield new Promise((resolve) => {
            if (img.complete)
                resolve();
            else
                img.onload = () => resolve();
        });
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (feedNum === 1) {
            // Apply glfx filter
            console.log("saturation", saturate);
            const gl = fxCanvas.getContext("webgl") || fxCanvas.getContext("experimental-webgl");
            gl === null || gl === void 0 ? void 0 : gl.getExtension("WEBGL_color_buffer_float");
            texture = fxCanvas.texture(img);
            fxCanvas.draw(texture).hueSaturation(hue, saturate).update();
            texture.destroy();
            // Copy filtered result to visible canvas
            ctx.drawImage(fxCanvas, 0, 0, canvas.width, canvas.height);
            filter[0] = ((hue * 180) + 180).toString();
            filter[1] = ((saturate * 100) + 100).toString();
            localStorage.setItem(`filter`, JSON.stringify(filter));
        }
        else {
            // No filter: draw original
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        yield new Promise((resolve) => {
            if (logo.complete)
                resolve();
            else
                logo.onload = () => resolve();
        });
        if (logo.src && logo.complete) {
            logoSize = newImg ? 200 : 100;
            logoCoords = getLogoPos(postNum, feedNum, canvas.height, canvas.width, newImg);
            ctx.drawImage(logo, logoCoords[0], logoCoords[1], logoSize, logoSize);
        }
        if (caption && feedNum === 1 && (postNum === "6" || postNum === "8")) {
            if (newImg) {
                if (postNum === "6") {
                    fontSize = 60;
                    captCoords = [323, (canvas.height / 2 + 25)];
                    maxtextWidth = 176;
                    ctx.fillStyle = "white";
                }
                else {
                    fontSize = 145;
                    captCoords = [850, 830];
                    maxtextWidth = 423.9;
                    ctx.fillStyle = "#51afff";
                }
            }
            else {
                if (postNum === "6") {
                    fontSize = 22;
                    captCoords = [115, (canvas.height / 2 + 10)];
                    maxtextWidth = 176;
                    ctx.fillStyle = "white";
                }
                else {
                    fontSize = 53;
                    captCoords = [302, 299];
                    maxtextWidth = 156;
                    ctx.fillStyle = "#51afff";
                }
            }
            ctx.font = `${fontSize}px helvetica-bold`;
            ctx.fillText(caption.toUpperCase(), captCoords[0], captCoords[1], maxtextWidth);
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
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        for (let i = 3; i < imageData.length; i += 4) {
                            if (imageData[i] === 0) { // Alpha channel is 0 (fully transparent)
                                transparentPixelFound = true;
                                break;
                            }
                            else {
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
        }
        else if (input.id == "primaryColor" || input.id == "secondaryColor") {
            isFilled[1] = true;
        }
        else if (input.id == "imageInput") {
            isFilled[3] = true;
        }
        makeGradient(submitButton, true);
    }
    else if (!data) {
        if (input.id == "name") {
            isFilled[0] = false;
            makeGradient(submitButton, false);
        } //others not needed because color cant be empty?
    }
}
function getLogoPos(postNum, feedNum, height, width, newImg = false) {
    var logoPos = [0, 0];
    if (newImg) {
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
    }
    else {
        switch (feedNum) {
            case 1:
                if (postNum == "1" || postNum == "3" || postNum == "4" || postNum == "5" || postNum == "8") {
                    logoPos = [0, 0];
                }
                else if (postNum == "2" || postNum == "7" || postNum == "9") {
                    logoPos = [0, height - 110];
                }
                break;
            case 2:
                if (postNum == "1" || postNum == "4") {
                    logoPos = [0, height - 110];
                }
                else if (postNum == "6" || postNum == "7" || postNum == "9") {
                    logoPos = [width - 110, 0];
                }
                else if (postNum == "5" || postNum == "8") {
                    logoPos = [width - 110, height - 110];
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
                    logoPos = [0, height - 110];
                }
                else {
                    logoPos = [width - 110, 0];
                }
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
}
function changeFeed(feedNum) {
    setTimeout(() => {
        window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
    }, 10);
}
function changeBanner(num) {
    const mainSection = document.getElementById("mainSec");
    const storedNum = localStorage.getItem("banner-num");
    var bannerNum = 1;
    if (storedNum) {
        bannerNum = parseInt(storedNum);
    }
    if (num < bannerNum) {
        mainSection.classList.add("animate-swipe-right");
    }
    else if (num > bannerNum) {
        mainSection.classList.add("animate-swipe-left");
    }
    bannerNum = num;
    setTimeout(() => {
        window.location.href = `../pages/street-banner.html?num=${bannerNum}`;
    }, 300);
}
