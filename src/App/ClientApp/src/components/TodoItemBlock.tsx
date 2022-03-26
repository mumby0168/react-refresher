import {TodoItem} from '../models/lists';

export interface ITodoItemBlockProps {
    item: TodoItem;
}


export function ITodoItemBlock({item}: ITodoItemBlockProps) {

    const getDateTooltipText = () => {
        if (item.completedAt) {
            return `Done: ${item.completedAt.toDateString()}`;
        } else {
            return `Created: ${item.createdAt.toDateString()}`;
        }
    };

    const buttons = () => {
        if (item.completedAt) {
            return (<div/>);
        }
        return (
            <button className="button is-primary is-small">Complete</button>
        );
    };


    return (
        <div className="panel-block is-align-content-stretch is-flex-grow-1">
            <div className="w-100 is-flex is-justify-content-space-between">
                <div data-tooltip={getDateTooltipText()}
                     className="is-flex is-align-items-center is-justify-content-center has-tooltip-right">
                    <i className="fa fa-calendar mr-2"/>
                    <p>{item.title}</p>
                </div>
                <div>
                    {buttons()}
                </div>
            </div>
        </div>
    );
}