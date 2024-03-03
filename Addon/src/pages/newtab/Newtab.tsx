import logo from "@assets/img/logo.svg";

export default function Newtab(): JSX.Element {
  return (
    <div className="ig-text-center">
      <header className="ig-flex ig-min-h-screen ig-flex-col ig-items-center ig-justify-center ig-bg-[#282c34] ig-text-white">
        <img
          src={logo}
          className="ig-pointer-events-none"
          alt="logo"
        />
      </header>
    </div>
  );
}
