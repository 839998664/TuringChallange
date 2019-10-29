import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadVisitors } from "../redux/actions/visitorActions";
import VisitorDirectory from "./VisitorDirectory";
import { Filters } from "react-data-grid-addons";

const {
    SingleSelectFilter
} = Filters;

function VisitorDirectoryPage({ loadVisitors, visitorsState }) {
    const defaultColumnProperties = {
        filterable: true,
        width: 320
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
    ].map(c => ({ ...c, ...defaultColumnProperties }))
    const getData = (rows) => {
        loadVisitors(rows).catch(err => console.log(err));
    }
    useEffect(() => {
        getData(10000);
    }, []);
    return <>
        <VisitorDirectory data={visitorsState} columns={columns} rowsCount={10000} />
    </>;
}

const matchStateToProps = (state) => {
    return {
        visitorsState: state.visitorsReducer
    }
}
const matchDispatchToProps = {
    loadVisitors
}

export default connect(matchStateToProps, matchDispatchToProps)(VisitorDirectoryPage);
