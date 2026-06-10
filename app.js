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

// Render insights
function renderInsights() {
    const panel = document.getElementById('insight-panel');
    panel.innerHTML = '';

    const insights = [
        { 
            title: "Today's Focus", 
            content: "Protein: 180g target • IF window open" 
        },
        { 
            title: "Latest Note", 
            content: notes.length ? notes[0].text.substring(0, 80) + (notes[0].text.length > 80 ? '...' : '') : "No notes yet. Capture something!" 
        },
        { 
            title: "Quick Nudge", 
            content: "Tesla range check? Gundam deck review? Knee exercises?" 
        }
    ];

    insights.forEach((insight, index) => {
        const card = document.createElement('div');
        card.className = 'insight-card focusable';
        card.tabIndex = 0;
        card.innerHTML = `<strong>${insight.title}</strong><br>${insight.content}`;
        card.onclick = () => alert(`Opened: ${insight.title}`);
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

// Keyboard support (D-pad / Enter)
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
