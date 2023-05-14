import { FC, useMemo } from "react";
import { useList } from "./useList";
import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export const SideMenu: FC = () => {
  const { list, selectedItem, setSelectedItemId, addItem } = useList();

  // 作成日の降順にしたリスト
  const displayList = useMemo(() => {
    return list.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      if (aDate > bDate) return -1;
      else if (aDate < bDate) return 1;
      else return 0;
    });
  }, [list]);

  return (
    <div className="flex flex-col h-full px-4 pt-8 pb-4 bg-gray-800 text-white">
      <h1 className="text-center text-xl font-bold mb-7">🚀 Instant Note</h1>
      <button
        className="bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md transition-opacity hover:opacity-80"
        onClick={addItem}
      >
        <PlusIcon className="w-[20px] m-auto" />
      </button>
      <div className="flex-1 mt-4 overflow-scroll">
        {displayList && displayList.length > 0 && (
          <ul className="overflow-scroll">
            {displayList.map((item) => (
              <li
                key={item.id}
                className={clsx(
                  item !== selectedItem && "opacity-100",
                  item === selectedItem && "opacity-50 pointer-events-none"
                )}
              >
                <button
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-left w-full py-2 hover:opacity-80"
                  onClick={() => setSelectedItemId(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer className="pt-4 mt-auto opacity-60 text-xs text-center">
        &copy; Instant Note
      </footer>
    </div>
  );
};
