import { Layout } from "@/components/layout/Layout";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { StatsSection } from "@/components/home/StatsSection";
import { Button } from "@/components/ui/button";

const timeline = [
  { year: "2015", title: "Основание компании", description: "Открытие первого офиса в Санкт-Петербурге" },
  { year: "2017", title: "Расширение услуг", description: "Запуск ипотечного брокериджа и юридического сопровождения" },
  { year: "2019", title: "Выход на новые рынки", description: "Начало работы с зарубежной недвижимостью" },
  { year: "2022", title: "Лидерство", description: "Вошли в ТОП-10 агентств Санкт-Петербурга" },
  { year: "2024", title: "Новый этап", description: "Открытие представительств в Москве и Дубае" },
];

// Helper to detect video type and get embed URL
const getVideoEmbed = (url: string) => {
  if (!url) return null;
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1` };
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  }
  
  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: 'direct', embedUrl: url };
  }
  
  // Assume direct if nothing else matches
  return { type: 'direct', embedUrl: url };
};

const OKompanii = () => {
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const [videoOpen, setVideoOpen] = useState(false);
  const [memberVideoOpen, setMemberVideoOpen] = useState(false);
  const [selectedMemberVideo, setSelectedMemberVideo] = useState<string | null>(null);

  const handleMemberVideoPlay = (e: React.MouseEvent, videoUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMemberVideo(videoUrl);
    setMemberVideoOpen(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            О компании Art Estate
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Агентство премиальной недвижимости с 2015 года помогает клиентам находить идеальные дома
          </p>
        </div>
      </section>

      {/* Stats */}
      <StatsSection variant="primary" />

      {/* Mission + Video */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Наша миссия</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Мы верим, что выбор дома — это искусство. Наша задача — помочь вам найти не просто квартиру, а место, где вы будете счастливы.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                За годы работы мы накопили уникальный опыт и создали команду профессионалов, которые знают рынок недвижимости изнутри. Мы не просто продаём квартиры — мы строим долгосрочные отношения с каждым клиентом.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>Индивидуальный подход к каждому</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>Полное юридическое сопровождение</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>Эксклюзивные предложения от застройщиков</span>
                </li>
              </ul>
            </div>
            <div 
              className="bg-navy rounded-lg aspect-video flex items-center justify-center cursor-pointer group relative overflow-hidden"
              onClick={() => setVideoOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </div>
                <p className="text-white mt-4 font-medium">Смотреть видео о компании</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Команда экспертов
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Наша команда — это профессионалы с многолетним опытом в сфере недвижимости
            </p>
          </div>
          
          {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[4/5]" />
                  <div className="p-6 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => {
                const hasPage = !!member.slug;
                const CardContent = (
                  <>
                    <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <span className="text-6xl font-serif text-primary/30">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Play button overlay for members with video */}
                      {member.video_url && (
                        <button
                          onClick={(e) => handleMemberVideoPlay(e, member.video_url!)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                            <Play className="h-7 w-7 text-white fill-white ml-1" />
                          </div>
                        </button>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                      {member.bio && (
                        <p className="text-muted-foreground text-sm line-clamp-2">{member.bio}</p>
                      )}
                      {hasPage && (
                        <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          <span>Подробнее</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      )}
                    </div>
                  </>
                );

                return hasPage ? (
                  <Link 
                    key={member.id}
                    to={`/broker/${member.slug}`}
                    className="bg-card rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div 
                    key={member.id} 
                    className="bg-card rounded-lg overflow-hidden group"
                  >
                    {CardContent}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Информация о команде скоро появится</p>
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">
            История компании
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
              
              {timeline.map((item, index) => (
                <div 
                  key={item.year}
                  className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 -translate-x-1/2" />
                  
                  {/* Content */}
                  <div className={`pl-8 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-primary font-serif font-bold text-2xl">{item.year}</span>
                    <h3 className="text-lg font-semibold mt-1 mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center">
            <p className="text-white/50">Видео будет добавлено позже</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Video Dialog */}
      <Dialog open={memberVideoOpen} onOpenChange={setMemberVideoOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="aspect-video bg-black">
            {selectedMemberVideo && (() => {
              const video = getVideoEmbed(selectedMemberVideo);
              if (!video) return null;
              
              if (video.type === 'youtube' || video.type === 'vimeo') {
                return (
                  <iframe 
                    src={video.embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              
              return (
                <video 
                  src={video.embedUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full"
                />
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

    </Layout>
  );
};

export default OKompanii;