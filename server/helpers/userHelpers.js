import User from '../users/user.model'

const isAnAcquaintance = ( acquaintances, anUserId) => {
    return acquaintances.some( acquaintancesId => acquaintancesId == anUserId ) 
}


const notIsAnAcquaintance = ( acquaintances, anUserId) => {
    return !isAnAcquaintance(acquaintances,anUserId) 
}

const isSomeUser = (userId,otherUserID) => userId == otherUserID

const removeUserFrom = async (userId, userIdToRemove )=>{
    return await User.findByIdAndUpdate(userId,{ $pull: { 'acquaintances': userIdToRemove}},{useFindAndModify: false})
}

const addAcquaintanceTo = async (userId, userIdToAppend )=>{
    return await User.findByIdAndUpdate(userId,{ $addToSet: { 'acquaintances': userIdToAppend}},{useFindAndModify: false})
}

export {isAnAcquaintance,notIsAnAcquaintance,isSomeUser,removeUserFrom,addAcquaintanceTo}