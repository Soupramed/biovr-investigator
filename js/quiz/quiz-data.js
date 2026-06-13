/* ============================================================
   BioVR-Investigator — Quiz Data: Sistem Peredaran Darah
   Bank Soal HOTS (C4–C5) untuk SMA Kelas XI
   ============================================================ */

/**
 * @typedef {Object} QuizQuestion
 * @property {number}  id            - ID unik soal
 * @property {string}  type          - 'multiple-choice' | 'drag-label'
 * @property {string}  category      - Tingkat kognitif (C4/C5)
 * @property {string}  question      - Teks pertanyaan
 * @property {string[]} options      - Pilihan jawaban
 * @property {number}  correctAnswer - Indeks jawaban benar
 * @property {string}  explanation   - Penjelasan jawaban
 * @property {string}  hint          - Petunjuk opsional
 * @property {string}  relatedOrgan  - Organ terkait (link ke explore page)
 */

/** @type {QuizQuestion[]} */
export const questions = [
  /* ── 1. Fungsi ventrikel kiri vs kanan ── */
  {
    id: 1,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Ventrikel kiri memompa darah ke seluruh tubuh melalui aorta, sedangkan ventrikel kanan memompa darah ke paru-paru melalui arteri pulmonalis. Berdasarkan analisis fungsi tersebut, apa perbedaan utama antara kerja ventrikel kiri dan ventrikel kanan?',
    options: [
      'Ventrikel kiri memompa darah kaya O₂ ke sistemik, ventrikel kanan memompa darah miskin O₂ ke pulmonal',
      'Ventrikel kiri memompa darah miskin O₂ ke pulmonal, ventrikel kanan memompa darah kaya O₂ ke sistemik',
      'Keduanya memompa darah kaya O₂ ke arah yang berbeda',
      'Ventrikel kiri hanya memompa ke otak, ventrikel kanan ke seluruh tubuh',
    ],
    correctAnswer: 0,
    explanation:
      'Ventrikel kiri menerima darah kaya oksigen dari atrium kiri (berasal dari vena pulmonalis) dan memompanya ke seluruh tubuh melalui aorta (peredaran darah besar/sistemik). Sementara ventrikel kanan menerima darah miskin oksigen dari atrium kanan (berasal dari vena cava) dan memompanya ke paru-paru melalui arteri pulmonalis (peredaran darah kecil/pulmonal) untuk mengalami pertukaran gas.',
    hint: 'Perhatikan arah peredaran darah besar dan kecil.',
    relatedOrgan: 'ventrikel-kiri',
  },

  /* ── 2. Urutan peredaran darah besar ── */
  {
    id: 2,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Perhatikan urutan berikut:\n(1) Aorta  (2) Ventrikel kiri  (3) Kapiler jaringan tubuh  (4) Vena cava  (5) Atrium kanan\n\nUrutan yang benar untuk peredaran darah besar (sistemik) adalah …',
    options: [
      '2 → 1 → 3 → 4 → 5',
      '5 → 4 → 3 → 1 → 2',
      '2 → 4 → 1 → 3 → 5',
      '1 → 2 → 3 → 5 → 4',
    ],
    correctAnswer: 0,
    explanation:
      'Peredaran darah besar (sistemik) dimulai dari ventrikel kiri (2) → darah dipompa melalui aorta (1) → menuju kapiler di seluruh jaringan tubuh (3) untuk pertukaran zat → darah kembali melalui vena cava superior & inferior (4) → masuk ke atrium kanan (5). Ini memastikan seluruh jaringan tubuh mendapatkan oksigen dan nutrisi.',
    hint: 'Peredaran darah besar dimulai dari ventrikel kiri.',
    relatedOrgan: 'aorta',
  },

  /* ── 3. Urutan peredaran darah kecil ── */
  {
    id: 3,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Pada peredaran darah kecil (pulmonal), darah mengalir dari jantung ke paru-paru dan kembali ke jantung. Manakah urutan yang paling tepat?',
    options: [
      'Ventrikel kanan → Aorta → Paru-paru → Vena pulmonalis → Atrium kiri',
      'Ventrikel kanan → Arteri pulmonalis → Paru-paru → Vena pulmonalis → Atrium kiri',
      'Atrium kanan → Arteri pulmonalis → Paru-paru → Vena cava → Ventrikel kiri',
      'Ventrikel kiri → Arteri pulmonalis → Paru-paru → Vena cava → Atrium kanan',
    ],
    correctAnswer: 1,
    explanation:
      'Peredaran darah kecil dimulai dari ventrikel kanan yang memompa darah miskin O₂ melalui arteri pulmonalis menuju paru-paru. Di paru-paru terjadi pertukaran gas: CO₂ dilepaskan dan O₂ diikat. Darah yang sudah kaya O₂ kembali ke jantung melalui vena pulmonalis dan masuk ke atrium kiri. Perhatikan bahwa arteri pulmonalis unik karena membawa darah miskin O₂, berbeda dengan arteri lainnya.',
    hint: 'Peredaran darah kecil hanya melibatkan jantung dan paru-paru.',
    relatedOrgan: 'arteri-pulmonalis',
  },

  /* ── 4. Dinding ventrikel kiri lebih tebal ── */
  {
    id: 4,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Ketika membedah jantung, seorang siswa mengamati bahwa dinding ventrikel kiri jauh lebih tebal dibandingkan ventrikel kanan. Evaluasi mengapa hal tersebut terjadi dari sudut pandang fisiologis!',
    options: [
      'Karena ventrikel kiri menampung lebih banyak darah daripada ventrikel kanan',
      'Karena ventrikel kiri harus menghasilkan tekanan lebih besar untuk memompa darah ke seluruh tubuh',
      'Karena ventrikel kiri berfungsi sebagai cadangan darah',
      'Karena ventrikel kanan hanya memompa darah ke otak saja',
    ],
    correctAnswer: 1,
    explanation:
      'Dinding ventrikel kiri lebih tebal karena harus menghasilkan tekanan yang jauh lebih besar untuk memompa darah ke seluruh tubuh (peredaran darah sistemik) melalui aorta. Jarak yang ditempuh darah sangat jauh — dari kepala hingga ujung kaki. Sementara ventrikel kanan hanya perlu memompa darah ke paru-paru yang jaraknya relatif dekat, sehingga memerlukan tekanan yang lebih kecil dan dindingnya lebih tipis. Otot jantung (miokardium) ventrikel kiri bisa 3× lebih tebal dari ventrikel kanan.',
    hint: 'Pikirkan tentang jarak yang harus ditempuh darah.',
    relatedOrgan: 'ventrikel-kiri',
  },

  /* ── 5. Perbedaan arteri dan vena ── */
  {
    id: 5,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Perhatikan ciri-ciri pembuluh darah berikut:\n(P) Dinding tebal dan elastis\n(Q) Memiliki katup di sepanjang pembuluh\n(R) Membawa darah menjauhi jantung\n(S) Tekanan darah rendah\n\nCiri-ciri yang dimiliki oleh pembuluh vena adalah …',
    options: [
      'P dan R',
      'Q dan S',
      'P dan S',
      'R dan Q',
    ],
    correctAnswer: 1,
    explanation:
      'Pembuluh vena memiliki katup (Q) di sepanjang pembuluh untuk mencegah darah mengalir balik karena tekanan darahnya rendah (S). Dinding vena tipis dan kurang elastis, berbeda dengan arteri yang berdinding tebal dan elastis (P) karena harus menahan tekanan tinggi dari pompa jantung. Arteri membawa darah menjauhi jantung (R), sedangkan vena membawa darah menuju jantung. Katup pada vena sangat penting terutama pada vena di kaki yang harus melawan gravitasi.',
    hint: 'Vena membawa darah menuju jantung dengan tekanan rendah.',
    relatedOrgan: 'vena',
  },

  /* ── 6. Fungsi katup jantung ── */
  {
    id: 6,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Jantung memiliki empat katup: katup bikuspid (mitral), trikuspid, katup aorta, dan katup pulmonal. Analisis fungsi utama keempat katup jantung tersebut dalam mekanisme kerja jantung!',
    options: [
      'Mengatur kecepatan detak jantung',
      'Mencegah aliran balik darah sehingga darah mengalir satu arah',
      'Mengatur volume darah yang dipompa oleh jantung',
      'Membagi jantung menjadi empat ruang',
    ],
    correctAnswer: 1,
    explanation:
      'Fungsi utama keempat katup jantung adalah mencegah aliran balik (regurgitasi) darah sehingga darah selalu mengalir dalam satu arah yang benar. Katup trikuspid (antara atrium kanan & ventrikel kanan) dan katup bikuspid/mitral (antara atrium kiri & ventrikel kiri) mencegah darah kembali ke atrium saat ventrikel berkontraksi (sistol). Katup aorta dan katup pulmonal (semilunar) mencegah darah dari aorta dan arteri pulmonalis kembali ke ventrikel saat relaksasi (diastol).',
    hint: 'Bayangkan apa yang terjadi jika darah bisa mengalir kembali.',
    relatedOrgan: 'katup-jantung',
  },

  /* ── 7. Katup mitral rusak ── */
  {
    id: 7,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Seorang pasien didiagnosis mengalami kerusakan katup mitral (bikuspid) sehingga katup tidak dapat menutup sempurna. Evaluasi dampak kondisi ini terhadap sistem peredaran darah pasien!',
    options: [
      'Darah dari aorta akan kembali ke ventrikel kiri',
      'Darah dari ventrikel kiri akan kembali ke atrium kiri saat sistol, menyebabkan penurunan curah jantung',
      'Darah dari ventrikel kanan akan mengalir ke paru-paru lebih cepat',
      'Tidak ada dampak signifikan karena jantung memiliki katup cadangan',
    ],
    correctAnswer: 1,
    explanation:
      'Kerusakan katup mitral (insufisiensi mitral) menyebabkan katup tidak bisa menutup sempurna saat ventrikel kiri berkontraksi (sistol). Akibatnya, sebagian darah mengalir balik (regurgitasi) ke atrium kiri. Hal ini menyebabkan: (1) Volume darah yang dipompa ke aorta berkurang → curah jantung menurun, (2) Atrium kiri mengalami penambahan volume → dilatasi atrium kiri, (3) Tekanan di atrium kiri meningkat → dapat menyebabkan edema paru, (4) Jantung harus bekerja lebih keras untuk mengkompensasi → hipertrofi ventrikel kiri → gagal jantung.',
    hint: 'Katup mitral terletak antara atrium kiri dan ventrikel kiri.',
    relatedOrgan: 'katup-mitral',
  },

  /* ── 8. Pertukaran gas di alveolus ── */
  {
    id: 8,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Di dalam alveolus paru-paru, terjadi pertukaran gas antara udara dan darah. Analisis mekanisme yang memungkinkan pertukaran gas O₂ dan CO₂ terjadi di alveolus!',
    options: [
      'Transport aktif yang memerlukan ATP',
      'Difusi berdasarkan perbedaan tekanan parsial gas (dari tekanan tinggi ke rendah)',
      'Osmosis melalui membran kapiler',
      'Endositosis oleh sel-sel alveolus',
    ],
    correctAnswer: 1,
    explanation:
      'Pertukaran gas di alveolus terjadi melalui mekanisme difusi pasif berdasarkan perbedaan tekanan parsial gas. O₂ di udara alveolus memiliki tekanan parsial lebih tinggi (~104 mmHg) daripada di kapiler paru (~40 mmHg), sehingga O₂ berdifusi dari alveolus ke kapiler darah. Sebaliknya, CO₂ di kapiler memiliki tekanan parsial lebih tinggi (~45 mmHg) daripada di alveolus (~40 mmHg), sehingga CO₂ berdifusi dari kapiler ke alveolus. Proses ini dipermudah oleh dinding alveolus yang sangat tipis (0.2 μm), luas permukaan besar (~70 m²), dan jaringan kapiler yang padat.',
    hint: 'Pikirkan tentang hukum difusi dan tekanan parsial.',
    relatedOrgan: 'paru-paru',
  },

  /* ── 9. Komponen darah dan fungsi ── */
  {
    id: 9,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Darah tersusun dari beberapa komponen: sel darah merah (eritrosit), sel darah putih (leukosit), keping darah (trombosit), dan plasma darah. Jika seseorang mengalami penurunan jumlah trombosit secara drastis, analisis dampak yang paling mungkin terjadi!',
    options: [
      'Kemampuan mengangkut oksigen menurun drastis',
      'Tubuh lebih rentan terhadap infeksi bakteri dan virus',
      'Proses pembekuan darah terganggu sehingga mudah terjadi perdarahan',
      'Tekanan osmotik darah menurun menyebabkan edema',
    ],
    correctAnswer: 2,
    explanation:
      'Trombosit (keping darah) berfungsi utama dalam proses hemostasis (pembekuan darah). Ketika terjadi luka pada pembuluh darah, trombosit akan menempel pada area yang rusak, teraktivasi, dan membentuk sumbat trombosit. Trombosit juga melepaskan faktor-faktor pembekuan yang penting dalam kaskade koagulasi. Jika jumlah trombosit menurun drastis (trombositopenia, <150.000/μL), maka proses pembekuan darah terganggu sehingga pasien mudah mengalami perdarahan (memar spontan, gusi berdarah, petechiae). Kondisi kritis terjadi jika trombosit <20.000/μL.',
    hint: 'Ingat fungsi spesifik setiap komponen darah.',
    relatedOrgan: 'darah',
  },

  /* ── 10. Diagnosis kasus: Hb rendah ── */
  {
    id: 10,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Seorang pasien wanita berusia 25 tahun datang dengan keluhan mudah lelah, pucat, dan sering pusing. Hasil laboratorium menunjukkan kadar Hb: 8 g/dL (normal: 12–16 g/dL). Evaluasi diagnosis yang paling tepat dan dampaknya terhadap sistem peredaran darah!',
    options: [
      'Leukemia — sel darah putih berlebih menekan produksi eritrosit',
      'Anemia — hemoglobin rendah menyebabkan kapasitas angkut oksigen menurun sehingga jaringan kekurangan O₂',
      'Hemofilia — gangguan pembekuan darah menyebabkan perdarahan internal',
      'Polisitemia — kelebihan eritrosit menyebabkan darah terlalu kental',
    ],
    correctAnswer: 1,
    explanation:
      'Pasien ini mengalami anemia (Hb 8 g/dL, di bawah normal 12–16 g/dL untuk wanita). Hemoglobin (Hb) adalah protein dalam eritrosit yang berfungsi mengikat dan mengangkut oksigen dari paru-paru ke seluruh jaringan tubuh. Ketika kadar Hb rendah, kapasitas darah untuk mengangkut O₂ menurun signifikan. Akibatnya: (1) Jaringan tubuh mengalami hipoksia → mudah lelah, (2) Kompensasi jantung berdetak lebih cepat (takikardia) → palpitasi, (3) Aliran darah ke kulit berkurang → pucat, (4) Otak kekurangan O₂ → pusing. Pada wanita, penyebab tersering adalah defisiensi zat besi akibat menstruasi.',
    hint: 'Perhatikan kadar Hb dan fungsi utamanya.',
    relatedOrgan: 'eritrosit',
  },

  /* ── 11. Diagnosis kasus: plak di arteri ── */
  {
    id: 11,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Hasil pemeriksaan angiografi pada seorang pria berusia 55 tahun menunjukkan adanya penumpukan plak (fatty deposits) di dinding arteri koroner yang menyumbat 70% lumen pembuluh. Evaluasi kondisi ini dan dampaknya!',
    options: [
      'Varises — pelebaran pembuluh vena di kaki',
      'Aterosklerosis — penyempitan arteri koroner dapat menyebabkan iskemia miokard dan risiko serangan jantung',
      'Hipotensi — tekanan darah terlalu rendah karena pembuluh darah melebar',
      'Aneurisma — pembuluh darah melemah dan membentuk gelembung',
    ],
    correctAnswer: 1,
    explanation:
      'Kondisi ini adalah aterosklerosis pada arteri koroner (penyakit jantung koroner). Plak aterosklerotik terbentuk dari penumpukan kolesterol LDL, sel-sel inflamasi, dan jaringan fibrosa di dinding arteri. Dengan sumbatan 70%, aliran darah ke miokardium (otot jantung) sangat terganggu. Dampaknya: (1) Iskemia miokard — otot jantung kekurangan O₂, terutama saat aktivitas → nyeri dada (angina), (2) Jika plak pecah → trombosis → sumbatan total → infark miokard (serangan jantung), (3) Bagian otot jantung yang tidak mendapat aliran darah akan mengalami nekrosis (kematian sel). Faktor risiko: merokok, hipertensi, diabetes, kolesterol tinggi, obesitas.',
    hint: 'Arteri koroner memasok darah ke otot jantung itu sendiri.',
    relatedOrgan: 'arteri-koroner',
  },

  /* ── 12. Perbedaan peredaran darah besar dan kecil ── */
  {
    id: 12,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Sistem peredaran darah manusia terdiri dari peredaran darah besar (sistemik) dan kecil (pulmonal). Analisis perbedaan mendasar antara keduanya berdasarkan tabel berikut:\n\nManakah pernyataan yang BENAR?',
    options: [
      'Peredaran darah besar mengalirkan darah kaya CO₂ dari jantung ke paru-paru',
      'Peredaran darah kecil dimulai dari ventrikel kanan dan berakhir di atrium kiri, berfungsi untuk oksigenasi darah',
      'Kedua peredaran darah dimulai dari ventrikel kiri',
      'Peredaran darah kecil mengalirkan darah ke seluruh organ tubuh',
    ],
    correctAnswer: 1,
    explanation:
      'Perbedaan mendasar: PEREDARAN DARAH BESAR (Sistemik) dimulai dari ventrikel kiri → aorta → kapiler seluruh tubuh → vena cava → atrium kanan. Fungsinya mengantar O₂ dan nutrisi ke jaringan tubuh serta mengambil CO₂ dan sisa metabolisme. PEREDARAN DARAH KECIL (Pulmonal) dimulai dari ventrikel kanan → arteri pulmonalis → kapiler paru-paru → vena pulmonalis → atrium kiri. Fungsinya khusus untuk oksigenasi — melepaskan CO₂ dan mengikat O₂ di alveolus paru-paru. Keduanya bekerja simultan dan saling melengkapi.',
    hint: 'Perhatikan titik awal, titik akhir, dan fungsi masing-masing.',
    relatedOrgan: 'jantung',
  },

  /* ── 13. Mekanisme pembekuan darah ── */
  {
    id: 13,
    type: 'multiple-choice',
    category: 'C4-Menganalisis',
    question:
      'Saat terjadi luka, tubuh memiliki mekanisme pembekuan darah (hemostasis) untuk menghentikan perdarahan. Analisis urutan proses pembekuan darah yang benar!',
    options: [
      'Fibrinogen → Fibrin → Trombin → Protrombin',
      'Trombosit pecah → Tromboplastin + Ca²⁺ → Protrombin menjadi Trombin → Fibrinogen menjadi Fibrin → Benang fibrin menjaring eritrosit',
      'Eritrosit pecah → Hemoglobin dilepas → Darah membeku',
      'Leukosit menempel pada luka → Membentuk sumbat → Luka tertutup',
    ],
    correctAnswer: 1,
    explanation:
      'Proses pembekuan darah (kaskade koagulasi) secara sederhana: (1) Pembuluh darah yang luka menyebabkan trombosit menempel dan pecah, melepaskan enzim tromboplastin (trombkinase). (2) Tromboplastin bersama ion Ca²⁺ dan vitamin K mengaktifkan protrombin (bentuk tidak aktif, dibuat di hati) menjadi trombin (bentuk aktif). (3) Trombin mengkatalisis perubahan fibrinogen (protein plasma larut) menjadi fibrin (protein tidak larut). (4) Benang-benang fibrin membentuk jaring yang menangkap eritrosit dan trombosit, membentuk bekuan darah (trombus) yang menyumbat luka. Seluruh proses ini memerlukan minimal 13 faktor pembekuan.',
    hint: 'Ingat peran trombosit, protrombin, trombin, dan fibrin.',
    relatedOrgan: 'trombosit',
  },

  /* ── 14. Dampak merokok ── */
  {
    id: 14,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Seorang dokter menjelaskan bahwa merokok menjadi faktor risiko utama penyakit kardiovaskular. Evaluasi mekanisme bagaimana merokok merusak sistem peredaran darah!',
    options: [
      'Nikotin meningkatkan produksi eritrosit sehingga darah terlalu encer',
      'Tar dalam rokok menghancurkan sel darah putih sehingga imunitas turun',
      'Nikotin menyebabkan vasokonstriksi dan meningkatkan tekanan darah, CO mengikat Hb lebih kuat dari O₂ sehingga suplai oksigen berkurang, serta mempercepat pembentukan plak aterosklerosis',
      'Merokok hanya memengaruhi paru-paru dan tidak berdampak pada sistem peredaran darah',
    ],
    correctAnswer: 2,
    explanation:
      'Merokok merusak sistem peredaran darah melalui beberapa mekanisme: (1) NIKOTIN — menyebabkan vasokonstriksi (penyempitan pembuluh darah) → meningkatkan tekanan darah dan beban kerja jantung, meningkatkan denyut jantung, dan meningkatkan risiko aritmia. (2) KARBON MONOKSIDA (CO) — memiliki afinitas terhadap hemoglobin 200–250× lebih kuat dari O₂, membentuk karboksihemoglobin (HbCO) → mengurangi kapasitas angkut oksigen → jaringan hipoksia. (3) KERUSAKAN ENDOTEL — zat kimia dalam rokok merusak lapisan endotel pembuluh darah → memicu inflamasi → mempercepat pembentukan plak aterosklerosis. (4) Meningkatkan agregasi trombosit → risiko trombosis. Kombinasi ini meningkatkan risiko serangan jantung dan stroke secara dramatis.',
    hint: 'Pikirkan efek nikotin dan karbon monoksida.',
    relatedOrgan: 'pembuluh-darah',
  },

  /* ── 15. Analisis kasus: tekanan darah tinggi ── */
  {
    id: 15,
    type: 'multiple-choice',
    category: 'C5-Mengevaluasi',
    question:
      'Seorang pria berusia 50 tahun memiliki tekanan darah 180/110 mmHg (normal: <120/80 mmHg) yang tidak terkontrol selama 10 tahun. Evaluasi dampak jangka panjang hipertensi kronis terhadap organ-organ dalam sistem peredaran darah!',
    options: [
      'Tidak ada dampak signifikan jika pasien tidak merasakan gejala',
      'Hanya menyebabkan sakit kepala ringan dan dapat sembuh sendiri',
      'Jantung mengalami hipertrofi ventrikel kiri, pembuluh darah mengalami kerusakan endotel dan aterosklerosis, ginjal mengalami nefrosklerosis, serta meningkatkan risiko stroke',
      'Tekanan darah tinggi justru menguntungkan karena darah mengalir lebih cepat ke seluruh tubuh',
    ],
    correctAnswer: 2,
    explanation:
      'Hipertensi kronis (180/110 mmHg selama 10 tahun) menyebabkan kerusakan multi-organ: (1) JANTUNG — Ventrikel kiri harus bekerja ekstra keras melawan tekanan tinggi → otot jantung menebal (hipertrofi ventrikel kiri) → lama-kelamaan jantung melemah → gagal jantung. (2) PEMBULUH DARAH — Tekanan tinggi terus-menerus merusak lapisan endotel → mempercepat aterosklerosis → risiko penyakit jantung koroner. (3) GINJAL — Pembuluh darah kecil di ginjal rusak (nefrosklerosis) → fungsi filtrasi menurun → gagal ginjal kronis. (4) OTAK — Risiko stroke iskemik (sumbatan) atau hemoragik (pecahnya pembuluh darah otak) meningkat drastis. (5) MATA — Retinopati hipertensi → gangguan penglihatan. Hipertensi disebut "silent killer" karena seringkali tanpa gejala namun merusak organ secara perlahan.',
    hint: 'Hipertensi disebut "silent killer" karena merusak organ secara diam-diam.',
    relatedOrgan: 'jantung',
  },
];

/**
 * Mengembalikan daftar soal yang diacak urutannya
 * @returns {QuizQuestion[]}
 */
export function getShuffledQuestions() {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Mengembalikan grade berdasarkan persentase
 * @param {number} percentage
 * @returns {{ grade: string, label: string, color: string }}
 */
export function getGrade(percentage) {
  if (percentage >= 90) return { grade: 'A', label: 'Sangat Baik', color: '#00ff88' };
  if (percentage >= 75) return { grade: 'B', label: 'Baik', color: '#00d4ff' };
  if (percentage >= 60) return { grade: 'C', label: 'Cukup', color: '#fbbf24' };
  return { grade: 'D', label: 'Perlu Belajar Lagi', color: '#ff3366' };
}
