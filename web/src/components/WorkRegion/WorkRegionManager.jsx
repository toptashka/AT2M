import WorkRegionUser from "./WorkRegionUser";
import Footer from "../Footer/Footer";
import "./WorkRegionLayout.css";

export default function WorkRegionManager(props) {
  return (
    <div className="work-region-layout">
      <WorkRegionUser {...props} manager={props.manager ?? true} />
      <Footer />
    </div>
  );
}
