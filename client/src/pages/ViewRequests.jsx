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
import ResponsiveDialog from '../Components/Popup_3';
import EmployeeForm from '../Components/form';
//import UpdateIcon from '@mui/icons-material/Update';


const headCells = [
    {id:'Query_ID', label: 'Query ID'},
    {id:'Name', label: 'Name'},
    {id:'Email', label: 'Email'},
    {id:'Subject', label: 'Subject'},
    {id:'Description', label: 'Description'},
    {id:'actions', label: 'Complete'}

]
const ViewRequests = (props) => {
    const [requests, setRequests] = useState(JSON.parse(sessionStorage.getItem('requests')));
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
            await axios.get('http://localhost:4000/users/getQueriesManager', config, {
            }).then(async response => {
                setRequests(response.data.data.message.Queries);
                sessionStorage.setItem('requests', JSON.stringify(response.data.data.message.Queries));
                console.table(response.data.data.message.Queries)
                setLoading(false);
               // window.location.assign('/admin/Requests');
            }).catch(error => {

            });

        };

        fetchPosts();

        
    }, []);
        const handleCategories = async () => {


    }
    
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTableR(requests, headCells);
    
    return (
        <div>
            <div className='container mt-5'>

            <h1 className='text-primary mb-3'>Requests</h1>
            <div className='sp'><Button variant="outlined"onClick={handleCategories()} size="large" disableElevation>
            Create Category
            </Button></div>
            
                
                
            <nbsp></nbsp>
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Query_ID}>
                            <TableCell> {item.Query_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                            <TableCell> {item.Email} </TableCell>
                            <TableCell> {item.Subject} </TableCell>
                            <TableCell> {item.Description} </TableCell>
                            <TableCell> 
                            <ResponsiveDialog 
                                request = {item.Query_ID}
                                flag = {item.Viewed_Flag}
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

export default ViewRequests;
