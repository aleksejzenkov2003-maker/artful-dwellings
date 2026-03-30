import processImage from "@/assets/partneram-process.svg";

export function PartneramProcess() {
  return (
    <section className="py-16 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <img
          src={processImage}
          alt="Вводный перспективный блок партнёрской программы"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
