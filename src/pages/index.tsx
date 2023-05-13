import { Tiptap } from "@/features/Editor";
import { SideMenu } from "@/features/SideMenu";

export default function Home() {
  return (
    <main>
      <div>
        <div className="flex">
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
