import bcrypt from 'bcrypt';

export const generateSalt = async ()=>{
    return await bcrypt.genSalt(); 
}

export const hashPassword = async (password: string,salt:string): Promise<string> => {
    const hashedPassword: string = await bcrypt.hash(password, salt); 
    return hashedPassword;
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash); 
};