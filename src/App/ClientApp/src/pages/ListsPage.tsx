import { stat } from 'fs';
import { useState } from 'react';
import { ListsTabs } from '../components/ListsTabs';
import { ListSummary } from '../models/lists';

const initSummaries: ListSummary[] = [
  {
    name: "List Item 1",
    createdAt: new Date()
  },
  {
    name: "List Item 2",
    createdAt: new Date()
  },
  {
    name: "List Item 3",
    createdAt: new Date()
  },
  {
    name: "List Item 4",
    createdAt: new Date()
  },
  {
    name: "List Item 5",
    createdAt: new Date()
  },
];

export function ListsPage() {

  const [summaries, setSummaries] = useState(initSummaries);
  const [title, setTitle] = useState('Select a list item')

  const handleTitleChanged = (ls: ListSummary) => {
    setTitle(ls.name)
  }


  return (
    <div className='container'>
      <ListsTabs onTabSelected={handleTitleChanged} summaries={summaries} />
      <div>{title}</div>
    </div>
  );
}
