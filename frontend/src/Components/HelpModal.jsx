import { FiX } from "react-icons/fi";

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Get Help</h3>
          <button onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              window.open(import.meta.env.VITE_WHATSAPP_GROUP_LINK, "_blank")
            }
            className="w-full px-4 py-3 rounded-lg border border-orange-500/70 text-sm hover:bg-gray-50"
          >
            Join WhatsApp Group
          </button>

          <button
            onClick={() =>
              window.open(import.meta.env.VITE_WHATSAPP_CHANNEL_LINK, "_blank")
            }
            className="w-full px-4 py-3 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            View WhatsApp Channel
          </button>
        </div>
      </div>
    </div>
  );
}
