let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];
let feedback = JSON.parse(localStorage.getItem('echomind_feedback')) || {};

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Get insights (with basic personalization)
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    if (hour >= 5 && hour < 11) {
        insights.push({ id: "morning", title: "Morning Brief", content: "What is your single top priority today?" });
    } else if (hour >= 11 && hour < 15) {
        insights.push({ id: "midday", title: "Midday Check", content: "Energy level good? Quick reset?" });
    } else if (hour >= 18 && hour < 23) {
        insights.push({ id: "evening", title: "Evening Reflection", content: "One win or lesson from today?" });
    } else {
        insights.push({ id: "night", title: "Night Note", content: "Anything important for tomorrow?" });
    }

    insights.push({ id: "quick", title: "Quick Thought", content: "What's on your mind right now?" });

    // Simple personalization
    insights.forEach(insight => {
        insight.priority = feedback[insight.id] || 0;
    });

    insights.sort((a, b) => b.priority - a.priority);
    return insights;
}

function renderInsights() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '';

    getInsights().forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        card.dataset.id = insight.id;
        card.innerHTML = `<strong>${insight.title}</strong><br>${insight.content}`;
        
        // Tap to start conversation (in