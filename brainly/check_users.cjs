const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kanishklodha25_db_user:naG3yilxf0Vo0X9x@cluster0.agavqo6.mongodb.net/");

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    profilePicUrl: String
});

const UserModel = mongoose.model("User", UserSchema);

async function run() {
    const users = await UserModel.find({});
    console.log(users);
    process.exit(0);
}

run();
