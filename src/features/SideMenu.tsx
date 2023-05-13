import { FC, useState } from "react";
import clsx from "clsx";
import { useList } from "./useList";

export const SideMenu: FC = () => {
  const { list, addItem } = useList();
  const [selectedItem, setSelectedItem] = useState<Item>();
  return (
    <div className="h-full px-4 py-8 bg-gray-800 text-white">
      <ul>
        {list &&
          list.map((item) => (
            <li
              key={item.id}
              className={clsx(
                item !== selectedItem && "opacity-100",
                item === selectedItem && "opacity-50 pointer-events-none"
              )}
            >
              <button
                className="text-left w-full p-2 hover:opacity-80"
                onClick={() => setSelectedItem(item)}
              >
                {item.title}
              </button>
            </li>
          ))}
      </ul>
      <button
        className="bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md"
        onClick={addItem}
      >
        add
      </button>
    </div>
  );
};
