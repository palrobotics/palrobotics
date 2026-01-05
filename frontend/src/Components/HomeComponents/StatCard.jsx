import { useCountUp } from "../../Hooks/useCountUp";

export default function StatCard({ icon, label, value, suffix }) {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="flex flex-row gap-5 justify-around items-center bg-white rounded-2xl p-8 text-center shadow-sm"
    >
      <div className="flex justify-center items-center text-orange-500 mb-4">
        {icon}
      </div>

      <div>
        <div className="text-3xl font-bold mb-2">
          {count}
          {suffix}
        </div>

        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
