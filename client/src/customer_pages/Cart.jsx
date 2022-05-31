import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import {getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles,TableBody, TableRow, TableCell } from '@material-ui/core';
import CheckIcon from '@mui/icons-material/Check';
import ResponsiveDialog from '../Admin_Components/Popup_3';
import { Toolbar,InputAdornment } from '@material-ui/core';
import Input from '../Admin_Components/Input';
import { Search } from '@material-ui/icons';

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
    { id: 'Book_ID', label: 'Book ID' },
    { id: 'Book_Image', label: 'Book' },
    { id: 'Title', label: 'Name' },
    { id: 'Price', label: 'Price' },
    { id: 'Quantity', label: 'Quantity' },
    { id: 'Line_Total', label: 'Line Total' },
    { id: 'actions', label: 'Remove' }
    
]

const Cart = (props) => {
    
    const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')));
    const [cartDetails, setCartDetails] = useState("");

    const [loading, setLoading] = useState(false);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    //const [records,setRecords] = useState(requests)
    const classes = useStyles();
    const token = getToken();

    var arrayLength = cart.length;
    console.log(Cart.length)

    for (var i = 0; i < arrayLength; i++) { 
        console.log(cart[i]);
        //Do something
    }   

    const confirmOrder = async () => {
        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            //books: books
        }
        await axios.post('http://localhost:4000/users/order', config, {
            headers: {
                Authorization: "basic " + token
            },

            //books: books 

        }).then(async response => {

            // Order Placed Succusfully Notification & then Home Page

        }).catch(error => {

        });

    }
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

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(cart, headCells, filterFn);

    return (
        <div>
            <div className='container mt-5'>

                <div className='oopar'><h1 className='text-primary mb-3'>My Cart</h1></div>

                
                <Toolbar>
                    <div className='inp'><Input
                    className={classes.searchInput} 
                    placeholder = "Search Title"
                    InputProps={{
                        startAdornment: (<InputAdornment position='start'>
                            <Search />
                            </InputAdornment>)
                    }}
                    onChange={handleSearch}
                    /></div>
                </Toolbar>
                           
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(item => (
                            <TableRow key={item.Book_ID}>
                                <TableCell> {item.Book_ID} </TableCell>
                                <TableCell> {item.Title} </TableCell>
                                <TableCell> {item.Price} </TableCell>
                                {/* <TableCell> {books.Quantity} </TableCell>
                                <TableCell> {books.Line_Total} </TableCell> */}
                                <TableCell>
                                    <ResponsiveDialog
                                    // hmm how to deal with this

                                    
                                    >
                                        <CheckIcon fontSize="small" />
                                    </ResponsiveDialog>
                                </TableCell>
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

export default Cart;
