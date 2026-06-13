import { typeText, speak } from '../main.js';

export class BioBot {
  constructor(chatContainer, onHighlight) {
    this.container = chatContainer;
    this.messagesArea = document.getElementById('biobot-messages');
    this.inputField = document.getElementById('biobot-input');
    this.sendBtn = document.getElementById('biobot-send-btn');
    this.micBtn = document.getElementById('biobot-mic-btn');
    this.onHighlight = onHighlight;
    
    this.knowledgeBase = {
      // 1. Organ dan Ruang Jantung
      'jantung': {
        text: 'Jantung adalah organ otot seukuran kepalan tangan yang memompa darah ke seluruh tubuh. Jantung manusia memiliki 4 ruang: dua atrium dan dua ventrikel.',
        part: 'Jantung'
      },
      'atrium': {
        text: 'Atrium (serambi) adalah ruang atas jantung. Atrium kanan menerima darah kotor (kaya karbon dioksida) dari seluruh tubuh, sedangkan atrium kiri menerima darah bersih (kaya oksigen) dari paru-paru.',
        part: 'Atrium'
      },
      'serambi': {
        text: 'Serambi atau atrium adalah ruang atas jantung. Serambi kanan menerima darah dari tubuh, serambi kiri menerima darah dari paru-paru.',
        part: 'Atrium'
      },
      'ventrikel': {
        text: 'Ventrikel (bilik) adalah ruang bawah jantung yang memompa darah keluar. Ventrikel kiri memiliki dinding otot paling tebal karena harus memompa darah ke seluruh tubuh dengan tekanan tinggi.',
        part: 'Ventrikel'
      },
      'bilik': {
        text: 'Bilik atau ventrikel adalah ruang pemompa jantung. Bilik kiri sangat kuat untuk memompa darah ke seluruh tubuh.',
        part: 'Ventrikel'
      },
      'septum': {
        text: 'Septum adalah dinding penyekat tebal di antara sisi kanan dan kiri jantung. Fungsinya agar darah yang kaya oksigen tidak bercampur dengan darah yang kaya karbon dioksida.',
        part: 'Septum'
      },

      // 2. Katup Jantung
      'katup': {
        text: 'Katup jantung berfungsi seperti pintu satu arah untuk mencegah darah mengalir kembali. Ada 4 katup utama: katup mitral, trikuspid, aorta, dan pulmonal.',
        part: 'Katup'
      },
      'trikuspid': {
        text: 'Katup trikuspidalis terletak di antara atrium kanan dan ventrikel kanan. Ia memiliki tiga daun katup.',
        part: 'Katup Trikuspid'
      },
      'bikuspid': {
        text: 'Katup bikuspidalis atau katup mitral terletak di antara atrium kiri dan ventrikel kiri. Ia hanya memiliki dua daun katup.',
        part: 'Katup Mitral'
      },
      'mitral': {
        text: 'Katup mitral (bikuspid) mencegah darah mengalir kembali dari bilik kiri ke serambi kiri saat bilik kiri berkontraksi memompa darah ke aorta.',
        part: 'Katup Mitral'
      },

      // 3. Pembuluh Darah
      'pembuluh': {
        text: 'Ada 3 jenis pembuluh darah utama: arteri (membawa darah keluar jantung), vena (membawa darah menuju jantung), dan kapiler (tempat pertukaran zat dengan sel tubuh).',
        part: 'Pembuluh'
      },
      'aorta': {
        text: 'Aorta adalah pembuluh darah arteri terbesar di tubuh manusia. Ia membawa darah bersih yang kaya oksigen dari ventrikel kiri ke seluruh tubuh.',
        part: 'Aorta'
      },
      'vena kava': {
        text: 'Vena kava adalah pembuluh balik terbesar. Superior membawa darah dari tubuh bagian atas, inferior dari bagian bawah. Semuanya bermuara di atrium kanan.',
        part: 'Vena Kava'
      },
      'arteri pulmonalis': {
        text: 'Arteri pulmonalis adalah satu-satunya arteri yang membawa darah kotor (kaya CO2). Ia membawa darah dari ventrikel kanan menuju paru-paru.',
        part: 'Arteri Pulmonalis'
      },
      'vena pulmonalis': {
        text: 'Vena pulmonalis adalah satu-satunya vena yang membawa darah bersih (kaya O2). Ia membawa darah dari paru-paru masuk ke atrium kiri.',
        part: 'Vena Pulmonalis'
      },
      'kapiler': {
        text: 'Pembuluh kapiler sangat kecil dan tipis. Di sinilah terjadi pertukaran oksigen, nutrisi, dan limbah antara darah dan jaringan tubuh.',
        part: null
      },

      // 4. Sirkulasi
      'besar': {
        text: 'Peredaran darah besar (sistemik) adalah rute darah dari Jantung (Bilik Kiri) → Aorta → Seluruh Tubuh → Vena Kava → Jantung (Serambi Kanan).',
        part: null
      },
      'sistemik': {
        text: 'Sirkulasi sistemik bertugas mendistribusikan darah kaya oksigen dari jantung ke seluruh organ tubuh, lalu mengembalikan darah kotor kembali ke jantung.',
        part: null
      },
      'kecil': {
        text: 'Peredaran darah kecil (pulmonal) adalah rute dari Jantung (Bilik Kanan) → Arteri Pulmonalis → Paru-paru → Vena Pulmonalis → Jantung (Serambi Kiri).',
        part: null
      },
      'pulmonal': {
        text: 'Sirkulasi pulmonal bertujuan membersihkan darah kotor. Darah di pompa ke paru-paru untuk membuang CO2 dan mengambil O2.',
        part: null
      },

      // 5. Komponen Darah
      'darah merah': {
        text: 'Sel darah merah (Eritrosit) berbentuk cakram bikonkaf tanpa inti sel. Ia mengandung hemoglobin yang mengikat oksigen untuk diedarkan ke seluruh tubuh.',
        part: null
      },
      'eritrosit': {
        text: 'Eritrosit adalah nama lain dari sel darah merah. Jumlahnya sekitar 4-5 juta per milimeter kubik darah.',
        part: null
      },
      'darah putih': {
        text: 'Sel darah putih (Leukosit) berfungsi sebagai sistem pertahanan tubuh melawan infeksi virus dan bakteri.',
        part: null
      },
      'leukosit': {
        text: 'Leukosit adalah sel darah putih. Ada beberapa jenis: neutrofil, limfosit, monosit, eosinofil, dan basofil.',
        part: null
      },
      'keping darah': {
        text: 'Keping darah (Trombosit) sangat penting untuk proses pembekuan darah saat kita terluka agar darah tidak terus mengucur.',
        part: null
      },
      'trombosit': {
        text: 'Trombosit adalah keping darah. Saat luka, trombosit akan pecah dan mengeluarkan enzim trombokinase untuk memulai pembekuan darah.',
        part: null
      },
      'plasma': {
        text: 'Plasma darah adalah bagian cair dari darah (55% dari volume darah), berwarna kekuningan. Mengandung air, protein, nutrisi, dan hormon.',
        part: null
      },
      'hemoglobin': {
        text: 'Hemoglobin adalah protein kaya zat besi di dalam sel darah merah yang memberinya warna merah dan mengikat oksigen dari paru-paru.',
        part: null
      },

      // 6. Penyakit & Gangguan
      'anemia': {
        text: 'Anemia adalah kondisi dimana tubuh kekurangan sel darah merah sehat atau hemoglobin, sehingga jaringan tubuh tidak mendapat cukup oksigen. Penderitanya sering merasa lemas.',
        part: null
      },
      'aterosklerosis': {
        text: 'Aterosklerosis adalah penyempitan atau pengerasan pembuluh darah arteri karena penumpukan plak (lemak, kolesterol, kalsium). Ini adalah penyebab utama serangan jantung.',
        part: 'Aorta'
      },
      'hipertensi': {
        text: 'Hipertensi adalah tekanan darah tinggi. Jika dibiarkan, jantung harus bekerja ekstra keras dan bisa merusak pembuluh darah.',
        part: null
      },
      'hipotensi': {
        text: 'Hipotensi adalah tekanan darah rendah. Bisa menyebabkan pusing atau pingsan karena aliran darah ke otak tidak mencukupi.',
        part: null
      },
      'koroner': {
        text: 'Penyakit jantung koroner terjadi ketika pembuluh darah koroner yang menyuplai makan untuk otot jantung tersumbat oleh plak.',
        part: null
      },
      'stroke': {
        text: 'Stroke terjadi ketika suplai darah ke bagian otak terputus, biasanya akibat pembuluh darah tersumbat atau pecah. Sel otak bisa mati dalam hitungan menit.',
        part: null
      },
      'leukemia': {
        text: 'Leukemia atau kanker darah adalah produksi sel darah putih (leukosit) yang tidak normal dan berlebihan, sehingga mengganggu sel darah lain yang sehat.',
        part: null
      },
      'hemofilia': {
        text: 'Hemofilia adalah penyakit keturunan dimana darah sulit membeku karena kekurangan faktor pembeku darah tertentu.',
        part: null
      },

      // 7. Mekanisme Jantung
      'sistol': {
        text: 'Sistol adalah fase dimana otot jantung (terutama ventrikel) berkontraksi kuat memompa darah keluar dari jantung. Tekanan darah pada titik tertinggi.',
        part: 'Ventrikel'
      },
      'diastol': {
        text: 'Diastol adalah fase relaksasi dimana otot jantung mengendur sehingga ruang jantung (atrium dan ventrikel) kembali terisi oleh darah.',
        part: 'Jantung'
      },
      'pacemaker': {
        text: 'Nodus SA (Sinoatrial) adalah pacemaker atau pemicu alami jantung. Ia menghasilkan impuls listrik yang membuat otot jantung berdetak teratur.',
        part: null
      }
    };

    this.initEvents();
    
    // Initial greeting
    setTimeout(() => {
      this.addMessage('Halo Dokter! Saya BioBot, asisten virtual Anda. Ada yang bisa saya bantu tentang anatomi jantung?', 'bot');
    }, 1000);
  }

  initEvents() {
    this.sendBtn.addEventListener('click', () => this.handleInput());
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleInput();
    });

    this.micBtn.addEventListener('click', () => this.startVoiceRecognition());
  }

  handleInput() {
    const text = this.inputField.value.trim();
    if (!text) return;
    
    this.addMessage(text, 'user');
    this.inputField.value = '';
    
    this.processInput(text.toLowerCase());
  }

  processInput(input) {
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      
      let foundMatch = false;
      for (const key in this.knowledgeBase) {
        if (input.includes(key)) {
          const response = this.knowledgeBase[key];
          this.addMessage(response.text, 'bot');
          speak(response.text);
          
          if (response.part && this.onHighlight) {
            this.onHighlight(response.part);
          }
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch) {
        const fallbackMsg = "Maaf, saya tidak memahami itu. Coba tanyakan tentang bagian jantung tertentu seperti 'ventrikel' atau 'katup'.";
        this.addMessage(fallbackMsg, 'bot');
        speak(fallbackMsg);
      }
    }, 1000);
  }

  addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `biobot-msg msg-${sender}`;
    
    if (sender === 'bot') {
      // Typewriter effect for bot
      this.messagesArea.appendChild(msgDiv);
      typeText(msgDiv, text, 20).then(() => {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
      });
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
    ind.innerHTML = '<span>.</span><span>.</span><span>.</span>';
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
      alert("Browser Anda tidak mendukung Voice Recognition. Silakan gunakan Chrome/Edge.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    
    this.micBtn.classList.add('pulse');
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.inputField.value = text;
      this.handleInput();
    };
    
    recognition.onend = () => {
      this.micBtn.classList.remove('pulse');
    };
    
    recognition.start();
  }
}
