import { Article, Category, Comment, AdConfig } from "../types";
import { supabase } from "../utils/supabase";

// --- HELPER: ERROR LOGGING ---
const logServiceError = (context: string, error: any) => {
  const message = error instanceof Error ? error.message : (error?.message || String(error));
  const isNetworkError = message.includes('Failed to fetch') || message.includes('Network request failed') || message.includes('NetworkError');
  
  if (isNetworkError) {
    console.warn(
      `[Mode Offline Aktif] Tidak dapat terhubung ke Supabase untuk '${context}'.\n` +
      `Alasan umum:\n` +
      `1. Proyek Supabase sedang dijeda (paused) atau tidak aktif.\n` +
      `2. Variabel environment SUPABASE_URL/SUPABASE_ANON_KEY salah atau tidak ada.\n` +
      `3. Masalah konektivitas jaringan (firewall, offline, dll.).\n` +
      `Aplikasi mungkin tidak menampilkan data dari server.`
    );
  } else if (message.toLowerCase().includes("relation") && message.toLowerCase().includes("does not exist")) {
    console.error(
        `[Database Error] di '${context}': Tabel yang diperlukan tidak ditemukan. \n` +
        `Detail: ${message} \n` +
        `Pastikan skema database Supabase Anda (misalnya, tabel 'articles', 'comments') telah diatur dengan benar.`
    );
  } else {
    console.warn(`[Service Error] di '${context}': ${message}`);
  }
};

// --- HELPER: CHECK CONNECTION ---
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try a very lightweight query to check connection
    const { error } = await supabase.from('articles').select('count', { count: 'exact', head: true });
    // If error is null, connection worked. If error exists, it failed.
    return !error;
  } catch (e) {
    return false;
  }
};

// --- HELPER: MAPPER ---
// Maps Supabase raw object to application Article type
const mapSupabaseToArticle = (item: any): Article => ({
    id: item.id?.toString() || Math.random().toString(),
    title: item.title || 'Tanpa Judul',
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category || Category.HOME,
    author: item.author || 'Admin',
    publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID'),
    imageUrl: item.image_url || item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
    views: item.views || 0,
    commentCount: item.comment_count || 0,
    shareCount: item.share_count || 0
});

// --- HELPER: INCREMENT COUNTER ---
const incrementField = async (id: string, field: 'views' | 'comment_count' | 'share_count'): Promise<number | null> => {
  try {
    // 1. Get current value
    const { data: currentData, error: fetchError } = await supabase
      .from('articles')
      .select(field)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const currentValue = Number(currentData[field]) || 0;
    const newValue = currentValue + 1;

    // 2. Update with new value
    const { error: updateError } = await supabase
      .from('articles')
      .update({ [field]: newValue })
      .eq('id', id);

    if (updateError) throw updateError;

    return newValue;
  } catch (error) {
    // Silent fail for counters is acceptable
    logServiceError(`incrementField(${id}, ${field})`, error);
    return null;
  }
};

// --- SERVICES WITH SUPABASE (SERVER-SIDE FILTERING) ---

// Fetch ALL articles (Admin use primarily)
export const getAllArticlesFromSupabase = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
    logServiceError("getAllArticlesFromSupabase", error);
    return []; // Return empty array on failure
  }
};

// Optimized: Fetch by Category
export const fetchNewsArticles = async (category: Category): Promise<Article[]> => {
  try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (category !== Category.HOME) {
          query = query.eq('category', category);
      } else {
          query = query.limit(10); // Limit homepage fetch for speed
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
      logServiceError(`fetchNewsArticles(${category})`, error);
      return []; // Return empty array
  }
};

// Optimized: Get Latest News (Limit 20)
export const getLatestNews = async (): Promise<Article[]> => {
  try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
      logServiceError("getLatestNews", error);
      return []; // Return empty array
  }
};

// Optimized: Get Popular (Order by views DB side)
export const getPopularArticles = async (): Promise<Article[]> => {
  try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('views', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
      logServiceError("getPopularArticles", error);
      return []; // Return empty array
  }
};

// Optimized: Search DB side using ILIKE
export const searchArticles = async (queryStr: string): Promise<Article[]> => {
  try {
      if (!queryStr) return [];
      
      const pattern = `%${queryStr}%`;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
      logServiceError(`searchArticles(${queryStr})`, error);
      return []; // Return empty array
  }
};

// Get articles by month (Optimized to query DB directly)
export const getArticlesByMonth = async (year: number, month: number): Promise<Article[]> => {
  try {
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      
      const { data, error } = await supabase
          .from('articles')
          .select('*')
          .gte('published_at', startDate)
          .lte('published_at', endDate)
          .order('published_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(mapSupabaseToArticle);
  } catch (error: any) {
      logServiceError(`getArticlesByMonth(${year}-${month})`, error);
      return []; // Return empty array
  }
};

// --- COUNTER SERVICES (VIEWS & SHARES) ---

export const incrementArticleView = async (id: string): Promise<number | null> => {
  return await incrementField(id, 'views');
};

export const incrementArticleShare = async (id: string): Promise<number | null> => {
  return await incrementField(id, 'share_count');
};

// --- IMAGE UPLOAD SERVICE ---
export const uploadArticleImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading image:", error.message || error);
    throw error;
  }
};

export const getGalleryImages = async (): Promise<{name: string, url: string}[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('news-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    return data.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(file.name);
      return {
        name: file.name,
        url: publicUrl
      };
    });
  } catch (error: any) {
    logServiceError("getGalleryImages", error);
    return []; // Return empty array
  }
};

export const deleteImage = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('news-images')
      .remove([fileName]);

    if (error) throw error;
  } catch (error: any) {
    console.error("Error deleting image:", error.message);
    throw error;
  }
};

// --- CRUD ARTICLE SERVICE ---

export const createArticle = async (
  data: Omit<Article, 'id' | 'views' | 'commentCount' | 'shareCount' | 'publishedAt'>
): Promise<void> => {
  // Use ISO 8601 format for database compatibility and proper filtering
  const publishedAt = new Date().toISOString();
  
  const { error } = await supabase.from('articles').insert([
    {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author,
      image_url: data.imageUrl, 
      published_at: publishedAt,
      views: 0,
      comment_count: 0,
      share_count: 0
    }
  ]);

  if (error) {
    console.error("Error creating article:", error.message);
    throw new Error(error.message);
  }
};

export const updateArticle = async (
  id: string,
  data: Partial<Omit<Article, 'id' | 'views' | 'commentCount' | 'shareCount' | 'publishedAt'>>
): Promise<void> => {
  const updatePayload: any = {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    author: data.author,
  };

  if (data.imageUrl) {
    updatePayload.image_url = data.imageUrl;
  }

  const { error } = await supabase
    .from('articles')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    console.error("Error updating article:", error.message);
    throw new Error(error.message);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting article:", error.message);
    throw new Error(error.message);
  }
};

// --- COMMENTS SERVICES ---

export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id.toString(),
      articleId: item.article_id.toString(),
      name: item.name,
      email: item.email,
      text: item.content,
      date: new Date(item.created_at).toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    }));
  } catch (error: any) {
    logServiceError("getCommentsByArticleId", error);
    return []; // Return empty array
  }
};

export const createComment = async (articleId: string, name: string, email: string, text: string): Promise<Comment | null> => {
  try {
     // 1. Insert Comment
     const { data, error } = await supabase
       .from('comments')
       .insert([
         { 
           article_id: articleId, 
           name: name, 
           email: email, 
           content: text 
         }
       ])
       .select()
       .single();

     if (error) throw error;

     // 2. Increment comment count using the generic helper
     await incrementField(articleId, 'comment_count');

     return {
        id: data.id.toString(),
        articleId: data.article_id.toString(),
        name: data.name,
        email: data.email,
        text: data.content,
        date: "Baru saja"
     };
  } catch (error: any) {
    logServiceError("createComment", error);
    throw error;
  }
};

// --- ADS SERVICE ---

const DEFAULT_ADS: AdConfig[] = [
  {
    position: 'sidebar_top',
    title: 'Sidebar Atas (4:5)',
    imageUrl: '',
    linkUrl: '#',
    isActive: false
  },
  {
    position: 'sidebar_middle',
    title: 'Sidebar Tengah (4:5)',
    imageUrl: '',
    linkUrl: '#',
    isActive: false
  },
  {
    position: 'sidebar_bottom',
    title: 'Sidebar Bawah (1:1 Sticky)',
    imageUrl: '',
    linkUrl: '#',
    isActive: false
  }
];

export const getAds = async (): Promise<AdConfig[]> => {
  let fetchedAds: AdConfig[] = [];

  // 1. Try Fetch from Supabase (without throwing)
  const { data, error } = await supabase.from('ads').select('*');
  
  if (error) {
    logServiceError("getAds", error);
  } else if (data && data.length > 0) {
    fetchedAds = data.map((item: any) => ({
      id: item.id,
      position: item.position,
      title: item.title || `Iklan ${item.position}`,
      imageUrl: item.image_url || '',
      linkUrl: item.link_url || '#',
      isActive: item.is_active || false,
    }));
  }

  // 2. Fallback: If Supabase empty/failed, try LocalStorage
  if (fetchedAds.length === 0) {
    try {
      const local = localStorage.getItem('tbnews_ads_backup');
      if (local) {
        fetchedAds = JSON.parse(local);
      }
    } catch (e) {
      console.warn("Local storage parse failed", e);
    }
  }

  // 3. MERGE LOGIC to ensure all default ad slots are present
  return DEFAULT_ADS.map(defaultAd => {
    const savedAd = fetchedAds.find(ad => ad.position === defaultAd.position);
    // Merge saved data into the default structure to guarantee consistency
    return savedAd ? { ...defaultAd, ...savedAd } : defaultAd;
  });
};

export const saveAd = async (ad: AdConfig): Promise<void> => {
  // 1. Always save to LocalStorage as backup
  try {
      const currentAds = await getAds();
      const updatedAds = currentAds.map(a => a.position === ad.position ? ad : a);
      localStorage.setItem('tbnews_ads_backup', JSON.stringify(updatedAds));
  } catch (e) {
      console.error("Local storage save failed", e);
  }

  // 2. Try Supabase
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('ads')
      .select('id')
      .eq('position', ad.position)
      .maybeSingle(); 

    if (fetchError) throw fetchError;

    const payload = {
      position: ad.position,
      title: ad.title,
      image_url: ad.imageUrl,
      link_url: ad.linkUrl,
      is_active: ad.isActive
    };

    if (existing) {
      // Update
      const { error } = await supabase
        .from('ads')
        .update(payload)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase.from('ads').insert(payload);
      if (error) throw error;
    }
  } catch (error: any) {
    logServiceError("saveAd", error);
    throw new Error("Gagal menyimpan konfigurasi iklan ke database.");
  }
};
