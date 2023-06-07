import { useEffect, useState } from 'react';
import { fhirVersions, Patient } from 'fhir-react';
import FHIR from 'fhirclient';
import './PatientList.css';
import { usePatientStore, useViewStore } from '../../store';
import { VIEWS } from '../../constants';

const fhirclient = FHIR.client({
  serverUrl: 'https://76ffhj0j-5173.euw.devtunnels.ms/4_0_0'
});

const PatientCard = ({patientId}) => {
  const [patient, setPatient] = useState({});
  const selectPatient = usePatientStore(state => state.set);
  const setView = useViewStore(state => state.set);

  useEffect(() => {
    const getPatient = async () => {
      const data = await fhirclient.request(`Patient/${patientId}`);
      setPatient(data);
    };
    getPatient();
  }, [patientId]);

  return (
    <li className='item'>
      <Patient
        style={{width: '100%'}}
        fhirResource={patient}
        fhirVersion={fhirVersions.R4}
        patientSimple={false}
        rawOnClick={() => {setView(VIEWS.RESOURCE_EDIT, patient);}}
      />
      <div style={{margin: '-5px 0 20px 15px'}}>
        <span className='patientActionButton' onClick={() => {setView(VIEWS.APPOINTMENT_LIST, patient)}}>show Appointments</span>
        <span className='patientActionButton'>show Documents</span>
      </div>
    </li>
  );
};

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const getPatients = async () => {
      const data = await fhirclient.request('Patient');
      setPatients(data);
    };
    getPatients();
  }, []);

  return (
    <div className='PATIENT'>
      <h2 className='header'>Patients</h2>
      <ul className='list'>
        {patients.map((patient) => (
          <PatientCard key={patient.id} patientId={patient.id} />
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
