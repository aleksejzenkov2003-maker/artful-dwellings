import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useResidentialComplexes } from "@/hooks/useResidentialComplexes";
import { HexagonPattern } from "@/components/ui/HexagonPattern";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { toast } from "sonner";

export function PropertySearchSection() {
  const [activeTab, setActiveTab] = useState<"new" | "secondary">("new");
  const [rooms, setRooms] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const { data: complexes } = useResidentialComplexes();
  const mutation = useSubmitLead();
  
  const displayComplexes = complexes?.slice(0, 5) || [];

  const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const toggleRoom = (room: string) => {
    setRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const handleSubmit = () => {
    if (phone.length < 10) {
      toast.error("Введите корректный номер телефона");
      return;
    }
    
    mutation.mutate({
      name: name || "Заявка на подбор",
      phone,
      email: null,
      message: `Комнат: ${rooms.join(", ") || "Любое"}, Бюджет до: ${maxPrice || "Не указан"} ₽`,
      form_type: "property_search",
      form_source: "Главная - подбор недвижимости",
    }, {
      onSuccess: () => {
        setName("");
        setPhone("");
        setMaxPrice("");
        setRooms([]);
      }
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <HexagonPattern className="right-0 top-0 w-96 h-full opacity-30" />
      
      <div className="container-wide relative z-10">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          Подберем идеальное предложение от 300 застройщиков
        </h2>

        {/* Quick Search Form */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-card border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Комнат:</span>
              <div className="flex gap-1">
                {["Ст", "1", "2", "3", "4+"].map((room) => (
                  <button
                    key={room}
                    onClick={() => toggleRoom(room)}
                    className={`w-10 h-10 border transition-colors text-sm ${
                      rooms.includes(room) 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">До</span>
              <Input 
                type="text" 
                placeholder="5 000 000" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-32 text-right"
              />
              <span className="text-sm text-muted-foreground">₽</span>
            </div>

            <Input 
              type="text" 
              placeholder="Ваше имя" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-40"
            />

            <Input 
              type="tel" 
              placeholder="Ваш телефон" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-40"
            />

            <Button 
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-xs tracking-wider"
            >
              {mutation.isPending ? "..." : "Отправить заявку"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-12">
          <button
            onClick={() => setActiveTab("new")}
            className={`text-sm uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === "new" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Строящаяся недвижимость
          </button>
          <button
            onClick={() => setActiveTab("secondary")}
            className={`text-sm uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === "secondary" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Вторичная недвижимость
          </button>
        </div>

        {/* Property Cards - Masonry layout matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Large card - spans 2 rows */}
          {displayComplexes[0] && (
            <Link
              to={`/novostroyki/${displayComplexes[0].slug}`}
              className="group relative overflow-hidden bg-card border border-border md:row-span-2"
            >
              <img
                src={displayComplexes[0].main_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                alt={displayComplexes[0].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* New badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 uppercase tracking-wider">
                  Новый объект
                </span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  {displayComplexes[0].developer || "Застройщик"}
                </p>
                <h3 className="text-xl font-serif text-white mb-2">
                  {displayComplexes[0].name}
                </h3>
                <p className="text-primary font-medium">
                  от {formatPrice(displayComplexes[0].price_from)} ₽/м²
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {displayComplexes[0].city}, {displayComplexes[0].district}
                </p>
              </div>
            </Link>
          )}

          {/* Regular cards */}
          {displayComplexes.slice(1, 5).map((complex, index) => (
            <Link
              key={complex.id}
              to={`/novostroyki/${complex.slug}`}
              className="group relative overflow-hidden bg-card border border-border"
            >
              <img
                src={complex.main_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                alt={complex.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {index === 0 && (
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    Новый объект
                  </span>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">
                  {complex.developer || "Застройщик"}
                </p>
                <h3 className="text-sm font-serif text-white mb-1">
                  {complex.name}
                </h3>
                <p className="text-primary text-xs font-medium">
                  от {formatPrice(complex.price_from)} ₽/м²
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Link to="/novostroyki">
            <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background uppercase text-xs tracking-wider px-8">
              Показать ещё
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
