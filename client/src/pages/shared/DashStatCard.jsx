import React from "react";

const DashStatCard = ({ title, count, icon, color  }) => {
  // console.log("DashStatCard", { title, count, icon, color });
    return (
        // <div className="stat-card">
        //     <div className="stat-card-icon" style={{ backgroundColor: color }}>
        //         {/* <i className={icon}></i>                 */}
        //         {icon && <div className="text-3xl mr-4 text-indigo-600">{icon}</div>}
        //     </div>
        //     <div className="stat-card-content">
        //         <h3>{title}</h3>
        //         <p>{count}</p>
        //     </div>
        // </div> 
        <div className={`stats shadow ${color ? `bg-[${color}]` : 'bg-gray-200'}`} style={{ backgroundColor: color }}>
          <div className="stat">
            <div className="stat-figure text-primary">
            {icon && <div className="text-3xl mr-4 text-indigo-600">{icon}</div>}
            </div>
            <div className="stat-title font-semibold text-xl">{title}</div>
            <div className="stat-value text-primary">{count}</div>
          </div>
        </div>
    );    
};  

export default DashStatCard;