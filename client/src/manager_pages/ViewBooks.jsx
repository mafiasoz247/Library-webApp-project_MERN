import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell,Toolbar,InputAdornment } from '@material-ui/core';
import ResponsiveDialog from '../Components/Popup_4';
import { Search } from '@material-ui/icons';
import Input from '../Components/Input';


const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '50%',
        marginLeft: '10px',
        marginBottom: "20px"
    }
}))

const headCells = [
    {id:'Book_ID', label: 'Book ID'},
    {id:'Title', label: 'Title'},
    {id:'Category_ID', label: 'Category ID'},
    {id:'Price', label: 'Price'},
    {id:'Quantity', label: 'Quantity'},
    {id:'Delete_Flag', label: 'Delete flag'}

]
const ViewBooks = (props) => {
    const [Books, setBooks] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getBooksLibrary', config, {
            }).then(async response => {
                setBooks(response.data.data.result.data);
                sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
                setLoading(false);
                //window.location.assign('/manager/Books');
                
            }).catch(error => {
          
            });
          
          };

        fetchBooks();
    }, []);

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(Books, headCells, filterFn);
    
    const handleSearch = e => {
        let target = e.target;
        
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.Title.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Books</h1>
            <div className='cp'><ResponsiveDialog fullWidth='true'></ResponsiveDialog></div>
            <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Book Name"
                    InputProps={{
                        startAdornment: (<InputAdornment position='start'>
                            <Search />
                            </InputAdornment>)
                    }}
                    onChange={handleSearch}
                    /></div>
                </Toolbar>
                
                
            <nbsp></nbsp>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Book_ID}>
                            <TableCell> {item.Book_ID} </TableCell>
                            <TableCell> {item.Title} </TableCell>
                            <TableCell> {item.Category_ID} </TableCell>
                            <TableCell> {item.Price} </TableCell>
                            <TableCell> {item.Quantity} </TableCell>
                            <TableCell> {item.Delete_Flag} </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TblContainer>
            <br />
            <TblPagination />            
            </div>
        </div>
    )
}

export default ViewBooks;
