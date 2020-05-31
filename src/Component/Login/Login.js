import firebase from 'firebase'
import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter,Link} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import './Login.css'
import {AppString} from './../Const'
import './home.css'
import Header from '../Header/Header'
import {Button, Modal} from 'react-bootstrap'


class Login extends Component {
    constructor(props) {
        super(props)
        this.provider = new firebase.auth.GoogleAuthProvider()
        this.state = {
            isLoading: true,
            show:null
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(id) {
        this.setState({show: id});
      }
    
      handleShow(id) {
        this.setState({show: id});
      }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (localStorage.getItem(AppString.ID)) {
            this.setState({isLoading: false}, () => {
                this.setState({isLoading: false})
                this.props.showToast(1, 'Login success')
                this.props.history.push('/main')
            })
        } else {
            this.setState({isLoading: false})
        }
    }

    onLoginPress = () => {
        this.setState({isLoading: true})
        myFirebase
            .auth()
            .signInWithPopup(this.provider)
            .then(async result => {
                let user = result.user
                if (user) {
                    const result = await myFirestore
                        .collection(AppString.NODE_USERS)
                        .where(AppString.ID, '==', user.uid)
                        .get()

                    if (result.docs.length === 0) {
                        // Set new data since this is a new user
                        myFirestore
                            .collection('users')
                            .doc(user.uid)
                            .set({
                                id: user.uid,
                                nickname: user.displayName,
                                aboutMe: '',
                                photoUrl: user.photoURL
                            })
                            .then(data => {
                                // Write user info to local
                                localStorage.setItem(AppString.ID, user.uid)
                                localStorage.setItem(AppString.NICKNAME, user.displayName)
                                localStorage.setItem(AppString.PHOTO_URL, user.photoURL)
                                this.setState({isLoading: false}, () => {
                                    this.props.showToast(1, 'Login success')
                                    this.props.history.push('/main')
                                })
                            })
                    } else {
                        // Write user info to local
                        localStorage.setItem(AppString.ID, result.docs[0].data().id)
                        localStorage.setItem(
                            AppString.NICKNAME,
                            result.docs[0].data().nickname
                        )
                        localStorage.setItem(
                            AppString.PHOTO_URL,
                            result.docs[0].data().photoUrl
                        )
                        localStorage.setItem(
                            AppString.ABOUT_ME,
                            result.docs[0].data().aboutMe
                        )
                        this.setState({isLoading: false}, () => {
                            this.props.showToast(1, 'Login success')
                            this.props.history.push('/main')
                        })
                    }
                } else {
                    this.props.showToast(0, 'User info not available')
                }
            })
            .catch(err => {
                this.props.showToast(0, err.message)
                this.setState({isLoading: false})
            })
    }
    
// handleModal(){
//     this.setState({
//         show:!this.state.show
//     })
// }



    render() {
      
        return (
            <div className="viewRoot">
               <header className="header-login-signup">
                    <div className="header-limiter">
                        <h1><a href="/">Web<span>Chat</span></a></h1>
                        <ul>                            
                            <li><Link type="submit" onClick={this.onLoginPress}>Sign In </Link></li>
                        </ul>
                        {/* <ul>                            
                            <li><Link onClick={() => this.handleShow('here')} >Login </Link></li>
                        </ul> */}
                    </div>
             </header>
            
                {/* <div>          
                <Modal show={this.state.show === 'here'} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title text="center">Sign In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    class="form-control" 
                                 />                               
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    class="form-control" 
                                 />
                            </div>
                            <div className="text-center">
                            <button type="submit" align="center" class="btn btn-primary width-100">Sign In</button>
                            </div>
                            <h5 className="text-center">OR</h5>
                            <div className="text-center">
                            <button type="submit" align="center" class="btn btn-danger" onClick={this.onLoginPress}> SIGN IN WITH GOOGLE</button>
                            </div>
                            <div className="text-center">
                                <p>Don't have an account ? <Link onClick={() => this.handleShow('here')}> click here</Link> to Sign up.</p>
                            </div>
                            
                        </form>
                    </Modal.Body>                    
                </Modal>       

                  <Modal show={this.state.show === 'click'} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title text="center">Sign Up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    class="form-control" 
                                 />                               
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    class="form-control" 
                                 />
                            </div>
                            <div className="text-center">
                            <button type="submit" align="center" class="btn btn-primary width-100">Sign In</button>
                            </div>
                            <h5 className="text-center">OR</h5>
                            <div className="text-center">
                            <button type="submit" align="center" class="btn btn-danger" onClick={this.onLoginPress}> SIGN IN WITH GOOGLE</button>
                            </div>
                            <div className="text-center">
                                <p>Don't have an account ? <Link> click here</Link> to Sign up.</p>
                            </div>
                            
                        </form>
                    </Modal.Body>                    
                </Modal>        
                </div> */}
               
                <div className="splash-container">
                            <div className="splash">
                               
                                <h1 className="splash-head">Web Chat App</h1>
                                <p className="splash-subhead">Lets talk with our loved ones</p>
                                <div id="custom-button-wrapper">
                                    <Link  type="submit" onClick={this.onLoginPress}>
                                        <a className="my-super-cool-btn">
                                            <div className="dot-container">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <span className="buttoncooltext">Get <br></br>Started</span>
                                        </a>
                                    </Link>
                                </div>
                            </div>                
                        </div>
                {/* <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
                    SIGN IN WITH GOOGLE
                            </button>
                             */}

                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}

               
            </div>
        )
    }
}

export default withRouter(Login)
