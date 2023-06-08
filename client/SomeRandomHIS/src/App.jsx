import './App.css';
import 'fhir-react/build/style.css';
import 'fhir-react/build/bootstrap-reboot.min.css';
import { useViewStore } from './store';
import { VIEWS } from './constants';
import PatientList from './Components/PatientList/PatientList';
import AppointmentList from './Components/AppointmentList/AppointmentList';
import ResourceEdit from './Components/ResourceEdit/ResourceEdit';
import DocumentReferenceList from './Components/DocumentReferenceList/DocumentReferenceList';

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
          {view.type === VIEWS.RESOURCE_EDIT && <ResourceEdit resource={view.data} options={view.options} />}
          {view.type === VIEWS.APPOINTMENT_LIST && <AppointmentList patient={view.data} />}
          {view.type === VIEWS.DOCUMENT_REFERENCE_LIST && <DocumentReferenceList patient={view.data} />}
        </main>

        <footer className="footer">&copy; Emento A/S</footer>
      </div>
  );
};

export default App;
