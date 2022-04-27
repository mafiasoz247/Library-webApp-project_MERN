import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination} from "@material-ui/core";
import React, {useState} from "react";


const useStyles = makeStyles(theme => ({
    table: {
       // marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '500',
            color: '#fff',
            backgroundColor: '#4776EE',
            opacity: '85%',
        },
        '& tbody td': {
            fontWeight: '500',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
    },
}))

export default function useTable(libraries, headCells) {
    const classes = useStyles();
    const pages = [5, 10, 15]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const TblContainer = props => (
        <Table className={classes.table}>
            {props.children}
        </Table>
    )
    const TblHead = props => {
        return (
            <TableHead>
                <TableRow>
                    {
                        headCells.map(headCell => (
                            <TableCell key={headCell.id}>
                                {headCell.label}
                            </TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
        )
    }
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0);
    }

    const TblPagination = () => (<TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={libraries.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        
    />)

    const recordsAfterPagingAndSorting = () => {
        return libraries.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }

    return {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}