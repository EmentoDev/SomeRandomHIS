import './App.css';
import 'fhir-react/build/style.css';
import 'fhir-react/build/bootstrap-reboot.min.css';
import PatientList from './Components/PatientList/PatientList';
import AppointmentList from './Components/AppointmentList/AppointmentList';

const App = () => {
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
          <AppointmentList />
        </main>

        <footer className="footer">&copy; Emento A/S</footer>
      </div>
  );
};

export default App;
