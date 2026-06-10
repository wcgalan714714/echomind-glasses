let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Smart insights
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    if (hour >= 5 && hour < 11) {
        insights.push({ title: "Morning Brief", content: "What is your single top priority today?" });
    } else if (hour >= 11 && hour < 15) {
        insights.push({ title: "Midday Check", content: "Energy level good? Quick reset?" });
    } else if (hour >= 18 && hour < 23) {
        insights.push({ title: "Evening Reflection", content: "One win or lesson from today?" });
    } else {
        insights.push({ title: "Night Note", content: "Anything important for tomorrow?" });
    }

    insights.push({ title: "Quick Thought", content: "What's on your mind right now?" });
    return insights;
}

function renderInsights() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '';

    getInsights().forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        card.innerHTML = `<strong>${insight.title}</strong><br>${insight.content}`;
        card.onclick = () => alert(insight.content);
        panel.appendChild(card);
    });
}

// Save note with nice category selector
function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;

    showCategorySelector(text, () => {
        input.value = '';
    });
}

function startVoiceCapture() {
    const btn = document.getElementById('voice-btn