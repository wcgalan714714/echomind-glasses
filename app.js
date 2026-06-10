let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Spotlighted insight cards (always visible)
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

    getInsights().forEach(insight