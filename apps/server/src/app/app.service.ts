import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): {
    id: number;
    displayName: string;
} {
    // return { message: 'Welcome to server!' };
    return {
      id: 1,
      displayName: "test"
    }
  }
}
