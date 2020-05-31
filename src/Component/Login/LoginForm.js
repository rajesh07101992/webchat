import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './Signup.css';
import firebase from '../../Services/firebase';
import LoginString from '../Login/LoginStrings';

// material-ui
import cssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

//Bootstrap
import {Card} from 'react-bootstrap';

class Signup extends Component {

    constructor(){
        super();
        this.state={
            name:"",
            email:"",
            password:"",
            error:null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value
        });
    }

   async handleSubmit(event){
        const {name,email,password} = this.state;
        event.preventDefault();
        try{
            firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(async result =>{
                firebase.firestore().collection('users')
                .add({
                    id:result.user.uid,
                    name,
                    email,
                    password,
                    URL:'',
                    description:'',
                    messages:[{notificationId:"",number:0}]
                    })
                    .then((docRef)=>{
                        localStorage.setItem(LoginString.ID,result.user.uid);
                        localStorage.setItem(LoginString.Name,name);
                        localStorage.setItem(LoginString.Email,email);
                        localStorage.setItem(LoginString.Password,password);
                        localStorage.setItem(LoginString.PhotoURL,"");
                        localStorage.setItem(LoginString.UPLOAD_CHANGED,'state_changed');
                        localStorage.setItem(LoginString.Description,'');
                        localStorage.setItem(LoginString.FirebaseDocumentId,docRef.id);
                        this.setState({
                            name:'',
                            password:'',
                            url:''
                        });

                        this.props.history.push('/chat');
                    })
                    .catch((error)=>{
                        console.error("Error Adding Document", error)
                    })

                  })
        }
        catch(error){
                document.getElementById('1').innerHTML = "Error in sign up, please try again"
        }
    }


    render() {

        const signinsee = {
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            color:'white',
            backgroundColor:'#1ebea5',
            width:'100%',
            boxShadow:'0 5px 5px #808888',
            height:'10rem',
            paddingTop:'48px',
            opacity:'0.5',
            borderBottom:'5px solid green'
        }

        return (
            <div>
                <cssBaseline/>
                <Card style={signinsee}>
                  <div>
                    <Typography component="h1" variant="h5">
                            Sign Up to 
                    </Typography>
                  </div>
                  <div>
                      <Link to="/">
                      <button className="btn"><i class="fa fa-home"></i>Web Chat</button>
                      </Link>
                  </div>
                </Card>
                <Card className="formacontrooutside">
                    <form className="customform" noValidate onSubmit={this.handleSubmit}>

                    <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Enter Your Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.name}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                       
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="current-password"
                            type="password"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.password}
                        />

                         <div>
                            <p style={{color:'grey',fontSize:'15px',marginLeft:'0px'}}>Password should be greater than 6 character</p>
                        </div>

                        <div className="CenterAligningItems">
                            <button className="button1" type="submit">
                                <span>Sign Up</span>
                            </button>
                        </div>

                        <div>
                            <p style={{color:'grey'}}>Already have an account ?</p>
                            <Link to="/login">Log In</Link>
                        </div>

                        <div className="error"> 
                            <p id='1' style={{colr:'red'}}></p>
                        </div>
                    </form>
                </Card>
            </div>
        );
    }
}

export default Signup;