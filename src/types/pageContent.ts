export interface PageContent {
  hero_title?: string;
  hero_background_image?: string;
  metro_station?: string;
  phone?: string;
  work_hours?: string;
  video_url?: string;
  panorama_url?: string;
  about_text?: string;
  about_images?: string[];
  map_image?: string;
  layouts_background_image?: string;
  documents?: Array<{ title: string; url: string }>;
  promotions?: Array<{ title: string; text?: string; image_url?: string }>;
  /**
   * Рассрочки/ипотека в шаблоне — несколько разных блоков.
   * Мы храним их максимально приближенно к структуре Tilda.
   */
  installments?: Array<{ title: string; text?: string }>;
  installments_intro?: string;
  installments_subsidy_heading?: string;
  installments_subsidy_rates_html?: string;
  installments_program1_heading?: string;
  installments_program1_note?: string;
  installments_program1_cards?: Array<{ title: string; description: string }>;
  installments_program2_heading?: string;
  installments_program2_note?: string;
  installments_program2_cards?: Array<{ title: string; description: string }>;
  driver_background_image?: string;
  driver_car_image?: string;
  driver_title?: string;
  driver_badge?: string; // "БЕСПЛАТНО"
  driver_description?: string;
  driver_right_text?: string;
  driver_wait_time?: string;
  driver_button_text?: string;
  telegram_title?: string;
  telegram_description?: string; // HTML
  telegram_button_text?: string;
  telegram_button_url?: string;
  telegram_qr_image?: string;
  telegram_phone_image?: string;
  disclaimer_text?: string; // ипотечный дисклеймер (желтая плашка)
  forms_success_url?: string; // куда редиректить после отправки форм
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
  hero_background_image: "",
  metro_station: "",
  phone: "",
  work_hours: "Ежедневно 10:00-20:00",
  video_url: "",
  panorama_url: "",
  about_text: "",
  about_images: [],
  map_image: "",
  layouts_background_image: "",
  documents: [],
  promotions: [],
  installments: [],
  installments_intro: "",
  installments_subsidy_heading: "",
  installments_subsidy_rates_html: "",
  installments_program1_heading: "",
  installments_program1_note: "",
  installments_program1_cards: [],
  installments_program2_heading: "",
  installments_program2_note: "",
  installments_program2_cards: [],
  driver_background_image: "",
  driver_car_image: "",
  driver_title: "",
  driver_badge: "",
  driver_description: "",
  driver_right_text: "",
  driver_wait_time: "",
  driver_button_text: "",
  telegram_title: "",
  telegram_description: "",
  telegram_button_text: "",
  telegram_button_url: "",
  telegram_qr_image: "",
  telegram_phone_image: "",
  disclaimer_text: "",
  forms_success_url: "/thanks",
  infrastructure_text: "",
  infrastructure_items: [],
  mortgage_text: "",
  mortgage_conditions: [],
  faq: [],
  contact_email: "",
  contact_phone: "",
};
