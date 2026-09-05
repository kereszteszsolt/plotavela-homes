import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listPropertyDetails, updateProperty } from '../actions/propertyAction'
import { PROPERTY_UPDATE_RESET } from '../constants/propertyConstants'

const PropertyEditScreen = ({ match, history }) => {
  const propertyId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [nrOfBedrooms, setNrOfBedrooms] = useState(0)
  const [nrOfBathrooms, setNrOfBathrooms] = useState(0)
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const { userInfo } = useSelector((state) => state.userLogin)

  const dispatch = useDispatch()

  const propertyDetails = useSelector((state) => state.propertyDetails)
  const { loading, error, property } = propertyDetails

  const propertyUpdate = useSelector((state) => state.propertyUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = propertyUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PROPERTY_UPDATE_RESET })
      history.push('/admin/propertylist')
    } else {
      if (!property?.name || property._id !== propertyId) {
        dispatch(listPropertyDetails(propertyId))
      } else {
        setName(property.name)
        setPrice(property.price)
        setImage(property.image)
        setPropertyType(property.propertyType)
        setTransactionType(property.transactionType)
        setNrOfBathrooms(property.nrOfBathrooms)
        setNrOfBedrooms(property.nrOfBedrooms)
        setCity(property.city)
        setDistrict(property.district)
        setAddress(property.address)
        setDescription(property.description)
      }
    }
  }, [dispatch, history, propertyId, property, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadError('')
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Image upload failed')
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProperty({
        _id: propertyId,
        name,
        price,
        image,
        propertyType,
        transactionType,
        description,
        nrOfBedrooms,
        nrOfBathrooms,
        address,
        city,
        district
      })
    )
  }

  return (
    <>
      <Link to='/admin/propertylist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Property</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
              {uploadError && <Message variant='danger'>{uploadError}</Message>}
            </Form.Group>

            <Form.Group controlId='propertyType'>
              <Form.Label>Property Type</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Property Type'
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='nrOfBedrooms'>
              <Form.Label>Nr of bedrooms</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter nrOfBedrooms'
                value={nrOfBedrooms}
                onChange={(e) => setNrOfBedrooms(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='nrOfBathrooms'>
              <Form.Label>Nr of bathrooms</Form.Label>
              <Form.Control
                  type='number'
                  placeholder='Enter nrOfBathrooms'
                  value={nrOfBathrooms}
                  onChange={(e) => setNrOfBathrooms(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
              <Form.Label>City:</Form.Label>
              <Form.Control
                  type='text'
                  placeholder='Enter the city'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='district'>
              <Form.Label>District</Form.Label>
              <Form.Control
                  type='text'
                  placeholder='Enter the district'
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                  type='text'
                  placeholder='Enter the address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='transactionType'>
              <Form.Label>Transaction Type</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Transaction Type'
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default PropertyEditScreen
