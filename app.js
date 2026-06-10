let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

// Update clock
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}
setInterval(updateTime, 10000);
updateTime();

// Generate proactive insights
function getProactiveInsights() {
    const hour = new Date().getHours();
    let insights = [];

    if (hour >= 6 && hour < 10) {
        insights.push({ title: "Morning Focus", content: "What's your top priority today?" });
    } else if (hour >= 12 && hour < 14) {
        insights.push({ title: "Midday Reset", content: "Quick breath or hydration check?" });
    } else if (hour >= 17 && hour < 22) {
        insights.push({ title: "Evening Reflection", content: "What went well today?" });
    }

    insights.push({ 
        title: "Recent Capture", 
        content: notes.length ? notes[0].text.substring(0, 70) + "..." : "No notes yet — capture something" 
    });

    return insights;
}

// Render insights
function renderInsights() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '';

    const insights = getProactiveInsights();

    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        card.innerHTML = `<strong>${insight.title}</strong><br>${insight.content}`;
        card.onclick = () => {
            if (insight.title === "Recent Capture" && notes.length) {
                alert("Full note:\n" + notes[0].text);
            } else {
                alert(insight.content);
            }
        };
        panel.appendChild(card);
    });
}

// Capture new note
function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;

    notes.unshift({
        text: text,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    input.value = '';
    renderInsights();
}

// Keyboard / gesture support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active && active.id === 'quick-capture') {
            captureNote();
        }
    }
});

// Initialize
renderInsights();