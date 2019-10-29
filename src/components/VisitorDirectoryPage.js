import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadVisitors } from "../redux/actions/visitorActions";
import VisitorDirectory from "./VisitorDirectory";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Modal } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));
function rand() {
    return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


function VisitorDirectoryPage({ loadVisitors, visitorsState }) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [display, setDisplay] = useState(false);
    const getData = (rows) => {
        loadVisitors(rows).then(response => setDisplay(false)).catch(err => console.log(err));
    }
    useEffect(() => {
        setDisplay(true);
        getData(500);
    }, []);
    return <><Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={display}
    >
        <div style={modalStyle} className={classes.paper}>
            <CircularProgress style={{ 'display': display }} />
        </div>
    </Modal>

        <VisitorDirectory data={visitorsState} rowsCount={500} />
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
