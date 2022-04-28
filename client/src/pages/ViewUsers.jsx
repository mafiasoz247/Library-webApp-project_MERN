import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../Utils/Common";
import Libraries from '../Components/Libraries';
import Pagination from '../Components/Pagination';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import useTableU from '../Components/useTableU';
import ResponsiveDialog from '../Components/Popup_2';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';


const headCells = [
    {id:'User_ID', label: 'User ID'},
    {id:'Name', label: 'Name'},
    {id:'Email', label: 'Email'},
    {id:'Address', label: 'Address'},
    {id:'Contact', label: 'Contact'},
    {id:'Delete_Flag', label: 'Blocked'},
    {id:'actions', label: 'Update'},

]
const ViewUsers = (props) => {
    const [Users, setUsers] = useState(JSON.parse(sessionStorage.getItem('Users')));
    const [loading, setLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage] = useState(1);
    const token = getToken();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getUsers', config, {
            }).then(async response => {
                setUsers(response.data.data.message.Customers);
                sessionStorage.setItem('Users', JSON.stringify(response.data.data.message.Customers));
                //console.log(libraries);
                setLoading(false);
            }).catch(error => {

            });

        };

        fetchUsers();
    }, []);

    // Get current posts
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = Users.slice(indexOfFirstItem, indexOfLastItem);

//     Change page
//     const paginate = pageNumber => setCurrentPage(pageNumber);
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTableU(Users, headCells);
    return (
        <div>
            <div className='container mt-5'>
                <h1 className='text-primary mb-3'>Users</h1> <br></br>
  
            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.User_ID}>
                            <TableCell> {item.User_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                            <TableCell> {item.Email} </TableCell>
                            <TableCell> {item.Address} </TableCell>
                            <TableCell> {item.Contact} </TableCell>
                            <TableCell> {item.Delete_Flag == '1' ? "Yes" : "No"} </TableCell>
                            <TableCell> 
                            <ResponsiveDialog 
                                user = {item.User_ID}
                                flag = {item.Delete_Flag}>
                                    <EditOutlinedIcon fontSize="small" /> 
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

export default ViewUsers;
