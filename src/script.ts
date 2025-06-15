
let primaryColor = "#ff0000", 
    secondaryColor = "#ff0000", 
    nameBrand = "basic",
    isFilled = [false,false,false,false];
var filter:string[];
    // 0- name; 1-primary color; 2- secondary color; 3- image;
declare var JSZip: any;
declare function saveAs(blob: Blob, filename: string): void;

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu") as HTMLButtonElement;
    const dropdownMenu = document.getElementById("dropdownMenu") as HTMLDivElement;

    menuButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
    });

        // Optional: close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;

        if (!menuButton.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.classList.add("hidden");
        }
    });
    
    if (document.body.getAttribute('id') == "setupPage") {

        //need always
        const nameValue = localStorage.getItem("nameBrand");
        const logoImageValue = localStorage.getItem("logoImage");

        const imgDiv = document.getElementById("imageDiv") as HTMLDivElement;
        const form = document.getElementById("details") as HTMLFormElement;
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
        const chImgButton = document.getElementById("changeImage") as HTMLButtonElement;
        const remImgButton = document.getElementById("remImage") as HTMLButtonElement;
        const prevDiv = document.getElementById("imagePreviewDiv") as HTMLDivElement;
        const changeOverlay = document.getElementById("changeOverlay") as HTMLDivElement;
        const imgTemplate = document.getElementById("imageTemplate") as HTMLDivElement;
        const imgPreview = document.getElementById("imagePreview") as HTMLImageElement;

        //inputs
        const nameInput = document.getElementById("name") as HTMLInputElement;
        const imgInput = document.getElementById("imageInput") as HTMLInputElement;

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

        form.addEventListener('submit', (event: Event) => {
    
            if (isFilled[0] && isFilled[3]) {
                event.preventDefault(); 

                //console.log("Form submission detected");
                const formData = new FormData(form);
    
                //get form data
                nameBrand = formData.get("name") as string || nameBrand;
                const logoImage = imgPreview.src;

                //image handling
                if(logoImage){
                    localStorage.setItem("logoImage", logoImage);
                    console.log("Uploaded successfully");
                }  
                
                //handling window changes seperately
                if(imgPreview.src){
                    window.location.href = "../social-media/intro.html";
                    console.log('yes image');
                }

                // Store the values in localStorage
                localStorage.setItem("nameBrand", nameBrand);
                
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
    if (document.body.getAttribute('id') == "postPage"){

        const params = new URLSearchParams(window.location.search);
        const postNum = params.get("post") || "1"; // Default fallback
        const feedNum = params.get("feed") || "1"; // Default fallback
        const img = document.getElementById("postImg") as HTMLImageElement;
        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
        const downloadButton = document.getElementById("download") as HTMLButtonElement;
        const hueSlider = document.getElementById("hue") as HTMLInputElement;
        const saturSlider = document.getElementById("saturation") as HTMLInputElement;

        if (img && postNum && feedNum) {
            const parsedPostNum = parseInt(postNum, 10);
            const parsedFeedNum = parseInt(feedNum, 10);

            if (!isNaN(parsedPostNum) && !isNaN(parsedFeedNum)) {
                img.src = `../assets/social-media-${parsedFeedNum}/${parsedPostNum}.png`;
            }
        }
        const textbox = document.getElementById("textbox") as HTMLInputElement;
        const logo = new Image();
        logo.src = localStorage.getItem("logoImage") || "";
        textbox.oninput = hueSlider.oninput = saturSlider.oninput = img.onload = () => {render(parseInt(feedNum),postNum, canvas.id, img.id, logo);};
        downloadButton.onclick = () => {downloadThis(canvas.toDataURL("image/png"),`post${postNum}.png`)};
    }
    if (document.body.getAttribute('id') == "feeds" || document.body.getAttribute("id") == "postPage"){
        
        const hueSlider = document.getElementById("hue") as HTMLInputElement;
        const saturSlider = document.getElementById("saturation") as HTMLInputElement;
        const textbox = document.getElementById("textbox") as HTMLInputElement;
        const trackerDiv  = document.getElementById("trackers") as HTMLDivElement;
        const resetButton = document.getElementById("reset");
        const settingDiv = document.getElementById("colorSettings") as HTMLDivElement;
        const downloadButton = document.getElementById("download") as HTMLButtonElement;
        const hNextButton = document.getElementById("headNext") as HTMLButtonElement;
        const urlParam = new URLSearchParams (window.location.search).get("feed");
        filter = ["360","123"];
        var feedNum = 1;
        let storedFilter, startX:number, endX:number;
        //getting feed number
        if (urlParam){
            feedNum = parseInt(urlParam);
        } else {
            window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
        }

        if (document.body.getAttribute('id') == "feeds"){

            //setting trackers
            const allTrackers = trackerDiv.querySelectorAll<HTMLImageElement>('span');
            var trackerNum : number = 1;
            allTrackers.forEach((tracker) => {
                tracker.classList.add("opacity-50");
                tracker.classList.remove("text-blue-500");
                trackerNum++;
            });
            allTrackers[feedNum-1].classList.add("text-blue-500");
            allTrackers[feedNum-1].classList.remove("opacity-50");
    
        }
        //setup
        if (feedNum){
            storedFilter = localStorage.getItem(`filter`);
            if (storedFilter){
                filter = JSON.parse(storedFilter);
            }
            if (feedNum == 2 || feedNum == 3){
                settingDiv.classList.add("hidden");
            }
        }
        if (storedFilter){
            filter = JSON.parse(storedFilter);
            //setting apt slider values
            hueSlider.value = filter[0];
            saturSlider.value = filter[1];
        } 
        textbox.value = localStorage.getItem("nameBrand") || "404";

        //loading feed at first
        loadFeed(feedNum, true);

        //Event listeners
        this.body.addEventListener("touchstart",(event) => {
            startX = event.changedTouches[0].screenX;
        } );
        this.body.addEventListener("touchend",(event) => {
            endX = event.changedTouches[0].screenX;
            handleSwipe();
        } );
        hueSlider.addEventListener("input", () => {
            filter[0] = hueSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("hue:", filter[0]);
            if (document.body.id == "feeds"){
                console.log("loading");
                loadFeed(feedNum);
            }
        });      
        saturSlider.addEventListener("input", () => {
            filter[1] = saturSlider.value;
            //applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            if (document.body.id == "feeds"){
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        textbox.addEventListener("input", () => {
            //applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            if (document.body.id == "feeds"){
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        resetButton?.addEventListener("click", () => {
            hueSlider.value = "360";
            saturSlider.value = "200";
            if (document.body.id == "feeds"){
                console.log("loading");
                loadFeed(feedNum);
            }
        });
        downloadButton.onclick = async () => {
            if (document.body.id == "feeds"){
                hNextButton.classList.remove('hidden');
                setTimeout(()=> {
                    hNextButton.classList.remove('translate-y-[-100%]');
                }, 25);
                
                //hNextButton.classList.add('translate-y-0');
                await downloadFeed();
            }
            
        };

        function handleSwipe() {
            if(startX > endX && (startX - endX > 50)){
                //swiped left
                if (feedNum < 3){
                    changeFeed(feedNum + 1);
                }
            } else if (startX < endX && (endX - startX > 50)) {
                //swipe right
                if (feedNum > 1){
                    changeFeed(feedNum - 1);
                }
            }
        }
    }
    if (document.body.getAttribute('id') == "branding"){
        const container = document.getElementById("scrollContainer") as HTMLDivElement;
        const circles = container.querySelectorAll<HTMLDivElement>('div');
        const markerCircle = document.getElementById("marker") as HTMLDivElement;
        let circlesPos: [number, number][] = [];
        let cAngle = [0,0,0,0,0];
        const circleCount = 5; // Dynamically get the number of circles
        let radius = 150; // Adjusted radius for better visibility
        let markerAngle = 180;
        let xOffset = 0;
        let activeCircleNum = 2;
        var startAngle = 180;
        var endAngle = 360;
        if (window.matchMedia("(min-width: 500px)").matches){
            radius=200;
        }
        if (window.matchMedia("(min-width: 800px)").matches){
            console.log("matched");
            radius = 300;
            startAngle -= 90;
            endAngle -= 90;
            xOffset = 25;
        }

        let feedNum = localStorage.getItem("feed-num") || "1";
        console.log("hehehe", feedNum);
        const matNames = ["Carry Bag", "Case", "Business Card", "Cloth", "Cleaning Spray"];
        const matAlias = ["bag", "case", "bns-card", "cloth", "spray"];
        const downPath = ["bns-card/bns-card-front.png", "bns-card/bns-card-back.png", "texture.png"];
        const matLabel = document.getElementById("matLabel");
        const dwnldButton = document.getElementById("downloadButton") as HTMLButtonElement;
        const img = document.getElementById("matImg") as HTMLImageElement;
        const logoTextCanvas = document.createElement("canvas"); //need to be availabe for dwnld function
        const canvas = document.getElementById("matCanvas") as HTMLCanvasElement;
        function positionCircles(startAngle: number, endAngle: number): void {
            const angleStep = (endAngle - startAngle) / (circleCount - 1);

            circles.forEach((circle, index) => {
                const angle = startAngle + index * angleStep;
                const angleRad = angle * (Math.PI / 180); // Convert degrees to radians

                const x = Math.cos(angleRad) * radius - xOffset;
                const y = Math.sin(angleRad) * radius;
                circlesPos[index] = [x,y];
                cAngle[index] = angle;

                // Since we want the LEFT semicircle, mirror the X to negative
                circle.style.transform = `translate(${x}px, ${y}px)`;
                
            });
            //initial pos of marker as well
            positionMarker(2);
            console.log("main circle", activeCircleNum);
            //console.log(circlesPos); //debug
        }

        function positionMarker(cNum: number): void{
            const markerParent = markerCircle.parentElement!;
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

        async function changeMaterial(cNum = activeCircleNum){

            if (matLabel){
                matLabel.textContent = matNames[activeCircleNum];
                img.src = `../assets/branding-materials/${feedNum}/display/${matAlias[cNum]}.png`;
                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        renderMaterial();
                    };
                });
                
                

            }
        }

        async function renderMaterial(){

            const ctx = canvas.getContext("2d")!;
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            console.log(canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            //drawing logo
            let textColor = "black";
            if (feedNum == "1"){
                textColor = "#3b82f6";
            } else if (feedNum == "3"){
                textColor = "white";
            } else if (feedNum == "2"){
                if (activeCircleNum == 2){
                    textColor = "white";
                } else {
                    textColor = "#834e00";
                }
            }
            console.log("feed ", feedNum);
            await drawLogoText(textColor);
            var logoCoords : [number,number][] = [[1000,1600], [350,1025], [1000,1320], [350,2300], [1200,1625]];

            let scale = 0.3;
            if (activeCircleNum == 4){
                scale = 0.2;
            }
            const ltfinalWidth = logoTextCanvas.width * scale;
            const ltfinalHeight = logoTextCanvas.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(logoTextCanvas, logoCoords[activeCircleNum][0], logoCoords[activeCircleNum][1], ltfinalWidth, ltfinalHeight);
            console.log("rendered");  
        };
            
        async function drawLogoText(txtColor: string) {
            const logo = new Image();
            logo.src = localStorage.getItem("logoImage") || "";
            await new Promise<void>((resolve) => {
            logo.onload = () => {
                const caption = localStorage.getItem("nameBrand") || "hello world";
                const logoTextCtx = logoTextCanvas.getContext("2d")!;
                const logoWidth = 1000;
                const logoHeight = 1000;
                const padding = 80;
                var fontSize = 700;
                var captCoords = [padding + logoWidth, padding+ logoHeight / 2];

                let mainFont = "helvetica-bold";
                if (feedNum == "2") {
                    mainFont = "phagspa";
                } else if (feedNum == "3") {
                    mainFont = "Times New Roman";
                }
                logoTextCtx.font = `${fontSize}px ${mainFont}, Arial, sans-serif`;
                for (var i = fontSize; i > 0; i--){
                        console.log("done", logoTextCtx.measureText(caption.toUpperCase()));
                        logoTextCtx.font = `${i}px helvetica-bold`;
                        if (!(logoTextCtx.measureText(caption.toUpperCase()).width > 2000)){
                            fontSize = i;
                            captCoords[1] += (fontSize-120)/2;
                            break;
                    }
                }
                captCoords = [2*padding + logoWidth , padding+ logoHeight / 2 +30];
                const textWidth = caption ? logoTextCtx.measureText(caption).width : 0;

                logoTextCanvas.width = logoWidth + padding + textWidth + padding * 2;
                logoTextCanvas.height = logoHeight + padding * 2;

                // Draw logo with color overlay
                const offCanvas = document.createElement("canvas");
                offCanvas.width = logoWidth;
                offCanvas.height = logoHeight;
                const offCtx = offCanvas.getContext("2d")!;
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
                logoTextCtx.fillText(caption, captCoords[0], captCoords[1]);

                console.log("Drawn");
                resolve(); // ✅ now we say this part is done!
                };

                logo.onerror = () => {
                    console.error("Failed to load logo image.");
                    resolve(); // or reject, depending on your preference
                };
            });
        }

        async function downloadMaterials(){
            const zip = new JSZip();
            var res, 
                blob,
                canvasBlob;
            //canvas files
            if (feedNum == "3"){
                await drawLogoText("#834e00");
                canvasBlob =await new Promise(resolve =>
                logoTextCanvas.toBlob(resolve, "image/png")
                );
                zip.file("logoText2.png", canvasBlob);
                await drawLogoText("#ffffff");
            } else {
                canvasBlob = await new Promise(resolve =>
                    logoTextCanvas.toBlob(resolve, "image/png")
                );
            }
            canvasBlob = await new Promise(resolve =>
                    logoTextCanvas.toBlob(resolve, "image/png")
                );
            zip.file("logoText.png", canvasBlob);

            //getting texture and bns-card files
            for (let i = 0; i < 3; i++){
                res = await fetch(`../assets/branding-materials/${feedNum}/download/${downPath[i]}`);
                blob = await res.blob();
                zip.file(downPath[i], blob);
            }

            //Downloading zip
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "branding-materials.zip");
        }

        dwnldButton.onclick = () => {
            downloadMaterials();
            
        };

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
        positionCircles(startAngle,endAngle);


    }
    if (document.body.getAttribute('id') == "street-banner"){
        
        const img = document.getElementById("bannerImg") as HTMLImageElement;
        const feedNum = localStorage.getItem("feed-num") || "1";
        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
        const popUp = document.getElementById("donePop") as HTMLDivElement;
        const dwnldButton = document.getElementById("download") as HTMLButtonElement;
        const mainSection = document.getElementById("mainSec") as HTMLElement;
        let storedFilter = localStorage.getItem("filter");
        const urlParam = new URLSearchParams (window.location.search).get("num");

        var bannerNum = 1;
        console.log("helo", localStorage.getItem("feed-num"));
        if (urlParam){
            bannerNum = parseInt(urlParam);
        } else {
            window.location.href = `../pages/street-banner.html?num=${bannerNum}`;
        }

        if (bannerNum == 2){
            mainSection.classList.remove("md:flex-row");
            mainSection.classList.add("md:flex-col");
        }
        const trackerDiv  = document.getElementById("trackers") as HTMLDivElement;
        const allTrackers = trackerDiv.querySelectorAll<HTMLImageElement>('span');
        var trackerNum : number = 1;
        allTrackers.forEach((tracker) => {
            tracker.classList.add("opacity-50");
            tracker.classList.remove("text-blue-500");
            trackerNum++;
        });
        allTrackers[bannerNum-1].classList.add("text-blue-500");
        allTrackers[bannerNum-1].classList.remove("opacity-50");

        let filter:string[];
        if (storedFilter){
            filter = JSON.parse(storedFilter);
            console.log("filter = ", filter);
        } else {
            filter = ["360", "200"];
            console.log("hello world");
        }

        if (img){
            img.src = `../assets/banner/${feedNum}-${bannerNum}.png` || "";
        }
        
        
        
        async function renderBanner(){
            const ctx = canvas.getContext('2d')!;
            var caption = localStorage.getItem("nameBrand");
            console.log(filter);
            var hue = filter[0], saturate = filter[1];
            var fontSize;
            var captCoords:number[];
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
                if (feedNum == "2"){
                    ctx.fillStyle = "#4b200f";
                }
                captCoords = [canvas.width/2,2216];
                fontSize = 220;
                if (bannerNum == 2){
                    fontSize = 440;
                    captCoords = [canvas.width/2 + 1200 ,canvas.height/2 + 600];
                }
                
                ctx.font = `${fontSize}px helvetica-bold`;
                ctx.textAlign = "center";
                ctx.fillText(caption.toUpperCase(), captCoords[0], captCoords[1]);
                
                console.log(caption, "caption");
            }
        }
        function handleSwipe() {
            if(startX > endX && (startX - endX > 50)){
                //swiped left
                if (bannerNum < 2){
                    changeBanner(bannerNum + 1);
                }
            } else if (startX < endX && (endX - startX > 50)) {
                //swipe right
                if (bannerNum > 1){
                    changeBanner(bannerNum - 1);
                }
                
            }
        }
        
        dwnldButton.onclick = () => {
            localStorage.setItem("banner-num", bannerNum.toString());
            popUp.classList.remove('hidden');
            setTimeout(()=> {
                popUp.classList.remove('translate-y-[-100%]');
            }, 25);
            
            downloadThis(canvas.toDataURL("image/png"), "banner.png");
            setTimeout(()=> {
                popUp.classList.add('translate-y-[-100%]');
                setTimeout(()=> {
                    popUp.classList.add('hidden');
                }, 400);
            }, 3000);
        };

        if (img.complete){
            renderBanner();
        }else{
            img.onload = renderBanner;
        }

        var startX = 0;
        var endX = 0;
        this.body.addEventListener("touchstart",(event) => {
            startX = event.changedTouches[0].screenX;
        } );
        this.body.addEventListener("touchend",(event) => {
            endX = event.changedTouches[0].screenX;
            handleSwipe();
        } );
        
    }
});

async function downloadFeed(){
    const zip = new JSZip();
    var canvas: HTMLCanvasElement,
        canvasBlob;
    for (let i = 1; i<= 9; i++){
        canvas = document.getElementById(`cvs${i}`) as HTMLCanvasElement;
        canvasBlob = await new Promise(resolve =>
                canvas.toBlob(resolve, "image/png")
        );
        zip.file(`post-${i}.png`, canvasBlob);
        //downloadThis(canvas.toDataURL("image/png"),`post${i}.png`)
    }
    //Downloading zip
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "socialMediaFeed.zip");
        
    const urlParam = new URLSearchParams (window.location.search).get("feed");
    if (urlParam){
        localStorage.setItem("feed-num", urlParam);
    }

}

function downloadThis(dataURL : any, filename : string){
    
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
}

function previewImage(logoUrl : string) {           

    console.log("image previewed");
    const prevDiv = document.getElementById("imagePreviewDiv") as HTMLDivElement;
    const imgPreview = document.getElementById("imagePreview") as HTMLImageElement;
    const imgTemplate = document.getElementById("imageTemplate") as HTMLDivElement;
    const imgDiv = document.getElementById("imageDiv") as HTMLDivElement;
    const changeOverlay = document.getElementById("changeOverlay") as HTMLDivElement;
    const imgInput = document.getElementById("imageInput") as HTMLInputElement;

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

async function loadFeed (feedNum:number, first =false){
    const logo = new Image();
    logo.src = localStorage.getItem("logoImage") || "";
    
    for (let i = 1; i <= 9; i++){
        var tile = document.getElementById(i.toString()) as HTMLImageElement;
        if (first){
            tile.src = `../assets/social-media-${feedNum}/${i}.png`;
        }
        await new Promise<void>((resolve) => {
            tile.onload = () => {
                render(feedNum, i.toString(), `cvs${i}`, tile.id, logo);
                resolve();
            };
        });
       
    }
}

async function render(feedNum:number, postNum = "1", canvasID = "imgCanvas", imgID = "postImg", logo: HTMLImageElement) {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const img = document.getElementById(imgID) as HTMLImageElement;
    var logoCoords = [0,0];
    var captCoords = [0,0];
    //console.log(feedNum, postNum, canvasID, imgID);
    const hueSlider = document.getElementById("hue") as HTMLInputElement;
    const satSlider = document.getElementById("saturation") as HTMLInputElement;
    const captionInput = document.getElementById("textbox") as HTMLInputElement;
    const hue = parseInt(hueSlider.value);
    const saturate = parseInt(satSlider.value);
    var caption = captionInput.value;
    var loaded:Boolean = false;
    var fontSize = 150;
    var textWidth;

   //checking if image has loaded 
    await new Promise<void>((resolve) => {
        if (img.complete) {
            console.log("complete");
            loaded = true;
            resolve();
        } else {
            img.onload = () => {
                console.log("jsload");
                loaded = true;
                resolve();
            };
        }
    });
        
    if (loaded){
        //console.log("loaded");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (feedNum == 1) {
            ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%)`;
            filter[0] = hue.toString();
            filter[1] = saturate.toString();
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        localStorage.setItem(`filter`, JSON.stringify(filter));

        if (logo.complete) {
            logoCoords = getLogoPos(postNum, feedNum, canvas.height, canvas.width);
            ctx.drawImage(logo, logoCoords[0], logoCoords[1], 200, 200);
        }           

        if (caption && feedNum == 1 && (postNum == "6" || postNum == "8")) {
            if(postNum == "6"){
                fontSize = 60;
                captCoords = [ 323 ,canvas.height/2 + 25];
                ctx.fillStyle = "white";
            } else{
                //caption = "helloooo9";
                fontSize = 145;
                ctx.font = `${fontSize}px helvetica-bold`;
                captCoords = [850, 830];
                textWidth = ctx.measureText(caption.toUpperCase()).width;
                var textLength = caption.length;
                console.log(textWidth);
                if(textWidth > 483){
                    //fontSize -= (textWidth-483)/483 * 3.33;
                    //
                }
                if (textLength > 4){ // 50 60
                    /*fontSize -= (textLength)*(textLength-4) +30;
                    console.log("textlen", textLength);
                    */
                    
                
                }
                console.log("start");
                    for (var i = fontSize; i > 0; i--){
                        console.log("done");
                        ctx.font = `${i}px helvetica-bold`;
                        if (!(ctx.measureText(caption.toUpperCase()).width > 383)){
                            fontSize = i;
                            captCoords[1] += (fontSize-120)/2;
                            break;
                        }
                    }
                
                console.log(fontSize);
                
                ctx.fillStyle = '#51afff';
            }
            ctx.font = `${fontSize}px helvetica-bold`;
            
            ctx.fillText(caption.toUpperCase(), captCoords[0], captCoords[1]);
            
            console.log(caption, "caption");
        }
        console.log("rendered");
    }
}

function imageChange(){
    const imgInput = document.getElementById("imageInput") as HTMLInputElement;
    const imgFile = imgInput.files ?  imgInput.files[0] : null;


    if(imgFile) {
        if (imgFile?.type.includes('png')){
            const reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.getElementById('imgCanvas') as HTMLCanvasElement;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    let transparentPixelFound = false;
                    canvas.width = img.width;
                    canvas.height = img.height;
                    console.log("img loaded");
                    if(ctx){
                        console.log("yay ctx");
                        ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    
                        for (let i = 3; i < imageData.length; i += 4) {
                            if (imageData[i] === 0) { // Alpha channel is 0 (fully transparent)
                                transparentPixelFound = true;
                                //console.log("transparecny");
                                break;
                            } else {
                                //console.log("not found");
                            }
                        }
                    }
                    if (transparentPixelFound){
                        previewImage(img.src);
                    } else {
                        alert("The Image does NOT have a transparent background.");
                    }

                }
                
                
            };
            
            isFilled[3] = true;
        } else {
            console.log("no png");
        }
    }
    

    //emptying <input> so that the user can upload a new image later
    imgInput.value = "";
    
}

function checkRequired(event: Event){
    const input = event.target as HTMLInputElement;
    const data = input.value;
    const submitButton = document.getElementById("submitButton") as HTMLButtonElement;

    if(data!=""){
        if (input.id == "name") {   
            isFilled[0] = true;
            //console.log("name filled");   
            
        } else if (input.id == "primaryColor" || input.id == "secondaryColor") {
            isFilled[1] = true;
            //console.log("color filled"); 
        } else if (input.id == "imageInput"){
            isFilled[3] = true;
        }
        //console.log(isFilled);
        makeGradient(submitButton, true);
    } else if (!data){
        if (input.id == "name"){
            isFilled[0] = false;
            //console.log("name not filled"); 
            makeGradient(submitButton, false);
        } //others not needed because color cant be empty?
    }

}

function getLogoPos (postNum : string, feedNum : number, height: number, width: number){
    var logoPos = [0,0];
    switch (feedNum){
            case 1:
                if (postNum == "1" || postNum == "3" || postNum == "4" || postNum == "5" || postNum == "8"){
                    logoPos = [0,0];
                } else if (postNum == "2" || postNum == "7" || postNum == "9"){
                    logoPos = [0, height-275];
                }
                break;
            case 2:
                if (postNum == "1" || postNum == "4"){
                    logoPos = [0,height-275];
                } else if (postNum == "6" || postNum == "7" || postNum == "9"){
                    logoPos = [width-275,0];
                } else if (postNum == "5" || postNum == "8"){
                    logoPos = [width-275, height-275];
                } else if (postNum == "2" || postNum  == "3"){
                    logoPos = [0,0];
                }
                break;
            case 3:
                if (postNum == "1" || postNum == "2" || postNum == "3" || postNum == "8"){
                    logoPos = [0,0];
                } else if (postNum == "7"){
                    logoPos = [0, height-275];
                } else {
                    logoPos = [width-275, 0];
                }
        }
        return logoPos;
}

function makeGradient(item: HTMLButtonElement, bool: boolean){
   
    if (bool){
        item.classList.remove('bg-my-gray');
        item.classList.add("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
    } else{
        item.classList.add('bg-my-gray');
        item.classList.remove("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
    }
}

function redirectPage(dest : string){
    window.location.href = dest;
}

function redirectPost(postNum: number){
    const urlParam = new URLSearchParams (window.location.search).get("feed");
    var feedNum : number = 1;
    if (urlParam){
        feedNum = parseInt(urlParam);
    }
    window.location.href = `../social-media/postPage.html?feed=${feedNum}&post=${postNum}`;
    //console.log(postNum, "rideiredt");
}

function changeFeed(feedNum:number){
    //getting feed number
    var currfeedNum = 1
    const mainSection = document.getElementById("mainSec") as HTMLElement;
    const urlParam = new URLSearchParams (window.location.search).get("feed");
    if (urlParam){
        currfeedNum = parseInt(urlParam);
    }
    
    if (feedNum < currfeedNum){
        mainSection.classList.add("animate-swipe-right");    
    } else if (feedNum > currfeedNum){
        mainSection.classList.add("animate-swipe-left");    
    }
    setTimeout(()=> {
    window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
    }, 700);
}

function changeBanner(num:number){
    const mainSection = document.getElementById("mainSec") as HTMLElement;
    const storedNum = localStorage.getItem("banner-num");
    var bannerNum = 1;
    if (storedNum){
        bannerNum = parseInt(storedNum);
    }
    if (num < bannerNum){
        mainSection.classList.add("animate-swipe-right");    
    } else if (num > bannerNum){
        mainSection.classList.add("animate-swipe-left");    
    }
    console.log("swiped");
    bannerNum = num;
    setTimeout(()=> {
        window.location.href = `../pages/street-banner.html?num=${bannerNum}`;
    }, 300);
}