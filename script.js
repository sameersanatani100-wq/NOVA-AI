const BACKEND_URL = "https://nova-ai-xk3u.onrender.com/api/chat";

const input = document.getElementById("prompt");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const clearBtn = document.getElementById("clearChat");


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
        <div class="avatar">${avatar}</div>

        <div class="message-content">

            <div class="message-header">
                <span>${name}</span>
                <span>${getTime()}</span>
            </div>

            <div class="message-text">${text}</div>

        </div>
    `;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    localStorage.setItem("chatHistory", messages.innerHTML);
}


async function askAI(text) {

    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.innerText = "Nova AI is typing...";
    messages.appendChild(typing);

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

        typing.remove();


        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("❌ Error", "bot");
        }


    } catch (error) {

        typing.remove();

        addMessage(
            "❌ Connection Error",
            "bot"
        );
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



// Load old chat

window.onload = () => {

    const oldChat = localStorage.getItem("chatHistory");

    if (oldChat) {
        messages.innerHTML = oldChat;
    }

};



// Clear chat

if (clearBtn) {

    clearBtn.onclick = () => {

        messages.innerHTML = "";

        localStorage.removeItem("chatHistory");

    };

}
