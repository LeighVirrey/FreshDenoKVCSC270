import { useSignal } from "@preact/signals";

export default function SpecialCounter() {
  const count = useSignal(0);

  return (
    <button 
      type="button"
      onClick={() => count.value++}
      class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
    >
      Count: {count.value}
    </button>
  );
}
