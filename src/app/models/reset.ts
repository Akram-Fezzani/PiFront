export class Reset{
    password: string;
    confirmpassword: string;
    
    constructor(password:string, confirmpassword: string){
    this.password=password;
    this.confirmpassword=confirmpassword;
    }
    }