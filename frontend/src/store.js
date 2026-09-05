import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  propertyListReducer,
  propertyDetailsReducer,
  propertyDeleteReducer,
  propertyCreateReducer,
  propertyUpdateReducer,
  propertyReviewCreateReducer,
  propertyTopRatedReducer,
} from './reducers/propertyReducer'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers'

const reducer = combineReducers({
  propertyList: propertyListReducer,
  propertyDetails: propertyDetailsReducer,
  propertyDelete: propertyDeleteReducer,
  propertyCreate: propertyCreateReducer,
  propertyUpdate: propertyUpdateReducer,
  propertyReviewCreate: propertyReviewCreateReducer,
  propertyTopRated: propertyTopRatedReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
})

let userInfoFromStorage = null
try {
  const stored = JSON.parse(localStorage.getItem('userInfo'))
  if (stored && typeof stored === 'object' && typeof stored.token === 'string') {
    userInfoFromStorage = stored
  }
} catch {
  localStorage.removeItem('userInfo')
}

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
