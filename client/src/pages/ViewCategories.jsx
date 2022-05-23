import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../Utils/Common";
import Libraries from '../Components/Libraries';
import Pagination from '../Components/Pagination';
import useTableR from '../Components/useTableR';
import ActionButton from '../Components/ActionButton';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import CheckIcon from '@mui/icons-material/Check';
import ResponsiveDialog from '../Components/Popup_4';
import EmployeeForm from '../Components/form';
//import UpdateIcon from '@mui/icons-material/Update';


const headCells = [
    {id:'Category_ID', label: 'Category ID'},
    {id:'Name', label: 'Name'}

]
const ViewCategories = (props) => {
    const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);
    const [recordForEdit,setRecordForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false)
    const token = getToken();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getCategory', config, {
            }).then(async response => {
                setCategories(response.data.data.message.Categories);
                sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
                console.table(response.data.data.message.Categories)
                setLoading(false);
               // window.location.assign('/admin/Requests');
            }).catch(error => {

            });

        };

        fetchPosts();
    }, []);

    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTableR(Categories, headCells);
    
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Categories</h1>
            <div className='cp'><ResponsiveDialog fullWidth='true' maxWidth='xl'></ResponsiveDialog></div>
            
                
                
            <nbsp></nbsp>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Category_ID}>
                            <TableCell> {item.Category_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                           
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

export default ViewCategories;
