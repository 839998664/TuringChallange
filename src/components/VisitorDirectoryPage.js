import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadVisitors } from "../redux/actions/visitorActions";
import VisitorDirectory from "./VisitorDirectory";

function VisitorDirectoryPage({ loadVisitors, visitorsState }) {

    const getData = (rows) => {
        loadVisitors(rows).catch(err => console.log(err));
    }
    useEffect(() => {
        getData(10000);
    }, []);
    return <>
        <VisitorDirectory data={visitorsState} rowsCount={10000} />
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
