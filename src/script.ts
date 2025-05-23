let primaryColor = "#ff0000", 
    secondaryColor = "#ff0000", 
    nameBrand = "basic",
    isFilled = [false,false,false,false];
    // 0- name; 1-primary color; 2- secondary color; 3- image;

document.addEventListener("DOMContentLoaded", function () {

    if (document.body.getAttribute('id') == "setupPage") {

        //need always
        const nameValue = localStorage.getItem("nameBrand");
        const primaryColorValue = localStorage.getItem("primaryColor");
        const secondaryColorValue = localStorage.getItem("secondaryColor");
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
        const primaryColorInput = document.getElementById("primaryColor") as HTMLInputElement;
        const secondaryColorInput = document.getElementById("secondaryColor") as HTMLInputElement;
        const imgInput = document.getElementById("imageInput") as HTMLInputElement;

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

        form.addEventListener('submit', (event: Event) => {
    
            if (isFilled[0] && isFilled[3]) {
                event.preventDefault(); 

                //console.log("Form submission detected");
                const formData = new FormData(form);
    
                //get form data
                nameBrand = formData.get("name") as string || nameBrand;
                primaryColor = formData.get("primaryColor") as string || primaryColor;
                secondaryColor = formData.get("secondaryColor") as string || secondaryColor;
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
    if (document.body.getAttribute('id') == "postPage"){

        const params = new URLSearchParams(window.location.search);
        const postNum = params.get("post") || "1"; // Default fallback
        const feedNum = params.get("feed") || "1"; // Default fallback
        const img = document.getElementById("postImg") as HTMLImageElement;

        if (img && postNum && feedNum) {
            const parsedPostNum = parseInt(postNum, 10);
            const parsedFeedNum = parseInt(feedNum, 10);

            if (!isNaN(parsedPostNum) && !isNaN(parsedFeedNum)) {
                const newSrc = `../assets/social-media-${parsedFeedNum}/${parsedPostNum}.png`;
                console.log("Setting image src to:", newSrc); // Debug log
                img.src = newSrc;
            }
        }
        const textbox = document.getElementById("textbox");
        const button = document.getElementById("downloadButton") as HTMLButtonElement;

        /*
        textbox?.addEventListener("change", () => {
            console.log("ok");

        });
        img.onload = () => {

            const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
            const ctx = canvas?.getContext("2d");
            const logo = document.createElement("img");
            logo.src = localStorage.getItem("logoImage") || "";
            canvas.height = img.height;
            canvas.width = img.width;
            
            if (ctx && logo){
                ctx.imageSmoothingEnabled = true;
                ctx.drawImage(img, 0,0);
                ctx.drawImage(logo, 200, 200,);
                //downloading
                const dataURL = canvas.toDataURL("image/png");

                button?.addEventListener("click", () => {
                    downloadThis(dataURL, "post.png");
                });
            }
            
        };*/
    }
    if (document.body.getAttribute('id') == "feeds" || document.body.getAttribute("id") == "postPage"){
        
        const hueSlider = document.getElementById("hue") as HTMLInputElement;
        const saturSlider = document.getElementById("saturation") as HTMLInputElement;
        const tilesDiv = document.getElementById("tiles") as HTMLDivElement;
        const trackerDiv  = document.getElementById("trackers") as HTMLDivElement;
        const resetButton = document.getElementById("reset");
        const settingDiv = document.getElementById("settings") as HTMLDivElement;
        var filter = ["","", "", ""];
        const urlParam = new URLSearchParams (window.location.search).get("feed");
        var feedNum = 1;
        var storedFilter;
        //getting feed number
        if (urlParam){
            feedNum = parseInt(urlParam);
        } else {
            window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
        }

        if (document.body.getAttribute('id') == "feeds"){
            loadFeed(tilesDiv, feedNum);
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

        if (feedNum){
            if (!storedFilter){
                filter = ["209", "100", "209", "100"];  //[currHue, currSatur, defHue, defSatur]
                storedFilter = localStorage.getItem(`filter${feedNum}`);
            }
            if (feedNum == 2 || feedNum == 3){
                settingDiv.classList.add("hidden");
                //document.getElementById("mainSec")?.classList.remove("flex");
            }
        }
        
        
        if (storedFilter){
            filter = JSON.parse(storedFilter);

            //setting apt slider values
            hueSlider.value = filter[0];
            saturSlider.value = filter[1];

            applyFilters(tilesDiv, filter);
        } 
        
        //Event listeners
        hueSlider.addEventListener("input", () => {
            filter[0] = hueSlider.value;
            applyFilters(tilesDiv, filter);
            console.log("hue:", filter[0]);
        
        });
        
        saturSlider.addEventListener("input", () => {
            filter[1] = saturSlider.value;
            applyFilters(tilesDiv, filter);
            console.log("saturation:", filter[1]);
            
        });

        resetButton?.addEventListener("click", () => {
            
            hueSlider.value = filter[2];
            saturSlider.value = filter[3];
            applyFilters(tilesDiv, filter, true);
            console.log(filter[2], filter[3]);
        });
    }
});

//cant put in main if statement (DOMContentLoader)
function applyFilters(div: HTMLDivElement, filter : string[], reset = false) {
    const allPosts = div.querySelectorAll<HTMLImageElement>('img');
    const urlParam = new URLSearchParams (window.location.search).get("feed");
    var feedNum : number = 1;
    if (urlParam){
        feedNum = parseInt(urlParam);
    } else{
        feedNum = 1;
    }
    var hue : number = parseInt(filter[2]);
    var satur : number = parseInt(filter[3]);
    if (!reset) {
        hue = parseInt(filter[0]);
        satur = parseInt(filter[1]); 
    } else if (reset){
        filter[0] = filter[2];
        filter[1] = filter[3];
    }
   
    allPosts.forEach((post) => {
        post.style.filter = `
            hue-rotate(${hue - 209}deg)
            saturate(${satur/100})
        `;
    });
    localStorage.setItem(`filter${feedNum}`, JSON.stringify(filter));
}

function loadFeed (tilesDiv:HTMLDivElement, feedNum:number){
    const allPosts = tilesDiv.querySelectorAll<HTMLImageElement>('img');
    var tileNum : number = 1;
    allPosts.forEach((tile) => {
        tile.src = `../assets/social-media-${feedNum}/${tileNum}.png`;
        tileNum++;
    });
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
    console.log(postNum);
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
        console.log("test");
        //mainSection.classList.add("animate-swipe-left");    
    }
    setTimeout(()=> {
    window.location.href = `../social-media/feeds.html?feed=${feedNum}`;
    }, 700);
}