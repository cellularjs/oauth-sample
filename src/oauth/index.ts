import { CommonModule } from '$share/common';
import { Cell } from '@cellularjs/net';
import { TypeOrmModule } from '@cellularjs/typeorm';
import { UserEntity } from './$inner/user.data';
import { TokenEntity } from './$inner/token.data';
import { AppEntity } from './$inner/app.data';

@Cell({
  providers: ['./'],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature({
      entities: [
        UserEntity,
        TokenEntity,
        AppEntity,
      ],
    }),
  ],
  listen: './',
})
export class OAuth { }
