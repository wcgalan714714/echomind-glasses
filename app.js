let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];
let feedback = JSON.parse(localStorage.getItem('echomind_feedback')) || {};

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Get insights with basic personalization
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    // Base time-based insights
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

    // Simple personalization: boost cards user has said "Yes" to before
    insights.forEach(insight => {
        if (feedback[insight.id] && feedback[insight.id] > 0) {
            insight.priority = feedback[insight.id];
        } else {
            insight.priority = 0;
        }
    });

    // Sort so higher priority cards appear first
    insights.sort((a, b) => (b.priority || 0) - (a.priority || 0));

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
        card.onclick = () => startCardConversation(insight);
        panel.appendChild(card);
    });
}

// Short conversational flow
function startCardConversation(insight) {
    const panel = document.getElementById('insight-panel');

    // Question 1
    panel.innerHTML = `
        <div style="padding: 10px 0;">
            <p style="font-size: 18px; margin-bottom: 24px; line-height: 1.4;">${insight.content}</p>
            <p style="margin-bottom: 16px; opacity: 0.9;">Was this useful?</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="focusable" onclick="handleResponse('${insight.id}', 'yes', 1)">Yes</button>
                <button class="focusable" onclick="handleResponse('${insight.id}', 'no', -1)">No</button>
                <button class="focusable" onclick="handleResponse('${insight.id}', 'maybe', 0)">Maybe</button>
            </div>
        </div>
    `;
}

// Handle response and move to follow-up or end
function handleResponse(insightId, response, score) {
    const panel = document.getElementById('insight-panel');

    // Save feedback for personalization
    if (!feedback[insightId]) feedback[insightId] = 0;
    feedback[insightId] += score;
    localStorage.setItem('echomind_feedback', JSON.stringify(feedback));

    if (response === 'yes') {
        // Follow-up question
        panel