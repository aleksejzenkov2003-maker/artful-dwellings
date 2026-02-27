import partneramAbout from "@/assets/partneram-about.svg";

export function PartneramAbout() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
        <img
          src={partneramAbout}
          alt="Art Estate — это внушительный опыт работы, амбициозность компании и непрерывное развитие"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
