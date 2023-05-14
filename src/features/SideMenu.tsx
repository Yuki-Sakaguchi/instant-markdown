import { FC, useMemo, useState } from "react";
import { useList } from "./useList";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const MenuItem: FC<{ id: string; title: string; selected: boolean }> = ({
  id,
  title,
  selected,
}) => {
  const { setSelectedItemId, removeItem } = useList();
  const [hover, setHover] = useState(false);

  const deleteItem = (id: string) => {
    if (confirm("記事を削除してもよろしいでしょうか？")) {
      removeItem(id);
    }
  };

  return (
    <li
      className={clsx(
        "flex",
        "hover:opacity-80",
        !selected && "opacity-100",
        selected && "opacity-50 pointer-events-none"
      )}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <button
        className="overflow-hidden text-ellipsis whitespace-nowrap text-left w-full py-2"
        onClick={() => setSelectedItemId(id)}
      >
        {title}
      </button>
      {hover && (
        <button className="p-2" onClick={() => deleteItem(id)}>
          <TrashIcon className="w-[16px]" />
        </button>
      )}
    </li>
  );
};

export const SideMenu: FC = () => {
  const { list, selectedItem, addItem, deleteAll } = useList();

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

  const deleteAllItem = () => {
    if (confirm("全ての記事を削除してもよろしいでしょうか？")) {
      deleteAll();
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pb-4 bg-gray-800 text-white">
      <h1 className="text-center text-lg font-bold mb-7">
        <div className="flex justify-center items-center">
          🚀 Instant Note<span className="ml-2 text-xs">(β)</span>
        </div>
        <p className="text-xs font-normal">v{process.env.VERSION}</p>
      </h1>
      <button
        className="bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md transition-opacity hover:opacity-80"
        onClick={addItem}
      >
        <PlusIcon className="w-[20px] m-auto" />
      </button>
      {displayList?.length > 0 && (
        <button
          className="mt-2 bg-white text-gray-800 w-full py-2 rounded-tr-md rounded-bl-md transition-opacity hover:opacity-80"
          onClick={deleteAllItem}
        >
          <TrashIcon className="w-[20px] m-auto" />
        </button>
      )}
      <div className="flex-1 mt-4 overflow-scroll">
        {displayList && displayList.length > 0 && (
          <ul className="overflow-scroll">
            {displayList.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                title={item.title}
                selected={item === selectedItem}
              />
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
