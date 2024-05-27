import DataCharts from "../components/data-charts";
import DataGrid from "../components/data-grid";

export default function SummaryScreen() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
