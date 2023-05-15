import { Slice } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";

/**
 * FileListを受け取ってdataURLに変換して返す
 * @param file
 * @param cb
 */
export function loadImage(file: File) {
  return new Promise<string>((resolve) => {
    const render = new FileReader();
    const image = new Image();
    render.onload = (e) => {
      image.src = e.target?.result as string;
      resolve(image.src);
    };
    render.readAsDataURL(file);
  });
}

/**
 * 画像を読み込んでエディターに反映する
 * @param view
 * @param event
 * @param slice
 * @param moved
 * @returns
 *
 * 参考:https://github.com/ueberdosis/tiptap/issues/2455
 */
export function handleDropImage(
  view: EditorView,
  event: DragEvent,
  slice: Slice,
  moved: boolean
): boolean | void {
  if (!moved && event.dataTransfer && event.dataTransfer.files) {
    // if dropping external files
    // the addImage function checks the files are an image upload, and returns the url
    addImage(event.dataTransfer.files[0], (url: string) => {
      // this inserts the image with src url into the editor at the position of the drop
      const { schema } = view.state;
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      const node = schema.nodes.image.create({ src: url });
      const transaction = view.state.tr.insert(coordinates?.pos ?? 0, node);
      return view.dispatch(transaction);
    });
    return true; // drop is handled don't do anything else
  }
  return false; // not handled as wasn't dragging a file so use default behaviour
}

/**
 * 画像をロードする
 * @param file
 * @param cb
 */
export function addImage(file: File, cb: (url: string) => void) {
  const render = new FileReader();
  const image = new Image();
  render.onload = (e) => {
    image.src = e.target?.result as string;
    cb(image.src);
  };
  render.readAsDataURL(file);
}
