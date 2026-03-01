/* global window, document */
(() => {
  const REACTION_SET = ["👍", "❤️", "😂", "😮", "🙌"];
  const REACTION_KEYS = {
    "👍": "thumbs",
    "❤️": "heart",
    "😂": "laugh",
    "😮": "wow",
    "🙌": "clap",
  };
  const QUICK_REPLIES = ["Sounds good", "Tell me more", "On it", "Love that", "Thanks!"];

  const el = {
    searchInput: document.getElementById("searchInput"),
    conversationList: document.getElementById("conversationList"),
    emptyState: document.getElementById("emptyState"),
    chatView: document.getElementById("chatView"),
    messageList: document.getElementById("messageList"),
    messagesWrap: document.getElementById("messagesWrap"),
    typingIndicator: document.getElementById("typingIndicator"),
    typingName: document.getElementById("typingName"),
    quickReplies: document.getElementById("quickReplies"),
    composerForm: document.getElementById("composerForm"),
    composerInput: document.getElementById("composerInput"),
    sendBtn: document.getElementById("sendBtn"),
    clearSelectionBtn: document.getElementById("clearSelectionBtn"),
    activeTitle: document.getElementById("activeTitle"),
    activeSub: document.getElementById("activeSub"),
    activeAvatar: document.getElementById("activeAvatar"),
  };

  const state = {
    conversations: [],
    selectedId: null,
    query: "",
    typing: { visible: false, timeoutId: null, cycleId: null },
  };

  function cloneSeed() {
    const seed = window.__PENPCHAT_SEED__ || [];
    if (typeof structuredClone === "function") return structuredClone(seed);
    return JSON.parse(JSON.stringify(seed));
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function getConversationById(id) {
    return state.conversations.find((c) => c.id === id) || null;
  }

  function getLastMessage(conv) {
    return conv.messages[conv.messages.length - 1] || null;
  }

  function setSelected(id) {
    state.selectedId = id;
    if (id) {
      const conv = getConversationById(id);
      if (conv) conv.unread = 0;
    }
    stopTypingSimulation();
    render();
    if (state.selectedId) startTypingSimulation();
  }

  function matchesQuery(conv, queryLower) {
    if (!queryLower) return true;
    const last = getLastMessage(conv);
    const preview = last ? last.text : "";
    return (
      conv.name.toLowerCase().includes(queryLower) || preview.toLowerCase().includes(queryLower)
    );
  }

  function renderSidebar() {
    const queryLower = state.query.trim().toLowerCase();
    const filtered = state.conversations.filter((c) => matchesQuery(c, queryLower));

    el.conversationList.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "sidebar-empty";
      empty.textContent = "No conversations found";
      empty.dataset.testid = "no-conversations";
      el.conversationList.append(empty);
      return;
    }

    for (const conv of filtered) {
      const last = getLastMessage(conv);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "conversation";
      btn.dataset.conversationId = conv.id;
      btn.dataset.testid = `conversation-${conv.id}`;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", String(conv.id === state.selectedId));

      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = conv.initials;
      avatar.style.background = conv.avatarBg || avatar.style.background;
      avatar.setAttribute("aria-hidden", "true");

      const main = document.createElement("div");
      main.className = "conv-main";

      const top = document.createElement("div");
      top.className = "conv-top";

      const name = document.createElement("div");
      name.className = "conv-name";
      name.textContent = conv.name;

      const time = document.createElement("div");
      time.className = "conv-time";
      time.textContent = last ? formatTime(last.ts) : "";

      top.append(name, time);

      const preview = document.createElement("div");
      preview.className = "conv-preview";
      preview.textContent = last ? last.text : "";

      main.append(top, preview);

      const badge = document.createElement("div");
      if (conv.unread > 0) {
        badge.className = "conv-badge";
        badge.textContent = String(conv.unread);
        badge.setAttribute("aria-label", `${conv.unread} unread`);
      } else {
        badge.style.width = "22px";
      }

      btn.append(avatar, main, badge);
      btn.addEventListener("click", () => setSelected(conv.id));

      el.conversationList.append(btn);
    }
  }

  function renderReactions(message) {
    const wrap = document.createElement("div");
    wrap.className = "reactions";
    wrap.dataset.testid = `reactions-${message.id}`;

    for (const emoji of REACTION_SET) {
      const r = message.reactions[emoji] || { count: 0, me: false };
      const key = REACTION_KEYS[emoji] || "reaction";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reaction";
      btn.setAttribute("aria-pressed", String(Boolean(r.me)));
      btn.dataset.emoji = emoji;
      btn.dataset.messageId = message.id;
      btn.dataset.testid = `reaction-${message.id}-${key}`;

      const label = document.createElement("span");
      label.textContent = emoji;

      const count = document.createElement("span");
      count.className = "count";
      count.textContent = String(r.count);

      btn.append(label, count);
      btn.addEventListener("click", () => toggleReaction(message.id, emoji));
      wrap.append(btn);
    }

    return wrap;
  }

  function renderMessages(conv) {
    el.messageList.innerHTML = "";

    for (const msg of conv.messages) {
      const li = document.createElement("li");
      li.className = `msg ${msg.author === "me" ? "msg--me" : ""}`.trim();
      li.dataset.messageId = msg.id;
      li.dataset.testid = `message-${msg.id}`;

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = msg.text;

      const meta = document.createElement("div");
      meta.className = "msg-meta";
      meta.textContent = `${msg.author === "me" ? "You" : conv.name.split(" ")[0]} • ${formatTime(
        msg.ts,
      )}`;

      const reactions = renderReactions(msg);

      li.append(bubble, reactions, meta);
      el.messageList.append(li);
    }
  }

  function renderQuickReplies() {
    el.quickReplies.innerHTML = "";
    const toSlug = (s) =>
      String(s)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    for (const text of QUICK_REPLIES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = text;
      btn.dataset.testid = `quick-${toSlug(text)}`;
      btn.addEventListener("click", () => sendMessage(text));
      el.quickReplies.append(btn);
    }
  }

  function scrollToBottom() {
    el.messagesWrap.scrollTop = el.messagesWrap.scrollHeight;
  }

  function renderChat() {
    const conv = getConversationById(state.selectedId);
    if (!conv) return;

    el.activeTitle.textContent = conv.name;
    el.activeSub.textContent = conv.subtitle || "Online";
    el.activeAvatar.textContent = conv.initials;

    renderMessages(conv);
    renderQuickReplies();
    requestAnimationFrame(scrollToBottom);
  }

  function showEmptyOrChat() {
    const hasSelection = Boolean(getConversationById(state.selectedId));
    el.emptyState.hidden = hasSelection;
    el.chatView.hidden = !hasSelection;
    if (!hasSelection) el.typingIndicator.hidden = true;
  }

  function render() {
    renderSidebar();
    showEmptyOrChat();
    if (getConversationById(state.selectedId)) renderChat();
  }

  function toggleReaction(messageId, emoji) {
    const conv = getConversationById(state.selectedId);
    if (!conv) return;
    const msg = conv.messages.find((m) => m.id === messageId);
    if (!msg) return;

    const current = msg.reactions[emoji] || { count: 0, me: false };
    const next = { ...current };

    if (current.me) {
      next.me = false;
      next.count = Math.max(0, next.count - 1);
    } else {
      next.me = true;
      next.count = next.count + 1;
    }

    msg.reactions[emoji] = next;
    render();
  }

  function makeNewMessage(text) {
    const id = `m-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
    return { id, author: "me", text, ts: Date.now(), reactions: {} };
  }

  function sendMessage(text) {
    const conv = getConversationById(state.selectedId);
    if (!conv) return;

    const trimmed = text.replace(/\s+$/g, "");
    if (!trimmed.trim()) return;

    conv.messages.push(makeNewMessage(trimmed));
    render();
    el.composerInput.focus();
  }

  function stopTypingSimulation() {
    if (state.typing.timeoutId) clearTimeout(state.typing.timeoutId);
    if (state.typing.cycleId) clearTimeout(state.typing.cycleId);
    state.typing.timeoutId = null;
    state.typing.cycleId = null;
    state.typing.visible = false;
    el.typingIndicator.hidden = true;
  }

  function startTypingSimulation() {
    const conv = getConversationById(state.selectedId);
    if (!conv) return;

    el.typingName.textContent = conv.name.split(" ")[0] || "Someone";

    const showForMs = 1800;
    const scheduleNext = () => {
      const delay = 6500 + Math.floor(Math.random() * 4500);
      state.typing.cycleId = setTimeout(() => {
        if (!getConversationById(state.selectedId)) return;
        state.typing.visible = true;
        el.typingIndicator.hidden = false;
        state.typing.timeoutId = setTimeout(() => {
          state.typing.visible = false;
          el.typingIndicator.hidden = true;
          scheduleNext();
        }, showForMs);
      }, delay);
    };

    scheduleNext();
  }

  function autosizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }

  function init() {
    state.conversations = cloneSeed();
    state.selectedId = state.conversations[0]?.id ?? null;

    const url = new URL(window.location.href);
    if (url.searchParams.get("empty") === "1") state.selectedId = null;

    el.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value || "";
      renderSidebar();
    });

    el.clearSelectionBtn.addEventListener("click", () => setSelected(null));

    el.composerInput.addEventListener("input", () => autosizeTextarea(el.composerInput));
    el.composerInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (e.isComposing) return;
      if (e.shiftKey) return;

      e.preventDefault();
      el.composerForm.requestSubmit();
    });

    el.composerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = el.composerInput.value;
      if (!getConversationById(state.selectedId)) return;
      sendMessage(text);
      el.composerInput.value = "";
      autosizeTextarea(el.composerInput);
    });

    autosizeTextarea(el.composerInput);
    render();
    if (state.selectedId) startTypingSimulation();
  }

  init();
})();
