import { Building2 } from "lucide-react";

const banks = [
  {
    name: "Сбербанк",
    rate: "от 5.9%",
    term: "до 30 лет",
    downPayment: "от 10%",
  },
  {
    name: "ВТБ",
    rate: "от 6.2%",
    term: "до 30 лет",
    downPayment: "от 10%",
  },
  {
    name: "Альфа-Банк",
    rate: "от 7.5%",
    term: "до 25 лет",
    downPayment: "от 15%",
  },
  {
    name: "Газпромбанк",
    rate: "от 6.5%",
    term: "до 30 лет",
    downPayment: "от 10%",
  },
  {
    name: "Росбанк",
    rate: "от 7.8%",
    term: "до 25 лет",
    downPayment: "от 15%",
  },
  {
    name: "Райффайзен",
    rate: "от 8.2%",
    term: "до 25 лет",
    downPayment: "от 20%",
  },
];

export function PartnerBanks() {
  return (
    <div>
      <h2 className="text-3xl font-serif font-bold mb-8 text-center">
        Банки-партнёры
      </h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
        Мы сотрудничаем с ведущими банками России и поможем подобрать оптимальные условия кредитования
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank) => (
          <div
            key={bank.name}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{bank.name}</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ставка</span>
                <span className="font-medium text-primary">{bank.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Срок</span>
                <span className="font-medium">{bank.term}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Взнос</span>
                <span className="font-medium">{bank.downPayment}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
