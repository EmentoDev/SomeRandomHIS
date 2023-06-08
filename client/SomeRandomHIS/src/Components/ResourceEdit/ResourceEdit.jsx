import * as React from 'react';
import JsonEditor from 'react-json-editor-ui';
import 'react-json-editor-ui/dist/react-json-editor-ui.cjs.development.css';
import './ResourceEdit.css';
import FHIR from 'fhirclient';

const fhirclient = FHIR.client({
    serverUrl: 'https://76ffhj0j-5173.euw.devtunnels.ms/4_0_0'
});

const ResourceEdit = ({resource, options}) => {
    const [editObject, setEditObject] = React.useState({});
    const [error, setError] = React.useState();

    React.useEffect(() => {
        const getData = async () => {
            const data = await fhirclient.request(`${resource.resourceType}/${resource.id}`);
            setEditObject(data);
        };

        if (options && options.new){
            setEditObject(resource);
        } else {
            getData();
        }
    }, [resource, options]);

  return (
    <div className='RESOURCEEDIT'>
        <h2 className='header'>Resource Edit</h2>
        <div className='actions'>
            <span className='actionButton' onClick={async() => {
                setError();
                await fhirclient.update(editObject, {
                    headers: {
                        'Content-Type': 'application/fhir+json'
                    }
                }).catch((err) => {
                    setError(err);
                });
                window.location.reload();
            }}>SAVE</span>
            <span className='actionButton' onClick={async() => {
                setError();
                await fhirclient.delete(`${editObject.resourceType}/${editObject.id}`).catch((err) => {
                    setError(err);
                });
                window.location.reload();
            }}>DELETE</span>
        </div>

        <div className='errorText'>
            {error && error.message}
        </div>
        <div className='container'>
            <JsonEditor
                key={editObject.id}
                data={editObject}
                width='700px'
                onChange={data => {
                    setEditObject(data);
                }}
                optionsMap={{
                    resourceType: [
                        { value: 'Patient', label: 'Patient' },
                        { value: 'Appointment', label: 'Appointment' },
                    ],
                    status: [
                        { value: 'proposed', label: 'Proposed' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'booked', label: 'Booked' },
                        { value: 'arrived', label: 'Arrived' },
                        { value: 'fulfilled', label: 'Fulfilled' },
                        { value: 'cancelled', label: 'Cancelled' },
                        { value: 'noshow', label: 'No Show' },
                        { value: 'entered-in-error', label: 'Entered in Error' },
                        { value: 'checked-in', label: 'Checked In' },
                        { value: 'waitlist', label: 'Waitlist' },
                    ],
                }}
            />
        </div>
    </div>
  );
};

export default ResourceEdit;
