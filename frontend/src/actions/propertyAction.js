import axios from 'axios'
import {
  PROPERTY_LIST_REQUEST,
  PROPERTY_LIST_SUCCESS,
  PROPERTY_LIST_FAIL,
  PROPERTY_DETAILS_REQUEST,
  PROPERTY_DETAILS_SUCCESS,
  PROPERTY_DETAILS_FAIL,
  PROPERTY_DELETE_SUCCESS,
  PROPERTY_DELETE_REQUEST,
  PROPERTY_DELETE_FAIL,
  PROPERTY_CREATE_REQUEST,
  PROPERTY_CREATE_SUCCESS,
  PROPERTY_CREATE_FAIL,
  PROPERTY_UPDATE_REQUEST,
  PROPERTY_UPDATE_SUCCESS,
  PROPERTY_UPDATE_FAIL,
  PROPERTY_CREATE_REVIEW_REQUEST,
  PROPERTY_CREATE_REVIEW_SUCCESS,
  PROPERTY_CREATE_REVIEW_FAIL,
  PROPERTY_TOP_REQUEST,
  PROPERTY_TOP_SUCCESS,
  PROPERTY_TOP_FAIL,
} from '../constants/propertyConstants'
import { logout } from './userActions'

export const listProperty = (keyword = '', pageNumber = '') => async (
  dispatch
) => {
  try {
    dispatch({ type: PROPERTY_LIST_REQUEST })

    const { data } = await axios.get(
      `/api/properties?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}`
    )

    dispatch({
      type: PROPERTY_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PROPERTY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROPERTY_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/properties/${id}`)

    dispatch({
      type: PROPERTY_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PROPERTY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteProperty = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROPERTY_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/properties/${id}`, config)

    dispatch({
      type: PROPERTY_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PROPERTY_DELETE_FAIL,
      payload: message,
    })
  }
}

export const createProperty = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROPERTY_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/properties`, {}, config)

    dispatch({
      type: PROPERTY_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PROPERTY_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateProperty = (property) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROPERTY_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/properties/${property._id}`,
      property,
      config
    )

    dispatch({
      type: PROPERTY_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: PROPERTY_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PROPERTY_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const createPropertyReview = (propertyId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PROPERTY_CREATE_REVIEW_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.post(`/api/properties/${propertyId}/reviews`, review, config)

    dispatch({
      type: PROPERTY_CREATE_REVIEW_SUCCESS,
    })
    dispatch(listPropertyDetails(propertyId))
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PROPERTY_CREATE_REVIEW_FAIL,
      payload: message,
    })
  }
}

export const listTopProperties = () => async (dispatch) => {
  try {
    dispatch({ type: PROPERTY_TOP_REQUEST })

    const { data } = await axios.get(`/api/properties/top`)

    dispatch({
      type: PROPERTY_TOP_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PROPERTY_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
