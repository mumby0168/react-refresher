
import { useState } from 'react';
import { ListSummary } from '../models/lists';

export interface IListsTabsProps {
    summaries: ListSummary[]
    onTabSelected: (selected: ListSummary) => void;
}

export function ListsTabs(props: IListsTabsProps) {

    const [activeTab, setActiveTab] = useState<ListSummary | null>()

    const getActiveClassName = (ls: ListSummary): string => 
        activeTab && ls.name == activeTab.name
        ? 'is-active'
        : ''
            
    const setChosenTab = (ls: ListSummary) => {
        props.onTabSelected(ls);
        setActiveTab(ls);
    }

    const tabs = props.summaries.map((ls) =>
        <li className={getActiveClassName(ls)}>
            <a onClick={() => setChosenTab(ls)}>
                {ls.name}
            </a>
        </li>)

    return (
        <div className='tabs is-centered'>
            <ul>
                {tabs}
            </ul>
        </div>
    );
}
