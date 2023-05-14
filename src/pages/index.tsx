import { Tiptap } from "@/features/Editor";
import { SideMenu } from "@/features/SideMenu";
import clsx from "clsx";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [sp, setSp] = useState(false);

  function resizeHandler() {
    if (window.innerWidth >= 768) {
      setIsMenuOpen(true);
      setSp(false);
    } else {
      setIsMenuOpen(false);
      setSp(true);
    }
  }
  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <main>
      <Head>
        <title>Instant Note (β)</title>
      </Head>
      <div className="flex flex-col h-screen">
        <header className="px-1 flex h-10 bg-gray-800">
          {sp &&
            (isMenuOpen ? (
              <button className="p-1" onClick={() => setIsMenuOpen(false)}>
                <XMarkIcon className="w-4 text-white" />
              </button>
            ) : (
              <button className="p-1" onClick={() => setIsMenuOpen(true)}>
                <Bars2Icon className="w-4 text-white" />
              </button>
            ))}
        </header>
        <div className="relative flex flex-1">
          <div
            className={clsx(
              "transition-transform",
              isMenuOpen && "translate-x-0",
              !isMenuOpen && "-translate-x-full",
              "absolute top-0 left-0 w-[200px] h-full z-10"
            )}
          >
            <SideMenu />
          </div>
          <div
            className={clsx(
              "transition-all",
              !sp && isMenuOpen && "ml-[200px]",
              !sp && !isMenuOpen && "ml-0",
              "flex-1"
            )}
          >
            <Tiptap />
          </div>
        </div>
      </div>
    </main>
  );
}
