const teamMembers = [
  {
    id: 1,
    name: "Елена Максимова",
    role: "Ведущий специалист агентства Art Estate",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
  },
  {
    id: 2,
    name: "Виктор Борисов",
    role: "Брокер агентства Art Estate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600",
  },
  {
    id: 3,
    name: "Илья Кириллов",
    role: "Ведущий специалист агентства Art Estate",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600",
  },
];

export function TeamSection() {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
        Команда экспертов
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
      <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
        Опытный переговорщик на вашей стороне — не повредит. Мы сделаем все возможное,
        чтобы вы купили квартиру на самых выгодных условиях.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="text-center group">
            <div className="aspect-[3/4] overflow-hidden mb-4 relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
            </div>
            <h3 className="font-medium text-lg mb-1">{member.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
