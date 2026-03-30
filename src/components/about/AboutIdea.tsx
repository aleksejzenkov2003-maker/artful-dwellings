import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutIdea() {
  return (
    <>
      {/* Idea section - muted rose background */}
      <section className="py-16 lg:py-24 bg-accent/20">
        <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
          <div className="max-w-3xl">
            <h2 className="text-3xl lg:text-4xl font-serif mb-8">
              Как появилась идея?
            </h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              Art Estate родилась из желания изменить подход к продаже недвижимости. 
              Мы видели, как клиенты теряются в море предложений, как им не хватает 
              экспертной поддержки и индивидуального подхода. Мы создали компанию, 
              где каждый клиент получает персонального эксперта, который ведет его 
              от первой консультации до получения ключей.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership section - dark navy background */}
      <section className="py-16 lg:py-24 bg-navy text-white">
        <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif mb-6">
                Партнерство с застройщиками и банками
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                За годы работы мы выстроили прочные партнерские отношения с ведущими 
                застройщиками Санкт-Петербурга, Москвы и ОАЭ. Благодаря этому наши 
                клиенты получают эксклюзивные условия и доступ к лучшим предложениям 
                на рынке. Сотрудничество с крупнейшими банками позволяет нам предлагать 
                ипотечные программы на особых условиях.
              </p>
              <Button variant="teal" size="lg" asChild>
                <Link to="/partneram">
                  СЕРТИФИКАТЫ
                </Link>
              </Button>
            </div>
            
            <div className="hidden lg:flex justify-end">
              {/* Decorative hexagon */}
              <svg 
                viewBox="0 0 200 232" 
                className="w-48 h-56 text-primary/30"
              >
                <path
                  d="M100 8L184 56V152L100 200L16 152V56L100 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M100 32L160 68V140L100 176L40 140V68L100 32Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
