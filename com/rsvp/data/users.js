const mongoCollections = require("./mongoCollections");
const connection = require("./mongoConnection");
const users = mongoCollections.users;
const ObjectID = require('mongodb').ObjectID;
// const bcrypt = require("bcrypt");
const saltRounds = 5;

async function getUser(id){
    if(id === undefined){
        throw 'input is empty';
    }
    if(id != ObjectID){
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in data/users.getbyid)'
        }
    }

    const userCollections = await users();
    const target = await userCollections.findOne({ _id: id });
    if(target === null) return undefined;

    return target;
}

async function addUser(userJson){
    const userCollections = await users();
    // const hashpassword = await bcrypt.hash(userJson.password, saltRounds);
    let newUser = {
        email: userJson.email,
        gender: userJson.gender,
        dob: userJson.dob,
        fname: userJson.fname,
        lname: userJson.lname,
        // password: hashpassword
    };

    let email = userJson.email
    // const check = await userCollections.findOne({ email: email });
    // if(check != undefined ) throw 'email already exists.';

    const InsertInfo = await userCollections.insertOne(newUser);
    if(InsertInfo.insertedCount === 0) throw 'Insert fail!';

    return await this.getUser(InsertInfo.insertedId);
}

async function getUserByUsername(username){
    if(username === undefined){
        throw 'input is empty';
    }

    const userCollections = await users();
    const target = await userCollections.findOne({ username: username });
    if(target === null) return undefined;

    return target;
}

async function getAll(){
    const patientCollections = await patient();
    const targets = await patientCollections.find({}).toArray();
    return targets;
}

async function remove(id) {
    if(id === undefined){
        throw 'input is empty';
    }
    if(id.constructor != ObjectID){
        if(id.constructor != String){
            throw 'Id is not a String!';
        }
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in data/patient.delpaient)'
        }
    }

    const patientCollections = await patient();
    const target = await this.getUser(id);

    const delinfo = await patientCollections.removeOne({ _id: id });
    if(delinfo.deletedCount === 0) throw 'Can not delete id: ' + id;

    return target;
}

async function update() {
    if(id === undefined){
        throw 'input is empty';
    }
    if(id.constructor != ObjectID){
        if(id.constructor != String){
            throw 'Id is not a String!';
        }
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in data/patient.updatepatient)'
        }
    }

    const patientCollections = await users();
    const target = await this.getUser(id);
    let changePWD = true;

    if(data.email == "" || data.email === undefined){
        data.email = target.email;
    }
    if(data.lname == "" || data.lname === undefined){
        data.lname = target.lname;
    }
    if(data.fname == "" || data.fname === undefined){
        data.fname = target.fname;
    }
    if(data.gender == "" || data.gender === undefined){
        data.gender = target.gender;
    }
    if(data.dob == "" || data.dob === undefined){
        data.dob = target.dob;
    }
    if(data.password == "" || data.password === undefined){
        data.password = target.password;
        changePWD = false;
    }

    if (changePWD) {
        data.password = await bcrypt.hash(data.password, saltRounds);
    }

    let updatedata = {
        $set:{
            _id: id,
            username: data.email,
            email: data.email,
            gender: data.gender,
            dob: data.dob,
            fname: data.fname,
            lname: data.lname,
            password: data.password
        }
    }

    const updateinfo = await patientCollections.updateOne({ _id: id } , updatedata);
    return await this.getUser(id);
}

module.exports = {
    getUser,
    getAll,
    getUserByUsername,
    addUser
};