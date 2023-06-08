import { useEffect, useState } from 'react';
import { fhirVersions, DocumentReference } from 'fhir-react';
import FHIR from 'fhirclient';
import './DocumentReferenceList.css';
import { useViewStore } from '../../store';
import { VIEWS } from '../../constants';
import NEW_DOCUMENT_REFERENCE from './NewDocumentReference.json';

const fhirclient = FHIR.client({
    serverUrl: 'https://76ffhj0j-5173.euw.devtunnels.ms/4_0_0',
});

const DocumentReferenceCard = ({ documentReferenceId }) => {
    const [documentReference, setDocumentReference] = useState({});
    const setView = useViewStore((state) => state.set);

    useEffect(() => {
        const getData = async () => {
            const data = await fhirclient.request(`DocumentReference/${documentReferenceId}`);
            setDocumentReference(data);
        };
        getData();
    }, [documentReferenceId]);

    return (
        <li className="item">
            <DocumentReference
                style={{ width: '100%' }}
                fhirResource={documentReference}
                fhirVersion={fhirVersions.R4}
                patientSimple={false}
                rawOnClick={() => {
                    setView(VIEWS.RESOURCE_EDIT, documentReference);
                }}
            />
        </li>
    );
};

const DocumentReferenceList = ({ patient }) => {
    const [documentReferences, setDocumentReferences] = useState([]);
    const setView = useViewStore((state) => state.set);

    useEffect(() => {
        const getData = async () => {
            const data = await fhirclient.request(`DocumentReference?patient=${patient.id}`);
            setDocumentReferences(data);
        };
        getData();
    }, [patient]);

    return (
        <div className="DOCUMENTREFERENCE">
            <h2>Document Reference</h2>
            <a className="docs" href="https://hl7.org/fhir/R4/documentreference.html" target="_blank" rel="noreferrer">
                &#8505;
            </a>
            <span
                className="addNew"
                onClick={() => {
                    const newDocumentReference = Object.assign({}, NEW_DOCUMENT_REFERENCE);
                    newDocumentReference.subject.reference = `Patient/${patient.id}`;
                    setView(VIEWS.RESOURCE_EDIT, NEW_DOCUMENT_REFERENCE, { new: true });
                }}
            >
                &#8853;
            </span>
            <ul className="list">
                {documentReferences.map((documentReference) => (
                    <DocumentReferenceCard key={documentReference.id} documentReferenceId={documentReference.id} />
                ))}
            </ul>
        </div>
    );
};

export default DocumentReferenceList;
