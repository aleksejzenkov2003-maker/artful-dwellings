export interface PageContent {
  hero_title?: string;
  metro_station?: string;
  phone?: string;
  work_hours?: string;
  video_url?: string;
  panorama_url?: string;
  about_text?: string;
  about_images?: string[];
  infrastructure_text?: string;
  infrastructure_items?: Array<{ title: string; description: string }>;
  mortgage_text?: string;
  mortgage_conditions?: Array<{ title: string; value: string }>;
  faq?: Array<{ question: string; answer: string }>;
  contact_email?: string;
  contact_phone?: string;
}

export const EMPTY_PAGE_CONTENT: PageContent = {
  hero_title: "",
  metro_station: "",
  phone: "",
  work_hours: "Ежедневно 10:00-20:00",
  video_url: "",
  panorama_url: "",
  about_text: "",
  about_images: [],
  infrastructure_text: "",
  infrastructure_items: [],
  mortgage_text: "",
  mortgage_conditions: [],
  faq: [],
  contact_email: "",
  contact_phone: "",
};
