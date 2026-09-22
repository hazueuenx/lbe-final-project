"use client";

import { useEffect, useState, useRef } from "react";
import { loadCards } from "./script";

export default function Kepanitiaan({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const popUp = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const popupPage = (item: any) => {
    setSelected(item);
    popUp.current?.showModal();
  };

  const closePopupPage = () => {
    popUp.current?.close();
  };

  useEffect(() => {
    loadCards().then(setItems);
  }, []);

  const filteredItems = items.filter(
    (item) => String(item.Genre) === "Kepanitiaan",
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

// scroll bar behavior
const scrollRef = useRef<HTMLDivElement>(null);
const [currentPage, setCurrentPage] = useState(0);
const [isOverflow, setIsOverflow] = useState(false);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const container = e.currentTarget;
  const maxScroll = container.scrollWidth - container.clientWidth;

  if (maxScroll <= 0) {
    setCurrentPage(0);
    return;
  }

  const progress = container.scrollLeft / maxScroll;
  setCurrentPage(Math.min(2, Math.floor(progress * 3)));
};

const goToPage = (page: number) => {
  const container = scrollRef.current;

  if (!container) return;

  const maxScroll = container.scrollWidth - container.clientWidth;

  container.scrollTo({
    left: (maxScroll / 2) * page,
    behavior: "smooth",
  });
};

useEffect(() => {
  const container = scrollRef.current;

  if (!container) return;

  const checkOverflow = () => {
    setIsOverflow(container.scrollWidth > container.clientWidth);
  };

  checkOverflow();

  window.addEventListener("resize", checkOverflow);

  return () => {
    window.removeEventListener("resize", checkOverflow);
  };
}, [items]);

  return (
    <div className="flex flex-col pl-16" ref={ref}>
      <a
        href={`/3`}
        className="relative ease-in-out duration-300 hover:scale-101
                    text-3xl text-white pb-4 w-fit"
      >
        {`>> KEPANITIAAN`}
      </a>

      <div
        onScroll={handleScroll}
        ref={scrollRef}
        className="flex flex-row gap-4 space-x-4 space-y-8 overflow-x-auto overflow-y-hidden h-auto scrollbar-none"
      >
        {filteredItems.map((item) => (
          <a
            key={item.id}
            onClick={() => popupPage(item)}
            className="shrink-0 text-center ease-in-out duration-300 hover:scale-102"
          >
            <img
              className="aspect-3/4 w-40 lg:w-2xs object-cover"
              src={item.image}
              alt={item.nama}
            />
            <h3 className="max-w-40 lg:max-w-2xs wrap-break-words text-sm lg:text-xl text-white">
              {item.nama}
            </h3>
          </a>
        ))}
      </div>

        <div className="flex justify-center gap-2 mt-3">
          {[0, 1, 2].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-2 h-2 rounded-full ${
                currentPage === page ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

      <dialog
        ref={popUp}
        className="size-full border-0 outline-0 open:flex justify-center items-center backdrop-blur-lg bg-transparent p-4"
      >
        {selected && (
          <div className="relative scale-85 bg-[#928c8c] flex size-fit justify-center align-middle items-center mx-14 rounded-2xl">
            <div className="bg-[#d33232] h-150 w-120 left-0 rounded-[17px] py-20 my-11 mx-11" />
            <div className="[word-break:break-word] content-stretch flex flex-col font-['Iosevka_Charon:Bold',sans-serif] gap-[35px] items-center leading-[normal] left-0 not-italic text-[32px] text-black top-0 w-[768px] pr-10">
              <p className="relative shrink-0 w-full">Nama: {selected.nama}</p>
              <p className="relative shrink-0 w-full">
                Tanggal Pendaftaran: {formatDate(selected.date_start)} -{" "}
                {formatDate(selected.date_end)}
              </p>
              <p className="w-full">Link Instagram: {selected.link_ig}</p>
              <p className="w-full">
                Link Guidebook: {selected.link_guidebook}
              </p>
              <p className="w-full">
                Link Pendaftaran: {selected.link_pendaftaran}
              </p>
            </div>

            <button
              onClick={() => closePopupPage()}
              className="absolute top-2 right-2 md:top-4 md:right-4 hover:scale-120 text-3xl md:text-5xl w-10"
            >
              x
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
