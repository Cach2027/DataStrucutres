import React from "react";

function ArrayVisualizer({
  array,
  highlightedIndex,
  foundIndex,
  currentIndex,
  isFinished,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {array.map((num, index) => {
        let boxStyle =
          "w-12 h-12 flex items-center justify-center rounded border transition-all duration-500";

        // 🔥 si es el encontrado, resaltamos verde definitivo
        if (foundIndex === index && isFinished) {
          boxStyle += " bg-green-500 text-white font-bold border-2 border-green-700";
        }
        // ✨ paso actual resaltado
        else if (highlightedIndex === index) {
          boxStyle += " bg-yellow-400 text-black font-bold";
        }
        // 📌 índice medio actual
        else if (currentIndex === index) {
          boxStyle += " bg-orange-400 text-black font-bold";
        }
        // 🎨 estilo por defecto
        else {
          boxStyle += " bg-gray-200 dark:bg-gray-700 text-black";
        }

        return (
          <div key={index} className={boxStyle}>
            {num}
          </div>
        );
      })}
    </div>
  );
}

export default ArrayVisualizer;
