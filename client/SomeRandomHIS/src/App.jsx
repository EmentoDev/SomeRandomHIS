import './App.css';
import 'fhir-react/build/style.css';
import 'fhir-react/build/bootstrap-reboot.min.css';
import PatientList from './Components/PatientList/PatientList';
import AppointmentList from './Components/AppointmentList/AppointmentList';
import { useViewStore } from './store';
import ResourceEdit from './Components/ResourceEdit/ResourceEdit';

const App = () => {
  const view = useViewStore(state => state.view);

  return (
      <div className="page">
        <header className="header">
          <h1>Some Random HIS</h1>
          <p>FHIR R4 demo</p>
       </header>

        <aside className="sidebar">
          <PatientList />
        </aside>

        <main className="main">
          {view.type === 'ResourceEdit' && <ResourceEdit resource={view.data} />}
          {view.type === 'AppointmentList' && <AppointmentList patient={view.data} />}
        </main>

        <footer className="footer">&copy; Emento A/S</footer>
      </div>
  );
};

export default App;
