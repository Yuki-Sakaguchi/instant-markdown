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
    <div className="h-full px-4 py-8 bg-gray-800 text-white">
      <h1 className="text-center text-xl font-bold mb-7">🚀 Instant Note</h1>
      <button
        className="bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md transition-opacity hover:opacity-80"
        onClick={addItem}
      >
        <PlusIcon className="w-[20px] m-auto" />
      </button>
      {displayList && displayList.length > 0 && (
        <ul className="mt-4">
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
  );
};
