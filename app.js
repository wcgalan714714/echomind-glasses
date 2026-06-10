let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];
let currentView = 'insights'; // 'insights' or 'history'

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Proactive insights
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    if (hour >= 5 && hour < 11) insights.push({ title: "Morning Brief", content: "What's your #1 priority today?" });
    if (hour >= 11 && hour < 15) insights.push({ title: "Midday Check", content: "Take a quick reset?" });
    if (hour >= 18 && hour < 23) insights.push({ title: "Evening Reflection", content: "One win from today?" });

    insights.push({ title: "Quick Capture", content: "Speak or type anything..." });

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

    // Add "View History" card
    const historyCard = document.createElement('div');
    historyCard.className = 'insight-card focusable';
    historyCard.tabIndex = 0;
    historyCard.innerHTML = `<strong>📜 View All Notes</strong><br>${notes.length} saved`;
    historyCard.onclick = showHistory;
    panel.appendChild(historyCard);
}

function showHistory() {
    currentView = 'history';
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '<h2 style="margin-bottom:16px; color:#00FF88;">All Notes</h2>';

    if (notes.length === 0) {
        panel.innerHTML += '<p style="opacity:0.6;">No notes yet.</p>';
        return;
    }

    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        const date = new Date(note.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
        card.innerHTML = `<small>${date}</small><br>${note.text}`;
        card.onclick = () => alert("Full Note:\n\n" + note.text);
        panel.appendChild(card);
    });

    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to Insights';
    backBtn.style.marginTop = '20px';
    backBtn.onclick = () => { currentView = 'insights'; renderInsights(); };
    panel.appendChild(backBtn);
}

// Capture note
function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;

    notes.unshift({ text, timestamp: new Date().toISOString() });
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    input.value = '';
    
    if (currentView === 'insights') {
        renderInsights();
    } else {
        showHistory();
    }
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active?.id === 'quick-capture') captureNote();
    }
});

// Init
renderInsights();