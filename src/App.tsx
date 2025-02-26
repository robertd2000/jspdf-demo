import "./App.css";
import PDFEditor from "./components/Editor";
import LabelEditor from "./components/LabelEditor";

function App() {
  return (
    <div className='min-h-screen min-w-screen flex flex-col'>
      {/* <LabelEditor /> */}
      <PDFEditor />
    </div>
  );
}

export default App;
