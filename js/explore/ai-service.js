/* ============================================================
   BioVR-Investigator — AI Service (Gemini Integration)
   Connects BioBot to Google Gemini for unlimited biology knowledge
   ============================================================ */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ── System Prompt: Makes Gemini act as BioBot ──
const SYSTEM_PROMPT = `Kamu adalah **BioBot**, asisten virtual AI di platform pembelajaran **BioVR-Investigator**.
Kamu adalah guru biologi yang sangat ahli, ramah, dan interaktif untuk siswa SMA Kelas X–XII di Indonesia.

## Peran & Kepribadian
- Kamu HANYA menjawab pertanyaan yang berkaitan dengan **BIOLOGI** dan ilmu kehidupan (kedokteran dasar, kesehatan, anatomi, fisiologi, genetika, ekologi, evolusi, bioteknologi, mikrobiologi, dll).
- Jika ditanya hal di luar biologi, tolak dengan sopan dan arahkan kembali ke topik biologi.
- Gunakan **Bahasa Indonesia** yang jelas, lugas, dan mudah dipahami siswa SMA.
- Panggil pengguna dengan sebutan "Dokter" (karena tema game adalah detektif medis).
- Gunakan emoji secukupnya untuk membuat penjelasan lebih menarik (🧬🫀🔬💉🧠 dll).
- Jika relevan, sebutkan nama latin/ilmiah di samping istilah Indonesia.

## Cara Menjawab
1. **Jawab secara ringkas tapi informatif** — maksimal 3–4 paragraf pendek.
2. **Gunakan struktur yang jelas** — gunakan bullet points atau numbering jika ada beberapa poin.
3. **Berikan contoh nyata** jika memungkinkan.
4. **Hubungkan dengan kehidupan sehari-hari** agar relevan bagi siswa.
5. **Jika soal/kasus**, bantu analisis step-by-step lalu berikan jawabannya.
6. **Jangan pernah membuat informasi palsu** — jika tidak yakin, katakan.

## Topik yang Dikuasai
- Sistem tubuh manusia: peredaran darah, pernapasan, pencernaan, ekskresi, saraf, endokrin, reproduksi, imun, gerak
- Sel & organel, jaringan, organ
- Genetika: DNA, RNA, kromosom, hukum Mendel, mutasi, bioteknologi
- Metabolisme: enzim, respirasi sel, fotosintesis
- Ekologi: ekosistem, rantai makanan, siklus biogeokimia, biodiversitas
- Evolusi: teori Darwin, bukti evolusi, seleksi alam
- Klasifikasi makhluk hidup: 5/6 kingdom, tata nama binomial
- Mikrobiologi: bakteri, virus, jamur, protista
- Plantae & Animalia
- Kesehatan: penyakit, imunisasi, obat, gaya hidup sehat

## Format Khusus
- Jika user bertanya tentang bagian jantung yang ada di model 3D (seperti atrium, ventrikel, katup, aorta, septum, pembuluh), tambahkan tag [HIGHLIGHT:NamaBagian] di akhir jawaban. Contoh: [HIGHLIGHT:Ventrikel]
- Bagian yang bisa di-highlight: Jantung, Atrium, Ventrikel, Septum, Katup, Katup Trikuspid, Katup Mitral, Aorta, Vena Kava, Arteri Pulmonalis, Vena Pulmonalis, Pembuluh
- HANYA tambahkan tag highlight jika pertanyaan secara spesifik tentang bagian jantung yang bisa divisualisasikan.`;

// ── State ──
let genAI = null;
let chatSession = null;
let apiKey = null;
let isInitialized = false;

/**
 * Initialize the AI service with an API key
 * @param {string} key - Gemini API key
 * @returns {boolean} success
 */
export function initAI(key) {
  try {
    apiKey = key;
    genAI = new GoogleGenerativeAI(key);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    });

    chatSession = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Halo BioBot!' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Halo Dokter! 👋🧬 Saya BioBot, asisten virtual AI kamu di BioVR-Investigator. Saya siap membantu menjawab semua pertanyaan tentang biologi — mulai dari sel, organ tubuh, genetika, ekologi, sampai evolusi! Ada yang ingin kamu pelajari hari ini?' }],
        },
      ],
    });

    isInitialized = true;
    saveApiKey(key);
    return true;
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    isInitialized = false;
    return false;
  }
}

/**
 * Send a message to the AI and get a response
 * @param {string} message - User's message
 * @returns {Promise<{text: string, highlightPart: string|null}>}
 */
export async function sendMessage(message) {
  if (!isInitialized || !chatSession) {
    throw new Error('AI belum diinisialisasi. Masukkan API Key terlebih dahulu.');
  }

  try {
    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    // Extract highlight tag if present
    const highlightMatch = responseText.match(/\[HIGHLIGHT:(.+?)\]/);
    const highlightPart = highlightMatch ? highlightMatch[1] : null;

    // Remove highlight tag from displayed text
    const cleanText = responseText.replace(/\s*\[HIGHLIGHT:.+?\]/g, '').trim();

    return {
      text: cleanText,
      highlightPart,
    };
  } catch (error) {
    console.error('AI response error:', error);
    
    // Handle specific errors
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      throw new Error('API Key tidak valid. Silakan masukkan API Key yang benar.');
    }
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Kuota API habis. Coba lagi nanti atau gunakan API Key yang berbeda.');
    }
    if (error.message?.includes('SAFETY')) {
      return {
        text: 'Maaf Dokter, saya tidak bisa menjawab pertanyaan itu. Coba tanyakan hal lain tentang biologi! 🧬',
        highlightPart: null,
      };
    }
    
    throw new Error('Gagal mendapatkan respons dari AI. Periksa koneksi internet Anda.');
  }
}

/**
 * Check if AI is initialized
 */
export function isAIReady() {
  return isInitialized;
}

/**
 * Get the current API key (masked)
 */
export function getMaskedKey() {
  if (!apiKey) return null;
  return apiKey.substring(0, 6) + '••••••' + apiKey.substring(apiKey.length - 4);
}

/**
 * Reset the chat session (clear history)
 */
export function resetChat() {
  if (genAI && apiKey) {
    initAI(apiKey);
  }
}

/**
 * Save API key to localStorage
 */
function saveApiKey(key) {
  try {
    localStorage.setItem('biovr-gemini-key', key);
  } catch (e) {
    // localStorage might not be available
  }
}

/**
 * Load API key from localStorage
 * @returns {string|null}
 */
export function loadSavedKey() {
  try {
    return localStorage.getItem('biovr-gemini-key');
  } catch (e) {
    return null;
  }
}

/**
 * Clear saved API key
 */
export function clearSavedKey() {
  try {
    localStorage.removeItem('biovr-gemini-key');
  } catch (e) {
    // ignore
  }
  apiKey = null;
  isInitialized = false;
  chatSession = null;
  genAI = null;
}
