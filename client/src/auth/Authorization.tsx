import React from 'react'
import { Navigate } from 'react-router-dom'
import _ from 'lodash'


export const RequireAuth = ({ children, userInfo, group }: any) => {
  return !_.isEmpty(userInfo) && userInfo.group === group ? children : <Navigate to="/" />
}