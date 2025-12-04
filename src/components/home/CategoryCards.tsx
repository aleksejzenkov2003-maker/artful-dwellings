import { Link } from "react-router-dom";

const categories = [
  {
    title: "Новостройки",
    href: "/novostroyki",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
  },
  {
    title: "Вторичная недвижимость",
    href: "/vtorichnaya",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  },
  {
    title: "Переуступка",
    href: "/pereustupka",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
  },
  {
    title: "Эксклюзив",
    href: "/exclusive",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
  },
];

export function CategoryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.title}
          to={category.href}
          className="group relative aspect-square overflow-hidden"
        >
          <img
            src={category.image}
            alt={category.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <h3 className="text-white text-sm lg:text-base font-medium uppercase tracking-wider">
              {category.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
