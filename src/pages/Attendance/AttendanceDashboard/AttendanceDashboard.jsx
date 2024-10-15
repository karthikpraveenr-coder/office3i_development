import React from "react";

const AttendanceDashboardPowerBIReport = () => {
  const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=9f6384e2-de4c-4ae3-9e13-09fa7163106c&autoAuth=true&ctid=00cb49fd-707f-455b-add1-922f945adba5";  // Use your actual embed URL

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

export default AttendanceDashboardPowerBIReport;