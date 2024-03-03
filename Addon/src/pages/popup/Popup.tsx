import logo from '@assets/img/logo.svg';

export default function Popup(): JSX.Element {
  return (
    <div className="ig-absolute ig-inset-0 ig-h-full ig-bg-gray-800 ig-p-3 ig-text-center">
      <header className="ig-flex ig-flex-col ig-items-center ig-justify-center ig-text-white">
        <img src={logo} className="ig-pointer-events-none ig-h-36" alt="logo" />
      </header>
    </div>
  );
}
