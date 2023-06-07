import { useEffect, useState } from 'react';
import { fhirVersions, Appointment } from 'fhir-react';
import FHIR from 'fhirclient';
import './AppointmentList.css';
import { useViewStore } from '../../store';
import { VIEWS } from '../../constants';

const fhirclient = FHIR.client({
  serverUrl: 'https://76ffhj0j-5173.euw.devtunnels.ms/4_0_0'
});

const AppointmentCard = ({appointmentId}) => {
  const [appointment, setAppointment] = useState({});
  const setView = useViewStore(state => state.set);

  useEffect(() => {
    const getData = async () => {
      const data = await fhirclient.request(`Appointment/${appointmentId}`);
      setAppointment(data);
    };
    getData();
  }, [appointmentId]);

  return (
    <li className="item">
      <Appointment
        style={{width: '100%'}}
        fhirResource={appointment}
        fhirVersion={fhirVersions.R4}
        patientSimple={false}
        rawOnClick={() => {setView(VIEWS.RESOURCE_EDIT, appointment);}}
      />
    </li>
  );
};

const AppointmentList = ({patient}) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fhirclient.request(`Appointment?patient=${patient.id}`);
      //const data = await fhirclient.request(`Appointment?status=booked`);
      setAppointments(data);
    };
    getData();
  }, [patient]);

  return (
    <div className="APPOINTMENT">
        <h2>Appointments</h2>
        <ul className='list'>
            {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointmentId={appointment.id} />
            ))}
        </ul>
    </div>
  );
};

export default AppointmentList;
