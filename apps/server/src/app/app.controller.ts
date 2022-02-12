import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller("api/profile")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("current")
  getData() {
    return this.appService.getData();
  }
}
