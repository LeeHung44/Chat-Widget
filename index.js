(function () {
    if (window.chatWidgetLoaded) {
        return;
    }

    window.chatWidgetLoaded = true;

    const widgetContaier = document.getElementById("chat-widget-container");


    if (!widgetContaier) {
        console.log("Chưa có container!");
        return;
    }

    const appId = widgetContaier.getAttribute("data-app-id");
    const welcomeMessage = widgetContaier.getAttribute("data-welcome-message");
    const widgetWidth = widgetContaier.getAttribute("data-widget-width") || "400px";
    const widgetHeight = widgetContaier.getAttribute("data-widget-height") || "600px";

    const widgetWrapper = document.createElement('div');
    widgetWrapper.id = 'chat-widget-wrapper';
    widgetContaier.style.position = "fixed";
    widgetContaier.style.zIndex = 99999;
    widgetContaier.style.bottom = "20px";
    widgetContaier.style.right = "20px";

    const shadown = widgetWrapper.attachShadow({ mode: 'open' });

    const template = document.createElement('template');

    template.innerHTML = `
    <style>
            :host {
                --primary-color: #007bff;
                --bubble-size: 56px;
            }

            * {
                box-sizing: border-box;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .float-button {
                width: var(--bubble-size);
                height: var(--bubble-size);
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                transition: all 0.2s ease;
            }

            .float-button:hover {
                transform: scale(1.08);
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
            }

            .chat-window {
                position: absolute;
                bottom: calc(var(--bubble-size) + 15px);
                right: 0;
                width: ${widgetWidth};
                height: ${widgetHeight};
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e0e0e0;
            }

            .chat-header {
                background: var(--primary-color);
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header h3 {
                margin: 0;
                font-size: 18px;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                line-height: 1;
            }

            .chat-body {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #f8f9fa;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .message {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 18px;
                line-height: 1.4;
            }

            .message.user {
                align-self: flex-end;
                background: var(--primary-color);
                color: white;
                border-bottom-right-radius: 4px;
            }

            .message.bot {
                align-self: flex-start;
                background: #e9ecef;
                color: #333;
                border-bottom-left-radius: 4px;
            }

            .chat-footer {
                padding: 12px;
                background: white;
                border-top: 1px solid #ddd;
                display: flex;
                gap: 8px;
            }

            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #ccc;
                border-radius: 30px;
                outline: none;
                font-size: 15px;
            }

            .send-btn {
                width: 44px;
                height: 44px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }
        </style>

        <button class="float-button" id="float-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path></svg>
        </button>

        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <h3>Chat So9</h3>
                <button class="close-btn">✕</button>
            </div>
            <div class="chat-body">
                <div class="message bot">${welcomeMessage}</div>
            </div>
            <div class="chat-footer">
                <input type="text" class="chat-input" placeholder="Nhập tin nhắn...">
                <button class="send-btn">Send</button>
            </div>
        </div>
    `;

    const floatButton = shadown.getElementById('float-button');
    const chatWindow = shadown.getElementById('chat-window');

    let isOpenChat = false;

    function toggleChat() {
        isOpenChat = !isOpenChat;
        chatWindow.style.display = isOpenChat ? 'flex' : 'none';
    }

    floatButton.addEventListener('click', toggleChat);

    shadown.appendChild(template.content.cloneNode(true));

    document.body.appendChild(widgetWrapper);

    console.log("Check load Widget done");
    

})();