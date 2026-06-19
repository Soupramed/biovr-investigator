/* ============================================================
   BioVR-Investigator — BioBot (AI-Powered)
   Chatbot connected to Google Gemini for biology Q&A
   ============================================================ */

import { typeText, speak } from '../main.js';
import { initAI, sendMessage, isAIReady, loadSavedKey, clearSavedKey, getMaskedKey, resetChat } from './ai-service.js';

export class BioBot {
  constructor(chatContainer, onHighlight) {
    this.container = chatContainer;
    this.messagesArea = document.getElementById('biobot-messages');
    this.inputField = document.getElementById('biobot-input');
    this.sendBtn = document.getElementById('biobot-send-btn');
    this.micBtn = document.getElementById('biobot-mic-btn');
    this.onHighlight = onHighlight;
    this.isProcessing = false;

    // Local knowledge for 3D model highlighting (fallback when no AI)
    this.highlightMap = {
      'jantung': 'Jantung', 'heart': 'Jantung',
      'atrium': 'Atrium', 'serambi': 'Atrium',
      'ventrikel': 'Ventrikel', 'bilik': 'Ventrikel',
      'septum': 'Septum',
      'katup': 'Katup', 'trikuspid': 'Katup Trikuspid', 'mitral': 'Katup Mitral', 'bikuspid': 'Katup Mitral',
      'aorta': 'Aorta',
      'vena kava': 'Vena Kava',
      'arteri pulmonalis': 'Arteri Pulmonalis',
      'vena pulmonalis': 'Vena Pulmonalis',
      'pembuluh': 'Pembuluh',
    };

    this.initEvents();
    this.tryAutoConnect();
  }

  /**
   * Try to auto-connect using saved API key
   */
  async tryAutoConnect() {
    const savedKey = loadSavedKey();
    if (savedKey) {
      const success = initAI(savedKey);
      if (success) {
        this.showConnectedState();
        this.addMessage('Halo Dokter! 👋🧬 Saya BioBot, asisten AI kamu. Saya siap menjawab **semua pertanyaan biologi** — mulai dari sel, organ tubuh, genetika, ekologi, sampai evolusi! Coba tanyakan sesuatu!', 'bot');
        return;
      }
    }
    // No saved key or failed — show API key setup
    this.showApiKeyPrompt();
  }

  /**
   * Show API key setup prompt in the chat
   */
  showApiKeyPrompt() {
    this.updateStatus('Menunggu API Key', 'waiting');

    const msgDiv = document.createElement('div');
    msgDiv.className = 'biobot-msg msg-bot';

    msgDiv.innerHTML = `
      <div class="api-key-setup">
        <div class="setup-icon">🔑</div>
        <h4 class="setup-title">Hubungkan BioBot ke AI</h4>
        <p class="setup-desc">Masukkan Google Gemini API Key untuk mengaktifkan BioBot AI yang bisa menjawab <strong>semua pertanyaan biologi</strong>.</p>
        <div class="setup-steps">
          <div class="setup-step">
            <span class="step-num">1</span>
            <span>Buka <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" class="setup-link">Google AI Studio</a></span>
          </div>
          <div class="setup-step">
            <span class="step-num">2</span>
            <span>Klik "Create API Key" (Gratis!)</span>
          </div>
          <div class="setup-step">
            <span class="step-num">3</span>
            <span>Copy & paste key di bawah</span>
          </div>
        </div>
        <div class="setup-input-group">
          <input type="password" id="api-key-input" class="setup-input" placeholder="Paste API Key di sini..." autocomplete="off" />
          <button id="api-key-submit" class="setup-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <p class="setup-note">🔒 Key disimpan di browser lokal Anda, tidak dikirim ke server manapun.</p>
      </div>
    `;

    this.messagesArea.appendChild(msgDiv);
    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;

    // Handle API key submission
    const input = msgDiv.querySelector('#api-key-input');
    const submitBtn = msgDiv.querySelector('#api-key-submit');

    const handleSubmit = () => {
      const key = input.value.trim();
      if (!key) return;
      this.connectWithKey(key, msgDiv);
    };

    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });

    // Focus the input
    setTimeout(() => input.focus(), 300);
  }

  /**
   * Connect with the provided API key
   */
  async connectWithKey(key, setupMsgDiv) {
    const input = setupMsgDiv.querySelector('#api-key-input');
    const submitBtn = setupMsgDiv.querySelector('#api-key-submit');

    // Show loading state
    input.disabled = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="setup-spinner"></span>';

    const success = initAI(key);

    if (success) {
      // Test the connection with a simple message
      try {
        await sendMessage('Halo, saya siswa baru!');

        // Remove setup card
        setupMsgDiv.remove();

        // Show success
        this.showConnectedState();
        this.addMessage('🎉 **BioBot AI Terhubung!**\n\nSaya sekarang bisa menjawab semua pertanyaan biologi kamu, Dokter! Mulai dari sel, DNA, sistem organ, ekologi, sampai evolusi — tanyakan apa saja! 🧬🔬', 'bot');
      } catch (error) {
        input.disabled = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        this.addMessage('❌ API Key tidak valid atau ada masalah koneksi. Pastikan key benar dan coba lagi.', 'bot');
      }
    } else {
      input.disabled = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      this.addMessage('❌ Gagal menginisialisasi AI. Periksa API Key dan coba lagi.', 'bot');
    }
  }

  /**
   * Update the BioBot status indicator
   */
  showConnectedState() {
    this.updateStatus('AI Connected — Gemini', 'connected');
    this.inputField.placeholder = 'Tanyakan apa saja tentang biologi...';
  }

  updateStatus(text, state) {
    const statusEl = this.container.querySelector('.biobot-status');
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.className = 'biobot-status';
      if (state) statusEl.classList.add(`status-${state}`);
    }
  }

  initEvents() {
    this.sendBtn.addEventListener('click', () => this.handleInput());
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleInput();
      }
    });

    this.micBtn.addEventListener('click', () => this.startVoiceRecognition());

    // Settings gear — add a context menu for reset/disconnect
    const header = this.container.querySelector('.biobot-header');
    if (header) {
      header.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (isAIReady()) {
          const action = confirm('Reset percakapan BioBot?\n\n• OK = Reset chat (hapus riwayat)\n• Cancel = Batal');
          if (action) {
            resetChat();
            this.messagesArea.innerHTML = '';
            this.addMessage('🔄 Percakapan direset. Tanyakan apa saja tentang biologi!', 'bot');
          }
        }
      });
    }
  }

  handleInput() {
    const text = this.inputField.value.trim();
    if (!text || this.isProcessing) return;

    this.addMessage(text, 'user');
    this.inputField.value = '';

    this.processInput(text);
  }

  async processInput(input) {
    if (!isAIReady()) {
      this.addMessage('⚠️ BioBot belum terhubung ke AI. Masukkan API Key terlebih dahulu untuk mengaktifkan saya!', 'bot');
      return;
    }

    this.isProcessing = true;
    this.setInputEnabled(false);
    this.showTypingIndicator();

    try {
      const response = await sendMessage(input);

      this.hideTypingIndicator();

      // Render the response with markdown-like formatting
      this.addFormattedMessage(response.text, 'bot');

      // Handle 3D model highlighting
      if (response.highlightPart && this.onHighlight) {
        this.onHighlight(response.highlightPart);
      } else {
        // Fallback: check local highlight map
        const lowerInput = input.toLowerCase();
        for (const [keyword, part] of Object.entries(this.highlightMap)) {
          if (lowerInput.includes(keyword)) {
            this.onHighlight(part);
            break;
          }
        }
      }

      // Text-to-speech (first 200 chars to keep it short)
      const shortText = response.text.substring(0, 200).replace(/[*#_`]/g, '');
      speak(shortText);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(`⚠️ ${error.message}`, 'bot');
    } finally {
      this.isProcessing = false;
      this.setInputEnabled(true);
      this.inputField.focus();
    }
  }

  setInputEnabled(enabled) {
    this.inputField.disabled = !enabled;
    this.sendBtn.disabled = !enabled;
    if (enabled) {
      this.sendBtn.classList.remove('disabled');
    } else {
      this.sendBtn.classList.add('disabled');
    }
  }

  /**
   * Add a formatted bot message with basic markdown rendering
   */
  addFormattedMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `biobot-msg msg-${sender}`;

    if (sender === 'bot') {
      // Convert basic markdown to HTML
      const html = this.markdownToHtml(text);
      msgDiv.innerHTML = html;
      
      // Apply entrance animation
      msgDiv.style.opacity = '0';
      msgDiv.style.transform = 'translateY(8px)';
      this.messagesArea.appendChild(msgDiv);
      
      requestAnimationFrame(() => {
        msgDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        msgDiv.style.opacity = '1';
        msgDiv.style.transform = 'translateY(0)';
      });
    } else {
      msgDiv.textContent = text;
      this.messagesArea.appendChild(msgDiv);
    }

    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }

  /**
   * Simple markdown to HTML converter
   */
  markdownToHtml(text) {
    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap numbered lists
    html = html.replace(/(\d+\.\s.+?)(?=<br>\d+\.|<\/p>|$)/g, '<li>$1</li>');

    // Wrap bullet points
    html = html.replace(/(?:^|<br>)[-•]\s(.+?)(?=<br>[-•]|<\/p>|$)/g, '<li>$1</li>');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }

  addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `biobot-msg msg-${sender}`;

    if (sender === 'bot') {
      // Use formatted rendering for bot messages
      const html = this.markdownToHtml(text);
      msgDiv.innerHTML = html;
      this.messagesArea.appendChild(msgDiv);
    } else {
      msgDiv.textContent = text;
      this.messagesArea.appendChild(msgDiv);
    }

    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }

  showTypingIndicator() {
    const ind = document.createElement('div');
    ind.id = 'typing-indicator';
    ind.className = 'biobot-msg msg-bot typing-indicator';
    ind.innerHTML = `
      <div class="typing-content">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
        <span class="typing-text">BioBot sedang berpikir...</span>
      </div>
    `;
    this.messagesArea.appendChild(ind);
    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }

  hideTypingIndicator() {
    const ind = document.getElementById('typing-indicator');
    if (ind) ind.remove();
  }

  startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.addMessage('⚠️ Browser Anda tidak mendukung Voice Recognition. Silakan gunakan Chrome/Edge.', 'bot');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    this.micBtn.classList.add('listening');
    this.updateStatus('🎙️ Mendengarkan...', 'listening');

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.inputField.value = text;
      this.handleInput();
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      this.micBtn.classList.remove('listening');
      if (isAIReady()) {
        this.showConnectedState();
      }
    };

    recognition.onend = () => {
      this.micBtn.classList.remove('listening');
      if (isAIReady()) {
        this.showConnectedState();
      }
    };

    recognition.start();
  }
}
