const users = []

const addUser = ({ id, name, room}) => {
  if (!name || !room) return { error: 'Name or Room are required.' }
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => user.name === name && user.room === room)

  if (existingUser) return { error: 'User is taken.' }

  const user = { id, name, room }

  users.push(user)

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex(user => id === user.id)

  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => {
  console.log('id : ', id)
  console.log('users : ', users)
  const user = users.find((user) => user.id === id)
  console.log('user : ', user)
  return user
};

const getUsersInRoom = (room) => users.filter(user => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }