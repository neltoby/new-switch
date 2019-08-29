let Client = {
isLoggedIn: () => {if(localStorage.username) {return true}else{return false} }, 
loggedOut: () => {localStorage.removeItem('username')}
}

export default Client