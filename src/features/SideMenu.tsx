import { FC, useState } from "react";
import { useList } from "./useList";
import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export const SideMenu: FC = () => {
  const { list, addItem } = useList();
  const [selectedItem, setSelectedItem] = useState<Item>();
  return (
    <div className="h-full px-4 py-8 bg-gray-800 text-white">
      {list && list.length > 0 && (
        <ul className="mb-8">
          {list.map((item) => (
            <li
              key={item.id}
              className={clsx(
                item !== selectedItem && "opacity-100",
                item === selectedItem && "opacity-50 pointer-events-none"
              )}
            >
              <button
                className="text-left w-full py-2 hover:opacity-80"
                onClick={() => setSelectedItem(item)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md transition-opacity hover:opacity-80"
        onClick={addItem}
      >
        <PlusIcon className="w-[20px] m-auto" />
      </button>
    </div>
  );
};
