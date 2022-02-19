
const users = [];

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
         }
    }

    // Check for existing user
    if(users.some((user) => (user.room===room && user.username===username))) {
        return {
            error: 'Username is in user!'
         }
    }

    // Store the user
    const user = { id, username, room};
    users.push(user);
    return { user }         // return an object to be compatible with the error handling
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];              // splice returns an array of all removed elements 
    }
}

const getUser = (id) => {
    return users.find((user) => user.id===id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room===room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }