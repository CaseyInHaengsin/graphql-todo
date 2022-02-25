import React from 'react'
import styled from 'styled-components'

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid blue;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default Loader
