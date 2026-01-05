export default function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer ${
        active
          ? "bg-orange-500 text-white"
          : "bg-black text-white hover:bg-gray-100 hover:text-black hover:border"
      }`}
    >
      {label}
    </button>
  );
}
