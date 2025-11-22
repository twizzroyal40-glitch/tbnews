import { Article, Category } from "../types";
import { db } from "./firebase";
import { collection, getDocs, addDoc, query, orderBy, Timestamp } from "firebase/firestore";

// --- MOCK DATA (Fallback for empty DB) ---
const getPlaceholderImage = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const INITIAL_DATA: Article[] = [
  // --- TERKINI / HOME / HEADLINE ---
  {
    id: 'headline-1',
    title: "Kapolresta Sorong Kota Pimpin Apel Gelar Pasukan Operasi Mantap Praja",
    excerpt: "Polresta Sorong Kota menggelar apel pasukan untuk memastikan kesiapan personel dalam mengamankan agenda Pilkada serentak tahun ini.",
    content: `SORONG KOTA - Kepala Kepolisian Resor Kota (Kapolresta) Sorong Kota memimpin langsung Apel Gelar Pasukan dalam rangka Operasi Mantap Praja di lapangan Mapolresta Sorong Kota pagi ini. Kegiatan ini bertujuan untuk mengecek kesiapan personel, sarana, dan prasarana sebelum diterjunkan ke lapangan.
    
    [IMAGE:https://picsum.photos/seed/apel-detail/800/400]

    Dalam amanatnya, Kapolresta menekankan pentingnya netralitas anggota Polri dalam mengawal pesta demokrasi. "Kita harus menjamin keamanan dan ketertiban masyarakat agar seluruh tahapan pemilu dapat berjalan dengan lancar, damai, dan kondusif," tegasnya di hadapan ratusan personel gabungan.
    
    Selain personel Polri, apel ini juga diikuti oleh unsur TNI, Satpol PP, dan Dinas Perhubungan. Sinergitas antar instansi diharapkan mampu meminimalisir potensi gangguan keamanan di wilayah hukum Polresta Sorong Kota. Operasi ini akan berlangsung selama tahapan inti pemilu hingga pelantikan pejabat terpilih.`,
    category: Category.KEGIATAN,
    author: "Bripka Agus Setiawan",
    publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    imageUrl: getPlaceholderImage('apel-pagi'),
    views: 1540,
    commentCount: 45,
    shareCount: 120
  },
  {
    id: 'krim-1',
    title: "Tim Resmob Mangewang Bekuk Pelaku Curanmor di Km 10",
    excerpt: "Satuan Reserse Kriminal (Sat Reskrim) Polresta Sorong Kota berhasil mengamankan pelaku pencurian kendaraan bermotor yang meresahkan warga.",
    content: `TIM RESMOB - Gerak cepat Tim Resmob Mangewang Polresta Sorong Kota membuahkan hasil. Seorang pria berinisial JK (24) yang diduga kuat sebagai spesialis pencurian kendaraan bermotor (Curanmor) berhasil dibekuk di kawasan Kilometer 10 Masuk, Kota Sorong, dini hari tadi.
    
    Penangkapan bermula dari laporan warga yang kehilangan sepeda motor matic saat diparkir di halaman rumah. Berdasarkan hasil penyelidikan dan rekaman CCTV di sekitar TKP, tim berhasil mengidentifikasi pelaku. Saat ditangkap, pelaku tidak melakukan perlawanan berarti.
    
    "Kami mengamankan barang bukti berupa satu unit sepeda motor Honda Beat warna hitam dan kunci T yang digunakan pelaku," ujar Kasat Reskrim. Saat ini pelaku telah diamankan di Mapolresta Sorong Kota untuk pemeriksaan lebih lanjut dan pengembangan kasus guna mengungkap jaringan penadah barang curian tersebut.`,
    category: Category.KRIMINAL,
    author: "Humas Polresta",
    publishedAt: "14 Oktober 2023",
    imageUrl: getPlaceholderImage('resmob'),
    views: 3200,
    commentCount: 89,
    shareCount: 210
  },
  
  // --- KRIMINAL ---
  {
    id: 'krim-2',
    title: "Polresta Sorong Kota Musnahkan Ribuan Liter Miras Cap Tikus",
    excerpt: "Pemusnahan barang bukti minuman keras lokal jenis Cap Tikus hasil razia cipta kondisi selama sebulan terakhir.",
    content: `Pemusnahan barang bukti miras ini dilakukan di halaman belakang Mapolresta, disaksikan oleh perwakilan Kejaksaan Negeri dan tokoh masyarakat. Ribuan liter miras ini merupakan hasil sitaan dari berbagai warung dan kapal penumpang yang mencoba menyelundupkan barang haram tersebut ke Kota Sorong. Kapolresta menegaskan tidak ada toleransi bagi peredaran miras ilegal yang sering menjadi pemicu tindak kriminalitas.`,
    category: Category.KRIMINAL,
    author: "Tim Redaksi",
    publishedAt: "12 Oktober 2023",
    imageUrl: getPlaceholderImage('miras'),
    views: 980,
    commentCount: 23,
    shareCount: 45
  },
  {
    id: 'krim-3',
    title: "Dugaan Penganiayaan di Sorong Timur, Polisi Periksa 3 Saksi",
    excerpt: "Penyidik Polsek Sorong Timur tengah mendalami kasus dugaan penganiayaan yang terjadi di salah satu komplek perumahan.",
    content: `Unit Reskrim Polsek Sorong Timur bergerak cepat menindaklanjuti laporan penganiayaan. Hingga kini, tiga orang saksi telah diperiksa untuk dimintai keterangan. Korban saat ini masih menjalani perawatan di RSUD Sele Be Solu. Polisi menghimbau keluarga korban untuk menyerahkan penanganan kasus ini sepenuhnya kepada aparat penegak hukum dan tidak main hakim sendiri.`,
    category: Category.KRIMINAL,
    author: "Humas Polsek Sortim",
    publishedAt: "10 Oktober 2023",
    imageUrl: getPlaceholderImage('saksi'),
    views: 1200,
    commentCount: 12,
    shareCount: 5
  },

  // --- KEAMANAN ---
  {
    id: 'aman-1',
    title: "Patroli Dialogis Sat Samapta Sasar Wilayah Rawan Malam Hari",
    excerpt: "Meningkatkan rasa aman, Sat Samapta rutin gelar patroli dialogis menyapa warga di pos-pos kamling.",
    content: `Untuk mencegah gangguan Kamtibmas di malam hari, Satuan Samapta Polresta Sorong Kota mengintensifkan patroli dialogis. Rute patroli menyasar titik-titik yang dianggap rawan serta pemukiman padat penduduk. Dalam kesempatan tersebut, petugas menyempatkan diri berdialog dengan warga yang sedang berjaga di Pos Kamling, memberikan himbauan agar segera melapor ke layanan 110 jika menemukan hal mencurigakan.`,
    category: Category.KEAMANAN,
    author: "Bripda Putri",
    publishedAt: "13 Oktober 2023",
    imageUrl: getPlaceholderImage('patroli'),
    views: 850,
    commentCount: 15,
    shareCount: 30
  },
  {
    id: 'aman-2',
    title: "Sat Lantas Gelar Sosialisasi Tertib Berlalu Lintas di Sekolah",
    excerpt: "Menanamkan budaya tertib lalu lintas sejak dini kepada para pelajar SMA di Kota Sorong.",
    content: `Satuan Lalu Lintas (Sat Lantas) Polresta Sorong Kota menyambangi SMA Negeri 3 Kota Sorong dalam program 'Police Goes to School'. Kasat Lantas memberikan materi tentang pentingnya keselamatan berkendara, penggunaan helm SNI, dan larangan penggunaan knalpot brong yang mengganggu ketertiban umum. Para siswa tampak antusias mengikuti sesi tanya jawab.`,
    category: Category.KEAMANAN,
    author: "Humas Lantas",
    publishedAt: "11 Oktober 2023",
    imageUrl: getPlaceholderImage('lantas'),
    views: 1100,
    commentCount: 40,
    shareCount: 60
  },

  // --- KEGIATAN ---
  {
    id: 'giat-1',
    title: "Jumat Curhat: Kapolresta Dengar Langsung Keluhan Warga Rufei",
    excerpt: "Program Jumat Curhat terus digulirkan untuk menyerap aspirasi dan keluhan masyarakat secara langsung.",
    content: `Bertempat di Balai Kelurahan Rufei, Kapolresta Sorong Kota didampingi PJU menggelar kegiatan Jumat Curhat. Warga menyampaikan berbagai keluhan mulai dari masalah kamtibmas, peredaran miras, hingga kenakalan remaja. Kapolresta berjanji akan menindaklanjuti masukan warga dengan meningkatkan frekuensi patroli di wilayah tersebut.`,
    category: Category.KEGIATAN,
    author: "Humas Polresta",
    publishedAt: "13 Oktober 2023",
    imageUrl: getPlaceholderImage('jumat-curhat'),
    views: 2100,
    commentCount: 56,
    shareCount: 150
  },
  {
    id: 'giat-2',
    title: "Bakti Kesehatan Pengobatan Gratis Polri Presisi",
    excerpt: "Polresta Sorong Kota mengadakan pemeriksaan kesehatan gratis bagi masyarakat kurang mampu.",
    content: `Seksi Dokkes Polresta Sorong Kota menggelar bakti kesehatan berupa pengobatan umum dan pemberian vitamin gratis kepada warga pesisir. Kegiatan ini merupakan wujud kepedulian Polri terhadap kesehatan masyarakat. Ratusan warga antusias memeriksakan kesehatan mereka, mulai dari cek tensi, gula darah, hingga konsultasi dokter umum.`,
    category: Category.KEGIATAN,
    author: "dr. Iptu Sarah",
    publishedAt: "09 Oktober 2023",
    imageUrl: getPlaceholderImage('kesehatan'),
    views: 1500,
    commentCount: 34,
    shareCount: 90
  },

  // --- INSPIRASI ---
  {
    id: 'insp-1',
    title: "Bripka Asep: Polisi Bhabinkamtibmas yang Jadi Guru Mengaji",
    excerpt: "Kisah inspiratif Bhabinkamtibmas yang meluangkan waktu di luar dinas untuk mengajar mengaji anak-anak komplek.",
    content: `Di tengah kesibukannya menjaga keamanan desa binaan, Bripka Asep, anggota Bhabinkamtibmas Polsek Sorong Barat, rutin meluangkan waktu sore harinya untuk mengajar mengaji di TPQ Al-Ikhlas. Dedikasinya ini mendapat apresiasi luas dari masyarakat setempat. Ia percaya bahwa membangun akhlak generasi muda adalah bagian dari menjaga kamtibmas jangka panjang.`,
    category: Category.INSPIRASI,
    author: "Tim Feature",
    publishedAt: "05 Oktober 2023",
    imageUrl: getPlaceholderImage('ngaji'),
    views: 5400,
    commentCount: 120,
    shareCount: 500
  },

  // --- PRESS RELEASE ---
  {
    id: 'press-1',
    title: "PRESS RELEASE: Pengungkapan Kasus Narkotika Jenis Ganja 1 Kg",
    excerpt: "Konferensi pers terkait keberhasilan Sat Narkoba menggagalkan peredaran ganja kering siap edar.",
    content: `Polresta Sorong Kota menggelar konferensi pers terkait pengungkapan kasus penyalahgunaan narkotika. Barang bukti berupa ganja kering seberat 1 Kg berhasil diamankan dari tangan tersangka berinisial R di pelabuhan laut. Modus pelaku adalah menyamarkan barang haram tersebut di dalam kemasan makanan ringan. Pelaku dijerat dengan UU Narkotika dengan ancaman hukuman maksimal 20 tahun penjara.`,
    category: Category.PRESS_RELEASE,
    author: "Humas Polresta",
    publishedAt: "14 Oktober 2023",
    imageUrl: getPlaceholderImage('press-narkoba'),
    views: 2200,
    commentCount: 10,
    shareCount: 25
  }
];


// --- UTILS FOR DATE PARSING ---
const monthMap: { [key: string]: number } = {
  'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
  'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
};

const parseIndonesianDate = (dateStr: string): Date | null => {
  try {
    if (dateStr.includes('Baru saja')) return new Date();
    
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const monthIndex = monthMap[parts[1]];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || monthIndex === undefined || isNaN(year)) return null;

    return new Date(year, monthIndex, day);
  } catch (e) {
    return null;
  }
};

// --- SERVICES WITH FIREBASE ---

// Helper to fetch all articles once and cache in memory (for simplicity in this specific app structure)
// In a larger app, we would paginate directly from Firestore.
const getAllArticlesFromFirestore = async (): Promise<Article[]> => {
  try {
    const articlesRef = collection(db, 'articles');
    // Order by created timestamp desc
    const q = query(articlesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_DATA; // Fallback so the app isn't empty initially
    }

    const firestoreArticles = snapshot.docs.map(doc => {
       const data = doc.data();
       return { 
         id: doc.id, 
         ...data,
         // Ensure we match the Article interface
         title: data.title || '',
         excerpt: data.excerpt || '',
         content: data.content || '',
         category: data.category || Category.HOME,
         author: data.author || 'Admin',
         publishedAt: data.publishedAt || 'Baru saja',
         imageUrl: data.imageUrl || '',
         views: data.views || 0,
         commentCount: data.commentCount || 0,
         shareCount: data.shareCount || 0
       } as Article;
    });

    // Combine with INITIAL_DATA for demo purposes if needed, or just return firestoreArticles.
    // To keep the 'full' feel, let's append INITIAL_DATA at the end if the DB is small (< 5 items)
    if (firestoreArticles.length < 5) {
        return [...firestoreArticles, ...INITIAL_DATA];
    }

    return firestoreArticles;
  } catch (error: any) {
    // Handle Permission Denied specifically
    if (error.code === 'permission-denied') {
        console.warn("⚠️ Firestore Permission Denied: Unable to fetch articles. Using offline mock data.\nTo fix this, update your Firestore Security Rules in the Firebase Console to allow public read access:\n\nmatch /articles/{document=**} {\n  allow read: if true;\n}");
    } else {
        console.error("Error fetching articles from Firestore:", error);
    }
    // Return mock data so the app remains usable
    return INITIAL_DATA;
  }
};

export const fetchNewsArticles = async (category: Category): Promise<Article[]> => {
  // Add artificial delay for UX smoothness if desired, or remove
  // await new Promise(resolve => setTimeout(resolve, 300));
  
  const allArticles = await getAllArticlesFromFirestore();

  if (category === Category.HOME) {
    return allArticles.slice(0, 6);
  }

  const filtered = allArticles.filter(article => article.category === category);
  
  if (filtered.length < 2) {
     const fillers = Array.from({ length: 3 }).map((_, i) => ({
        id: `filler-${category}-${i}`,
        title: `[Contoh] Berita ${category} #${i+1}`,
        excerpt: `Berita ini muncul karena belum ada cukup data untuk kategori ${category}.`,
        content: `Lorem ipsum content...`,
        category: category,
        author: "Admin System",
        publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: getPlaceholderImage(`filler-${category}-${i}`),
        views: 0,
        commentCount: 0,
        shareCount: 0
     }));
     return [...filtered, ...fillers];
  }

  return filtered;
};

export const searchArticles = async (queryStr: string): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromFirestore();
  const lowerQuery = queryStr.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) || 
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery)
  );
};

export const getArticlesByMonth = async (year: number, month: number): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromFirestore();

  return allArticles.filter(article => {
    const date = parseIndonesianDate(article.publishedAt);
    if (!date) return false;

    return date.getFullYear() === year && date.getMonth() === month;
  });
};

export const createArticle = async (
  data: Omit<Article, 'id' | 'views' | 'commentCount' | 'shareCount' | 'publishedAt'>
): Promise<void> => {
  const publishedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  await addDoc(collection(db, 'articles'), {
    ...data,
    publishedAt,
    views: 0,
    commentCount: 0,
    shareCount: 0,
    createdAt: Timestamp.now() // For sorting
  });
};