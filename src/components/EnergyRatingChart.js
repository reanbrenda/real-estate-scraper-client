import React from "react";

const EnergyRatingChart = ({ highlightedRating }) => {
  if (!highlightedRating) return null;
  const ratings = [
    { label: "A", color: "bg-green-500", text: "más eficiente", width: "40%" },
    { label: "B", color: "bg-green-400", text: "", width: "50%" },
    { label: "C", color: "bg-yellow-400", text: "", width: "60%" },
    { label: "D", color: "bg-yellow-500", text: "", width: "70%" },
    { label: "E", color: "bg-orange-500", text: "", width: "80%" },
    { label: "F", color: "bg-red-400", text: "", width: "90%" },
    { label: "G", color: "bg-red-600", text: "menos eficiente", width: "100%" },
  ];

  const energyData = {
    E: { consumo: 130.0, emisiones: 30.0 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-300 rounded-lg shadow-lg bg-white relative">
      
      <div className="bg-gray-100 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Energy Rating </h2>
        <h2 className="text-2xl font-bold text-gray-800">Rating for this property:{highlightedRating} </h2>
      </div>

     
      <div className="grid grid-cols-3 w-full border-t border-gray-300 relative">
        
        <div className="font-bold text-sm  text-gray-800 col-span-1 bg-gray-100 p-4">
          ESCALA DE LA CALIFICACIÓN ENERGÉTICA
        </div>
        <div className="font-bold text-sm  text-gray-800 col-span-1 bg-gray-100 p-4 text-center">
          Consumo de energía <br /> kWh/m² año
        </div>
        <div className="font-bold text-sm text-gray-800 col-span-1 bg-gray-100 p-4 text-center">
          Emisiones <br /> kg CO₂/m² año
        </div>

        
        {ratings.map((rating) => (
          <React.Fragment key={rating.label}>
            {/* Label with Triangle End */}
            <div
              className={`relative flex items-center ${rating.color} text-white font-bold p-4`}
              style={{
                width: rating.width,
                clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
              }}
            >
              {rating.label}
              {rating.text && (
                <span className="ml-2 text-sm font-normal">({rating.text})</span>
              )}

             
              {highlightedRating === rating.label && (
                <div
                  className="absolute bg-black text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
                  style={{
                    top: "50%",
                    left: "110%", 
                    transform: "translateY(-50%)", 
                    whiteSpace: "nowrap", 
                  }}
                >
                  Current Rating
                </div>
              )}
            </div>

            
            <div
              className={`flex items-center justify-center border-l border-gray-300 ${
                highlightedRating === rating.label
                  ? "bg-black text-white"
                  : "bg-white"
              } p-4`}
            >
              {energyData[rating.label]?.consumo || ""}
            </div>

            
            <div
              className={`flex items-center justify-center border-l border-gray-300 ${
                highlightedRating === rating.label
                  ? "bg-black text-white"
                  : "bg-white"
              } p-4`}
            >
              {energyData[rating.label]?.emisiones || ""}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EnergyRatingChart;
