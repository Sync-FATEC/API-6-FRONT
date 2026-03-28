/* eslint-disable @next/next/no-img-element */

export default function Navbar() {
  return (
    <nav className="bg-white text-white p-4 shadow-sm rounded-md h-18 mb-3">
      <div className="flex justify-between items-center h-full">
        <img src="/visiona_logo.svg" alt="VISIONA GeoQuery Logo" className="w-auto h-full" />
      </div>
    </nav>
  );
}
