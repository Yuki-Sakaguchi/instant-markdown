import { Tiptap } from "@/features/Editor";
import { SideMenu } from "@/features/SideMenu";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectetItem, setSelectedItem] = useState<Item>();
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    setList([
      {
        id: 1,
        title: "test1",
        date: new Date(),
        body: "body1",
      },
      {
        id: 2,
        title: "test2",
        date: new Date(),
        body: "body2",
      },
      {
        id: 3,
        title: "test3",
        date: new Date(),
        body: "body3",
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
            <Tiptap item={selectetItem} />
          </div>
        </div>
      </div>
    </main>
  );
}
