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
    <div className="p-4 bg-black text-white">
      <ul>
        {list &&
          list.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={clsx(
                item !== selectedItem && "opacity-100",
                item === selectedItem && "opacity-50"
              )}
            >
              {item.title}
            </li>
          ))}
      </ul>
    </div>
  );
};
