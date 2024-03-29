import React from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { useState } from "react";
import moment from "moment";
import { Box, Grid, AppBar, Typography, Paper, Input, InputAdornment, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import './visitor.directory.css';

const {
    SingleSelectFilter
} = Filters;

const defaultColumnProperties = {
    filterable: true,
    width: '18%'
};
let columns = [
    {
        key: 'visit_date',
        name: 'Scheduled',
        filterRenderer: SingleSelectFilter
    }, {
        key: 'visitor_name',
        name: 'Visitor Name',
        filterRenderer: SingleSelectFilter
    }, {
        key: 'host_name',
        name: 'Host',
        filterRenderer: SingleSelectFilter
    }, {
        key: 'host_company',
        name: 'Host Company',
        filterRenderer: SingleSelectFilter
    }
].map(c => ({ ...c, ...defaultColumnProperties }));

const handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
    } else {
        delete newFilters[filter.column.key];
    }
    return newFilters;
};

const useStyles = makeStyles(theme => ({

    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        color: '#000'
    },
    row: {
        width: '99%',
        border: '1px solid #c3c3c3',
        margin: '4px',
        borderRadius: '3px'
    },
    cellItem: {
        width: '25%',
        display: 'inline-block',
        marginBottom: '4px'
    },
    appBar: {
        backgroundColor: '#000'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }, margin: {
        margin: theme.spacing(1),
    },
    dark: {
        backgroundColor: '#000'
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
        width: '100%'
    },
}));
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
const dayOfWeekSearch = (rows, filterTerm) => {
    let selectedRows = [];
    if (!rows.map) {
        return selectedRows;
    }
    rows.forEach(r => {
        if (moment(r['visit_date']).format('dddd') === filterTerm) {
            selectedRows.push({ ...r, visit_date: moment(r['visit_date']).format('hh:mm a'), day_of_week: moment(r['visit_date']).format('dddd') });
        }
    });
    return selectedRows;
}
const fuzzySearch = (rows, filterTerm) => {
    let selectedRows = [];
    if (!rows.map) {
        return selectedRows;
    }
    rows.forEach(r => {
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
const day_of_week = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]
export default function VisitorDirectory(props) {
    const classes = useStyles();

    const [filter, setFilter] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDay, setSearchDay] = useState('');
    let filteredRows = searchTerm ? fuzzySearch(props.data, searchTerm) : searchDay ? dayOfWeekSearch(props.data, searchDay) : getRows(props.data, filter);
    const handleDaySearch = ({ target }) => {
        setSearchDay(target.value);
    }
    const handleSearch = ({ target }) => {
        setSearchTerm(target.value);
    }
    [].slice.call(filteredRows).sort(function (a, b) {
        if (moment(a.visit_date).isBefore(moment(b.visit_date))) {
            return -1;
        } else {
            return 1;
        }
    });
    return <>
        <Grid container>
            <AppBar position="static" className={classes.dark}>
                <Toolbar variant="dense">
                    <Typography variant="h5" className={classes.title}>
                        Company Name
                </Typography>
                </Toolbar>
            </AppBar>


            <Grid item xs={2}>

            </Grid>
            <Grid item xs={10}>
                <Grid container>
                    <Grid item xs={10}>
                        <Paper className={classes.paper}>
                            <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
                            <Input className={classes.row} type="text" onChange={handleSearch} value={searchTerm} placeholder="Search People"
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={classes.paper} >
                            <Select className={classes.selectEmpty} value={searchDay} onChange={handleDaySearch} placeholder="Select Day">
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {day_of_week.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                            </Select>
                        </Paper>
                    </Grid>
                </Grid>
                <ReactDataGrid
                    cellAutoFocusEnabled={false}
                    enableCellSelect={false}
                    columns={columns}
                    rowRenderer={RowRenderer}
                    toolbar={<Toolbar enableFilter={true} />}
                    rowGetter={i => filteredRows[i]}
                    rowsCount={props.rowsCount}
                    onAddFilter={filter => setFilter(handleFilterChange(filter))}
                    onClearFilters={() => setFilter({})}
                    rowHeight={46}
                    headerRowHeight={46}
                    minHeight={520}
                    getValidFilterValues={columnKey => getValidFilterValues(props.data, columnKey)}
                /></Grid></Grid></>;
}