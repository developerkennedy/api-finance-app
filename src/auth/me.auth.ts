import { MeController } from '../infra/http/controller/me.controller'

export function makeMeController(): MeController {
    return new MeController()
}
