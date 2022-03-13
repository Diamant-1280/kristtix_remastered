import 'module-alias/register'
import { Config } from '@interfaces/Config'
import { ExtendedClient } from "@classes/Client"
export const client = new ExtendedClient()
client.start(process.env as Config)