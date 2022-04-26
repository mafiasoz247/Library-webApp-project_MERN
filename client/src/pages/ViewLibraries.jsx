import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../Utils/Common";
import Libraries from '../Components/Libraries';
import Pagination from '../Components/Pagination';
import useTable from '../Components/useTable';
import ActionButton from '../Components/ActionButton';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ResponsiveDialog from '../Components/Popup';
import EmployeeForm from '../Components/form';
//import UpdateIcon from '@mui/icons-material/Update';


const headCells = [
    {id:'Library_ID', label: 'Library ID'},
    {id:'Name', label: 'Name'},
    {id:'Manager_ID', label: 'Manager ID'},
    {id:'Manager_Name', label: 'Manager Name'},
    {id:'Block_Flag', label: 'Blocked'},
    {id:'actions', label: 'Update'}

]
const ViewLibraries = (props) => {
    const [libraries, setLibraries] = useState(JSON.parse(sessionStorage.getItem('libraries')));
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
            await axios.get('http://localhost:4000/users/getLibraries', config, {
            }).then(async response => {
                setLibraries(response.data.data.message.libraries);
                sessionStorage.setItem('libraries', JSON.stringify(response.data.data.message.libraries));
                console.log(libraries);
                setLoading(false);
            }).catch(error => {

            });

        };

        fetchPosts();
    }, []);

    // Get current posts
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = libraries.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    // const paginate = pageNumber => setCurrentPage(pageNumber);
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(libraries, headCells);
    // const openInPopup = item => {
    //     setRecordForEdit(item)
    //     setOpenPopup(true)
    // }
    return (
        <div>
            <div className='container mt-5'>
                <h1 className='text-primary mb-3'>Libraries</h1><br></br>
                {/* <Libraries l={currentItems} loading={loading} />
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={libraries.length}
                    paginate={paginate}
                /> */}
            

            <TblContainer>
                <TblHead />
                <TableBody>
                    {recordsAfterPagingAndSorting().map(item => (
                        <TableRow key={item.Library_ID}>
                            <TableCell> {item.Library_ID} </TableCell>
                            <TableCell> {item.Name} </TableCell>
                            <TableCell> {item.Manager_ID} </TableCell>
                            <TableCell> {item.Manager_Name} </TableCell>
                            <TableCell> {item.Block_Flag} </TableCell>
                            <TableCell> 
                            <ResponsiveDialog 
                                library = {item.Library_ID}>
                                    <EditOutlinedIcon fontSize="small" /> 
                            </ResponsiveDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TblContainer>
            <br />
            <TblPagination />
            
            {/* // openPopup ={openPopup}
            // setOpenPopup ={setOpenPopup}
            // title="Update Block flag"
            // children = "set your flag"
             */}
            {/* <EmployeeForm /> */}
            
            </div>
        </div>
    )
}

export default ViewLibraries;
