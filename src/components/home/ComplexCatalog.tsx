import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const complexes = [
  {
    id: 1,
    name: "Полянка 44",
    district: "Фрунзенский район",
    priceFrom: "от 19,2 млн ₽",
    status: "Строится",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
    slug: "polyanka-44",
  },
  {
    id: 2,
    name: "Mistola Hills",
    district: "Приморский район",
    priceFrom: "от 12,5 млн ₽",
    status: "Сдан",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
    slug: "mistola-hills",
  },
  {
    id: 3,
    name: "Адамант",
    district: "Московский район",
    priceFrom: "от 8,9 млн ₽",
    status: "Строится",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
    slug: "adamant",
  },
  {
    id: 4,
    name: "Green City",
    district: "Невский район",
    priceFrom: "от 15,3 млн ₽",
    status: "Сдан",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600",
    slug: "green-city",
  },
  {
    id: 5,
    name: "Дом на набережной",
    district: "Петроградский район",
    priceFrom: "от 25,0 млн ₽",
    status: "Строится",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600",
    slug: "dom-na-naberezhnoy",
  },
  {
    id: 6,
    name: "Северный город",
    district: "Выборгский район",
    priceFrom: "от 7,2 млн ₽",
    status: "Строится",
    image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=600",
    slug: "severnyy-gorod",
  },
];

export function ComplexCatalog() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complexes.map((complex) => (
          <Link
            key={complex.id}
            to={`/novostroyki/${complex.slug}`}
            className="group bg-card border border-border hover:border-primary transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={complex.image}
                alt={complex.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  complex.status === "Сдан" ? "text-green-600" : "text-primary"
                }`}>
                  {complex.status}
                </span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-1 group-hover:text-primary transition-colors">
                {complex.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{complex.district}</p>
              <p className="text-primary font-medium">{complex.priceFrom}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link to="/novostroyki">Показать все объекты</Link>
        </Button>
      </div>
    </div>
  );
}
