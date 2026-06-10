let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

// Time
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

// Smart time-aware insights
function getInsights() {
    const hour = new Date().getHours();
    let insights = [];

    if (hour >= 5 && hour < 11) insights.push({ title: "Morning Brief", content: "What is your single top priority today?" });
    else if (hour >= 11 && hour < 15) insights.push({ title: "Midday Check", content: "Energy level good? Quick reset?" });
    else if (hour >= 18 && hour < 23) insights.push({ title: "Evening Reflection", content: "One win or lesson from today?" });
    else insights.push({ title: "Night Note", content: "Anything important for tomorrow?" });

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

// Text capture
function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;
    saveNote(text);
    input.value = '';
}

// Voice capture
function startVoiceCapture() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Voice input not supported in this browser.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.trim();
        if (text) saveNote(text);
    };

    recognition.onerror = () => alert("Voice capture failed. Try again.");
    recognition.start();
}

function saveNote(text) {
    notes.unshift({ text, timestamp: new Date().toISOString() });
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    renderInsights();
    alert(`Saved: "${text}"`);
}

function showHistory() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '<h2 style="margin-bottom:16px; color:#00FF88;">All Notes</h2>';

    if (notes.length === 0) {
        panel.innerHTML += '<p style="opacity:0.6;">No notes yet.</p>';
    } else {
        notes.forEach((note) => {
            const card = document.createElement('div');
            card.className = 'insight-card focusable';
            const date = new Date(note.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
            card.innerHTML = `<small>${date}</small><br>${note.text}`;
            card.onclick = () => alert(note.text);
            panel.appendChild(card);
        });
    }

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.style.marginTop = '20px';
    backBtn.onclick = renderInsights;
    panel.appendChild(backBtn);
}

// Keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active?.id === 'quick-capture') captureNote();
    }
});

// Init
renderInsights();