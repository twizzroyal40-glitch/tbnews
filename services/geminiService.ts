import { Article, Category, Comment, AdConfig } from "../types";
import { supabase } from "../utils/supabase";

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

// --- HELPER: INCREMENT COUNTER ---
// Helper to atomically (sort of) increment a field in Supabase
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
    console.error(`Failed to increment ${field}:`, error);
    return null;
  }
};

// --- SERVICES WITH SUPABASE ---

// Helper to fetch all articles once and cache in memory (for simplicity in this specific app structure)
export const getAllArticlesFromSupabase = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("⚠️ Supabase Error (Articles):", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return []; 
    }

    const supabaseArticles: Article[] = data.map((item: any) => ({
         id: item.id?.toString(),
         title: item.title || '',
         excerpt: item.excerpt || '',
         content: item.content || '',
         category: item.category || Category.HOME,
         author: item.author || 'Admin',
         publishedAt: item.published_at || item.publishedAt || new Date().toLocaleDateString('id-ID'),
         imageUrl: item.image_url || item.imageUrl || '',
         views: item.views || 0,
         commentCount: item.comment_count || item.commentCount || 0,
         shareCount: item.share_count || item.shareCount || 0
    }));

    return supabaseArticles;
  } catch (error: any) {
    console.error("Error fetching articles from Supabase:", error.message || error);
    return [];
  }
};

export const fetchNewsArticles = async (category: Category): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromSupabase();

  if (category === Category.HOME) {
    return allArticles.slice(0, 6);
  }

  return allArticles.filter(article => article.category === category);
};

export const getPopularArticles = async (): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromSupabase();
  // Sort by views descending and take top 5
  return allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
};

export const searchArticles = async (queryStr: string): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromSupabase();
  const lowerQuery = queryStr.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) || 
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery)
  );
};

export const getArticlesByMonth = async (year: number, month: number): Promise<Article[]> => {
  const allArticles = await getAllArticlesFromSupabase();

  return allArticles.filter(article => {
    const date = parseIndonesianDate(article.publishedAt);
    if (!date) return false;

    return date.getFullYear() === year && date.getMonth() === month;
  });
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
    console.error("Error fetching gallery images:", error.message);
    return [];
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
  const publishedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
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

    if (error) {
        console.error("Supabase Error fetching comments:", error.message);
        throw error;
    }

    return data.map((item: any) => ({
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
    console.error("Error fetching comments:", error.message || error);
    return [];
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

     if (error) {
        console.error("Supabase Error creating comment:", error.message);
        throw error;
     }

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
    console.error("Error creating comment:", error.message || error);
    return null;
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

  // 1. Try Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*');

    if (!error && data && data.length > 0) {
      fetchedAds = data.map((item: any) => ({
        id: item.id,
        position: item.position,
        title: item.title,
        imageUrl: item.image_url,
        linkUrl: item.link_url,
        isActive: item.is_active
      }));
    }
  } catch (error: any) {
    console.warn("Supabase fetch failed (ads):", error.message);
  }

  // 2. Fallback: If Supabase empty/failed, try LocalStorage
  if (fetchedAds.length === 0) {
    try {
      const local = localStorage.getItem('tbnews_ads_backup');
      if (local) {
        fetchedAds = JSON.parse(local);
      }
    } catch (e) {
      console.error("Local storage parse failed", e);
    }
  }

  // 3. MERGE LOGIC: Combine fetched data with DEFAULT_ADS
  // This ensures that if we add a new slot (like sidebar_middle) to the code,
  // it appears in the app even if it doesn't exist in the DB/LocalStorage yet.
  return DEFAULT_ADS.map(defaultAd => {
    // Find if we have saved data for this position
    const savedAd = fetchedAds.find(ad => ad.position === defaultAd.position);
    
    // If found, use the saved data (keeping ID, active state, image). 
    // If not found, use the default "placeholder" config.
    return savedAd ? { ...defaultAd, ...savedAd } : defaultAd;
  });
};

export const saveAd = async (ad: AdConfig): Promise<void> => {
  // 1. Always save to LocalStorage as backup/cache
  try {
      const currentAds = await getAds();
      const updatedAds = currentAds.map(a => a.position === ad.position ? ad : a);
      localStorage.setItem('tbnews_ads_backup', JSON.stringify(updatedAds));
  } catch (e) {
      console.error("Local storage save failed", e);
  }

  // 2. Try Supabase
  try {
    // Check if ad exists for position
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
      const { error } = await supabase
        .from('ads')
        .update(payload)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('ads')
        .insert([payload]);
      if (error) throw error;
    }
  } catch (error: any) {
    // Graceful degradation: If DB fails, we already saved to localStorage, so we just warn
    console.warn("Supabase save failed (using local only):", error.message);
  }
};
