import React from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";
import { useState } from "react";
import moment from "moment";
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

const handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
    } else {
        delete newFilters[filter.column.key];
    }
    return newFilters;
};

const useStyles = makeStyles({
    row: {
        width: '1280px',
        border: '1px solid #c3c3c3',
        margin: '3px',
        borderRadius: '3px'
    },
    cellItem: {
        width: '304px',
        display: 'inline-block',
        paddingLeft: '12px'
    }
})
const RowRenderer = ({ row, idx }) => {
    const classes = useStyles();
    const { visit_date, visitor_name, host_name, host_company, day_of_week } = row;
    return <Box><div className={classes.row}><div className={classes.cellItem}>{visit_date}<br />{day_of_week}</div>
        <div className={classes.cellItem}>{visitor_name}</div>
        <div className={classes.cellItem}>{host_name}</div>
        <div className={classes.cellItem}>{host_company}</div></div>

    </Box>;
}
function getValidFilterValues(rows, columnId) {

    if (columnId === 'visit_date') {
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            }).map(r => moment(r).format('hh:mm a'));
    } else {
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    }

}
const fuzzySearch = (rows, filterTerm) => {
    let selectedRows = [];
    if (!rows.map) {
        return selectedRows;
    }
    rows.map(r => {
        for (let key in rows[0]) {
            if (r[key].toString().toLowerCase().slice().indexOf(filterTerm.toLowerCase()) > -1) {
                selectedRows.push(r);
                break;
            }
        }
    });
    selectedRows = selectedRows.map(r => {
        return { ...r, visit_date: moment(r['visit_date']).format('hh:mm a'), day_of_week: moment(r['visit_date']).format('dddd') };
    });
    return selectedRows;
}
const selectors = Data.Selectors;
function getRows(rows, filters) {
    if (rows.map) {
        rows = rows.map(r => {
            return { ...r, visit_date: moment(r['visit_date']).format('hh:mm a'), day_of_week: moment(r['visit_date']).format('dddd') }
        });
    }

    return selectors.getRows({ rows, filters });
}

export default function VisitorDirectory(props) {
    const [filter, setFilter] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const filteredRows = searchTerm ? fuzzySearch(props.data, searchTerm) : getRows(props.data, filter);
    const handleSearch = ({ target }) => {
        setSearchTerm(target.value);
        /* Object.keys(props.data[0]).map(key => {
            if (key === 'visitor_name' || key === 'host_name' || key === 'host_company') {
                if (target.value) {
                    setFilter(handleFilterChange({
                        filterTerm: searchTerm,
                        column: { key }
                    }));
                } else {
                    setFilter({ column: { key } });
                }

            }
        }); */
    }
    [].slice.call(filteredRows).sort(function (a, b) {
        if (moment(a.visit_date).isBefore(moment(b.visit_date))) {
            return -1;
        } else {
            return 1;
        }
    });
    return <>
        <input type="text" onChange={handleSearch} value={searchTerm} />
        <ReactDataGrid
            columns={props.columns}
            rowRenderer={RowRenderer}
            toolbar={<Toolbar enableFilter={true} />}
            rowGetter={i => filteredRows[i]}
            rowsCount={props.rowsCount}
            onAddFilter={filter => setFilter(handleFilterChange(filter))}
            onClearFilters={() => setFilter({})}
            rowHeight={46}
            headerRowHeight={46}
            minHeight={640}
            getValidFilterValues={columnKey => getValidFilterValues(props.data, columnKey)}
        /></>
}