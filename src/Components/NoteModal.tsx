import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import "./style.css";
import beautify from "js-beautify";
import { Editor } from "@tinymce/tinymce-react";

export default function MyModal({
  open,
  handleClose,
  text,
  setText,
}: {
  open: boolean;
  handleClose: () => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [storedText, setStoredText] = useState("");
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setStoredText(text);
      }, 50);
    }
  }, [open]);

  useEffect(() => {
    const cleanedData = storedText
      .replace(/&nbsp;/g, "")
      .replace(/&amp;nb/g, "");
    const beautified = beautify.html(cleanedData, {
      indent_size: 2,
    });
    setText(cleanedData);
  }, [storedText]);

  const handleUpdate = (value: string, editor: any) => {
    setStoredText(value);
  };

  const charCount = (editor: any) =>
    editor.getContent({ format: "text" }).length;

  const handleBeforeAddUndo = (evt: any, editor: any) => {
    // note that this is the opposite test as in handleUpdate
    // because we are determining when to deny adding an undo level
    if (charCount(editor) > 3000) {
      evt.preventDefault();
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[30rem]">
                <div
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={handleClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 mb-3"
                >
                  Print Note
                </Dialog.Title>
                <div className="max-h-[25rem] overflow-auto">
                  {/* <ReactQuill
                    style={{ height: "10rem" }}
                    value={storedText}
                    onChange={setStoredText}
                    // modules={{ toolbar: toolbarOptions }}
                    modules={modules}
                    formats={["divborder", "fontsize", "align"]}
                  /> */}
                  {/* <JoditEditor
                    value={storedText}
                    onChange={setStoredText}
                    config={{ removeButtons: ["fullsize"] }}
                  /> */}
                  <Editor
                    //  onChange={(e) => setText(e.target.getContent())}
                    apiKey="ighr8667og4sgiktdhjy97i5vkwlgrjbwai7ip2tg478qc3b"
                    //  onInit={(evt, editor) => editorRef.current = editor}
                    value={storedText}
                    init={{
                      plugins: "table wordcount",
                    }}
                    onEditorChange={handleUpdate}
                    onBeforeAddUndo={handleBeforeAddUndo}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
