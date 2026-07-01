const BACKEND_URL = "https://nova-ai-xk3u.onrender.com/api/chat";

const input = document.getElementById("prompt");
const send = document.getElementById("send");
const messages = document.getElementById("messages");


function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    message.innerHTML = `
    <div class="avatar">
        ${sender === "bot" ? "🤖" : "👤"}
    </div>

    <div class="message-text">
        ${text}
        ${sender === "bot"
            ? '<br><button class="copy-btn">📋 Copy</button>'
            : ""}
    </div>
`;

    messages.appendChild(message);
    if(sender === "bot"){
    message.querySelector(".copy-btn").onclick = () => {
        navigator.clipboard.writeText(text);
        alert("Copied!");
    };
    }

    messages.scrollTop = messages.scrollHeight;
}



async function askAI(text) {

    try {

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("❌ " + JSON.stringify(data), "bot");
        }

    } catch (error) {

        addMessage(
            "❌ Failed to get AI response: " + error.message,
            "bot"
        );

    }
}


send.addEventListener("click", () => {

    const text = input.value.trim();


    if(text === "") return;


    addMessage(text,"user");


    input.value = "";


    askAI(text);

});



input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
        send.click();
    }

});
const clearBtn = document.getElementById("clearChat");

if (clearBtn) {
    clearBtn.onclick = () => {
        messages.innerHTML = "";
    };
}
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

console.log(menuBtn);
console.log(sidebar);

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        console.log("Menu clicked");
    });
}
