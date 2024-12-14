let primaryColor = "#ff0000", 
    secondaryColor = "#ff0000", 
    nameBrand = "basic",
    isFilled = [false,false,false];
//Check if the user submits/is filling the form (for event listeners)
if (document.body.getAttribute('id') == "setupPage") {
    
    
    const form = document.getElementById("details") as HTMLFormElement;
    const imgButton = document.getElementById("imageTemplate") as HTMLDivElement;

    form.addEventListener('submit', (event: Event) => {

        if (isFilled[0] && isFilled[1] && isFilled[2]){
            event.preventDefault(); 

            console.log(localStorage.getItem("nameBrand"));
            console.log("Form submission detected");

            const formData = new FormData(form);
                
            //get form data
            nameBrand = formData.get("name") as string || nameBrand;
            primaryColor = formData.get("primaryColor") as string || primaryColor;
            secondaryColor = formData.get("secondaryColor") as string || secondaryColor;

            // Store the values in localStorage
            localStorage.setItem("nameBrand", nameBrand);
            localStorage.setItem("primaryColor", primaryColor);
            localStorage.setItem("secondaryColor", secondaryColor);

            console.log(`Primary Color: ${primaryColor}, Secondary Color: ${secondaryColor}, Name: ${nameBrand}`);
        }
    });

    imgButton.addEventListener('click', () => {

        const imgInput = document.getElementById("imageInput") as HTMLInputElement;
        
        imgInput.click();
        

    });

}


function previewImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const imgFile = input.files ?  input.files[0] : null;

    if(imgFile){
        const reader = new FileReader();
        const prevDiv = document.getElementById("imagePreviewDiv") as HTMLDivElement;
        const imgPreview = document.getElementById("imagePreview") as HTMLImageElement;
        const imgTemplate = document.getElementById("imageTemplate") as HTMLDivElement;
        const imgDiv = document.getElementById("imageDiv") as HTMLDivElement;

        reader.readAsDataURL(imgFile);
        reader.onload = () => {
            imgPreview.src = reader.result as string;
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

function checkRequired(event: Event){
    const input = event.target as HTMLInputElement;
    const data = input.value;
    const submitButton = document.getElementById("submitButton") as HTMLButtonElement;
    const submitGlow = document.getElementById("submitGlow") as HTMLDivElement;

    if(data!="" ){
        if (input.id == "name") {
            isFilled[0] = true;     
            console.log("name filled");   
        } else if (input.id == "primaryColor") {
            isFilled[1] = true;
            console.log("c1 filled"); 
        } else if (input.id == "secondaryColor") {
            isFilled[2] = true;
            console.log("c2 filled"); 
        }
        console.log(isFilled);
        if (isFilled[0] && (isFilled[1] || isFilled[2])) {
            submitButton.classList.remove('bg-my-gray');
            submitButton.classList.add("bg-gradient-to-r", "from-[#524dee]", "via-[#0be1f7]", "to-[#524dee]");
            submitGlow.classList.remove('hidden');
        } else {
            if (!submitButton.classList.contains("bg-my-gray")){
                submitButton.classList.remove('bg-gradient-to-r from-[#524dee] via-[#0be1f7] to-[#524dee]');
                submitButton.classList.add('bg-my-gray');
                submitGlow.classList.add('hidden');
            }
            
        }
    }
}
