const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadbtn = imgCard.querySelector(".download-btn");


        //set the image source to the AI-generated image data
        const aiGeneratedimg= `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedimg;

        //when the image is loaded, remove ther loading class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadbtn.setAttribute("href", aiGeneratedimg);
            downloadbtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImage = async (userPrompt, userImgQuantity) => {
    try {
        //send a request to the openai api to generate images based on user input
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",   
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })

        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json(); // get data from the response
        updateImageCard([...data]);
    } catch (error) {   
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    
    // It will get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;


    //creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");
    
    
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImage(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);