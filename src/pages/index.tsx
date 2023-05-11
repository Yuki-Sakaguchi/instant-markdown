import { Editor } from "@/features/Editor";
import { SideMenu } from "@/features/SideMenu";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectetItem, setSelectedItem] = useState<Item>();
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    setList([
      {
        id: 1,
        title: "test",
        date: new Date(),
        body: "body",
      },
      {
        id: 2,
        title: "test",
        date: new Date(),
        body: "body",
      },
      {
        id: 3,
        title: "test",
        date: new Date(),
        body: "body",
      },
    ]);
  }, []);

  return (
    <main>
      <div>
        <div className="flex">
          <div className="w-[200px]">
            <SideMenu
              list={list}
              selectedItem={selectetItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className="flex-1">
            <Editor item={selectetItem} />
          </div>
        </div>
      </div>
    </main>
  );
}
