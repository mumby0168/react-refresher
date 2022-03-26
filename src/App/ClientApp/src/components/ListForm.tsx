import {useState} from 'react';

export interface IListsFormProps {
    onListCreated: () => void;
}

export function ListForm(props: IListsFormProps) {

    const [name, setName] = useState('');

    return (
        <div className="field has-addons">
            <p className="control">
                <input value={name} onChange={e => setName(e.currentTarget.value)} className="input" type="text"
                       placeholder="List Name"/>
            </p>
            <p className="control">
                <a className="button is-light">
                    Create
                </a>
            </p>
        </div>
    );
}
