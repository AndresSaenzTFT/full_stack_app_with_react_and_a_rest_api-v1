function ValidationErrors({ errors }) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className="validation--errors" role="alert">
      <h3>Validation Errors</h3>
      <ul>
        {errors.map((error, index) => (
          <li key={`${index}-${error}`}>{error}</li>
        ))}
      </ul>
    </div>
  )
}

export default ValidationErrors
