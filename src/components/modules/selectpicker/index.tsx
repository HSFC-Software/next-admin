import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";

type PickerProps = {
    onConfirm: (value: string) => void;
    onClose: () => void;
    label?: string;
    children?: any;
    value?: string;
    };

    export default function SelectPicker(
    props: { isVisible: boolean } & PickerProps
    ) {
    if (props.isVisible) {
        return <Picker {...props} />;
    }

    return null;
    }

    function Picker(props: PickerProps) {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleScrollDebounced = debounce((e) => {
        const scrollTop = e.target?.scrollTop;
        const optionEl = e?.target?.children?.[1];

        const elIndex = Math.floor(scrollTop / optionEl.offsetHeight);
        const maxIndex = e?.target?.children?.length - 3; // -3 because of the first and last element

        const centerEl = e?.target?.children?.[elIndex + 1];

        let selectedEl: HTMLElement;

        if (elIndex >= maxIndex) {
        const lastEl = e?.target?.children?.[e?.target?.children?.length - 2];
        selectedEl = lastEl;
        } else {
        selectedEl = centerEl;
        }

        selectedEl?.scrollIntoView({ behavior: "smooth", block: "center" });

        const children = e?.target?.children;
        Array.from(children).forEach((el: any) => {
        if (el === selectedEl) return; // skip selected element (to avoid unnecessary re-rendering
        el?.classList.remove("text-gray-800");
        el?.classList.add("text-gray-400");
        });

        // apply styles to selected element
        selectedEl?.classList.remove("text-gray-400");
        selectedEl?.classList.add("text-gray-800");

        setSelectedValue(selectedEl?.getAttribute("aria-value"));
    }, 300);

    function handleConfirm() {
        props.onConfirm?.(selectedValue ?? "");
        props?.onClose?.();
    }

    // add scroll event
    useEffect(() => {
        const element = document.getElementById("option-container");
        element?.addEventListener("scroll", handleScrollDebounced);
    }, []);

    // initialize height
    useEffect(() => {
        const pickerEl = document.getElementById("select-picker");
        if (pickerEl) {
        pickerEl.style.height = `${window.innerHeight / 2.5}px`;
        }
    }, []);

    // initialize view
    useEffect(() => {
        const containerEl = document.getElementById("option-container");

        for (let i = 0; i < (containerEl?.childNodes?.length ?? 0); i++) {
        const ariaValue = containerEl?.children[i].getAttribute("aria-value");
        if (ariaValue === props.value) {
            containerEl?.children[i]?.scrollIntoView({ block: "center" });
            containerEl?.children[i]?.classList.add("text-gray-800");
        }
        }
    }, []);

    const handleClick = (value: string, el: any) => {
        setSelectedValue(value);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.classList.remove("text-gray-400");
        el?.classList.add("text-gray-800");
    };

    return (
        <div
        style={{
            zIndex: 200,
        }}
        className="fixed h-screen w-screen top-0 left-0 bg-black bg-opacity-50 flex flex-col justify-end"
        >
        <div className="flex items-center p-5 bg-[#F8F8F9] rounded-t-2xl border-[#EBEAED] border-b">
            <button onClick={() => props?.onClose()} className="text-gray-400">
            Cancel
            </button>
            <div className="grow text-center font-medium">{props.label}</div>
            <button onClick={handleConfirm} className="text-[#6474dc]">
            Confirm
            </button>
        </div>
        <div className="bg-[#F8F8F9]">
            <div
            id="select-picker"
            className={`relative w-screen flex justify-center gap-4`}
            >
            <div
                id="option-container"
                className="overflow-y-auto hide-scrollbar hide-scrollbar-webkit px-4"
            >
                <div className="h-[50%]" />
                {props.children?.map((child: any, index: number) => {
                return (
                    <div
                    className="py-2 text-gray-400 text-center text-xl cursor-pointer"
                    key={index}
                    aria-value={child?.props?.value}
                    onClick={(e) => handleClick(child?.props?.value, e?.target)}
                    >
                    {child?.props?.children}
                    </div>
                );
                })}
                <div className="h-[50%]" />
            </div>
            <div
                id="select-area"
                className={`h-[60px] w-full border-t border-b absolute border-[#EBEAED] top-0 bottom-0 my-auto pointer-events-none`}
            />
            </div>
        </div>
        </div>
    );
}
