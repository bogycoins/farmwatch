import db from '/database/models/index';

const User = db.user;

module.exports = {
  create(userData) {
    return User.create(userData)
        // .then(user => user)
        .catch(error => console.log(error));
  },
  find(userAddress) {
    return User.findOne({
      where: {address: userAddress},
    }).catch(error => {
      console.error(error);
    });
  },

};

/*
async function createUser(data) {
  try {
    // Check if user with that email if already exists
    const name = 'bogdan';
    const email = 'bogycoins@gmail.com';

    const user = await User.findOne({
      where: {address: userAddress},
    });
    if (user) {
      // return res.status(422).send(`User already exist with that ${email}`)
    }
    const newUser = await User.create({
      name,
      email,
      address: userAddress,
    });
    console.log(newUser);
  } catch (error) {
    console.error(error);
  }
}
*/
