const BACKEND_URL = "https://nova-ai-xk3u.onrender.com/api/chat";

const input = document.getElementById("prompt");
const send = document.getElementById("send");
const messages = document.getElementById("messages");


function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    message.innerHTML = `
        <div class="message-text">
            ${text}
        </div>
    `;

    messages.appendChild(message);

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


        addMessage(
            data.reply || "No response",
            "bot"
        );


    } catch(error) {

        addMessage(
            "Connection error",
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
