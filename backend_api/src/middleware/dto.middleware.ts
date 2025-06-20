import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export function validationDTOMiddleware(type: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body)

    validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints
          }))
        })
      }
      req.body = dtoInstance // ensure it’s transformed
      next()
    })
  }
}
