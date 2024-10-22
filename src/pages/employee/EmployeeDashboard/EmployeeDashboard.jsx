import React from "react";

const EmployeeDashboardPowerBIReport = () => {
  const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=e2a27c0b-919d-422f-bac3-7c3c221b54fa&autoAuth=true&ctid=00cb49fd-707f-455b-add1-922f945adba5"; 

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Power BI Report"
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
};

export default EmployeeDashboardPowerBIReport;