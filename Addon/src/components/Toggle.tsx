import { ChangeEventHandler } from "react";

type Props = {
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export default function Toggle({ onChange }: Props) {
  return (
    <label className="ig-relative ig-inline-block ig-h-[1.2rem] ig-w-[2rem]">
      <input
        className="ig-peer/input ig-h-0 ig-w-0 ig-opacity-0 checked:ig-duration-200 focus:ig-shadow-sm "
        type="checkbox"
        onChange={onChange}
      />
      <span className="ig-absolute ig-inset-0 ig-cursor-pointer ig-rounded-full ig-bg-[#ccc] ig-duration-200 before:ig-absolute before:ig-bottom-[0.125rem] before:ig-left-[0.125rem] before:ig-contents before:ig-h-[0.9rem] before:ig-w-[0.9rem] before:ig-rounded-full before:ig-bg-white before:ig-duration-200 focus:ig-shadow-[#2196F3] peer-checked/input:ig-bg-[#2196F3] before:peer-checked/input:ig-translate-x-[0.9rem]"></span>
    </label>
  );
}
