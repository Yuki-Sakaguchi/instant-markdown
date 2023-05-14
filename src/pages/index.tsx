import { Tiptap } from "@/features/Editor";
import { SideMenu } from "@/features/SideMenu";
import Head from "next/head";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Instant Note (β)</title>
      </Head>
      <div>
        <div className="flex h-screen">
          <div className="w-[200px]">
            <SideMenu />
          </div>
          <div className="flex-1">
            <Tiptap />
          </div>
        </div>
      </div>
    </main>
  );
}
