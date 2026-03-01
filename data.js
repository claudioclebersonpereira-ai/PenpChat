/* global window */
(function attachSeedData() {
  const now = Date.now();

  function minutesAgo(minutes) {
    return now - minutes * 60 * 1000;
  }

  function makeMessage(id, author, text, minutes, reactions) {
    return {
      id,
      author,
      text,
      ts: minutesAgo(minutes),
      reactions: reactions || {},
    };
  }

  const reactions = {
    heart2: { "❤️": { count: 2, me: false } },
    laugh1: { "😂": { count: 1, me: false } },
    wow1: { "😮": { count: 1, me: false } },
    thumbs3: { "👍": { count: 3, me: false } },
    clap1: { "🙌": { count: 1, me: false } },
  };

  const seed = [
    {
      id: "c1",
      name: "Alex Rivera",
      subtitle: "Product • San Francisco",
      initials: "AR",
      unread: 2,
      messages: [
        makeMessage("c1-m1", "them", "Morning! Did you see the prototype update?", 410),
        makeMessage("c1-m2", "me", "Yes — the warm cream background looks great.", 408, reactions.thumbs3),
        makeMessage("c1-m3", "them", "Agreed. Let’s keep the UI snappy and minimal.", 406),
        makeMessage("c1-m4", "me", "Search, reactions, typing, quick replies, composer. No persistence.", 404),
        makeMessage("c1-m5", "them", "Perfect. Also: visible focus styles.", 402, reactions.heart2),
        makeMessage("c1-m6", "me", "Got it. I’ll simulate typing on a timer.", 400),
        makeMessage("c1-m7", "them", "Nice. Quick replies under the last message?", 398),
        makeMessage("c1-m8", "me", "Yep — clicking one will send as the user.", 396),
        makeMessage("c1-m9", "them", "Any thoughts on the empty state?", 394),
        makeMessage("c1-m10", "me", "Serif headline, gentle illustration, two guidance bullets.", 392, reactions.clap1),
        makeMessage("c1-m11", "them", "Love it.", 390),
        makeMessage("c1-m12", "me", "I’ll push a PR once E2E is green.", 388, reactions.laugh1),
      ],
    },
    {
      id: "c2",
      name: "Mina Chen",
      subtitle: "Design • Remote",
      initials: "MC",
      unread: 0,
      messages: [
        makeMessage("c2-m1", "them", "We should keep contrast AA-ish.", 520),
        makeMessage("c2-m2", "me", "Deep green on cream should pass for body text.", 518),
        makeMessage("c2-m3", "them", "Tiny mono timestamps feel editorial.", 516),
        makeMessage("c2-m4", "me", "Nice call — I’ll use a subtle mono style.", 514),
        makeMessage("c2-m5", "them", "Reactions set is fixed: 👍 ❤️ 😂 😮 🙌", 512),
        makeMessage("c2-m6", "me", "I’ll implement toggle + counts.", 510, reactions.wow1),
        makeMessage("c2-m7", "them", "Don’t forget Shift+Enter newline.", 508),
        makeMessage("c2-m8", "me", "Already in the plan.", 506),
        makeMessage("c2-m9", "them", "Mobile should stack at ~375px.", 504),
        makeMessage("c2-m10", "me", "No horizontal scroll — got it.", 502, reactions.heart2),
        makeMessage("c2-m11", "them", "Can we clear selection to show empty state?", 500),
        makeMessage("c2-m12", "me", "Yes, a small ✕ button in the header.", 498),
      ],
    },
    {
      id: "c3",
      name: "The PenpChat Crew",
      subtitle: "Group chat • 6 people",
      initials: "PC",
      unread: 5,
      messages: [
        makeMessage("c3-m1", "them", "Ship it as static files.", 300),
        makeMessage("c3-m2", "me", "Vanilla HTML/CSS/JS only.", 298),
        makeMessage("c3-m3", "them", "Add E2E with screenshots artifacts.", 296),
        makeMessage("c3-m4", "me", "Playwright should work well.", 294),
        makeMessage("c3-m5", "them", "Happy path + 3 negatives required.", 292, reactions.thumbs3),
        makeMessage("c3-m6", "me", "Copy that.", 290),
        makeMessage("c3-m7", "them", "Negative: refresh resets messages.", 288),
        makeMessage("c3-m8", "me", "No localStorage. In-memory only.", 286),
        makeMessage("c3-m9", "them", "Include “No conversations found”.", 284),
        makeMessage("c3-m10", "me", "Search filters by name + preview.", 282, reactions.heart2),
        makeMessage("c3-m11", "them", "Let’s keep it delightful.", 280),
        makeMessage("c3-m12", "me", "Soft shadows, serif headline, gentle gradients.", 278),
      ],
    },
    {
      id: "c4",
      name: "Support Inbox",
      subtitle: "Internal",
      initials: "SI",
      unread: 1,
      messages: [
        makeMessage("c4-m1", "them", "User reported: Enter should send.", 740),
        makeMessage("c4-m2", "me", "And Shift+Enter should newline.", 738),
        makeMessage("c4-m3", "them", "Also: don’t send empty messages.", 736),
        makeMessage("c4-m4", "me", "Will guard against whitespace-only.", 734),
        makeMessage("c4-m5", "them", "Typing indicator should not get stuck.", 732),
        makeMessage("c4-m6", "me", "Timers reset on conversation change.", 730),
        makeMessage("c4-m7", "them", "Reactions should be keyboard accessible.", 728),
        makeMessage("c4-m8", "me", "Buttons with aria-pressed.", 726),
        makeMessage("c4-m9", "them", "Quick reply sends a user message.", 724),
        makeMessage("c4-m10", "me", "And scrolls to bottom.", 722, reactions.clap1),
        makeMessage("c4-m11", "them", "Looks good.", 720),
        makeMessage("c4-m12", "me", "Thanks!", 718),
      ],
    },
    {
      id: "c5",
      name: "Sam Patel",
      subtitle: "Engineering • NYC",
      initials: "SP",
      unread: 0,
      messages: [
        makeMessage("c5-m1", "them", "Any preference for server during E2E?", 180),
        makeMessage("c5-m2", "me", "Python http.server is simplest.", 178),
        makeMessage("c5-m3", "them", "Nice. Keep config minimal.", 176),
        makeMessage("c5-m4", "me", "Agreed.", 174),
        makeMessage("c5-m5", "them", "Can you add data-testids for stability?", 172),
        makeMessage("c5-m6", "me", "Yep — conversations, messages, composer.", 170),
        makeMessage("c5-m7", "them", "Make sure mobile layout stacks.", 168),
        makeMessage("c5-m8", "me", "We’ll snapshot at 375px width.", 166, reactions.wow1),
        makeMessage("c5-m9", "them", "Try not to overbuild.", 164),
        makeMessage("c5-m10", "me", "Keeping it 80/20.", 162),
        makeMessage("c5-m11", "them", "Cool.", 160),
        makeMessage("c5-m12", "me", "On it.", 158),
      ],
    },
    {
      id: "c6",
      name: "Notes to self",
      subtitle: "Personal",
      initials: "NS",
      unread: 0,
      messages: [
        makeMessage("c6-m1", "me", "Keep UI desktop-first.", 1040),
        makeMessage("c6-m2", "me", "Stack layout on mobile.", 1038),
        makeMessage("c6-m3", "me", "No persistence after refresh.", 1036),
        makeMessage("c6-m4", "me", "Add empty state with serif headline.", 1034),
        makeMessage("c6-m5", "me", "Search by name + preview.", 1032),
        makeMessage("c6-m6", "me", "Fixed reactions set.", 1030, reactions.laugh1),
        makeMessage("c6-m7", "me", "Simulate typing timer.", 1028),
        makeMessage("c6-m8", "me", "Quick replies under last message.", 1026),
        makeMessage("c6-m9", "me", "E2E: happy + 3 negatives.", 1024),
        makeMessage("c6-m10", "me", "Screenshots: desktop, empty, mobile.", 1022, reactions.thumbs3),
        makeMessage("c6-m11", "me", "Keep focus styles visible.", 1020),
        makeMessage("c6-m12", "me", "Ship PR with Fixes #1 once green.", 1018),
      ],
    },
  ];

  window.__PENPCHAT_SEED__ = seed;
})();

