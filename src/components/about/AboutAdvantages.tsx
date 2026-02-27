import aboutAdvantagesBlock from "@/assets/about-advantages-block.svg";

export function AboutAdvantages() {
  return (
    <section className="py-16 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <img
          src={aboutAdvantagesBlock}
          alt="Art Estate — это: Внушительный опыт работы, Амбициозность компании, Непрерывное развитие"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
