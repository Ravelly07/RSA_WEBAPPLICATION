const usersList = [];

const joinUser = (id, username, room, pubkey) => {
  const newUser = { id, username, room, pubkey };
  usersList.push(newUser);
  console.log('Se ha agregado un nuevo usuario, se ha almacenado su llave publica');
  console.log(`Existen: ${usersList.length} usuarios en linea`);

  return newUser;
};

const getUserID = (id) => {
  return usersList.find((user) => user.id === id);
};

const userDisconnect = (id) => {
  const index = usersList.findIndex((user) => user.id === id);

  if (index !== -1) {
    return usersList.splice(index, 1)[0];
  }
};

module.exports = { joinUser, getUserID, userDisconnect, usersList };