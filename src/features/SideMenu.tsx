import type { Dispatch, FC, SetStateAction } from "react";
import clsx from "clsx";

type Props = {
  list: Item[];
  selectedItem?: Item;
  setSelectedItem: Dispatch<SetStateAction<Item | undefined>>;
};

export const SideMenu: FC<Props> = ({
  list,
  selectedItem,
  setSelectedItem,
}) => {
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
    </div>
  );
};
