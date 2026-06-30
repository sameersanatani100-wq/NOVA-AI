import { GoogleGenAI } from "@google/genai";

const API_KEY = "AQ.Ab8RN6LzsxzAiYAHgtBBbcdwRzaOZ2rnLOBfKdrs7aB6FgmoBw";

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const input = document.getElementById("prompt");
const send = document.getElementById("send");
const messages = document.getElementById("messages");

function getTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    const avatar = sender === "bot" ? "🤖" : "👤";
    const name = sender === "bot" ? "Nova AI" : "You";

    message.innerHTML = `
        <div class="avatar ${sender}-avatar">
            ${avatar}
        </div>

        <div class="message-content">

            <div class="message-header">

                <span class="message-name">${name}</span>

                <span class="message-time">${getTime()}</span>

            </div>

            <div class="message-text">

                ${text}

            </div>

            ${sender==="bot"
            ?'<button class="copy-btn">📋 Copy</button>'
            :''
            }

        </div>
    `;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    if(sender==="bot"){

        message.querySelector(".copy-btn").onclick=()=>{

            navigator.clipboard.writeText(
                message.querySelector(".message-text").innerText
            );

            alert("Copied!");
        };

    }

}

async function askAI(prompt) {
  addMessage("🤖 Thinking...", "bot");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    messages.lastChild.remove();

    addMessage(response.text, "bot");

  } catch (err) {

    messages.lastChild.remove();

    addMessage("❌ " + err.message, "bot");
  }
}

send.onclick = () => {

  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  askAI(text);

};

input.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    send.click();

  }

});