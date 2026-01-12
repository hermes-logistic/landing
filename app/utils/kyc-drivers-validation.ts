export interface KycDriversData {
  numberOfDrivers: number
}

export interface ValidationError {
  field: string
  message: string
}

export function validateNumberOfDrivers(numberOfDrivers: number): ValidationError | null {
  if (numberOfDrivers < 1) {
    return {
      field: 'numberOfDrivers',
      message: 'Please add at least one driver'
    }
  }

  if (numberOfDrivers > 100) {
    return {
      field: 'numberOfDrivers',
      message: 'Maximum 100 drivers allowed'
    }
  }

  if (!Number.isInteger(numberOfDrivers)) {
    return {
      field: 'numberOfDrivers',
      message: 'Number of drivers must be a whole number'
    }
  }

  return null
}

export function validateKycDriversData(data: KycDriversData): ValidationError[] {
  const errors: ValidationError[] = []

  const numberOfDriversError = validateNumberOfDrivers(data.numberOfDrivers)
  if (numberOfDriversError) {
    errors.push(numberOfDriversError)
  }

  return errors
}
