import {
    GoogleGenerativeAI
} from "@google/generative-ai";

// Fetch your API_KEY
const API_KEY = "AIzaSyAca63L24LRL_gGCOGOfjCZEB7en1n1WmQ";
const genAI = new GoogleGenerativeAI(API_KEY);
const container = document.body;
async function run() {
    const input = document.getElementById("prompt-here");
    const toPlace = document.getElementById("toPlace").value;
    const duration = document.getElementById("duration").value;
    const fromPlace = document.getElementById("fromPlace").value; 


    let promptMsg, prompt;

    if (input.value.trim() !== "") {
        // If user provided a prompt directly in the "prompt-here" field
        promptMsg = input.value.trim();
        prompt = promptMsg;
    } else {
        // If user provided travel planning inputs
        promptMsg = `Create a travel itinerary from ${fromPlace} to ${toPlace} for ${duration} Days`;
        prompt = promptMsg;
    }

    const userInput = promptMsg;

    const chatContainer = document.getElementById("res");

    // Display user input
    const userMsgElement = document.createElement("div");
    userMsgElement.classList.add("chat-box", "user-msg");
    userMsgElement.textContent = userInput;
    chatContainer.appendChild(userMsgElement);

    // Generate response
    const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro"
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);

    const botMsgElement = document.createElement("div");
    botMsgElement.classList.add("chat-box", "bot-msg");
    botMsgElement.innerHTML = html;

    // Create a copy button using an SVG file
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<img class="copyIcon" src="./copy.svg" alt="Copy Icon">';
    copyButton.addEventListener("click", () => {
        // Get the text content of the bot message element
        const responseText = botMsgElement.textContent.trim();

        // Create a temporary textarea element
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = responseText; // Set the value of the textarea to the response text content
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);
        alert("Response copied to clipboard!");
    });


    // Append the copy button to the bot message element
    botMsgElement.appendChild(copyButton);

    // Append the bot message element to the chat container
    chatContainer.appendChild(botMsgElement);

    // Scroll to the bottom after adding a new message
    botMsgElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    // Save prompt and response to local storage
    saveToLocalStorage(promptMsg, text);

    // Apply syntax highlighting
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });

    // Clear input
    input.value = "";
    fromPlace.value = "";
    toPlace.value = "";
    duration.value = "";
}

// Function to save prompt and response to local storage
function saveToLocalStorage(prompt, response) {
    const previousEntries = JSON.parse(localStorage.getItem("travelEntries")) || [];
    previousEntries.push({ prompt, response });
    localStorage.setItem("travelEntries", JSON.stringify(previousEntries));
}

// Function to load and display previous entries from local storage
// Function to load and display previous entries from local storage
function loadFromLocalStorage() {
    const previousEntries = JSON.parse(localStorage.getItem("travelEntries")) || [];
    const chatContainer = document.getElementById("res");

    previousEntries.forEach(entry => {
        const userMsgElement = document.createElement("div");
        userMsgElement.classList.add("chat-box", "user-msg");
        userMsgElement.textContent = entry.prompt;
        chatContainer.appendChild(userMsgElement);

        const botMsgElement = document.createElement("div");
        botMsgElement.classList.add("chat-box", "bot-msg");
        botMsgElement.innerHTML = entry.response;

        // Convert markdown to HTML using showdown.js
        const converter = new showdown.Converter();
        const html = converter.makeHtml(entry.response);
        botMsgElement.innerHTML = html;

        // Apply syntax highlighting using highlight.js
        botMsgElement.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightBlock(block);
        });

       // Create a copy button using an SVG file
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<img class="copyIcon" src="./copy.svg" alt="Copy Icon">';
    copyButton.addEventListener("click", () => {
        // Get the text content of the bot message element
        const responseText = botMsgElement.textContent.trim();

        // Create a temporary textarea element
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = responseText; // Set the value of the textarea to the response text content
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);
        alert("Response copied to clipboard!");
    });


        botMsgElement.appendChild(copyButton);

        // Append the bot message element to the chat container
chatContainer.appendChild(botMsgElement);

// Scroll to the bottom after adding a new message
container.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    });
}




// Add event listener to the button for running the function
document.getElementById("button").addEventListener("click", run);

// Load previous entries when the page is loaded
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
