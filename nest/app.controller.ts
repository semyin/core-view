import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api/hello')
  getHello(): Object {
    return {
        name: 'joe',
        age: 20
    }
  }
}