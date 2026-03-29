(function() {
    if (window.chatWidgetLoaded) {
        return;
    }
    
    window.chatWidgetLoaded = true;

    const widgetContaier = document.getElementById("chat-widget-container");
    
    if (!widgetContaier) {
        console.error("Chat widget container not found");
        return;
    }

    widgetContaier.innerHTML = `
        <style>
            #chat-widget-float-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #007bff;
                color: white;
                border: none;
                cursor: pointer;
            }
        </style>

        <button id="chat-widget-float-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path></svg>
        </button>
    `;
    
    const appId = widgetContaier.getAttribute("data-app-id");
    const welcomeMessage = widgetContaier.getAttribute("data-welcome-message");
    const widgetWidth = widgetContaier.getAttribute("data-widget-width") || "400px";
    const widgetHeight = widgetContaier.getAttribute("data-widget-height") || "600px";

    console.log("Chat widget app-id:", appId);
    console.log("Chat widget welcome-message:", welcomeMessage);
    console.log("Chat widget widget-width:", widgetWidth);
    console.log("Chat widget widget-height:", widgetHeight);

    const mainContentElement = `
    
    <style>

        .chat-widget {
            width: ${widgetWidth};
            height: ${widgetHeight};
        }
    </style>

    `

})();