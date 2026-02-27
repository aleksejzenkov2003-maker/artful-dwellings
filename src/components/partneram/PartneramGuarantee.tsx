import guaranteeImage from "@/assets/partneram-guarantee.svg";

export function PartneramGuarantee() {
  return (
    <section className="py-8 lg:py-12 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <img
          src={guaranteeImage}
          alt="Гарантии партнёрской программы"
          className="w-[calc(100%+6%)] max-w-none -ml-[3%]"
        />
      </div>
    </section>
  );
}
