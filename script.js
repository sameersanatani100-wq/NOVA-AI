const BACKEND_URL = "https://nova-ai-xk3u.onrender.com/api/chat";

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
        <div class="avatar ${sender}-avatar">${avatar}</div>

        <div class="message-content">

            <div class="message-header">
                <span class="message-name">${name}</span>
                <span class="message-time">${getTime()}</span>
            </div>

            <div class="message-text">${text}</div>

            ${
                sender === "bot"
                    ? '<button class="copy-btn">📋 Copy</button>'
                    : ""
            }

        </div>
    `;
    localStorage.setItem(
    "chatHistory",
    document.querySelector(".messages").innerHTML
);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    if (sender === "bot") {
        message.querySelector(".copy-btn").onclick = () => {
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

const typing = document.createElement("div");
typing.className = "message bot";
typing.id = "typing";
typing.innerText = "Nova AI is typing...";

document.querySelector(".messages").appendChild(typing);
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt
            })
        });

        const data = await response.json();
        document.getElementById("typing")?.remove();
        
        messages.lastChild.remove();

        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("❌ " + (data.error || "Unknown error"), "bot");
        }

    } catch (error) {

        messages.lastChild.remove();

        addMessage("❌ Connection Error: " + error.message, "bot");

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
// ===== Chat History =====

window.onload = () => {
    const oldChat = localStorage.getItem("chatHistory");

    if (oldChat) {
        document.querySelector(".messages").innerHTML = oldChat;
    }
};


// ===== Clear Chat Button =====

const clearBtn = document.getElementById("clearChat");

if (clearBtn) {
    clearBtn.onclick = () => {
        document.querySelector(".messages").innerHTML = "";
        localStorage.removeItem("chatHistory");
    };
};
