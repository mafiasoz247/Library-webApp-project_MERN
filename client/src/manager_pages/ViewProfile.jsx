import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditOutlined from '@material-ui/icons/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import Notification from '../Admin_Components/Notifications.js';
import axios from 'axios';
import { getToken } from '../Utils/Common';
import Input from '../Admin_Components/Input.js';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const ViewProfile = (props) => {

    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [Name, setName] = React.useState(JSON.parse(sessionStorage.getItem('user')).Name);
    const [Email, setEmail] = React.useState(JSON.parse(sessionStorage.getItem('user')).Email);
    const [OldPassword, setOldPassword] = React.useState();
    const [NewPassword, setNewPassword] = React.useState();
    const [CPassword, setCPassword] = React.useState();
    const [Address, setAddress] = React.useState(JSON.parse(sessionStorage.getItem('user')).Address);
    const [Phone, setPhone] = React.useState(JSON.parse(sessionStorage.getItem('user')).Contact);
    const [Type,setType] = React.useState(JSON.parse(sessionStorage.getItem('user')).Type);
    
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    //console.log(Phone);

    const checkmngr = async () => {
        
        return (Type==1 ? true : false)

        
    };

    const checkcustomer = async() => {
        return (Type==2 ? true : false)
    }
    const handleClickOpen = async () => {
        
        // let config = {
        //     headers: {
        //         Authorization: "basic " + token
        //     },
            
        //     book : Book_ID
        // }
        // await axios.patch('http://localhost:4000/users/getOneBookLibrary', config, {
        // headers: {
        //     Authorization: "basic " + token
        // },
        
        // book : Book_ID
        // }).then(async response => {
        //     setCurrentBook(response.data.data.result.data);
        //     sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data));
        //     // setAuthor(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Author);
        //     // setPrice(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Price);
        //     // setDescription(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Description);
        //     // setCategoryID(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Category_ID);
        //     // setQuantity(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Quantity);
        //     // setISBN(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].ISBN);
        //     // setTitle(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Title);
        //     // setBookImage(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Book_Image)
           
        //     setLoading(false);
        //     //window.location.assign('/manager/Books');
            
        // }).catch(error => {
      
        // });

        // setOpen(true);
    };

    const handleClickEdit = async () => {
        
        // let config = {
        //     headers: {
        //         Authorization: "basic " + token
        //     },
            
        //     Book_ID : Book_ID,
        //     title:Title,
        //     ISBN:ISBN,
        //     description:Description,
        //     quantity:Quantity
        // }
        // await axios.patch('http://localhost:4000/users/updateBook', config, {
        // headers: {
        //     Authorization: "basic " + token
        // },
        
        // Book_ID : Book_ID,
        // title:Title,
        // ISBN:ISBN,
        // description:Description,
        // quantity:Quantity

        // }).then(async response => {
            
        //     setLoading(false);
        //     setNotify({
        //         isOpen: true,
        //         message: "Book edited successfully",
        //         type: 'success'
        //     })
        //     setOpen(false);
        //     setTimeout(function () {
        //         window.location.reload(false);
        //     }, 500);
        //     //window.location.assign('/manager/Books');
            
        // }).catch(error => {
        //     setLoading(false);
        //     if (error.response.status === 500) {
        //         //setError(error.response.data.data.message || "Enter a valid email");
        //         setNotify({
        //             isOpen: true,
        //             message: error.response.data.data.message,
        //             type: 'error'
        //         })
        //         setError(error.response.data.data.message)
        //     }
        // });

        // setOpen(true);
    };
    const handleClose = () => {
        // setOpen(false);
        // setError(null);
    };


    const handleAdd = e => {
        // setCategory(e.target.value);
        // console.log(Category);
    }

    const handleChangeTitle = e => {
        // setTitle(e.target.value);
    }

    const handleChangeISBN = e => {
        // setISBN(e.target.value);
    }
    const handleChangeAuthor = e => {
        // setAuthor(e.target.value);
    }
    const handleChangeDescription = e => {
        // setDescription(e.target.value);
    }
    const handleChangeCategoryID = e => {
        // setCategoryID(e.target.value);
    }
    const handleChangeQuantity = e => {
        // setQuantity(e.target.value);
    }
    const handleChangePrice = e => {
        // setPrice(e.target.value);
    }

    const handleClick = async () => {
        // setLoading(true);

        // let config = {
        //     headers: {
        //         Authorization: "basic " + token
        //     },

        //     title: Title,
        //     description: Description,
        //     ISBN: ISBN,
        //     author: Author,
        //     category: CategoryID,
        //     quantity: Quantity,
        //     price: Price


        // }
        // await axios.post("http://localhost:4000/users/createBook", config, {
        //     headers: {
        //         Authorization: "basic " + token
        //     },

        //     title: Title,
        //     description: Description,
        //     ISBN: ISBN,
        //     author: Author,
        //     category: CategoryID,
        //     quantity: Quantity,
        //     price: Price



        // }).then(response => {
        //     //sessionStorage.setItem('Manager_ID', response.data.data.message.info2[0].User_ID);
        //     //window.location.assign("/admin/CreateLibrary");
        //     setLoading(false);
        //     setNotify({
        //         isOpen: true,
        //         message: "Book added successfully",
        //         type: 'success'
        //     })
        //     setOpen(false);
        //     setTimeout(function () {
        //         window.location.reload(false);
        //     }, 500);


        // }).catch(error => {
        //     // console.log("lol");
        //     setLoading(false);
        //     if (error.response.status === 500) {
        //         //setError(error.response.data.data.message || "Enter a valid email");
        //         setNotify({
        //             isOpen: true,
        //             message: error.response.data.data.message,
        //             type: 'error'
        //         })
        //         setError(error.response.data.data.message)
        //     }
        // })





    }

    return(
    <div>
        <Toolbar></Toolbar> 

       <h1 ><center> My Profile</center></h1>
        
        
        <Toolbar> <div className='profileimg'><img className='profileimg' src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg" ></img></div></Toolbar>
           <div className='Manager'> <Toolbar><h1>{checkmngr ? "Manager" : checkcustomer ? "Customer" : "" }</h1></Toolbar> </div>
        <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft:'39rem',
        marginTop:'-24rem',
        '& > :not(style)': {
          m: 1,
          width: 515,
          height:400,
        },
      }}
    >
      <Paper elevation={12} >
            <Toolbar>
            <div className='Titlee'>  <TextField id="outlined-search" label="Name" type="search"  InputLabelProps={{shrink: true, }} onChange={handleChangeTitle}value={Name} /></div>
                <div className='ISBNe'> <TextField disabled id="outlined-read-only-input" label="Email" defaultValue={Email} InputProps={{readOnly: true, }}helperText="*Not Changeable" /></div>
            </Toolbar>
            
            <nbsp></nbsp><nbsp></nbsp><nbsp></nbsp>
           
            <Toolbar>
            <div className='Address'>  <TextField  id="outlined-search" label="Address" type="search" defaultValue={Address} InputLabelProps={{shrink: true, }} InputProps={{readOnly: true, }} /> </div>
                <div className='Contact'> <TextField  id="outlined-read-only-input" label="Contact" type="search" InputLabelProps={{shrink: true, }}onChange={handleChangeDescription} value={Phone} />    </div>
                

            </Toolbar>
           
           
            <div className='CIDe'>
            <Toolbar>
                <TextField  id="outlined-search" label="Category_ID" type="search" defaultValue={Phone} InputLabelProps={{shrink: true, }} InputProps={{readOnly: true, }}helperText="*Not Changeable" />
                <div className='Quantitye'> <TextField id="outlined-search" label="Quantity" type="search" InputLabelProps={{shrink: true, }} onChange={handleChangeQuantity} value={Phone} /></div>
            </Toolbar>
            </div>
            
            <div className='Pricee'>
            <Toolbar>
                <TextField
                disabled
                    value={Phone}
                    id="outlined-number"
                    label="Price"
                    
                    type="number"
                    defaultValue={Phone} 
                    InputLabelProps={{shrink: true, }}
                    InputProps={{readOnly: true, }}
                    helperText="*Not Changeable"
                />
            </Toolbar>
            </div>
            </Paper>
            </Box>
        
       
   
    <Notification
        notify={notify}
        setNotify={setNotify} />
</div>
)
}



export default ViewProfile;