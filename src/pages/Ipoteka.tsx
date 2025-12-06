import { Layout } from "@/components/layout/Layout";
import { MortgageCalculator } from "@/components/ipoteka/MortgageCalculator";
import { PartnerBanks } from "@/components/ipoteka/PartnerBanks";
import { MortgageContactForm } from "@/components/ipoteka/MortgageContactForm";
import { Link } from "react-router-dom";
import {
  Shield,
  Clock,
  Percent,
  FileCheck,
  Users,
  TrendingDown,
} from "lucide-react";

const benefits = [
  {
    icon: Percent,
    title: "Лучшие ставки",
    description: "Доступ к специальным условиям от банков-партнёров",
  },
  {
    icon: Clock,
    title: "Быстрое одобрение",
    description: "Решение банка в течение 1-3 рабочих дней",
  },
  {
    icon: FileCheck,
    title: "Минимум документов",
    description: "Поможем собрать необходимый пакет документов",
  },
  {
    icon: Shield,
    title: "Надёжность",
    description: "Работаем только с проверенными банками",
  },
  {
    icon: Users,
    title: "Персональный подход",
    description: "Индивидуальный подбор программы под вашу ситуацию",
  },
  {
    icon: TrendingDown,
    title: "Снижение ставки",
    description: "Помогаем получить скидку от застройщика",
  },
];

const Ipoteka = () => {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Главная
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Ипотека</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ипотека на выгодных условиях
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Подберём лучшие условия ипотечного кредитования от ведущих банков России. 
              Бесплатная консультация и полное сопровождение сделки.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <MortgageCalculator />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">
            Преимущества ипотеки через агентство
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Мы берём на себя все заботы по оформлению ипотеки, экономя ваше время и деньги
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banks */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <PartnerBanks />
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <MortgageContactForm />
        </div>
      </section>
    </Layout>
  );
};

export default Ipoteka;
