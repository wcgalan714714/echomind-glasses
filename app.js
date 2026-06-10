let notes = JSON.parse(localStorage.getItem('echomind_notes')) || [];

function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 10000);
updateTime();

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
        card.onclick = () => showSimpleMessage(insight.content);
        panel.appendChild(card);
    });
}

function showSimpleMessage(text) {
    const panel = document.getElementById('insight-panel');
    const originalContent = panel.innerHTML;

    panel.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <p style="font-size: 18px; margin-bottom: 24px; line-height: 1.5;">${text}</p>
            <button onclick="renderInsights()" class="focusable" style="padding: 14px 28px; font-size: 17px;">Back</button>
        </div>
    `;
}

function captureNote() {
    const input = document.getElementById('quick-capture');
    const text = input.value.trim();
    if (!text) return;

    const category = prompt("Category? (Work / Ideas / Personal / Shopping / Reminders / Other)", "Other") || "Other";
    saveNote(text, category);
    input.value = '';
}

function startVoiceCapture() {
    const btn = document.getElementById('voice-btn');
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Voice not supported.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    btn.textContent = "Listening...";
    btn.disabled = true;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.trim();
        if (text) {
            const category = prompt("Category? (Work / Ideas / Personal / Shopping / Reminders / Other)", "Other") || "Other";
            saveNote(text, category);
        }
        btn.textContent = "Voice";
        btn.disabled = false;
    };

    recognition.onerror = () => {
        alert("Voice failed.");
        btn.textContent = "Voice";
        btn.disabled = false;
    };

    recognition.start();
}

function saveNote(text, category) {
    notes.unshift({ text, category, timestamp: new Date().toISOString() });
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
    renderInsights();
}

function showHistory() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = `
        <h2 style="margin-bottom:12px; color:#00FF88;">All Notes</h2>
        <input type="text" id="search-input" placeholder="Search..." class="focusable" style="width:100%; margin-bottom:14px;">
    `;

    const searchInput = document.getElementById('search-input');
    searchInput.oninput = () => renderFilteredHistory(panel, searchInput.value);
    renderFilteredHistory(panel, '');
}

function renderFilteredHistory(panel, searchTerm = '') {
    const oldList = document.getElementById('history-list');
    if (oldList) oldList.remove();

    const listContainer = document.createElement('div');
    listContainer.id = 'history-list';

    const filtered = notes.filter(n =>
        n.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.category && n.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filtered.length === 0) {
        listContainer.innerHTML = '<p style="opacity:0.6;">No matching notes.</p>';
    } else {
        filtered.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'insight-card focusable';
            card.tabIndex = 0;
            const date = new Date(note.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
            const cat = note.category ? ` [${note.category}]` : '';
            card.innerHTML = `<small>${date}${cat}</small><br>${note.text.substring(0, 65)}${note.text.length > 65 ? '...' : ''}`;
            card.onclick = () => showNoteDetail(note, index);
            listContainer.appendChild(card);
        });
    }

    panel.appendChild(listContainer);

    const back = document.createElement('button');
    back.textContent = '← Back';
    back.style.marginTop = '16px';
    back.onclick = renderInsights;
    panel.appendChild(back);
}

function showNoteDetail(note, index) {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = `
        <h2 style="margin-bottom:12px; color:#00FF88;">Note</h2>
        <div class="insight-card" style="margin-bottom:20px; padding:18px; font-size:17px; line-height:1.5;">
            <strong>Category:</strong> ${note.category || 'None'}<br><br>
            ${note.text}
        </div>
        <button onclick="deleteNote(${index}); showHistory()" class="focusable" style="background:#330000; border-color:#ff6666; color:#ff8888; margin-right:10px;">Delete</button>
        <button onclick="showHistory()" class="focusable">Back</button>
    `;
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('echomind_notes', JSON.stringify(notes));
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active?.id === 'quick-capture') captureNote();
    }
});

// Start the app
renderInsights();