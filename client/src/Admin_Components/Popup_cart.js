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
import Notification from './Notifications';
import axios from 'axios';
import { getToken } from '../Utils/Common';
import Input from './Input';
import { InputAdornment } from '@mui/material';
import { Toolbar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import BasicSelect from './BasicSelect';
import { makeStyles } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import EditOutlined from '@material-ui/icons/EditOutlined';


const useStyles = makeStyles(theme => ({
   
    
    
    button: {
        backgroundColor: "#FFFFFF",
        background: "#ffffff",
        marginLeft: "-20rem",
       
        
    },
     
}))
export default function ResponsiveDialog3(props) {
    const [open, setOpen] = React.useState(false);
    const [notify, setNotify] = React.useState({ isOpen: false, message: '', type: '' });
    const [loading, setLoading] = React.useState(false);
    const [Period, setPeriod] = React.useState("");
    const [error, setError] = React.useState("");
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [Title, setTitle] = React.useState();
    const [Author, setAuthor] = React.useState();
    const [CategoryID, setCategoryID] = React.useState();
    const [Description, setDescription] = React.useState();
    const [ISBN, setISBN] = React.useState();
    const [Quantity, setQuantity] = React.useState();
    const [Price, setPrice] = React.useState();
    const [BookImage, setBookImage] = React.useState();
    const [cart, setCart] = React.useState(JSON.parse(sessionStorage.getItem('cart')));
    const [CurrentBook, setCurrentBook] = React.useState(JSON.parse(sessionStorage.getItem('CurrentBook')));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const token = getToken();
    const Book_ID = props.Book_ID;
    const classes = useStyles();
   
    // console.table(CurrentBook);
    //const request = props.request;
    //const Flag = props.flag;
    //console.log(request);
    //console.log(Library);

    // JSON.parse(sessionStorage.getItem('CurrentBook'))
    // CurrentBook.Title
    // CurrentBook.Author
    // CurrentBook.CategoryID
    // CurrentBook.Description
    // CurrentBook.ISBN
    // CurrentBook.Quantity
    // CurrentBook.Price

    React.useEffect(() => {
        // for (let i = 1 ; i < CurrentBook[0].Quantity; i++){
        //     quantity[i-1] = i;
        // }
    //     const fetchBook = async () => {
    //         setLoading(true);
    //         let config = {
    //             headers: {
    //                 Authorization: "basic " + token
    //             },
    //             book: 1,
                
    //         }
    //         await axios.get('http://localhost:4000/users/getOneBookLibrary', config, {
    //             headers: {
    //                 Authorization: "basic " + token
    //             },
    //             book: 1,
    //         }).then(async response => {
    //             setCurrentBook(response.data.data.result.data);
    //             sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data));
    //             setLoading(false);
    //             //window.location.assign('/manager/Books');
                
    //         }).catch(error => {
          
    //         });
    
          
    //       };

    //     fetchBook();
    }, []);

    const handleClickOpen = async () => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            
            book : Book_ID
        }
        await axios.patch('http://localhost:4000/users/getOneBookLibrary', config, {
        headers: {
            Authorization: "basic " + token
        },
        
        book : Book_ID
        }).then(async response => {
            setCurrentBook(response.data.data.result.data);
            sessionStorage.setItem('CurrentBook', JSON.stringify(response.data.data.result.data));
            setAuthor(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Author);
            setPrice(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Price);
            setDescription(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Description);
            setCategoryID(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Category_ID);
            setQuantity(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Quantity);
            setISBN(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].ISBN);
            setTitle(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Title);
            setBookImage(JSON.parse(sessionStorage.getItem('CurrentBook'))[0].Book_Image)
           
            setLoading(false);
            //window.location.assign('/manager/Books');
            
        }).catch(error => {
      
        });

        setOpen(true);
    };

    const handleClickEdit = async () => {
        
        let config = {
            headers: {
                Authorization: "basic " + token
            },
            
            Book_ID : Book_ID,
            title:Title,
            ISBN:ISBN,
            description:Description,
            quantity:Quantity
        }
        await axios.patch('http://localhost:4000/users/updateBook', config, {
        headers: {
            Authorization: "basic " + token
        },
        
        Book_ID : Book_ID,
        title:Title,
        ISBN:ISBN,
        description:Description,
        quantity:Quantity

        }).then(async response => {
            
            setLoading(false);
            setNotify({
                isOpen: true,
                message: "Book edited successfully",
                type: 'success'
            })
            setOpen(false);
            setTimeout(function () {
                window.location.reload(false);
            }, 500);
            //window.location.assign('/manager/Books');
            
        }).catch(error => {
            setLoading(false);
            if (error.response.status === 500) {
                //setError(error.response.data.data.message || "Enter a valid email");
                setNotify({
                    isOpen: true,
                    message: error.response.data.data.message,
                    type: 'error'
                })
                setError(error.response.data.data.message)
            }
        });

        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleChangeQuantity = e => {
        setQuantity(e.target.value);
    }
    const handleChangePeriod = e => {
        setPeriod(e.target.value);
    }
    const handleChangePrice = e => {
        setPrice(e.target.value);
    }
    const getQuantity = () => {
        return CurrentBook[0].Quantity
    }
    const handleClickAdd = async () => {
        setLoading(true);
    
       await setCart(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('cart'))));
       console.log(cart);
       await setCurrentBook(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('CurrentBook'))));
       cart.push({ Book_ID : CurrentBook[0].Book_ID , quantity: Quantity, period: Period});
       sessionStorage.setItem("cart",JSON.stringify(cart));
        setOpen(false);
        setNotify({
            isOpen: true,
            message: "Added to cart successfully",
            type: 'success'
        })
        setTimeout(function () {
            window.location.reload(false);
        }, 1000)
    }


    return (
        <div>

            <Button className={classes.button} variant="outlined" onClick={handleClickOpen} style={{
          maxWidth: "200px",
          maxHeight: "50px",
          minWidth: "200px",
          minHeight: "50px"
        }}>
                Add to Cart          </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Add To Cart"}
                </DialogTitle>
                <DialogContent>
                
                
                    
                    
        
                    
                 <br/>
                   
                    <div className='CIDe'>
                    <Toolbar>
                    <TextField id="outlined-search" label="Period" placeholder='Months' type="number" InputLabelProps={{shrink: true, }} onChange={handleChangePeriod} value={Period} />
                        <div className='cquantity'> <TextField id="outlined-search" label="Quantity" type="number" InputLabelProps={{shrink: true, }} onChange={handleChangeQuantity} value={Quantity} /></div>
                    </Toolbar>
                    </div>
                    
                    <div className='Pricee'>
                    
                    </div>
                    {error && <><h5 style={{ color: 'red' }}>{error}</h5></>}
                </DialogContent>
                <DialogActions>

                    <Button autoFocus color='error' onClick={handleClose} > Close </Button>
                    {Quantity && Period ? <Button autoFocus onClick={handleClickAdd} > Add </Button> : <Button disabled autoFocus onClick={handleClickAdd} > Add </Button> }
                    


                </DialogActions>
            </Dialog>
            <Notification
                notify={notify}
                setNotify={setNotify} />
        </div>
    );
}
