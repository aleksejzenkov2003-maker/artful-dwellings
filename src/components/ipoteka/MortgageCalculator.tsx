import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(8);

  const downPaymentPercent = useMemo(() => {
    return Math.round((downPayment / propertyPrice) * 100);
  }, [downPayment, propertyPrice]);

  const { monthlyPayment, totalPayment, overpayment } = useMemo(() => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, overpayment: 0 };
    }

    const monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const total = monthly * months;
    const over = total - principal;

    return {
      monthlyPayment: Math.round(monthly),
      totalPayment: Math.round(total),
      overpayment: Math.round(over),
    };
  }, [propertyPrice, downPayment, term, rate]);

  const formatNumber = (num: number) => {
    return num.toLocaleString("ru-RU");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold">Ипотечный калькулятор</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Inputs */}
        <div className="space-y-8">
          {/* Property Price */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Стоимость недвижимости</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={formatNumber(propertyPrice)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\s/g, "")) || 0;
                    setPropertyPrice(Math.min(Math.max(val, 1000000), 100000000));
                  }}
                  className="w-36 text-right font-medium"
                />
                <span className="text-muted-foreground">₽</span>
              </div>
            </div>
            <Slider
              value={[propertyPrice]}
              onValueChange={([val]) => setPropertyPrice(val)}
              min={1000000}
              max={100000000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 млн</span>
              <span>100 млн</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                Первоначальный взнос ({downPaymentPercent}%)
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={formatNumber(downPayment)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\s/g, "")) || 0;
                    setDownPayment(Math.min(Math.max(val, 0), propertyPrice * 0.9));
                  }}
                  className="w-36 text-right font-medium"
                />
                <span className="text-muted-foreground">₽</span>
              </div>
            </div>
            <Slider
              value={[downPayment]}
              onValueChange={([val]) => setDownPayment(val)}
              min={propertyPrice * 0.1}
              max={propertyPrice * 0.9}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Term */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Срок кредита</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={term}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setTerm(Math.min(Math.max(val, 1), 30));
                  }}
                  className="w-20 text-right font-medium"
                />
                <span className="text-muted-foreground">лет</span>
              </div>
            </div>
            <Slider
              value={[term]}
              onValueChange={([val]) => setTerm(val)}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 год</span>
              <span>30 лет</span>
            </div>
          </div>

          {/* Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Процентная ставка</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 1;
                    setRate(Math.min(Math.max(val, 1), 30));
                  }}
                  className="w-20 text-right font-medium"
                  step={0.1}
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[rate]}
              onValueChange={([val]) => setRate(val)}
              min={1}
              max={30}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Right - Results */}
        <div className="bg-primary/5 rounded-lg p-6 lg:p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Ежемесячный платёж
              </p>
              <p className="text-4xl lg:text-5xl font-bold text-primary">
                {formatNumber(monthlyPayment)} ₽
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Сумма кредита
                </p>
                <p className="text-xl font-semibold">
                  {formatNumber(propertyPrice - downPayment)} ₽
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Переплата
                </p>
                <p className="text-xl font-semibold">
                  {formatNumber(overpayment)} ₽
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">
                Общая сумма выплат
              </p>
              <p className="text-xl font-semibold">
                {formatNumber(totalPayment)} ₽
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
