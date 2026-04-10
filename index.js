/**
 * SO9 ChatWidget v4
 * Usage: <script src="/.../chat-widget.js"
 *                 data-server="https://your-server.com"
 *                 data-app-id="your_app_id">
 *        </script>
 */
(function () {
  const SCRIPT_EL = document.currentScript;
  const SERVER_URL = "https://chat-widget.so9.vn/";
  const APP_ID = SCRIPT_EL?.getAttribute("data-app-id")?.trim() || "";
  const searchParams = new URLSearchParams(window.location.search);

  const data_default = {
    button_mode: "circle",
    button_title: "",
    button_align: "right",
    button_width: 48,
    button_height: 48,
    button_align_left_or_right: 16,
    web_button_align_bottom: 16,
    mobile_button_align_bottom: 16,
    button_color: "#2c4b94",
    text_color: "#fff",
    button_image: [],
    button_icon: "message_1",
    button_animation: true,
    notification: true,
    widget_name: "Tên Widget",
    widget_avatar: "https://ui-avatars.com/api/?name=S",
    widget_description: "Mô tả Widget",
    mobile_height: 100,
    web_height: 100,
    web_height_unit: "percent",
    locale: "vi",
    welcome_message: {},
    form_title: "Tiêu đề form",
    welcome_form_fields: [],
    is_show_faq: true,
    faq_trans: {},
    auto_open: false,
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const utmSource = searchParams.get('utm_source') || getCookie("utmSource");
  const utmMedium = searchParams.get('utm_medium') || getCookie("utmMedium");
  const utmCampaign = searchParams.get('utm_campaign') || getCookie("utmCampaign");
  const utmContent = searchParams.get('utm_content') || getCookie("utmContent");

  if (!APP_ID) { console.error("[ChatWidget] Thiếu data-app-id"); return; }

  /* ================================================================
     SVG ICON HELPERS
     ================================================================ */
  function iconMessage1(size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none">' +
      '<path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="' + color + '" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M7 8H17" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M7 13H13" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }
  function iconMessage2(size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none">' +
      '<path d="M17 9C17 12.87 13.64 16 9.5 16L8.57 17.12L8.02 17.78C7.55 18.34 6.65 18.22 6.34 17.55L5 14.6C3.18 13.32 2 11.29 2 9C2 5.13 5.36 2 9.5 2C13.64 2 17 5.13 17 9Z" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M22 12.86C22 15.15 20.82 17.18 19 18.46L17.66 21.41C17.35 22.08 16.45 22.21 15.98 21.64L14.5 19.86C12.08 19.86 9.92 18.71 8.57 16.97L9.5 15.86C13.64 15.86 17 12.73 17 8.86C17 7.82 16.78 6.83 16.36 5.93C19.57 6.96 22 9.65 22 12.86Z" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }
  function iconMessage3(size, color) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none">' +
      '<path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="' + color + '" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M12 11V11.01" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M8 11V11.01" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M16 11V11.01" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function getButtonIcon(key, size, color) {
    switch (key) {
      case "message_0": return "";
      case "message_1": return iconMessage1(size, color);
      case "message_2": return iconMessage2(size, color);
      case "message_3": return iconMessage3(size, color);
      default:
        if (key && key.startsWith("http")) {
          return '<img src="' + esc(key) + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
        }
        return iconMessage1(size, color);
    }
  }

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 256;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Có lỗi xảy ra khi đọc file ảnh'));
      img.src = URL.createObjectURL(file);
    });
  }

  var SVG_CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm3.36 12.3a.754.754 0 010 1.06c-.15.15-.34.22-.53.22s-.38-.07-.53-.22L12 13.06l-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 010-1.06l2.3-2.3-2.3-2.3a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L13.06 12l2.3 2.3z"/></svg>';
  var SVG_SEND = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m16.14 2.96-9.03 3c-6.07 2.03-6.07 5.34 0 7.36l2.68.89.89 2.68c2.02 6.07 5.34 6.07 7.36 0l3.01-9.02c1.34-4.05-.86-6.26-4.91-4.91Zm.32 5.38-3.8 3.82c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l3.8-3.82c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06Z" fill="currentColor"></path></svg>';
  var SVG_BACK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>';
  var SVG_EMOJI = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
  var SVG_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2.67 18.95l4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  var SVG_CLOSE_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var SVG_ARROW_DOWN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9l-7 7-7-7"/></svg>';

  var MAX_FILE_SIZE = 1 * 1024 * 1024;

  var EMOJIS = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆",
    "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗",
    "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐",
    "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐",
    "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜",
    "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑",
    "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭",
    "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱",
    "👍", "👎", "👏", "🙌", "🤝", "💪", "❤️", "🔥",
    "⭐", "🎉", "🎊", "💯", "✅", "🙏", "💐", "🌹",
  ];

  const ERROR_CODE = {
    "VERIFY_CHANNEL_FAILED": "Kênh xác thực không hợp lệ"
  };

  /* ================================================================
     UTILS
     ================================================================ */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = cb;
    s.onerror = function () { console.error("[ChatWidget] Không load được script:", src); };
    document.head.appendChild(s);
  }

  /* ================================================================
     SHADOW CSS
     ================================================================ */
  var SHADOW_CSS = [
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');",
    "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
    ":host { all: initial; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }",
    "#cw-root {",
    "  --cw-main: #2c4b94; --cw-text: #fff; --cw-border: #E5E7EB;",
    " --cw-blue-50: #deebff;",
    "  --cw-bg-light: #F9FAFB; --cw-bg-hover: #F3F4F6; --cw-color-main: #111827;",
    "  position: fixed; z-index: 2147483647;",
    "  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;",
    "}",
    "@keyframes cw-ping { 0%{transform:scale(1);opacity:.8} 70%,100%{transform:scale(var(--cw-ping-scale,1.25));opacity:0} }",
    "@keyframes cw-msg-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }",
    "@keyframes cw-fade-in { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:none} }",
    "@keyframes cw-fade-out { from{opacity:1;transform:none} to{opacity:0;transform:scale(.95) translateY(8px)} }",
    ".cw-btn-ping::before { content:''; position:absolute; inset:0; border-radius:inherit; background:var(--cw-main); animation:cw-ping 1.5s cubic-bezier(0,0,.2,1) infinite; z-index:-1; }",
    "#cw-btn-wrap { position: relative; }",
    ".cw-btn-circle { border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; box-shadow:0 4px 12px rgba(0,0,0,.15); transition:transform .2s,box-shadow .2s; }",
    ".cw-btn-circle:hover { transform: scale(1.05); }",
    ".cw-btn-rect { display:flex; align-items:center; justify-content:center; gap:4px; cursor:pointer; position:relative; padding:0 8px; box-shadow:0 4px 12px rgba(0,0,0,.15); transition:transform .2s; }",
    ".cw-btn-rect:hover { transform: translateY(-2px); }",
    ".cw-btn-rect span { font-size:12px; font-weight:500; white-space:nowrap; }",
    ".cw-btn-rect-h { display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; position:relative; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,.15); writing-mode:vertical-rl; text-orientation:mixed; transition:transform .2s; }",
    ".cw-btn-rect-h:hover { transform: translateX(-2px); }",
    ".cw-btn-rect-h span { font-size:12px; font-weight:500; white-space:nowrap; }",
    ".cw-badge { position:absolute; top:0; right:0; transform:translate(25%,-25%); width:20px; height:20px; background:#EF4444; border-radius:50%; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; writing-mode:horizontal-tb; text-orientation:mixed; }",
    "#cw-overlays { position:absolute; bottom:100%; z-index:999; display:flex; flex-direction:column; margin-bottom:8px; width: 15rem }",
    ".cw-faq-pill { max-width:240px; width:fit-content; padding:8px 12px; border-radius:16px; background:#fff; cursor:pointer; margin-bottom:4px; position:relative; box-shadow:0 1px 4px rgba(0,0,0,.08); transition:box-shadow .15s; }",
    ".cw-faq-pill:hover { box-shadow:0 2px 8px rgba(0,0,0,.12); }",
    ".cw-faq-pill span { font-size:13px; color:var(--cw-color-main); display:block; }",
    ".cw-faq-pill-close { position:absolute; top:0; width:16px; height:16px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; padding:0; box-shadow:0 1px 3px rgba(0,0,0,.1); }",
    ".cw-faq-pill-close:hover { background:#F3F4F6; }",
    ".cw-notif-overlay { position:relative}",
    ".cw-notif-container { max-height:20rem; overflow-y:auto; bottom:100%; padding-top: 12px; }",
    ".cw-notif-container.right { right:0; padding-right: 12px; direction: rtl; }",
    ".cw-notif-container.left { left:0; padding-left: 12px; direction: ltr; }",
    ".cw-notif-container.right p { direction: ltr; }",
    ".cw-notif-container.left p { direction: inherit; }",
    ".cw-notif-item { max-width:15rem; width:fit-content; padding:0.5rem 0.75rem; border-radius:16px; background:var(--cw-blue-50); position:relative; cursor:pointer; margin-bottom:0.25rem; box-shadow:0 0 0 1px rgba(0,0,0,0.05); transition:all 0.15s ease; }",
    ".cw-notif-item:hover { transform:scale(1.02); box-shadow:0 2px 8px rgba(0,0,0,0.1); }",
    ".cw-notif-item img { width:4rem; height:4rem; border-radius:4px; object-fit:cover; }",
    ".cw-notif-item p { font-size:13px; color:var(--cw-color-main); margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.2; }",
    ".cw-notif-close-item-btn { position:absolute; top:0; width:1rem; height:1rem; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;  border:none; padding:0; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition:opacity 0.15s ease; }",
    ".cw-notif-close-item-btn.right { right: 0; transform:translate(25% ,-25%);}",
    ".cw-notif-close-item-btn.left { left: 0; transform:translate(0 ,-25%);}",
    ".cw-notif-close-item-btn:hover { opacity:0.8; }",
    ".cw-notif-close-item-btn i { font-size:0.75rem; color:var(--cw-main); }",
    "#cw-panel { width:320px; border-radius:12px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.08); background:var(--cw-bg-light); display:flex; flex-direction:column; animation:cw-fade-in .25s ease-out; }",
    "#cw-panel.cw-hidden { display:none; }",
    ".cw-panel-header { position:relative; padding:16px 16px 12px; border-radius:0 0 16px 16px; }",
    ".cw-panel-header-close { position:absolute; top:12px; right:12px; background:none; border:none; cursor:pointer; color:rgba(255,255,255,.7); display:flex; transition:color .15s; }",
    ".cw-panel-header-close:hover { color:#fff; }",
    ".cw-panel-header-avatar { width:48px; height:48px; border-radius:50%; overflow:hidden; background:#fff; margin-bottom:12px; }",
    ".cw-panel-header-avatar img { width:100%; height:100%; object-fit:cover; display:block; }",
    ".cw-panel-header-name { font-size:16px; font-weight:700; line-height:1.3; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;}",
    ".cw-panel-header-desc { font-size:13px; margin-top:2px; line-height:1.4; opacity:.9; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }",
    ".cw-error-header-close { background:none; border:none; cursor:pointer; color:rgba(255,255,255,.7); display:flex; transition:color .15s; margin-left: auto }",
    ".cw-error-header-close:hover { color:#fff; }",
    "#cw-form-screen { display:flex; flex-direction:column; height:100%; }",
    ".cw-form-body { flex:1; overflow-y:auto; padding:16px; }",
    ".cw-form-body::-webkit-scrollbar { width:4px; }",
    ".cw-form-body::-webkit-scrollbar-thumb { background:rgba(0,0,0,.1); border-radius:2px; }",
    ".cw-form-group { margin-bottom:12px; }",
    ".cw-form-group:last-child { margin-bottom:0; }",
    ".cw-form-label { display:block; font-size:13px; color:var(--cw-color-main); margin-bottom:4px; font-weight:500; }",
    ".cw-form-label .cw-req { color:#EF4444; }",
    ".cw-form-input,.cw-form-textarea,.cw-form-select { width:100%; padding:8px 12px; background:#fff; border:1px solid var(--cw-border); border-radius:6px; font-size:13px; color:var(--cw-color-main); font-family:inherit; outline:none; transition:border-color .2s; }",
    ".cw-form-input:focus,.cw-form-textarea:focus,.cw-form-select:focus { border-color:var(--cw-main); }",
    ".cw-form-input::placeholder,.cw-form-textarea::placeholder { color:#9CA3AF; }",
    ".cw-form-textarea { resize:none; min-height:56px; line-height:1.5; }",
    ".cw-form-footer { padding:12px; border-top:1px solid var(--cw-border); flex-shrink:0; }",
    ".cw-submit-btn { width:100%; padding:10px; border:none; border-radius:8px; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; font-family:inherit; transition:opacity .2s; }",
    ".cw-submit-btn:disabled { opacity:.5; cursor:not-allowed; }",
    ".cw-submit-btn:not(:disabled):hover { opacity:.9; }",
    ".cw-powered { text-align:center; font-size:10px; color:#9CA3AF; margin-top:6px; }",
    ".cw-powered a { font-weight:600; color:#3B82F6; text-decoration:none; }",
    ".cw-powered a:hover { text-decoration:underline; }",
    "#cw-faq-screen { display:flex; flex-direction:column; height:100%; }",
    ".cw-faq-body { flex:1; overflow-y:auto; padding:16px; }",
    ".cw-faq-body::-webkit-scrollbar { width:4px; }",
    ".cw-faq-body::-webkit-scrollbar-thumb { background:rgba(0,0,0,.1); border-radius:2px; }",
    ".cw-faq-item { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:#fff; border-radius:8px; border:1px solid var(--cw-border); cursor:pointer; margin-bottom:8px; transition:border-color .15s; }",
    ".cw-faq-item:last-child { margin-bottom:0; }",
    ".cw-faq-item:hover { border-color:var(--cw-main); }",
    ".cw-faq-item span { font-size:12px; color:var(--cw-color-main); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }",
    ".cw-faq-item .cw-faq-send { flex-shrink:0; opacity:.6; display:flex; transition:opacity .15s; }",
    ".cw-faq-item:hover .cw-faq-send { opacity:1; }",
    ".cw-faq-footer { padding:12px; border-top:1px solid var(--cw-border); flex-shrink:0; }",
    "#cw-chat-screen { display:flex; flex-direction:column; height:100%; }",
    ".cw-chat-header { display:flex; align-items:center; gap:4px; padding:8px 12px; border-bottom:1px solid var(--cw-border); background:#fff; flex-shrink:0; }",
    ".cw-chat-header-back { flex-shrink:0; background:none; border:none; cursor:pointer; color:var(--cw-color-main); display:flex; padding:0; }",
    ".cw-chat-header-avatar { width:32px; height:32px; border-radius:50%; overflow:hidden; background:var(--cw-border); flex-shrink:0; margin-right: 4px }",
    ".cw-chat-header-avatar img { width:100%; height:100%; object-fit:cover; display:block; }",
    ".cw-chat-header-info { flex:1; min-width:0; }",
    ".cw-chat-header-name { font-size:14px; font-weight:600; color:var(--cw-color-main); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }",
    ".cw-chat-header-status { font-size:12px; color:var(--cw-color-main); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }",
    ".cw-chat-header-close { flex-shrink:0; background:none; border:none; cursor:pointer; color:#9CA3AF; display:flex; padding:0; transition:opacity .15s; }",
    ".cw-chat-header-close:hover, .cw-chat-header-back:hover { opacity: 0.8; }",
    ".cw-messages { flex:1; overflow-y:auto; padding:16px; background:var(--cw-bg-light); display:flex; flex-direction:column; gap:8px; min-height:100px; }",
    ".cw-messages::-webkit-scrollbar { width:4px; }",
    ".cw-messages::-webkit-scrollbar-thumb { background:rgba(0,0,0,.1); border-radius:2px; }",
    ".cw-msg { display:flex; animation:cw-msg-in .2s ease-out; }",
    ".cw-msg.cw-user { justify-content:flex-end; }",
    ".cw-msg.cw-bot { justify-content:flex-start; }",
    ".cw-msg-bubble { max-width:80%; border-radius:8px; font-size:12px; line-height:1.5; overflow:hidden; }",
    ".cw-msg.cw-user .cw-msg-bubble { color:#fff; }",
    ".cw-msg.cw-bot .cw-msg-bubble { background:#fff; color:var(--cw-color-main); border:1px solid var(--cw-border); }",
    ".cw-msg-bubble .cw-msg-text { padding:8px 12px; }",
    ".cw-msg-bubble img { max-width:100%; max-height:160px; object-fit:cover; display:block; }",
    ".cw-typing { display:none; align-self:flex-start; padding:10px 14px; background:#fff; border:1px solid var(--cw-border); border-radius:8px; gap:4px; align-items:center; margin: 0 16px }",
    ".cw-typing.cw-show { display:flex; }",
    ".cw-typing-dot { width:6px; height:6px; border-radius:50%; background:var(--cw-main); animation:cw-bounce 1.2s infinite; }",
    ".cw-typing-dot:nth-child(2) { animation-delay:.2s; }",
    ".cw-typing-dot:nth-child(3) { animation-delay:.4s; }",
    "@keyframes cw-bounce { 0%,60%,100%{transform:translateY(0); opacity:1} 30%{transform:translateY(-4px); opacity:0.5} }",
    ".cw-input-area { flex-shrink:0; position:relative; }",
    ".cw-pending-img { border-top:1px solid var(--cw-border); background:#fff; padding:8px 12px; display:none; }",
    ".cw-pending-img.cw-show { display:block; }",
    ".cw-pending-img-wrap { position:relative; display:inline-block; }",
    ".cw-pending-img img { max-height:80px; border-radius:6px; object-fit:cover; display:block; }",
    ".cw-pending-img-remove { position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%; background:#6B7280; color:#fff; border:none; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }",
    ".cw-pending-img-remove:hover { background:#374151; }",
    ".cw-emoji-picker { position:absolute; bottom:100%; left:0; right:0; background:#fff; border:1px solid var(--cw-border); border-radius:8px 8px 0 0; box-shadow:0 -4px 12px rgba(0,0,0,.08); padding:8px; max-height:160px; overflow-y:auto; display:none; }",
    ".cw-emoji-picker.cw-show { display:block; }",
    ".cw-emoji-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:2px; }",
    ".cw-emoji-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:16px; background:none; border:none; border-radius:4px; cursor:pointer; transition:background .1s; }",
    ".cw-emoji-btn:hover { background:var(--cw-bg-hover); }",
    ".cw-input-row { display:flex; align-items:center; gap:8px; padding:10px 12px; border-top:1px solid var(--cw-border); background:#fff; }",
    ".cw-chat-input { flex:1; padding:8px 12px; background:var(--cw-bg-light); border:1px solid var(--cw-border); border-radius:6px; font-size:13px; color:var(--cw-color-main); font-family:inherit; outline:none; transition:border-color .2s; }",
    ".cw-chat-input:focus { border-color:var(--cw-main); background:#fff; }",
    ".cw-chat-input::placeholder { color:#9CA3AF; }",
    ".cw-input-actions { display:flex; align-items:center; gap:6px; flex-shrink:0; }",
    ".cw-input-actions button { background:none; border:none; cursor:pointer; color:var(--cw-color-main); display:flex; padding:0; transition:opacity .15s; }",
    ".cw-input-actions button:hover { opacity:.6; }",
    ".cw-input-actions button.cw-active { opacity:.6; }",
    ".cw-loading { display:flex; align-items:center; justify-content:center; padding:40px; background:#fff; }",
    ".cw-spinner { width:28px; height:28px; border:3px solid rgba(0,0,0,.1); border-top-color:var(--cw-main); border-radius:50%; animation:cw-spin .7s linear infinite; }",
    "@keyframes cw-spin { to{transform:rotate(360deg)} }",
    ".cw-error { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; gap:12px; background:#fff; text-align:center; }",
    ".cw-error .cw-error-icon { font-size:40px; }",
    ".cw-error h3 { font-size:15px; font-weight:700; color:var(--cw-color-main); }",
    ".cw-error p { color:#6B7280; font-size:13px; line-height:1.5; }",
    ".cw-img-preview-mask { position:fixed; top:0; left:0; width:100vw; height:100vh; display:none; align-items:center; justify-content:center; z-index:99999; cursor:pointer; pointer-events:auto; }",
    ".cw-img-preview-mask.cw-show { display:flex; }",
    ".cw-img-preview-bg { position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0.5; }",
    ".cw-img-preview-close { position:absolute; top:2rem; right:2rem; width:2.625rem; height:2.625rem; border-radius:50%; background:rgba(0,0,0,.1); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:20; transition:background .2s; border:none; color:#fff; }",
    ".cw-img-preview-close:hover { background:rgba(0,0,0,.3); }",
    ".cw-img-preview-content { position:relative; z-index:10; max-width:80%; max-height:80vh; display:flex; align-items:center; justify-content:center; }",
    ".cw-img-preview-content img { max-width:100%; max-height:80vh; object-fit:contain; border-radius:8px; cursor:default; }",
  ].join("\n");

  /* ================================================================
     BUILD WIDGET
     ================================================================ */
  function buildWidget(io) {
    var host = document.createElement("div");
    host.id = "cw-host";
    host.style.cssText = "all:initial;position:fixed;bottom:0;right:0;z-index:2147483647;pointer-events:none;width:0;height:0;";
    document.body.appendChild(host);

    var shadow = host.attachShadow({ mode: "closed" });
    var styleEl = document.createElement("style");
    styleEl.textContent = SHADOW_CSS;
    shadow.appendChild(styleEl);

    var root = document.createElement("div");
    root.id = "cw-root";
    shadow.appendChild(root);

    window.addEventListener("keyup", function (e) {
      if (e.key === "Escape") {
        if (elImagePreview && elImagePreview.classList.contains("cw-show")) {
          closeImagePreview();
        } else if (view !== "button") {
          switchView("button");
        }
      }
    });

    // =====State========
    var widgetData = null;
    var cfg = null;           // ConfigData
    var view = "button";      // "button" | "form" | "faq" | "chat"
    var formValues = {};
    var chatMessages = [];    // {from, text, image?, unSeenMessage?}
    var socket = null;
    var showEmojiPicker = false;
    var pendingImage = null;
    var showFaqOverlay = false;
    var showNotifOverlay = false;
    var verifyError = false;
    var initialized = false;
    var typingTimer = null;
    var formSubmitting = false;
    var formError = "";

    var verifyErrorCode = "";

    var STORAGE_KEY = "cw_form_" + APP_ID;
    var UID_STORAGE_KEY = "cw_uid_" + APP_ID;
    var SESSION_STORAGE_KEY = "cw_session_time_" + APP_ID;
    var autoStartingSession = false;

    function updateSessionActivity() {
      try { localStorage.setItem(SESSION_STORAGE_KEY, Date.now().toString()); } catch (e) { }
    }

    function checkSessionValidity() {
      var lastActive = parseInt(localStorage.getItem(SESSION_STORAGE_KEY) || "0", 10);
      var now = Date.now();
      return (now - lastActive <= 30 * 60 * 1000);
    }

    function clearSession() {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) { }
    }

    function getOrCreateUid(phone) {
      var stored = null;
      try { stored = localStorage.getItem(UID_STORAGE_KEY); } catch (e) { }
      if (stored) return stored;
      var id = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
      var uid = "cus_" + phone + "-" + id;
      try { localStorage.setItem(UID_STORAGE_KEY, uid); } catch (e) { }
      return uid.trim();
    }
    var savedForm = null;
    try { savedForm = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { }
    if (savedForm) {
      formValues = Object.assign({}, savedForm);
    }

    // =====Elements========
    var elPanel, elBtnWrap, elOverlays;
    var elFormScreen, elFaqScreen, elChatScreen;
    var elFormSubmit;
    var elMessages, elTyping, elChatInput, elPendingImg, elEmojiPicker;
    var elImageInput, elImagePreview;

    // =====Get Avatar URL========
    function avatarUrl() {
      if (cfg.widget_avatar) return cfg.widget_avatar;
      if (widgetData?.picture) return widgetData?.picture;
      var ch = (cfg.widget_name || "S").charAt(0);
      return "https://ui-avatars.com/api/?name=" + encodeURIComponent(ch);
    }

    // =====Get Widget Height========
    function widgetHeight() {
      var base = 500;
      var mob = isMobile();
      if (mob) return Math.min(base * (cfg.mobile_height / 100), window.innerHeight * 0.9);
      if (cfg.web_height_unit === "percent") return Math.min(base * (cfg.web_height / 100), window.innerHeight * 0.9);
      return Math.min(cfg.web_height, window.innerHeight * 0.9);
    }

    // =====Get Button Position========
    function isRight() { return cfg.button_align === "right"; }

    function btnBottom() {
      // if (cfg.button_mode === "rectangle" && view === "button") return 0;
      return isMobile() ? cfg.mobile_button_align_bottom : cfg.web_button_align_bottom;
    }

    function btnSide() {
      // if (cfg.button_mode === "rectangle-horizontal" && view === "button") return 0;
      return cfg.button_align_left_or_right;
    }

    // =====Get Widget Name========
    function widgetName() {
      return cfg.widget_name || widgetData?.name || "Tên trang";
    }

    // =====Get Unseen Count========
    function unseenCount() {
      var count = 0;
      chatMessages.forEach(function (m) {
        if (m.unSeenMessage) {
          var items = 0;
          if (m.text && m.text.trim() !== '') items++;
          if (m.image) {
            items += Array.isArray(m.image) ? m.image.length : 1;
          }
          if (m.media && m.media.length > 0) {
            items += m.media.length;
          }
          if (items === 0) items = 1;
          count += items;
        }
      });
      return count;
    }

    // =====Form validation========
    function isFormValid() {
      return (cfg.welcome_form_fields || [])
        .filter(function (f) { return f.require; })
        .every(function (f) { return (formValues[f.key] || "").trim() !== "" });
    }

    // =====Apply CSS variables========
    function applyTheme() {
      root.style.setProperty("--cw-main", cfg.button_color || "#2c4b94");
      root.style.setProperty("--cw-text", cfg.text_color || "#fff");
    }

    function updatePosition() {
      var b = btnBottom();
      var s = btnSide();
      root.style.bottom = b + "px";
      root.style.left = isRight() ? "auto" : s + "px";
      root.style.right = isRight() ? s + "px" : "auto";
    }

    // =====Render button========
    function renderButton() {
      elBtnWrap.innerHTML = "";
      elBtnWrap.style.display = "";
      elBtnWrap.style.pointerEvents = "auto";

      // Overlays
      elOverlays = document.createElement("div");
      elOverlays.id = "cw-overlays";
      if (isRight()) {
        elOverlays.style.right = "0";
      } else {
        elOverlays.style.left = "0";
      }
      elBtnWrap.appendChild(elOverlays);

      var btn;
      switch (cfg.button_mode) {
        case "rectangle":
          const alignBottom = (isMobile() ? cfg.mobile_button_align_bottom : cfg.web_button_align_bottom) === 0;
          const borderRadius = alignBottom ? "0.5rem 0.5rem 0 0" : "0.5rem";
          btn = document.createElement("div");
          btn.className = "cw-btn-rect";
          btn.style.height = cfg.button_height + "px";
          btn.style.width = cfg.button_width + "px";
          btn.style.backgroundColor = cfg.button_color;
          btn.style.borderRadius = borderRadius;
          btn.innerHTML = getButtonIcon(cfg.button_icon, 20, cfg.text_color) +
            '<span style="color:' + esc(cfg.text_color) + '">' + esc(cfg.button_title || "Let's chat") + '</span>';
          break;

        case "rectangle-horizontal":
          const alignSideLeftRight = cfg.button_align_left_or_right === 0;
          let rounded;
          if (cfg.button_align === "left") {
            rounded = alignSideLeftRight ? "0 0.5rem 0.5rem 0" : "0.5rem";
          } else {
            rounded = alignSideLeftRight ? "0.5rem 0 0 0.5rem" : "0.5rem";
          }
          btn = document.createElement("div");
          btn.className = "cw-btn-rect-h";
          btn.style.width = cfg.button_width + "px";
          btn.style.height = cfg.button_height + "px";
          btn.style.backgroundColor = cfg.button_color;
          btn.style.borderRadius = rounded;
          btn.innerHTML = getButtonIcon(cfg.button_icon, 20, cfg.text_color) +
            '<span style="color:' + esc(cfg.text_color) + '">' + esc(cfg.button_title || "Let's chat") + '</span>';
          break;

        default:
          btn = document.createElement("div");
          btn.className = "cw-btn-circle";
          if (cfg.button_animation) btn.classList.add("cw-btn-ping");
          btn.style.width = cfg.button_width + "px";
          btn.style.height = cfg.button_height + "px";
          btn.style.backgroundColor = cfg.button_color;
          btn.innerHTML = getButtonIcon(cfg.button_icon, ((cfg.button_width + cfg.button_height) / 2) * 0.5, cfg.text_color);
          break;
      }

      btn.addEventListener("click", handleOpenPanel);
      elBtnWrap.appendChild(btn);

      // Notification badge
      var uc = unseenCount();
      if (cfg.notification && uc > 0) {
        var badge = document.createElement("div");
        badge.className = "cw-badge";
        badge.textContent = uc > 9 ? "9+" : uc;
        btn.appendChild(badge);
      }

      renderOverlays();
    }

    // =====Render overlays on button========
    function renderOverlays() {
      if (!elOverlays) return;
      elOverlays.innerHTML = "";

      // FAQ overlay
      var locale = cfg.locale || "vi";
      var faqData = cfg.faq_trans && cfg.faq_trans[locale];
      if (showFaqOverlay && faqData && faqData.show_out_side) {
        var questions = (faqData.questions || []).filter(function (q) { return q.enable; });
        if (questions.length > 0) {
          var faqOl = document.createElement("div");
          faqOl.style.maxHeight = "320px";
          faqOl.style.overflowY = "auto";
          faqOl.style.paddingTop = "12px";
          if (isRight()) {
            faqOl.style.paddingRight = "12px";
          } else {
            faqOl.style.paddingLeft = "12px";
          }
          if (isRight()) faqOl.style.direction = "rtl";

          questions.forEach(function (q, idx) {
            var pill = document.createElement("div");
            pill.className = "cw-faq-pill";
            if (isRight()) pill.style.direction = "ltr";
            pill.innerHTML = '<span>' + esc(q.label) + '</span>';
            pill.addEventListener("click", function () {
              handleSelectFaq(q.label);
            });

            if (idx === 0) {
              var closeBtn = document.createElement("button");
              closeBtn.className = "cw-faq-pill-close";
              if (isRight()) {
                closeBtn.style.right = "0";
                closeBtn.style.transform = "translate(25%,-25%)"
              } else {
                closeBtn.style.left = "0";
                closeBtn.style.transform = "translate(0,-50%)"
              }
              closeBtn.innerHTML = SVG_ARROW_DOWN;
              closeBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                showFaqOverlay = false;
                renderOverlays();
              });
              pill.appendChild(closeBtn);
            }

            faqOl.appendChild(pill);
          });

          elOverlays.appendChild(faqOl);
        }
      }

      // Notification overlay
      // var uc = unseenCount();
      if (showNotifOverlay && cfg.button_mode === "circle") {
        var nEl = document.createElement("div");
        nEl.className = "cw-notif-overlay";

        var unread = cfg.notification ? chatMessages.filter(function (m) { return m.unSeenMessage; }) : [];
        var botMessages = [];

        var locale = cfg.locale || "vi";
        if (cfg.welcome_message && cfg.welcome_message.enabled && !!cfg.welcome_message.message_translate[locale]?.length) {
          var wMsgs = (cfg.welcome_message.message_translate && cfg.welcome_message.message_translate[locale]) || [];
          wMsgs.forEach(function (m) {
            var botMsg = {
              from: "admin",
              text: m.message,
              unSeenMessage: true
            };
            if (m.image && m.image.length > 0) {
              botMsg.image = m.image;
            }
            botMessages.push(botMsg);
          });
        }

        var totalMessages = unread.concat(botMessages);
        if (totalMessages.length === 0) return;

        var bubbles = [];

        totalMessages.forEach(function (msg) {
          if (msg.text) {
            bubbles.push({ type: 'text', content: msg.text, msg: msg });
          }
          if (msg.image) {
            if (Array.isArray(msg.image)) {
              msg.image.forEach(function (img) {
                bubbles.push({ type: 'image', content: img, msg: msg });
              });
            } else {
              bubbles.push({ type: 'image', content: msg.image, msg: msg });
            }
          }
          if (msg.media && msg.media.length > 0) {
            msg.media.forEach(function (md) {
              if (md.name) {
                bubbles.push({ type: 'image', content: md.name, msg: msg });
              }
            });
          }
        });

        var html = '<div class="cw-notif-container ' + (isRight() ? "right" : "left") + '">';
        // var hasCloseBtn = false;
        bubbles.forEach(function (bubble, index) {
          html += '<div class="cw-notif-item" data-index="' + index + '">';

          if (bubble.type === 'text') {
            html += '<p>' + esc(bubble.content) + '</p>';
          } else {
            html += '<img src="' + esc(bubble.content) + '" alt="message" />';
          }

          if (index === 0) {
            html += '<button class="cw-notif-close-item-btn ' + (isRight() ? "right" : "left") + '" data-index="' + index + '">' + SVG_CLOSE_SM + '</button>';
            // hasCloseBtn = true;
          }
          html += '</div>';
        });
        html += '</div>';

        nEl.innerHTML = html;

        nEl.querySelectorAll(".cw-notif-item").forEach(function (item) {
          item.addEventListener("click", function () {
            chatMessages.forEach(function (m) { m.unSeenMessage = false; });
            showNotifOverlay = false;
            if (startedSession) {
              switchView("chat");
            } else if (cfg.is_show_faq) {
              switchView("faq");
            } else {
              switchView("form")
            }
          });
        });

        var closeBtn = nEl.querySelector(".cw-notif-close-item-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            showNotifOverlay = false;
            renderOverlays();
          });
        }

        elOverlays.appendChild(nEl);
      }
    }

    function buildPanelHeader() {
      var html = '<div class="cw-panel-header" style="background-color:' + esc(cfg.button_color) + '">';
      html += '<button class="cw-panel-header-close cw-close-btn">' + SVG_CLOSE + '</button>';
      html += '<div class="cw-panel-header-avatar"><img src="' + esc(avatarUrl()) + '" alt="avatar" onerror="this.style.display=\'none\'" /></div>';
      html += '<div class="cw-panel-header-name" style="color:' + esc(cfg.text_color) + '">' + esc(widgetName()) + '</div>';
      if (cfg.form_title) {
        html += '<div class="cw-panel-header-desc" style="color:' + esc(cfg.text_color) + '">' + esc(cfg.form_title) + '</div>';
      }
      html += '</div>';
      return html;
    }

    function renderFormScreen() {
      if (verifyError) {
        // var html = buildPanelHeader();
        var html = '<div class="cw-chat-header" style="background-color:' + esc(cfg.button_color) + '">';
        html += '<button class="cw-error-header-close cw-close-btn">' + SVG_CLOSE + '</button>';
        html += "</div>";
        html += '<div class="cw-form-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;">';
        html += '<p style="font-size:14px;color:#6B7280;line-height:1.5;">' + (ERROR_CODE?.[verifyErrorCode] || "Đã có lỗi xảy ra, vui lòng thử lại") + '</p>';
        html += '<a href="https://app.so9.vn/crm/connect-channel" target="_blank" rel="noreferrer" style="color:#3B82F6;font-size:13px;text-decoration:underline;">Kết nối kênh tại đây</a>';
        html += '</div>';
        html += '<div class="cw-form-footer">';
        html += '<p class="cw-powered">Power by <a href="https://so9.vn/" target="_blank" rel="noreferrer">SO9</a></p>';
        html += '</div>';
        elFormScreen.innerHTML = html;
        elFormScreen.querySelector(".cw-close-btn").addEventListener("click", handleClose);
        return;
      }
      var locale = cfg.locale || "vi";
      var fields = cfg.welcome_form_fields || [];

      var html = buildPanelHeader();
      html += '<div class="cw-form-body">';
      html += '<div style="display:flex;flex-direction:column;gap:12px;">';

      fields.forEach(function (field) {
        html += '<div class="cw-form-group">';
        html += '<label class="cw-form-label">';
        html += esc(field.label_trans[locale] || field.key);
        if (field.require) html += ' <span class="cw-req">*</span>';
        html += '</label>';

        var ph = esc(field.placeholder_trans[locale] || "");
        var val = esc(formValues[field.key] || "");

        if (field.type === "select") {
          html += '<select class="cw-form-select" data-key="' + esc(field.key) + '">';
          html += '<option value="">' + ph + '</option>';
          ((field.extra && field.extra.options) || []).forEach(function (opt) {
            var selected = formValues[field.key] === opt.value ? " selected" : "";
            html += '<option value="' + esc(opt.value) + '"' + selected + '>' + esc(opt.label_trans[locale] || opt.value) + '</option>';
          });
          html += '</select>';
        } else if (field.type === "textarea") {
          html += '<textarea class="cw-form-textarea" data-key="' + esc(field.key) + '" placeholder="' + ph + '" rows="2">' + val + '</textarea>';
        } else {
          var inputType = field.type === "number" ? "number" : "text";
          html += '<input class="cw-form-input" data-key="' + esc(field.key) + '" type="' + inputType + '" placeholder="' + ph + '" value="' + val + '" />';
        }

        html += '</div>';
      });

      html += '</div></div>';

      html += '<div class="cw-form-footer">';
      if (formError) {
        html += '<p style="font-size:12px;color:#EF4444;margin-bottom:8px;text-align:center;">' + esc(formError) + '</p>';
      }
      html += '<button class="cw-submit-btn cw-form-submit-btn" style="background-color:' + esc(cfg.button_color) + ';color:' + esc(cfg.text_color) + '">';
      html += 'Tiếp tục</button>';
      html += '<p class="cw-powered">Power by <a href="https://so9.vn/" target="_blank" rel="noreferrer">SO9</a></p>';
      html += '</div>';

      elFormScreen.innerHTML = html;

      // Bind form events
      elFormScreen.querySelectorAll(".cw-form-input, .cw-form-textarea, .cw-form-select").forEach(function (el) {
        var key = el.dataset.key;
        el.addEventListener("input", function () {
          formValues[key] = el.value;
          updateFormSubmitState();
          el.style.borderColor = "";
          var errEl = el.parentNode.querySelector(".cw-form-error");
          if (errEl) errEl.remove();
        });
        el.addEventListener("change", function () {
          formValues[key] = el.value;
          updateFormSubmitState();
          el.style.borderColor = "";
          var errEl = el.parentNode.querySelector(".cw-form-error");
          if (errEl) errEl.remove();
        });
        el.addEventListener("keydown", function (e) { e.stopPropagation(); });
        el.addEventListener("keyup", function (e) { e.stopPropagation(); });
        el.addEventListener("keypress", function (e) { e.stopPropagation(); });
      });

      elFormScreen.querySelector(".cw-close-btn").addEventListener("click", handleClose);

      elFormSubmit = elFormScreen.querySelector(".cw-form-submit-btn");
      elFormSubmit.addEventListener("click", handleSubmitForm);
      updateFormSubmitState();
    }

    function updateFormSubmitState() {
      if (!elFormSubmit) return;
      elFormSubmit.disabled = !isFormValid() || formSubmitting;
      elFormSubmit.textContent = formSubmitting ? "Đang xử lý..." : "Tiếp tục";
    }

    function renderFaqScreen() {
      var locale = cfg.locale || "vi";
      var questions = (cfg.faq_trans && cfg.faq_trans[locale] && cfg.faq_trans[locale].questions) || [];

      var html = buildPanelHeader();
      html += '<div class="cw-faq-body"><div style="display:flex;flex-direction:column;gap:8px;">';

      questions.forEach(function (q, i) {
        if (!q.enable) return;
        html += '<div class="cw-faq-item" data-idx="' + i + '">';
        html += '<span>' + esc(q.label) + '</span>';
        html += '<div class="cw-faq-send" style="color:' + esc(cfg.button_color) + '">' + SVG_SEND + '</div>';
        html += '</div>';
      });

      html += '</div></div>';

      html += '<div class="cw-faq-footer">';
      html += '<button class="cw-submit-btn cw-faq-chat-btn" style="background-color:' + esc(cfg.button_color) + ';color:' + esc(cfg.text_color) + '">';
      html += SVG_SEND + ' Nhắn tin ngay</button>';
      html += '<p class="cw-powered">Power by <a href="https://so9.vn/" target="_blank" rel="noreferrer">SO9</a></p>';
      html += '</div>';

      elFaqScreen.innerHTML = html;

      elFaqScreen.querySelector(".cw-close-btn").addEventListener("click", handleClose);

      elFaqScreen.querySelectorAll(".cw-faq-item").forEach(function (el) {
        el.addEventListener("click", function () {
          var idx = parseInt(el.dataset.idx);
          var q = questions[idx];
          if (q) handleSelectFaq(q.label);
        });
      });

      elFaqScreen.querySelector(".cw-faq-chat-btn").addEventListener("click", function () {
        switchView("chat");
      });
    }

    function renderChatScreen() {
      var html = '';

      // Header
      html += '<div class="cw-chat-header" style="background-color: ' + esc(cfg.button_color) + '; border-bottom: none;">';
      html += '<button class="cw-chat-header-back cw-chat-back-btn" style="color: ' + esc(cfg.text_color) + '">' + SVG_BACK + '</button>';
      html += '<div class="cw-chat-header-avatar"><img src="' + esc(avatarUrl()) + '" alt="avatar" onerror="this.style.display=\'none\'" /></div>';
      html += '<div class="cw-chat-header-info">';
      html += '<div class="cw-chat-header-name" style="color: ' + esc(cfg.text_color) + '">' + esc(widgetName()) + '</div>';
      if (cfg.widget_description) {
        html += '<div class="cw-chat-header-status" style="color: ' + esc(cfg.text_color) + '">' + esc(cfg.widget_description) + '</div>';
      }
      html += '</div>';
      html += '<button class="cw-chat-header-close cw-chat-close-btn" style="color: ' + esc(cfg.text_color) + '">' + SVG_CLOSE_SM + '</button>';
      html += '</div>';

      // Messages
      html += '<div class="cw-messages" id="cw-msg-list"></div>';

      // Typing indicator
      html += '<div class="cw-typing" id="cw-typing-ind"><div class="cw-typing-dot"></div><div class="cw-typing-dot"></div><div class="cw-typing-dot"></div></div>';

      // Input area
      html += '<div class="cw-input-area">';

      // Pending image
      html += '<div class="cw-pending-img" id="cw-pending-img"><div class="cw-pending-img-wrap"><img id="cw-pending-img-el" /><button class="cw-pending-img-remove" id="cw-pending-rm">\u00D7</button></div></div>';

      // Emoji picker
      html += '<div class="cw-emoji-picker" id="cw-emoji-picker"><div class="cw-emoji-grid">';
      EMOJIS.forEach(function (em) {
        html += '<button class="cw-emoji-btn" data-emoji="' + em + '">' + em + '</button>';
      });
      html += '</div></div>';

      // Input row
      html += '<div class="cw-input-row">';
      html += '<input class="cw-chat-input" id="cw-chat-input" placeholder="Nhập tin nhắn" />';
      html += '<div class="cw-input-actions">';
      html += '<button id="cw-emoji-toggle">' + SVG_EMOJI + '</button>';
      html += '<button id="cw-img-toggle">' + SVG_IMAGE + '</button>';
      html += '<button id="cw-send-btn">' + SVG_SEND + '</button>';
      html += '</div>';
      html += '<input type="file" accept="image/*" id="cw-file-input" style="display:none" />';
      html += '</div>';

      html += '</div>';

      elChatScreen.innerHTML = html;

      elMessages = shadow.getElementById("cw-msg-list");
      elTyping = shadow.getElementById("cw-typing-ind");
      elChatInput = shadow.getElementById("cw-chat-input");
      elPendingImg = shadow.getElementById("cw-pending-img");
      elEmojiPicker = shadow.getElementById("cw-emoji-picker");
      elImageInput = shadow.getElementById("cw-file-input");

      elChatScreen.querySelector(".cw-chat-back-btn").addEventListener("click", function () {
        if (cfg.is_show_faq) switchView("faq");
        else {
          startedSession = false;
          chatMessages = [];
          switchView("form");
        };
      });
      elChatScreen.querySelector(".cw-chat-close-btn").addEventListener("click", handleClose);

      shadow.getElementById("cw-send-btn").addEventListener("click", handleSendChat);
      elChatInput.addEventListener("keydown", function (e) {
        e.stopPropagation();
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendChat();
        }
      });
      elChatInput.addEventListener("keyup", function (e) { e.stopPropagation(); });
      elChatInput.addEventListener("keypress", function (e) { e.stopPropagation(); });
      elChatInput.addEventListener("focus", function () {
        showEmojiPicker = false;
        elEmojiPicker.classList.remove("cw-show");
        shadow.getElementById("cw-emoji-toggle").classList.remove("cw-active");
      });
      elChatInput.addEventListener("input", function () {
        if (socket) socket.emit("widget:typing");
      });

      shadow.getElementById("cw-emoji-toggle").addEventListener("click", function () {
        showEmojiPicker = !showEmojiPicker;
        elEmojiPicker.classList.toggle("cw-show", showEmojiPicker);
        this.classList.toggle("cw-active", showEmojiPicker);
      });

      elEmojiPicker.querySelectorAll(".cw-emoji-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          elChatInput.value += btn.dataset.emoji;
          elChatInput.focus();
        });
      });

      shadow.getElementById("cw-img-toggle").addEventListener("click", function () {
        elImageInput.click();
      });

      elImageInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
          alert("File size must be less than " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
          return;
        }
        pendingImage = file;
        shadow.getElementById("cw-pending-img-el").src = URL.createObjectURL(file);
        elPendingImg.classList.add("cw-show");
        elImageInput.value = "";
      });

      shadow.getElementById("cw-pending-rm").addEventListener("click", function () {
        pendingImage = null;
        elPendingImg.classList.remove("cw-show");
      });

      renderMessages();
    }

    function renderMessages() {
      if (!elMessages) return;
      elMessages.innerHTML = "";

      chatMessages.forEach(function (msg) {
        appendMessageEl(msg);
      });

      elMessages.scrollTop = elMessages.scrollHeight;
    }

    function appendMessageEl(msg) {
      if (!elMessages) return;
      var el = document.createElement("div");
      el.className = "cw-msg " + (msg.from === "user" ? "cw-user" : "cw-bot");

      var bubbleStyle = msg.from === "user"
        ? 'style="background-color:' + esc(cfg.button_color) + '"'
        : '';

      var mediaUrls = [];
      if (msg.media && msg.media.length > 0) {
        msg.media.forEach(function (m) { if (m.name) mediaUrls.push(m.name); });
      } else if (msg.image) {
        if (Array.isArray(msg.image)) {
          mediaUrls = msg.image;
        } else {
          mediaUrls.push(msg.image);
        }
      }

      var bubbleHtml = '<div class="cw-msg-bubble" ' + bubbleStyle + '>';
      if (msg.text) {
        bubbleHtml += '<div class="cw-msg-text">' + esc(msg.text) + '</div>';
      }
      mediaUrls.forEach(function (url) {
        bubbleHtml += '<img src="' + esc(url) + '" alt="image" style="cursor:pointer;" class="cw-msg-image" data-url="' + esc(url) + '" />';
      });
      bubbleHtml += '</div>';
      el.innerHTML = bubbleHtml;

      var imgEls = el.querySelectorAll(".cw-msg-image");
      imgEls.forEach(function (imgEl) {
        imgEl.addEventListener("click", function () {
          var url = this.getAttribute("data-url");
          openImagePreview(url);
        });
      });

      elMessages.appendChild(el);
      elMessages.scrollTop = elMessages.scrollHeight;
    }

    function switchView(newView) {
      view = newView;
      updatePosition();

      elBtnWrap.style.display = "none";
      elPanel.classList.add("cw-hidden");
      elFormScreen.style.display = "none";
      elFaqScreen.style.display = "none";
      elChatScreen.style.display = "none";

      switch (newView) {
        case "button":
          elBtnWrap.style.display = "";
          renderButton();
          break;
        case "form":
          elPanel.classList.remove("cw-hidden");
          elPanel.style.height = widgetHeight() + "px";
          elFormScreen.style.display = "flex";
          renderFormScreen();
          break;
        case "faq":
          elPanel.classList.remove("cw-hidden");
          elPanel.style.height = widgetHeight() + "px";
          elFaqScreen.style.display = "flex";
          renderFaqScreen();
          break;
        case "chat":
          chatMessages.forEach(function (m) { m.unSeenMessage = false; });
          elPanel.classList.remove("cw-hidden");
          elPanel.style.height = widgetHeight() + "px";
          elChatScreen.style.display = "flex";
          renderChatScreen();
          break;
        default:
          break;
      }
    }

    var startedSession = false;

    function handleOpenPanel() {
      if (savedForm) {
        if (checkSessionValidity()) {
          updateSessionActivity();
          if (!startedSession && autoStartingSession) {
            if (cfg.is_show_faq) {
              switchView("faq");
            } else {
              switchView("chat");
            }
            return;
          }
        } else {
          clearSession();
          startedSession = false;
        }
      }

      if (startedSession) {
        updateSessionActivity();
        switchView("chat");
        return;
      }
      if (savedForm) {
        formValues = savedForm;
      }
      switchView("form");
    }

    function handleClose() {
      pendingImage = null;
      showEmojiPicker = false;
      closeImagePreview();
      switchView("button");
    }

    function handleSubmitForm() {
      if (!isFormValid() || formSubmitting) return;

      var fields = cfg.welcome_form_fields || [];
      var hasError = false;

      elFormScreen.querySelectorAll(".cw-form-error").forEach(function (el) { el.remove(); });
      elFormScreen.querySelectorAll(".cw-form-input").forEach(function (el) { el.style.borderColor = ""; });

      fields.forEach(function (f) {
        var val = (formValues[f.key] || "").trim();
        var errorMsg = "";

        if (val !== "") {
          if (f.key === "phone" || f.key === "phone_number") {
            var phoneRegex = /^(\+84|84|0[3|5|7|8|9])[0-9]{8}$/;
            if (!phoneRegex.test(val.replace(/\s+/g, ''))) {
              errorMsg = "Số điện thoại không hợp lệ";
            }
          } else if (f.key === "email") {
            var emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(val)) {
              errorMsg = "Email không hợp lệ";
            }
          }
          else if (f.type === "number") {
            if (isNaN(Number(val))) {
              errorMsg = "Giá trị phải là số hợp lệ";
            }
          }
        }

        if (errorMsg) {
          hasError = true;
          var inputEl = elFormScreen.querySelector('[data-key="' + f.key + '"]');
          if (inputEl) {
            inputEl.style.borderColor = "#EF4444";
            var errEl = document.createElement("div");
            errEl.className = "cw-form-error";
            errEl.style.color = "#EF4444";
            errEl.style.fontSize = "12px";
            errEl.style.marginTop = "4px";
            errEl.innerText = errorMsg;
            inputEl.parentNode.appendChild(errEl);
          }
        }
      });

      if (hasError) return;

      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues)); } catch (e) { }
      savedForm = Object.assign({}, formValues);
      updateSessionActivity();

      formSubmitting = true;
      formError = "";
      updateFormSubmitState();

      var phone = formValues.phone || formValues.phone_number || "";
      var uid = getOrCreateUid(phone);

      var customerData = Object.assign({}, formValues, { uid: uid });
      const data = {
        channel_id: APP_ID,
        origin: window.location.origin || "",
        customer_info: customerData
      }
      socket.emit("widget:start", data);
    }

    function handleSelectFaq(label) {
      if (!startedSession) {
        switchView("form");
        return;
      }

      updateSessionActivity();
      chatMessages = [
        { from: "user", text: label },
      ];
      showFaqOverlay = false;
      switchView("chat");

      setTimeout(function () {
        if (socket && socket.connected) {
          socket.emit("widget:message", { text: label });
        }
      }, 300);
    }

    async function handleSendChat() {
      var text = elChatInput ? elChatInput.value.trim() : "";
      if (!text && !pendingImage) return;

      console.log("Check handleSendChat: ", {
        text,
        pendingImage
      });
      

      updateSessionActivity();

      if (text) {
        var msg = { from: "user", text: text };
        chatMessages.push(msg);
        appendMessageEl(msg);
        if (socket) socket.emit("widget:message", { text: text });
        elChatInput.value = "";
      }

      if (pendingImage) {
        var imgMsg = { from: "user", text: "", media: [{ name: URL.createObjectURL(pendingImage) }] };
        chatMessages.push(imgMsg);
        appendMessageEl(imgMsg);

        const base64 = await convertImageToBase64(pendingImage);

        const rawBase64 = base64?.split(',')?.[1];

        if (socket) socket.emit("widget:message", { image: [{ base64: rawBase64, file_name: pendingImage.name, mimetype: pendingImage.type }] });
        pendingImage = null;
        if (elPendingImg) elPendingImg.classList.remove("cw-show");
      }

      showEmojiPicker = false;
      if (elEmojiPicker) elEmojiPicker.classList.remove("cw-show");
    }


    function triggerWelcomeMessages() {
      if (!cfg.welcome_message || !cfg.welcome_message.enabled) return;

      var locale = cfg.locale || "vi";
      var msgs = (cfg.welcome_message.message_translate && cfg.welcome_message.message_translate[locale]) || [];
      if (msgs.length === 0) return;

      var delay = (cfg.welcome_message.delay || 1) * 1000;

      setTimeout(function () {
        if (view === "chat") {
          renderMessages();
        } else if (view === "button") {
          if (cfg.button_mode === "circle") {
            showNotifOverlay = true;
          }
          renderButton();
        }
      }, delay);
    }

    function openImagePreview(src) {
      if (!elImagePreview) return;
      elImagePreview.innerHTML = [
        '<div class="cw-img-preview-bg"></div>',
        '<button class="cw-img-preview-close">',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        '</button>',
        '<div class="cw-img-preview-content">',
        '  <img src="' + esc(src) + '" alt="preview" />',
        '</div>'
      ].join("");

      elImagePreview.classList.add("cw-show");

      elImagePreview.querySelector(".cw-img-preview-bg").addEventListener("click", closeImagePreview);
      elImagePreview.querySelector(".cw-img-preview-close").addEventListener("click", closeImagePreview);
    }

    function closeImagePreview() {
      if (elImagePreview) {
        elImagePreview.classList.remove("cw-show");
        elImagePreview.innerHTML = "";
      }
    }

    function init() {
      if (initialized) return;
      initialized = true;

      applyTheme();

      // Build initial DOM structure
      root.innerHTML = '';
      root.style.pointerEvents = "auto";

      // Panel
      elPanel = document.createElement("div");
      elPanel.id = "cw-panel";
      elPanel.classList.add("cw-hidden");

      elFormScreen = document.createElement("div");
      elFormScreen.id = "cw-form-screen";
      elFormScreen.style.display = "none";
      elPanel.appendChild(elFormScreen);

      elFaqScreen = document.createElement("div");
      elFaqScreen.id = "cw-faq-screen";
      elFaqScreen.style.display = "none";
      elPanel.appendChild(elFaqScreen);

      elChatScreen = document.createElement("div");
      elChatScreen.id = "cw-chat-screen";
      elChatScreen.style.display = "none";
      elPanel.appendChild(elChatScreen);

      root.appendChild(elPanel);

      // Button wrapper
      elBtnWrap = document.createElement("div");
      elBtnWrap.id = "cw-btn-wrap";
      root.appendChild(elBtnWrap);

      // Image Preview
      elImagePreview = document.createElement("div");
      elImagePreview.className = "cw-img-preview-mask";
      root.appendChild(elImagePreview);

      if (savedForm && Object.keys(savedForm).length > 0) {
        if (checkSessionValidity()) {
          formValues = savedForm;
          autoStartingSession = true;

          var phone = formValues.phone || formValues.phone_number || "";
          var uid = getOrCreateUid(phone);
          var customerData = Object.assign({}, formValues, { uid: uid });
          const data = {
            channel_id: APP_ID,
            origin: window.location.origin || "",
            customer_info: customerData
          }
          if (socket && socket.connected) {
            socket.emit("widget:start", data);
          }
        } else {
          clearSession();
          formValues = savedForm;
        }
      }

      var locale = cfg.locale || "vi";
      var faqData = cfg.faq_trans && cfg.faq_trans[locale];
      if (faqData && faqData.show_out_side) {
        var hasEnabled = (faqData.questions || []).some(function (q) { return q.enable; });
        showFaqOverlay = hasEnabled;
      }

      switchView("button");

      if (cfg.auto_open) {
        setTimeout(function () {
          if (view === "button") handleOpenPanel();
        }, 500);
      }

      triggerWelcomeMessages();

      window.addEventListener("resize", function () {
        updatePosition();
        if (view !== "button" && elPanel) {
          elPanel.style.height = widgetHeight() + "px";
        }
      });
    }

    socket = io(SERVER_URL, { transports: ["websocket", "polling"] });

    socket.on("connect", function () {
      socket.emit("widget:verify", {
        channel_id: APP_ID,
        origin: window.location.origin || ""
      });
    });

    socket.on("widget:verify:ok", function (message) {
      widgetData = message.widget;
      cfg = message.widget.widget_setting;
      verifyError = false;
      if (!initialized) init();
    });

    socket.on("widget:verify:error", function (message) {
      cfg = Object.assign({}, data_default);
      verifyError = true;
      verifyErrorCode = message?.error_code;
      if (!initialized) init();
    });

    socket.on("widget:start:ok", function (message) {
      formSubmitting = false;
      formError = "";
      startedSession = true;
      chatMessages = [];

      if (!autoStartingSession) {
        if (cfg.is_show_faq) {
          switchView("faq");
        } else {
          switchView("chat");
        }
      }
      autoStartingSession = false;
    });

    socket.on("widget:start:error", function (message) {
      formSubmitting = false;
      formError = (message && message.message) || "Đã có lỗi xảy ra, vui lòng thử lại";
      switchView("form");
    });

    socket.on("widget:history", function (msgs) {
      chatMessages = [];
      console.log("Check msgs: ", msgs);

      if (Array.isArray(msgs.messages)) {
        msgs.messages.forEach(function (m) {
          chatMessages.push(m);
        });
      }
      if (view === "chat") renderMessages();
    });

    socket.on("widget:message", function (msg) {
      if (msg.from === "admin" || msg.from === "bot") {
        updateSessionActivity();
        msg.unSeenMessage = (view !== "chat");
        chatMessages.push(msg);

        if (view === "chat") {
          appendMessageEl(msg);
        } else {
          if (view === "button") {
            if (cfg.notification && cfg.button_mode === "circle") {
              showNotifOverlay = true;
            }
            renderButton();
          }
        }
      }
    });

    socket.on("widget:admin:start-typing", function () {
      if (elTyping) {
        elTyping.classList.add("cw-show");
        if (elMessages) elMessages.scrollTop = elMessages.scrollHeight;
        // clearTimeout(typingTimer);
        // typingTimer = setTimeout(function () {
        //   if (elTyping) elTyping.classList.remove("cw-show");
        // }, 2000);
      }
    });

    socket.on("widget:admin:stop-typing", function () {
      if (elTyping) {
        elTyping.classList.remove("cw-show");
        if (elMessages) elMessages.scrollTop = elMessages.scrollHeight;
      }
    });

    socket.on("disconnect", function () {
      console.log("[ChatWidget] Socket disconnected");
    });
  }

  /* ================================================================
     BOOTSTRAP
     ================================================================ */
  function bootstrap() {
    if (typeof window.io !== "undefined") {
      buildWidget(window.io);
    } else {
      loadScript(SERVER_URL + "socket.io/socket.io.js", function () {
        buildWidget(window.io);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
