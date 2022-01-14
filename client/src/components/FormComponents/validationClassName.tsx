interface validationValues {
    error: string | undefined,
    touched: boolean | undefined
  }

const validationClassName = ({error, touched}: validationValues) => {
  if (error && touched) {
    return "form-control bg-danger-lightest border border-2 border-danger-light"
  } else {
    return "form-control"
  }
}

export default validationClassName