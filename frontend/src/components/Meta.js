import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Plotavela | Real estate listings',
  description: 'Browse properties and find your next home with Plotavela.',
  keywords: 'Plotavela, real estate, houses, apartments',
}

export default Meta
