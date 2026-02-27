import guaranteeImage from "@/assets/partneram-guarantee.svg";

export function PartneramGuarantee() {
  return (
    <section className="w-full">
      <img
        src={guaranteeImage}
        alt="Гарантии партнёрской программы"
        className="w-full h-auto"
      />
    </section>
  );
}
