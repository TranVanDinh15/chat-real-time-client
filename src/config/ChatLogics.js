export const getSender = (loggerUser, user) => {
    console.log(user);
    return user[0].name === loggerUser?.user?.name ? user[1]?.name : user[0].name;
};
export const getSenderAvarta = (loggerUser, user) => {
    console.log(user);
    return user[0].name === loggerUser?.user?.name ? user[1]?.picture : user[0].picture;
};
export const getSenderFull = (loggerUser, user) => {
    console.log(user);
    return user[0].name === loggerUser?.user?.name ? user[1] : user[0];
};
export const isSameSender = (messages, cm, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== cm.sender._id || messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};
export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};
export const sameSenderMargin = (messages, m, i, userId) => {
    if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId) {
        return 29;
    } else if (
        (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    ) {
        return 0;
    } else return 'auto';
};
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
