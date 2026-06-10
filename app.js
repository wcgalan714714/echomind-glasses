let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Proactive + useful cards
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    // Time-based nudges
    if (hour >= 5 && hour < 11) insights.push({ title: "Morning Brief", content: "Top 1 priority today?" });
    if (hour >= 11 && hour < 15) insights.push({ title: "Midday Check", content: "Energy level good?" });
    if (hour >= 18 && hour < 23) insights.push({ title: "Evening Wind Down", content: "What are you grateful for?" });

    // Recent notes
    if (notes.length > 0) {
        insights.push({ 
            title: "Latest Note", 
            content: notes[0].text.substring(0, 65) + (notes[0].text.length > 65 ? '...' : ''),
            fullText: notes[0].text 
        });
    }

    // General useful cards
    insights.push({ title: "Quick Capture", content: "What's on your mind right now?" });

    return insights.slice(0, 4); // Limit for glanceability
}

function renderInsights() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '';

    getInsights().forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        card.innerHTML = `<strong>${insight.title}</strong><br>${insight.content}`;
        
        card.onclick = () => {
            if (insight.fullText) {
                alert("Full Note:\n\n" + insight.fullText);
            } else {
                alert(insight.content);
            }
        };
        panel.appendChild(card);
    });
}

// Capture
function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;

    notes.unshift({ text, timestamp: new Date().toISOString() });
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    input.value = '';
    renderInsights();
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active?.id === 'quick-capture') captureNote();
    }
});

renderInsights();