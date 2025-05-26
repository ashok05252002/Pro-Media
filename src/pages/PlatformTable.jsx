import { useParams, useLocation } from "react-router-dom";
import YoutubeTable from "../components/table";

const PlatformTable = () => {
  const location = useLocation();
  const { platform_name, product_id, ext_prdct_data_source_id } = location.state || {}; // Destructure the same keys

  const renderTable = (name) => {
    switch (name) {
      case "facebook":
        return <div>📘 Facebook Table Data</div>;
      case "twitter":
        return <div>🐦 Twitter Table Data</div>;
      case "instagram":
        return <div>📸 Instagram Table Data</div>;
      case "linkedIn":
        return <div>💼 LinkedIn Table Data</div>;
      case "youtube":
        return <div>▶️<YoutubeTable/> </div>;
      default:
        return <div>Platform not found</div>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{platform_name} ,{product_id} ,{ext_prdct_data_source_id} Details</h1>
      {renderTable(platform_name)}
    </div>
  );
};

export default PlatformTable;
