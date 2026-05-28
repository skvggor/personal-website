import Image from "next/image";

export default function Avatar() {
  return (
    <div className="relative h-[86px] w-[86px] min-[2560px]:h-[4.3vw] min-[2560px]:w-[4.3vw] shrink-0 overflow-hidden rounded-full">
      <Image
        src="/me-b-w.jpg"
        alt="Marcos Lima"
        width={200}
        height={200}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}
