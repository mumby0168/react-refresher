import {useState} from 'react';
import {useMsal} from "@azure/msal-react";
import {createNewList} from "../api/apiFuncs";
import {getAPIAuthToken} from "../auth/msal";

export interface IListsFormProps {
    onListCreated: () => void;
}

export function ListForm(props: IListsFormProps) {

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const context = useMsal();

    const submit = () => {
        getAPIAuthToken(context)
            .then((token: any) => {
                createNewList(name, token)
                    .then((error) => {
                        if (error) {
                            setError(error);
                        } else {
                            props.onListCreated();
                            setName('');
                        }
                    })
            })
    }

    return (
        <div>
            <div className="field has-addons">
                <p className="control">
                    <input value={name} onChange={e => setName(e.currentTarget.value)} className="input" type="text"
                           placeholder="List Name"/>
                </p>
                <p className="control">
                    <a onClick={submit} className="button is-light">
                        Create
                    </a>
                </p>

            </div>
            <div className="field">
                <p className='help is-danger'>{error}</p>
            </div>
        </div>
    );
}
