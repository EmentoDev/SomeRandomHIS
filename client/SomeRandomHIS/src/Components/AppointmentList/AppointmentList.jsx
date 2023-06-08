import { useEffect, useState } from 'react';
import { fhirVersions, Appointment } from 'fhir-react';
import FHIR from 'fhirclient';
import './AppointmentList.css';
import { useViewStore } from '../../store';
import { VIEWS } from '../../constants';
import NEW_APPOINTMENT from './NewAppointment.json';

const fhirclient = FHIR.client({
    serverUrl: 'https://76ffhj0j-5173.euw.devtunnels.ms/4_0_0',
});

const AppointmentCard = ({ appointmentId }) => {
    const [appointment, setAppointment] = useState({});
    const setView = useViewStore((state) => state.set);

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
                style={{ width: '100%' }}
                fhirResource={appointment}
                fhirVersion={fhirVersions.R4}
                patientSimple={false}
                rawOnClick={() => {
                    setView(VIEWS.RESOURCE_EDIT, appointment);
                }}
            />
        </li>
    );
};

const AppointmentList = ({ patient }) => {
    const [appointments, setAppointments] = useState([]);
    const setView = useViewStore((state) => state.set);

    useEffect(() => {
        const getData = async () => {
            const data = await fhirclient.request(`Appointment?patient=${patient.id}`);
            setAppointments(data);
        };
        getData();
    }, [patient]);

    return (
        <div className="APPOINTMENT">
            <h2>Appointments</h2>
            <a className="docs" href="https://hl7.org/fhir/R4/appointment.html" target="_blank" rel="noreferrer">
                &#8505;
            </a>
            <span
                className="addNew"
                onClick={() => {
                    const newAppointment = Object.assign({}, NEW_APPOINTMENT);
                    const patientParticipant = newAppointment.participant.find(p => p.actor.reference.includes('Patient'))
                    patientParticipant.actor.reference = `Patient/${patient.id}`;
                    patientParticipant.actor.display = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
                    setView(VIEWS.RESOURCE_EDIT, NEW_APPOINTMENT, { new: true });
                }}
            >
                &#8853;
            </span>
            <ul className="list">
                {appointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointmentId={appointment.id} />
                ))}
            </ul>
        </div>
    );
};

export default AppointmentList;
