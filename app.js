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

// Voice capture with status
function startVoiceCapture() {
    const btn = document.getElementById('voice-btn');
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Voice not supported in this browser.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    btn.textContent = "Listening...";
    btn.disabled = true;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.trim();
        if (text) saveNote(text);
        btn.textContent = "Voice";
        btn.disabled = false;
    };

    recognition.onerror = () => {
        alert("Voice capture failed.");
        btn.textContent = "Voice";
        btn.disabled = false;
    };

    recognition.start();
}

function saveNote(text) {
    notes.unshift({ text, timestamp: new Date().toISOString() });
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    renderInsights();
}

// History with search + expandable notes + delete
function showHistory() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="color:#00FF88;">All Notes</h2>
            <input type="text" id="search-input" placeholder="Search notes..." class="focusable" style="width:160px; padding:6px 10px;">
        </div>
    `;

    const searchInput = document.getElementById('search-input');
    searchInput.oninput = () => renderHistoryList(panel, searchInput.value);

    renderHistoryList(panel, '');
}

function renderHistoryList(panel, searchTerm = '') {
    // Remove old list if exists
    const oldList = document.getElementById('history-list');
    if (oldList) oldList.remove();

    const listContainer = document.createElement('div');
    listContainer.id = 'history-list';

    const filteredNotes = notes.filter(note =>
        note.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredNotes.length === 0) {
        listContainer.innerHTML = '<p style="opacity:0.6;">No matching notes.</p>';
    } else {
        filteredNotes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'insight-card focusable';
            card.tabIndex = 0;

            const date = new Date(note.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
            card.innerHTML = `<small>${date}</small><br>${note.text.substring(0, 80)}${note.text.length > 80 ? '...' : ''}`;

            card.onclick = () => showNoteDetail(note, index);
            listContainer.appendChild(card);
        });
    }

    panel.appendChild(listContainer);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.style.marginTop = '20px';
    backBtn.onclick = renderInsights;
    panel.appendChild(backBtn);
}

function showNoteDetail(note, index) {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = `
        <h2 style="margin-bottom:12px; color:#00FF88;">Note</h2>
        <div class="insight-card" style="margin-bottom:20px; padding:20px; line-height:1.5;">
            ${note.text}
        </div>
        <div style="display:flex; gap:12px;">
            <button onclick="deleteNote(${index}); showHistory();" class="focusable" style="background:#330000; border-color:#ff4444; color:#ff6666;">Delete</button>
            <button onclick="showHistory()" class="focusable">Back to List</button>
        </div>
    `;
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
}

// Keyboard support (great for Neural Band gestures)
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active?.id === 'quick-capture') captureNote();
    }
});

// Init
renderInsights();