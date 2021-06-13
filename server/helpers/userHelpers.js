import User from '../users/user.model'

const isAnKnown = ( known, anUserId) => {
    return known.some( knownId => knownId == anUserId ) 
}


const notIsAnKnown = ( known, anUserId) => {
    return !isAnKnown(known,anUserId) 
}

const isSomeUser = (userId,otherUserID) => userId == otherUserID

const removeUserFrom = async (userId, userIdToRemove )=>{
    return await User.findByIdAndUpdate(userId,{ $pull: { 'known': userIdToRemove}},{useFindAndModify: false})
}

const addKnownTo = async (userId, userIdToAppend )=>{
    return await User.findByIdAndUpdate(userId,{ $addToSet: { 'known': userIdToAppend}},{useFindAndModify: false})
}

export {isAnKnown,notIsAnKnown,isSomeUser,removeUserFrom,addKnownTo}